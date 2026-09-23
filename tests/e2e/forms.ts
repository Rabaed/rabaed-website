/**
 * What the form suites share: the mail the test server would have sent, the
 * documents it stored, the submissions an editor finds in the admin, and the
 * demo request form as a visitor meets it — which two suites fill in.
 *
 * The test server gives the site an outbox instead of a mailbox, and a folder
 * instead of a private bucket (`scripts/test-server.mjs`): every message and
 * every document is written there as a file, and nothing leaves the machine.
 * Both folders sit beside the server's database, named after the port, so
 * suites running side by side on different `TEST_PORT`s read only their own.
 */
import { readdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, type APIRequestContext, type APIResponse, type Locator } from '@playwright/test';
// With its extension: the test server imports this file under Node's own
// TypeScript loading, which resolves no other way (`scripts/test-server.mjs`).
import { FORM_READER } from './cms.ts';

/** Where the test server on `port` keeps its database, its images, its outbox and its documents. */
export function testServerScratch(port: number): string {
  return path.join(os.tmpdir(), `rabaed-test-server-${port}`);
}

export function outboxDirectory(port: number = testPort()): string {
  return path.join(testServerScratch(port), 'outbox');
}

export function documentsDirectory(port: number = testPort()): string {
  return path.join(testServerScratch(port), 'documents');
}

/** The port this run's test server listens on (`playwright.config.ts`). */
function testPort(): number {
  return Number(process.env.TEST_PORT || 3100);
}

/** One message, as the outbox keeps it. */
export type SentMail = {
  readonly to: string;
  readonly replyTo?: string;
  readonly subject: string;
  readonly text: string;
};

/** Every message sent to `address` so far. */
export async function mailTo(address: string): Promise<SentMail[]> {
  const directory = outboxDirectory();
  const files = await readdir(directory).catch(() => [] as string[]);
  const mail = await Promise.all(
    files.filter((file) => file.endsWith('.json')).map(async (file) => JSON.parse(await readFile(path.join(directory, file), 'utf8')) as SentMail),
  );
  return mail.filter((message) => message.to === address);
}

/** A stored submission, as the admin's API gives it to an editor. */
export type StoredSubmission = {
  id: number;
  form: string;
  name: string;
  email: string;
  phone: string;
  answers: { field: string; label: string; value: string; option: string | null }[];
  documents: { field: string; label: string; fileName: string; contentType: string; size: number; key: string; link: string }[];
  alert: 'sent' | 'skipped' | 'failed' | null;
  confirmation: 'sent' | 'skipped' | 'failed' | 'withheld' | null;
};

/**
 * A GET made as the form suites' reader, signed in.
 *
 * The form suites run side by side, and each signs in to read what it stored.
 * Payload records a login by reading the editor's sessions, adding one and
 * writing them back, so two logins to one account in the same instant can
 * erase each other's session (`cms.ts`) — and the request made with the lost
 * one is refused as if nobody were signed in. So these reads have an account no
 * other suite signs in to, and a read refused for want of a session is asked
 * again, signed in afresh.
 */
export async function readerGet(request: APIRequestContext, address: string): Promise<APIResponse> {
  return asReader(request, address, () => request.get(address));
}

/** A DELETE made as the form suites' reader, signed in (see `readerGet`). */
export async function readerDelete(request: APIRequestContext, address: string): Promise<APIResponse> {
  return asReader(request, address, () => request.delete(address));
}

async function asReader(request: APIRequestContext, address: string, send: () => Promise<APIResponse>): Promise<APIResponse> {
  for (let attempt = 1; ; attempt++) {
    const response = await send();
    // A lost session is refused as nobody: 401 from a document link, and 401
    // or 403 from the admin's API. A document link's 403 is its answer — the
    // link itself was turned down, whoever asks.
    const lostSession = address.startsWith('/api/form-documents/')
      ? response.status() === 401
      : response.status() === 401 || response.status() === 403;
    if (!lostSession || attempt === 6) return response;
    const login = await request.post('/api/users/login', { data: FORM_READER });
    expect(login.ok()).toBe(true);
    if (attempt > 1) await new Promise((resolve) => setTimeout(resolve, 100 * attempt + Math.random() * 200));
  }
}

/** Every submission stored with this email address, as an editor finds them. */
export async function submissionsFrom(request: APIRequestContext, email: string): Promise<StoredSubmission[]> {
  const response = await readerGet(
    request,
    `/api/form-submissions?where[email][equals]=${encodeURIComponent(email)}&depth=0&pagination=false`,
  );
  expect(response.status(), 'the admin refused a signed-in editor').toBe(200);
  return (await response.json()).docs;
}

let applicants = 0;

/**
 * Details nobody else in the run is using: an address of its own, so a test
 * finds only its own submission and mail, and a network address of its own,
 * so the limit on requests from one address never reaches another test.
 */
export function uniqueApplicant(label: string) {
  const serial = `${Date.now()}-${process.pid}-${applicants++}`;
  const random = () => Math.floor(Math.random() * 250) + 1;
  return {
    email: `${label}-${serial}@example.com`,
    ip: `10.${random()}.${random()}.${random()}`,
  };
}


/**
 * The demo request form, in the words a visitor reads: its accessible name,
 * its button, and what it says when a submission is stored or refused.
 *
 * Restated here rather than imported from the form's definition or its
 * settings, for the reason `routes.ts` gives — and in one place rather than
 * two, because `form-submission.spec.ts` and `analytics.spec.ts` both send
 * this form and would otherwise drift apart the first time the wording moves.
 */
export const DEMO_FORM = 'احجز عرضاً حياً على مشروعك';
export const DEMO_BUTTON = 'احجز عرضاً حياً';
export const DEMO_RECEIVED = 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.';
export const DEMO_REFUSED = 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.';

/** The one applicant these suites send, save for the address, which is each test's own. */
export const APPLICANT = { name: 'سارة القحطاني', phone: '0500000000', company: 'شركة الإعمار' } as const;

/** The site engineer who asks for the Pour Tracker (ticket 30), likewise. */
export const ENGINEER = {
  firstName: 'أحمد',
  lastName: 'السالم',
  phone: '51 123 4567',
  company: 'مقاولات الشرق',
} as const;

/** Answers every field of the demo request form, the optional two included. */
export async function fillDemoForm(form: Locator, email: string): Promise<void> {
  await form.getByLabel('الاسم الكامل').fill(APPLICANT.name);
  await form.getByLabel('البريد الإلكتروني').fill(email);
  await form.getByLabel('دورك في المشروع').selectOption('owner');
  await form.getByLabel('رقم الجوال').fill(APPLICANT.phone);
  await form.getByLabel('اسم الشركة').fill(APPLICANT.company);
  await form.getByLabel('عدد المشاريع النشطة').fill('3');
}
