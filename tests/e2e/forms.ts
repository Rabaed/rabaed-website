/**
 * What the form suites share: the mail the test server would have sent, and
 * the submissions an editor finds in the admin.
 *
 * The test server gives the site an outbox instead of a mailbox
 * (`scripts/test-server.mjs`): every message is written there as a file, and
 * nothing leaves the machine. Its folder sits beside the server's database,
 * named after the port, so suites running side by side on different
 * `TEST_PORT`s read only their own mail.
 */
import { readdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, type APIRequestContext } from '@playwright/test';
// With its extension: the test server imports this file under Node's own
// TypeScript loading, which resolves no other way (`scripts/test-server.mjs`).
import { FORM_READER } from './cms.ts';

/** Where the test server on `port` keeps its database, its images and its outbox. */
export function testServerScratch(port: number): string {
  return path.join(os.tmpdir(), `rabaed-test-server-${port}`);
}

export function outboxDirectory(port: number): string {
  return path.join(testServerScratch(port), 'outbox');
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
  const directory = outboxDirectory(testPort());
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
  alert: 'sent' | 'skipped' | 'failed' | null;
  confirmation: 'sent' | 'skipped' | 'failed' | null;
};

/**
 * Every submission stored with this email address, as an editor finds them.
 *
 * The form suites run side by side, and each would sign in to read what it
 * stored. Payload records a login by reading the editor's sessions, adding one
 * and writing them back, so two logins to one account in the same instant can
 * erase each other's session (`cms.ts`) — and the read made with the lost one
 * is refused. So these reads have an account no other suite signs in to, and a
 * read that is refused is asked again, signed in afresh.
 */
export async function submissionsFrom(request: APIRequestContext, email: string): Promise<StoredSubmission[]> {
  const address = `/api/form-submissions?where[email][equals]=${encodeURIComponent(email)}&depth=0&pagination=false`;
  for (let attempt = 1; ; attempt++) {
    const login = await request.post('/api/users/login', { data: FORM_READER });
    expect(login.ok()).toBe(true);
    const response = await request.get(address);
    if (response.ok()) return (await response.json()).docs;
    if (attempt === 5) expect(response.status(), 'the admin refused a signed-in editor').toBe(200);
    await new Promise((resolve) => setTimeout(resolve, 100 * attempt + Math.random() * 200));
  }
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
