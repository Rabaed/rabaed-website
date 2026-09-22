import { ClosingSection } from '@/components/closing-section';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { CustomStrip } from '@/components/product/custom-strip';
import { InnerCycle } from '@/components/product/inner-cycle';
import { Journey } from '@/components/product/journey';
import { Roles } from '@/components/product/roles';
import { breadcrumbData, softwareData, StructuredData } from '@/components/structured-data';
import type { ProductPageContent } from '@/content/pages/product';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The product page, in either language, in the Reference site's order: the
 * page hero, the Trust strip, the journey through the four units, the custom
 * strip, what each party sees, the review cycle inside each party, and the
 * closing section with the demo request form (ticket 11's, shared with the
 * home page).
 *
 * Its words come from `src/content/pages/product.ts`, in the language asked
 * for (ticket 42).
 */
export async function ProductPage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: ProductPageContent;
}) {
  const direction = LOCALES[locale].dir;

  return (
    <PageShell locale={locale} path="/product" locales={locales}>
      <PageHero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      <Journey content={content.journey} direction={direction} />
      {content.customStrip.shows && <CustomStrip content={content.customStrip} />}
      {content.roles.shows && <Roles content={content.roles} direction={direction} />}
      {content.innerCycle.shows && <InnerCycle content={content.innerCycle} />}
      <ClosingSection content={content.closing} form={content.demoForm} />
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/product' }])} />
      <StructuredData data={softwareData(locale)} />
    </PageShell>
  );
}
