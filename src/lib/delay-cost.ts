/**
 * What a delay costs a construction project — the formula behind the home
 * page's calculator, exactly as the Reference site's script computes it
 * (`reference/site/index.html`, "Calculator (sliders)"), and deliberately
 * conservative: it counts financing and site overhead only, before any claim
 * from the contractor or any penalty.
 *
 * - **Financing**: the project's value at 8% a year, for the days of delay.
 * - **Site overhead**: 10% of the project's value, spread evenly across its
 *   duration at 30.4 days a month, for the days of delay.
 *
 * Pure, with no I/O, which is why it is the one piece of the site tested
 * directly rather than through the running page (spec: Testing Decisions):
 * `tests/unit/delay-cost.spec.ts`. The operations are written in the Reference
 * site's order, so a figure that lands on a half rounds the same way.
 */

export type DelayCostInputs = {
  /** The project's value, in Saudi riyals. */
  readonly projectValue: number;
  readonly delayDays: number;
  readonly durationMonths: number;
};

export type DelayCost = {
  readonly financing: number;
  readonly siteOverhead: number;
  readonly total: number;
};

const FINANCING_PER_YEAR = 0.08;
const SITE_OVERHEAD_SHARE = 0.1;
const DAYS_IN_A_YEAR = 365;
const DAYS_IN_A_MONTH = 30.4;

export function delayCost({ projectValue, delayDays, durationMonths }: DelayCostInputs): DelayCost {
  const financing = ((projectValue * FINANCING_PER_YEAR) / DAYS_IN_A_YEAR) * delayDays;
  const siteOverhead = ((projectValue * SITE_OVERHEAD_SHARE) / (durationMonths * DAYS_IN_A_MONTH)) * delayDays;
  return { financing, siteOverhead, total: financing + siteOverhead };
}

/**
 * A number of riyals to the nearest riyal, in Latin digits with commas —
 * «84,405» — as the Reference site writes them. The total is rounded on its
 * own, not added up from its rounded parts.
 */
export function formatRiyals(amount: number): string {
  return Math.round(amount).toLocaleString('en-US');
}
