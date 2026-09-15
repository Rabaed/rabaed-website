import { Inline, type InlineText } from '@/components/inline-text';
import { StepCards, type StepCard } from '@/components/step-cards';

export type PartnershipModesContent = {
  readonly eyebrow: string;
  readonly heading: string;
  /** Each with the line on who it suits (`fit`). */
  readonly modes: readonly StepCard[];
  /** That the terms of each mode are agreed, not listed. */
  readonly note: InlineText;
};

/**
 * «أنماط التعاون» on the partnership page: the ways an office can work with
 * Rabaed — three on the Reference site; as many as an Editor gives it (ticket
 * 55) — each in the start page's step card with a line on who it suits, and
 * the note that the terms of each are agreed, not listed.
 */
export function Modes({ content }: { content: PartnershipModesContent }) {
  return (
    <section id="modes" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <StepCards steps={content.modes} />
        <div className="gain" style={{ marginTop: '22px' }}>
          <Inline text={content.note} />
        </div>
      </div>
    </section>
  );
}
