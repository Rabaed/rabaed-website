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
import type { Page } from '@playwright/test';
import sharp from 'sharp';
import { uploadSharingImage } from './cms';
import { test, expect, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

type SearchSettings = Entry<'search-settings'>;
/** A word as the CMS holds it: its Arabic and its English. */
type Words = SearchSettings['home']['title'];
type Section = SearchSettings['home'];

const arabic = (words: string): Words => ({ ar: words, en: null });

const tagged = (page: Page, selector: string) => page.locator(selector);

test('every page is described in search by what the CMS has published', async ({ page, request, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();

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

test('the referral page names the programme’s amounts rather than stating them', async ({ page, request, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();
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

test('a reworded search title is previewed, and reaches no visitor until it is published', async ({ page, request, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();
  const rewritten = 'ربائد · سجل المشروع الواحد';

  await search.draft({ ...entry, product: { ...entry.product, title: arabic(rewritten) } });

  await cms.preview('/product');
  await expect(page).toHaveTitle(rewritten);
  await expect(tagged(page, 'meta[property="og:title"]')).toHaveAttribute('content', rewritten);
  await expect(tagged(page, 'meta[name="twitter:title"]')).toHaveAttribute('content', rewritten);

  expect(await (await request.get('/product')).text()).not.toContain(rewritten);
});

test('a page given a picture of its own shares that one; every other page keeps the site’s', async ({ page, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();
  const image = await uploadSharingImage(page.request, 'صورة مشاركة لصفحة المنتج');

  try {
    expect(image.id, image.url).toBeGreaterThan(0);
    await search.draft({ ...entry, product: { ...entry.product, sharingImage: image.id } });

    await cms.preview('/product');
    const shown = await tagged(page, 'meta[property="og:image"]').getAttribute('content');
    expect(shown).toContain(image.url);
    await expect(tagged(page, 'meta[name="twitter:image"]')).toHaveAttribute('content', shown!);
    // The words a card reads out are the picture's own.
    await expect(tagged(page, 'meta[property="og:image:alt"]')).toHaveAttribute('content', 'صورة مشاركة لصفحة المنتج');

    // The start page, which has none, still shares the site's own.
    await cms.preview('/start');
    await expect(tagged(page, 'meta[property="og:image"]')).toHaveAttribute('content', /og-rabaed\.png$/);
  } finally {
    // The draft put back before the picture it points at goes.
    await search.restore();
    await page.request.delete(`/api/sharing-images/${image.id}`);
  }
});

test('a picture of the wrong size or the wrong kind is refused, with the reason', async ({ page, cms }) => {

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

test('a picture refused in place of another leaves the first one where it was', async ({ page, cms }) => {
  const image = await uploadSharingImage(page.request, 'صورة مشاركة تبقى');

  try {
    expect(image.id, image.url).toBeGreaterThan(0);
    const before = await page.request.get(image.url);
    expect(before.ok(), 'the picture was not there to begin with').toBe(true);

    // The same record, a new file of the wrong size. Payload deletes the file
    // a record points at before it validates the one replacing it, so a
    // refusal in the wrong place empties the record without saying so.
    const replaced = await page.request.patch(`/api/sharing-images/${image.id}`, {
      multipart: {
        file: {
          name: `replacement-${Date.now()}.png`,
          mimeType: 'image/png',
          buffer: await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#14161C' } }).png().toBuffer(),
        },
        _payload: JSON.stringify({ alt: 'صورة مشاركة تبقى' }),
      },
    });
    expect(replaced.status(), 'the wrong size was accepted in place of the first').toBe(400);

    const after = await page.request.get(image.url);
    expect(after.ok(), 'the first picture went when its replacement was refused').toBe(true);
  } finally {
    await page.request.delete(`/api/sharing-images/${image.id}`);
  }
});

test('a search title longer than a result shows, and an empty one, are refused', async ({ page, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();
  const withHome = (section: Partial<Section>) => ({ ...entry, home: { ...entry.home, ...section } });

  const refused: Record<string, SearchSettings> = {
    'a title longer than its place': withHome({ title: arabic('ع'.repeat(71)) }),
    'a description longer than its place': withHome({ description: arabic('ع'.repeat(181)) }),
    'an empty title': withHome({ title: arabic('') }),
    'a title of spaces': withHome({ title: arabic('   ') }),
    'an empty description': withHome({ description: arabic('') }),
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await search.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // On the referral page, where an amount may be named, a name the site does
  // not hold is refused rather than shown to a visitor in braces.
  const wrongName = await search.attempt({ ...entry, referral: { ...entry.referral, title: arabic('ربائد · {bonus}') } }, 'published');
  expect(wrongName.status(), 'a value the site does not hold').toBe(400);

  expect(await search.published()).toEqual(entry);
});

test('what /llms.txt tells an assistant is what the page says, both from the CMS', async ({ page, request, cms }) => {
  const search = cms.entry('search-settings');
  const entry = await search.published();
  const llms = await (await request.get('/llms.txt')).text();

  // The tool page's line, which an assistant quotes, is the Editor's.
  expect(llms).toContain(entry.tool.description.ar);
  const page_ = await (await request.get('/tool')).text();
  expect(page_).toContain(entry.tool.description.ar);
});
