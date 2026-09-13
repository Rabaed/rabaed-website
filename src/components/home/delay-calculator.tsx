import {
  SLIDERS,
  STARTING_SETTINGS,
  calculatorDisplay,
  figureText,
  settingsAsValues,
  type Figure,
} from '@/components/home/delay-calculator-state';
import { DelayCalculatorBehaviour } from '@/components/home/delay-calculator-behaviour';
import { CALCULATOR_COPY } from '@/content/delay-calculator';

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
export function DelayCalculator() {
  const display = calculatorDisplay(STARTING_SETTINGS);
  const values = settingsAsValues(STARTING_SETTINGS);

  return (
    <section id="calc" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{CALCULATOR_COPY.eyebrow}</div>
        <h2>{CALCULATOR_COPY.heading}</h2>
        <p className="lead">{CALCULATOR_COPY.lead}</p>

        <div className="calc">
          <div className="in">
            {SLIDERS.map((range, index) => (
              <label key={range.label}>
                <span className="lr">
                  {range.label} <FigureWithWord figure={display.readings[index]} />
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
            <small>{CALCULATOR_COPY.resultLabel}</small>
            <FigureWithWord figure={display.cost} />
            <small>{display.breakdown}</small>
            <div className="n">{CALCULATOR_COPY.assumptions}</div>
            {/* The Reference site's own inline spacing above the button. */}
            <div style={{ marginTop: '18px' }}>
              <a className="btn p" href="#demo">
                {CALCULATOR_COPY.callToAction}
              </a>
            </div>
          </div>
        </div>
      </div>

      <DelayCalculatorBehaviour />
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
