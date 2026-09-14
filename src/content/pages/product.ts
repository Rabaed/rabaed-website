import type { ClosingSectionContent } from '@/components/closing-section';
import type { TrustStripContent } from '@/components/home/trust-strip';
import type { PageHeroContent } from '@/components/page-hero';
import type { ProductCustomStripContent } from '@/components/product/custom-strip';
import type { ProductInnerCycleContent } from '@/components/product/inner-cycle';
import type { ProductJourneyContent } from '@/components/product/journey';
import type { ProductRolesContent } from '@/components/product/roles';
import { CLOSING_SECTION } from '@/content/closing-section';
import { INNER_CYCLE } from '@/content/inner-cycle';
import { JOURNEY } from '@/content/journey';
import { ROLES } from '@/content/roles';
import { TRUST_STRIP } from '@/content/trust-strip';
import type { FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { formPageWording } from '@/forms/settings';
import type { Locale } from '@/lib/locales';
import { inLocale, type LinkedSection, type PageMeta, type Section } from './page-content';

export type ProductPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  /** This page's hero lands here, «ابدأ من الوحدات ↓». */
  readonly journey: LinkedSection<ProductJourneyContent>;
  readonly customStrip: Section<ProductCustomStripContent>;
  readonly roles: Section<ProductRolesContent>;
  readonly innerCycle: Section<ProductInnerCycleContent>;
  /** Holds the demo request form, which the header, this page's hero and the custom strip all link to. */
  readonly closing: LinkedSection<ClosingSectionContent>;
  /** The words of the closing section's demo request form: its settings in the CMS. */
  readonly demoForm: FormPageWording<DemoRequestField>;
};

/**
 * Verbatim from `reference/site/product.html`. Nothing here is placeholder
 * text, and nothing waits to be reworded.
 */
const AR: Omit<ProductPageContent, 'demoForm'> = {
  meta: {
    title: 'ربائد · المنتج — من الطلب إلى الاعتماد',
    description: 'كيف تمر معاملة واحدة من الطلب إلى الاعتماد، وماذا يرى كل طرف حين يفتح المنصة.',
  },
  hero: {
    eyebrow: 'المنتج',
    title: 'وحدات ربائد — وما يراه كل طرف منها.',
    lead: 'أربع وحدات تغطي كل ما يمر بين الأطراف، ثم ما يراه كل طرف حين يفتح المنصة، ثم ما يبقى داخل جهته ولا يعبر إلى الآخرين.',
    // The first jumps to the demo request form at the foot of this page, the
    // second to the journey just below.
    primary: { label: 'احجز عرضاً حياً', href: '#demo' },
    secondary: { label: 'ابدأ من الوحدات ↓', href: '#journey' },
  },
  // The Reference site's product page carries the same strip as its home page,
  // under the same label.
  trustStrip: { shows: true, ...TRUST_STRIP.ar },
  journey: { shows: true, ...JOURNEY.ar },
  customStrip: {
    shows: true,
    eyebrow: 'يُخصَّص حسب المشروع',
    heading: 'ومشروعك يحتاج أكثر؟',
    features: [
      {
        title: 'الجداول الزمنية ومتابعة الإنجاز',
        body: 'استيراد جداول Primavera P6 و MS Project، المسار الحرج، وأثر كل تحديث زمني على موعد التسليم.',
      },
      {
        title: 'جدول الكميات والمستخلصات',
        body: 'جدول كميات تفاعلي ومستخلصات مبنية على الطلبات المعتمدة فعلاً — لا على ما يُكتب في نهاية الشهر.',
      },
    ],
    badge: 'حسب المشروع',
    // The demo request form, in the closing section at the foot of this page.
    ask: { label: 'اسأل عنها في العرض التوضيحي ←', href: '#demo' },
  },
  roles: { shows: true, ...ROLES.ar },
  innerCycle: { shows: true, ...INNER_CYCLE.ar },
  // The closing section the home page ends on too, ticket 11's.
  closing: { shows: true, ...CLOSING_SECTION.ar },
};

/** The product page's content in `locale`, or a refusal (`inLocale`). */
export async function getProductPage(locale: Locale): Promise<ProductPageContent> {
  return { ...inLocale('product', { ar: AR }, locale), demoForm: await formPageWording(DEMO_REQUEST) };
}
