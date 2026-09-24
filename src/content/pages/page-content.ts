import { FAQ_PAGES, type FaqPageKey } from '@/cms/faq-pages';
import { pageQuestions } from '@/cms/faqs';
import type { QuestionsContent } from '@/components/questions';
import type { Locale } from '@/lib/locales';

/**
 * The shape every page's content takes, and the one rule for asking for it.
 *
 * Each marketing page reads its words, lists and pictures through one module
 * in this folder, given a locale, the way the legal pages are handed a
 * document. Its sections draw what they are handed and fetch nothing. That is
 * what lets tickets 53–59 move a page's content into the CMS by changing only
 * its module, and ticket 42 give every section English words without touching
 * it. Every marketing page's module reads its words from the CMS (tickets
 * 53–58).
 *
 * What a module hands its page is the shape an Editor works in (spec: Content
 * model): a fixed run of sections, in a fixed order, each with its fields, its
 * lists, and whether it shows — in the one locale asked for. In the CMS each
 * word holds its Arabic and English side by side, and a list is one list whose
 * items hold both (`src/cms/page-fields.ts`).
 *
 * A page's hero is neither kind of section below, and always shows: it carries
 * the page's only `<h1>`, and a page published without one has no heading.
 */

/** A section an Editor may hide. */
export type Section<T> = T & { readonly shows: boolean };

/**
 * A section something links to — the demo form, the start page's questions,
 * the tool page's download and how-it-works, the referral page's signup and
 * how-it-works — which cannot be hidden, or the link would lead nowhere.
 */
export type LinkedSection<T> = T & { readonly shows: true };

/**
 * A page's content as its module holds it, before its Questions section is
 * given its id and its page's questions (`withQuestions`).
 */
export type BeforeQuestions<T extends { readonly questions: QuestionsContent }> = Omit<T, 'questions'> & {
  readonly questions: Omit<T['questions'], 'id' | 'entries'>;
};

/**
 * A page's content with its Questions section completed: the id links land
 * on, and the page's questions as the CMS has them (ticket 22).
 */
export async function withQuestions<T extends { readonly questions: QuestionsContent }>(
  page: FaqPageKey,
  locale: Locale,
  content: BeforeQuestions<T>,
): Promise<T> {
  const questions = { ...content.questions, id: FAQ_PAGES[page].sectionId, entries: await pageQuestions(page, locale) };
  // `BeforeQuestions<T>` with exactly the two fields it leaves out is `T`,
  // which TypeScript cannot follow through a generic spread.
  return { ...content, questions } as unknown as T;
}

/** The picture a page's link unfurls as, where a page has one of its own (ticket 26). */
export type SharingImage = { readonly url: string; readonly alt: string };

/**
 * What a page says about itself to a search engine and a browser tab. The
 * title, the description and the picture are an Editor's (ticket 26); the
 * short name is the page's own, and stays in code.
 */
export type PageMeta = {
  /** The page's short name, as a breadcrumb trail in its structured data names it: «المنتج». */
  readonly name: string;
  readonly title: string;
  readonly description: string;
  /** Nothing where the page shares the site's own picture, which is most of them. */
  readonly sharingImage?: SharingImage | null;
};

/** Asked for a page in a locale it has no content in. */
export class ContentNotInLocale extends Error {
  constructor(page: string, locale: Locale) {
    super(`The ${page} page has no content in "${locale}".`);
    this.name = 'ContentNotInLocale';
  }
}

/**
 * A page's content in the locale asked for, or a refusal. Never another
 * locale's content in its place: an English visitor handed the Arabic words
 * would get a page that looks translated to every check and is not (spec:
 * Routing and localisation — an entry with no translation is not silently
 * substituted).
 */
export function inLocale<T>(page: string, content: Partial<Record<Locale, T>>, locale: Locale): T {
  const found = content[locale];
  if (found === undefined) throw new ContentNotInLocale(page, locale);
  return found;
}

/**
 * A page's content, or `null` where the page is not published in the locale
 * asked for — which an English route answers with a notice (ticket 42). Any
 * other failure is not a missing translation, and is thrown on.
 */
export async function contentOrNull<T>(content: Promise<T>): Promise<T | null> {
  try {
    return await content;
  } catch (error) {
    if (error instanceof ContentNotInLocale) return null;
    throw error;
  }
}
