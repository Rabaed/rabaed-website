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
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
import { isPubliclyDeployed } from '../lib/environment';

export type Mail = {
  readonly to: string;
  /** Where an answer to the message goes. */
  readonly replyTo?: string;
  readonly subject: string;
  /** Plain text. Sent as it is, and as right-to-left HTML beside it. */
  readonly text: string;
};

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
      await writeFile(path.join(directory, `${Date.now()}-${randomUUID()}.json`), JSON.stringify(mail, null, 2));
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
        from: { name: 'ربائد', address: user },
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: rightToLeft(mail.text),
      });
    },
  };
}

/** The text as HTML that a mail client lays out right to left, line breaks kept. */
function rightToLeft(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<div dir="rtl" style="text-align:right;font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;white-space:pre-line">${escaped}</div>`;
}
