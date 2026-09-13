import type { FaqEntry } from '@/content/faq';

/**
 * Questions, each opening to its answer.
 *
 * A server component with no script at all: `<details>` opens and closes
 * itself, from a click, a tap or the keyboard. That is the point of using it.
 * The answer is in the page from the first response, closed or not, so search
 * engines and AI assistants read every one of them — an accordion driven by
 * script would hand them the questions and hide the answers.
 *
 * Only the questions: where they stand is the page's to decide. The home,
 * tool, referral and partnership pages lay them out in a row of cards (`Faq`);
 * the start page stacks its longer list in a column beside the demo request
 * form.
 */
export function FaqEntries({ entries }: { entries: readonly FaqEntry[] }) {
  return entries.map((entry) => (
    <details key={entry.question} className="qa">
      <summary>{entry.question}</summary>
      <p>
        {typeof entry.answer === 'string'
          ? entry.answer
          : entry.answer.map((part, index) =>
              typeof part === 'string' ? (
                part
              ) : (
                <span key={index} className="mono" dir="ltr">
                  {part.latin}
                </span>
              ),
            )}
      </p>
    </details>
  ));
}

/** Questions in a row of cards, three across. */
export function Faq({ entries }: { entries: readonly FaqEntry[] }) {
  return (
    <div className="fq-row">
      <FaqEntries entries={entries} />
    </div>
  );
}
