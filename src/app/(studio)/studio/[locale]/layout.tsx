import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LOCALES, type Locale } from '@/lib/locales';
import '@/styles/globals.css';
import '@/styles/studio.css';

/**
 * The Screen mock studio: a private route whose only purpose is to be
 * photographed by `npm run mocks:export` (ADR-0002).
 *
 * Its own root layout, outside both locales, because it is not a page of the
 * site — it has no header, no footer, and no content of its own.
 *
 * The root sits *below* the `[locale]` segment so that it can read it. A mock
 * inherits its direction from the document, and an English set rendered
 * right-to-left would be an English set nobody could use — which is what
 * happens the moment this is hoisted above the segment for tidiness.
 *
 * `noindex` here is unconditional, unlike the site's, which lifts at launch.
 * The studio shows the same screens as the pages that are meant to rank, and
 * must never compete with them or be found on its own.
 *
 * It imports the site's stylesheet as well as its own, because a mock inherits
 * `box-sizing`, `line-height` and the base font size from the page around it —
 * and the test comparing the studio against the Reference site would find
 * every difference the moment that inheritance diverged.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function StudioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const known = (Object.keys(LOCALES) as Locale[]).find((code) => code === locale);

  return (
    <html lang={known ?? 'ar'} dir={LOCALES[known ?? 'ar'].dir}>
      <body className="studio">{children}</body>
    </html>
  );
}
