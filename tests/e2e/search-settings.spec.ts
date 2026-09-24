/**
 * How a page appears in a search result and when its link is shared, in the
 * CMS (ticket 26): Ahmed rewrites a page's search title and the line under it,
 * gives a page a picture of its own for when the link is unfurled, and the CMS
 * refuses a picture the places that unfurl links would crop differently.
 *
 * Each page's are the **Search and sharing** tab of its own entry (ticket 91),
 * so a page's are published with it, in its languages.
 *
 * The six pages' titles are read by `search-foundations.spec.ts`, which holds
 * every page to a unique title and description, and by `ai-crawlers.spec.ts`,
 * which holds `/llms.txt` to saying what the page says. So nothing here is
 * published, and nothing here is saved to a page's entry at all: each page's
 * own suite saves its drafts there, beside this one, and would find this
 * suite's among them. Rewording a title and giving a page a picture of its
 * own are the product page's suite's to try (`product-text.spec.ts`); a
 * refused change is never saved, and is tried here.
 */
import sharp from 'sharp';
import { uploadSharingImage } from './cms';
import { test, expect, fields, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

type Search = Entry<'home-page'>['search'];
type Words = Search['title'];

/** Each page's address, and its own entry. */
const PAGES = [
  ['/', 'home-page'],
  ['/product', 'product-page'],
  ['/start', 'start-page'],
  ['/tool', 'tool-page'],
  ['/referral', 'referral-page'],
  ['/partnership', 'partnership-page'],
] as const;

const arabic = (words: string): Words => ({ ar: words, en: null });

test('every page is described in search by what its own entry has published', async ({ request, cms }) => {

  // The referral page's words name an amount the page inserts, which the next
  // test holds it to.
  for (const [path, slug] of PAGES.filter(([path]) => path !== '/referral')) {
    const { search } = await cms.entry(slug).published();
    const html = await (await request.get(path)).text();
    expect(html, `${path} title`).toContain(search.title.ar);
    expect(html, `${path} description`).toContain(search.description.ar);
  }
});

test('the referral page names the programme’s amounts rather than stating them', async ({ request, cms }) => {
  const { search } = await cms.entry('referral-page').published();
  const html = await (await request.get('/referral')).text();

  // What the CMS holds has the names in it …
  expect(search.title.ar).toContain('{payout}');
  // … and what a visitor is shown has the amount, with no name left over.
  expect(html).not.toContain('{payout}');
  expect(html).not.toContain('{clientDiscount}');
  const stated = search.title.ar.replace('{payout}', '');
  for (const word of stated.split('·')[1]?.trim().split(' ').slice(0, 2) ?? []) {
    expect(html, word).toContain(word);
  }
});

test('a search title longer than a result shows, and an empty one, are refused', async ({ page, cms }) => {
  const homePage = cms.entry('home-page');
  const referralPage = cms.entry('referral-page');
  const home = await homePage.published();
  const withSearch = (search: Partial<Search>) => ({ ...home, search: { ...home.search, ...search } });

  const refused: Record<string, Entry<'home-page'>> = {
    'a title longer than its place': withSearch({ title: arabic('ع'.repeat(71)) }),
    'a description longer than its place': withSearch({ description: arabic('ع'.repeat(181)) }),
    'an empty title': withSearch({ title: arabic('') }),
    'a title of spaces': withSearch({ title: arabic('   ') }),
    'an empty description': withSearch({ description: arabic('') }),
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await homePage.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
    // For the search title or description itself, not for some other word on the page.
    expect(await response.text(), what).toMatch(/search\.(title|description)\.ar/);
  }

  // On the referral page, where an amount may be named, a name the site does
  // not hold is refused rather than shown to a visitor in braces.
  const referral = await referralPage.published();
  const wrongName = await referralPage.attempt(
    { ...referral, search: { ...referral.search, title: arabic('ربائد · {bonus}') } },
    'published',
  );
  expect(wrongName.status(), 'a value the site does not hold').toBe(400);

  expect((await homePage.published()).search).toEqual(home.search);
  expect((await referralPage.published()).search).toEqual(referral.search);
});

/**
 * A page is published in English with its search title's English, or not at
 * all (ticket 91): its title is the English page's name in a search result.
 * Tried on the start page's English proposal (ticket 42), whose every word has
 * its English, with only the search title's taken out.
 */
test('a page published in English without its search title in English is refused, naming it', async ({ page, cms }) => {
  // The entry's newest version, which the admin opens: the proposal.
  const newest = await page.request.get('/api/globals/start-page?depth=0&draft=true');
  expect(newest.ok(), await newest.text()).toBe(true);
  const proposal: Entry<'start-page'> = fields(await newest.json());
  const response = await cms.entry('start-page').attempt(
    { ...proposal, languages: ['ar', 'en'], search: { ...proposal.search, title: { ...proposal.search.title, en: '' } } },
    'published',
  );

  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('search.title.en');
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

test('what /llms.txt tells an assistant is what the page says, both from the CMS', async ({ request, cms }) => {
  const { search } = await cms.entry('tool-page').published();
  const llms = await (await request.get('/llms.txt')).text();

  // The tool page's line, which an assistant quotes, is the Editor's.
  expect(llms).toContain(search.description.ar);
  const html = await (await request.get('/tool')).text();
  expect(html).toContain(search.description.ar);
});
