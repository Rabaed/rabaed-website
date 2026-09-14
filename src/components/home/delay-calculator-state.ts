import { delayCost, formatRiyals, type DelayCostInputs } from '@/lib/delay-cost';

/**
 * Everything the calculator writes for one setting of its sliders — decided
 * once, here, and read by both the server, which draws the starting figures,
 * and the browser, which redraws them as a slider moves. So the first response
 * and a slider moved back to where it started cannot disagree.
 *
 * The numbers are here; the words written around them are the page's, handed
 * to both sides as `CalculatorWords`.
 */

/** What a slider allows, and where it starts. Every number is the Reference site's own. */
export type SliderRange = {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  /** Where the slider starts. */
  readonly start: number;
};

const PROJECT_VALUE: SliderRange = { min: 1_000_000, max: 300_000_000, step: 1_000_000, start: 30_000_000 };
const DELAY_DAYS: SliderRange = { min: 1, max: 60, step: 1, start: 7 };
const DURATION_MONTHS: SliderRange = { min: 6, max: 48, step: 1, start: 18 };

/** The three sliders, in the order they stand, and the order `settingsAsValues` lists their values in. */
export const SLIDERS: readonly [SliderRange, SliderRange, SliderRange] = [PROJECT_VALUE, DELAY_DAYS, DURATION_MONTHS];

export const STARTING_SETTINGS: DelayCostInputs = {
  projectValue: PROJECT_VALUE.start,
  delayDays: DELAY_DAYS.start,
  durationMonths: DURATION_MONTHS.start,
};

/**
 * The words the calculator writes around its numbers. Data rather than
 * functions, so the server can hand them to the browser.
 */
export type CalculatorWords = {
  /** The currency, after an amount. */
  readonly currency: string;
  /** The word after a number of days: `few` up to `fewUpTo` days, `many` beyond. */
  readonly days: { readonly few: string; readonly fewUpTo: number; readonly many: string };
  /** The word after a number of months, whatever the number. */
  readonly months: string;
  /** The line under the cost that splits it in two, with `{financing}` and `{siteOverhead}` where the amounts go. */
  readonly breakdown: string;
};

/** A setting of the sliders as their three values, in the sliders' order. */
export function settingsAsValues(settings: DelayCostInputs): [number, number, number] {
  return [settings.projectValue, settings.delayDays, settings.durationMonths];
}

/** The three sliders' values, in their order, as a setting. */
export function settingsFromValues([projectValue, delayDays, durationMonths]: readonly number[]): DelayCostInputs {
  return { projectValue, delayDays, durationMonths };
}

/**
 * A figure beside its word — «84,405» and «ر.س». Kept apart because they are
 * set in different typefaces: DM Mono has no Arabic, so only the number is in
 * it.
 */
export type Figure = { readonly number: string; readonly word: string };

export function calculatorDisplay(settings: DelayCostInputs, words: CalculatorWords) {
  const cost = delayCost(settings);
  const values = settingsAsValues(settings);
  const days = settings.delayDays <= words.days.fewUpTo ? words.days.few : words.days.many;
  return {
    readings: [
      { number: formatRiyals(settings.projectValue), word: words.currency },
      { number: String(settings.delayDays), word: days },
      { number: String(settings.durationMonths), word: words.months },
    ] satisfies Figure[],
    cost: { number: formatRiyals(cost.total), word: words.currency } satisfies Figure,
    breakdown: fillIn(words.breakdown, {
      financing: formatRiyals(cost.financing),
      siteOverhead: formatRiyals(cost.siteOverhead),
    }),
    /** Each slider's track, filled in the brand colour up to its thumb — the Reference site's own gradient. */
    tracks: SLIDERS.map((range, index) => {
      const filled = ((values[index] - range.min) / (range.max - range.min)) * 100;
      return `linear-gradient(to right, var(--acc) ${filled}%, var(--line) ${filled}%)`;
    }),
  };
}

/** A figure as one phrase, for a screen reader: «84,405 ر.س». */
export function figureText(figure: Figure): string {
  return `${figure.number} ${figure.word}`;
}

/** `template` with each `{name}` in it replaced by that name's value. A name with no value is left as written. */
function fillIn(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => values[name] ?? placeholder);
}
