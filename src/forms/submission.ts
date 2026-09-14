/**
 * The one way a form's request is taken in (spec: Forms): checked, screened,
 * stored, and then emailed about — the same steps for every form, which each
 * brings only its definition to.
 *
 * 1. **Screened.** A request with the trap field filled in is refused, and so
 *    is one without the form's one-off token: neither came from the form a
 *    person used.
 * 2. **Checked** against the definition — the same rules the browser applied,
 *    applied again, because a request need not come from the browser.
 * 3. **Held back** when too many have come from one network address within the
 *    hour.
 * 4. **Stored**, once. The same request sent twice finds its token already
 *    stored and is answered as received, without a second record or a second
 *    email.
 * 5. **Emailed about**, after the visitor has their answer: an alert to the
 *    team and a confirmation to the applicant — or, while the form has no
 *    alert address, nothing at all. Whatever became of each email is written
 *    on the record, so a failure shows in the admin rather than nowhere.
 *
 * Server-only: it reaches the database and the mailbox.
 */
import { createHash } from 'node:crypto';
import config, { ADMIN_ROUTE } from '@payload-config';
import { getPayload } from 'payload';
import { payloadSecret } from '@/cms/environment';
import { siteOrigin } from '@/lib/environment';
import {
  fieldNames,
  NAME_PLACEHOLDER,
  TOKEN_FIELD,
  TRAP_FIELD,
  unacceptableFields,
  type Answers,
  type FormDefinition,
  type SubmissionOutcome,
} from './definition';
import { mailer, type Mail } from './mail';
import { publishedFormSettings, type FormSettings } from './settings';

/** Five requests an hour from one address: more than a person sends, and fewer than a bot wants to. */
export const REQUEST_LIMIT = { count: 5, withinMinutes: 60 } as const;

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type MailOutcome = 'sent' | 'skipped' | 'failed';

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

    const answers = Object.fromEntries(fieldNames(definition).map((name) => [name, textOf(data, name)])) as Answers<Field>;
    const invalid = unacceptableFields(definition, answers);
    if (invalid.length > 0) return { outcome: 'invalid', fields: invalid };

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

    const applicant = definition.applicant(answers);
    let stored: { id: number };
    try {
      stored = await payload.create({
        collection: 'form-submissions',
        data: {
          form: definition.id,
          name: applicant.name,
          email: applicant.email,
          phone: applicant.phone,
          answers: fieldNames(definition).map((name) => {
            const option = settings!.fields[name].options?.[answers[name]];
            return { field: name, label: settings!.fields[name].label, value: answers[name], option: option ?? null };
          }),
          token,
          sourceHash,
        },
      });
    } catch (error) {
      // The same request, stored by the attempt a moment before this one.
      if (await alreadyStored(token)) return received;
      throw error;
    }

    const kept = settings;
    later(() => sendMail(definition, kept, stored.id, answers));
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

/** The team's alert: every answer under the words the visitor saw, and the way to the record. */
function alertText<Field extends string>(
  definition: FormDefinition<Field>,
  settings: FormSettings<Field>,
  id: number,
  answers: Answers<Field>,
): string {
  const lines = fieldNames(definition).map((name) => {
    const wording = settings.fields[name];
    const answer = answers[name];
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
