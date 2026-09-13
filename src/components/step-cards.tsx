/**
 * Three steps, each in a card of its own, one of them marked out — the start
 * page's steps to going live and the tool page's steps to a first pour both
 * take this shape on the Reference site.
 */
export type StepCard = {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly text: string;
  /** Drawn with the accent border: the step the section wants remembered. */
  readonly markedOut: boolean;
};

export function StepCards({ steps }: { steps: readonly StepCard[] }) {
  return (
    <div className="start">
      {steps.map((step) => (
        <div key={step.number} className={step.markedOut ? 's gs' : 's'}>
          {/* Only the numeral is `.mono`: DM Mono has no Arabic glyphs
              (spec: Design system). See `start.css`. */}
          <div className="k">
            <span className="mono">{step.number}</span> · {step.label}
          </div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
}
