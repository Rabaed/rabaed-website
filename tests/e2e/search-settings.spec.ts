/**
 * How a page appears in a search result and when its link is shared, in the
 * CMS (ticket 26): Ahmed rewrites a page's search title and the line under it,
 * gives a page a picture of its own for when the link is unfurled, and the CMS
 * refuses a picture the places that unfurl links would crop differently.
 *
 * The six pages' titles are read by `search-foundations.spec.ts`, which holds
 * every page to a unique title and description, and by `ai-crawlers.spec.ts`,
 * which holds `/llms.txt` to saying what the page says. So nothing here is
 * published: each change is saved as a draft and read in the editor's
 * preview, which visitors never see.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { SEARCH_EDITOR, logInByApi, uploadSharingImage } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/search-settings';

type Words = { ar: string; en?: string | null };
type Section = { title: Words; description: Words; sharingImage?: number | null };
type SearchSettings = {
  languages: string[];
  home: Section;
  product: Section;
  start: Section;
  tool: Section;
  referral: Section;
  partnership: Section;
};

const arabic = (words: string): Words => ({ ar: words, en: null });

async function published(editor: APIRequestContext): Promise<SearchSettings> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

function fields(entry: SearchSettings) {
  const { languages, home, product, start, tool, referral, partnership } = entry;
  return { languages, home, product, start, tool, referral, partnership };
}

function save(editor: APIRequestContext, data: object, status: 'draft' | 'published') {
  return editor.post(`${GLOBAL}${status === 'draft' ? '?draft=true' : ''}`, { data: { ...data, _status: status } });
}

async function discardDraft(editor: APIRequestContext): Promise<void> {
  const response = await editor.get(`${GLOBAL}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1&depth=0`);
  expect(response.ok()).toBe(true);
  const [latest] = (await response.json()).docs;
  const restored = await editor.post(`${GLOBAL}/versions/${latest.id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
}

/** Opens the site in preview at `path`, as the admin's Preview button does. */
async function preview(page: Page, path: string): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

const tagged = (page: Page, selector: string) => page.locator(selector);

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('every page is described in search by what the CMS has published', async ({ page, request }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = await published(page.request);

  expect(entry.languages).toEqual(['ar']);
  const pages = [
    ['/', entry.home],
    ['/product', entry.product],
    ['/start', entry.start],
    ['/tool', entry.tool],
    ['/partnership', entry.partnership],
  ] as const;

  for (const [path, section] of pages) {
    const html = await (await request.get(path)).text();
    expect(html, `${path} title`).toContain(section.title.ar);
    expect(html, `${path} description`).toContain(section.description.ar);
  }
});

test('the referral page names the programme’s amounts rather than stating them', async ({ page, request }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = await published(page.request);
  const html = await (await request.get('/referral')).text();

  // What the CMS holds has the names in it …
  expect(entry.referral.title.ar).toContain('{payout}');
  // … and what a visitor is shown has the amount, with no name left over.
  const title = await (await request.get('/referral')).text();
  expect(title).not.toContain('{payout}');
  expect(title).not.toContain('{clientDiscount}');
  const stated = entry.referral.title.ar.replace('{payout}', '');
  for (const word of stated.split('·')[1]?.trim().split(' ').slice(0, 2) ?? []) {
    expect(html, word).toContain(word);
  }
});

test('a reworded search title is previewed, and reaches no visitor until it is published', async ({ page, request }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = fields(await published(page.request));
  const rewritten = 'ربائد · سجل المشروع الواحد';

  try {
    const saved = await save(page.request, { ...entry, product: { ...entry.product, title: arabic(rewritten) } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await preview(page, '/product');
    await expect(page).toHaveTitle(rewritten);
    await expect(tagged(page, 'meta[property="og:title"]')).toHaveAttribute('content', rewritten);
    await expect(tagged(page, 'meta[name="twitter:title"]')).toHaveAttribute('content', rewritten);

    expect(await (await request.get('/product')).text()).not.toContain(rewritten);
  } finally {
    await discardDraft(page.request);
  }
});

test('a page given a picture of its own shares that one; every other page keeps the site’s', async ({ page }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = fields(await published(page.request));
  const image = await uploadSharingImage(page.request, 'صورة مشاركة لصفحة المنتج');

  try {
    expect(image.id, image.url).toBeGreaterThan(0);
    const saved = await save(page.request, { ...entry, product: { ...entry.product, sharingImage: image.id } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await preview(page, '/product');
    const shown = await tagged(page, 'meta[property="og:image"]').getAttribute('content');
    expect(shown).toContain(image.url);
    await expect(tagged(page, 'meta[name="twitter:image"]')).toHaveAttribute('content', shown!);
    // The words a card reads out are the picture's own.
    await expect(tagged(page, 'meta[property="og:image:alt"]')).toHaveAttribute('content', 'صورة مشاركة لصفحة المنتج');

    // The start page, which has none, still shares the site's own.
    await preview(page, '/start');
    await expect(tagged(page, 'meta[property="og:image"]')).toHaveAttribute('content', /og-rabaed\.png$/);
  } finally {
    await discardDraft(page.request);
    await page.request.delete(`/api/sharing-images/${image.id}`);
  }
});

test('a picture of the wrong size or the wrong kind is refused, with the reason', async ({ page }) => {
  await logInByApi(page.request, SEARCH_EDITOR);

  // Every place that unfurls a link crops to 1200×630; another shape is
  // cropped differently by each of them.
  const tall = await uploadSharingImage(page.request, 'صورة بمقاس آخر', { width: 1200, height: 800 });
  expect(tall.id, 'a 1200×800 picture was accepted').toBe(0);
  // Told what is wrong with it, and in numbers: «حدث خطأ ما» would leave an
  // Editor resizing at random.
  expect(tall.url, 'the refusal did not say what size it must be').toContain('1200');
  expect(tall.url).toContain('800');

  const small = await uploadSharingImage(page.request, 'صورة صغيرة', { width: 600, height: 315 });
  expect(small.id, 'a 600×315 picture was accepted').toBe(0);
});

test('a search title longer than a result shows, and an empty one, are refused', async ({ page }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = fields(await published(page.request));
  const withHome = (section: Partial<Section>) => ({ ...entry, home: { ...entry.home, ...section } });

  const refused = {
    'a title longer than its place': withHome({ title: arabic('ع'.repeat(71)) }),
    'a description longer than its place': withHome({ description: arabic('ع'.repeat(181)) }),
    'an empty title': withHome({ title: arabic('') }),
    'a title of spaces': withHome({ title: arabic('   ') }),
    'an empty description': withHome({ description: arabic('') }),
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await save(page.request, data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // On the referral page, where an amount may be named, a name the site does
  // not hold is refused rather than shown to a visitor in braces.
  const wrongName = await save(
    page.request,
    { ...entry, referral: { ...entry.referral, title: arabic('ربائد · {bonus}') } },
    'published',
  );
  expect(wrongName.status(), 'a value the site does not hold').toBe(400);

  expect(fields(await published(page.request))).toEqual(entry);
});

test('what /llms.txt tells an assistant is what the page says, both from the CMS', async ({ page, request }) => {
  await logInByApi(page.request, SEARCH_EDITOR);
  const entry = await published(page.request);
  const llms = await (await request.get('/llms.txt')).text();

  // The tool page's line, which an assistant quotes, is the Editor's.
  expect(llms).toContain(entry.tool.description.ar);
  const page_ = await (await request.get('/tool')).text();
  expect(page_).toContain(entry.tool.description.ar);
});
