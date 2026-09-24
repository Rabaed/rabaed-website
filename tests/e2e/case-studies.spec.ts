/**
 * Case studies (ticket 24): the place Rabaed's first real client story will
 * live. Until one is published, nothing on the site shows the section or leads
 * to it — no link, no empty index, no sample client. Publishing the first
 * reveals it; unpublishing the last hides it again.
 *
 * Case studies are created through the CMS's own API as an editor of this
 * suite's own (`cms.ts`), and deleted after each test. The suite runs against
 * the second test server (`playwright.config.ts`, ticket 89): a published case
 * study changes the header of every page, which the suites holding the header
 * to the Reference site, on the first, would otherwise see. The tests run one
 * at a time, as every suite on that server does.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN_PATH, CASE_STUDIES_EDITOR, logInByApi, reachesVisitors, reaching, richText, uploadImage } from './cms';
import { sidewaysOverflow } from './geometry';
import { ROUTES } from './routes';
import { nodesOf, structuredData, trail } from './structured-data';

test.describe.configure({ mode: 'default' });

/** The header's link to the section, restated rather than imported (see `routes.ts`). */
const NAV_LABEL = 'قصص العملاء';

/** An opening answer of 41 words: inside the 30 to 60 the spec asks for. */
const ANSWER =
  'نقل مكتب هندسي في الرياض اعتمادات مشروع سكني من رسائل واتساب المتفرقة إلى سجل واحد في ربائد، فصار المالك والاستشاري والمقاول يرون كل طلب ومن اعتمده ومتى، وتوقف السؤال المتكرر عن آخر نسخة معتمدة من المخططات في كل اجتماع أسبوعي للموقع.';

type Locale = 'ar' | 'en';

type Figure = { value: string; label: string; basis?: string };
type Quote = { text: string; name?: string; role?: string };

type CaseStudy = {
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  answer: string;
  client: string;
  sector: string;
  challenge: string;
  whatChanged: string;
  outcome: string;
  author: string;
  publishedAt: string;
  figures?: Figure[];
  quote?: Quote;
  /** How many further images beside the cover. */
  images?: number;
  /** Leave the cover out: a real story may have no photograph cleared for use. */
  withoutCover?: boolean;
};

/** Keeps this run's slugs apart from anything an earlier run left behind. */
const runId = Date.now().toString(36);
let serial = 0;
let created: number[] = [];
let media: number[] = [];

function caseStudy(overrides: Partial<CaseStudy> = {}): CaseStudy {
  serial += 1;
  return {
    locale: 'ar',
    title: `قصة عميل للاختبار ${runId} رقم ${serial}`,
    slug: `test-${runId}-${serial}`,
    summary: `ملخص قصة العميل رقم ${serial}.`,
    answer: ANSWER,
    client: `عميل الاختبار ${serial}`,
    sector: 'مشاريع سكنية',
    challenge: `كانت الاعتمادات تضيع بين الرسائل في المشروع رقم ${serial}.`,
    whatChanged: `انتقل الفريق إلى سجل واحد في المشروع رقم ${serial}.`,
    outcome: `صار كل طرف يعرف ما ينتظره في المشروع رقم ${serial}.`,
    author: 'كاتب الاختبار',
    publishedAt: '2026-09-14T12:00:00.000Z',
    ...overrides,
  };
}

async function image(editor: APIRequestContext, alt: string): Promise<number> {
  const id = await uploadImage(editor, alt);
  media.push(id);
  return id;
}

/** Sends a case study to the CMS as the editor would save it, and returns the response. */
async function save(editor: APIRequestContext, fields: CaseStudy, status: 'published' | 'draft') {
  const { images = 0, withoutCover, challenge, whatChanged, outcome, ...rest } = fields;
  // One at a time: uploads sharing a file name, sent together, race for it.
  const further: number[] = [];
  for (let n = 1; n <= images; n += 1) further.push(await image(editor, `صورة من الموقع ${n}`));
  const response = await editor.post(`/api/case-studies${status === 'draft' ? '?draft=true' : ''}`, {
    data: {
      ...rest,
      challenge: richText(challenge, fields.locale),
      whatChanged: richText(whatChanged, fields.locale),
      outcome: richText(outcome, fields.locale),
      coverImage: withoutCover ? undefined : await image(editor, `صورة غلاف ${fields.slug}`),
      images: further,
      _status: status,
    },
  });
  if (response.ok()) created.push((await response.json()).doc.id);
  return response;
}

async function create(editor: APIRequestContext, fields: CaseStudy, status: 'published' | 'draft' = 'published') {
  const response = await save(editor, fields, status);
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).doc as { id: number };
}

/** A page as a visitor with no session receives it: status and HTML. */
async function visit(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  return { status: response.status(), html: await response.text() };
}

const linksToSection = (html: string) => html.includes('href="/case-studies"');

test.afterEach(async ({ page }) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  for (const id of created) await page.request.delete(`/api/case-studies/${id}`);
  for (const id of media) await page.request.delete(`/api/media/${id}`);
  created = [];
  media = [];
});

test('while no case study is published, nothing on the site leads to one — not even a saved draft', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const draft = caseStudy();
  await create(page.request, draft, 'draft');

  for (const route of ROUTES) {
    const { html } = await visit(request, route.path);
    expect(linksToSection(html), route.path).toBe(false);
    expect(html, route.path).not.toContain(NAV_LABEL);
  }
  expect((await visit(request, '/case-studies')).status).toBe(404);
  expect((await visit(request, '/en/case-studies')).status).toBe(404);
  expect((await visit(request, `/case-studies/${draft.slug}`)).status).toBe(404);
  expect((await visit(request, '/sitemap.xml')).html).not.toContain('/case-studies');

  // The editor can still preview it at its own address.
  await page.goto(`/api/preview?path=/case-studies/${draft.slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(draft.title);
  await expect(page.getByRole('status')).toContainText('معاينة');
});

test('publishing the first case study reveals the section and its link; unpublishing the last hides them again', async ({
  page,
  request,
  baseURL,
}) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  // No figures and no quote: neither is needed to publish.
  const fields = caseStudy();
  const { id } = await create(page.request, fields);

  /** Whether a page's header leads to the case studies, once that page has been built again. */
  const headerShowsSection = (path: string) =>
    reaching(`the case study's link in the header of ${path}`, async () => linksToSection((await visit(request, path)).html));

  await headerShowsSection('/').toBe(true);

  // In the header, desktop and mobile, on every page — and marked on the section's own pages.
  // Each page is waited for where it is read: publishing marks them all, but
  // each is built again on its own next visit (ticket 62).
  await headerShowsSection('/product').toBe(true);
  await page.goto('/product');
  await expect(page.locator('.nav .links').getByRole('link', { name: NAV_LABEL, exact: true })).toHaveAttribute(
    'href',
    '/case-studies',
  );
  // And in the Footer directory, after the blog, with nobody adding it
  // (ticket 75). Unpublished below, it goes with the header's: `linksToSection`
  // reads the whole page.
  await expect(page.locator('footer nav').getByRole('link', { name: NAV_LABEL, exact: true })).toHaveAttribute(
    'href',
    '/case-studies',
  );
  // At 1100px, the narrowest the desktop row shows at — 981px until ticket 40
  // moved the header's breakpoint to make room for the language switcher
  // (ADR-0015) — the extra link still fits between the brand and the buttons.
  // Loaded at that width: the product page's journey sizes its track to the
  // window it loads in.
  await page.setViewportSize({ width: 1100, height: 900 });
  await headerShowsSection('/start').toBe(true);
  await page.goto('/start');
  const box = async (selector: string) => (await page.locator(selector).boundingBox())!;
  const [brand, links, buttons] = [await box('.nav .brand'), await box('.nav .links'), await box('.nav .nav-cta')];
  const apart = (a: typeof brand, b: typeof brand) => a.x + a.width <= b.x || b.x + b.width <= a.x;
  expect(apart(brand, links), 'the links run into the brand').toBe(true);
  expect(apart(links, buttons), 'the links run into the buttons').toBe(true);
  expect(await sidewaysOverflow(page)).toBe(0);
  await page.setViewportSize({ width: 360, height: 900 });
  await page.locator('.navtog').click();
  const panel = page.locator('.mnav');
  await expect(panel.getByRole('link', { name: NAV_LABEL, exact: true })).toBeVisible();
  await expect
    .poll(() => panel.evaluate((el) => el.scrollHeight - el.clientHeight), {
      message: 'the open panel clips its own content',
    })
    .toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 1280, height: 900 });

  await reaching('the case studies index', async () => (await visit(request, '/case-studies')).status).toBe(200);
  const index = await visit(request, '/case-studies');
  for (const text of [fields.title, fields.summary, fields.client, fields.sector]) expect(index.html).toContain(text);
  expect(index.html).toContain(`href="/case-studies/${fields.slug}"`);

  await reaching(
    'the case study at its own address',
    async () => (await visit(request, `/case-studies/${fields.slug}`)).status,
  ).toBe(200);
  await page.goto(`/case-studies/${fields.slug}`);
  await expect(page.locator('.nav .links a.on')).toHaveText(NAV_LABEL);
  // Nothing stands in for the figures and the quote it does not have.
  await expect(page.getByRole('heading', { name: 'بالأرقام' })).toHaveCount(0);
  await expect(page.locator('blockquote')).toHaveCount(0);

  await reaching('the section in the sitemap', async () => (await visit(request, '/sitemap.xml')).html).toContain(
    `<loc>${baseURL}/case-studies</loc>`,
  );
  const sitemap = (await visit(request, '/sitemap.xml')).html;
  expect(sitemap).toContain(`<loc>${baseURL}/case-studies/${fields.slug}</loc>`);

  // Each language's section is its own: only an Arabic case study exists, so
  // the English section stays hidden, and the English address points to the Arabic.
  expect((await visit(request, '/en/case-studies')).status).toBe(404);
  await reaching(
    "the case study's English address",
    async () => (await visit(request, `/en/case-studies/${fields.slug}`)).status,
  ).toBe(200);
  await page.goto(`/en/case-studies/${fields.slug}`);
  await expect(page.getByRole('link', { name: 'Read it in Arabic' })).toHaveAttribute('href', `/case-studies/${fields.slug}`);

  const unpublished = await page.request.patch(`/api/case-studies/${id}`, { data: { _status: 'draft' } });
  expect(unpublished.ok()).toBe(true);

  await reaching(
    'the index of a section with nothing published in it, gone',
    async () => (await visit(request, '/case-studies')).status,
  ).toBe(404);
  await headerShowsSection('/').toBe(false);
  await reaching(
    'the unpublished case study gone from its own address',
    async () => (await visit(request, `/case-studies/${fields.slug}`)).status,
  ).toBe(404);
  await reaching('the section gone from the sitemap', async () => (await visit(request, '/sitemap.xml')).html).not.toContain(
    '/case-studies',
  );
});

/** The site words an Editor edits, as the CMS gives them back: only what these tests change is named. */
type SiteWords = Record<string, unknown> & { footer: Record<string, unknown> & { tagline: { ar: string } } };

/** What the CMS adds to an entry and its list rows, which is not sent back — as `stale-render.spec.ts` has it. */
const NOT_SENT = new Set(['id', 'globalType', 'createdAt', 'updatedAt', '_status']);

function sendable<T>(value: T): T {
  if (Array.isArray(value)) return value.map(sendable) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !NOT_SENT.has(key))
        .map(([key, each]) => [key, sendable(each)]),
    ) as T;
  }
  return value;
}

/** Every link in `value` whose path is the case studies', given `path` instead: the header's and the Footer directory's. */
function caseStudiesAt<T>(value: T, path: string): T {
  if (Array.isArray(value)) return value.map((each) => caseStudiesAt(each, path)) as T;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, each]) =>
      key === 'path' && each === '/case-studies' ? [key, path] : [key, caseStudiesAt(each, path)],
    );
    return Object.fromEntries(entries) as T;
  }
  return value;
}

/** Ways an Editor might write the case studies' path, each of which the CMS accepts. */
const SPELLINGS = ['/en/case-studies', '/en//case-studies', ' /case-studies', '/case-studies/'];

// The case studies link is an Editor's to write, in the header and the Footer
// directory, and the CMS takes a path as typed (ticket 87). However it is
// written, it is the same link: it waits for the first case study, and then
// leads to the section.
test('the case studies link waits for the first case study however an Editor writes its path', async ({ page, request }) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const read = await page.request.get('/api/globals/site-words?depth=0');
  expect(read.ok()).toBe(true);
  const original = sendable((await read.json()) as SiteWords);
  expect(JSON.stringify(original), 'no case studies link to rewrite').toContain('"path":"/case-studies"');

  /**
   * Publishes every case studies link at `path`, and returns the home page
   * once it has been built with it. The link is hidden while nothing is
   * published, so what is waited for is a mark published with it: a footer
   * tagline of its own, short enough for the tagline's limit.
   */
  let marks = 0;
  const publishLinksAt = async (path: string) => {
    marks += 1;
    const mark = `وسم الاختبار ${runId} رقم ${marks}`;
    const rewritten = caseStudiesAt(original, path);
    const saved = await page.request.post('/api/globals/site-words', {
      data: { ...rewritten, footer: { ...rewritten.footer, tagline: { ...rewritten.footer.tagline, ar: mark } }, _status: 'published' },
    });
    expect(saved.ok(), await saved.text()).toBe(true);
    return reachesVisitors(request, '/', mark, `the case studies links published as «${path}»`);
  };

  try {
    // Nothing published: whichever way it is written, nothing leads to the section.
    for (const path of SPELLINGS) {
      expect(linksToSection(await publishLinksAt(path)), `a link shows as «${path}» with nothing published`).toBe(false);
    }

    // The first case study, and the links are there, however they are
    // written — leading to the section, not to an address with a language,
    // a doubled slash or a space written into it.
    await create(page.request, caseStudy());
    for (const path of SPELLINGS) {
      expect(linksToSection(await publishLinksAt(path)), `no link to the section as «${path}»`).toBe(true);
    }
  } finally {
    const restored = await page.request.post('/api/globals/site-words', { data: { ...original, _status: 'published' } });
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test('a case study page tells the whole story, whole in the first response', async ({ page, request, browser, baseURL }) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const fields = caseStudy({
    figures: [
      { value: '3 أيام', label: 'لاعتماد المخططات بدل أسبوعين', basis: 'متوسط اعتمادات المشروع في الربع الأول' },
      { value: '120 طلباً', label: 'موثقاً في السجل', basis: 'عدد الطلبات المسجلة حتى التسليم' },
    ],
    quote: { text: 'لم نعد نسأل من اعتمد ماذا ومتى.', name: 'مدير مشروع الاختبار', role: 'مدير المشروع' },
    images: 2,
  });
  await create(page.request, fields);
  await reaching(
    'the case study at its own address',
    async () => (await visit(request, `/case-studies/${fields.slug}`)).status,
  ).toBe(200);

  const context = await browser.newContext({ javaScriptEnabled: false });
  const visitor = await context.newPage();
  await visitor.goto(`/case-studies/${fields.slug}`);
  await expect(visitor.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(visitor.getByRole('heading', { level: 1 })).toHaveText(fields.title);
  await expect(visitor.locator('footer')).toBeVisible();

  // Opening with the answer.
  const firstParagraph = await visitor.evaluate(() => {
    const heading = document.querySelector('h1')!;
    return [...document.querySelectorAll('p')]
      .find((p) => heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING && p.textContent?.trim())
      ?.textContent?.trim();
  });
  expect(firstParagraph).toBe(fields.answer);

  for (const text of [fields.client, fields.sector, fields.challenge, fields.whatChanged, fields.outcome]) {
    await expect(visitor.getByText(text, { exact: true }).first()).toBeVisible();
  }
  // The author's name sits in a line of its own words («بقلم …»).
  await expect(visitor.getByText(fields.author)).toBeVisible();
  for (const heading of ['التحدي', 'ما الذي تغيّر', 'النتيجة', 'بالأرقام']) {
    await expect(visitor.getByRole('heading', { name: heading })).toBeVisible();
  }
  for (const figure of fields.figures!) {
    for (const text of [figure.value, figure.label, figure.basis!]) {
      await expect(visitor.getByText(text, { exact: true })).toBeVisible();
    }
  }
  await expect(visitor.locator('blockquote')).toHaveText(fields.quote!.text);
  await expect(visitor.getByText(fields.quote!.name!)).toBeVisible();

  await expect(visitor.getByRole('img', { name: `صورة غلاف ${fields.slug}` })).toBeVisible();
  for (const alt of ['صورة من الموقع 1', 'صورة من الموقع 2']) {
    await expect(visitor.getByRole('img', { name: alt })).toBeAttached();
  }

  await expect(visitor.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/case-studies/${fields.slug}`);
  await expect(visitor).toHaveTitle(new RegExp(fields.title));
  await expect(visitor.locator('meta[name="description"]')).toHaveAttribute('content', fields.summary);
  await context.close();

  // Its place in the site, and the index's, in breadcrumb data (ticket 32).
  const breadcrumbsOn = async (path: string) =>
    trail(nodesOf(structuredData((await visit(request, path)).html), 'BreadcrumbList')[0]);
  await reaching('the case studies index', async () => (await visit(request, '/case-studies')).status).toBe(200);
  expect(await breadcrumbsOn(`/case-studies/${fields.slug}`)).toEqual([
    ['الرئيسية', baseURL],
    ['قصص العملاء', `${baseURL}/case-studies`],
    [fields.title, `${baseURL}/case-studies/${fields.slug}`],
  ]);
  expect(await breadcrumbsOn('/case-studies')).toEqual([
    ['الرئيسية', baseURL],
    ['قصص العملاء', `${baseURL}/case-studies`],
  ]);

  // Neither page is in `routes.ts` — the test database starts with no case
  // study — so the checks every page gets there are made here.
  for (const path of ['/case-studies', `/case-studies/${fields.slug}`]) {
    const problems: string[] = [];
    const onConsole = (message: { type(): string; text(): string }) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    };
    const onResponse = (response: { status(): number; url(): string }) => {
      if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
    };
    page.on('console', onConsole);
    page.on('response', onResponse);
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    page.off('console', onConsole);
    page.off('response', onResponse);
    expect(problems, path).toEqual([]);
    expect(
      await sidewaysOverflow(page),
      path,
    ).toBe(0);
  }
});

test('a case study cannot be published missing any part of the story, or with a number or quote nobody stands behind', async ({
  page,
}) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const refused = async (fields: CaseStudy) => (await save(page.request, fields, 'published')).status();

  expect(await refused(caseStudy({ answer: 'جواب قصير جداً.' }))).toBe(400);
  for (const part of ['client', 'sector', 'challenge', 'whatChanged', 'outcome', 'summary', 'author'] as const) {
    expect(await refused(caseStudy({ [part]: '' })), part).toBe(400);
  }

  // A figure says how it was measured; a quote says who said it, and a name has a quote to go with it.
  expect(await refused(caseStudy({ figures: [{ value: '40%', label: 'أسرع في الاعتماد' }] }))).toBe(400);
  expect(await refused(caseStudy({ quote: { text: 'تجربة ممتازة.' } }))).toBe(400);
  expect(await refused(caseStudy({ quote: { text: '', name: 'مدير المشروع' } }))).toBe(400);

  // Nothing optional is needed: no cover, no figures, no quote, no further images.
  await create(page.request, caseStudy({ withoutCover: true }));

  const taken = caseStudy();
  await create(page.request, taken);
  expect(await refused(caseStudy({ slug: taken.slug }))).toBe(400);

  // A draft may be unfinished: Ahmed saves as he writes.
  expect((await save(page.request, caseStudy({ answer: 'مسودة لم تكتمل.', client: '' }), 'draft')).ok()).toBe(true);
});

test('an English case study has its own section, breadcrumb trail and sitemap entry', async ({
  page,
  request,
  baseURL,
}) => {
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const english = caseStudy({
    locale: 'en',
    title: `Test case study ${runId}`,
    summary: 'A summary of the test case study.',
    client: `Test client ${runId}`,
    sector: 'Residential projects',
    challenge: 'Approvals were lost between messages.',
    whatChanged: 'The team moved to one Record.',
    outcome: 'Every party knew what was waiting for it.',
    author: 'Test Author',
  });
  await create(page.request, english);
  const address = `${baseURL}/en/case-studies/${english.slug}`;

  await reaching(
    'the English case study at its own address',
    async () => (await visit(request, `/en/case-studies/${english.slug}`)).status,
  ).toBe(200);
  const trailOf = async (path: string) =>
    trail(nodesOf(structuredData((await visit(request, path)).html), 'BreadcrumbList')[0]);
  const [home, section, itself] = await trailOf(`/en/case-studies/${english.slug}`);
  expect(home![1]).toBe(`${baseURL}/en`);
  expect(section![1]).toBe(`${baseURL}/en/case-studies`);
  expect(itself).toEqual([english.title, address]);

  await reaching('the English case study in the sitemap', async () => (await visit(request, '/sitemap.xml')).html).toContain(
    `<loc>${address}</loc>`,
  );
  // Its section's index with it, as the Arabic one is listed once it has a case study.
  expect((await visit(request, '/sitemap.xml')).html).toContain(`<loc>${baseURL}/en/case-studies</loc>`);
  expect((await visit(request, '/sitemap.xml')).html).not.toContain(`<loc>${baseURL}/case-studies</loc>`);
  // The Arabic section stays hidden: only an English case study exists.
  expect((await visit(request, '/case-studies')).status).toBe(404);
});

test('the admin shows which case studies are missing a translation', async ({ page }) => {
  // Drafts: the admin lists an entry whether or not it is published, and a
  // draft changes nothing on the site for this to clean up after.
  await logInByApi(page.request, CASE_STUDIES_EDITOR);
  const arabic = caseStudy({ withoutCover: true });
  await create(page.request, arabic, 'draft');

  /** The Translation column of a case study's row in the Case studies list. */
  const translationOf = async (title: string) => {
    await page.goto(`${ADMIN_PATH}/collections/case-studies?where[slug][equals]=${arabic.slug}`);
    return page.getByRole('row').filter({ hasText: title }).locator('.cell-translation');
  };

  await expect(await translationOf(arabic.title)).toHaveText('Missing');

  const english = caseStudy({
    locale: 'en',
    slug: arabic.slug,
    title: `Test case study ${runId}`,
    author: 'Test Author',
    withoutCover: true,
  });
  await create(page.request, english, 'draft');
  await expect(await translationOf(arabic.title)).toHaveText('Draft only');
  await expect(await translationOf(english.title)).toHaveText('Draft only');
});
