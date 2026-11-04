/**
 * The delay-cost formula behind the Delay-cost calculator (ticket 103,
 * ADR-0029), tested directly — the one exception the spec makes to testing
 * through the running site: "A second, narrow seam is permitted only for pure
 * calculation with no I/O, currently the delay-cost formula, where a direct
 * unit test is cheaper and sharper than driving three sliders." That the
 * sliders reach it is asked in `tests/e2e/home-calculator.spec.ts`.
 *
 * It runs under Playwright like everything else, so CI needs nothing new, but
 * it opens no browser: no test here asks for a page.
 *
 * Ahmed's method, as his Company profile computes it (approved 31 October
 * 2026): the cost of money, at 8% a year, on what has been spent so far, for
 * the days handover slips.
 *
 *     spent = value × progress%
 *     cost  = spent × 8% ÷ 365 × days
 *
 * The first three cases are his acceptance cases, worked out by hand and
 * checked against his own smoke test, not read back out of the module.
 */
import { test, expect } from '@playwright/test';
import { delayCost, formatRiyals } from '../../src/lib/delay-cost';

test("Ahmed's acceptance cases: 30M at 100% for 7 days, 200M at 50% for 7 days, 300M at 100% for 60 days", () => {
  for (const [inputs, spent, total] of [
    // 30,000,000 × 0.08 ÷ 365 × 7
    [{ projectValue: 30_000_000, delayDays: 7, progressPercent: 100 }, '30,000,000', '46,027'],
    // 100,000,000 × 0.08 ÷ 365 × 7
    [{ projectValue: 200_000_000, delayDays: 7, progressPercent: 50 }, '100,000,000', '153,425'],
    // 300,000,000 × 0.08 ÷ 365 × 60
    [{ projectValue: 300_000_000, delayDays: 60, progressPercent: 100 }, '300,000,000', '3,945,205'],
  ] as const) {
    const cost = delayCost(inputs);
    expect([formatRiyals(cost.spent), formatRiyals(cost.total)], JSON.stringify(inputs)).toEqual([spent, total]);
  }
});

test('the figures the calculator opens on: 60,000,000 riyals, 7 days late, 50% built', () => {
  const cost = delayCost({ projectValue: 60_000_000, delayDays: 7, progressPercent: 50 });

  expect(cost.spent).toBe(30_000_000);
  expect(cost.total).toBeCloseTo(46_027.397, 3);
  expect(formatRiyals(cost.total)).toBe('46,027');
});

test('the smallest figures the sliders allow: 1,000,000 riyals, 1 day, 5% built', () => {
  const cost = delayCost({ projectValue: 1_000_000, delayDays: 1, progressPercent: 5 });

  // 50,000 × 0.08 ÷ 365
  expect(cost.spent).toBe(50_000);
  expect(cost.total).toBeCloseTo(10.959, 3);
  expect(formatRiyals(cost.total)).toBe('11');
});

test('the cost grows in step with the delay and with what has been spent', () => {
  const week = delayCost({ projectValue: 45_000_000, delayDays: 7, progressPercent: 40 });
  const fortnight = delayCost({ projectValue: 45_000_000, delayDays: 14, progressPercent: 40 });
  const twiceBuilt = delayCost({ projectValue: 45_000_000, delayDays: 7, progressPercent: 80 });

  expect(fortnight.total).toBeCloseTo(week.total * 2, 6);
  expect(twiceBuilt.spent).toBe(week.spent * 2);
  expect(twiceBuilt.total).toBeCloseTo(week.total * 2, 6);
});

test('amounts are written in Latin digits with thousands separated by commas', () => {
  expect(formatRiyals(1_234_567.5)).toBe('1,234,568');
  expect(formatRiyals(999.4)).toBe('999');
  expect(formatRiyals(0)).toBe('0');
});
