/**
 * What a delay costs a construction project's owner — the method behind the
 * Delay-cost calculator, on the home page and the Company profile alike
 * (ADR-0029): **the cost of money on what has already been spent**. Money put
 * into a project comes back only at handover, so each day handover slips holds
 * it out for a day longer, at 8% a year — financing, or the return it could
 * have earned elsewhere.
 *
 *     spent = value × progress%
 *     cost  = spent × 8% ÷ 365 × days of delay
 *
 * Ahmed's method, from his Company profile (approved 31 October 2026), chosen
 * by the founder for every page on 4 November 2026. **It overrules the
 * Reference site's formula on purpose** (financing on the whole value plus
 * site overhead): do not restore it. What it leaves out — delayed revenue,
 * supervision fees, contractor claims, penalties — the calculator's
 * assumptions note says.
 *
 * The method and what each slider allows stay here, in code; the words around
 * them are the CMS's (`src/cms/globals/delay-calculator.ts`).
 *
 * Pure, with no I/O, which is why it is the one piece of the site tested
 * directly rather than through the running page (spec: Testing Decisions):
 * `tests/unit/delay-cost.spec.ts`. The operations are written in Ahmed's
 * order, so a figure that lands on a half rounds the same way.
 */

export type DelayCostInputs = {
  /** The project's value, in Saudi riyals. */
  readonly projectValue: number;
  readonly delayDays: number;
  /** How much of the project is built today, from 0 to 100. */
  readonly progressPercent: number;
};

export type DelayCost = {
  /** What has been spent so far, in riyals: the value at today's progress. */
  readonly spent: number;
  readonly total: number;
};

/** What a slider allows, and where it starts. */
export type SliderRange = {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  /** Where the slider starts. */
  readonly start: number;
};

/** The calculator's three sliders, in the order they stand (ADR-0029). */
export const DELAY_COST_SLIDERS = {
  projectValue: { min: 1_000_000, max: 300_000_000, step: 1_000_000, start: 60_000_000 },
  delayDays: { min: 1, max: 60, step: 1, start: 7 },
  progressPercent: { min: 5, max: 100, step: 5, start: 50 },
} as const satisfies Record<keyof DelayCostInputs, SliderRange>;

const COST_OF_MONEY_PER_YEAR = 0.08;
const DAYS_IN_A_YEAR = 365;

export function delayCost({ projectValue, delayDays, progressPercent }: DelayCostInputs): DelayCost {
  const spent = (projectValue * progressPercent) / 100;
  return { spent, total: ((spent * COST_OF_MONEY_PER_YEAR) / DAYS_IN_A_YEAR) * delayDays };
}

/**
 * A number of riyals to the nearest riyal, in Latin digits with commas —
 * «46,027» — as the site writes them.
 */
export function formatRiyals(amount: number): string {
  return Math.round(amount).toLocaleString('en-US');
}
