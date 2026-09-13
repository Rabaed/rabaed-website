import { Faq } from '@/components/faq';
import { TeaserHead } from '@/components/tool/parts';
import { TOOL_FAQ } from '@/content/faq';

/**
 * «قبل أن تحمّل»: six questions, in the shared row of cards.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function ToolQuestions() {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow="الأسئلة الشائعة" title="قبل أن تحمّل" />
        <Faq entries={TOOL_FAQ} />
      </div>
    </section>
  );
}
