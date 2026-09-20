/**
 * What the CMS suites share: where the admin lives, and the editor account the
 * test server creates in its throwaway database before the build
 * (`scripts/test-server.mjs`).
 *
 * `ADMIN_PATH` is restated rather than imported from the application, for the
 * reason `routes.ts` gives: a test that reads its expectation out of the code
 * under test agrees with that code by construction.
 */
import { expect, type APIRequestContext, type Page } from '@playwright/test';
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

/** The AI crawler rules' suite's own account (ticket 33), for the same reason as `BLOG_EDITOR`. */
export const CRAWLERS_EDITOR = {
  email: 'crawlers-editor@rabaed.test',
  password: 'test-editor-password-33',
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
  CRAWLERS_EDITOR,
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
