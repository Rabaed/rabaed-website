/**
 * The line above a Company profile section's heading: its number, then its
 * words (ticket 105). The number is the section's place in Ahmed's order,
 * which is fixed, so it is code and never an Editor's; it is set in DM Mono,
 * whose numerals it is, in a small accent tile as Ahmed draws it.
 */
export function SectionEyebrow({ number, words }: { number: string; words: string }) {
  return (
    <div className="eyebrow pf-eyebrow">
      <span className="pf-num">{number}</span>
      {words}
    </div>
  );
}
