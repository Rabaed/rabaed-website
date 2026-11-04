import { DELAY_COST_SLIDERS, delayCost, formatRiyals, type DelayCostInputs, type SliderRange } from '@/lib/delay-cost';

/**
 * Everything the calculator writes for one setting of its sliders — decided
 * once, here, and read by both the server, which draws the starting figures,
 * and the browser, which redraws them as a slider moves. So the first response
 * and a slider moved back to where it started cannot disagree.
 *
 * The numbers are here; the words written around them are the CMS's, handed
 * to both sides as `CalculatorWords`.
 */

/** The three sliders, in the order they stand, and the order `settingsAsValues` lists their values in. */
export const SLIDERS: readonly [SliderRange, SliderRange, SliderRange] = [
  DELAY_COST_SLIDERS.projectValue,
  DELAY_COST_SLIDERS.delayDays,
  DELAY_COST_SLIDERS.progressPercent,
];

export const STARTING_SETTINGS: DelayCostInputs = {
  projectValue: DELAY_COST_SLIDERS.projectValue.start,
  delayDays: DELAY_COST_SLIDERS.delayDays.start,
  progressPercent: DELAY_COST_SLIDERS.progressPercent.start,
};

/**
 * The words that follow a count, as Arabic counts: one, two, three to ten, and
 * eleven and more each take a word of their own — «1 يوم», «2 يومان», «3 أيام»,
 * «11 يوماً». The founders chose Arabic's rule over the Reference site's, which
 * wrote «1 أيام» (ticket 58). It holds for the days slider's range, which stops
 * short of a hundred.
 */
export type CountWords = {
  readonly one: string;
  readonly two: string;
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
  readonly days: CountWords;
  /**
   * The line under the cost, with `{amount}` where what has been spent so far
   * is written: «على {amount} ر.س مصروفة حتى الآن».
   */
  readonly spent: string;
};

/** Where the line under the cost writes what has been spent. */
const AMOUNT = '{amount}';

/** The word after `count` of something. */
function wordAfter(count: number, words: CountWords): string {
  if (count === 1) return words.one;
  if (count === 2) return words.two;
  return count <= 10 ? words.few : words.many;
}

/** A setting of the sliders as their three values, in the sliders' order. */
export function settingsAsValues(settings: DelayCostInputs): [number, number, number] {
  return [settings.projectValue, settings.delayDays, settings.progressPercent];
}

/** The three sliders' values, in their order, as a setting. */
export function settingsFromValues([projectValue, delayDays, progressPercent]: readonly number[]): DelayCostInputs {
  return { projectValue, delayDays, progressPercent };
}

/**
 * A figure beside its word — «46,027» and «ر.س». Kept apart because they are
 * set in different typefaces: DM Mono has no Arabic, so only the number is in
 * it. A percentage carries its «%» in the number and has no word.
 */
export type Figure = { readonly number: string; readonly word: string };

export function calculatorDisplay(settings: DelayCostInputs, words: CalculatorWords) {
  const cost = delayCost(settings);
  const values = settingsAsValues(settings);
  return {
    readings: [
      { number: formatRiyals(settings.projectValue), word: words.currency },
      { number: String(settings.delayDays), word: wordAfter(settings.delayDays, words.days) },
      { number: `${settings.progressPercent}%`, word: '' },
    ] satisfies Figure[],
    cost: { number: formatRiyals(cost.total), word: words.currency } satisfies Figure,
    spent: words.spent.replaceAll(AMOUNT, formatRiyals(cost.spent)),
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

/** The word after a figure as it is written, with the space before it — or nothing, for a figure with no word. */
export function wordAfterFigure(figure: Figure): string {
  return figure.word ? ` ${figure.word}` : '';
}

/** A figure as one phrase, for a screen reader: «46,027 ر.س». */
export function figureText(figure: Figure): string {
  return `${figure.number}${wordAfterFigure(figure)}`;
}
