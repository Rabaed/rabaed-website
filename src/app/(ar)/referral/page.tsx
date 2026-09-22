import type { Metadata } from 'next';
import { ReferralPage } from '@/components/pages/referral-page';
import { getReferralPage } from '@/content/pages/referral';
import { publishedLocales } from '@/content/pages/page-content';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [{ meta }, locales] = await Promise.all([getReferralPage('ar'), publishedLocales(getReferralPage)]);
  return pageMetadata({ locale: 'ar', locales, path: '/referral', ...meta });
}

/**
 * The Arabic Referral Program page: `src/components/pages/referral-page.tsx`, in Arabic. It names
 * English among its languages — to the switcher and in its `hreflang`
 * alternates — once its English is published (ticket 42).
 */
export default async function ArabicReferralPage() {
  const [content, locales] = await Promise.all([getReferralPage('ar'), publishedLocales(getReferralPage)]);
  return <ReferralPage locale="ar" locales={locales} content={content} />;
}
