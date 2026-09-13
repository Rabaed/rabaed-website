import type { ReactNode } from 'react';

/**
 * The pieces the tool page's sections are built from: a section's heading, a
 * card of the three-across row, and a list of ticked lines.
 */

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

/** A card of the three-across row: its label, title and text. */
export function Card({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="rt-c">
      <div className="k">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/** A list of ticked lines. */
export function TickList({ children }: { children: ReactNode }) {
  return <ul className="tl-tick">{children}</ul>;
}

/** A ticked line: an optional bold opening, then the rest. */
export function Tick({ children }: { children: ReactNode }) {
  return (
    <li>
      <i>✓</i>
      <span>{children}</span>
    </li>
  );
}
