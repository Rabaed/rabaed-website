import { Faq } from '@/components/faq';
import { REFERRAL_FAQ } from '@/content/faq';

/**
 * «قبل أن تسجّل» on the referral page: the questions, in the row of cards the
 * home page uses.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
export function Questions() {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">الأسئلة الشائعة</div>
          <h2>قبل أن تسجّل</h2>
        </div>
        <Faq entries={REFERRAL_FAQ} />
      </div>
    </section>
  );
}
