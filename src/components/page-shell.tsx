import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import type { Locale } from '@/lib/locales';

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
  children,
}: {
  locale: Locale;
  /** This page's locale-independent path, as the menu's links name it (`src/content/site-words.ts`). */
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNav locale={locale} path={path} />
      {children}
      <SiteFooter locale={locale} />
    </>
  );
}
