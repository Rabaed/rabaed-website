import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { getHomePage } from '@/content/pages/home';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getHomePage('ar');
  return pageMetadata({ locale: 'ar', path: '/', ...meta });
}

/**
 * The Arabic home page: `src/components/pages/home-page.tsx`, in Arabic.
 *
 * It names English among its languages whether or not the English home page
 * is published yet, as it always has: `/en` is always a page — the English
 * home page once its English is published (ticket 42), and until then the
 * English site's own page saying it is on its way.
 */
export default async function ArabicHomePage() {
  return <HomePage locale="ar" locales={LOCALE_CODES} content={await getHomePage('ar')} />;
}
