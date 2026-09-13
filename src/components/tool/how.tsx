import { StepCards, type StepCard } from '@/components/step-cards';
import { TeaserHead } from '@/components/tool/parts';

export type ToolHowContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly steps: readonly StepCard[];
};

/**
 * «ثلاث خطوات»: from the download to a first pour, in the start page's step
 * cards.
 */
export function How({ content }: { content: ToolHowContent }) {
  return (
    <section id="how" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} lead={content.lead} />
        <StepCards steps={content.steps} />
      </div>
    </section>
  );
}
