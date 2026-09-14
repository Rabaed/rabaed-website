import type { Locale } from '@/lib/locales';

/**
 * The shape every page's content takes, and the one rule for asking for it.
 *
 * Each marketing page reads its words, lists and pictures through one module
 * in this folder, given a locale, the way the legal pages are handed a
 * document. Its sections draw what they are handed and fetch nothing. That is
 * what lets ticket 21 move a page's content into the CMS by changing only its
 * module, and ticket 42 give every section English words without touching it.
 *
 * What a module hands its page is the shape an Editor works in (spec: Content
 * model): a fixed run of sections, in a fixed order, each with its fields, its
 * lists, and whether it shows — in the one locale asked for. How the CMS stores
 * that across locales, one list whose items carry their text per locale, is
 * ticket 21's to decide; the static files behind these modules only hold Arabic.
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

/** What a page says about itself to a search engine and a browser tab. */
export type PageMeta = {
  readonly title: string;
  readonly description: string;
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
