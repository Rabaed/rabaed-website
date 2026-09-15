import type { Metadata } from 'next';
import { ClosingSection } from '@/components/closing-section';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { CustomStrip } from '@/components/product/custom-strip';
import { InnerCycle } from '@/components/product/inner-cycle';
import { Journey } from '@/components/product/journey';
import { Roles } from '@/components/product/roles';
import { breadcrumbData, softwareData, StructuredData } from '@/components/structured-data';
import { getProductPage } from '@/content/pages/product';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getProductPage('ar');
  // Arabic alone until English is switched on (tickets 40 and 42).
  return pageMetadata({ locale: 'ar', locales: ['ar'], path: '/product', ...meta });
}

/**
 * The Arabic product page, in the Reference site's order: the page hero, the
 * Trust strip, the journey through the four units, the custom strip, what each
 * party sees, the review cycle inside each party, and the closing section with
 * the demo request form (ticket 11's, shared with the home page).
 *
 * Its words come from `src/content/pages/product.ts`.
 */
export default async function ProductPage() {
  const content = await getProductPage('ar');

  return (
    <PageShell locale="ar" path="/product">
      <PageHero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      <Journey content={content.journey} />
      {content.customStrip.shows && <CustomStrip content={content.customStrip} />}
      {content.roles.shows && <Roles content={content.roles} />}
      {content.innerCycle.shows && <InnerCycle content={content.innerCycle} />}
      <ClosingSection content={content.closing} form={content.demoForm} />
      <StructuredData data={breadcrumbData('ar', [{ name: content.meta.name, path: '/product' }])} />
      <StructuredData data={softwareData()} />
    </PageShell>
  );
}
