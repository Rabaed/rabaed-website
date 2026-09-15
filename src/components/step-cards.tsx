/**
 * Steps, each in a card of its own, one of them marked out — the start page's
 * steps to going live, the tool page's steps to a first pour, the referral
 * page's four steps to a payout and the partnership page's three modes all
 * take this shape on the Reference site.
 */
export type StepCard = {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly text: string;
  /** Drawn with the accent border: the step the section wants remembered. */
  readonly markedOut: boolean;
  /** Who it suits, under a dashed rule: the partnership page's modes (`programmes.css`). */
  readonly fit?: string;
};

/** Class names for the number of columns at desktop widths (`start.css`, `programmes.css`). */
const COLUMN_CLASS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' } as const;

/**
 * How many columns `count` cards take at desktop widths, at most `most`: all
 * in one row while they fit, and otherwise as few rows as possible, filled as
 * evenly as they go — four in two rows of two rather than three and one alone.
 * An Editor adds and removes steps (spec: Design system).
 */
function columnsFor(count: number, most: 3 | 4): 1 | 2 | 3 | 4 {
  if (count <= most) return Math.max(count, 1) as 1 | 2 | 3 | 4;
  return Math.ceil(count / Math.ceil(count / most)) as 1 | 2 | 3 | 4;
}

export function StepCards({
  steps,
  columns = 'three',
}: {
  steps: readonly StepCard[];
  /** At most three across, or four — at desktop widths only (`programmes.css`). */
  columns?: 'three' | 'four';
}) {
  const most = columns === 'four' ? 4 : 3;
  const across = columnsFor(steps.length, most);
  // Three is `.start` itself, so the start and tool pages' three steps keep
  // the markup their baselines were drawn from; four is the referral page's.
  const layout = across === 3 && most === 3 ? 'start' : `start ${COLUMN_CLASS[across]}`;

  return (
    <div className={layout}>
      {steps.map((step) => (
        <div key={step.number} className={step.markedOut ? 's gs' : 's'}>
          {/* Only the numeral is `.mono`: DM Mono has no Arabic glyphs
              (spec: Design system). See `start.css`. */}
          <div className="k">
            <span className="mono">{step.number}</span> · {step.label}
          </div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {step.fit === undefined ? null : <span className="fit">{step.fit}</span>}
        </div>
      ))}
    </div>
  );
}
