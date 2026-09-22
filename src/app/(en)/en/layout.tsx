import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '@/components/site-document';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/globals.css';

/**
 * The floor under every English page: whatever becomes of a publish's mark, a
 * page is rebuilt at most ten minutes after it was last built (ticket 66,
 * ADR-0016). An ordinary publish is unaffected and still arrives in under a
 * second; this catches the publish whose mark went astray, which otherwise
 * leaves a page wrong until somebody publishes again.
 *
 * Set here rather than on each page because this layout is above all of them
 * and a route takes the lowest age in its chain. Written out rather than
 * imported because Next reads only a literal — see `src/lib/cache-age.ts`,
 * which holds the number and the reason it is that number, and
 * `tests/unit/cached-page-age.spec.ts`, which holds this line to it.
 */
export const revalidate = 600;

export const metadata: Metadata = baseMetadata();

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
