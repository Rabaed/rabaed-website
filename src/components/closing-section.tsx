import { DemoRequestForm } from '@/components/demo-request-form';
import { localePath } from '@/lib/locales';

/**
 * «كيف نبدأ معك» — the block the home and product pages end on: the three
 * steps to going live beside the demo request form.
 *
 * Ticket 04 built the steps inside the home page; ticket 11 added the form
 * beside them, which fills the column that had stood empty (bug 44), and moved
 * the block here so the product page can end on the same one. The start page
 * has no such block — its form stands beside its questions instead.
 *
 * All copy is verbatim from `reference/site/index.html`.
 */
export function ClosingSection() {
  return (
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

        <DemoRequestForm />
      </div>
    </section>
  );
}
