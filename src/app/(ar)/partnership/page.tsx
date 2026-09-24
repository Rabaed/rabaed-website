import type { Metadata } from 'next';
import { PartnershipPage } from '@/components/pages/partnership-page';
import { getPartnershipPage } from '@/content/pages/partnership';
import { publishedLocales } from '@/content/pages/languages';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [{ meta }, locales] = await Promise.all([getPartnershipPage('ar'), publishedLocales('partnership')]);
  return pageMetadata({ locale: 'ar', locales, path: '/partnership', ...meta });
}

/**
 * The Arabic Partnership Program page: `src/components/pages/partnership-page.tsx`, in Arabic. It names
 * English among its languages — to the switcher and in its `hreflang`
 * alternates — once its English is published (ticket 42).
 */
export default async function ArabicPartnershipPage() {
  const [content, locales] = await Promise.all([getPartnershipPage('ar'), publishedLocales('partnership')]);
  return <PartnershipPage locale="ar" locales={locales} content={content} />;
}
