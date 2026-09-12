/**
 * The two locales, and the one fact that shapes every route: Arabic *is* the
 * site, so it carries no path prefix. English is a second locale under `/en`.
 *
 * There is deliberately no `/ar` — not as a redirect, not as a rewrite target.
 * A default locale that also answers on a prefixed URL gives every Arabic page
 * two addresses, which then has to be undone in canonical tags forever.
 * Routing mirrors this table exactly: the `ar` pages live in the `(ar)` route
 * group, which contributes nothing to the URL, and the `en` pages under
 * `(en)/en`. Each group carries its own root layout, which is what lets the
 * two locales differ in `lang` and `dir` without a middleware rewrite.
 *
 * No automatic language detection: the URL decides the locale, always.
 */
export const LOCALES = {
  ar: { dir: 'rtl', pathPrefix: '' },
  en: { dir: 'ltr', pathPrefix: '/en' },
} as const;

export type Locale = keyof typeof LOCALES;

/** Arabic. The locale served at the root of the site. */
export const DEFAULT_LOCALE = 'ar' satisfies Locale;

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

/**
 * The absolute path a page has in a given locale. `/product` is `/product` in
 * Arabic and `/en/product` in English; the home page is `/` and `/en`.
 */
export function localePath(locale: Locale, path = '/'): string {
  const joined = `${LOCALES[locale].pathPrefix}${path}`;
  const trimmed = joined.length > 1 && joined.endsWith('/') ? joined.slice(0, -1) : joined;
  return trimmed || '/';
}
