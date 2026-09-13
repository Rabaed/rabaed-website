import {
  DELAY_DAYS,
  DURATION_MONTHS,
  MONTHS_WORD,
  PROJECT_VALUE,
  RIYALS,
  breakdownLine,
  daysWord,
  type SliderRange,
} from '@/content/delay-calculator';
import { delayCost, formatRiyals, type DelayCostInputs } from '@/lib/delay-cost';

/**
 * Everything the calculator writes for one setting of its sliders — decided
 * once, here, and read by both the server, which draws the starting figures,
 * and the browser, which redraws them as a slider moves. So the first response
 * and a slider moved back to where it started cannot disagree.
 */

/** The three sliders, in the order they stand. */
export const SLIDERS: readonly [SliderRange, SliderRange, SliderRange] = [PROJECT_VALUE, DELAY_DAYS, DURATION_MONTHS];

export const STARTING_SETTINGS: DelayCostInputs = {
  projectValue: PROJECT_VALUE.start,
  delayDays: DELAY_DAYS.start,
  durationMonths: DURATION_MONTHS.start,
};

/**
 * A figure beside its word — «84,405» and «ر.س». Kept apart because they are
 * set in different typefaces: DM Mono has no Arabic, so only the number is in
 * it.
 */
export type Figure = { readonly number: string; readonly word: string };

export function calculatorDisplay(settings: DelayCostInputs) {
  const cost = delayCost(settings);
  const values = [settings.projectValue, settings.delayDays, settings.durationMonths];
  return {
    readings: [
      { number: formatRiyals(settings.projectValue), word: RIYALS },
      { number: String(settings.delayDays), word: daysWord(settings.delayDays) },
      { number: String(settings.durationMonths), word: MONTHS_WORD },
    ] satisfies Figure[],
    cost: { number: formatRiyals(cost.total), word: RIYALS } satisfies Figure,
    breakdown: breakdownLine(formatRiyals(cost.financing), formatRiyals(cost.siteOverhead)),
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
