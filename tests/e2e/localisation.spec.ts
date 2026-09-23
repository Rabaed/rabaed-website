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

/**
 * The language switcher (ticket 40).
 *
 * A visitor meets it on the Arabic pages. The English pages have the same
 * header, but only once the founder publishes its English words, which wait
 * in the CMS as a draft — so the English side of the switcher is previewed
 * from that draft in `site-words.spec.ts`, the suite that owns the entry.
 */
const ARABIC_ROUTES = ROUTES.filter((route) => route.locale === 'ar');

test('the switcher offers exactly the languages the alternates name', async ({ page }) => {
  for (const route of ARABIC_ROUTES) {
    await page.goto(route.path);

    const alternates = route.alternates as Record<string, string | undefined>;
    const switcher = page.locator('.nav .lang');
    await expect(switcher, `${route.path} has one switcher in the header`).toHaveCount(1);
    await expect(switcher).toHaveAttribute('hreflang', 'en');

    // The switcher and the `hreflang` alternates are declared apart — the page
    // tells the shell, and tells `pageMetadata` — so this is what stops them
    // drifting: where the page names an English alternate the switcher leads
    // to it, and where it does not the switcher leads to the English home
    // page rather than to an address nothing serves.
    await expect(switcher, `${route.path} switches to its English alternate`).toHaveAttribute(
      'href',
      alternates.en ?? '/en',
    );
  }
});

test('where a page has no English, the switcher says so rather than pretending', async ({ page }) => {
  // The product page is Arabic-only until its English is published — which in
  // this database it never is — and its alternates say so.
  await page.goto('/product');

  const switcher = page.locator('.nav .lang');
  await expect(switcher).toHaveAttribute('href', '/en');
  // The bar has no room for the sentence, so the link carries it as its name:
  // two links differing only in where they go are the same link to a screen
  // reader.
  await expect(switcher).toHaveAttribute('aria-label', /not available in English/);

  // In the panel, where there is room, it is shown rather than only announced.
  await expect(page.locator('.mnav .mlang .mlang-n')).toHaveText(/not available in English/);
});

test('a page that has English switches to that page, not to the home page', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('.nav .lang')).toHaveAttribute('href', '/en/blog');
});

test('the switcher is in the first response, before any script runs', async ({ request }) => {
  const html = await (await request.get('/product')).text();
  expect(html).toContain('English');
  expect(html).toContain('href="/en"');
});

test('the language chosen is remembered, and never redirects anyone (ADR-0014)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav .lang')).not.toHaveAttribute('data-remembered', 'true');

  await page.locator('.nav .lang').click();
  await expect(page).toHaveURL(/\/en$/);

  // Back to an Arabic address, as a search result or a colleague's link would
  // send a returning visitor. The address is honoured — no redirect, ever —
  // and the way to English is marked.
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.nav .lang')).toHaveAttribute('data-remembered', 'true');

  // And an explicit Arabic address stays Arabic on a later visit too.
  await page.goto('/product');
  await expect(page).toHaveURL(/\/product$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
});

/**
 * An English address of a page that has no English (ticket 40): the English
 * menu links to every page the Arabic one does, and a visitor may arrive at
 * one from anywhere. It says so and offers the Arabic, rather than showing a
 * blank page or answering «not found» about a page that exists (spec: user
 * story 18).
 *
 * The five marketing pages are Arabic-only until the founder publishes the
 * English ticket 42 proposed as drafts, and a draft changes nothing here. The
 * three legal documents are Arabic-only for good: the Arabic is the binding
 * text and is never translated (spec: Out of Scope), which an English reader
 * is told in as many words.
 */
const NOT_YET_IN_ENGLISH = ['/product', '/start', '/tool', '/referral', '/partnership'];
const LEGAL_DOCUMENTS = [
  { path: '/terms', name: 'Terms and Conditions' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/referral-terms', name: 'Referral Program Terms' },
];

test('an English address of a page not yet in English says so, and offers the Arabic', async ({ page }) => {
  for (const path of NOT_YET_IN_ENGLISH) {
    const response = await page.goto(`/en${path}`);
    expect(response?.status(), `/en${path}`).toBe(200);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('h1'), `/en${path}`).toHaveText('This page is not available in English yet.');

    const arabic = page.getByRole('link', { name: 'Read it in Arabic' });
    await expect(arabic, `/en${path}`).toHaveAttribute('href', path);
    await expect(arabic).toHaveAttribute('hreflang', 'ar');

    // A notice is not a page of the site, before launch or after.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  }
});

test('an English address of a legal document says the Arabic is the binding text', async ({ page }) => {
  for (const document of LEGAL_DOCUMENTS) {
    const response = await page.goto(`/en${document.path}`);
    expect(response?.status(), `/en${document.path}`).toBe(200);

    await expect(page.locator('.phero .eyebrow'), `/en${document.path}`).toHaveText(document.name);
    await expect(page.locator('h1'), `/en${document.path}`).toHaveText(
      'This document is published in Arabic only, and the Arabic text is the binding version.',
    );
    await expect(page.getByRole('link', { name: 'Read it in Arabic' })).toHaveAttribute('href', document.path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  }
});

test('an English address that names no page is still not found', async ({ request }) => {
  expect((await request.get('/en/nothing-here')).status()).toBe(404);
});
