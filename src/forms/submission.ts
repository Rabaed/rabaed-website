/**
 * The one way a form's request is taken in (spec: Forms): checked, screened,
 * stored, and then emailed about — the same steps for every form, which each
 * brings only its definition to.
 *
 * 1. **Screened.** A request with the trap field filled in is refused, and so
 *    is one without the form's one-off token: neither came from the form a
 *    person used.
 * 2. **Checked** against the definition — the same rules the browser applied,
 *    applied again, because a request need not come from the browser. A
 *    document is checked by its size and by its contents, not its name.
 * 3. **Held back** when too many have come from one network address within the
 *    hour — counted one request from an address at a time, so that requests
 *    sent together cannot all count the same few before them.
 * 4. **Stored**, once: its documents to private storage first, then the
 *    record that points at them. The same request sent twice finds its token
 *    already stored and is answered as received, without a second record or a
 *    second email.
 * 5. **Emailed about**, after the visitor has their answer: an alert to the
 *    team and a confirmation to the applicant — or, while the form has no
 *    alert address, nothing at all. The confirmation goes to whatever address
 *    was typed, so it is sent only within `CONFIRMATION_LIMIT`, and greets the
 *    applicant by name only when the name reads as one (ticket 81, ADR-0022).
 *    Whatever became of each email is written on the record, so a failure
 *    shows in the admin rather than nowhere.
 *
 * **In the language the form was filled in** (ticket 42): the visitor is
 * answered, and the confirmation written, in their language. The team's side
 * — the record in the admin and the alert — stays in Arabic, the language the
 * team works in, and says which language the applicant used, so a reply goes
 * back in it.
 *
 * Server-only: it reaches the database, the mailbox and private storage.
 */
import { createHash, randomUUID } from 'node:crypto';
import config, { ADMIN_ROUTE } from '@payload-config';
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';
import { getPayload, type Payload, type PayloadRequest } from 'payload';
import { payloadSecret } from '@/cms/environment';
import { siteOrigin } from '@/lib/environment';
import type { Locale } from '@/lib/locales';
import {
  CONSENT_GIVEN,
  DOCUMENTS,
  documentProblem,
  fieldNames,
  NAME_PLACEHOLDER,
  TOKEN_FIELD,
  TRAP_FIELD,
  unacceptableFields,
  type Answers,
  type DocumentProblem,
  type FieldDefinition,
  type FormDefinition,
  type FormWording,
  type SubmissionOutcome,
} from './definition';
import { DOCUMENT_EXTENSIONS, documentContentType, documentStore } from './documents';
import { mailer, type Mail } from './mail';
import { publishedFormSettings, type FormSettings } from './settings';

/** Five requests an hour from one address: more than a person sends, and fewer than a bot wants to. */
export const REQUEST_LIMIT = { count: 5, withinMinutes: 60 } as const;

/**
 * How many confirmations the site sends (ticket 81, ADR-0022). A confirmation
 * goes to whatever address was typed, so without a limit the forms would be a
 * way to have Rabaed's mailbox write to a stranger as often as a script liked.
 * Three a day to one address, whatever form it came from and however it is
 * cased; thirty an hour from the whole site. A request past either is stored
 * and alerted all the same, and only its confirmation is withheld.
 */
export const CONFIRMATION_LIMIT = {
  toOneAddress: { count: 3, withinHours: 24 },
  fromTheSite: { count: 30, withinHours: 1 },
} as const;

/**
 * The longest a request waits for another from the same place to be counted
 * and stored before it (`oneAtATime`). Either takes milliseconds; a wait this
 * long means something is wrong, and the request fails rather than queueing.
 */
const LOCK_WAIT = '5s';

/** The longest name a confirmation greets its visitor by (ticket 81). */
const GREETING_NAME_MAX = 60;

/** The most a request may carry: three documents at their largest, and the rest of the form. */
export const REQUEST_BYTES_LIMIT = 3 * DOCUMENTS.maxBytes + 1024 * 1024;

/** How a consent is recorded on the submission. */
const CONSENT_RECORDED = 'accepted';

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type MailOutcome = 'sent' | 'skipped' | 'failed';

/** What became of a confirmation: a mail's outcome, or withheld at the limit (`CONFIRMATION_LIMIT`). */
type ConfirmationOutcome = MailOutcome | 'withheld';

/** A document that passed its checks, ready to keep. */
type Upload = { field: string; fileName: string; contentType: string; bytes: Uint8Array };

/** Runs work once the visitor has been answered (`after`, from `next/server`). */
export type Later = (task: () => Promise<void>) => void;

export async function submit<Field extends string>(
  definition: FormDefinition<Field>,
  data: FormData,
  source: { readonly address: string; readonly locale: Locale },
  later: Later,
): Promise<SubmissionOutcome> {
  const { locale } = source;
  let settings: FormSettings<Field> | null = null;
  try {
    settings = await publishedFormSettings(definition);
    /** What the visitor is told, in their language. */
    const reply = settings.wording[locale];

    const token = textOf(data, TOKEN_FIELD);
    if (textOf(data, TRAP_FIELD) !== '' || !TOKEN.test(token)) {
      return { outcome: 'refused', message: reply.refused };
    }

    const names = fieldNames(definition);
    const answers = Object.fromEntries(names.map((name) => [name, answerOf(definition.fields[name], data, name)])) as Answers<Field>;

    const problems: Partial<Record<Field, DocumentProblem>> = {};
    const uploads: Upload[] = [];
    for (const name of names) {
      if (definition.fields[name].kind !== 'document') continue;
      const file = fileOf(data, name);
      if (!file) continue;
      const problem = documentProblem(file);
      if (problem) {
        problems[name] = problem;
        continue;
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const contentType = documentContentType(bytes);
      if (!contentType) {
        problems[name] = 'wrongType';
        continue;
      }
      uploads.push({ field: name, fileName: file.name, contentType, bytes });
    }

    const invalid = [...new Set([...unacceptableFields(definition, answers), ...(Object.keys(problems) as Field[])])];
    if (invalid.length > 0) {
      return Object.keys(problems).length > 0
        ? { outcome: 'invalid', fields: invalid, problems: problems as Record<string, DocumentProblem> }
        : { outcome: 'invalid', fields: invalid };
    }

    const received: SubmissionOutcome = { outcome: 'received', message: reply.received };
    const payload = await getPayload({ config });
    if (await alreadyStored(token)) return received;

    const sourceHash = createHash('sha256').update(`${payloadSecret()}:${source.address}`).digest('hex');
    // Counted here, before any document is uploaded, so an address already at
    // its limit sends nothing to storage; and again as it is stored (below),
    // which is the count that holds when requests arrive together.
    if (await atRequestLimit(payload, sourceHash)) return { outcome: 'refused', message: reply.refused };

    const store = uploads.length > 0 ? documentStore() : null;
    if (uploads.length > 0 && !store) {
      throw new Error('There is no private storage for applicant documents: set S3_DOCUMENTS_BUCKET. See "The CMS" in docs/deployment.md.');
    }

    const applicant = definition.applicant(answers);
    // The settings as read, held where the callbacks below can see them non-null.
    const published = settings;
    // The record is the team's, and names each answer as the Arabic form does.
    const team = published.wording.ar;
    const kept: { field: string; label: string; fileName: string; contentType: string; size: number; key: string }[] = [];
    let stored: { id: number } | null;
    try {
      const month = new Date().toISOString().slice(0, 7);
      for (const upload of uploads) {
        const key = `${definition.id}/${month}/${token}/${upload.field}-${randomUUID()}.${DOCUMENT_EXTENSIONS[upload.contentType]}`;
        await store!.put(key, upload.bytes, upload.contentType);
        kept.push({
          field: upload.field,
          label: team.fields[upload.field as Field].label,
          fileName: upload.fileName,
          contentType: upload.contentType,
          size: upload.bytes.byteLength,
          key,
        });
      }
      const record = {
        form: definition.id,
        locale,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        answers: names.map((name) => ({
          field: name,
          label: team.fields[name].label,
          value: definition.fields[name].kind === 'consent' ? CONSENT_RECORDED : answers[name],
          option: team.fields[name].options?.[answers[name]] ?? null,
        })),
        documents: kept,
        token,
        sourceHash,
      };
      // Counted and stored one request from an address at a time, so eight sent
      // together cannot each count the same four before them (ticket 81).
      stored = await oneAtATime(payload, `form-requests:${sourceHash}`, async (req) =>
        (await atRequestLimit(payload, sourceHash, req))
          ? null
          : payload.create({ collection: 'form-submissions', data: record, req }),
      );
    } catch (error) {
      await store?.remove(kept.map((document) => document.key)).catch(() => {});
      // The same request, stored by the attempt a moment before this one.
      if (await alreadyStored(token)) return received;
      throw error;
    }

    if (!stored) {
      // Past the limit only once its documents were kept: they go too.
      await store?.remove(kept.map((document) => document.key)).catch(() => {});
      return { outcome: 'refused', message: reply.refused };
    }
    const { id } = stored;
    later(() => sendMail(definition, published, id, answers, locale));
    return received;
  } catch (error) {
    console.error(`The ${definition.id} form could not take a request in:`, error);
    return { outcome: 'failed', message: (settings?.wording ?? definition.wording)[locale].failed };
  }
}

/** A form entry as text, trimmed; anything else — a file, nothing — as empty. */
function textOf(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/** A document the form sent, or `null` for none: an empty file input sends a nameless, empty file. */
function fileOf(data: FormData, name: string): File | null {
  const value = data.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

function answerOf(field: FieldDefinition, data: FormData, name: string): string {
  if (field.kind === 'document') return fileOf(data, name)?.name ?? '';
  if (field.kind === 'consent') return textOf(data, name) === '' ? '' : CONSENT_GIVEN;
  return textOf(data, name);
}

async function alreadyStored(token: string): Promise<boolean> {
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.count({ collection: 'form-submissions', where: { token: { equals: token } } });
  return totalDocs > 0;
}

/** Whether the network address hashed as `sourceHash` has sent `REQUEST_LIMIT` requests already this hour. */
async function atRequestLimit(payload: Payload, sourceHash: string, req?: Partial<PayloadRequest>): Promise<boolean> {
  const since = new Date(Date.now() - REQUEST_LIMIT.withinMinutes * 60_000).toISOString();
  const { totalDocs } = await payload.count({
    collection: 'form-submissions',
    where: { and: [{ sourceHash: { equals: sourceHash } }, { createdAt: { greater_than: since } }] },
    req,
  });
  return totalDocs >= REQUEST_LIMIT.count;
}

/**
 * Runs `work` in a transaction holding `key`'s lock, so that one request at a
 * time counts and then writes: a second with the same key waits until the
 * first's write is committed, and counts it. The lock is the database's, so it
 * holds across every instance of the site; it is let go when the transaction
 * ends, and `work` gets the request that runs Payload inside it.
 *
 * Held for a count and a write, never while documents upload: each request
 * waiting for it holds a database connection as it waits (ADR-0022).
 */
async function oneAtATime<T>(
  payload: Payload,
  key: string,
  work: (req: Partial<PayloadRequest>, db: PostgresAdapter['sessions'][string]['db']) => Promise<T>,
): Promise<T> {
  const adapter = payload.db as unknown as PostgresAdapter;
  const transactionID = await adapter.beginTransaction();
  if (transactionID === null) throw new Error('The database adapter runs without transactions, which the form limits need.');
  const { db } = adapter.sessions[String(transactionID)];
  try {
    await db.execute(sql.raw(`SET LOCAL lock_timeout = '${LOCK_WAIT}'`));
    await db.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${key}))`);
    const result = await work({ transactionID }, db);
    await adapter.commitTransaction(transactionID);
    return result;
  } catch (error) {
    await adapter.rollbackTransaction(transactionID);
    throw error;
  }
}

/**
 * Whether submission `id` may confirm to `email` under `CONFIRMATION_LIMIT`,
 * and if so, its claim to: its record is marked sending before the mail goes,
 * so the next request counts it, and what became of the mail replaces the mark
 * afterwards. A confirmation that failed was tried, and is counted too.
 *
 * Counted in SQL rather than through Payload so that the address is compared
 * without case, one site-wide lock at a time. Withheld when it cannot be
 * counted: a confirmation not sent is the safe way to be wrong.
 */
async function mayConfirm(id: number, email: string): Promise<boolean> {
  const { toOneAddress, fromTheSite } = CONFIRMATION_LIMIT;
  try {
    const payload = await getPayload({ config });
    return await oneAtATime(payload, 'form-confirmations', async (req, db) => {
      const { rows } = await db.execute<{ to_address: number; from_site: number }>(sql`
        SELECT
          count(*) FILTER (
            WHERE lower("email") = lower(${email}) AND "created_at" > now() - make_interval(hours => ${toOneAddress.withinHours})
          )::int AS to_address,
          count(*) FILTER (WHERE "created_at" > now() - make_interval(hours => ${fromTheSite.withinHours}))::int AS from_site
        FROM "form_submissions"
        WHERE "confirmation" IN ('sending', 'sent', 'failed')
      `);
      const [counted] = rows;
      if (counted.to_address >= toOneAddress.count || counted.from_site >= fromTheSite.count) return false;
      await payload.update({ collection: 'form-submissions', id, data: { confirmation: 'sending' }, req });
      return true;
    });
  } catch (error) {
    console.error(`Submission ${id}: its confirmation could not be counted, and is withheld:`, error);
    return false;
  }
}

/**
 * A confirmation's words with the visitor's name in the placeholder's place —
 * when what they typed reads as a name (ticket 81, ADR-0022). The name field
 * takes anything two letters long, so a "name" can be an advert with a link in
 * it, and the greeting would be Rabaed's mailbox sending it. So a name longer
 * than `GREETING_NAME_MAX`, or with a digit in any script, an «@», a link or a
 * web address in it, is left out with the space before it: «مرحباً،»,
 * "Hello,". An engineer's «م.» before a name is not a web address.
 */
function greeted(body: string, placeholder: string, name: string): string {
  const aName = name.length <= GREETING_NAME_MAX && !/[\p{Nd}@<>]|:\/\/|www\.|[\p{L}\p{N}-]\.[a-z]{2,}/iu.test(name);
  if (aName) return body.replaceAll(placeholder, name);
  const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return body.replace(new RegExp(`[^\\S\\n]*${escaped}`, 'g'), '');
}

async function sendMail<Field extends string>(
  definition: FormDefinition<Field>,
  settings: FormSettings<Field>,
  id: number,
  answers: Answers<Field>,
  locale: Locale,
): Promise<void> {
  const applicant = definition.applicant(answers);
  const confirmed = settings.wording[locale];
  let alert: MailOutcome = 'skipped';
  let confirmation: ConfirmationOutcome = 'skipped';

  if (settings.alertAddress) {
    alert = await deliver({
      to: settings.alertAddress,
      replyTo: applicant.email,
      subject: `${definition.title.ar} — ${applicant.name}`,
      text: alertText(definition, settings.wording.ar, id, answers, locale),
      locale: 'ar',
    });
    confirmation = (await mayConfirm(id, applicant.email))
      ? await deliver({
          to: applicant.email,
          subject: confirmed.confirmationSubject,
          text: greeted(confirmed.confirmationBody, NAME_PLACEHOLDER[locale], applicant.name),
          locale,
        })
      : 'withheld';
  }

  try {
    const payload = await getPayload({ config });
    await payload.update({ collection: 'form-submissions', id, data: { alert, confirmation } });
  } catch (error) {
    console.error(`Submission ${id}: what became of its email could not be recorded:`, error);
  }
}

async function deliver(mail: Mail): Promise<MailOutcome> {
  try {
    const send = mailer();
    if (!send) {
      console.warn('An email was not sent: no mailbox is configured (MAIL_USER, MAIL_PASSWORD).');
      return 'skipped';
    }
    await send.send(mail);
    return 'sent';
  } catch (error) {
    console.error('An email could not be sent:', error);
    return 'failed';
  }
}

/** How the alert names the language a form was filled in, where it was not the team's own. */
const FILLED_IN: Readonly<Record<Locale, string | null>> = { ar: null, en: 'الإنجليزية' };

/**
 * The team's alert, in Arabic: every answer under the words the Arabic form
 * gives it, and the way to the record — and, for a form filled in another
 * language, which one, so the reply goes back in it. Documents are named,
 * never attached: they are opened from the record, by a signed-in editor.
 */
function alertText<Field extends string>(
  definition: FormDefinition<Field>,
  team: FormWording<Field>,
  id: number,
  answers: Answers<Field>,
  locale: Locale,
): string {
  const lines = fieldNames(definition).map((name) => {
    const wording = team.fields[name];
    const answer = answers[name];
    if (definition.fields[name].kind === 'consent') return `${wording.label}: ${answer === CONSENT_GIVEN ? 'موافق' : '—'}`;
    return `${wording.label}: ${wording.options?.[answer] ?? (answer || '—')}`;
  });
  const sentAt = new Intl.DateTimeFormat('ar-u-nu-latn', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  const language = FILLED_IN[locale];
  return [
    `وصل طلب جديد من نموذج «${definition.title.ar}».`,
    ...(language ? [`مُلئ النموذج بـ${language}، فالرد على مقدّمه بها.`] : []),
    '',
    ...lines,
    '',
    `وقت الإرسال: ${sentAt} بتوقيت الرياض`,
    `الطلب في لوحة التحرير: ${siteOrigin()}${ADMIN_ROUTE}/collections/form-submissions/${id}`,
    '',
    'للرد على مقدّم الطلب، أجب على هذه الرسالة.',
  ].join('\n');
}
