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
 * follows what every other suite publishes, so this suite runs against the
 * second test server (`playwright.config.ts`, ticket 89) and puts the switch
 * back whether it passes or not. Its tests sign in as an editor of their own
 * (`editors.ts`) and run one at a time, as every suite on that server does.
 *
 * The suites that publish run there too, before or after this one in no fixed
 * order, which is why the two `llms.txt` tests say in their comments what
 * they tolerate: an English page one of them left published, a case study or
 * article one of them published and took down again, which the file names
 * until its next rebuild, and the moment after a Referral Program value is put
 * back when the page carries it and the file does not yet.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { richText, uploadImage } from './cms';
import { signIn } from './editors';
import { ROUTES } from './routes';
import { oneSuiteAtATime } from './one-suite-at-a-time';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

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
  await signIn(page.request);

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
  // heading rather than an entry, and the Screen mock studio is never listed
  // (ticket 05). An English page joins once it is published in English (ticket
  // 82) — in this database none is, but `english-pages.spec.ts` publishes one
  // on this server and leaves it published, so the English are left out of
  // the comparison below as the case studies are.
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
  // What `case-studies.spec.ts` publishes on this server is left out of the
  // comparison rather than asserted against: an article, a case study, and the
  // case studies index that appears with the first of them (ticket 24), each
  // named by the file until its next rebuild after they are deleted. What
  // stays is the fixed set, which nothing published can add to or take from.
  const pages = listed
    .filter((url) => !url.startsWith(absolute(baseURL!, '/en/')) && url !== absolute(baseURL!, '/en'))
    .filter((url) => !/\/(blog|case-studies)(\/|$)/.test(url) || url.endsWith('/blog'));
  expect([...pages].sort()).toEqual(expected.map((path) => absolute(baseURL!, path)).sort());
  expect(listed.filter((url) => url.includes('/studio'))).toEqual([]);
});

test('every page llms.txt lists answers, and is described in the words that page declares', async ({
  request,
  page,
  baseURL,
}) => {
  // Polled as one whole, and re-read each time. `referral-program-values.spec.ts`
  // runs on this server and publishes an amount the referral page's
  // description quotes, then puts it back; for the moment between the page
  // being rebuilt with it and the file being rebuilt with it, the two disagree
  // honestly. Everything
  // else here is fixed, so the poll settles rather than hides a mismatch — and
  // a mismatch that outlasts it is reported with both sides.
  let entries: { url: string; description: string }[] = [];
  await expect
    .poll(async () => {
      const llms = await (await fetchOk(request, '/llms.txt')).text();
      entries = [...llms.matchAll(/^- \[[^\]]+\]\(([^)]+)\): (.+)$/gm)].map(([, url, description]) => ({ url, description }));
      expect(entries.length).toBeGreaterThan(0);

      const disagreed: string[] = [];
      for (const entry of entries) {
        const visit = await page.goto(entry.url);
        expect(visit?.status(), entry.url).toBe(200);
        // Generated from the page's own description rather than written out
        // beside it, which is how a file like this goes stale.
        const declared = await page.locator('meta[name="description"]').getAttribute('content');
        if (declared !== entry.description) disagreed.push(`${entry.url}\n  file: ${entry.description}\n  page: ${declared}`);
      }
      return disagreed;
    })
    .toEqual([]);

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
  await signIn(page.request);
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
