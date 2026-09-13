import type { FaqEntry } from '@/content/faq';

/**
 * A row of questions, each opening to its answer.
 *
 * A server component with no script at all: `<details>` opens and closes
 * itself, from a click, a tap or the keyboard. That is the point of using it.
 * The answer is in the page from the first response, closed or not, so search
 * engines and AI assistants read every one of them — an accordion driven by
 * script would hand them the questions and hide the answers.
 *
 * The home, tool, referral and partnership pages all lay their questions out
 * in this row; the start page lays out a longer list differently, and adds its
 * own layout when ticket 13 builds it.
 */
export function Faq({ entries }: { entries: readonly FaqEntry[] }) {
  return (
    <div className="fq-row">
      {entries.map((entry) => (
        <details key={entry.question} className="qa">
          <summary>{entry.question}</summary>
          <p>{entry.answer}</p>
        </details>
      ))}
    </div>
  );
}
