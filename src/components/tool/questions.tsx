import { Faq, type FaqEntry } from '@/components/faq';
import { TeaserHead } from '@/components/tool/parts';

export type ToolQuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
};

/** «قبل أن تحمّل»: six questions, in the shared row of cards. */
export function ToolQuestions({ content }: { content: ToolQuestionsContent }) {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} />
        <Faq entries={content.entries} />
      </div>
    </section>
  );
}
