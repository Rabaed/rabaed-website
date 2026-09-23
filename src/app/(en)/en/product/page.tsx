import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { ProductPage } from '@/components/pages/product-page';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { getProductPage } from '@/content/pages/product';
import { inEnglish } from '@/content/pages/page-content';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish(getProductPage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.product);
  return pageMetadata({ locale: 'en', path: '/product', ...content.meta });
}

/**
 * The English product page (ticket 42): the page itself once its English is
 * published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 */
export default async function EnglishProductPage() {
  const content = await inEnglish(getProductPage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.product} />;
  return <ProductPage locale="en" locales={LOCALE_CODES} content={content} />;
}
