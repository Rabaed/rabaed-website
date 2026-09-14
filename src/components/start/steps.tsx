import { StepCards, type StepCard } from '@/components/step-cards';

export type StartStepsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly steps: readonly StepCard[];
};

/**
 * «كيف نبدأ معك» on the start page: the three steps to going live, the
 * guarantee last and marked out.
 *
 * The home and product pages say the same three steps in a shorter list beside
 * the demo request form (`src/components/closing-section.tsx`); the Reference
 * site words the two differently, and each is kept as it wrote it.
 */
export function Steps({ content }: { content: StartStepsContent }) {
  return (
    <section id="start" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2>{content.heading}</h2>
        <StepCards steps={content.steps} />
      </div>
    </section>
  );
}
