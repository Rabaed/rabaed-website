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
 * Visitors never see a draft, but every preview does: the admin's preview
 * draws every entry's latest draft, so another suite previewing a page while
 * a draft here is waiting is shown this suite's words in place of the ones it
 * expects. The product page suite's swipe hint was, once. So the suite **runs
 * against the second test server** (`playwright.config.ts`, ticket 89), one
 * suite at a time, where nothing previews beside it. `english-pages.spec.ts`
 * publishes these words in English there, and puts them back before it is
 * done, so that this suite finds them in Arabic alone, as the founder left
 * them.
 *
 * The tests sign in as an editor of their own and run one at a time, and what
 * they change is put back when each ends (`entries.ts`).
 */
import type { APIRequestContext, Page } from '@playwright/test';
import { test, expect, type CmsEntry, type Entry, type Version } from './entries';
import { sidewaysOverflow, sidewaysOverflowOf } from './geometry';
import { ROUTES } from './routes';

test.describe.configure({ mode: 'default' });

type SiteWords = Entry<'site-words'>;
/** A word as the CMS holds it: its Arabic and its English. */
type Words = SiteWords['footer']['tagline'];
type Link = SiteWords['header']['links'][number];
type Column = SiteWords['footer']['columns'][number];

const arabic = (words: string): Words => ({ ar: words, en: null });

async function visitorHtml(request: APIRequestContext, path = '/'): Promise<string> {
  return (await request.get(path)).text();
}

test('every page shows the header and footer the CMS has published', async ({ page, request, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();

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
    for (const column of entry.footer.columns) {
      expect(html, path).toContain(column.heading.ar);
      for (const link of column.links) {
        if (link.path !== '/case-studies') expect(html, path).toContain(link.label.ar);
      }
    }
  }
});

test('the not-found page and both index leads are the CMS’s words', async ({ page, request, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  const leads = await cms.entry('index-leads').published();

  const missing = await visitorHtml(request, '/a-page-that-is-not-here');
  expect(missing).toContain(entry.notFound.heading.ar);
  expect(missing).toContain(entry.notFound.lead.ar);
  expect(missing).toContain(entry.notFound.homeLabel.ar);

  expect(await visitorHtml(request, '/blog')).toContain(leads.blog.lead.ar);
  expect(await visitorHtml(request, '/en/blog')).toContain(leads.blog.lead.en);
});

test('the swipe hint over a Screen mock is the CMS’s, in both languages, and a reworded one is previewed', async ({
  page,
  request,
  cms,
}) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  // Written in both languages by ticket 77's migration, the English waiting
  // for the day the entry is published in English.
  expect(entry.screenMocks.swipeHint).toEqual({ ar: 'اسحب لرؤية الشاشة كاملة', en: 'Swipe to see the whole screen' });

  const reworded = 'مرّر الشاشة جانباً';
  const swipeHint = { ...entry.screenMocks.swipeHint, ar: reworded };
  await siteWords.draft({ ...entry, screenMocks: { ...entry.screenMocks, swipeHint } });

  await page.setViewportSize({ width: 390, height: 812 });
  for (const path of ['/', '/product']) {
    await cms.preview(path);
    await expect(page.locator('.pan-hint').first(), path).toHaveText(reworded);
    expect(await visitorHtml(request, path), path).not.toContain(reworded);
  }
});

test('the words on a Phone crop and its whole screen are the CMS’s, in both languages, and reworded ones are previewed', async ({
  page,
  request,
  cms,
}) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  // Written in both languages by ticket 78's migration, the English waiting
  // for the day the entry is published in English.
  expect(entry.screenMocks).toMatchObject({
    openWhole: { ar: 'اضغط لرؤية الشاشة كاملة', en: 'Tap to see the whole screen' },
    closeWhole: { ar: 'إغلاق', en: 'Close' },
    zoomWhole: { ar: 'تكبير', en: 'Zoom' },
  });

  const reworded = { openWhole: 'المس لعرض الشاشة', closeWhole: 'رجوع', zoomWhole: 'قرّب' };
  const screenMocks = Object.fromEntries(
    Object.entries(entry.screenMocks).map(([name, words]) => [
      name,
      name in reworded ? { ...words, ar: reworded[name as keyof typeof reworded] } : words,
    ]),
  ) as SiteWords['screenMocks'];
  await siteWords.draft({ ...entry, screenMocks });

  await page.setViewportSize({ width: 390, height: 812 });
  for (const path of ['/', '/product']) {
    await cms.preview(path);
    const opener = page.getByRole('button', { name: reworded.openWhole }).first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const whole = page.getByRole('dialog');
    await expect(whole.getByRole('button', { name: reworded.zoomWhole }), path).toBeVisible();
    await whole.getByRole('button', { name: reworded.closeWhole }).click();
    await expect(whole, path).toBeHidden();
    expect(await visitorHtml(request, path), path).not.toContain(reworded.openWhole);
  }
});

test('a reworded menu label is previewed, renames the page in the search trail, and never reaches a visitor', async ({
  page,
  request,
  cms,
}) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  const renamed = 'المنتَج والخدمة';
  const links = entry.header.links.map((link) => (link.path === '/product' ? { ...link, label: arabic(renamed) } : link));

  await siteWords.draft({ ...entry, header: { ...entry.header, links } });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/product');
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
});

test('a link an Editor points somewhere else leads there, on every page', async ({ page, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  const links = entry.header.links.map((link) => (link.path === '/start' ? { ...link, path: '/tool' } : link));

  await siteWords.draft({ ...entry, header: { ...entry.header, links } });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');
  const moved = entry.header.links.find((link) => link.path === '/start')!;
  await expect(page.locator('.nav .links').getByRole('link', { name: moved.label.ar, exact: true })).toHaveAttribute(
    'href',
    '/tool',
  );
});

test('a menu of the longest labels the CMS allows still sits on one line', async ({ page, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
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

  await siteWords.draft(filled);

  // 1100px is where the panel gives way to a row of links — 981px until
  // ticket 40 made room for the language switcher (`src/styles/shell.css`).
  await page.setViewportSize({ width: 1100, height: 900 });
  await cms.preview('/');

  // The header's own row: the panel that replaces it below 1100px has a
  // `.wrap` of its own.
  const row = page.locator('.nav > .wrap');
  await expect(row).toBeVisible();

  // One line: every link's box starts at the same height as the first.
  const tops = await page.locator('.nav .links > a, .nav .links .nsub').evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size, 'the menu wrapped onto a second line').toBe(1);

  // And nothing in the header is pushed outside it, at this width or wider.
  for (const width of [1100, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await sidewaysOverflowOf(row);
    expect(overflow, `the header overflows at ${width}px`).toBeLessThanOrEqual(0);
  }

  // And below it, the panel's one row still holds Login and the language
  // side by side at the narrowest phone, with Login at its longest (ticket 76).
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator('.navtog').click();
  await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'true');
  expect(await sharesARow(page), 'Login and the language no longer fit on one row at 320px').toBe(true);
});

/**
 * Whether the panel's Login and language link sit side by side: the same
 * middle line, neither box overlapping the other, and nothing pushed past the
 * panel's edge.
 */
async function sharesARow(page: Page): Promise<boolean> {
  return page.locator('.mnav').evaluate((panel) => {
    const login = panel.querySelector('.mlogin')!.getBoundingClientRect();
    const language = panel.querySelector('.mlang')!.getBoundingClientRect();
    const wrap = panel.querySelector('.wrap')!;
    const middle = (box: DOMRect) => box.top + box.height / 2;
    const apart = login.right <= language.left || language.right <= login.left;
    return Math.abs(middle(login) - middle(language)) < 2 && apart && wrap.scrollWidth <= wrap.clientWidth;
  });
}

test('a label longer than the header carries, an address that is not an address, an empty menu and an overfull footer are refused', async ({
  page,
  cms,
}) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  const link = { label: arabic('رابط'), path: '/product' };
  const withLinks = (links: Link[]) => ({ ...entry, header: { ...entry.header, links } });
  const column: Column = { heading: arabic('عمود'), links: [link] };
  const withColumns = (columns: Column[]) => ({ ...entry, footer: { ...entry.footer, columns } });

  const refused: Record<string, SiteWords> = {
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
    'five footer columns': withColumns(Array.from({ length: 5 }, () => column)),
    'seven links in a footer column': withColumns([{ ...column, links: Array.from({ length: 7 }, () => link) }]),
    'a footer column with no links': withColumns([{ ...column, links: [] }]),
    'no footer columns at all': withColumns([]),
    'a footer column with no heading': withColumns([{ ...column, heading: arabic('') }]),
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
    'no Arabic': { ...entry, languages: ['en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await siteWords.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(await siteWords.published()).toEqual(entry);
});

test('an English page carries no Arabic header or footer in place of English it has not got', async ({ page, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();

  // Not a word of the Arabic menu or footer is drawn: an English page has
  // neither until the founder publishes their English, rather than the
  // Arabic in their place. The notice an untranslated page's English address
  // shows is an English page like any other.
  for (const path of ['/en/blog', '/en/product']) {
    await page.goto(path);
    await expect(page.locator('.nav'), path).toHaveCount(0);
    await expect(page.locator('footer'), path).toHaveCount(0);
    const body = page.locator('body');
    for (const link of entry.header.links) await expect(body).not.toContainText(link.label.ar);
    await expect(body).not.toContainText(entry.footer.tagline.ar);
    await expect(body).not.toContainText(entry.footer.rights.ar);
  }
});

/**
 * The English header and footer (ticket 40), proposed by
 * `20260923_090000_propose_english_site_words` and published by nobody but the
 * founder: the words are his. What is proposed is restated here rather than
 * imported, for the reason `routes.ts` gives.
 */
const ENGLISH = {
  links: { '/': 'Home', '/product': 'Product', '/start': 'Get started' },
  partnershipsLabel: 'Partners',
  partnerships: { '/referral': 'Referral Program', '/partnership': 'Partnership Program' },
  signInLabel: 'Sign in',
  demoLabel: 'Book a demo',
  tagline: 'Operating system for construction projects · Riyadh · rabaedapp.com',
  /** The Footer directory's, proposed with the rest by ticket 75's migration. */
  columns: {
    Rabaed: { '/': 'Home', '/product': 'Product', '/start': 'Get started', '/tool': 'Pour Tracker' },
    Programs: { '/referral': 'Referral Program', '/partnership': 'Partnership Program' },
    Resources: { '/blog': 'Blog', '/case-studies': 'Customer stories' },
    Legal: {
      '/terms': 'Terms and conditions (Arabic)',
      '/privacy': 'Privacy policy (Arabic)',
      '/referral-terms': 'Referral Terms (Arabic)',
    },
  },
  rights: 'Rabaed · All rights reserved',
};

/**
 * The proposal, among the entry's versions: this suite drafts and discards all
 * the while, so the proposal is seldom still the newest version by the time a
 * test looks.
 */
async function englishProposal(siteWords: CmsEntry<'site-words'>): Promise<Version<'site-words'>> {
  const proposal = (await siteWords.drafts()).find((draft) => draft.version.header.demoLabel.en === ENGLISH.demoLabel);
  expect(proposal, 'no draft carries the English words proposed').toBeTruthy();
  return proposal!;
}

test('the English words wait in the CMS as a draft, every one of them written', async ({ page, request, cms }) => {
  const siteWords = cms.entry('site-words');
  const { version } = await englishProposal(siteWords);

  // Published in English as well as Arabic the moment the founder presses
  // Publish: nothing is left for him to fill in first.
  expect(version.languages).toEqual(['ar', 'en']);
  const english = (links: Link[]) => Object.fromEntries(links.map((link) => [link.path, link.label.en]));
  expect(english(version.header.links)).toMatchObject(ENGLISH.links);
  expect(version.header.links.find((link) => link.path === '/case-studies')?.label.en).toBeTruthy();
  expect(version.header.partnershipsLabel.en).toBe(ENGLISH.partnershipsLabel);
  expect(english(version.header.partnerships)).toEqual(ENGLISH.partnerships);
  for (const group of version.header.partnerships) expect(group.summary.en, group.path).toBeTruthy();
  expect(version.header.signInLabel.en).toBe(ENGLISH.signInLabel);
  expect(version.footer.tagline.en).toBe(ENGLISH.tagline);
  expect(
    Object.fromEntries(version.footer.columns.map((column) => [column.heading.en, english(column.links)])),
  ).toEqual(ENGLISH.columns);
  expect(version.footer.rights.en).toBe(ENGLISH.rights);
  for (const words of Object.values(version.notFound)) expect(words.en).toBeTruthy();

  // And the Arabic is untouched: the draft is the published entry with English added.
  const entry = await siteWords.published();
  expect(entry.languages).toEqual(['ar']);
  expect(version.header.links.map((link) => link.label.ar)).toEqual(entry.header.links.map((link) => link.label.ar));
  expect(version.footer.tagline.ar).toBe(entry.footer.tagline.ar);

  // No visitor reads a word of it.
  for (const path of ['/en', '/en/blog']) expect(await visitorHtml(request, path)).not.toContain(ENGLISH.tagline);
});

test('previewed, English pages have the English header and footer, and switch to the same page in Arabic', async ({
  page,
  cms,
}) => {
  // The proposal made the draft Preview draws, as restoring it from the admin's Versions does.
  const siteWords = cms.entry('site-words');
  await siteWords.restoreVersion(await englishProposal(siteWords));

  await page.setViewportSize({ width: 1280, height: 900 });
  // Each English page, and the Arabic address its switcher must lead to:
  // the same page where there is one, the Arabic original of a notice, and
  // the Arabic home page for the English home page.
  const pages = [
    { path: '/en', arabic: '/', marks: 'Home' },
    { path: '/en/blog', arabic: '/blog', marks: null },
    { path: '/en/product', arabic: '/product', marks: 'Product' },
    { path: '/en/terms', arabic: '/terms', marks: null },
  ];
  for (const { path, arabic: arabicPath, marks } of pages) {
    await cms.preview(path);
    const nav = page.locator('.nav');

    for (const [to, label] of Object.entries(ENGLISH.links)) {
      await expect(nav.locator('.links').getByRole('link', { name: label, exact: true }), path).toHaveAttribute(
        'href',
        to === '/' ? '/en' : `/en${to}`,
      );
    }
    await expect(nav.locator('.nsub-t'), path).toContainText(ENGLISH.partnershipsLabel);
    await expect(nav.locator('.login'), path).toHaveText(ENGLISH.signInLabel);
    await expect(nav.locator('.nav-cta .btn'), path).toHaveText(ENGLISH.demoLabel);
    await expect(nav.locator('.links > a.on'), path).toHaveText(marks ? [marks] : []);

    const switcher = nav.locator('.lang');
    await expect(switcher, path).toHaveText('العربية');
    await expect(switcher, path).toHaveAttribute('href', arabicPath);
    await expect(switcher, path).toHaveAttribute('hreflang', 'ar');
    await expect(switcher, `${path} has Arabic, so says nothing more`).not.toHaveAttribute('aria-label', /.+/);

    const footer = page.locator('footer');
    await expect(footer, path).toContainText(ENGLISH.tagline);
    await expect(footer, path).toContainText(ENGLISH.rights);
    // The legal documents are Arabic only, so the footer leads straight to
    // the Arabic, and says so (ADR-0020).
    const terms = footer.getByRole('link', { name: ENGLISH.columns.Legal['/terms'] });
    await expect(terms, path).toHaveAttribute('href', '/terms');
    await expect(terms, path).toHaveAttribute('hreflang', 'ar');
    await expect(footer.getByRole('link', { name: 'LinkedIn' }), path).toHaveCount(1);
  }
});

test('the English panel mirrors the Arabic one: Login on the left, Arabic on the right', async ({ page, cms }) => {
  // The proposal made the draft Preview draws, as restoring it from the admin's Versions does.
  const siteWords = cms.entry('site-words');
  await siteWords.restoreVersion(await englishProposal(siteWords));

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 812 });
    await cms.preview('/en');
    await page.locator('.navtog').click();
    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'true');

    const panel = page.locator('.mnav');
    const login = await panel.getByRole('link', { name: ENGLISH.signInLabel }).boundingBox();
    const language = await panel.getByRole('link', { name: 'العربية' }).boundingBox();
    expect(await sharesARow(page), `one row at ${width}px`).toBe(true);
    expect(language!.x, `Login on the left at ${width}px`).toBeGreaterThan(login!.x + login!.width);
  }
});

test('the English header sits on one line wherever it is a row', async ({ page, cms }) => {
  // The proposal made the draft Preview draws, as restoring it from the admin's Versions does.
  const siteWords = cms.entry('site-words');
  await siteWords.restoreVersion(await englishProposal(siteWords));

  await page.setViewportSize({ width: 1100, height: 900 });
  await cms.preview('/en');

  const tops = await page.locator('.nav .links > a, .nav .links .nsub').evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size, 'the English menu wrapped onto a second line').toBe(1);

  const row = page.locator('.nav > .wrap');
  for (const width of [1100, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await sidewaysOverflowOf(row);
    expect(overflow, `the English header overflows at ${width}px`).toBeLessThanOrEqual(0);
  }
});

test('a change published reaches visitors', async ({ page, request, cms }) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  // A space at the end of the footer's line: in the HTML, but drawn nowhere.
  const tagline = `${entry.footer.tagline.ar} `;

  await siteWords.publish({ ...entry, footer: { ...entry.footer, tagline: { ...entry.footer.tagline, ar: tagline } } });
  await expect.poll(async () => visitorHtml(request)).toContain(`${tagline}</div>`);

  // A publish marks every page for rebuilding, and a rebuilt page must still
  // be the page: the English notice of an Arabic-only page once came back
  // from its first rebuild as «not found» (ticket 40).
  for (const path of ['/en/product', '/en/terms']) {
    await expect.poll(async () => (await request.get(path)).status(), path).toBe(200);
  }
});

/**
 * The Footer directory (ticket 75, ADR-0020): the columns of links at the
 * foot of every page, through which every page of the site can be reached.
 * Not the sitemap, which is the file search engines read.
 *
 * What the migration wrote is restated here rather than imported, for the
 * reason `routes.ts` gives. The case studies link is left out: no story is
 * published while this suite runs, and the link waits for the first
 * (`case-studies.spec.ts`, on the same server, publishes one and finds it,
 * and deletes it when each test ends).
 */
const DIRECTORY = [
  {
    heading: 'ربائد',
    links: [
      ['الرئيسية', '/'],
      ['المنتج', '/product'],
      ['ابدأ', '/start'],
      ['متتبّع الصبّات', '/tool'],
    ],
  },
  {
    heading: 'البرامج',
    links: [
      ['برنامج الإحالة', '/referral'],
      ['برنامج الشراكات', '/partnership'],
    ],
  },
  { heading: 'المصادر', links: [['المدونة', '/blog']] },
  {
    heading: 'قانوني',
    links: [
      ['الشروط والأحكام', '/terms'],
      ['سياسة الخصوصية', '/privacy'],
      ['شروط برنامج الإحالة', '/referral-terms'],
    ],
  },
];

/** The directory as a visitor's browser has it: each column's heading, and its links' words and addresses in order. */
function readDirectory(page: Page, name: string) {
  return page
    .locator('footer')
    .getByRole('navigation', { name })
    .evaluate((directory) =>
      [...directory.children].map((column) => ({
        heading: column.querySelector('h2')?.textContent,
        links: [...column.querySelectorAll('a')].map((link) => [link.textContent, link.getAttribute('href')]),
      })),
    );
}

test('every Arabic page’s footer is the Footer directory: four columns, in order', async ({ page, cms }) => {
  for (const { path } of ROUTES.filter((route) => route.locale === 'ar')) {
    await page.goto(path);
    expect(await readDirectory(page, 'روابط الموقع'), path).toEqual(DIRECTORY);
  }

  // Above it and below it, the footer is what it was: the wordmark, the
  // tagline and the icons, then the rights line.
  const footer = page.locator('footer');
  expect(await footer.evaluate((element) => [...element.children].map((child) => child.className))).toEqual([
    'wrap',
    'wrap foot-dir',
    'wrap foot-bar',
  ]);
  await expect(footer.locator('.social a')).toHaveCount(5);
  await expect(footer.locator('.foot-bar')).toContainText('© 2026');
});

test('previewed, the English footer is the same four columns in English, and its legal links lead to the Arabic', async ({
  page,
  cms,
}) => {
  // The proposal made the draft Preview draws, as restoring it from the admin's Versions does.
  const siteWords = cms.entry('site-words');
  await siteWords.restoreVersion(await englishProposal(siteWords));

  for (const path of ['/en', '/en/blog']) {
    await cms.preview(path);
    expect(await readDirectory(page, 'Site links'), path).toEqual([
      {
        heading: 'Rabaed',
        links: [
          ['Home', '/en'],
          ['Product', '/en/product'],
          ['Get started', '/en/start'],
          ['Pour Tracker', '/en/tool'],
        ],
      },
      {
        heading: 'Programs',
        links: [
          ['Referral Program', '/en/referral'],
          ['Partnership Program', '/en/partnership'],
        ],
      },
      // No English case study is published, so no Customer stories.
      { heading: 'Resources', links: [['Blog', '/en/blog']] },
      {
        heading: 'Legal',
        links: [
          ['Terms and conditions (Arabic)', '/terms'],
          ['Privacy policy (Arabic)', '/privacy'],
          ['Referral Terms (Arabic)', '/referral-terms'],
        ],
      },
    ]);

    // The three legal documents are in Arabic alone, and their links say so
    // to a browser and a crawler as well as in their words; no other link
    // claims a language of its own.
    const marked = page.locator('footer nav a[hreflang]');
    await expect(marked, path).toHaveCount(3);
    for (const link of await marked.all()) await expect(link, path).toHaveAttribute('hreflang', 'ar');
    await expect(marked.first(), path).toHaveAttribute('href', '/terms');
  }
});

test('on a phone the Footer directory sits two by two, and on a desktop four across', async ({ page, cms }) => {
  /** Each column's box, in the order the directory lists them. */
  const columns = () =>
    page.locator('footer nav .foot-col').evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { top: Math.round(box.top), left: Math.round(box.left), right: Math.round(box.right) };
      }),
    );
  const sideways = () => sidewaysOverflow(page);

  await page.goto('/');
  for (const width of [360, 390, 768, 980]) {
    await page.setViewportSize({ width, height: 900 });
    const [rabaed, programmes, resources, legal] = await columns();
    // Rabaed and Programmes on top, Resources and Legal below, each row read
    // from the right, as the page is.
    expect(programmes.top, `${width}px: Programmes beside Rabaed`).toBe(rabaed.top);
    expect(legal.top, `${width}px: Legal beside Resources`).toBe(resources.top);
    expect(resources.top, `${width}px: the second row below the first`).toBeGreaterThan(rabaed.top);
    expect(programmes.right, `${width}px: Programmes to the left of Rabaed`).toBeLessThanOrEqual(rabaed.left);
    expect(legal.right, `${width}px: Legal to the left of Resources`).toBeLessThanOrEqual(resources.left);
    expect(resources.left, `${width}px: the two rows line up`).toBe(rabaed.left);
    expect(await sideways(), `${width}px: the page scrolls sideways`).toBe(0);
  }

  for (const width of [981, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    const boxes = await columns();
    expect(new Set(boxes.map((box) => box.top)).size, `${width}px: four across`).toBe(1);
    const lefts = boxes.map((box) => box.left);
    expect(lefts, `${width}px: from the right, in order`).toEqual([...lefts].sort((a, b) => b - a));
  }
});

test('an Editor renames a column, and rewords, reorders, adds and removes its links, in preview and not for visitors', async ({
  page,
  request,
  cms,
}) => {
  const siteWords = cms.entry('site-words');
  const entry = await siteWords.published();
  const [rabaed, ...rest] = entry.footer.columns;
  const renamed = 'عن ربائد';
  const reworded = 'جولة في المنتج';
  // The product link reworded and moved to the top, the tool page's removed,
  // and a page the header has no room for added at the end.
  const edited: Column = {
    heading: arabic(renamed),
    links: [
      { label: arabic(reworded), path: '/product' },
      ...rabaed.links.filter((link) => link.path !== '/product' && link.path !== '/tool'),
      { label: arabic('مقالات أقدم'), path: '/blog/page/2' },
    ],
  };

  await siteWords.draft({ ...entry, footer: { ...entry.footer, columns: [edited, ...rest] } });

  await cms.preview('/start');
  const [first, ...others] = await readDirectory(page, 'روابط الموقع');
  expect(first).toEqual({
    heading: renamed,
    links: [
      [reworded, '/product'],
      ['الرئيسية', '/'],
      ['ابدأ', '/start'],
      ['مقالات أقدم', '/blog/page/2'],
    ],
  });
  expect(others).toEqual(DIRECTORY.slice(1));

  const html = await visitorHtml(request, '/start');
  expect(html).not.toContain(renamed);
  expect(html).not.toContain(reworded);
});
