/**
 * The delay-cost formula behind the home page's calculator (ticket 10), tested
 * directly — the one exception the spec makes to testing through the running
 * site: "A second, narrow seam is permitted only for pure calculation with no
 * I/O, currently the delay-cost formula, where a direct unit test is cheaper
 * and sharper than driving three sliders." That the sliders reach it is asked
 * in `tests/e2e/home-calculator.spec.ts`.
 *
 * It runs under Playwright like everything else, so CI needs nothing new, but
 * it opens no browser: no test here asks for a page.
 *
 * Every expected figure below was worked out by hand from the Reference site's
 * script (`reference/site/index.html`, "Calculator (sliders)"), not read back
 * out of the module:
 *
 *     financing     = value × 8% ÷ 365 × days
 *     site overhead = value × 10% ÷ (months × 30.4) × days
 *     total         = financing + site overhead
 */
import { test, expect } from '@playwright/test';
import { delayCost, formatRiyals } from '../../src/lib/delay-cost';

test('the figures the calculator opens on: 30,000,000 riyals, 7 days late, 18 months long', () => {
  const cost = delayCost({ projectValue: 30_000_000, delayDays: 7, durationMonths: 18 });

  // 30,000,000 × 0.08 ÷ 365 × 7
  expect(cost.financing).toBeCloseTo(46_027.397, 3);
  // 30,000,000 × 0.10 ÷ 547.2 × 7
  expect(cost.siteOverhead).toBeCloseTo(38_377.193, 3);
  expect(formatRiyals(cost.financing)).toBe('46,027');
  expect(formatRiyals(cost.siteOverhead)).toBe('38,377');
  expect(formatRiyals(cost.total)).toBe('84,405');
});

test('the total is rounded once, not added up from two rounded parts', () => {
  // 46,027.397 + 38,377.193 is 84,404.590, which rounds to 84,405 — where
  // adding the two rounded parts would say 84,404, as the Reference site does not.
  const cost = delayCost({ projectValue: 30_000_000, delayDays: 7, durationMonths: 18 });
  expect(cost.total).toBeCloseTo(84_404.59, 2);
  expect(formatRiyals(cost.total)).toBe('84,405');
});

test('the smallest figures the sliders allow: 1,000,000 riyals, 1 day, 48 months', () => {
  const cost = delayCost({ projectValue: 1_000_000, delayDays: 1, durationMonths: 48 });

  // 80,000 ÷ 365, and 100,000 ÷ 1,459.2
  expect(cost.financing).toBeCloseTo(219.178, 3);
  expect(cost.siteOverhead).toBeCloseTo(68.531, 3);
  expect([formatRiyals(cost.financing), formatRiyals(cost.siteOverhead), formatRiyals(cost.total)]).toEqual(['219', '69', '288']);
});

test('the largest figures the sliders allow: 300,000,000 riyals, 60 days, 6 months', () => {
  const cost = delayCost({ projectValue: 300_000_000, delayDays: 60, durationMonths: 6 });

  // 24,000,000 ÷ 365 × 60, and 30,000,000 ÷ 182.4 × 60
  expect(cost.financing).toBeCloseTo(3_945_205.479, 3);
  expect(cost.siteOverhead).toBeCloseTo(9_868_421.053, 3);
  expect([formatRiyals(cost.financing), formatRiyals(cost.siteOverhead), formatRiyals(cost.total)]).toEqual([
    '3,945,205',
    '9,868,421',
    '13,813,627',
  ]);
});

test('every part grows in step with the delay', () => {
  const week = delayCost({ projectValue: 45_000_000, delayDays: 7, durationMonths: 20 });
  const fortnight = delayCost({ projectValue: 45_000_000, delayDays: 14, durationMonths: 20 });

  expect(fortnight.financing).toBeCloseTo(week.financing * 2, 6);
  expect(fortnight.siteOverhead).toBeCloseTo(week.siteOverhead * 2, 6);
  expect(fortnight.total).toBeCloseTo(week.total * 2, 6);
});

test('a longer project spreads its site overhead thinner, and leaves financing alone', () => {
  const short = delayCost({ projectValue: 45_000_000, delayDays: 7, durationMonths: 6 });
  const long = delayCost({ projectValue: 45_000_000, delayDays: 7, durationMonths: 48 });

  expect(long.financing).toBe(short.financing);
  // Spread over 48 months rather than 6 — eight times as long — each day of
  // delay carries an eighth of the overhead.
  expect(short.siteOverhead).toBeCloseTo(long.siteOverhead * 8, 6);
});

test('amounts are written in Latin digits with thousands separated by commas', () => {
  expect(formatRiyals(1_234_567.5)).toBe('1,234,568');
  expect(formatRiyals(999.4)).toBe('999');
  expect(formatRiyals(0)).toBe('0');
});
