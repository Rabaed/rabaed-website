import type { Metadata } from 'next';
import { ProductPage } from '@/components/pages/product-page';
import { getProductPage } from '@/content/pages/product';
import { publishedLocales } from '@/content/pages/languages';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [{ meta }, locales] = await Promise.all([getProductPage('ar'), publishedLocales('product')]);
  return pageMetadata({ locale: 'ar', locales, path: '/product', ...meta });
}

/**
 * The Arabic product page: `src/components/pages/product-page.tsx`, in Arabic. It names
 * English among its languages — to the switcher and in its `hreflang`
 * alternates — once its English is published (ticket 42).
 */
export default async function ArabicProductPage() {
  const [content, locales] = await Promise.all([getProductPage('ar'), publishedLocales('product')]);
  return <ProductPage locale="ar" locales={locales} content={content} />;
}
