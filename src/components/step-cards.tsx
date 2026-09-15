import { COLUMN_CLASS, columnsFor } from '@/components/columns';

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

/** However many steps an Editor gives it, laid out by `columnsFor`. */
export function StepCards({
  steps,
  maxColumns = 3,
}: {
  steps: readonly StepCard[];
  /** At most three across, or four — at desktop widths only (`programmes.css`). */
  maxColumns?: 3 | 4;
}) {
  const across = columnsFor(steps.length, maxColumns);
  // Three is `.start` itself, so the start and tool pages' three steps keep
  // the markup their baselines were drawn from; four is the referral page's.
  const layout = across === 3 && maxColumns === 3 ? 'start' : `start ${COLUMN_CLASS[across]}`;

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
