import type { Metadata } from 'next';
import { StartPage } from '@/components/pages/start-page';
import { getStartPage } from '@/content/pages/start';
import { publishedLocales } from '@/content/pages/page-content';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [{ meta }, locales] = await Promise.all([getStartPage('ar'), publishedLocales(getStartPage)]);
  return pageMetadata({ locale: 'ar', locales, path: '/start', ...meta });
}

/**
 * The Arabic start page: `src/components/pages/start-page.tsx`, in Arabic. It names
 * English among its languages — to the switcher and in its `hreflang`
 * alternates — once its English is published (ticket 42).
 */
export default async function ArabicStartPage() {
  const [content, locales] = await Promise.all([getStartPage('ar'), publishedLocales(getStartPage)]);
  return <StartPage locale="ar" locales={locales} content={content} />;
}
