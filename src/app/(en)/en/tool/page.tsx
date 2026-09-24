import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { ToolPage } from '@/components/pages/tool-page';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { getToolPage } from '@/content/pages/tool';
import { inEnglish } from '@/content/pages/languages';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish('tool', getToolPage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.tool);
  return pageMetadata({ locale: 'en', path: '/tool', ...content.meta });
}

/**
 * The English tool page (ticket 42): the page itself once its English is
 * published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 */
export default async function EnglishToolPage() {
  const content = await inEnglish('tool', getToolPage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.tool} />;
  return <ToolPage locale="en" locales={LOCALE_CODES} content={content} />;
}
