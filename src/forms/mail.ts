/**
 * How the site sends email, behind one small interface so that what sends it
 * can change without the submission pipeline noticing (spec: Forms).
 *
 * - **Microsoft 365** in production: the company's existing no-reply mailbox,
 *   over SMTP with its own account (spec: Stack and hosting). Its address and
 *   password are `MAIL_USER` and `MAIL_PASSWORD`, set in Vercel and never in
 *   the repository.
 * - **An outbox** for the test suite: each message written to a folder as a
 *   file (`MAIL_OUTBOX_DIR`), for the tests to read. Never on a deployment,
 *   where a message written to disk would be a message nobody receives.
 * - **Nothing**, where neither is set: a local machine, or a deployment before
 *   the mailbox's credentials are supplied. The site works the same; the
 *   submission records that its mail was not sent.
 *
 * Server-only: it reads secrets.
 */
import { randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
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

  const user = process.env.MAIL_USER;
  const password = process.env.MAIL_PASSWORD;
  if (user && password) return microsoft365Mailer(user, password);
  if (user || password) {
    throw new Error(`Email is half configured: ${user ? 'MAIL_PASSWORD' : 'MAIL_USER'} is missing. Set both, or neither.`);
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

let transport: { user: string; transporter: Transporter } | null = null;

/**
 * Microsoft 365's SMTP submission endpoint: port 587, upgraded to TLS before
 * the password is sent, and refused if it cannot be. The mailbox needs
 * "Authenticated SMTP" switched on for its account (see "Email" in
 * `docs/deployment.md`).
 */
function microsoft365Mailer(user: string, password: string): Mailer {
  if (transport?.user !== user) {
    transport = {
      user,
      transporter: nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user, pass: password },
      }),
    };
  }
  const { transporter } = transport;

  return {
    async send(mail) {
      await transporter.sendMail({
        from: { name: SENDER[mail.locale], address: user },
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: inDirection(mail.text, mail.locale),
      });
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
