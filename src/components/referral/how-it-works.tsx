import { StepCards, type StepCard } from '@/components/step-cards';

export type ReferralHowItWorksContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly steps: readonly StepCard[];
};

/**
 * «كيف يعمل» on the referral page: the four steps, each in a card of its own,
 * the payout last and marked out. The cards are the start and tool pages'
 * (`StepCards`), four across rather than three (`programmes.css`).
 */
export function HowItWorks({ content }: { content: ReferralHowItWorksContent }) {
  return (
    <section id="how" className="light pad">
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <StepCards steps={content.steps} columns="four" />
      </div>
    </section>
  );
}
