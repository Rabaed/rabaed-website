import type { Metadata } from 'next';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { CustomStrip } from '@/components/product/custom-strip';
import { InnerCycle } from '@/components/product/inner-cycle';
import { Journey } from '@/components/product/journey';
import { Roles } from '@/components/product/roles';
import { localePath } from '@/lib/locales';
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
 * party sees, the review cycle inside each party, and the closing section.
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
            {/* The demo request form arrives in the closing section with
                ticket 11; until then this goes nowhere, as the header's own
                does on a page without it. */}
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

      {/* The closing section. Ticket 11 turns this block into a component with
          the demo request form beside the steps, for this page and the home
          page alike; whichever of the two tickets lands second puts it here. */}
      <section id="tail" className="light pad">
        <div className="wrap tail-grid">
          <div>
            <div className="eyebrow">كيف نبدأ معك</div>
            <h2 style={{ fontSize: '29px', lineHeight: 1.4 }}>
              فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.
            </h2>
            <ul className="tail-steps">
              <li>
                <b>01 · إعداد</b>
                <span>
                  نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول — و15 دقيقة مع كل فريق.
                </span>
              </li>
              <li>
                <b>02 · تشغيل</b>
                <span>أقل من يوم، دون توقف للعمل. يبدأ الجميع من حيث وصل المشروع.</span>
              </li>
              <li>
                <b>03 · ضمان</b>
                <span>
                  60 يوماً من التفعيل — أو نعيد كامل المبلغ، ونسلّمكم نسخة كاملة من السجل.
                </span>
              </li>
            </ul>
            <a className="tail-more" href={localePath('ar', '/start')}>
              التفاصيل والأسئلة الشائعة ←
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
