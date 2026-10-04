/**
 * The mail adapter's SendGrid side (ADR-0027): what the site hands SendGrid
 * when a form's alert or confirmation is sent, and what it makes of a refusal.
 *
 * Asked of `mailer()` itself, against a stand-in for SendGrid's API on this
 * machine (`SENDGRID_API_ORIGIN`, which only a test sets), because the forms'
 * own suites send nothing: they read the outbox (`MAIL_OUTBOX_DIR`), and a
 * deployment is the only other place the adapter runs. Each expected request
 * is written out by hand from SendGrid's v3 `mail/send` reference.
 */
import { createServer, type IncomingHttpHeaders } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test, expect } from '@playwright/test';
import { mailer } from '../../src/forms/mail';

type Received = { method?: string; url?: string; headers: IncomingHttpHeaders; body: unknown };

/** SendGrid's API as far as the adapter sees it: one answer, and every request kept. */
async function fakeSendGrid(status: number, answer = '') {
  const received: Received[] = [];
  const server = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => {
      received.push({ method: request.method, url: request.url, headers: request.headers, body: JSON.parse(body) });
      response.writeHead(status, { 'content-type': 'application/json', connection: 'close' }).end(answer);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return { origin: `http://127.0.0.1:${port}`, received, close: () => new Promise((resolve) => server.close(resolve)) };
}

/** The environment of a deployment configured for SendGrid, pointed at the stand-in. */
function configured(origin: string) {
  delete process.env.MAIL_OUTBOX_DIR;
  delete process.env.VERCEL_ENV;
  process.env.SENDGRID_API_KEY = 'SG.test-key';
  process.env.MAIL_FROM = 'noreply@rabaedapp.com';
  process.env.SENDGRID_API_ORIGIN = origin;
}

test('an alert is handed to SendGrid from the company, laid out in its language, with no tracking added', async () => {
  const sendGrid = await fakeSendGrid(202);
  configured(sendGrid.origin);

  await mailer()!.send({
    to: 'team@example.com',
    replyTo: 'applicant@example.com',
    subject: 'طلب جديد',
    text: 'سطر أول\nسطر <ثانٍ>',
    locale: 'ar',
  });
  await mailer()!.send({ to: 'applicant@example.com', subject: 'We have your request', text: 'Hello,', locale: 'en' });
  await mailer()!.send({ to: 'team@example.com', subject: 'طلب جديد', text: 'نص', html: '<!doctype html><p>جدول</p>', locale: 'ar' });
  await sendGrid.close();

  expect(sendGrid.received).toHaveLength(3);
  const [alert, confirmation, laidOut] = sendGrid.received;
  expect(alert.method).toBe('POST');
  expect(alert.url).toBe('/v3/mail/send');
  expect(alert.headers.authorization).toBe('Bearer SG.test-key');
  // Tracking off: click tracking would rewrite the alert's link to the record
  // through SendGrid's own address, and open tracking adds a hidden image
  // that reports when the message is read.
  const untracked = {
    click_tracking: { enable: false, enable_text: false },
    open_tracking: { enable: false },
    subscription_tracking: { enable: false },
  };
  expect(alert.body).toEqual({
    personalizations: [{ to: [{ email: 'team@example.com' }] }],
    from: { email: 'noreply@rabaedapp.com', name: 'ربائد' },
    reply_to: { email: 'applicant@example.com' },
    subject: 'طلب جديد',
    content: [
      { type: 'text/plain', value: 'سطر أول\nسطر <ثانٍ>' },
      {
        type: 'text/html',
        value:
          '<div dir="rtl" style="text-align:right;font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8">سطر أول<br>سطر &lt;ثانٍ&gt;</div>',
      },
    ],
    tracking_settings: untracked,
  });
  // No answer address asked for, none sent.
  expect(confirmation.body).toEqual({
    personalizations: [{ to: [{ email: 'applicant@example.com' }] }],
    from: { email: 'noreply@rabaedapp.com', name: 'Rabaed' },
    subject: 'We have your request',
    content: [
      { type: 'text/plain', value: 'Hello,' },
      {
        type: 'text/html',
        value:
          '<div dir="ltr" style="text-align:left;font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8">Hello,</div>',
      },
    ],
    tracking_settings: untracked,
  });
  // A message laid out as HTML of its own is sent with that HTML, its text beside it.
  expect((laidOut.body as { content: unknown }).content).toEqual([
    { type: 'text/plain', value: 'نص' },
    { type: 'text/html', value: '<!doctype html><p>جدول</p>' },
  ]);
});

test('a message SendGrid refuses fails in SendGrid’s own words, and never with the key in them', async () => {
  const sendGrid = await fakeSendGrid(
    401,
    JSON.stringify({ errors: [{ message: 'The provided authorization grant is invalid, expired, or revoked', field: null, help: null }] }),
  );
  configured(sendGrid.origin);

  const sent = mailer()!.send({ to: 'team@example.com', subject: 'طلب جديد', text: 'نص', locale: 'ar' });

  const error = await sent.then(
    () => null,
    (reason: Error) => reason,
  );
  await sendGrid.close();
  expect(error?.message).toMatch(/401/);
  expect(error?.message).toMatch(/authorization grant is invalid/);
  expect(error?.message).not.toContain('SG.test-key');
});

test('half configured is refused, naming what is missing; not configured at all sends nothing', () => {
  configured('http://127.0.0.1:9');

  delete process.env.MAIL_FROM;
  expect(() => mailer()).toThrow(/MAIL_FROM is missing/);

  process.env.MAIL_FROM = 'noreply@rabaedapp.com';
  delete process.env.SENDGRID_API_KEY;
  expect(() => mailer()).toThrow(/SENDGRID_API_KEY is missing/);

  delete process.env.MAIL_FROM;
  expect(mailer()).toBeNull();
});
