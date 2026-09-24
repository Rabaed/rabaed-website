/**
 * The answer-first copy pass (ticket 35): the four section openers HANDOFF
 * §6.4 asks for, all 31 answers rewritten to stand alone without their
 * question, and the comparison questions §6.5 calls the weakest gap —
 * all of them **proposed**, by `20260921_111500_propose_answer_first_copy`, and
 * none of them published.
 *
 * What this suite holds them to is the ticket's own gate: that every proposed
 * word is in the CMS where the founder will find it, that it is an answer of
 * the shape the spec asks for, and that **no visitor reads one of them until
 * he presses Publish**. That the words then reach the page is ticket 22's and
 * ticket 58's machinery, tested by `faqs.spec.ts`, `home-text.spec.ts` and
 * `product-text.spec.ts`; that the CMS refuses an opener which is not an
 * answer is tested in the last two, which own those two entries.
 *
 * **It writes nothing.** The home page's and the product page's entries belong
 * to `home-text.spec.ts` and `product-text.spec.ts`, which edit them while
 * this runs — so every proposal is looked for among the entry's *versions*
 * rather than as the latest one, which is true whatever those suites have left
 * behind.
 *
 * The tests sign in as an editor of their own (`editors.ts`) and run one at a time.
 *
 * Expectations are restated here rather than imported from
 * `src/migrations/answer-first-proposal/`, for the reason `routes.ts` gives: a
 * test that reads its expectation out of the data under test agrees with it by
 * construction, and would go on agreeing if a proposal went missing.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { signIn } from './editors';

// One at a time, and signed in as an editor of this suite's own: Payload
// records a login by writing back the editor's whole list of sessions, so two
// tests signing in to one account at once can erase each other's (`editors.ts`).
test.describe.configure({ mode: 'default' });

/**
 * The four sections HANDOFF §6.4 names, where each one's opening answer is
 * kept, and a phrase only the proposed answer carries.
 *
 * `#jt` and `#roles` had no paragraph under their heading at all, which is why
 * those two fields are new (ticket 35) and stand empty until this is published.
 */
const OPENERS = [
  { entry: 'home-page', section: 'fourUnits', heading: 'أربع وحدات', says: 'أربع وحدات تعمل على سجل واحد', wasEmpty: true },
  { entry: 'home-page', section: 'record', heading: 'لا نسأل', says: 'السجل الموثّق في ربائد ليس ميزة تُفعَّل', wasEmpty: false },
  { entry: 'product-page', section: 'roles', heading: 'ماذا يرى كل طرف', says: 'يفتح كل طرف في ربائد ما يخصّ عمله', wasEmpty: true },
  { entry: 'product-page', section: 'innerCycle', heading: 'ماذا يبقى عندك', says: 'لكل جهة في ربائد', wasEmpty: false },
] as const;

/**
 * The comparison questions: the page each belongs to, and its address. The
 * three together on both lists, and then one each for the three things the
 * ticket names Rabaed against, on the page carrying the full set.
 */
const COMPARISONS = [
  { page: 'home', at: '/', question: 'ما الفرق بين ربائد وواتساب والبريد الإلكتروني والإكسل؟' },
  { page: 'start', at: '/start', question: 'ما الفرق بين ربائد وواتساب والبريد الإلكتروني والإكسل؟' },
  { page: 'start', at: '/start', question: 'عندنا مجموعة واتساب للمشروع — لماذا ننتقل إلى ربائد؟' },
  { page: 'start', at: '/start', question: 'نتبادل الاعتمادات بالبريد الإلكتروني — ما الذي يضيفه ربائد؟' },
  { page: 'start', at: '/start', question: 'ندير المشروع بملفات إكسل ومجلد مشترك — ما الذي يتغيّر؟' },
] as const;

/**
 * The four figures on the home page's proof deck that nobody can yet source
 * (ticket 47). No proposed word may state one: these paragraphs are exactly
 * what an assistant lifts a number out of.
 */
const UNSOURCED_FIGURES = ['3.6×', '7×', '31%', '22%'];

/** Words as the spec counts them, between the spaces (spec: SEO and GEO). */
const wordCount = (written: string) => written.trim().split(/\s+/).length;

/** The page a visitor with no session receives. */
const visit = async (request: APIRequestContext, path: string) => (await request.get(path)).text();

/** Every version of a page's entry whose status is `status`, newest first. */
async function versionsOf(editor: APIRequestContext, entry: string, status: 'draft' | 'published') {
  const response = await editor.get(
    `/api/globals/${entry}/versions?where[version._status][equals]=${status}&sort=-updatedAt&depth=0&limit=100`,
  );
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).docs as { version: Record<string, { lead?: { ar?: string | null } }> }[];
}

type Question = { id: number; question: string; answer: string; page: string; _status: string; _order: string };

/**
 * Every Arabic question, as published or as last saved. `draft` is what the
 * admin's list shows and what Preview draws: the newest version of each, which
 * for all of these is the proposal waiting. Without it, each is as a visitor
 * reads it.
 */
async function questions(editor: APIRequestContext, draft: boolean): Promise<Question[]> {
  const response = await editor.get(
    `/api/faq-entries?where[locale][equals]=ar&sort=_order&pagination=false&depth=0${draft ? '&draft=true' : ''}`,
  );
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).docs as Question[];
}

test.describe('the four section openers', () => {
  test('each is waiting in the CMS as a standalone answer of 30 to 60 words', async ({ page }) => {
    await signIn(page.request);

    for (const opener of OPENERS) {
      const drafts = await versionsOf(page.request, opener.entry, 'draft');
      const proposed = drafts
        .map((version) => version.version[opener.section]?.lead?.ar ?? '')
        .find((lead) => lead.includes(opener.says));

      expect(proposed, `${opener.entry} — ${opener.heading}: no draft carries the proposed opening answer`).toBeTruthy();
      expect(wordCount(proposed!), `${opener.entry} — ${opener.heading}: ${wordCount(proposed!)} words`).toBeGreaterThanOrEqual(30);
      expect(wordCount(proposed!), `${opener.entry} — ${opener.heading}: ${wordCount(proposed!)} words`).toBeLessThanOrEqual(60);
      for (const figure of UNSOURCED_FIGURES) expect(proposed).not.toContain(figure);
    }
  });

  test('no visitor reads one: the two sections that had no paragraph still have none', async ({ request }) => {
    const pages = { 'home-page': await visit(request, '/'), 'product-page': await visit(request, '/product') };

    for (const opener of OPENERS) {
      expect(pages[opener.entry], `${opener.heading}: the proposal reached a visitor`).not.toContain(opener.says);
      // The heading itself is there — so the page was read, and the words
      // above are missing because they are unpublished, not because the
      // section is.
      expect(pages[opener.entry]).toContain(opener.heading);
    }
  });

  test('what the two sections that had one still say is what the CMS publishes', async ({ page, request }) => {
    await signIn(page.request);
    const home = await visit(request, '/');
    const product = await visit(request, '/product');

    // The paragraphs as ticket 58 and ticket 57 published them, which the
    // proposal rewrites and does not replace.
    expect(home).toContain('ليست ميزة تُفعَّل');
    expect(product).toContain('لكل جهة دورة مراجعة واعتماد داخلية كاملة');

    // And each is still what the entry publishes, not only what the page drew.
    const [homePublished] = await versionsOf(page.request, 'home-page', 'published');
    expect(homePublished!.version.record?.lead?.ar).toContain('ليست ميزة تُفعَّل');
    expect(homePublished!.version.fourUnits?.lead?.ar ?? '').toBe('');
  });
});

test.describe('the 31 answers', () => {
  test('each has a rewrite waiting, and none of the rewrites opens on a bare «لا» or «نعم»', async ({ page }) => {
    await signIn(page.request);
    const published = (await questions(page.request, false)).filter((entry) => entry._status === 'published');
    const waiting = new Map((await questions(page.request, true)).map((entry) => [entry.id, entry.answer]));
    expect(published, 'the 31 questions ticket 22 imported').toHaveLength(31);

    // A bare «لا.» or «نعم.» is the defect: lifted without its question, such
    // an answer says nothing at all. Several of the 31 open that way.
    const bare = /^(لا|نعم)\./;
    expect(published.filter((entry) => bare.test(entry.answer)).length, 'published answers opening on a bare word').toBeGreaterThan(0);

    for (const entry of published) {
      const rewrite = waiting.get(entry.id);
      expect(rewrite, `${entry.page} — ${entry.question}: no rewrite waiting`).toBeTruthy();
      expect(rewrite, `${entry.page} — ${entry.question}: the answer waiting is the published one`).not.toBe(entry.answer);
      expect(bare.test(rewrite!), `${entry.page} — ${entry.question}: the rewrite still opens on a bare word`).toBe(false);
      for (const figure of UNSOURCED_FIGURES) expect(rewrite).not.toContain(figure);
    }
  });

  test('every page still shows the answer it publishes, not the one waiting', async ({ page, request }) => {
    await signIn(page.request);
    const published = (await questions(page.request, false)).filter((entry) => entry._status === 'published');
    const where = { home: '/', start: '/start', tool: '/tool', referral: '/referral', partnership: '/partnership' };
    const pages = Object.fromEntries(
      await Promise.all(Object.entries(where).map(async ([page, path]) => [page, await visit(request, path)] as const)),
    ) as Record<string, string>;

    for (const entry of published) {
      // Up to the first mark an answer may carry, since the page draws those
      // rather than printing them: a Referral Program value written
      // `{payout}`, and a Latin name between backticks, which the page sets in
      // its own typeface (`src/cms/faq-answer.ts`).
      const [asWritten] = entry.answer.split(/[{`]/);
      expect(pages[entry.page], `${entry.page} — ${entry.question}`).toContain(asWritten!.trim());
    }
  });
});

test.describe('the comparison questions', () => {
  test('each is waiting, unpublished, against WhatsApp, email and the spreadsheet', async ({ page }) => {
    await signIn(page.request);
    const drafts = (await questions(page.request, false)).filter((entry) => entry._status !== 'published');

    const waiting = COMPARISONS.map((comparison) => {
      const [found] = drafts.filter((entry) => entry.page === comparison.page && entry.question === comparison.question);
      expect(found, `${comparison.page}: «${comparison.question}» is not waiting`).toBeTruthy();
      return found!;
    });

    // Each sits at the end of its list on a key Payload can carry on from. A
    // key whose fraction ends in the lowest digit is not a key at all, and one
    // such row stops an Editor adding any question: Payload reads the last key
    // to make the next one, and refuses to read that one (`faqs.spec.ts` is
    // where that showed).
    for (const entry of waiting) {
      expect(entry._order.endsWith('0'), `«${entry.question}» sits on «${entry._order}», which is not a key`).toBe(false);
    }

    // Each of the three has a question of its own, as the ticket names all
    // three: «Rabaed against WhatsApp, email and spreadsheets».
    for (const [against, asked] of [
      ['واتساب', 'مجموعة واتساب'],
      ['البريد الإلكتروني', 'بالبريد الإلكتروني'],
      ['الإكسل', 'ملفات إكسل'],
    ] as const) {
      const own = waiting.filter((entry) => entry.question.includes(asked));
      expect(own.length, `${against} has no question of its own`).toBeGreaterThan(0);
    }

    const answers = waiting.map((entry) => entry.answer).join(' ');
    for (const against of ['واتساب', 'البريد الإلكتروني', 'إكسل']) {
      expect(answers, `nothing compares Rabaed with ${against}`).toContain(against);
    }
    for (const figure of UNSOURCED_FIGURES) expect(answers).not.toContain(figure);
  });

  test('none of them appears on a page', async ({ request }) => {
    for (const comparison of COMPARISONS) {
      expect(await visit(request, comparison.at), `«${comparison.question}» reached a visitor`).not.toContain(
        comparison.question,
      );
    }
  });
});
