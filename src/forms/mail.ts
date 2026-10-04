/**
 * How the site sends email, behind one small interface so that what sends it
 * can change without the submission pipeline noticing (spec: Forms).
 *
 * - **SendGrid** in production (ADR-0027), from the company's no-reply address
 *   on its own authenticated domain. The address is `MAIL_FROM`, and the key
 *   that may send from it `SENDGRID_API_KEY`, set in Vercel and never in the
 *   repository.
 * - **An outbox** for the test suite: each message written to a folder as a
 *   file (`MAIL_OUTBOX_DIR`), for the tests to read. Never on a deployment,
 *   where a message written to disk would be a message nobody receives.
 * - **Nothing**, where neither is set: a local machine, or a deployment before
 *   the key is supplied. The site works the same; the
 *   submission records that its mail was not sent.
 *
 * Server-only: it reads secrets.
 */
import { randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isPubliclyDeployed } from '../lib/environment';
import { LOCALES, type Locale } from '../lib/locales';

export type Mail = {
  readonly to: string;
  /** Where an answer to the message goes. */
  readonly replyTo?: string;
  readonly subject: string;
  /** Plain text. Sent as it is, and as HTML beside it laid out in its language's direction. */
  readonly text: string;
  /** The language it is written in: the direction its HTML is laid out in, and the name it is sent under. */
  readonly locale: Locale;
};

/** Who the mail is from, in each language: the company's name as that language writes it. */
const SENDER: Readonly<Record<Locale, string>> = { ar: 'ربائد', en: 'Rabaed' };

export type Mailer = {
  send(mail: Mail): Promise<void>;
};

/** What the site sends mail with, or `null` when it has nothing to send it with. */
export function mailer(): Mailer | null {
  const outbox = process.env.MAIL_OUTBOX_DIR;
  if (outbox && !isPubliclyDeployed()) return outboxMailer(outbox);

  const from = process.env.MAIL_FROM;
  const key = process.env.SENDGRID_API_KEY;
  if (from && key) return sendGridMailer(from, key);
  if (from || key) {
    throw new Error(`Email is half configured: ${from ? 'SENDGRID_API_KEY' : 'MAIL_FROM'} is missing. Set both, or neither.`);
  }
  return null;
}

function outboxMailer(directory: string): Mailer {
  return {
    async send(mail) {
      await mkdir(directory, { recursive: true });
      // Written whole under another name, then renamed into place: a test
      // reading the outbox never finds a message half written.
      const file = path.join(directory, `${Date.now()}-${randomUUID()}.json`);
      await writeFile(`${file}.partial`, JSON.stringify(mail, null, 2));
      await rename(`${file}.partial`, file);
    },
  };
}

/**
 * Where SendGrid's API answers. Only the test suite sets `SENDGRID_API_ORIGIN`,
 * to a stand-in on its own machine (`tests/unit/sendgrid-mail.spec.ts`); a
 * deployment never does.
 */
function sendGridOrigin(): string {
  return process.env.SENDGRID_API_ORIGIN || 'https://api.sendgrid.com';
}

/**
 * SendGrid's v3 `mail/send`, over HTTPS. It answers 202 once it has taken the
 * message; anything else is a refusal, thrown in SendGrid's own words so the
 * submission records the email as failed and the log says why.
 *
 * Tracking is switched off whatever the account says: click tracking would
 * rewrite the alert's link to the record through SendGrid's address, open
 * tracking hides an image in the message that reports when it is read, and
 * subscription tracking adds an unsubscribe link to mail nobody subscribed to.
 */
function sendGridMailer(from: string, key: string): Mailer {
  return {
    async send(mail) {
      const response = await fetch(`${sendGridOrigin()}/v3/mail/send`, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: mail.to }] }],
          from: { email: from, name: SENDER[mail.locale] },
          ...(mail.replyTo ? { reply_to: { email: mail.replyTo } } : {}),
          subject: mail.subject,
          // Plain text first: SendGrid refuses the two in any other order.
          content: [
            { type: 'text/plain', value: mail.text },
            { type: 'text/html', value: inDirection(mail.text, mail.locale) },
          ],
          tracking_settings: {
            click_tracking: { enable: false, enable_text: false },
            open_tracking: { enable: false },
            subscription_tracking: { enable: false },
          },
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status !== 202) {
        throw new Error(`SendGrid refused the message (${response.status}): ${await response.text()}`);
      }
    },
  };
}

/** The text as HTML that a mail client lays out in its language's direction, line breaks kept. */
function inDirection(text: string, locale: Locale): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const dir = LOCALES[locale].dir;
  const align = dir === 'rtl' ? 'right' : 'left';
  return `<div dir="${dir}" style="text-align:${align};font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;white-space:pre-line">${escaped}</div>`;
}
