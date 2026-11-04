/**
 * The Delay-cost calculator's words as Ahmed wrote them for his Company
 * profile (approved by him on 31 October 2026; `.scratch/company-profile/source/`,
 * `cost` in each language), and the founder chose for every page that shows
 * the calculator on 4 November 2026 (ADR-0029).
 *
 * **Frozen.** This is what the migration wrote on the day it ran, and the site
 * does not read it: it reads the CMS, where an Editor may have changed any of
 * it since. A word here is changed only to correct what this migration wrote,
 * never to change what the site says.
 *
 * Two kinds of word are not Ahmed's. The words after a number of days are the
 * home page's, which already follow Arabic's rule for one, two, three to ten
 * and eleven on (ticket 58): Ahmed's own count words say «يوم واحد» for one,
 * with no number. And his «{amount}» is where the site writes what has been
 * spent, as he wrote it.
 */
export const DELAY_CALCULATOR_WORDS = {
  eyebrow: { ar: 'التكلفة الخفية', en: 'The hidden cost' },
  heading: { ar: 'كم يكلّفك أسبوع تأخير اعتماد واحد؟', en: "What does a week's delay on one approval cost you?" },
  lead: {
    ar: 'ما صرفته على المشروع لا يعود إليك إلا عند التسليم. وكل أسبوع تأخير يؤخّره أسبوعاً.',
    en: "What you've spent on the project only comes back to you at handover, and every week of delay pushes that back a week.",
  },
  sliderLabels: {
    projectValue: { ar: 'قيمة المشروع', en: 'Project value' },
    delayDays: { ar: 'أيام التأخير', en: 'Days of delay' },
    progress: { ar: 'نسبة الإنجاز اليوم', en: 'Progress to date' },
  },
  resultLabel: { ar: 'التكلفة التقديرية للتأخير', en: 'Estimated cost of the delay' },
  spent: { ar: 'على {amount} ر.س مصروفة حتى الآن', en: 'on {amount} SAR spent so far' },
  assumptions: {
    ar: 'الافتراضات: تكلفة المال 8% سنوياً، تمويلاً كانت أو عائداً بديلاً، على ما صُرف حتى الآن، إذا أخّر الاعتماد التسليم بالمدة نفسها. لا تشمل الإيراد المتأخر ولا أتعاب الإشراف ولا مطالبات المقاول ولا الغرامات.',
    en: 'Assumptions: cost of money at 8% a year, whether financing or a forgone return, on what has been spent so far, if the approval delays handover by the same period. Excludes delayed revenue, supervision fees, contractor claims and penalties.',
  },
  callToActionLabel: { ar: 'احجز عرضاً لترى كيف نمنعه', en: 'Book a demo to see how we prevent it' },
  currency: { ar: 'ر.س', en: 'SAR' },
  days: {
    one: { ar: 'يوم', en: 'day' },
    two: { ar: 'يومان', en: 'days' },
    few: { ar: 'أيام', en: 'days' },
    many: { ar: 'يوماً', en: 'days' },
  },
} as const;
