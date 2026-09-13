import type { Metadata } from 'next';
import { ClosingSection } from '@/components/closing-section';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { CustomStrip } from '@/components/product/custom-strip';
import { InnerCycle } from '@/components/product/inner-cycle';
import { Journey } from '@/components/product/journey';
import { Roles } from '@/components/product/roles';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  path: '/product',
  title: 'ربائد · المنتج — من الطلب إلى الاعتماد',
  description: 'كيف تمر معاملة واحدة من الطلب إلى الاعتماد، وماذا يرى كل طرف حين يفتح المنصة.',
});

/**
 * The Arabic product page, in the Reference site's order: the page hero, the
 * Trust strip, the journey through the four units, the custom strip, what each
 * party sees, the review cycle inside each party, and the closing section with
 * the demo request form (ticket 11's, shared with the home page).
 *
 * All copy is verbatim from `reference/site/product.html`. Nothing here is
 * placeholder text, and nothing waits to be reworded.
 */
export default function ProductPage() {
  return (
    <PageShell locale="ar" path="/product">
      <section className="phero dark">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">المنتج</div>
          <h1>وحدات ربائد — وما يراه كل طرف منها.</h1>
          <p className="lead">
            أربع وحدات تغطي كل ما يمر بين الأطراف، ثم ما يراه كل طرف حين يفتح المنصة، ثم ما يبقى داخل جهته
            ولا يعبر إلى الآخرين.
          </p>
          <div className="ctas">
            {/* The first jumps to the demo request form at the foot of this
                page, the second to the journey just below. */}
            <a className="btn p" href="#demo">
              احجز عرضاً حياً
            </a>
            <a className="btn g" href="#journey">
              ابدأ من الوحدات ↓
            </a>
          </div>
        </div>
      </section>

      {/* The Reference site's product page carries the same strip as its home
          page, under the same label. */}
      <TrustStrip />
      <Journey />
      <CustomStrip />
      <Roles />
      <InnerCycle />
      <ClosingSection />
    </PageShell>
  );
}
