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
 *    hour.
 * 4. **Stored**, once: its documents to private storage first, then the
 *    record that points at them. The same request sent twice finds its token
 *    already stored and is answered as received, without a second record or a
 *    second email.
 * 5. **Emailed about**, after the visitor has their answer: an alert to the
 *    team and a confirmation to the applicant — or, while the form has no
 *    alert address, nothing at all. Whatever became of each email is written
 *    on the record, so a failure shows in the admin rather than nowhere.
 *
 * Server-only: it reaches the database, the mailbox and private storage.
 */
import { createHash, randomUUID } from 'node:crypto';
import config, { ADMIN_ROUTE } from '@payload-config';
import { getPayload } from 'payload';
import { payloadSecret } from '@/cms/environment';
import { siteOrigin } from '@/lib/environment';
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
  type SubmissionOutcome,
} from './definition';
import { DOCUMENT_EXTENSIONS, documentContentType, documentStore } from './documents';
import { mailer, type Mail } from './mail';
import { publishedFormSettings, type FormSettings } from './settings';

/** Five requests an hour from one address: more than a person sends, and fewer than a bot wants to. */
export const REQUEST_LIMIT = { count: 5, withinMinutes: 60 } as const;

/** The most a request may carry: three documents at their largest, and the rest of the form. */
export const REQUEST_BYTES_LIMIT = 3 * DOCUMENTS.maxBytes + 1024 * 1024;

/** How a consent is recorded on the submission. */
const CONSENT_RECORDED = 'accepted';

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type MailOutcome = 'sent' | 'skipped' | 'failed';

/** A document that passed its checks, ready to keep. */
type Upload = { field: string; fileName: string; contentType: string; bytes: Uint8Array };

/** Runs work once the visitor has been answered (`after`, from `next/server`). */
export type Later = (task: () => Promise<void>) => void;

export async function submit<Field extends string>(
  definition: FormDefinition<Field>,
  data: FormData,
  source: { readonly address: string },
  later: Later,
): Promise<SubmissionOutcome> {
  let settings: FormSettings<Field> | null = null;
  try {
    settings = await publishedFormSettings(definition);

    const token = textOf(data, TOKEN_FIELD);
    if (textOf(data, TRAP_FIELD) !== '' || !TOKEN.test(token)) {
      return { outcome: 'refused', message: settings.refused };
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

    const received: SubmissionOutcome = { outcome: 'received', message: settings.received };
    const payload = await getPayload({ config });
    if (await alreadyStored(token)) return received;

    const sourceHash = createHash('sha256').update(`${payloadSecret()}:${source.address}`).digest('hex');
    const since = new Date(Date.now() - REQUEST_LIMIT.withinMinutes * 60_000).toISOString();
    const { totalDocs: recent } = await payload.count({
      collection: 'form-submissions',
      where: { and: [{ sourceHash: { equals: sourceHash } }, { createdAt: { greater_than: since } }] },
    });
    if (recent >= REQUEST_LIMIT.count) return { outcome: 'refused', message: settings.refused };

    const store = uploads.length > 0 ? documentStore() : null;
    if (uploads.length > 0 && !store) {
      throw new Error('There is no private storage for applicant documents: set S3_DOCUMENTS_BUCKET. See "The CMS" in docs/deployment.md.');
    }

    const applicant = definition.applicant(answers);
    // The settings as read, held where the callbacks below can see them non-null.
    const published = settings;
    const kept: { field: string; label: string; fileName: string; contentType: string; size: number; key: string }[] = [];
    let stored: { id: number };
    try {
      const month = new Date().toISOString().slice(0, 7);
      for (const upload of uploads) {
        const key = `${definition.id}/${month}/${token}/${upload.field}-${randomUUID()}.${DOCUMENT_EXTENSIONS[upload.contentType]}`;
        await store!.put(key, upload.bytes, upload.contentType);
        kept.push({
          field: upload.field,
          label: published.fields[upload.field as Field].label,
          fileName: upload.fileName,
          contentType: upload.contentType,
          size: upload.bytes.byteLength,
          key,
        });
      }
      stored = await payload.create({
        collection: 'form-submissions',
        data: {
          form: definition.id,
          name: applicant.name,
          email: applicant.email,
          phone: applicant.phone,
          answers: names.map((name) => ({
            field: name,
            label: published.fields[name].label,
            value: definition.fields[name].kind === 'consent' ? CONSENT_RECORDED : answers[name],
            option: published.fields[name].options?.[answers[name]] ?? null,
          })),
          documents: kept,
          token,
          sourceHash,
        },
      });
    } catch (error) {
      await store?.remove(kept.map((document) => document.key)).catch(() => {});
      // The same request, stored by the attempt a moment before this one.
      if (await alreadyStored(token)) return received;
      throw error;
    }

    later(() => sendMail(definition, published, stored.id, answers));
    return received;
  } catch (error) {
    console.error(`The ${definition.id} form could not take a request in:`, error);
    return { outcome: 'failed', message: settings?.failed ?? definition.wording.failed };
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

async function sendMail<Field extends string>(
  definition: FormDefinition<Field>,
  settings: FormSettings<Field>,
  id: number,
  answers: Answers<Field>,
): Promise<void> {
  const applicant = definition.applicant(answers);
  let alert: MailOutcome = 'skipped';
  let confirmation: MailOutcome = 'skipped';

  if (settings.alertAddress) {
    alert = await deliver({
      to: settings.alertAddress,
      replyTo: applicant.email,
      subject: `${definition.title.ar} — ${applicant.name}`,
      text: alertText(definition, settings, id, answers),
    });
    confirmation = await deliver({
      to: applicant.email,
      subject: settings.confirmationSubject,
      text: settings.confirmationBody.replaceAll(NAME_PLACEHOLDER, applicant.name),
    });
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

/**
 * The team's alert: every answer under the words the visitor saw, and the way
 * to the record. Documents are named, never attached: they are opened from the
 * record, by a signed-in editor.
 */
function alertText<Field extends string>(
  definition: FormDefinition<Field>,
  settings: FormSettings<Field>,
  id: number,
  answers: Answers<Field>,
): string {
  const lines = fieldNames(definition).map((name) => {
    const wording = settings.fields[name];
    const answer = answers[name];
    if (definition.fields[name].kind === 'consent') return `${wording.label}: ${answer === CONSENT_GIVEN ? 'موافق' : '—'}`;
    return `${wording.label}: ${wording.options?.[answer] ?? (answer || '—')}`;
  });
  const sentAt = new Intl.DateTimeFormat('ar-u-nu-latn', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  return [
    `وصل طلب جديد من نموذج «${definition.title.ar}».`,
    '',
    ...lines,
    '',
    `وقت الإرسال: ${sentAt} بتوقيت الرياض`,
    `الطلب في لوحة التحرير: ${siteOrigin()}${ADMIN_ROUTE}/collections/form-submissions/${id}`,
    '',
    'للرد على مقدّم الطلب، أجب على هذه الرسالة.',
  ].join('\n');
}
