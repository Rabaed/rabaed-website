import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { PartnershipPage } from '@/components/pages/partnership-page';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { getPartnershipPage } from '@/content/pages/partnership';
import { inEnglish } from '@/content/pages/page-content';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish(getPartnershipPage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.partnership);
  return pageMetadata({ locale: 'en', path: '/partnership', ...content.meta });
}

/**
 * The English partnership page (ticket 42): the page itself once its English is
 * published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 */
export default async function EnglishPartnershipPage() {
  const content = await inEnglish(getPartnershipPage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.partnership} />;
  return <PartnershipPage locale="en" locales={LOCALE_CODES} content={content} />;
}
