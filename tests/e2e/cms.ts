/**
 * What the CMS suites share: where the admin lives, and the editor account the
 * test server creates in its throwaway database before the build
 * (`scripts/test-server.mjs`).
 *
 * `ADMIN_PATH` is restated rather than imported from the application, for the
 * reason `routes.ts` gives: a test that reads its expectation out of the code
 * under test agrees with that code by construction.
 */
import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import sharp from 'sharp';

export const ADMIN_PATH = '/maktab';

type Editor = { readonly email: string; readonly password: string };

/** Exists only in the database the test server creates and deletes. */
export const TEST_EDITOR = {
  email: 'editor@rabaed.test',
  password: 'test-editor-password-19',
} as const;

/**
 * The blog suite's own account. Payload records a login by reading the
 * editor's list of sessions, adding one and writing the list back, so two
 * suites signing in to one account in the same instant can erase each other's
 * session — `cms.spec.ts` explains how that surfaced. Suites that run side by
 * side, as those two do, therefore sign in as different editors.
 */
export const BLOG_EDITOR = {
  email: 'blog-editor@rabaed.test',
  password: 'test-editor-password-23',
} as const;

/** The FAQ suite's own account, for the same reason. */
export const FAQ_EDITOR = {
  email: 'faq-editor@rabaed.test',
  password: 'test-editor-password-22',
} as const;

/** The case studies suite's own account, for the same reason as `BLOG_EDITOR`. */
export const CASE_STUDIES_EDITOR = {
  email: 'case-studies-editor@rabaed.test',
  password: 'test-editor-password-24',
} as const;

/**
 * The form suite's two accounts (ticket 27): one that its side-by-side tests
 * share to read what they stored (`forms.ts` explains how they share it), and
 * one for its tests that change the forms' settings, one at a time.
 */
export const FORM_READER = {
  email: 'form-reader@rabaed.test',
  password: 'test-editor-password-27r',
} as const;

export const FORM_EDITOR = {
  email: 'form-editor@rabaed.test',
  password: 'test-editor-password-27e',
} as const;

/**
 * The partnership application's settings account (ticket 29). Its test
 * changes that form's alert address while the tests above change the demo
 * request form's, so the two run side by side — and they need accounts of
 * their own, or one login would erase the other's session.
 */
export const PARTNERSHIP_FORM_EDITOR = {
  email: 'partnership-form-editor@rabaed.test',
  password: 'test-editor-password-29',
} as const;

/** The page-text suite's own account (ticket 53), for the same reason as `BLOG_EDITOR`. */
export const PAGES_EDITOR = {
  email: 'pages-editor@rabaed.test',
  password: 'test-editor-password-53',
} as const;

/** The tool page's text suite's own account (ticket 54), for the same reason as `BLOG_EDITOR`. */
export const TOOL_PAGE_EDITOR = {
  email: 'tool-page-editor@rabaed.test',
  password: 'test-editor-password-54',
} as const;

/** The product page suite's own account (ticket 57), for the same reason as `BLOG_EDITOR`. */
export const PRODUCT_EDITOR = {
  email: 'product-editor@rabaed.test',
  password: 'test-editor-password-57',
} as const;

/** The partnership page's text suite's own account (ticket 55), for the same reason as `BLOG_EDITOR`. */
export const PARTNERSHIP_PAGE_EDITOR = {
  email: 'partnership-page-editor@rabaed.test',
  password: 'test-editor-password-55',
} as const;

/** The referral page's text suite's own account (ticket 56), for the same reason as `BLOG_EDITOR`. */
export const REFERRAL_PAGE_EDITOR = {
  email: 'referral-page-editor@rabaed.test',
  password: 'test-editor-password-56p',
} as const;

/** The Referral Program values suite's own account (ticket 56), for the same reason as `BLOG_EDITOR`. */
export const REFERRAL_VALUES_EDITOR = {
  email: 'referral-values-editor@rabaed.test',
  password: 'test-editor-password-56v',
} as const;

/** The home page's text suite's own account (ticket 58), for the same reason as `BLOG_EDITOR`. */
export const HOME_EDITOR = {
  email: 'home-editor@rabaed.test',
  password: 'test-editor-password-58',
} as const;

/** The site-wide words suite's own account (ticket 59), for the same reason as `BLOG_EDITOR`. */
export const SITE_WORDS_EDITOR = {
  email: 'site-words-editor@rabaed.test',
  password: 'test-editor-password-59',
} as const;

/** The Trust strip suite's own account (ticket 20), for the same reason as `BLOG_EDITOR`. */
export const TRUST_STRIP_EDITOR = {
  email: 'trust-strip-editor@rabaed.test',
  password: 'test-editor-password-20',
} as const;

/** The AI crawler rules' suite's own account (ticket 33), for the same reason as `BLOG_EDITOR`. */
export const CRAWLERS_EDITOR = {
  email: 'crawlers-editor@rabaed.test',
  password: 'test-editor-password-33',
} as const;

/** The search settings suite's own account (ticket 26), for the same reason as `BLOG_EDITOR`. */
export const SEARCH_EDITOR = {
  email: 'search-editor@rabaed.test',
  password: 'test-editor-password-26',
} as const;

/** The launch articles' suite's own account (ticket 38), for the same reason as `BLOG_EDITOR`. */
export const LAUNCH_ARTICLES_EDITOR = {
  email: 'launch-articles-editor@rabaed.test',
  password: 'test-editor-password-38',
} as const;

/** The answer-first copy pass's own account (ticket 35), for the same reason as `BLOG_EDITOR`. */
export const ANSWER_FIRST_EDITOR = {
  email: 'answer-first-editor@rabaed.test',
  password: 'test-editor-password-35',
} as const;

/** The English pages' own account (ticket 42), for the same reason as `BLOG_EDITOR`. */
export const ENGLISH_PAGES_EDITOR = {
  email: 'english-pages-editor@rabaed.test',
  password: 'test-editor-password-42',
} as const;

/** The stale-render suite's own account (ticket 64), for the same reason as `BLOG_EDITOR`. */
export const STALE_RENDER_EDITOR = {
  email: 'stale-render-editor@rabaed.test',
  password: 'test-editor-password-64',
} as const;

/** Every account the test server creates. */
export const TEST_EDITORS: readonly Editor[] = [
  TEST_EDITOR,
  BLOG_EDITOR,
  FAQ_EDITOR,
  CASE_STUDIES_EDITOR,
  FORM_READER,
  FORM_EDITOR,
  PARTNERSHIP_FORM_EDITOR,
  PAGES_EDITOR,
  TOOL_PAGE_EDITOR,
  PRODUCT_EDITOR,
  PARTNERSHIP_PAGE_EDITOR,
  REFERRAL_PAGE_EDITOR,
  REFERRAL_VALUES_EDITOR,
  HOME_EDITOR,
  SITE_WORDS_EDITOR,
  TRUST_STRIP_EDITOR,
  CRAWLERS_EDITOR,
  SEARCH_EDITOR,
  LAUNCH_ARTICLES_EDITOR,
  ANSWER_FIRST_EDITOR,
  ENGLISH_PAGES_EDITOR,
  STALE_RENDER_EDITOR,
];

/** One paragraph, in the shape the CMS's rich text editor saves. */
export function richText(text: string, locale: 'ar' | 'en') {
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const node = { format: '', indent: 0, version: 1, direction };
  return {
    root: {
      ...node,
      type: 'root',
      children: [
        {
          ...node,
          type: 'paragraph',
          textFormat: 0,
          textStyle: '',
          children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
        },
      ],
    },
  };
}

/** Uploads a plain image, 1600×900 unless told otherwise, to the CMS's media as the signed-in editor, and returns its id. */
export async function uploadImage(
  editor: APIRequestContext,
  alt: string,
  size: { width: number; height: number } = { width: 1600, height: 900 },
): Promise<number> {
  const image = await sharp({ create: { ...size, channels: 3, background: '#1B1E27' } })
    .png()
    .toBuffer();
  const response = await editor.post('/api/media', {
    multipart: {
      // A name of its own: suites running side by side upload at the same
      // moment, and two files arriving under one name race for it.
      file: { name: `image-${Date.now()}-${Math.random().toString(36).slice(2)}.png`, mimeType: 'image/png', buffer: image },
      _payload: JSON.stringify({ alt }),
    },
  });
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).doc.id as number;
}

/**
 * Uploads a file of any kind to the CMS's media, and returns the whole
 * document — an SVG, a mark with a transparent background — for a test that
 * cares what came back out rather than only that something did (ticket 20).
 */
export async function uploadFile(
  editor: APIRequestContext,
  file: { name: string; mimeType: string; buffer: Buffer },
  alt: string,
): Promise<{ id: number; url: string; mimeType: string; width: number | null; height: number | null }> {
  const response = await editor.post('/api/media', {
    multipart: { file: { ...file, name: `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}` }, _payload: JSON.stringify({ alt }) },
  });
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).doc;
}

/**
 * A sharing image of a given size, for the collection that takes nothing but
 * a 1200×630 PNG (ticket 26).
 */
export async function uploadSharingImage(
  editor: APIRequestContext,
  alt: string,
  size: { width: number; height: number } = { width: 1200, height: 630 },
): Promise<{ id: number; url: string }> {
  const image = await sharp({ create: { ...size, channels: 3, background: '#14161C' } }).png().toBuffer();
  const response = await editor.post('/api/sharing-images', {
    multipart: {
      file: { name: `sharing-${Date.now()}-${Math.random().toString(36).slice(2)}.png`, mimeType: 'image/png', buffer: image },
      _payload: JSON.stringify({ alt }),
    },
  });
  if (!response.ok()) return { id: 0, url: await response.text() };
  return (await response.json()).doc;
}

/** A mark with a see-through background, as a client's logo arrives. */
export async function transparentMark(size: { width: number; height: number }): Promise<Buffer> {
  return sharp({ create: { ...size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } })
    .composite([{ input: await sharp({ create: { width: Math.round(size.width / 2), height: Math.round(size.height / 2), channels: 4, background: '#FFFFFF' } }).png().toBuffer(), left: 0, top: 0 }])
    .png()
    .toBuffer();
}

/** Signs in through the admin's own login form, as `editor`. */
export async function logInAs(page: Page, editor: Editor): Promise<void> {
  await page.goto(`${ADMIN_PATH}/login`);
  await page.getByLabel('Email').fill(editor.email);
  await page.getByLabel('Password').fill(editor.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/** Signs in through the admin's own login form, as Ahmed would. */
export async function logIn(page: Page): Promise<void> {
  await logInAs(page, TEST_EDITOR);
}

/**
 * Where the admin keeps which tab an editor last had open, inside that
 * entry's preference: the path of a page entry's tabs field, which is the
 * second field of every page global (`src/cms/page-globals.ts`) and has no
 * name of its own, so Payload calls it by its place.
 *
 * Restated here rather than worked out, for `routes.ts`'s reason. If Payload
 * ever names it something else, `openPageEntry` says so — the tab it asks the
 * admin to reopen is then never reopened, and the wait below fails.
 */
const TABS_FIELD_PATH = '_index-1';

/** How Payload marks the button of the tab it has open. */
const OPEN_TAB = /tabs-field__tab-button--active/;

/** A page entry's section tabs, in the order its sections are in. */
const SECTION_TABS = '.tabs-field__tabs .tabs-field__tab-button';

/**
 * Opens a page entry in the admin, with its section tabs ready to be clicked.
 *
 * Going there is not enough. The admin remembers which tab an editor had open
 * and restores it from a preference it fetches when the form mounts
 * (`@payloadcms/ui/fields/Tabs`, under the key `global-<slug>`): the answer,
 * whenever it lands, sets the open tab to the remembered one. A tab clicked
 * while that is still in flight is therefore set and then unset — the button
 * keeps the focus the click gave it, and the panel beside the tabs goes back
 * to another section's fields. That is what failed twice on CI as an
 * assertion that never found a switch (ticket 61), and holding that one
 * request up reproduces it every time, as `home-text.spec.ts` does.
 *
 * Waiting for the answer to arrive is not enough either: the admin acts on it
 * a render later, so a click in between is still lost. What is waited for
 * here is the restore itself, which this makes visible by telling the admin
 * first — through the same preference — that the second section is the one
 * this editor last had open. The entry then opens on its first section and
 * moves to its second, and that move is the restore, done. Nothing can undo a
 * click afterwards: the restore happens once, and from then on the admin
 * answers its own question out of what the clicks themselves have written.
 *
 * For entries of two sections or more, which is every page global but the
 * closing section's one.
 */
export async function openPageEntry(page: Page, globalSlug: string): Promise<void> {
  const remembered = await page.request.post(`/api/payload-preferences/global-${globalSlug}`, {
    data: { value: { fields: { [TABS_FIELD_PATH]: { tabIndex: 1 } } } },
  });
  expect(remembered.ok(), await remembered.text()).toBe(true);

  await page.goto(`${ADMIN_PATH}/globals/${globalSlug}`);
  const second = page.locator(SECTION_TABS).nth(1);
  await expect(second, `the admin never reopened the second section of ${globalSlug}, so the restore that undoes a click has still to come`).toHaveClass(
    OPEN_TAB,
  );
}

/**
 * Opens one section of a page entry, and leaves that section's own fields in
 * the panel beside the tabs.
 *
 * Clicking the tab is what an editor does; waiting for the panel to be this
 * section's is what tells the test it may read it. Without that, a test reads
 * whichever panel is there — the section it asked for, or the one the admin
 * put back (`openPageEntry`), or one it opened earlier — and an assertion
 * about a section can pass on another section's fields.
 *
 * The panel itself is unnamed in the markup — every section's is
 * `tabs-field__tab` — so what is waited for is the tab whose panel it is:
 * Payload marks the open tab's button, and draws the panel of that one tab
 * and no other.
 */
export async function openSection(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name, exact: true }).click();
  await expectSectionOpen(page, name);
}

/** That `name` is the section the admin has open, without asking it to open one. */
export async function expectSectionOpen(page: Page, name: string): Promise<void> {
  const tab = page.getByRole('button', { name, exact: true });
  await expect(tab, `the ${name} section is not the one the admin has open`).toHaveClass(OPEN_TAB);
}

/**
 * Signs in through the API rather than the form. For putting things back
 * after a test, which must work whether or not the test got as far as signing
 * in — the form redirects away when there is already a session.
 */
export async function logInByApi(request: APIRequestContext, editor: Editor = TEST_EDITOR): Promise<void> {
  const response = await request.post('/api/users/login', { data: editor });
  expect(response.ok()).toBe(true);
}

/** A legal document, as the API gives it to a signed-in editor: what is published. */
export async function legalDocument(request: APIRequestContext, slug: string) {
  const response = await request.get(`/api/legal-documents?where[slug][equals]=${slug}&depth=0`);
  expect(response.ok(), slug).toBe(true);
  const { docs } = await response.json();
  expect(docs, slug).toHaveLength(1);
  return docs[0];
}

/** One kept version of a legal document: when it was made, and the document as it stood. */
export type LegalVersion = {
  id: string;
  updatedAt: string;
  // The document's own fields, as many as the tests read.
  version: {
    _status: 'draft' | 'published';
    editedBy: string;
    description: string;
    clauses: { heading: string }[];
  };
};

/**
 * Every version kept of a legal document, oldest first — ordered by
 * `updatedAt`, when the version was made, as the admin's Versions list is. A
 * restored version carries the `createdAt` of the document it restores.
 */
export async function legalVersions(request: APIRequestContext, id: number): Promise<LegalVersion[]> {
  const response = await request.get(
    `/api/legal-documents/versions?where[parent][equals]=${id}&sort=updatedAt&pagination=false&depth=0`,
  );
  expect(response.ok()).toBe(true);
  return (await response.json()).docs;
}

/** The newest published version of a legal document: what its page shows. */
export async function latestPublishedVersion(request: APIRequestContext, id: number): Promise<LegalVersion> {
  const published = (await legalVersions(request, id)).filter((version) => version.version._status === 'published').at(-1);
  expect(published, `no published version of document ${id}`).toBeDefined();
  return published!;
}

/**
 * Puts a legal document's latest version back to what is published, as a
 * draft, so that a test's saved draft is not left waiting to be published by
 * the next one. Visitors see nothing of it either way.
 */
export async function discardLegalDraft(request: APIRequestContext, id: number): Promise<void> {
  const published = await latestPublishedVersion(request, id);
  const restored = await request.post(`/api/legal-documents/versions/${published.id}?draft=true`);
  expect(restored.ok()).toBe(true);
}

/**
 * How long a published change is given to reach a visitor, and where the number
 * comes from.
 *
 * Publishing marks every page of the site for rebuilding
 * (`src/cms/revalidation.ts`); the next visit to a marked page renders it again
 * and is answered from that render. So what a wait here waits for is one whole
 * server render — set going by its own first request, and queueing behind every
 * other page of the site that the same publish marked and something else has
 * since asked for.
 *
 * Five seconds, `expect.poll`'s default, was Playwright's number rather than
 * that render's. What the render actually costs, measured on the machine this
 * was written on: 19 to 307 milliseconds with nothing else running, and 19
 * milliseconds to 10.4 seconds over three full-suite runs at twenty workers on
 * twenty cores — a median around a third of a second, and a tail five times
 * worse than the second-worst wait in the same run.
 *
 * A hosted runner has two cores and one Playwright worker
 * (`.github/workflows/ci.yml`) and shares them with the server doing the
 * rendering. The home page's wait, the heaviest, failed there at five seconds
 * three times in two days on commits that changed nothing the site builds, and
 * then once more at a twenty-second bound, having passed at that bound on all
 * four shards twice in between (commit `d7aceb9`, which put the home page's
 * poll alone on a minute). A runner is therefore slower than anything
 * measurable here by more than an order of magnitude, and unevenly so.
 *
 * A minute keeps that observed worst case — over twenty seconds — at about
 * three times over, and costs a passing run nothing, since every wait returns
 * as soon as the words arrive. It is longer than the twenty seconds
 * `playwright.config.ts` now allows a retrying assertion (ticket 61), because
 * that number is sized for riding out a stall in work that takes milliseconds,
 * and this wait's own work is a render that has been seen to take longer than
 * the whole of it.
 */
const REBUILT_IN = 60_000;

/** How often the page is asked for while waiting. Short enough to add nothing of its own to the wait. */
const ASKED_EVERY = 250;

/**
 * A wait longer than this is said out loud. It is the default these tests used
 * to take, so a run with a line in its log is a run that would have failed
 * before — a runner drifting towards the bound, in a green run rather than a
 * red one.
 */
const WORTH_SAYING = 5_000;

/**
 * What both waits below owe the budget: the running test's deadline lengthened
 * by it, so that the bound is reachable whatever `playwright.config.ts` allows
 * a test (two minutes as this is written, ticket 61) and however many waits one
 * test makes — a bound a test cannot outlive is not a bound, since it ends as
 * "Test timeout exceeded", which says nothing about what never arrived — and a
 * line in the log, said once, where the wait ran past `WORTH_SAYING`.
 */
function waitBegins(what: string) {
  const info = test.info();
  info.setTimeout(info.timeout + REBUILT_IN);

  let said = false;
  return {
    sayIfSlow(waited: number) {
      if (said || waited <= WORTH_SAYING) return;
      said = true;
      console.log(`${what} took ${waited}ms of the ${REBUILT_IN}ms a published change is given to reach a visitor`);
    },
  };
}

/**
 * The page a visitor receives at `path` once `words` published in the CMS have
 * reached it — which is what the test then reads, rather than asking for the
 * page again.
 *
 * `what` names the change in the failure a change that never arrives earns,
 * which says how long the wait was and what Next said of the page it last sent:
 * `MISS` where it rendered the page for that request, `STALE` where it was
 * still rendering it, `HIT` where it answered from what it had built before.
 *
 * `HIT` for the whole budget is not a slow rebuild, and no budget covers it.
 * It was a render that began before the publish and finished after it, whose
 * page Next keeps as fresh because of when it was written rather than what is
 * in it (ticket 64) — which publishing's second mark now catches (ADR-0017).
 * So `HIT` throughout now says the second mark did not land, or that a render
 * outlasted it; raising the number only makes such a run slower before it
 * fails.
 *
 * The test's own deadline is lengthened by the budget here, so that the bound
 * is reachable whatever `playwright.config.ts` allows a test (two minutes as
 * this is written, ticket 61) and however many waits one test makes. A bound a
 * test cannot outlive is not a bound: it ends as "Test timeout exceeded", which
 * says nothing about what never arrived.
 */
export async function reachesVisitors(request: APIRequestContext, path: string, words: string, what: string): Promise<string> {
  const waiting = waitBegins(path);

  const started = Date.now();
  for (;;) {
    const response = await request.get(path);
    const html = await response.text();
    const waited = Date.now() - started;
    if (html.includes(words)) {
      waiting.sayIfSlow(waited);
      return html;
    }
    if (waited >= REBUILT_IN) {
      const cache = response.headers()['x-nextjs-cache'] ?? 'nothing';
      expect(html, `${what} never reached a visitor at ${path} in ${waited}ms; Next said ${cache} of the page it last sent`).toContain(words);
      return html;
    }
    await new Promise((resolve) => setTimeout(resolve, ASKED_EVERY));
  }
}

/**
 * The same wait as `reachesVisitors`, for what a publish has to reach that is
 * not a page's own words: a status, the titles on an index in order, a link in
 * the header, a search description, a placeholder in a form (ticket 62).
 *
 * `what` names it in the failure a change that never arrives earns, which
 * Playwright follows with the last value the read returned. The budget is
 * `reachesVisitors`'s, because the wait is the same one — a page being built
 * again after a publish — however it is read.
 *
 * What it cannot say is what Next said of the page, as `reachesVisitors` does:
 * the read is the caller's, and is not always a page this fetched — one walks
 * the browser, one reads a footer link. A run that needs that tell has it from
 * the page-text suites, whose waits carry it, and `HIT` throughout is a missed
 * second mark (ticket 64, ADR-0017) rather than a budget too small.
 *
 * Wait for the page the next assertion reads. Publishing marks every page, but
 * each is built again on its own next visit, so one page having the change
 * says nothing about another (ticket 62).
 */
export function reaching<T>(what: string, read: () => Promise<T> | T) {
  const waiting = waitBegins(what);
  const started = Date.now();
  const timed = async () => {
    const value = await read();
    waiting.sayIfSlow(Date.now() - started);
    return value;
  };

  return expect.poll(timed, { timeout: REBUILT_IN, message: `${what} never reached a visitor in ${REBUILT_IN}ms` });
}

/** A page's search description, as a visitor with no session receives it. */
export async function metaDescription(request: APIRequestContext, path: string): Promise<string | null> {
  const html = await (await request.get(path)).text();
  return html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;
}

/** Today in Riyadh, the way a legal page writes a date. */
export function todayInRiyadh(): string {
  // Restated rather than imported from the page component (see `routes.ts`).
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const parts = new Intl.DateTimeFormat('en-u-nu-latn', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((each) => each.type === type)!.value);
  return `${part('day')} ${months[part('month') - 1]} ${part('year')}`;
}

/**
 * A legal page's «آخر تحديث» line, as a visitor with no session receives it.
 * Read from the HTML, whose numerals sit in spans of their own.
 */
export async function lastUpdatedLine(request: APIRequestContext, path: string): Promise<string | null> {
  const html = await (await request.get(path)).text();
  const line = html.match(/<span class="updated">((?:[^<]|<span[^>]*>[^<]*<\/span>|<!-- -->)*)<\/span>/)?.[1];
  return line?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? null;
}

/**
 * Where the footer icon with this accessible name points, on a page as a
 * visitor with no session receives it. Read from the HTML rather than the
 * rendered page, so that no script has had a chance to change it.
 */
export async function footerLink(request: APIRequestContext, path: string, label: string): Promise<string | null> {
  return footerLinkIn(await (await request.get(path)).text(), label);
}

/** Where the footer icon with this accessible name points, in a page's HTML already fetched. */
export function footerLinkIn(html: string, label: string): string | null {
  const footer = html.slice(html.indexOf('<footer'));
  const link = footer.match(/<a\b[^>]*>/g)?.find((tag) => tag.includes(`aria-label="${label}"`));
  return link?.match(/\bhref="([^"]*)"/)?.[1] ?? null;
}

/**
 * A page's HTML without its header, for asking whether anything English
 * reached an Arabic page.
 *
 * The four page-text suites and the home page's publish an entry with every
 * word given English of its own, then check that a visitor's Arabic page came
 * back exactly as it was — `>English<` appearing in it would mean the English
 * had leaked into the Arabic. Since ticket 40 that string is in every Arabic
 * page legitimately: it is the language switcher, whose whole purpose is to
 * offer English by name to somebody reading Arabic.
 *
 * So the question is asked of the page rather than of the document. The header
 * has suites of its own — `site-words.spec.ts` for its words and
 * `localisation.spec.ts` for the switcher — and neither of them is what these
 * are measuring.
 */
export function outsideTheHeader(html: string): string {
  return html.replace(/<nav class="nav"[\s\S]*?<\/nav>/, '');
}
