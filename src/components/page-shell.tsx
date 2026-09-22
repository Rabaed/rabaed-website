import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import { LOCALE_CODES, type Locale } from '@/lib/locales';

/**
 * Header, page, footer. Every page wraps its content in this.
 *
 * It sits in the page rather than in the layout because the header marks the
 * current link, and a layout in the App Router is not told which page it is
 * wrapping. Reading the path on the client instead would mean the active link
 * appears only after JavaScript runs, which is the sort of thing ADR-0001
 * exists to prevent. So the page names its own path, once, and the whole
 * header arrives complete in the first response.
 *
 * It carries only what every page uses. A page with `.reveal` entrances mounts
 * `RevealOnScroll` itself, so a page without them does not download the
 * script (spec: Analytics and performance).
 */
export function PageShell({
  locale,
  path,
  ownPath = path,
  locales = LOCALE_CODES,
  children,
}: {
  locale: Locale;
  /** This page's locale-independent path, as the menu's links name it (`src/content/site-words.ts`). */
  path: string;
  /**
   * This page's *own* locale-independent address, where it is not the one the
   * menu marks. They part company on the editorial pages: an article marks the
   * blog's link in the header and lives at `/blog/<slug>`, and a switcher
   * given `path` would offer the other language's blog index in place of the
   * translation of the article being read.
   */
  ownPath?: string;
  /**
   * The languages this page exists in, for the language switcher (ticket 40) —
   * the same fact the page hands `pageMetadata` to build its `hreflang`
   * alternates from, and every locale unless the page says otherwise.
   *
   * Stated twice, here and in the page's metadata, because a page's two halves
   * are written apart and neither can read the other's. They are held together
   * by a test instead: `localisation.spec.ts` walks every route and refuses a
   * switcher that offers a language the alternates do not, or the other way
   * round.
   */
  locales?: readonly Locale[];
  children: ReactNode;
}) {
  return (
    <>
      <SiteNav locale={locale} path={path} ownPath={ownPath} locales={locales} />
      {children}
      <SiteFooter locale={locale} />
    </>
  );
}
