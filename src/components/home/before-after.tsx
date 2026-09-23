import type { CSSProperties } from 'react';
import { BeforeAfterBehaviour } from '@/components/home/before-after-behaviour';
import { SEAM_AT_REST, type Verdict } from '@/components/home/before-after-seam';
import type { ReadingDirection } from '@/lib/reading-direction';
import { Inline, type InlineText } from '@/components/inline-text';

export type Face = {
  /** The small label in the card's corner: where this step happens. */
  readonly channel: string;
  /** Plain words, or words with a phrase in bold or a line break. */
  readonly words: InlineText;
};

export type ComparisonStep = {
  readonly name: string;
  readonly usual: Face;
  readonly rabaed: Face;
};

export type HomeBeforeAfterContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: InlineText;
  /** The tag over the side of the seam showing the usual way. */
  readonly usualTag: string;
  /** The tag over the side showing Rabaed's. */
  readonly rabaedTag: string;
  /** Names the seam's handle, for a screen reader. */
  readonly handleLabel: string;
  /** The line under the steps: which way won, or neither yet (`verdictFor`). */
  readonly verdicts: Readonly<Record<Verdict, string>>;
  /** Exactly four: the design is built around four steps, so an Editor cannot add or remove one (spec: Content model). */
  readonly steps: ComparisonSteps;
};

export type ComparisonSteps = readonly [ComparisonStep, ComparisonStep, ComparisonStep, ComparisonStep];

/**
 * «نفس الاعتماد… بطريقتين.» — four moments in one material approval, the usual
 * way and Rabaed's, with a seam the visitor drags across them. Every step on
 * the side of the seam a line begins on — the right in Arabic, the left in
 * English — shows Rabaed's way (`before-after-seam.ts`), and the verdict under
 * them says which way won. `BeforeAfterBehaviour` makes it move.
 *
 * A server component. Every face of every step is in the first response.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate: it opens as the script
 * paints it.** The Reference site's markup has no state of its own until its
 * script runs, so for that moment — and for good without JavaScript — both
 * faces of every step are drawn on top of each other and all three verdicts
 * overlap. Here the stylesheet draws the seam at rest from the start: the two
 * steps a line begins with turned over, the half-way verdict, both tags
 * half-shown.
 */
export function BeforeAfter({
  content,
  direction,
}: {
  content: HomeBeforeAfterContent;
  /** The page's reading direction, which side of the seam Rabaed's way is on (`before-after-seam.ts`). */
  direction: ReadingDirection;
}) {
  const { verdicts } = content;
  return (
    <section id="ba" className="light pad" data-direction={direction}>
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2>{content.heading}</h2>
        <p className="lead">
          <Inline text={content.lead} />
        </p>

        <div className="cmp" style={{ '--p': `${SEAM_AT_REST}%` } as CSSProperties}>
          <div className="cmp-wash" />
          <div className="cmp-tag tb">{content.usualTag}</div>
          <div className="cmp-tag ta">{content.rabaedTag}</div>

          <div className="cmp-steps">
            {content.steps.map((step, index) => (
              <span key={step.name}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                {step.name}
              </span>
            ))}
          </div>

          <div className="cmp-cols">
            {content.steps.map((step) => (
              <div key={step.name} className="cmp-col">
                <FaceCard face={step.usual} className="face fb" />
                <FaceCard face={step.rabaed} className="face fa" />
              </div>
            ))}
          </div>

          <div
            className="cmp-handle"
            role="slider"
            tabIndex={0}
            aria-label={content.handleLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={SEAM_AT_REST}
          >
            <span className="grip">
              <b>‹</b>
              <b>›</b>
            </span>
          </div>
        </div>

        <div className="cmp-verdicts">
          <p className="cmp-verdict bad">{verdicts.usual}</p>
          <p className="cmp-verdict good">{verdicts.rabaed}</p>
          <p className="cmp-verdict mid">{verdicts.between}</p>
        </div>
      </div>

      <BeforeAfterBehaviour />
    </section>
  );
}

function FaceCard({ face, className }: { face: Face; className: string }) {
  return (
    <div className={className}>
      <div className="ch">{face.channel}</div>
      <p>
        <Inline text={face.words} />
      </p>
    </div>
  );
}
