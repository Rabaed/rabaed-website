import { Faq, type FaqEntry } from '@/components/faq';

export type ReferralQuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
};

/**
 * «قبل أن تسجّل» on the referral page: the questions, in the row of cards the
 * home page uses.
 */
export function Questions({ content }: { content: ReferralQuestionsContent }) {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <Faq entries={content.entries} />
      </div>
    </section>
  );
}
