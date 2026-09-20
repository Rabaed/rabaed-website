/**
 * The words every page shares, in the CMS (ticket 59): Ahmed rewords the
 * header's menu, changes where a link goes, rewrites the footer and the
 * not-found page and the line under each index — and the CMS refuses a label
 * the header cannot carry and an address that is not an address. An address
 * that matches no page is allowed: the founder asked for a link that can be
 * written before the page it names (spec: Content model).
 *
 * Every other suite reads these words on every page, so almost nothing here is
 * published. Rewording is saved as a draft and checked in the editor's
 * preview, which visitors never see; the one change published is a space at
 * the end of the footer's tagline, which no screenshot shows and no suite
 * reads; the refused changes are never saved at all.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { SITE_WORDS_EDITOR, logInByApi } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/site-words';
const LEADS = '/api/globals/index-leads';

/** A word as the CMS holds it: its Arabic and its English. */
type Words = { ar: string; en?: string | null };
type Link = { label: Words; path: string };
type Group = Link & { summary: Words };
type SiteWords = {
  languages: string[];
  header: {
    links: Link[];
    partnershipsLabel: Words;
    partnerships: Group[];
    signInLabel: Words;
    signInUrl: string;
    demoLabel: Words;
  };
  footer: { tagline: Words; legalLinks: Link[]; rights: Words };
  notFound: { heading: Words; lead: Words; homeLabel: Words };
};

const arabic = (words: string): Words => ({ ar: words, en: null });

async function published(editor: APIRequestContext): Promise<SiteWords> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

/** The entry's fields alone, ready to be sent back: no ids, no dates. */
function fields(entry: SiteWords) {
  const { languages, header, footer, notFound } = entry;
  return {
    languages,
    header: {
      ...header,
      links: header.links.map(({ label, path }) => ({ label, path })),
      partnerships: header.partnerships.map(({ label, summary, path }) => ({ label, summary, path })),
    },
    footer: { ...footer, legalLinks: footer.legalLinks.map(({ label, path }) => ({ label, path })) },
    notFound,
  };
}

function save(editor: APIRequestContext, data: object, status: 'draft' | 'published') {
  return editor.post(`${GLOBAL}${status === 'draft' ? '?draft=true' : ''}`, { data: { ...data, _status: status } });
}

/** Puts the entry's latest version back to what is published, so a test's draft is not left waiting. */
async function discardDraft(editor: APIRequestContext): Promise<void> {
  const response = await editor.get(`${GLOBAL}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1&depth=0`);
  expect(response.ok()).toBe(true);
  const [latest] = (await response.json()).docs;
  const restored = await editor.post(`${GLOBAL}/versions/${latest.id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
}

async function visitorHtml(request: APIRequestContext, path = '/'): Promise<string> {
  return (await request.get(path)).text();
}

/** Opens the site in preview at `path`, as the admin's Preview button does. */
async function preview(page: Page, path: string): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('every page shows the header and footer the CMS has published', async ({ page, request }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = await published(page.request);

  expect(entry.languages).toEqual(['ar']);
  for (const path of ['/', '/product', '/start']) {
    const html = await visitorHtml(request, path);
    for (const link of entry.header.links) {
      // The case studies link waits for its first published story.
      if (link.path !== '/case-studies') expect(html, path).toContain(link.label.ar);
    }
    expect(html, path).toContain(entry.header.partnershipsLabel.ar);
    expect(html, path).toContain(entry.header.signInLabel.ar);
    expect(html, path).toContain(entry.header.signInUrl);
    expect(html, path).toContain(entry.footer.tagline.ar);
    expect(html, path).toContain(entry.footer.rights.ar);
    for (const link of entry.footer.legalLinks) expect(html, path).toContain(link.label.ar);
  }
});

test('the not-found page and both index leads are the CMS’s words', async ({ page, request }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = await published(page.request);
  const leads = await (await page.request.get(`${LEADS}?depth=0`)).json();

  const missing = await visitorHtml(request, '/a-page-that-is-not-here');
  expect(missing).toContain(entry.notFound.heading.ar);
  expect(missing).toContain(entry.notFound.lead.ar);
  expect(missing).toContain(entry.notFound.homeLabel.ar);

  expect(await visitorHtml(request, '/blog')).toContain(leads.blog.lead.ar);
  expect(await visitorHtml(request, '/en/blog')).toContain(leads.blog.lead.en);
});

test('a reworded menu label is previewed, renames the page in the search trail, and never reaches a visitor', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = fields(await published(page.request));
  const renamed = 'المنتَج والخدمة';
  const links = entry.header.links.map((link) => (link.path === '/product' ? { ...link, label: arabic(renamed) } : link));

  try {
    const saved = await save(page.request, { ...entry, header: { ...entry.header, links } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page, '/product');
    await expect(page.locator('.nav .links').getByRole('link', { name: renamed, exact: true })).toBeVisible();

    // The trail search results show names the page the same way the menu does.
    const trail = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent ?? '{}'))
        .find((data) => data['@type'] === 'BreadcrumbList'),
    );
    expect(trail.itemListElement.map((step: { name: string }) => step.name)).toEqual([
      entry.header.links[0].label.ar,
      renamed,
    ]);

    expect(await visitorHtml(request, '/product')).not.toContain(renamed);
  } finally {
    await discardDraft(page.request);
  }
});

test('a link an Editor points somewhere else leads there, on every page', async ({ page }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = fields(await published(page.request));
  const links = entry.header.links.map((link) => (link.path === '/start' ? { ...link, path: '/tool' } : link));

  try {
    const saved = await save(page.request, { ...entry, header: { ...entry.header, links } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page, '/');
    const moved = entry.header.links.find((link) => link.path === '/start')!;
    await expect(page.locator('.nav .links').getByRole('link', { name: moved.label.ar, exact: true })).toHaveAttribute(
      'href',
      '/tool',
    );
  } finally {
    await discardDraft(page.request);
  }
});

test('a menu of the longest labels the CMS allows still sits on one line', async ({ page }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = fields(await published(page.request));
  // Every word at the longest the CMS accepts, and every link showing: the
  // case studies link waits for a published story, so the worst the header
  // ever draws is four links that all lead somewhere that exists.
  // `src/cms/globals/site-words.ts` is where the numbers come from.
  const longest = arabic('م'.repeat(11));
  const filled = {
    ...entry,
    header: {
      ...entry.header,
      links: ['/', '/product', '/tool', '/start'].map((path) => ({ label: longest, path })),
      partnershipsLabel: longest,
      signInLabel: arabic('م'.repeat(12)),
      demoLabel: arabic('م'.repeat(15)),
    },
  };

  try {
    const saved = await save(page.request, filled, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    // 981px is where the panel gives way to a row of links.
    await page.setViewportSize({ width: 981, height: 900 });
    await preview(page, '/');

    // The header's own row: the panel that replaces it below 981px has a
    // `.wrap` of its own.
    const row = page.locator('.nav > .wrap');
    await expect(row).toBeVisible();

    // One line: every link's box starts at the same height as the first.
    const tops = await page.locator('.nav .links > a, .nav .links .nsub').evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().top)),
    );
    expect(new Set(tops).size, 'the menu wrapped onto a second line').toBe(1);

    // And nothing in the header is pushed outside it, at this width or wider.
    for (const width of [981, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await row.evaluate((element) => element.scrollWidth - element.clientWidth);
      expect(overflow, `the header overflows at ${width}px`).toBeLessThanOrEqual(0);
    }
  } finally {
    await discardDraft(page.request);
  }
});

test('a label longer than the header carries, an address that is not an address, and an empty menu are refused', async ({
  page,
}) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = fields(await published(page.request));
  const link = { label: arabic('رابط'), path: '/product' };
  const withLinks = (links: Link[]) => ({ ...entry, header: { ...entry.header, links } });

  const refused = {
    'a label longer than the header carries': withLinks([{ ...link, label: arabic('م'.repeat(12)) }]),
    'an address with no slash and no https': withLinks([{ ...link, path: 'product' }]),
    'an address with a space in it': withLinks([{ ...link, path: '/pro duct' }]),
    'an address written in Arabic': withLinks([{ ...link, path: '/المنتج' }]),
    'an insecure address': withLinks([{ ...link, path: 'http://rabaedapp.com' }]),
    'an empty address': withLinks([{ ...link, path: '' }]),
    'no links at all': withLinks([]),
    'five links': withLinks(Array.from({ length: 5 }, () => link)),
    'an empty label': withLinks([{ ...link, label: arabic('') }]),
    'a label of spaces': withLinks([{ ...link, label: arabic('   ') }]),
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
    'no Arabic': { ...entry, languages: ['en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await save(page.request, data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(fields(await published(page.request))).toEqual(entry);
});

test('an English page carries no Arabic header or footer in place of English it has not got', async ({ page }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = await published(page.request);

  await page.goto('/en/blog');

  // Not a word of the Arabic menu or footer is drawn: an English page has
  // neither until ticket 40 writes them, rather than the Arabic in their place.
  await expect(page.locator('.nav')).toHaveCount(0);
  await expect(page.locator('footer')).toHaveCount(0);
  const body = page.locator('body');
  for (const link of entry.header.links) await expect(body).not.toContainText(link.label.ar);
  await expect(body).not.toContainText(entry.footer.tagline.ar);
  await expect(body).not.toContainText(entry.footer.rights.ar);
});

test('a change published reaches visitors', async ({ page, request }) => {
  await logInByApi(page.request, SITE_WORDS_EDITOR);
  const entry = fields(await published(page.request));
  // A space at the end of the footer's line: in the HTML, but drawn nowhere.
  const tagline = `${entry.footer.tagline.ar} `;

  try {
    const response = await save(
      page.request,
      { ...entry, footer: { ...entry.footer, tagline: { ...entry.footer.tagline, ar: tagline } } },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    await expect.poll(async () => visitorHtml(request)).toContain(`${tagline}</div>`);
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
