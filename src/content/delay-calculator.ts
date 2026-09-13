/**
 * The home page's delay-cost calculator: its copy, and what its three sliders
 * allow. All verbatim from `reference/site/index.html`, words and ranges alike.
 *
 * The formula is in `src/lib/delay-cost.ts`.
 *
 * Ticket 21 moves page copy into the CMS.
 */

export type SliderRange = {
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  /** Where the slider starts. */
  readonly start: number;
};

export const CALCULATOR_COPY = {
  eyebrow: 'حاسبة تكلفة التأخير',
  heading: 'كم يكلفك أسبوع تأخير اعتماد واحد؟',
  lead: 'تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط — قبل أي مطالبة من المقاول.',
  resultLabel: 'التكلفة التقديرية للتأخير',
  assumptions:
    'الافتراضات: تكلفة تمويل 8% سنوياً · تكاليف عامة للموقع 10% من قيمة المشروع موزعة على مدته. لا تشمل مطالبات المقاول ولا الغرامات.',
  callToAction: 'احجز عرضاً لترى كيف نمنعه',
} as const;

export const PROJECT_VALUE: SliderRange = { label: 'قيمة المشروع', min: 1_000_000, max: 300_000_000, step: 1_000_000, start: 30_000_000 };
export const DELAY_DAYS: SliderRange = { label: 'أيام التأخير', min: 1, max: 60, step: 1, start: 7 };
export const DURATION_MONTHS: SliderRange = { label: 'مدة المشروع', min: 6, max: 48, step: 1, start: 18 };

/** The currency, after an amount. */
export const RIYALS = 'ر.س';

/**
 * The word after a number of days: «أيام» up to ten, «يوماً» beyond, as the
 * Reference site has it. Arabic would say «يوم» for one and «يومان» for two;
 * the Reference site does not, and the founders' copy is not reworded here.
 */
export function daysWord(days: number): string {
  return days <= 10 ? 'أيام' : 'يوماً';
}

/** The word after a number of months, whatever the number, as the Reference site has it. */
export const MONTHS_WORD = 'شهراً';

/** The line under the cost that splits it in two. */
export function breakdownLine(financing: string, siteOverhead: string): string {
  return `تمويل ${financing} + تكاليف عامة للموقع ${siteOverhead}`;
}
