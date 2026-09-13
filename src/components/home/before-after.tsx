import { Fragment, type CSSProperties } from 'react';
import { BeforeAfterBehaviour } from '@/components/home/before-after-behaviour';
import { SEAM_AT_REST } from '@/components/home/before-after-seam';
import { BEFORE_AFTER_COPY, COMPARISON_STEPS, type Face, type Words } from '@/content/before-after';

/**
 * «نفس الاعتماد… بطريقتين.» — four moments in one material approval, the usual
 * way and Rabaed's, with a seam the visitor drags across them. Every step to
 * the right of the seam shows Rabaed's way (`before-after-seam.ts`), and the
 * verdict under them says which way won. `BeforeAfterBehaviour` makes it move.
 *
 * A server component. Every face of every step is in the first response.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate: it opens as the script
 * paints it.** The Reference site's markup has no state of its own until its
 * script runs, so for that moment — and for good without JavaScript — both
 * faces of every step are drawn on top of each other and all three verdicts
 * overlap. Here the stylesheet draws the seam at rest from the start: the two
 * steps on its right turned over, the half-way verdict, both tags half-shown.
 */
export function BeforeAfter() {
  const { verdicts } = BEFORE_AFTER_COPY;
  return (
    <section id="ba" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{BEFORE_AFTER_COPY.eyebrow}</div>
        <h2>{BEFORE_AFTER_COPY.heading}</h2>
        <p className="lead">
          <WordsOf words={BEFORE_AFTER_COPY.lead} />
        </p>

        <div className="cmp" style={{ '--p': `${SEAM_AT_REST}%` } as CSSProperties}>
          <div className="cmp-wash" />
          <div className="cmp-tag tb">{BEFORE_AFTER_COPY.usualTag}</div>
          <div className="cmp-tag ta">{BEFORE_AFTER_COPY.rabaedTag}</div>

          <div className="cmp-steps">
            {COMPARISON_STEPS.map((step, index) => (
              <span key={step.name}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                {step.name}
              </span>
            ))}
          </div>

          <div className="cmp-cols">
            {COMPARISON_STEPS.map((step) => (
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
            aria-label={BEFORE_AFTER_COPY.handleLabel}
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
        <WordsOf words={face.words} />
      </p>
    </div>
  );
}

function WordsOf({ words }: { words: Words }) {
  return words.map((piece, index) => (
    <Fragment key={index}>
      {piece === 'line-break' ? <br /> : typeof piece === 'string' ? piece : <b>{piece.bold}</b>}
    </Fragment>
  ));
}
