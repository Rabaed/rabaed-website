import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { ARABIC_ONLY_PAGES, arabicOnlyPage } from '@/content/arabic-only-pages';

/**
 * Every one built ahead of time. An English address naming no page is not
 * found by the page itself, below, rather than by `dynamicParams = false`:
 * with that set, the first rebuild after a publish answered «not found» for
 * every one of these addresses too, and a publish marks every page for
 * rebuilding (`src/cms/revalidation.ts`).
 */
export function generateStaticParams() {
  return Object.keys(ARABIC_ONLY_PAGES).map((page) => ({ page }));
}

export async function generateMetadata({ params }: PageProps<'/en/[page]'>): Promise<Metadata> {
  const page = arabicOnlyPage((await params).page);
  return page ? arabicOnlyMetadata(page) : {};
}

/**
 * The English address of a legal document, which is in Arabic alone for good
 * (ticket 40): it says so and offers the Arabic. Every other page has a route
 * of its own beside this, which Next chooses first — the blog, the case
 * studies, and each marketing page (ticket 42).
 */
export default async function ArabicOnlyPage({ params }: PageProps<'/en/[page]'>) {
  const page = arabicOnlyPage((await params).page);
  if (!page) notFound();

  return <ArabicOnlyNotice page={page} />;
}
