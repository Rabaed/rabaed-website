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
