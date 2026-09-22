import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OtherLanguageNotice, otherLanguageMetadata } from '@/components/editorial';
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
  return page ? otherLanguageMetadata(`${page.eyebrow} · Rabaed`) : {};
}

/**
 * The English address of a page that is in Arabic alone (ticket 40): it says
 * so and offers the Arabic (`src/content/arabic-only-pages.ts`). A page that
 * has English — the blog, the case studies, and each marketing page once
 * ticket 42 writes it — has a route of its own beside this, which Next
 * chooses first.
 */
export default async function ArabicOnlyPage({ params }: PageProps<'/en/[page]'>) {
  const page = arabicOnlyPage((await params).page);
  if (!page) notFound();

  return (
    <OtherLanguageNotice
      locale="en"
      path={page.path}
      ownPath={page.path}
      eyebrow={page.eyebrow}
      notice={page.notice}
      linkLabel={page.linkLabel}
      available="ar"
      href={page.path}
    />
  );
}
