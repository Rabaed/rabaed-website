/**
 * The launch articles (ticket 38): six Arabic articles waiting in the CMS for
 * Ahmed to read, put his name on and publish — one for each kind of question
 * an answer engine breaks a question into (HANDOFF §6.5) — and each of them in
 * English beside it at the same slug (ticket 43).
 *
 * They are imported as **drafts** by `20260921_101500_import_launch_articles`,
 * so on a fresh database they are already there and no visitor can reach one.
 * What this suite holds them to is what the ticket asks: that all six exist,
 * complete with the Screen mock each opens with, that each answers the kind of
 * question it claims to, that each opens with a standalone answer of 30 to 60
 * words, that none states a figure nobody can source — and that publishing one
 * is refused until a real person's name is on it, which is the approval the
 * ticket requires.
 *
 * Every expectation is restated here rather than imported from
 * `src/migrations/launch-articles/`, for the reason `routes.ts` gives: a test
 * that reads its expectation out of the data under test agrees with it by
 * construction, and would keep agreeing if an article went missing.
 *
 * **Runs against the second test server** (`playwright.config.ts`, ticket 89).
 * The last test publishes an article, which puts it on the blog index, in the
 * sitemap and in `llms.txt` — all of which other suites read — and
 * unpublishes it again afterwards.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { signIn } from './editors';
import { nodesOf, structuredData } from './structured-data';

test.describe.configure({ mode: 'default' });

/**
 * The six addresses, and words that only an article answering that kind of
 * question would carry. The comparison's three are the ticket's own: «ربائد
 * against WhatsApp, email and spreadsheets», the gap the handoff calls the
 * weakest and the most asked for.
 */
const EXPECTED_ARTICLES = [
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

/** One launch article as the CMS holds it, drafts included: the Arabic, or its English at the same slug. */
async function draftArticle(editor: APIRequestContext, slug: string, locale: 'ar' | 'en' = 'ar') {
  const response = await editor.get(
    `/api/posts?draft=true&depth=0&where[slug][equals]=${slug}&where[locale][equals]=${locale}`,
  );
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

/** One article's cover, as the CMS holds it. */
async function coverImage(editor: APIRequestContext, id: number) {
  const response = await editor.get(`/api/media/${id}`);
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()) as { alt: string; url: string; mimeType: string; filename: string };
}

/**
 * The six in English (ticket 43): each at its Arabic's slug, and words only
 * that article's English would carry.
 */
const EXPECTED_ENGLISH = [
  {
    slug: 'what-is-rabaed',
    cover: 'stamped-sheet-en.webp',
    phrases: ['Rabaed is a Saudi platform', 'the Owner, the Consultant and the Contractor'],
  },
  { slug: 'rabaed-vs-whatsapp-email-excel', cover: 'correspondence-en.webp', phrases: ['WhatsApp', 'email', 'Excel'] },
  { slug: 'from-request-to-approval', cover: 'kanban-en.webp', phrases: ['five steps', 'automatic receipt'] },
  {
    slug: 'engineering-office-five-projects',
    cover: 'approvals-table-en.webp',
    phrases: ['five projects', 'representative case'],
  },
  { slug: 'what-if-the-contractor-refuses', cover: 'submittal-en.webp', phrases: ['used against', 'who owns the data'] },
  { slug: 'who-is-behind-rabaed', cover: 'overview-en.webp', phrases: ['شركة ربائد البناء', '7050078786', 'Riyadh'] },
] as const;

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
  await signIn(page.request);

  for (const { slug } of EXPECTED_ARTICLES) {
    const article = await draftArticle(page.request, slug);

    // Complete but for the byline, which is Ahmed's, and which Payload
    // requires to publish — so it is the approval gate.
    expect(article._status, slug).toBe('draft');
    expect(article.author, slug).toBe('');
    expect(article.title.length, slug).toBeGreaterThan(0);
    expect(article.summary.length, slug).toBeGreaterThan(0);
    expect(article.publishedAt, slug).toBeTruthy();

    // A cover it arrived with: the Screen mock of the screen it is about,
    // served as an image and described for a screen reader.
    expect(article.coverImage, slug).toEqual(expect.any(Number));
    const cover = await coverImage(page.request, article.coverImage!);
    expect(cover.alt, slug).toContain('ربائد');
    const served = await request.get(cover.url);
    expect(served.status(), `${slug}: ${cover.url}`).toBe(200);
    expect(served.headers()['content-type'], slug).toMatch(/^image\//);

    // Nowhere a visitor, a search engine or an assistant can find it.
    expect((await visit(request, `/blog/${slug}`)).status, slug).toBe(404);
  }

  const index = await visit(request, '/blog');
  const sitemap = await visit(request, '/sitemap.xml');
  const llms = await visit(request, '/llms.txt');
  for (const { slug } of EXPECTED_ARTICLES) {
    expect(index.html, slug).not.toContain(`/blog/${slug}`);
    expect(sitemap.html, slug).not.toContain(`/blog/${slug}`);
    expect(llms.html, slug).not.toContain(`/blog/${slug}`);
  }
});

test('each article waits in English too: a draft at its slug, with an English cover and English links', async ({
  page,
  request,
}) => {
  await signIn(page.request);

  for (const { slug, cover: coverFile, phrases } of EXPECTED_ENGLISH) {
    const article = await draftArticle(page.request, slug, 'en');

    // The same gate as the Arabic: a draft, the byline left for a person.
    expect(article._status, slug).toBe('draft');
    expect(article.author, slug).toBe('');
    expect(words(article.answer), slug).toBeGreaterThanOrEqual(30);
    expect(words(article.answer), slug).toBeLessThanOrEqual(60);

    // Its own cover: the English Screen mock of the screen it is about, under a
    // name of its own rather than the Arabic cover's, described in English.
    expect(article.coverImage, slug).toEqual(expect.any(Number));
    const arabic = await draftArticle(page.request, slug, 'ar');
    expect(article.coverImage, slug).not.toBe(arabic.coverImage);
    const cover = await coverImage(page.request, article.coverImage!);
    expect(cover.filename, slug).toBe(coverFile);
    expect(cover.alt, slug).toContain('Rabaed');
    const served = await request.get(cover.url);
    expect(served.status(), `${slug}: ${cover.url}`).toBe(200);
    expect(served.headers()['content-type'], slug).toMatch(/^image\//);

    // Read as Ahmed previews it: its words, left to right, and every link to
    // a page of the site going to that page's English address — save the
    // Terms, which are only ever Arabic.
    await page.goto(`/api/preview?path=/en/blog/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title);
    expect(await openingParagraph(page), slug).toBe(article.answer);
    const body = (await page.locator('article').first().textContent()) ?? '';
    for (const phrase of phrases) expect(body, `${slug}: «${phrase}»`).toContain(phrase);
    const links = await page
      .locator('article a[href^="/"]')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')!));
    expect(links.length, `${slug}: its links to the site's pages`).toBeGreaterThan(0);
    for (const href of links) {
      expect(href.startsWith('/en/') || href === '/terms', `${slug}: ${href}`).toBe(true);
    }

    // And nowhere a visitor can find it.
    expect((await visit(request, `/en/blog/${slug}`)).status, slug).toBe(404);
  }
});

test('each article answers its own kind of question, opening with a standalone answer of 30 to 60 words', async ({
  page,
}) => {
  await signIn(page.request);

  for (const { kind, slug, phrases } of EXPECTED_ARTICLES) {
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

    // Everything the article puts in front of a reader, the parts an engine
    // lifts first — the title, the summary and the opening answer — included.
    const written = [article.title, article.summary, article.answer, await page.getByRole('article').innerText()];
    const somewhere = (phrase: string) => written.some((part) => part.includes(phrase));
    for (const phrase of phrases) expect(somewhere(phrase), `${kind} · ${slug} · ${phrase}`).toBe(true);
    for (const figure of UNSOURCED_FIGURES) expect(somewhere(figure), `${kind} · ${slug} · ${figure}`).toBe(false);
    // Written as an article rather than as one long paragraph, so that an
    // engine reading by heading finds more than one place to read.
    expect(await page.getByRole('heading', { level: 2 }).count(), `${kind} · ${slug}`).toBeGreaterThanOrEqual(3);
  }
});

test('an article is published only once a real person’s name is on it — and then it is found', async ({
  page,
  request,
  baseURL,
}) => {
  await signIn(page.request);
  const { slug } = EXPECTED_ARTICLES[1];
  const article = await draftArticle(page.request, slug);
  const address = `${baseURL}/blog/${slug}`;
  const author = 'كاتب الاختبار';

  try {
    // As it arrives, publishing is refused. The cover is already there; the
    // byline is the founder's to give (ticket 38).
    const asImported = await page.request.patch(`/api/posts/${article.id}`, { data: { _status: 'published' } });
    expect(asImported.status(), await asImported.text()).toBe(400);

    // «Author attribution is a real person, not the company» (ticket 38). No
    // validator can prove a name is a person's, but the company's own names
    // are the one wrong answer worth refusing outright.
    for (const company of ['ربائد', 'Rabaed', 'شركة ربائد البناء']) {
      const asCompany = await page.request.patch(`/api/posts/${article.id}`, {
        data: { author: company, _status: 'published' },
      });
      expect(asCompany.status(), `${company}: ${await asCompany.text()}`).toBe(400);
    }

    const published = await page.request.patch(`/api/posts/${article.id}`, {
      data: { author, _status: 'published' },
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
    // published for the suites after it on this server. Unpublished first, while the name
    // and the cover are still there: the same rules that refused to publish
    // it would refuse a save that both clears them and stays published.
    await page.request.patch(`/api/posts/${article.id}`, { data: { _status: 'draft' } });
    await page.request.patch(`/api/posts/${article.id}?draft=true`, {
      data: { author: '', _status: 'draft' },
    });
  }

  await expect.poll(async () => (await visit(request, `/blog/${slug}`)).status).toBe(404);
  expect((await visit(request, '/sitemap.xml')).html).not.toContain(`<loc>${address}</loc>`);
  const restored = await draftArticle(page.request, slug);
  expect(restored).toMatchObject({ _status: 'draft', author: '' });
  // The cover it arrived with is untouched: nothing here uploaded one.
  expect(restored.coverImage).toBe(article.coverImage);
});
