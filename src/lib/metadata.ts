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
 * What a shared link is told about the site, per locale: its name, the
 * `og:locale` spelling of the language, and the words describing the sharing
 * image to someone who cannot see it.
 */
const SHARING = {
  ar: { siteName: 'ربائد', ogLocale: 'ar_SA', imageAlt: 'ربائد — ثلاثة أطراف. سجل واحد. مسؤولية واضحة.' },
  en: { siteName: 'Rabaed', ogLocale: 'en_US', imageAlt: 'The Rabaed wordmark and, in Arabic, “Three parties. One record. Clear accountability.”' },
} as const satisfies Record<Locale, unknown>;

/**
 * The sharing image, drawn by `npm run brand:export`. One image for every page
 * until ticket 26 lets a page have its own. It is Arabic on the English
 * placeholder too, as the rest of the site is until English is switched on.
 */
const SHARING_IMAGE = { url: '/og-rabaed.png', width: 1200, height: 630 } as const;

/**
 * A page's own metadata: its title and description, the self-referencing
 * canonical URL, the `hreflang` alternates that keep `/` and `/en` from
 * being read as duplicates of each other, and the Open Graph and Twitter tags
 * a shared link is previewed from — all of them this page's own, where three
 * of the Reference site's pages carried the home page's.
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
 * The Open Graph and Twitter objects are set here in full, never partly in a
 * layout, for the shallow-merge reason `baseMetadata` gives. Structured data
 * is ticket 32.
 */
export function pageMetadata(options: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  locales?: readonly Locale[];
}): Metadata {
  const { locale, path = '/', title, description, locales = LOCALE_CODES } = options;
  const canonical = localePath(locale, path);
  const sharing = SHARING[locale];
  const image = { ...SHARING_IMAGE, alt: sharing.imageAlt };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((code) => [code, localePath(code, path)]),
      ),
    },
    openGraph: {
      type: 'website',
      siteName: sharing.siteName,
      locale: sharing.ogLocale,
      alternateLocale: locales.filter((code) => code !== locale).map((code) => SHARING[code].ogLocale),
      url: canonical,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
