/**
 * FAQs in the CMS (ticket 22): Ahmed adds, edits, reorders, hides and removes
 * the questions on any page that has them, and the page follows once he
 * publishes.
 *
 * Every page's questions are checked word for word by that page's own suite,
 * and its look by the suites that compare it with the Reference site — all of
 * them running beside this one. So nothing here publishes a change a visitor
 * could see in a way those suites notice. Questions this suite adds are saved
 * as drafts, and hidden, reordered and removed while still drafts, which the
 * editor's preview shows and visitors never do; the ones it tries to publish
 * are ones the CMS refuses. The one change published adds words to the end of
 * an answer on the referral page, whose suite checks that each answer is *in*
 * the page, and whose answers sit closed in the pictures.
 *
 * The reorder is sent to the endpoint the admin's list calls when a row is
 * dropped, rather than dragged with the mouse.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { ADMIN_PATH, FAQ_EDITOR, logInAs, logInByApi, reaching } from './cms';

test.describe.configure({ mode: 'default' });

/**
 * Where each page's questions are, and how many it had on the Reference site.
 * Restated rather than imported, for the reason `routes.ts` gives.
 */
const FAQ_PAGES = {
  home: { path: '/', section: '#fq', count: 3, admin: 'Home page' },
  start: { path: '/start', section: '#faq', count: 7, admin: 'Start page' },
  tool: { path: '/tool', section: '#faq', count: 6, admin: 'Tool page' },
  referral: { path: '/referral', section: '#faq', count: 9, admin: 'Referral Program page' },
  partnership: { path: '/partnership', section: '#faq', count: 6, admin: 'Partnership Program page' },
} as const;

type FaqPage = keyof typeof FAQ_PAGES;

type Entry = {
  id: number;
  page: FaqPage;
  question: string;
  answer: string;
  shows: boolean;
  _order: string;
  _status: 'draft' | 'published';
};

/** Keeps this run's questions apart from anything an earlier run left behind. */
const runId = Date.now().toString(36);
let created: number[] = [];

/** A page's questions as the CMS holds them, in their order. */
async function entries(editor: APIRequestContext, page: FaqPage, draft = false): Promise<Entry[]> {
  const response = await editor.get(
    `/api/faq-entries?where[page][equals]=${page}&where[locale][equals]=ar&sort=_order&pagination=false&depth=0${draft ? '&draft=true' : ''}`,
  );
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).docs;
}

/** A question saved as a draft through the API, as the editor's Save Draft would. */
async function draftEntry(editor: APIRequestContext, page: FaqPage, question: string, answer: string): Promise<Entry> {
  const response = await editor.post('/api/faq-entries?draft=true', {
    data: { page, locale: 'ar', question, answer, shows: true, _status: 'draft' },
  });
  expect(response.ok(), await response.text()).toBe(true);
  const { doc } = await response.json();
  created.push(doc.id);
  return doc;
}

/** The questions a page shows, in order, read from the HTML. */
function questionsIn(html: string): string[] {
  return [...html.matchAll(/<summary>([^<]*)<\/summary>/g)].map((match) => match[1]);
}

async function visitorHtml(request: APIRequestContext, path: string): Promise<string> {
  return (await request.get(path)).text();
}

/** Opens the site in preview at a page, as the admin's Preview button does. */
async function preview(page: Page, path: string): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

test.afterEach(async ({ page }) => {
  await logInByApi(page.request, FAQ_EDITOR);
  for (const id of created) await page.request.delete(`/api/faq-entries/${id}`);
  created = [];
  // Leave the browser out of preview for whatever runs next in it.
  await page.request.get('/api/preview/exit');
});

test('the 31 questions are in the CMS, grouped by the page they are on', async ({ page }) => {
  await logInByApi(page.request, FAQ_EDITOR);
  let total = 0;
  for (const [key, faqPage] of Object.entries(FAQ_PAGES) as [FaqPage, (typeof FAQ_PAGES)[FaqPage]][]) {
    const published = (await entries(page.request, key)).filter((entry) => entry._status === 'published');
    expect(published, key).toHaveLength(faqPage.count);
    total += published.length;
  }
  expect(total).toBe(31);
});

test('every page shows its questions from the CMS, in the CMS’s order, as native disclosure elements', async ({
  page,
  request,
  browser,
}) => {
  await logInByApi(page.request, FAQ_EDITOR);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const visitor = await context.newPage();

  for (const [key, faqPage] of Object.entries(FAQ_PAGES) as [FaqPage, (typeof FAQ_PAGES)[FaqPage]][]) {
    const shown = (await entries(page.request, key)).filter((entry) => entry._status === 'published' && entry.shows);
    expect(questionsIn(await visitorHtml(request, faqPage.path)), key).toEqual(shown.map((entry) => entry.question));

    await visitor.goto(faqPage.path);
    await expect(visitor.locator(`${faqPage.section} details > summary`), key).toHaveCount(shown.length);
  }
  await context.close();
});

test('a question added in the admin is saved as a draft: the editor previews it, visitors never see it', async ({
  page,
  request,
}) => {
  const question = `هل تُضاف الأسئلة من لوحة التحرير؟ ${runId}`;
  // A file name between backticks, set left to right; a Referral Program value
  // named in braces, inserted rather than typed.
  const answer = 'نعم. يُحفظ في ملف `concrete_db.json` ويُحتسب {payout} ريال عن كل مشروع.';

  await logInAs(page, FAQ_EDITOR);
  await page.goto(`${ADMIN_PATH}/collections/faq-entries/create`);
  await page.locator('#field-page').click();
  await page.locator('.rs__option', { hasText: FAQ_PAGES.partnership.admin }).click();
  await page.getByLabel('Question').fill(question);
  await page.getByLabel('Answer').fill(answer);
  await page.getByRole('button', { name: 'Save Draft' }).click();
  // A first save creates the entry, and says so in words of its own.
  await expect(page.getByText(/successfully/).first()).toBeVisible();
  await expect(page).toHaveURL(/\/collections\/faq-entries\/\d+/);
  created.push(Number(page.url().match(/\/(\d+)(?:\?|$)/)![1]));

  expect(questionsIn(await visitorHtml(request, '/partnership'))).not.toContain(question);

  const previewOpened = page.context().waitForEvent('page');
  await page.getByRole('link', { name: 'Preview' }).click();
  const previewPage = await previewOpened;
  await expect(previewPage.getByRole('status')).toContainText('معاينة');
  const added = previewPage.locator('#faq details', { hasText: question });
  await expect(added).toHaveCount(1);
  await expect(added.locator('[dir="ltr"]')).toHaveText('concrete_db.json');
  await expect(added.locator('p')).toHaveText('نعم. يُحفظ في ملف concrete_db.json ويُحتسب 2,000 ريال عن كل مشروع.');
});

test('a question is reordered, hidden and removed from the admin, and the preview follows each change', async ({
  page,
  request,
}) => {
  await logInAs(page, FAQ_EDITOR);
  const first = await draftEntry(page.request, 'tool', `سؤال للإخفاء ${runId}`, 'جواب سؤال الإخفاء.');
  const second = await draftEntry(page.request, 'tool', `سؤال لإعادة الترتيب ${runId}`, 'جواب سؤال الترتيب.');
  const [top] = (await entries(page.request, 'tool')).filter((entry) => entry._status === 'published');

  // Added last, so shown last.
  await preview(page, '/tool');
  expect((await page.locator('#faq summary').allTextContents()).slice(-2)).toEqual([first.question, second.question]);

  // Dragged above the page's first question, which is what the admin's list
  // sends when a row is dropped there.
  const moved = await page.request.post('/api/reorder', {
    data: {
      collectionSlug: 'faq-entries',
      docsToMove: [second.id],
      newKeyWillBe: 'less',
      orderableFieldName: '_order',
      target: { id: top.id, key: top._order },
    },
  });
  expect(moved.ok(), await moved.text()).toBe(true);

  // Hidden, and saved as a draft, from its own page in the admin.
  await page.goto(`${ADMIN_PATH}/collections/faq-entries/${first.id}`);
  await page.getByLabel('Shows on the page').uncheck();
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page.getByText(/Draft saved successfully/)).toBeVisible();

  await preview(page, '/tool');
  const shown = await page.locator('#faq summary').allTextContents();
  expect(shown[0]).toBe(second.question);
  expect(shown).not.toContain(first.question);

  // Removed.
  const removed = await page.request.delete(`/api/faq-entries/${second.id}`);
  expect(removed.ok()).toBe(true);
  await preview(page, '/tool');
  expect(await page.locator('#faq summary').allTextContents()).not.toContain(second.question);

  // None of it ever reached a visitor.
  const visitorQuestions = questionsIn(await visitorHtml(request, '/tool'));
  expect(visitorQuestions).not.toContain(first.question);
  expect(visitorQuestions).not.toContain(second.question);
});

test('an answer edited and published in the admin reaches visitors', async ({ page, request }) => {
  const EDIT = ' — تعديل منشور للاختبار';
  await logInAs(page, FAQ_EDITOR);
  const entry = (await entries(page.request, 'referral')).find((each) => each.question === 'هل هناك حد أقصى للمبالغ؟')!;
  expect(entry).toBeDefined();

  try {
    await page.goto(`${ADMIN_PATH}/collections/faq-entries/${entry.id}`);
    await page.getByLabel('Answer').fill(`${entry.answer}${EDIT}`);
    await page.getByRole('button', { name: 'Publish changes' }).click();
    await expect(page.getByText('Updated successfully')).toBeVisible();

    await reaching("the editor's published answer on the referral page", () => visitorHtml(request, '/referral')).toContain(
      `${entry.answer}${EDIT}`,
    );
  } finally {
    const restored = await page.request.patch(`/api/faq-entries/${entry.id}`, {
      data: { answer: entry.answer, _status: 'published' },
    });
    expect(restored.ok()).toBe(true);
  }
});

test('a question too long for its card, or an answer the page could not draw, is refused', async ({ page }) => {
  await logInByApi(page.request, FAQ_EDITOR);
  const question = `سؤال مرفوض ${runId}`;
  const refused = [
    { question: 'س'.repeat(161), answer: 'جواب.' },
    { question, answer: 'ج'.repeat(801) },
    // A value the site does not hold.
    { question, answer: 'يُحتسب {bonus} ريال.' },
    // A Latin name left open.
    { question, answer: 'يُحفظ في ملف `concrete_db.json ويبقى.' },
    // Arabic set in a typeface with no Arabic letters.
    { question, answer: 'يُحفظ في `ملف البيانات`.' },
  ];
  for (const fields of refused) {
    const response = await page.request.post('/api/faq-entries', {
      data: { page: 'tool', locale: 'ar', ...fields, _status: 'published' },
    });
    if (response.ok()) created.push((await response.json()).doc.id);
    expect(response.status(), fields.answer.slice(0, 40)).toBe(400);
  }
});
