import type { Metadata } from 'next';
import { isIndexable, siteOrigin } from './environment';
import { LOCALE_CODES, localePath, type Locale } from './locales';

/**
 * What every document carries regardless of locale or page. Applied by both
 * root layouts, so a new page cannot forget the indexing block.
 *
 * Deliberately sets nothing a page will also set: Next.js merges metadata
 * shallowly, so a page assigning one key of `openGraph` replaces the layout's
 * entire `openGraph` object rather than adding to it, and the layout's
 * contribution disappears with no error.
 */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteOrigin()),
    robots: isIndexable() ? undefined : { index: false, follow: false, nocache: true },
  };
}

/**
 * A page's own metadata: its title and description, the self-referencing
 * canonical URL, and the `hreflang` alternates that keep `/` and `/en` from
 * being read as duplicates of each other.
 *
 * `path` is the locale-independent path — `/` for the home page — from which
 * every locale's real URL is derived, so the alternates stay correct without
 * anyone writing them out by hand.
 *
 * `locales` names the locales the page exists in, every one unless it says
 * otherwise. A page that will never be translated — the legal documents,
 * whose Arabic is binding (spec: Out of Scope) — names only its own, so no
 * alternate sends a search engine to a page that is not there.
 *
 * Open Graph, Twitter cards, the 1200×630 sharing image and structured data
 * are ticket 32. Nothing here emits a half-version of them.
 */
export function pageMetadata(options: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  locales?: readonly Locale[];
}): Metadata {
  const { locale, path = '/', title, description, locales = LOCALE_CODES } = options;

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: Object.fromEntries(
        locales.map((code) => [code, localePath(code, path)]),
      ),
    },
  };
}
