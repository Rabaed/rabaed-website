import type { Metadata } from 'next';
import { OtherLanguageNotice, otherLanguageMetadata } from '@/components/editorial';
import type { ArabicOnlyPage } from '@/content/arabic-only-pages';

/**
 * The English address of a page that is in Arabic alone (`src/content/arabic-only-pages.ts`):
 * it says so, and offers the Arabic. A legal document's for good; a marketing
 * page's until its English is published (ticket 42).
 */
export function ArabicOnlyNotice({ page }: { page: ArabicOnlyPage }) {
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

/** Its metadata: a title, and no place in any search result. */
export function arabicOnlyMetadata(page: ArabicOnlyPage): Metadata {
  return otherLanguageMetadata(`${page.eyebrow} · Rabaed`);
}
