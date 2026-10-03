/**
 * The product app's old addresses on this domain (ADR-0026).
 *
 * Until it moved, the product app answered at `rabaedapp.com`, and its
 * addresses are in invite emails, submittal emails, Excel exports and the QR
 * codes printed on letters. For an address this site has no page for, the
 * proxy asks the product app whether it has one: if it does, the visitor is
 * sent there with the address as it came; if it does not, this site's own
 * not-found page answers, as it always has.
 *
 * The product app asked is the stand-in `scripts/fake-product-app.mjs`, which
 * answers as the real one was observed to — see what each page does there.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';

/** Where the stand-in answers: `TEST_PORT + 5000` (`playwright.config.ts`). */
const productApp = (baseURL: string | undefined) => `http://127.0.0.1:${Number(new URL(baseURL!).port) + 5000}`;

/** What this site answers an address with, without following it anywhere. */
async function answer(request: APIRequestContext, address: string, method: 'GET' | 'POST' = 'GET') {
  const response = await request.fetch(address, { method, maxRedirects: 0 });
  return { status: response.status(), location: response.headers()['location'] ?? null };
}

test('a page the product app has is sent there, with the address exactly as it came', async ({ request, baseURL }) => {
  const app = productApp(baseURL);
  for (const address of [
    '/signin?lang=ar_ar', // the old sign-in button
    '/registration?token=abc123XYZ', // an invite email
    '/verify/AbC123tokenAbC123tokenAbC123to054', // a printed letter's QR code
  ]) {
    expect(await answer(request, address), address).toEqual({ status: 307, location: `${app}${address}` });
  }
});

test('a page that needs a sign-in, or holds files, counts as one the product app has', async ({ request, baseURL }) => {
  // It answers 302 for a page that needs a sign-in, and 403 for the folder its
  // files sit in. Neither is "no such page", and the links in emails and Excel
  // exports are exactly these.
  const app = productApp(baseURL);
  for (const address of [
    '/project/test3?nav=2',
    '/submittal/1790000000000x100000000000000000',
    '/fileupload/f1729516897294x808916950788260100/Inspection%20Request%201.pdf',
  ]) {
    expect(await answer(request, address), address).toEqual({ status: 307, location: `${app}${address}` });
  }
});

test('the copy of the app named in front is kept', async ({ request, baseURL }) => {
  const app = productApp(baseURL);
  for (const address of [
    '/version-test/registration?token=abc123XYZ',
    '/version-live/submittal/sar-026-1790000000000x100000000000000000',
    '/version-test',
  ]) {
    expect(await answer(request, address), address).toEqual({ status: 307, location: `${app}${address}` });
  }
});

test('a page the product app does not have gets this site’s own not-found page', async ({ page }) => {
  const response = await page.goto('/a-page-the-product-app-does-not-have');
  expect(response?.status()).toBe(404);
  expect(page.url()).toMatch(/\/a-page-the-product-app-does-not-have$/);
  await expect(page.locator('[dir="rtl"][lang="ar"]')).toContainText('الصفحة غير موجودة');
});

test('when the product app is too slow to answer, the visitor is sent there anyway', async ({ request, baseURL }) => {
  // Being wrong this way shows the product app's own not-found page; being
  // wrong the other way would break a printed letter's link.
  expect(await answer(request, '/slow?from=letter')).toEqual({
    status: 307,
    location: `${productApp(baseURL)}/slow?from=letter`,
  });
});

test('a question the product app failed to answer is asked again next time', async ({ request, baseURL }) => {
  // The stand-in fails the first question about a `flaky-` page and answers
  // 404 after. A fresh name each run, since the answer is remembered by page.
  const address = `/flaky-${Date.now()}`;
  expect(await answer(request, address)).toEqual({ status: 307, location: `${productApp(baseURL)}${address}` });
  expect(await answer(request, address)).toEqual({ status: 404, location: null });
});

test('an old address posted to is sent on as a post', async ({ request, baseURL }) => {
  expect(await answer(request, '/registration?token=abc123XYZ', 'POST')).toEqual({
    status: 307,
    location: `${productApp(baseURL)}/registration?token=abc123XYZ`,
  });
});

test('an address with a letter percent-encoded is asked about as the page it spells, and sent on as it came', async ({
  request,
  baseURL,
}) => {
  // Next matches pages, and the proxy's matcher, against the decoded path; the
  // question has to be asked of the same thing.
  expect(await answer(request, '/%73ignin?lang=ar_ar')).toEqual({
    status: 307,
    location: `${productApp(baseURL)}/%73ignin?lang=ar_ar`,
  });
});
