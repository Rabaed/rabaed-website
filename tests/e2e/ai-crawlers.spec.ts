/**
 * The GEO layer (ticket 33; spec: SEO and GEO, and "Discovery" under Testing
 * Decisions): `robots.txt` telling AI systems which crawlers may read the
 * site, and `llms.txt` summarising what Rabaed is and where its pages are.
 *
 * What a conventional search engine needs — the sitemap, canonical URLs,
 * titles and sharing tags — is `search-foundations.spec.ts`; the `noindex`
 * block itself is `indexing.spec.ts`.
 *
 * The switch test changes what `robots.txt` says for everyone, and `llms.txt`
 * follows what the other suites publish, so this suite runs after everything
 * else (`playwright.config.ts`) and puts the switch back whether it passes or
 * not. Its tests sign in as an editor of their own (`cms.ts`) and run one at a
 * time.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { CRAWLERS_EDITOR, logInByApi, richText, uploadImage } from './cms';
import { ROUTES } from './routes';

test.describe.configure({ mode: 'default' });

const SWITCH = '/api/globals/ai-crawlers';

/** An opening answer of 45 words, as an article must carry to be published (ticket 23). */
const ANSWER =
  'ربائد منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق لكل طلب واعتماد في مشروع الإنشاء، فلا تضيع مراسلة في واتساب ولا يتأخر اعتماد لأن أحداً لم يره، ويعرف كل طرف في أي لحظة ما الذي ينتظره وما الذي أُنجز ومن قرّر ماذا ومتى.';

/**
 * Restated rather than imported from `src/app/robots.ts`, for the reason
 * `routes.ts` gives. These are the crawlers that fetch a page to answer a
 * question being asked and cite the source: the ones Rabaed is quoted through.
 */
const RETRIEVAL_CRAWLERS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'Amazonbot',
];

/** The crawlers that collect pages to train a model, which the switch governs. */
const TRAINING_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Meta-ExternalAgent', 'CCBot'];

/** The home page's absolute address is the bare origin, as its canonical URL is. */
const absolute = (baseURL: string, path: string) => `${baseURL}${path === '/' ? '' : path}`;

async function fetchOk(request: APIRequestContext, url: string) {
  const response = await request.get(url);
  expect(response.status(), url).toBe(200);
  return response;
}

/**
 * One `User-agent` group of a robots file: every agent named before the rules,
 * and the rules themselves. A crawler obeys the group that names it, and only
 * that group.
 */
type Group = { agents: string[]; rules: string[] };

function groupsOf(robots: string): Group[] {
  const groups: Group[] = [];
  for (const line of robots.split('\n').map((each) => each.trim())) {
    const [field, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (/^user-agent$/i.test(field)) {
      // Agents listed one after another share the rules that follow them.
      const last = groups.at(-1);
      if (last && last.rules.length === 0) last.agents.push(value);
      else groups.push({ agents: [value], rules: [] });
    } else if (/^(allow|disallow)$/i.test(field) && groups.length > 0) {
      groups.at(-1)!.rules.push(`${field.toLowerCase()}: ${value}`);
    }
  }
  return groups;
}

/** The rules a named crawler obeys: its own group, or the one for everything else. */
function rulesFor(robots: string, agent: string): string[] {
  const groups = groupsOf(robots);
  const named = groups.find((group) => group.agents.some((each) => each.toLowerCase() === agent.toLowerCase()));
  return (named ?? groups.find((group) => group.agents.includes('*')))?.rules ?? [];
}

/** Sets the switch, as ticking the box in the admin and saving does. */
async function setSwitch(editor: APIRequestContext, allowed: boolean) {
  const response = await editor.post(SWITCH, { data: { allowTraining: allowed } });
  expect(response.ok(), await response.text()).toBe(true);
}

/** `robots.txt` as a visitor with no session receives it. */
const robotsFile = (request: APIRequestContext) => request.get('/robots.txt').then((response) => response.text());

test('robots.txt lets every retrieval and citation crawler read every page, and names the sitemap', async ({
  request,
  baseURL,
}) => {
  const response = await fetchOk(request, '/robots.txt');
  expect(response.headers()['content-type']).toMatch(/^text\/plain/);
  const robots = await response.text();

  for (const agent of RETRIEVAL_CRAWLERS) {
    expect(rulesFor(robots, agent), agent).toEqual(['allow: /']);
  }
  // Everything else too: a crawler nobody has heard of yet is not shut out.
  expect(rulesFor(robots, 'SomeCrawlerNobodyHasNamed')).toEqual(['allow: /']);
  expect(robots).toContain(`Sitemap: ${baseURL}/sitemap.xml`);
});

test('the CMS admin is not named in robots.txt, which would publish its address', async ({ request }) => {
  expect(await robotsFile(request)).not.toContain('maktab');
});

test('training crawlers are allowed until somebody decides otherwise', async ({ request }) => {
  const robots = await robotsFile(request);
  for (const agent of TRAINING_CRAWLERS) {
    expect(rulesFor(robots, agent), agent).toEqual(['allow: /']);
  }
});

test('one switch in the CMS refuses the training crawlers, and leaves the citation crawlers alone', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, CRAWLERS_EDITOR);

  try {
    await setSwitch(page.request, false);
    await expect.poll(async () => rulesFor(await robotsFile(request), 'GPTBot')).toEqual(['disallow: /']);

    const refused = await robotsFile(request);
    for (const agent of TRAINING_CRAWLERS) {
      expect(rulesFor(refused, agent), agent).toEqual(['disallow: /']);
    }
    // A crawler refused a page never reads its `noindex`, so nothing that has
    // to see one may be refused: the retrieval crawlers and everything else
    // are untouched by the switch.
    for (const agent of [...RETRIEVAL_CRAWLERS, '*']) {
      expect(rulesFor(refused, agent), agent).toEqual(['allow: /']);
    }
  } finally {
    await setSwitch(page.request, true);
  }

  await expect.poll(async () => rulesFor(await robotsFile(request), 'GPTBot')).toEqual(['allow: /']);
});

test('llms.txt says what Rabaed is, and lists every page at its own address', async ({ request, baseURL }) => {
  const response = await fetchOk(request, '/llms.txt');
  expect(response.headers()['content-type']).toMatch(/^text\/plain/);
  const llms = await response.text();

  // The company as CONTEXT.md writes it, and the product line in the
  // co-founder's own words.
  expect(llms.split('\n')[0]).toBe('# ربائد (Rabaed)');
  expect(llms).toContain('شركة ربائد البناء — الرياض، السعودية.');
  expect(llms).toContain('يجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.');

  const listed = [...llms.matchAll(/^- \[[^\]]+\]\(([^)]+)\):/gm)].map(([, url]) => url);

  // The Arabic site's pages, each once. The home page is the file's own
  // heading rather than an entry; `/en` waits for English (ticket 40); with no
  // case study published, their section has no page (ticket 24); and the
  // Screen mock studio is never listed (ticket 05). Articles and case studies
  // come and go with what is published, as they do in the sitemap.
  const expected = [
    '/product',
    '/start',
    '/tool',
    '/referral',
    '/partnership',
    '/blog',
    '/terms',
    '/privacy',
    '/referral-terms',
  ];
  const pages = listed.filter((url) => !/\/(blog|case-studies)\/[^/]+$/.test(url));
  expect([...pages].sort()).toEqual(expected.map((path) => absolute(baseURL!, path)).sort());
  expect(listed.filter((url) => url.includes('/studio'))).toEqual([]);
});

test('every page llms.txt lists answers, and is described in the words that page declares', async ({
  request,
  page,
  baseURL,
}) => {
  const llms = await (await fetchOk(request, '/llms.txt')).text();
  const entries = [...llms.matchAll(/^- \[[^\]]+\]\(([^)]+)\): (.+)$/gm)].map(([, url, description]) => ({
    url,
    description,
  }));
  expect(entries.length).toBeGreaterThan(0);

  for (const entry of entries) {
    const visit = await page.goto(entry.url);
    expect(visit?.status(), entry.url).toBe(200);
    // Generated from the page's own description rather than written out
    // beside it, which is how a file like this goes stale.
    await expect(page.locator('meta[name="description"]'), entry.url).toHaveAttribute('content', entry.description);
  }

  // Every Arabic route of the site is in it, the home page aside.
  const pathsListed = entries.map((entry) => entry.url.replace(baseURL!, '') || '/');
  for (const route of ROUTES.filter((each) => each.locale === 'ar' && each.path !== '/')) {
    expect(pathsListed, route.path).toContain(route.path);
  }
});

test('an article published in the CMS joins llms.txt, and leaves it again when it is deleted', async ({
  page,
  request,
  baseURL,
}) => {
  await logInByApi(page.request, CRAWLERS_EDITOR);
  const cover = await uploadImage(page.request, 'صورة غلاف لاختبار زواحف الذكاء الاصطناعي');
  const slug = `crawlers-${Date.now().toString(36)}`;
  const title = `مقالة اختبار زواحف الذكاء الاصطناعي ${slug}`;
  const summary = 'ملخص المقالة كما كُتب في لوحة التحرير، والسطر الذي يجب أن يظهر في llms.txt.';
  let created: number | null = null;

  try {
    const response = await page.request.post('/api/posts', {
      data: {
        locale: 'ar',
        title,
        slug,
        summary,
        answer: ANSWER,
        author: 'كاتب الاختبار',
        body: richText('فقرة من متن مقالة الاختبار.', 'ar'),
        coverImage: cover,
        publishedAt: '2026-09-20T12:00:00.000Z',
        _status: 'published',
      },
    });
    expect(response.ok(), await response.text()).toBe(true);
    created = (await response.json()).doc.id as number;

    // The file is built ahead of time like the pages, so publishing has to
    // mark it stale (`src/cms/revalidation.ts`).
    await expect.poll(async () => (await request.get('/llms.txt')).text()).toContain(title);
    expect(await (await fetchOk(request, '/llms.txt')).text()).toContain(
      `- [${title}](${absolute(baseURL!, `/blog/${slug}`)}): ${summary}`,
    );
  } finally {
    if (created !== null) await page.request.delete(`/api/posts/${created}`);
    await page.request.delete(`/api/media/${cover}`);
  }

  await expect.poll(async () => (await request.get('/llms.txt')).text()).not.toContain(title);
});
