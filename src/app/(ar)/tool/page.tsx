import type { Metadata } from 'next';
import { ToolPage } from '@/components/pages/tool-page';
import { getToolPage } from '@/content/pages/tool';
import { publishedLocales } from '@/content/pages/languages';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [{ meta }, locales] = await Promise.all([getToolPage('ar'), publishedLocales('tool')]);
  return pageMetadata({ locale: 'ar', locales, path: '/tool', ...meta });
}

/**
 * The Arabic tool page: `src/components/pages/tool-page.tsx`, in Arabic. It names
 * English among its languages — to the switcher and in its `hreflang`
 * alternates — once its English is published (ticket 42).
 */
export default async function ArabicToolPage() {
  const [content, locales] = await Promise.all([getToolPage('ar'), publishedLocales('tool')]);
  return <ToolPage locale="ar" locales={locales} content={content} />;
}
