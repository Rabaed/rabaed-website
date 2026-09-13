/**
 * Arabic is the site, English is a second locale — not the other way round.
 * Arabic therefore lives at `/` with no prefix and English at `/en`, and each
 * document declares its own language and direction (spec: Routing and
 * localisation).
 */
import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

for (const route of ROUTES) {
  test(`${route.path} declares lang="${route.locale}" dir="${route.dir}"`, async ({ page }) => {
    await page.goto(route.path);

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', route.locale);
    await expect(html).toHaveAttribute('dir', route.dir);
  });
}

test('Arabic has exactly one URL: /ar is not a second copy of the homepage', async ({ request }) => {
  const response = await request.get('/ar');
  expect(response.status()).toBe(404);
});

test('a URL that matches nothing answers 404 in Arabic, right to left', async ({ page }) => {
  const response = await page.goto('/nothing-here');
  expect(response?.status()).toBe(404);

  // The document has no root layout of its own, so the language is declared on
  // the content — see the reasoning in src/app/not-found.tsx.
  const content = page.locator('[dir="rtl"][lang="ar"]');
  await expect(content).toContainText('الصفحة غير موجودة');
});

/** The home page's canonical URL is the bare origin: Next.js drops the lone
 *  trailing slash, and a crawler reads the two forms as the same address. */
const absolute = (baseURL: string, path: string) => `${baseURL}${path === '/' ? '' : path}`;

test('each page is its own canonical and names both locales as alternates', async ({ page, baseURL }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);

    // Absolute and exact. An expectation built from a pattern is how a
    // canonical URL pointing at the wrong host or the wrong port goes unseen.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      absolute(baseURL!, route.path),
    );

    // The same page in each locale it exists in — not every route in each
    // locale, which was the same thing only while the site had one page per
    // locale — and no alternate for a locale it does not exist in, which
    // would send a search engine to a page that is not there.
    for (const [locale, path] of Object.entries(route.alternates)) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${locale}"]`),
      ).toHaveAttribute('href', absolute(baseURL!, path));
    }
    await expect(page.locator('link[rel="alternate"][hreflang]'), `${route.path}'s alternates`).toHaveCount(
      Object.keys(route.alternates).length,
    );
  }
});
