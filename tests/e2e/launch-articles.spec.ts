/**
 * The launch articles (ticket 38): six Arabic articles waiting in the CMS for
 * Ahmed to read, put his name on and publish — one for each kind of question
 * an answer engine breaks a question into (HANDOFF §6.5).
 *
 * They are imported as **drafts** by `20260921_101500_import_launch_articles`,
 * so on a fresh database they are already there and no visitor can reach one.
 * What this suite holds them to is what the ticket asks: that all six exist,
 * that each answers the kind of question it claims to, that each opens with a
 * standalone answer of 30 to 60 words, that none states a figure nobody can
 * source — and that publishing one is refused until it carries a real
 * person's name and a cover, which is the approval the ticket requires.
 *
 * Every expectation is restated here rather than imported from
 * `src/migrations/launch-articles/`, for the reason `routes.ts` gives: a test
 * that reads its expectation out of the data under test agrees with it by
 * construction, and would keep agreeing if an article went missing.
 *
 * **Runs last** (playwright.config.ts). The last test publishes an article,
 * which puts it on the blog index, in the sitemap and in `llms.txt` — all of
 * which other suites read — and unpublishes it again afterwards.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { LAUNCH_ARTICLES_EDITOR, logInByApi, uploadImage } from './cms';
import { nodesOf, structuredData } from './structured-data';

test.describe.configure({ mode: 'default' });

/**
 * The six addresses, and words that only an article answering that kind of
 * question would carry. The comparison's three are the ticket's own: «ربائد
 * against WhatsApp, email and spreadsheets», the gap the handoff calls the
 * weakest and the most asked for.
 */
const LAUNCH_ARTICLES = [
  { kind: 'تعريف', slug: 'what-is-rabaed', phrases: ['ربائد منصة سعودية', 'المالك والاستشاري والمقاول'] },
  { kind: 'مقارنة', slug: 'rabaed-vs-whatsapp-email-excel', phrases: ['واتساب', 'البريد الإلكتروني', 'الإكسل'] },
  { kind: 'كيف', slug: 'from-request-to-approval', phrases: ['من الطلب إلى الاعتماد', 'إشعار الاستلام'] },
  { kind: 'حالة استخدام', slug: 'engineering-office-five-projects', phrases: ['مكتب هندسي', 'خمسة مشاريع'] },
  { kind: 'اعتراض', slug: 'what-if-the-contractor-refuses', phrases: ['ماذا لو رفض', 'ومن يملك البيانات'] },
  { kind: 'توسيع كيان', slug: 'who-is-behind-rabaed', phrases: ['شركة ربائد البناء', '7050078786', 'الرياض'] },
] as const;

/**
 * The four figures on the home page's proof deck that nobody can yet source
 * (ticket 47). No launch article may state one: an article is exactly what an
 * assistant lifts a number out of, and a number that is quoted and cannot be
 * backed cannot be recalled.
 */
const UNSOURCED_FIGURES = ['3.6×', '7×', '31%', '22%'];

/** A page as a visitor with no session receives it: status and HTML. */
async function visit(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  return { status: response.status(), html: await response.text() };
}

/** One launch article as the CMS holds it, drafts included. */
async function draftArticle(editor: APIRequestContext, slug: string) {
  const response = await editor.get(`/api/posts?draft=true&depth=0&where[slug][equals]=${slug}`);
  expect(response.ok(), await response.text()).toBe(true);
  const { docs } = await response.json();
  expect(docs, slug).toHaveLength(1);
  return docs[0] as {
    id: number;
    title: string;
    answer: string;
    summary: string;
    author: string;
    coverImage: number | null;
    publishedAt: string;
    _status: string;
  };
}

/** Words as both Arabic and English count them: what stands between the spaces. */
const words = (text: string) => text.trim().split(/\s+/).length;

/** The first paragraph the page draws under its title — the answer-first opening. */
function openingParagraph(page: Page): Promise<string | undefined> {
  return page.evaluate(() => {
    const heading = document.querySelector('h1')!;
    return [...document.querySelectorAll('p')]
      .find((p) => heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING && p.textContent?.trim())
      ?.textContent?.trim();
  });
}

test('the six launch articles are in the CMS as drafts, and no visitor can reach one', async ({ page, request }) => {
  await logInByApi(page.request, LAUNCH_ARTICLES_EDITOR);

  for (const { slug } of LAUNCH_ARTICLES) {
    const article = await draftArticle(page.request, slug);

    // Written, but not Ahmed's yet: the two fields that are his are the two
    // Payload requires to publish, so they are the approval gate.
    expect(article._status, slug).toBe('draft');
    expect(article.author, slug).toBe('');
    expect(article.coverImage, slug).toBeNull();
    expect(article.title.length, slug).toBeGreaterThan(0);
    expect(article.summary.length, slug).toBeGreaterThan(0);
    expect(article.publishedAt, slug).toBeTruthy();

    // Nowhere a visitor, a search engine or an assistant can find it.
    expect((await visit(request, `/blog/${slug}`)).status, slug).toBe(404);
  }

  const index = await visit(request, '/blog');
  const sitemap = await visit(request, '/sitemap.xml');
  const llms = await visit(request, '/llms.txt');
  for (const { slug } of LAUNCH_ARTICLES) {
    expect(index.html, slug).not.toContain(`/blog/${slug}`);
    expect(sitemap.html, slug).not.toContain(`/blog/${slug}`);
    expect(llms.html, slug).not.toContain(`/blog/${slug}`);
  }
});

test('each article answers its own kind of question, opening with a standalone answer of 30 to 60 words', async ({
  page,
}) => {
  await logInByApi(page.request, LAUNCH_ARTICLES_EDITOR);

  for (const { kind, slug, phrases } of LAUNCH_ARTICLES) {
    const article = await draftArticle(page.request, slug);

    // The spec's rule for the paragraph an engine quotes, which the CMS
    // enforces on publishing and a draft may slip past.
    expect(words(article.answer), `${kind} · ${slug}`).toBeGreaterThanOrEqual(30);
    expect(words(article.answer), `${kind} · ${slug}`).toBeLessThanOrEqual(60);

    // The editor's preview: the article whole, as Ahmed reads it before
    // publishing and as a visitor would read it after.
    await page.goto(`/api/preview?path=/blog/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title);
    expect(await openingParagraph(page), `${kind} · ${slug}`).toBe(article.answer);

    const body = await page.locator('.entry-body').innerText();
    for (const phrase of phrases) expect(body + article.answer + article.title, `${kind} · ${slug}`).toContain(phrase);
    // Written as an article, not as one long paragraph: an engine reads by
    // heading, and the spec asks every section to open with its own answer.
    expect(await page.locator('.entry-body h2').count(), `${kind} · ${slug}`).toBeGreaterThanOrEqual(3);
    for (const figure of UNSOURCED_FIGURES) expect(body, `${kind} · ${slug}`).not.toContain(figure);
  }
});

test('an article is published only once it carries a real person’s name and a cover — and then it is found', async ({
  page,
  request,
  baseURL,
}) => {
  await logInByApi(page.request, LAUNCH_ARTICLES_EDITOR);
  const { slug } = LAUNCH_ARTICLES[1];
  const article = await draftArticle(page.request, slug);
  const address = `${baseURL}/blog/${slug}`;
  const author = 'كاتب الاختبار';
  let cover: number | null = null;

  try {
    // As it arrives, publishing is refused: the byline is the founder's to
    // give, and so is the picture (ticket 38).
    const asImported = await page.request.patch(`/api/posts/${article.id}`, { data: { _status: 'published' } });
    expect(asImported.status(), await asImported.text()).toBe(400);

    cover = await uploadImage(page.request, 'صورة غلاف لاختبار مقالات الإطلاق');
    const withoutCover = await page.request.patch(`/api/posts/${article.id}`, { data: { author, _status: 'published' } });
    expect(withoutCover.status(), await withoutCover.text()).toBe(400);

    const published = await page.request.patch(`/api/posts/${article.id}`, {
      data: { author, coverImage: cover, _status: 'published' },
    });
    expect(published.ok(), await published.text()).toBe(true);

    // Its own address, the index, the sitemap and llms.txt — everything
    // publishing an article reaches (ticket 23), now reaching this one.
    await expect.poll(async () => (await visit(request, `/blog/${slug}`)).status).toBe(200);
    const post = await visit(request, `/blog/${slug}`);
    expect(post.html).toContain(article.title);
    expect(post.html).toContain(article.answer);
    expect(post.html).toContain(author);

    expect((await visit(request, '/blog')).html).toContain(`href="/blog/${slug}"`);
    expect((await visit(request, '/sitemap.xml')).html).toContain(`<loc>${address}</loc>`);
    expect((await visit(request, '/llms.txt')).html).toContain(`](${address}): ${article.summary}`);

    // Article data, described by the same answer the page opens with.
    const [posting] = nodesOf(structuredData(post.html), 'BlogPosting');
    expect(posting).toMatchObject({
      headline: article.title,
      description: article.answer,
      author: { '@type': 'Person', name: author },
      inLanguage: 'ar',
      url: address,
    });
  } finally {
    // Back to the draft it arrived as, so nothing this ran leaves the article
    // published for the suites beside it. Unpublished first, while the name
    // and the cover are still there: the same rules that refused to publish
    // it would refuse a save that both clears them and stays published.
    await page.request.patch(`/api/posts/${article.id}`, { data: { _status: 'draft' } });
    await page.request.patch(`/api/posts/${article.id}?draft=true`, {
      data: { author: '', coverImage: null, _status: 'draft' },
    });
    if (cover !== null) await page.request.delete(`/api/media/${cover}`);
  }

  await expect.poll(async () => (await visit(request, `/blog/${slug}`)).status).toBe(404);
  expect((await visit(request, '/sitemap.xml')).html).not.toContain(`<loc>${address}</loc>`);
  const restored = await draftArticle(page.request, slug);
  expect(restored).toMatchObject({ _status: 'draft', author: '', coverImage: null });
});
