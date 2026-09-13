import {
  SLIDERS,
  STARTING_SETTINGS,
  calculatorDisplay,
  figureText,
  settingsAsValues,
  type CalculatorWords,
  type Figure,
} from '@/components/home/delay-calculator-state';
import { DelayCalculatorBehaviour } from '@/components/home/delay-calculator-behaviour';
import type { HeroLink } from '@/components/page-hero';

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
  /** The button under them. */
  readonly callToAction: HeroLink;
  /** The words written around the numbers, here and again in the browser as a slider moves. */
  readonly words: CalculatorWords;
};

/**
 * «كم يكلفك أسبوع تأخير اعتماد واحد؟» — three sliders, and what the delay they
 * describe costs. `DelayCalculatorBehaviour` redraws the figures as a slider
 * moves.
 *
 * A server component. The starting figures, and each track filled up to its
 * thumb, are worked out here with the same code the browser uses, so the first
 * response is the calculator as it opens rather than a blank waiting for a
 * script.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate:** the Reference site sets
 * «84,405 ر.س» and every slider reading wholly in DM Mono, a face with no
 * Arabic glyphs, so the words beside the numbers drop to the browser's
 * last-resort monospace — the defect the footer and the guarantee pill already
 * fix. Only the number is `.mono` here.
 */
export function DelayCalculator({ content }: { content: DelayCalculatorContent }) {
  const display = calculatorDisplay(STARTING_SETTINGS, content.words);
  const values = settingsAsValues(STARTING_SETTINGS);

  return (
    <section id="calc" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
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
            <small>{display.breakdown}</small>
            <div className="n">{content.assumptions}</div>
            {/* The Reference site's own inline spacing above the button. */}
            <div style={{ marginTop: '18px' }}>
              <a className="btn p" href={content.callToAction.href}>
                {content.callToAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <DelayCalculatorBehaviour words={content.words} />
    </section>
  );
}

/** «84,405 ر.س»: the number in DM Mono, the word in the Arabic face. */
function FigureWithWord({ figure }: { figure: Figure }) {
  return (
    <b>
      <span className="mono">{figure.number}</span>
      <span> {figure.word}</span>
    </b>
  );
}
