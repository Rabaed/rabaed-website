import { Faq } from '@/components/faq';
import { PARTNERSHIP_FAQ } from '@/content/faq';

/**
 * «قبل الاجتماع الأول» on the partnership page: the questions, in the row of
 * cards the home and referral pages use.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
export function Questions() {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">الأسئلة الشائعة</div>
          <h2>قبل الاجتماع الأول</h2>
        </div>
        <Faq entries={PARTNERSHIP_FAQ} />
      </div>
    </section>
  );
}
