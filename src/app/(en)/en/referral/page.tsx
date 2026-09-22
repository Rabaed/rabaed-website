import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { getReferralPage } from '@/content/pages/referral';
import { inEnglish } from '@/content/pages/page-content';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish(getReferralPage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.referral);
  return pageMetadata({ locale: 'en', path: '/referral', ...content.meta });
}

/**
 * The English referral page (ticket 42): the page itself once its English is
 * published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 *
 * The page is imported only when it is drawn, so that the notice does not
 * carry the page's scripts.
 */
export default async function EnglishReferralPage() {
  const content = await inEnglish(getReferralPage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.referral} />;
  const { ReferralPage } = await import('@/components/pages/referral-page');
  return <ReferralPage locale="en" locales={LOCALE_CODES} content={content} />;
}
