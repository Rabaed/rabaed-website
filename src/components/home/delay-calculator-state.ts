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
 * The words that follow a count, as Arabic counts: one, two, three to ten, and
 * eleven and more each take a word of their own — «1 يوم», «2 يومان», «3 أيام»,
 * «11 يوماً». The founders chose Arabic's rule over the Reference site's, which
 * wrote «1 أيام» and «6 شهراً» (ticket 58). It holds for the sliders' ranges,
 * which stop short of a hundred. A count that never reaches one or two has no
 * word for them.
 */
export type CountWords = {
  readonly one?: string;
  readonly two?: string;
  readonly few: string;
  readonly many: string;
};

/**
 * The words the calculator writes around its numbers. Data rather than
 * functions, so the server can hand them to the browser.
 */
export type CalculatorWords = {
  /** The currency, after an amount. */
  readonly currency: string;
  /** The word after a number of days. */
  readonly days: Required<CountWords>;
  /** The word after a number of months. A project's length starts at six, so never one or two. */
  readonly months: Pick<CountWords, 'few' | 'many'>;
  /** The names the cost's two parts are written after, in the line under it: «تمويل 46,027 + تكاليف عامة للموقع 38,377». */
  readonly breakdown: { readonly financing: string; readonly siteOverhead: string };
};

/** The word after `count` of something. */
function wordAfter(count: number, words: CountWords): string {
  if (count === 1 && words.one !== undefined) return words.one;
  if (count === 2 && words.two !== undefined) return words.two;
  return count <= 10 ? words.few : words.many;
}

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
  return {
    readings: [
      { number: formatRiyals(settings.projectValue), word: words.currency },
      { number: String(settings.delayDays), word: wordAfter(settings.delayDays, words.days) },
      { number: String(settings.durationMonths), word: wordAfter(settings.durationMonths, words.months) },
    ] satisfies Figure[],
    cost: { number: formatRiyals(cost.total), word: words.currency } satisfies Figure,
    breakdown: `${words.breakdown.financing} ${formatRiyals(cost.financing)} + ${words.breakdown.siteOverhead} ${formatRiyals(cost.siteOverhead)}`,
    /**
     * Each slider's track, filled in the brand colour up to the middle of its
     * thumb. The thumb's middle travels from half a thumb in from one end to
     * half a thumb short of the other, so the fill is measured along that
     * travel. **An enhancement over the Reference site** (ticket 72), whose
     * fill is measured along the whole bar and so meets the thumb at the
     * middle alone. `--thumb-size` is set beside the thumb in the stylesheet.
     */
    tracks: SLIDERS.map((range, index) => {
      const share = (values[index] - range.min) / (range.max - range.min);
      const edge = `calc(var(--thumb-size) / 2 + ${share} * (100% - var(--thumb-size)))`;
      return `linear-gradient(to right, var(--acc) ${edge}, var(--line) ${edge})`;
    }),
  };
}

/** A figure as one phrase, for a screen reader: «84,405 ر.س». */
export function figureText(figure: Figure): string {
  return `${figure.number} ${figure.word}`;
}
