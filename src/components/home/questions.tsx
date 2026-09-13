import { Faq } from '@/components/faq';
import { HOME_FAQ } from '@/content/faq';
import { localePath } from '@/lib/locales';

/**
 * «قبل أن تسأل» — three questions a visitor asks before booking a demo, and a
 * link to the rest of them on the start page.
 *
 * All copy is verbatim from `reference/site/index.html`.
 */
export function Questions() {
  return (
    <section id="fq" className="light pad">
      <div className="wrap">
        <div className="tz-head">
          <div>
            <div className="eyebrow">الأسئلة الشائعة</div>
            <h2>قبل أن تسأل</h2>
          </div>
        </div>

        <Faq entries={HOME_FAQ} />

        <div className="tz-foot">
          <a className="tz-more" href={`${localePath('ar', '/start')}#faq`}>
            <span>كل الأسئلة</span>
            <span className="ar">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
