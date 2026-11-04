import type { ReactNode } from 'react';
import {
  SLIDERS,
  STARTING_SETTINGS,
  calculatorDisplay,
  figureText,
  settingsAsValues,
  wordAfterFigure,
  type CalculatorWords,
  type Figure,
} from '@/components/home/delay-calculator-state';
import { DelayCalculatorBehaviour } from '@/components/home/delay-calculator-behaviour';
import { newTabIfAway, type PageLink } from '@/components/page-link';

export type DelayCalculatorContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /** Each slider's name, in the sliders' order (`SLIDERS`). */
  readonly sliderLabels: readonly [string, string, string];
  /** The line over the cost. */
  readonly resultLabel: string;
  /** What the estimate assumes and leaves out, under the cost. */
  readonly assumptions: string;
  /** The button under them: the home page's to its demo request form, the Company profile's where its Editor sends it. */
  readonly callToAction: PageLink;
  /** The words written around the numbers, here and again in the browser as a slider moves. */
  readonly words: CalculatorWords;
};

/**
 * The Delay-cost calculator (ADR-0029): three sliders — the project's value,
 * the days of delay and how much of it is built — and what that delay costs in
 * the cost of money on what has been spent. `DelayCalculatorBehaviour`
 * redraws the figures as a slider moves. Its words are one CMS entry, for
 * every page that shows it (`src/content/delay-calculator.ts`).
 *
 * A server component. The starting figures, and each track filled up to its
 * thumb, are worked out here with the same code the browser uses, so the first
 * response is the calculator as it opens rather than a blank waiting for a
 * script.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate:** the Reference site sets
 * its cost and every slider reading wholly in DM Mono, a face with no
 * Arabic glyphs, so the words beside the numbers drop to the browser's
 * last-resort monospace — the defect the footer and the guarantee pill already
 * fix. Only the number is `.mono` here.
 *
 * `id` is the section's: the home page's `calc`, the Reference site's own,
 * and the Company profile's `cost`, Ahmed's (ticket 106). `eyebrow` is the
 * line above the heading where a page draws its own in place of the plain
 * one — the Company profile's, with its section number — from the same words.
 */
export function DelayCalculator({ content, id = 'calc', eyebrow }: { content: DelayCalculatorContent; id?: string; eyebrow?: ReactNode }) {
  const display = calculatorDisplay(STARTING_SETTINGS, content.words);
  const values = settingsAsValues(STARTING_SETTINGS);

  return (
    <section id={id} className="light pad">
      <div className="wrap">
        {eyebrow ?? <div className="eyebrow">{content.eyebrow}</div>}
        <h2>{content.heading}</h2>
        <p className="lead">{content.lead}</p>

        <div className="calc">
          <div className="in">
            {SLIDERS.map((range, index) => (
              <label key={index}>
                <span className="lr">
                  {content.sliderLabels[index]} <FigureWithWord figure={display.readings[index]} />
                </span>
                <input
                  className="rng"
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  defaultValue={values[index]}
                  aria-valuetext={figureText(display.readings[index])}
                  style={{ background: display.tracks[index] }}
                />
              </label>
            ))}
          </div>

          <div className="out">
            <small>{content.resultLabel}</small>
            <FigureWithWord figure={display.cost} />
            <small>{display.spent}</small>
            <div className="n">{content.assumptions}</div>
            {/* The Reference site's own inline spacing above the button. */}
            <div style={{ marginTop: '18px' }}>
              <a className="btn p" href={content.callToAction.href} {...newTabIfAway(content.callToAction.href)}>
                {content.callToAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <DelayCalculatorBehaviour section={id} words={content.words} />
    </section>
  );
}

/** «46,027 ر.س»: the number in DM Mono, the word in the Arabic face. */
function FigureWithWord({ figure }: { figure: Figure }) {
  return (
    <b>
      <span className="mono">{figure.number}</span>
      <span>{wordAfterFigure(figure)}</span>
    </b>
  );
}
