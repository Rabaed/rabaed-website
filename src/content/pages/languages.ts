import { entryLanguages } from '@/cms/pages';
import { LOCALE_CODES, type Locale } from '@/lib/locales';
import { entriesRead, type MarketingPage } from '@/lib/page-registry';

/**
 * Which languages a marketing page is published in, asked of the entries that
 * decide it (the page registry, `src/lib/page-registry.ts`) rather than by
 * building the page (ticket 91).
 *
 * A page is published in a language once every entry it reads is. Arabic
 * once its entry is published at all, since the CMS publishes no entry
 * without it — which every page's was by the migration that brought it, but
 * for the Company profile's, which waits for the founder (ticket 102). English
 * once the founder publishes the English of the page's own entry and of every
 * entry it shares (ticket 42). Each entry is read once per request, with the
 * page itself (`src/cms/pages.ts`), so the sitemap, `llms.txt`, the language
 * switcher and an English address's notice ask for no more than the page
 * already reads.
 */
export async function isPublishedIn(page: MarketingPage, locale: Locale): Promise<boolean> {
  const languages = await Promise.all(entriesRead(page).map(entryLanguages));
  return languages.every((each) => each.includes(locale));
}

/**
 * The languages the page is published in: what an Arabic page tells the
 * switcher and its `hreflang` alternates, so neither offers an English page
 * before it exists.
 */
export async function publishedLocales(page: MarketingPage): Promise<Locale[]> {
  const published = await Promise.all(LOCALE_CODES.map((locale) => isPublishedIn(page, locale)));
  return LOCALE_CODES.filter((_, index) => published[index]);
}

/**
 * The page's content in `locale`, or `null` while the page is not published
 * in it — which an English address answers with a notice, and the Company
 * profile's Arabic address as not found. Never a page with a part of it
 * missing, and never another language in its place.
 */
export async function inLanguage<T, L extends Locale>(page: MarketingPage, locale: L, read: (locale: L) => Promise<T>): Promise<T | null> {
  return (await isPublishedIn(page, locale)) ? read(locale) : null;
}

/** The page's English content, or `null` while the page is not published in English (`inLanguage`). */
export function inEnglish<T>(page: MarketingPage, read: (locale: 'en') => Promise<T>): Promise<T | null> {
  return inLanguage(page, 'en', read);
}
