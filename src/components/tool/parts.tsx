import type { ReactNode } from 'react';
import { COLUMN_CLASS, columnsFor } from '@/components/columns';
import { Inline, type InlineText } from '@/components/inline-text';

/**
 * The pieces the tool page's sections are built from: a section's heading, a
 * card of the three-across row, a list of ticked lines, and the states a test
 * can be in.
 */

/** A card of the three-across row: its label, title and text. */
export type TeaserCard = {
  readonly label: string;
  readonly title: string;
  readonly text: string;
};

/** Where a test stands, which decides its colour (`tool.css`). */
export type TestTone = 'idle' | 'warn' | 'bad' | 'info' | 'ok';

/** A test's state as the tool shows it: a coloured dot and the words beside it. */
export type TestState = {
  readonly tone: TestTone;
  readonly label: string;
};

/** A section's heading, with the line under it. */
export function TeaserHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="tz-head">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {lead && (
        <p className="lead" style={{ marginTop: '12px' }}>
          {lead}
        </p>
      )}
    </div>
  );
}

/**
 * The three-across row, holding however many cards an Editor gives it
 * (ticket 54), laid out by `columnsFor`. Three is `.rt-row` itself, so today's
 * rows of three and six keep the markup their baselines were drawn from.
 */
export function CardRow({ count, className, children }: { count: number; className?: string; children: ReactNode }) {
  const across = columnsFor(count, 3);
  const classes = ['rt-row', className, across === 3 ? undefined : COLUMN_CLASS[across]];
  return <div className={classes.filter(Boolean).join(' ')}>{children}</div>;
}

/** A card of the three-across row. */
export function Card({ label, title, text }: TeaserCard) {
  return (
    <div className="rt-c">
      <div className="k">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/** A list of ticked lines, each an optional bold opening, then the rest. */
export function TickList({ lines }: { lines: readonly InlineText[] }) {
  return (
    <ul className="tl-tick">
      {/* By place: an Editor may write two lines alike. */}
      {lines.map((line, index) => (
        <li key={index}>
          <i>✓</i>
          <span>
            <Inline text={line} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** A test's state: the coloured dot, then its words. */
export function TestStateBadge({ state, className }: { state: TestState; className: string }) {
  return (
    <span className={`${className} ${state.tone}`}>
      <i />
      {state.label}
    </span>
  );
}
