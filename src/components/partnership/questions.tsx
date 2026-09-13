import { Faq, type FaqEntry } from '@/components/faq';

export type PartnershipQuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
};

/**
 * «قبل الاجتماع الأول» on the partnership page: the questions, in the row of
 * cards the home and referral pages use.
 */
export function Questions({ content }: { content: PartnershipQuestionsContent }) {
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
