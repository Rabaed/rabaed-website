import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { localePath } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  title: 'ربائد · ثلاثة أطراف. سجل واحد.',
  description:
    'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
});

/**
 * The Arabic home page, in the state ticket 04 leaves it: the real page shell
 * around two real sections.
 *
 * The opening section uses `.phero`, the compact hero every page below this
 * one carries. Ticket 06 replaces it with `#hero` — full height, with the
 * document travelling between the three parties. The closing section is the
 * repeating tail; ticket 11 puts the demo form in its second column and
 * ticket 27 makes that form real.
 *
 * All copy is verbatim from `reference/site/index.html`. Nothing here is
 * placeholder text, and nothing waits to be reworded.
 */
export default function HomePage() {
  return (
    <PageShell locale="ar" path="/">
      <section className="phero">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">نظام تشغيل مشاريع الإنشاء · ربائد</div>
          <h1>
            ثلاثة أطراف.
            <br />
            سجل واحد.
            <br />
            مسؤولية واضحة.
          </h1>
          <p className="lead">
            ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات
            وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة
            باسم من قام بها.
          </p>
        </div>
      </section>

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
