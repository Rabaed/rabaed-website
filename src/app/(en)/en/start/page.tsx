import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { StartPage } from '@/components/pages/start-page';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { getStartPage } from '@/content/pages/start';
import { inEnglish } from '@/content/pages/page-content';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish(getStartPage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.start);
  return pageMetadata({ locale: 'en', path: '/start', ...content.meta });
}

/**
 * The English start page (ticket 42): the page itself once its English is
 * published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 */
export default async function EnglishStartPage() {
  const content = await inEnglish(getStartPage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.start} />;
  return <StartPage locale="en" locales={LOCALE_CODES} content={content} />;
}
