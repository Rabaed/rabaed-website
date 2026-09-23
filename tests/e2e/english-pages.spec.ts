/**
 * The English pages (ticket 42): proposed to the founder as drafts, read by no
 * visitor until he publishes them, and — once he does — pages of the site like
 * any other, in English, left to right, with their own titles, structured data
 * and forms.
 *
 * **Runs last** (`playwright.config.ts`). To preview the proposals it does
 * what the founder does to approve one — makes it the draft its entry opens
 * on, and ticks English among the languages it is published in — and to hold
 * a published English page to what a page of the site is held to it publishes
 * one: the start page, and what it reads beside its own entry — the Trust
 * strip, the search settings, its questions, its form's English, and the
 * header and footer's (ticket 40). The page-text suites edit these
 * entries all the while, and would find a draft of this suite's under theirs;
 * nothing that runs last reads them. The Arabic of every entry published here
 * is the Arabic already published: the proposals carry it unchanged.
 *
 * What English would say is not asserted word for word here — it is the
 * founder's to change, and `tests/unit/english-words.spec.ts` holds the words
 * proposed. What is asserted is what any English would have to do: be
 * English, fill the page, and never leave Arabic in its place.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { ENGLISH_PAGES_EDITOR, logInByApi, reachesVisitors, reaching, uploadImage } from './cms';
import { mailTo, submissionsFrom, uniqueApplicant } from './forms';
import { expectPhoneCrop, expectWholeToSwipe, frameShowing, mediaFiles } from './screen-mock-phone';
import { phoneCropExportSize, SCREEN_MOCKS } from '../../src/screen-mocks/registry';

test.describe.configure({ mode: 'default' });

/**
 * Every entry an English page reads beside the header and footer: this
 * ticket's proposals, and the Screen mocks, whose English is ticket 41's.
 */
const ENTRIES = [
  'home-page',
  'product-page',
  'start-page',
  'tool-page',
  'referral-page',
  'partnership-page',
  'closing-section',
  'screen-mocks',
  'trust-strip',
  'search-settings',
] as const;

/** The six English pages, and the entry each is its own. */
const OWN_ENTRY: Readonly<Record<string, (typeof ENTRIES)[number]>> = {
  '/en': 'home-page',
  '/en/product': 'product-page',
  '/en/start': 'start-page',
  '/en/tool': 'tool-page',
  '/en/referral': 'referral-page',
  '/en/partnership': 'partnership-page',
};
const PAGES = Object.keys(OWN_ENTRY);

/** Anything with an Arabic letter in it. */
const ARABIC = /[\u0600-\u06FF]/;

type Version = { id: string; updatedAt: string; version: Record<string, unknown> & { languages?: string[]; _status?: string } };

async function versions(editor: APIRequestContext, slug: string, status: 'draft' | 'published'): Promise<Version[]> {
  const response = await editor.get(
    `/api/globals/${slug}/versions?where[version._status][equals]=${status}&sort=-updatedAt&limit=100&depth=0`,
  );
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).docs;
}

/**
 * The proposal: among the entry's drafts, one with its English written — the
 * newest, since restoring a version saves a copy of it as a new draft.
 */
async function proposal(editor: APIRequestContext, slug: string): Promise<Version> {
  const drafts = await versions(editor, slug, 'draft');
  const proposed = drafts.find((draft) => {
    const all = words(draft.version);
    return all.length > 0 && all.every((word) => typeof word.en === 'string' && word.en.trim() !== '');
  });
  expect(proposed, `${slug} has no draft with its English written`).toBeTruthy();
  return proposed!;
}

/** Every word in Arabic and in English in a version, with where it is. */
function words(value: unknown, path: string[] = []): { path: string; ar: string; en: unknown }[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => words(item, [...path, String(index)]));
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const own = 'ar' in record && 'en' in record && typeof record.ar === 'string' && record.ar.trim() !== ''
    ? [{ path: path.join('.'), ar: record.ar, en: record.en }]
    : [];
  return [...own, ...Object.entries(record).flatMap(([key, inner]) => words(inner, [...path, key]))];
}

/**
 * Approves the entry's proposal as the founder does: makes it the draft the
 * entry opens on, as restoring it from the admin's Versions does, ticks
 * English among the languages it is published in, and saves it — as a draft,
 * or published.
 */
async function approve(editor: APIRequestContext, slug: string, status: 'draft' | 'published'): Promise<void> {
  const { id } = await proposal(editor, slug);
  const restored = await editor.post(`/api/globals/${slug}/versions/${id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
  const draft = await editor.get(`/api/globals/${slug}?draft=true&depth=0`);
  expect(draft.ok()).toBe(true);
  const saved = await editor.post(`/api/globals/${slug}${status === 'draft' ? '?draft=true' : ''}`, {
    data: { ...(await draft.json()), languages: ['ar', 'en'], _status: status },
  });
  expect(saved.ok(), await saved.text()).toBe(true);
}

/**
 * The header and footer's English (ticket 40), which every English page is
 * drawn in and is published in English only with: its proposal is the draft
 * already published in English.
 */
async function approveSiteWords(editor: APIRequestContext, status: 'draft' | 'published'): Promise<void> {
  const [proposed] = (await versions(editor, 'site-words', 'draft')).filter((draft) => draft.version.languages?.includes('en'));
  expect(proposed, 'the English header and footer are not proposed').toBeTruthy();
  const restored = await editor.post(`/api/globals/site-words/versions/${proposed.id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
  if (status === 'draft') return;
  const draft = await editor.get('/api/globals/site-words?draft=true&depth=0');
  const published = await editor.post('/api/globals/site-words', { data: { ...(await draft.json()), _status: 'published' } });
  expect(published.ok(), await published.text()).toBe(true);
}

/** The page's text as a visitor reads it, less the preview's own banner, which only an Editor sees. */
function readText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const body = document.body.cloneNode(true) as HTMLElement;
    body.querySelectorAll('[role="status"], script, style, noscript').forEach((element) => element.remove());
    return body.innerText;
  });
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('every entry the English pages read waits as a draft, with every word of it in English', async ({ request }) => {
  await logInByApi(request, ENGLISH_PAGES_EDITOR);

  for (const slug of ENTRIES.filter((each) => each !== 'screen-mocks')) {
    const proposed = await proposal(request, slug);
    // English is not ticked: ticking it is the founder's approval, and an
    // Arabic edit published on top of the draft must not publish its English.
    expect(proposed.version.languages, slug).toEqual(['ar']);
    const missing = words(proposed.version).filter((word) => typeof word.en !== 'string' || word.en.trim() === '');
    expect(missing, `${slug}: Arabic words left without English`).toEqual([]);

    // And the English is English: no word of it is the Arabic in its place,
    // save a name written in Latin letters in the Arabic box too.
    for (const word of words(proposed.version)) expect(String(word.en), `${slug} ${word.path}`).not.toMatch(ARABIC);

    // Nothing is published in English: a visitor reads none of it.
    const [published] = await versions(request, slug, 'published');
    expect(published.version.languages, `${slug} is published in English`).toEqual(['ar']);
  }

  // So every English address is still what it was: the home page says the
  // English site is on its way, and every other says the page is not in
  // English yet, and offers the Arabic.
  expect(await (await request.get('/en')).text()).toContain('The English site is on its way.');
  for (const path of PAGES.slice(1)) {
    expect(await (await request.get(path)).text(), path).toContain('This page is not available in English yet.');
  }
});

test('previewed, each English page is the whole page, in English, left to right', async ({ page }) => {
  await logInByApi(page.request, ENGLISH_PAGES_EDITOR);
  for (const slug of ENTRIES) await approve(page.request, slug, 'draft');
  await approveSiteWords(page.request, 'draft');

  let eyebrows = 0;
  for (const path of PAGES) {
    // The page itself, not the notice that stands for it. `stale-render.spec.ts`
    // runs beside this and publishes the tool page from its published words,
    // which leaves this draft under a newer version: should that land between
    // approving and previewing, the page's own proposal is approved again.
    await expect(async () => {
      await page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
      await expect(page.getByRole('status').first()).toContainText('معاينة');
      const notice = await page.locator('h1').textContent();
      if (/not available in English|on its way/.test(notice ?? '')) {
        await approve(page.request, OWN_ENTRY[path], 'draft');
        throw new Error(`${path} shows its notice`);
      }
    }).toPass({ timeout: 60_000 });

    await expect(page.locator('html'), path).toHaveAttribute('lang', 'en');
    await expect(page.locator('html'), path).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('main, section').first(), path).toBeVisible();

    // Not a word of Arabic in place of English, but the header's switcher,
    // which names Arabic in Arabic: that is its point.
    const text = (await readText(page)).replaceAll('العربية', '');
    expect(text.match(new RegExp(`${ARABIC.source}+`, 'g')) ?? [], `${path} shows Arabic`).toEqual([]);

    // Every picture described, in English.
    for (const alt of await page.locator('img[alt]').evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? ''))) {
      expect(alt, `${path}: a picture described in Arabic`).not.toMatch(ARABIC);
    }

    // Nothing wider than the window.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} overflows`).toBeLessThanOrEqual(0);

    // Its labels keep DM Mono, the right face for Latin: Thmanyah Sans is the
    // Arabic labels' face alone (ADR-0018).
    const faces = await page.locator('.eyebrow').evaluateAll((labels) => labels.map((label) => getComputedStyle(label).fontFamily));
    for (const face of faces) expect(face, `${path}: an eyebrow`).toMatch(/^"DM Mono"/);
    eyebrows += faces.length;
  }
  expect(eyebrows, 'no English page has an eyebrow').toBeGreaterThan(0);
});

test('previewed on a phone, the English Screen mocks are English Phone crops; at 768px, whole English screens', async ({
  page,
}) => {
  await logInByApi(page.request, ENGLISH_PAGES_EDITOR);
  for (const slug of ['home-page', 'product-page', 'closing-section', 'screen-mocks', 'trust-strip', 'search-settings']) {
    await approve(page.request, slug, 'draft');
  }
  await approveSiteWords(page.request, 'draft');

  /** The file the Screen mock on show was drawn from, as `next/image` names it. */
  const drawnFrom = async (section: string) => {
    const picture = page.locator(section).locator('img[data-screen-mock]').first();
    await picture.scrollIntoViewIfNeeded();
    await expect.poll(() => picture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const url = new URL(await picture.evaluate((image: HTMLImageElement) => image.currentSrc));
    const file = url.pathname === '/_next/image' ? url.searchParams.get('url')! : url.pathname;
    return { file, mock: await picture.getAttribute('data-screen-mock') };
  };

  for (const [path, section] of [
    ['/en', '#jt .jt-shot.on'],
    ['/en/product', '#journey .ui'],
    ['/en/product', '#roles .role.on'],
  ] as const) {
    await page.setViewportSize({ width: 390, height: 812 });
    await page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
    // Ticket 78's crop, cut from the English screen — the Arabic crop mirrored.
    const phone = await drawnFrom(section);
    expect(phone.file, path).toBe(`/screen-mocks/en/phone/${phone.mock}.webp`);
    // Its words, from the English the site words proposal carries.
    await expect(page.locator(section).first().getByRole('button', { name: 'Tap to see the whole screen' })).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    const tablet = await drawnFrom(section);
    expect(tablet.file, path).toBe(`/screen-mocks/en/${tablet.mock}.webp`);
  }
});

/**
 * An English Phone crop an Editor uploads (ticket 79), as `product-text.spec.ts`
 * checks the Arabic: on a phone, the English pages show the English crop if
 * there is one; otherwise the exported English crop, while the English picture
 * is not replaced; otherwise the English replacement whole, to swipe. The
 * Arabic pages' uploads are never shown on the English ones.
 */
test('previewed on a phone, an uploaded English Phone crop shows, and a replaced English screen without one is whole', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 812 });
  await logInByApi(page.request, ENGLISH_PAGES_EDITOR);
  // Found before approving, which saves a copy of it the next approval would
  // find instead.
  const { id: proposed } = await proposal(page.request, 'screen-mocks');
  for (const slug of ['product-page', 'closing-section', 'screen-mocks', 'trust-strip', 'search-settings']) {
    await approve(page.request, slug, 'draft');
  }
  await approveSiteWords(page.request, 'draft');

  const crop = await uploadImage(page.request, 'Phone crop', phoneCropExportSize(SCREEN_MOCKS[0]));
  const picture = await uploadImage(page.request, 'English replacement screen', { width: 2880, height: 1800 });
  const [cropFiles, pictureFiles] = [await mediaFiles(page.request, crop), await mediaFiles(page.request, picture)];
  const mocks = await (await page.request.get('/api/globals/screen-mocks?draft=true&depth=0')).json();
  const changed = (field: string, change: object) => ({ [field]: { ...mocks[field], ...change } });

  try {
    // The journey's first four panels, one case each.
    const saved = await page.request.post('/api/globals/screen-mocks?draft=true', {
      data: {
        ...mocks,
        ...changed('correspondence', { englishPhoneCrop: crop }),
        ...changed('kanban', { englishPicture: picture, englishPhoneCrop: crop }),
        ...changed('dailyReport', { englishPicture: picture }),
        // The Arabic pages' crop and replacement, which the English pages never show.
        ...changed('documents', { picture, phoneCrop: crop }),
        _status: 'draft',
      },
    });
    expect(saved.ok(), await saved.text()).toBe(true);
    await page.goto(`/api/preview?path=${encodeURIComponent('/en/product')}`);
    const frame = (mock: string) => frameShowing(page, '#journey .ui', mock);
    const OPEN = 'Tap to see the whole screen';

    await expectPhoneCrop(page, frame('correspondence'), {
      crop: cropFiles,
      whole: ['/screen-mocks/en/correspondence.webp'],
      open: OPEN,
    });
    await expectPhoneCrop(page, frame('kanban'), { crop: cropFiles, whole: pictureFiles, open: OPEN });
    await expectWholeToSwipe(frame('daily-report'), { whole: pictureFiles, hint: 'Swipe to see the whole screen' });
    await expectPhoneCrop(page, frame('documents'), {
      crop: ['/screen-mocks/en/phone/documents.webp'],
      whole: ['/screen-mocks/en/documents.webp'],
      open: OPEN,
    });
  } finally {
    // The proposal made the newest draft again, so the next approval finds it
    // and not this test's crops.
    const restored = await page.request.post(`/api/globals/screen-mocks/versions/${proposed}?draft=true`);
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test.describe('the comparison', () => {
  // The seam sweeps once by itself when it first comes into view, which a
  // test pressing its keys would be racing; with reduced motion it never does
  // (`home-before-after.spec.ts` drives the Arabic one the same way).
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('previewed, the home page’s comparison turns over from the left, where an English line begins', async ({ page }) => {
    await logInByApi(page.request, ENGLISH_PAGES_EDITOR);
    for (const slug of ['home-page', 'closing-section', 'screen-mocks', 'trust-strip', 'search-settings']) {
      await approve(page.request, slug, 'draft');
    }
    await approveSiteWords(page.request, 'draft');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/api/preview?path=${encodeURIComponent('/en')}`, { waitUntil: 'networkidle' });

    const handle = page.locator('#ba [role="slider"]');
    await handle.focus();
    // All the way right: every step shows Rabaed's way, and the verdict says so.
    for (let press = 0; press < 13; press += 1) await page.keyboard.press('ArrowRight');
    await expect(page.locator('#ba .cmp-verdict.good')).toHaveCSS('opacity', '1');
    // All the way left: every step is the usual way again.
    for (let press = 0; press < 20; press += 1) await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#ba .cmp-verdict.bad')).toHaveCSS('opacity', '1');

    // Rabaed's tag stands over the left, where its steps begin.
    const tags = await page.locator('#ba .cmp-tag').evaluateAll((elements) =>
      elements.map((element) => ({ rabaed: element.classList.contains('ta'), left: element.getBoundingClientRect().left })),
    );
    const [rabaed, usual] = [tags.find((tag) => tag.rabaed)!, tags.find((tag) => !tag.rabaed)!];
    expect(rabaed.left).toBeLessThan(usual.left);
  });
});

/**
 * The start page published in English, and what it reads with it — the Trust
 * strip, the search settings, the header and footer, its English questions
 * and the demo request form's English — as the founder publishes them.
 */
test.describe('published in English', () => {
  test.beforeAll(async ({ playwright }, testInfo) => {
    const request = await playwright.request.newContext({ baseURL: testInfo.project.use.baseURL });
    await logInByApi(request, ENGLISH_PAGES_EDITOR);
    for (const slug of ['start-page', 'trust-strip', 'search-settings'] as const) await approve(request, slug, 'published');
    await approveSiteWords(request, 'published');

    const questions = await request.get('/api/faq-entries?where[locale][equals]=en&where[page][equals]=start&draft=true&depth=0&limit=100');
    expect(questions.ok()).toBe(true);
    const { docs } = await questions.json();
    expect(docs.length, 'no English questions proposed for the start page').toBeGreaterThan(0);
    for (const question of docs) {
      const published = await request.patch(`/api/faq-entries/${question.id}`, { data: { _status: 'published' } });
      expect(published.ok(), await published.text()).toBe(true);
    }

    const form = await request.get('/api/globals/demo-request-form-en?draft=true&depth=0');
    expect(form.ok()).toBe(true);
    const publishedForm = await request.post('/api/globals/demo-request-form-en', {
      data: { ...(await form.json()), _status: 'published' },
    });
    expect(publishedForm.ok(), await publishedForm.text()).toBe(true);
    await request.dispose();
  });

  test('the English start page is a page of the site, with its own title, alternates and trail', async ({ request, baseURL }) => {
    await logInByApi(request, ENGLISH_PAGES_EDITOR);
    const title = (await proposal(request, 'search-settings')).version.start as { title: { en: string } };
    const html = await reachesVisitors(request, '/en/start', title.title.en, 'the English start page');

    expect(html).not.toContain('This page is not available in English yet.');
    expect(html).toContain(`<link rel="canonical" href="${baseURL}/en/start"/>`);
    expect(html).toContain(`hrefLang="ar" href="${baseURL}/start"`);
    expect(html).toContain(`hrefLang="en" href="${baseURL}/en/start"`);

    // Its structured data is English too: the trail, and the questions word
    // for word as the page shows them.
    const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const trail = data.find((node) => node['@type'] === 'BreadcrumbList');
    expect(trail.itemListElement.map((step: { name: string }) => step.name)).toEqual(['Home', 'Get started']);
    const faq = data.find((node) => node['@type'] === 'FAQPage');
    expect(faq.mainEntity.length).toBeGreaterThan(0);
    for (const question of faq.mainEntity) {
      expect(question.name).not.toMatch(ARABIC);
      expect(question.acceptedAnswer.text).not.toMatch(ARABIC);
    }
    const organisation = data.find((node) => node['@type'] === 'Organization');
    expect(organisation).toMatchObject({ name: 'Rabaed', alternateName: 'ربائد' });
  });

  test('the Arabic start page names its English, and the sitemap lists it', async ({ request, baseURL }) => {
    await reaching('the English alternate on /start', async () =>
      (await (await request.get('/start')).text()).includes(`hrefLang="en" href="${baseURL}/en/start"`),
    ).toBe(true);
    const html = await (await request.get('/start')).text();
    // The switcher leads to the same page in English, not to the English home page.
    expect(html).toMatch(/class="lang"[^>]*href="\/en\/start"|href="\/en\/start"[^>]*class="lang"/);

    await reaching('/en/start in the sitemap', async () => (await (await request.get('/sitemap.xml')).text()).includes(`${baseURL}/en/start<`)).toBe(true);
    // And only the page published in English: the product page's English waits.
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain(`${baseURL}/en/product<`);
    expect(await (await request.get('/en/product')).text()).toContain('This page is not available in English yet.');
  });

  test('a request sent from the English page is answered, confirmed and recorded in English', async ({ page, request }) => {
    await logInByApi(request, ENGLISH_PAGES_EDITOR);
    // The alert address is the Arabic entry's, one for both languages. While
    // it is empty no mail is sent at all, so this sets one and puts it back.
    const settings = await request.get('/api/globals/demo-request-form?depth=0');
    const { id, globalType, createdAt, updatedAt, ...original } = await settings.json();
    const team = uniqueApplicant('english-team').email;
    const withAddress = await request.post('/api/globals/demo-request-form', { data: { ...original, alertAddress: team, _status: 'published' } });
    expect(withAddress.ok(), await withAddress.text()).toBe(true);

    try {
      const applicant = uniqueApplicant('english-demo');
      await page.setExtraHTTPHeaders({ 'x-forwarded-for': applicant.ip });
      await reachesVisitors(page.request, '/en/start', 'Full name', 'the English form');
      await page.goto('/en/start', { waitUntil: 'networkidle' });

      const form = page.locator('form#demo');
      const button = form.getByRole('button', { name: 'Book a live demo' });
      await expect(button).toBeDisabled();
      // Its messages are English too.
      const email = form.getByLabel('Email', { exact: true });
      await email.fill('not an address');
      await email.blur();
      await expect(form.getByText('Enter a valid email address')).toBeVisible();

      await form.getByLabel('Full name', { exact: true }).fill('Sarah Hughes');
      await email.fill(applicant.email);
      await form.getByLabel('Your role on the project', { exact: true }).selectOption('consultant');
      await form.getByLabel('Mobile number', { exact: true }).fill('+44 20 7946 0000');
      await button.click();
      await expect(form.getByRole('status')).toContainText('We have your request');

      await expect.poll(() => mailTo(applicant.email)).toHaveLength(1);
      const [confirmation] = await mailTo(applicant.email);
      expect(confirmation.subject).not.toMatch(ARABIC);
      expect(confirmation.text).toContain('Hello Sarah Hughes,');
      expect(confirmation.text).not.toMatch(ARABIC);

      // The team's alert is in Arabic, as the team works, and says the form
      // was filled in English so the reply goes back in it.
      await expect.poll(async () => (await mailTo(team)).filter((mail) => mail.replyTo === applicant.email)).toHaveLength(1);
      const [alert] = (await mailTo(team)).filter((mail) => mail.replyTo === applicant.email);
      expect(alert.text).toContain('الإنجليزية');
      expect(alert.text).toContain('استشاري');

      const [stored] = await submissionsFrom(request, applicant.email);
      expect(stored).toMatchObject({ form: 'demo-request', locale: 'en', name: 'Sarah Hughes' });
      // Named as the Arabic form names each answer, for the team who reads it.
      expect(stored.answers.find((answer) => answer.field === 'role')).toMatchObject({ label: 'دورك في المشروع', option: 'استشاري' });
    } finally {
      await logInByApi(request, ENGLISH_PAGES_EDITOR);
      const restored = await request.post('/api/globals/demo-request-form', { data: { ...original, _status: 'published' } });
      expect(restored.ok(), await restored.text()).toBe(true);
    }
  });
});
