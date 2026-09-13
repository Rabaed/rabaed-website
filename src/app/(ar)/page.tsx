import type { Metadata } from 'next';
import { Figures } from '@/components/home/figures';
import { Hero } from '@/components/home/hero';
import { Situations } from '@/components/home/situations';
import { TrustStrip } from '@/components/home/trust-strip';
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
 * The Arabic home page, in the state ticket 07 leaves it: the full-height hero,
 * the Trust strip, the situations deck, the figures deck, then the repeating
 * tail.
 *
 * The gaps are marked where they fall, in the Reference site's order: tickets
 * 08-10 fill the space between the two decks, and ticket 11 puts the FAQs
 * before the tail. The closing section is the tail every page carries; ticket
 * 11 puts the demo form
 * in its second column and ticket 27 makes that form real, which is why it
 * looks half-empty at desktop widths today (bug 44).
 *
 * All copy is verbatim from `reference/site/index.html`. Nothing here is
 * placeholder text, and nothing waits to be reworded.
 */
export default function HomePage() {
  return (
    <PageShell locale="ar" path="/">
      <Hero />
      <TrustStrip />
      <Situations />
      {/* Tickets 08, 09 and 10: the four units, the Record, and the
          before-and-after with its calculator. */}
      <Figures />
      {/* Ticket 11: the FAQs. */}

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
