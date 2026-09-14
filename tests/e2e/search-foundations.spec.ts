/**
 * What a search engine needs to crawl the site correctly once the block comes
 * off, and what a shared link needs to look credible (ticket 31; spec: SEO and
 * GEO, and "Discovery" under Testing Decisions).
 *
 * The block itself — `noindex` everywhere outside production — is held by
 * `indexing.spec.ts`. Canonical URLs and `hreflang` are `localisation.spec.ts`.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { PNG } from 'pngjs';
import { ROUTES } from './routes';

/** The home page's absolute address is the bare origin, as its canonical URL is. */
const absolute = (baseURL: string, path: string) => `${baseURL}${path === '/' ? '' : path}`;

/**
 * `og:locale` and `og:site_name` per locale, restated rather than imported for
 * the reason `routes.ts` gives. Arabic as written in Saudi Arabia, and the name
 * ربائد, as the Reference site declares them.
 */
const SHARED_AS = {
  ar: { locale: 'ar_SA', siteName: 'ربائد' },
  en: { locale: 'en_US', siteName: 'Rabaed' },
} as const;

async function fetchOk(request: APIRequestContext, url: string) {
  const response = await request.get(url);
  expect(response.status(), url).toBe(200);
  return response;
}

test('every page has a title and a description of its own', async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const route of ROUTES) {
    await page.goto(route.path);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');

    expect(title.trim(), `${route.path}'s title`).not.toBe('');
    expect(description?.trim(), `${route.path}'s description`).toBeTruthy();
    expect(titles.get(title), `${route.path} has the same title as`).toBeUndefined();
    expect(descriptions.get(description!), `${route.path} has the same description as`).toBeUndefined();

    titles.set(title, route.path);
    descriptions.set(description!, route.path);
  }
});

for (const route of ROUTES) {
  test(`${route.path} is described to a shared link as itself, with a real 1200×630 image`, async ({
    page,
    request,
    baseURL,
  }) => {
    await page.goto(route.path);
    const meta = (selector: string) => page.locator(`meta[${selector}]`);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');

    // The page's own title, description and address — not the home page's,
    // which three of the Reference site's pages copied.
    await expect(meta('property="og:title"')).toHaveAttribute('content', title);
    await expect(meta('property="og:description"')).toHaveAttribute('content', description!);
    await expect(meta('property="og:url"')).toHaveAttribute('content', absolute(baseURL!, route.path));
    await expect(meta('property="og:locale"')).toHaveAttribute('content', SHARED_AS[route.locale].locale);
    await expect(meta('property="og:type"')).toHaveAttribute('content', 'website');
    await expect(meta('property="og:site_name"')).toHaveAttribute('content', SHARED_AS[route.locale].siteName);

    await expect(meta('name="twitter:card"')).toHaveAttribute('content', 'summary_large_image');
    await expect(meta('name="twitter:title"')).toHaveAttribute('content', title);
    await expect(meta('name="twitter:description"')).toHaveAttribute('content', description!);

    const image = await meta('property="og:image"').getAttribute('content');
    expect(image, 'og:image').toMatch(new RegExp(`^${baseURL}/`));
    await expect(meta('name="twitter:image"')).toHaveAttribute('content', image!);
    await expect(meta('property="og:image:alt"')).toHaveAttribute('content', /\S/);

    const response = await fetchOk(request, image!);
    expect(response.headers()['content-type']).toBe('image/png');
    const png = PNG.sync.read(await response.body());
    expect({ width: png.width, height: png.height }).toEqual({ width: 1200, height: 630 });
    await expect(meta('property="og:image:width"')).toHaveAttribute('content', '1200');
    await expect(meta('property="og:image:height"')).toHaveAttribute('content', '630');
  });
}

for (const route of ROUTES) {
  test(`${route.path} has a favicon that resolves`, async ({ page, request }) => {
    await page.goto(route.path);

    const icons = page.locator('link[rel="icon"]');
    await expect(icons.first()).toBeAttached();
    for (const href of await icons.evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))) {
      const response = await fetchOk(request, href);
      expect(response.headers()['content-type'], href).toMatch(/^image\//);
    }
  });
}

test('robots.txt is served, lets crawlers reach the pages, and names the sitemap', async ({ request, baseURL }) => {
  const response = await fetchOk(request, '/robots.txt');
  expect(response.headers()['content-type']).toMatch(/^text\/plain/);
  const robots = await response.text();

  expect(robots).toContain(`Sitemap: ${baseURL}/sitemap.xml`);
  // A crawler kept out by robots.txt never reads the `noindex` on a page, and
  // can still list its address from a link elsewhere. Before launch the block
  // is `noindex`, so nothing may be disallowed here that it has to see.
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);

  await fetchOk(request, `${baseURL}/sitemap.xml`);
});

test('the sitemap lists exactly the site’s pages, each at its own canonical address', async ({
  request,
  page,
  baseURL,
}) => {
  const response = await fetchOk(request, '/sitemap.xml');
  const listed = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);

  // Articles come and go with what is published, and `blog.spec.ts` publishes
  // and unpublishes its own alongside this test; it holds them to the sitemap.
  const pages = listed.filter((loc) => !/\/blog\/[^/]+$/.test(loc));

  // The Arabic site's pages. `/en` and `/en/blog` wait for English (ticket 40),
  // and the Screen mock studio is never listed (ticket 05). With no case study
  // published, their section has no page (ticket 24).
  const expected = ['/', '/product', '/start', '/tool', '/referral', '/partnership', '/blog', '/terms', '/privacy', '/referral-terms'];
  expect([...pages].sort()).toEqual(expected.map((path) => absolute(baseURL!, path)).sort());
  expect(listed.filter((loc) => loc.includes('/studio'))).toEqual([]);

  for (const loc of pages) {
    const visit = await page.goto(loc);
    expect(visit?.status(), loc).toBe(200);
    await expect(page.locator('link[rel="canonical"]'), loc).toHaveAttribute('href', loc);
  }
});
