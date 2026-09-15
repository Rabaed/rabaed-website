/**
 * The blog (ticket 23): Ahmed writes an article, previews it, publishes it, and
 * it appears on the blog index and at its own address — whole in the first
 * response, and in the sitemap — while until then no visitor can reach it.
 *
 * Articles are created through the CMS's own API as the test editor, and
 * deleted again after each test. The tests run one at a time: the index test
 * reads the order the index shows, which an article another test had
 * published a moment earlier would disturb. They sign in as an editor of
 * their own, so that `cms.spec.ts`, running beside them, never loses a session
 * to them (`cms.ts`).
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN_PATH, BLOG_EDITOR, logInByApi, richText, uploadImage } from './cms';

test.describe.configure({ mode: 'default' });

/** Restated rather than imported, for the reason `routes.ts` gives. */
const POSTS_PER_PAGE = 9;

/** An opening answer of 45 words: inside the 30 to 60 the spec asks for. */
const ANSWER =
  'ربائد منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق لكل طلب واعتماد في مشروع الإنشاء، فلا تضيع مراسلة في واتساب ولا يتأخر اعتماد لأن أحداً لم يره، ويعرف كل طرف في أي لحظة ما الذي ينتظره وما الذي أُنجز ومن قرّر ماذا ومتى.';

type Locale = 'ar' | 'en';

type Article = {
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  answer: string;
  author: string;
  body: string;
  publishedAt: string;
};

/** Keeps this run's slugs and titles apart from anything an earlier run left behind. */
const runId = Date.now().toString(36);
let serial = 0;
let createdPosts: number[] = [];
let cover: number | null = null;

function article(overrides: Partial<Article> = {}): Article {
  serial += 1;
  return {
    locale: 'ar',
    title: `مقالة للاختبار ${runId} رقم ${serial}`,
    slug: `test-${runId}-${serial}`,
    summary: `ملخص مقالة الاختبار رقم ${serial}.`,
    answer: ANSWER,
    author: 'كاتب الاختبار',
    body: `فقرة من متن مقالة الاختبار رقم ${serial}.`,
    publishedAt: '2026-09-13T12:00:00.000Z',
    ...overrides,
  };
}

/** The cover image every article in a test shares, uploaded on first use. */
async function coverImage(editor: APIRequestContext): Promise<number> {
  cover ??= await uploadImage(editor, 'صورة غلاف للاختبار');
  return cover;
}

/** Sends an article to the CMS as the editor would save it, and returns the response. */
async function savePost(editor: APIRequestContext, fields: Article, status: 'published' | 'draft') {
  const response = await editor.post(`/api/posts${status === 'draft' ? '?draft=true' : ''}`, {
    data: {
      ...fields,
      body: richText(fields.body, fields.locale),
      coverImage: await coverImage(editor),
      _status: status,
    },
  });
  if (response.ok()) createdPosts.push((await response.json()).doc.id);
  return response;
}

async function createPost(editor: APIRequestContext, fields: Article, status: 'published' | 'draft' = 'published') {
  const response = await savePost(editor, fields, status);
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).doc as { id: number };
}

/** A page as a visitor with no session receives it: status and HTML. */
async function visit(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  return { status: response.status(), html: await response.text() };
}

test.afterEach(async ({ page }) => {
  await logInByApi(page.request, BLOG_EDITOR);
  for (const id of createdPosts) await page.request.delete(`/api/posts/${id}`);
  if (cover !== null) await page.request.delete(`/api/media/${cover}`);
  createdPosts = [];
  cover = null;
});

test('a published article is on the blog index and at its own address, whole in the first response', async ({
  page,
  request,
  browser,
  baseURL,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const fields = article();
  await createPost(page.request, fields);

  await expect.poll(async () => (await visit(request, '/blog')).html).toContain(fields.title);
  const index = await visit(request, '/blog');
  expect(index.html).toContain(fields.summary);
  expect(index.html).toContain(`href="/blog/${fields.slug}"`);

  const post = await visit(request, `/blog/${fields.slug}`);
  expect(post.status).toBe(200);
  for (const text of [fields.title, fields.answer, fields.body, fields.author]) {
    expect(post.html).toContain(text);
  }

  // With JavaScript off, in the site's shell, opening with the answer.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const visitor = await context.newPage();
  await visitor.goto(`/blog/${fields.slug}`);
  await expect(visitor.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(visitor.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(visitor.getByRole('heading', { level: 1 })).toHaveText(fields.title);
  await expect(visitor.getByRole('navigation').first()).toBeVisible();
  await expect(visitor.locator('footer')).toBeVisible();
  await expect(visitor.getByText(fields.body)).toBeVisible();

  const firstParagraph = await visitor.evaluate(() => {
    const heading = document.querySelector('h1')!;
    return [...document.querySelectorAll('p')]
      .find((p) => heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING && p.textContent?.trim())
      ?.textContent?.trim();
  });
  expect(firstParagraph).toBe(fields.answer);

  const image = visitor.getByRole('img', { name: 'صورة غلاف للاختبار' });
  await expect(image).toBeVisible();
  const imageResponse = await request.get((await image.getAttribute('src'))!);
  expect(imageResponse.headers()['content-type']).toBe('image/webp');

  await expect(visitor.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/blog/${fields.slug}`);
  await expect(visitor).toHaveTitle(new RegExp(fields.title));
  await expect(visitor.locator('meta[name="description"]')).toHaveAttribute('content', fields.summary);
  await context.close();

  // An article is not in `routes.ts` — the test database starts with none —
  // so the checks every page gets there are made here: it loads clean, and
  // nothing runs off the side of a narrow phone.
  const problems: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
  });
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(`/blog/${fields.slug}`);
  await page.evaluate(() => document.fonts.ready);
  expect(problems).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('a draft is nowhere a visitor can reach it; the editor previews it, then publishes it from the admin', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const fields = article();
  const { id } = await createPost(page.request, fields, 'draft');

  expect((await visit(request, `/blog/${fields.slug}`)).status).toBe(404);
  expect((await visit(request, '/blog')).html).not.toContain(fields.title);
  expect((await visit(request, '/sitemap.xml')).html).not.toContain(`/blog/${fields.slug}`);
  expect((await request.get(`/api/posts/${id}`)).ok()).toBe(false);

  await page.goto(`${ADMIN_PATH}/collections/posts/${id}`);
  const previewOpened = page.context().waitForEvent('page');
  await page.getByRole('link', { name: 'Preview' }).click();
  const preview = await previewOpened;
  await expect(preview.getByRole('heading', { level: 1 })).toHaveText(fields.title);
  await expect(preview.getByText(fields.body)).toBeVisible();
  await expect(preview.getByRole('status')).toContainText('معاينة');
  await preview.close();

  await page.getByRole('button', { name: 'Publish changes' }).click();
  await expect(page.getByText(/successfully/).first()).toBeVisible();

  await expect.poll(async () => (await visit(request, `/blog/${fields.slug}`)).status).toBe(200);
  await expect.poll(async () => (await visit(request, '/blog')).html).toContain(fields.title);
});

test('a draft saved over a published article reaches the editor’s preview, never a visitor', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const fields = article();
  const { id } = await createPost(page.request, fields);

  // Saved straight after publishing, before anyone has asked for the page, so
  // the page is first built while the draft is waiting. The test above cannot
  // see pages built from drafts: its draft has no published version to hide.
  const draft = { title: `${fields.title} — مسودة`, body: 'نص في المسودة لم يُنشر بعد.' };
  const drafted = await page.request.patch(`/api/posts/${id}?draft=true`, {
    data: { title: draft.title, body: richText(draft.body, 'ar'), _status: 'draft' },
  });
  expect(drafted.ok()).toBe(true);

  await expect.poll(async () => (await visit(request, `/blog/${fields.slug}`)).status).toBe(200);
  const published = await visit(request, `/blog/${fields.slug}`);
  expect(published.html).toContain(fields.body);
  expect(published.html).not.toContain(draft.body);
  expect((await visit(request, '/blog')).html).not.toContain(draft.title);

  await page.goto(`/api/preview?path=/blog/${fields.slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(draft.title);
  await expect(page.getByText(draft.body)).toBeVisible();
});

test('the index lists articles newest first, a page at a time', async ({ page, request }) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const articles = Array.from({ length: POSTS_PER_PAGE + 1 }, (_, day) =>
    article({ publishedAt: `2026-01-${String(day + 1).padStart(2, '0')}T12:00:00.000Z` }),
  );
  // Saved out of order, so the index cannot pass by listing them as they were saved.
  for (const fields of [...articles.slice(4), ...articles.slice(0, 4)]) await createPost(page.request, fields);
  const newestFirst = articles.map((fields) => fields.title).reverse();

  const titlesOn = async (path: string) => {
    await page.goto(path);
    return page.getByRole('article').getByRole('heading').allTextContents();
  };

  await expect.poll(() => titlesOn('/blog')).toEqual(newestFirst.slice(0, POSTS_PER_PAGE));
  const description = page.locator('meta[name="description"]');
  const firstPageDescription = await description.getAttribute('content');

  await page.getByRole('link', { name: 'المقالات الأقدم' }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2$/);
  // Each page of the index is a page of its own to a search engine (ticket 31).
  await expect(description).not.toHaveAttribute('content', firstPageDescription!);
  expect(await page.getByRole('article').getByRole('heading').allTextContents()).toEqual(
    newestFirst.slice(POSTS_PER_PAGE),
  );
  await expect(page.getByRole('link', { name: 'المقالات الأقدم' })).toHaveCount(0);

  await page.getByRole('link', { name: 'المقالات الأحدث' }).click();
  await expect(page).toHaveURL(/\/blog$/);

  // The first page has one address, and there is no page past the last.
  expect((await visit(request, '/blog/page/1')).status).toBe(404);
  expect((await visit(request, '/blog/page/3')).status).toBe(404);
});

test('an article is in the sitemap while it is published, and leaves it when unpublished', async ({
  page,
  request,
  baseURL,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const fields = article();
  const { id } = await createPost(page.request, fields);
  const address = `<loc>${baseURL}/blog/${fields.slug}</loc>`;

  await expect.poll(async () => (await visit(request, '/sitemap.xml')).html).toContain(address);

  const unpublished = await page.request.patch(`/api/posts/${id}`, { data: { _status: 'draft' } });
  expect(unpublished.ok()).toBe(true);

  await expect.poll(async () => (await visit(request, '/sitemap.xml')).html).not.toContain(address);
  await expect.poll(async () => (await visit(request, `/blog/${fields.slug}`)).status).toBe(404);
});

test('an article exists per language, and a missing translation offers the one that exists', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const arabic = article();
  await createPost(page.request, arabic);

  // Only the Arabic exists: the English address says so and links to it.
  await expect.poll(async () => (await visit(request, `/en/blog/${arabic.slug}`)).status).toBe(200);
  await page.goto(`/en/blog/${arabic.slug}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('link', { name: 'Read it in Arabic' })).toHaveAttribute('href', `/blog/${arabic.slug}`);
  await expect(page.getByText(arabic.title)).toHaveCount(0);

  // Each language's index lists its own articles only.
  const english = article({
    locale: 'en',
    slug: arabic.slug,
    title: `Test article ${runId}`,
    summary: 'A summary of the test article.',
    body: 'A paragraph from the body of the test article.',
    author: 'Test Author',
  });
  await createPost(page.request, english);

  await expect.poll(async () => (await visit(request, `/en/blog/${arabic.slug}`)).html).toContain(english.body);
  expect((await visit(request, '/en/blog')).html).toContain(english.title);
  expect((await visit(request, '/en/blog')).html).not.toContain(arabic.title);
  expect((await visit(request, '/blog')).html).not.toContain(english.title);

  // Now that both exist, each names the other as its alternate.
  await page.goto(`/blog/${arabic.slug}`);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', new RegExp(`/en/blog/${arabic.slug}$`));

  // The other way round: an English-only article, asked for in Arabic.
  const englishOnly = article({ locale: 'en', title: `English only ${runId}`, author: 'Test Author' });
  await createPost(page.request, englishOnly);
  await expect.poll(async () => (await visit(request, `/blog/${englishOnly.slug}`)).status).toBe(200);
  await page.goto(`/blog/${englishOnly.slug}`);
  await expect(page.getByRole('link', { name: 'اقرأها بالإنجليزية' })).toHaveAttribute('href', `/en/blog/${englishOnly.slug}`);

  // An article in neither language is simply not there.
  expect((await visit(request, `/en/blog/test-${runId}-nowhere`)).status).toBe(404);
});

test('an article cannot be published without an opening answer of 30 to 60 words, or on an address already taken', async ({
  page,
}) => {
  await logInByApi(page.request, BLOG_EDITOR);
  const tooShort = await savePost(page.request, article({ answer: 'جواب قصير جداً.' }), 'published');
  expect(tooShort.status()).toBe(400);
  const tooLong = await savePost(page.request, article({ answer: `${ANSWER} ${ANSWER}` }), 'published');
  expect(tooLong.status()).toBe(400);

  const first = article();
  await createPost(page.request, first);
  const sameAddress = await savePost(page.request, article({ slug: first.slug }), 'published');
  expect(sameAddress.status()).toBe(400);

  // Nothing else the spec requires of an article may be left out either.
  const withoutCover = article();
  const noCover = await page.request.post('/api/posts', {
    data: { ...withoutCover, body: richText(withoutCover.body, 'ar'), _status: 'published' },
  });
  if (noCover.ok()) createdPosts.push((await noCover.json()).doc.id);
  expect(noCover.status()).toBe(400);
  const noAuthor = await savePost(page.request, article({ author: '' }), 'published');
  expect(noAuthor.status()).toBe(400);

  // A draft may be unfinished: Ahmed saves as he writes.
  const unfinished = await savePost(page.request, article({ answer: 'مسودة لم تكتمل.' }), 'draft');
  expect(unfinished.ok()).toBe(true);
});
