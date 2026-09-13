/**
 * What the CMS suites share: where the admin lives, and the editor account the
 * test server creates in its throwaway database before the build
 * (`scripts/test-server.mjs`).
 *
 * `ADMIN_PATH` is restated rather than imported from the application, for the
 * reason `routes.ts` gives: a test that reads its expectation out of the code
 * under test agrees with that code by construction.
 */
import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const ADMIN_PATH = '/maktab';

/** Exists only in the database the test server creates and deletes. */
export const TEST_EDITOR = {
  email: 'editor@rabaed.test',
  password: 'test-editor-password-19',
} as const;

/** Signs in through the admin's own login form, as Ahmed would. */
export async function logIn(page: Page): Promise<void> {
  await page.goto(`${ADMIN_PATH}/login`);
  await page.getByLabel('Email').fill(TEST_EDITOR.email);
  await page.getByLabel('Password').fill(TEST_EDITOR.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/**
 * Signs in through the API rather than the form. For putting things back
 * after a test, which must work whether or not the test got as far as signing
 * in — the form redirects away when there is already a session.
 */
export async function logInByApi(request: APIRequestContext): Promise<void> {
  const response = await request.post('/api/users/login', { data: TEST_EDITOR });
  expect(response.ok()).toBe(true);
}

/** A legal document, as the API gives it to a signed-in editor: what is published. */
export async function legalDocument(request: APIRequestContext, slug: string) {
  const response = await request.get(`/api/legal-documents?where[slug][equals]=${slug}&depth=0`);
  expect(response.ok(), slug).toBe(true);
  const { docs } = await response.json();
  expect(docs, slug).toHaveLength(1);
  return docs[0];
}

/**
 * Every version kept of a legal document, oldest first — ordered by
 * `updatedAt`, when the version was made, as the admin's Versions list is. A
 * restored version carries the `createdAt` of the document it restores.
 */
export async function legalVersions(request: APIRequestContext, id: number) {
  const response = await request.get(
    `/api/legal-documents/versions?where[parent][equals]=${id}&sort=updatedAt&pagination=false&depth=0`,
  );
  expect(response.ok()).toBe(true);
  return (await response.json()).docs;
}

/**
 * Puts a legal document's latest version back to what is published, as a
 * draft, so that a test's saved draft is not left waiting to be published by
 * the next one. Visitors see nothing of it either way.
 */
export async function discardLegalDraft(request: APIRequestContext, id: number): Promise<void> {
  const published = (await legalVersions(request, id)).filter(
    (version: { version: { _status: string } }) => version.version._status === 'published',
  );
  const restored = await request.post(`/api/legal-documents/versions/${published.at(-1).id}?draft=true`);
  expect(restored.ok()).toBe(true);
}

/** A page's search description, as a visitor with no session receives it. */
export async function metaDescription(request: APIRequestContext, path: string): Promise<string | null> {
  const html = await (await request.get(path)).text();
  return html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;
}

/** Today in Riyadh, the way a legal page writes a date. */
export function todayInRiyadh(): string {
  // Restated rather than imported from the page component (see `routes.ts`).
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const parts = new Intl.DateTimeFormat('en-u-nu-latn', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((each) => each.type === type)!.value);
  return `${part('day')} ${months[part('month') - 1]} ${part('year')}`;
}

/**
 * A legal page's «آخر تحديث» line, as a visitor with no session receives it.
 * Read from the HTML, whose numerals sit in spans of their own.
 */
export async function lastUpdatedLine(request: APIRequestContext, path: string): Promise<string | null> {
  const html = await (await request.get(path)).text();
  const line = html.match(/<span class="updated">((?:[^<]|<span[^>]*>[^<]*<\/span>|<!-- -->)*)<\/span>/)?.[1];
  return line?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? null;
}

/**
 * Where the footer icon with this accessible name points, on a page as a
 * visitor with no session receives it. Read from the HTML rather than the
 * rendered page, so that no script has had a chance to change it.
 */
export async function footerLink(request: APIRequestContext, path: string, label: string): Promise<string | null> {
  const html = await (await request.get(path)).text();
  const footer = html.slice(html.indexOf('<footer'));
  const link = footer.match(/<a\b[^>]*>/g)?.find((tag) => tag.includes(`aria-label="${label}"`));
  return link?.match(/\bhref="([^"]*)"/)?.[1] ?? null;
}
