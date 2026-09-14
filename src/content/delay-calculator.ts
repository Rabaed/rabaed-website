/**
 * The words the home page's delay-cost calculator writes around its numbers,
 * verbatim from `reference/site/index.html`.
 *
 * What its three sliders allow is in
 * `src/components/home/delay-calculator-state.ts`, and the formula in
 * `src/lib/delay-cost.ts`.
 *
 * Ticket 21 moves page copy into the CMS.
 */
import type { CalculatorWords } from '@/components/home/delay-calculator-state';

export const CALCULATOR_WORDS: CalculatorWords = {
  currency: 'ر.س',
  // «أيام» up to ten, «يوماً» beyond, as the Reference site has it. Arabic
  // would say «يوم» for one and «يومان» for two; the Reference site does not,
  // and the founders' copy is not reworded here.
  days: { few: 'أيام', fewUpTo: 10, many: 'يوماً' },
  // Whatever the number, as the Reference site has it.
  months: 'شهراً',
  breakdown: 'تمويل {financing} + تكاليف عامة للموقع {siteOverhead}',
};
