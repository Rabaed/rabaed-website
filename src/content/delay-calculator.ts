import { pageEntry, wordsIn } from '@/cms/pages';
import type { DelayCalculatorContent } from '@/components/home/delay-calculator';
import type { Locale } from '@/lib/locales';

/**
 * The Delay-cost calculator in `locale` (ticket 103, ADR-0029): its words from
 * the one entry every page that shows it reads, so the home page and the
 * Company profile cannot disagree — or a refusal, where it is not published in
 * `locale`. Each page keeps its own switch for whether it shows, and says
 * where its button leads (`demoForm`), which stays in code.
 */
export async function getDelayCalculator(locale: Locale, demoForm: string): Promise<DelayCalculatorContent> {
  const { calculator } = await pageEntry('delay-calculator', locale);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return {
    eyebrow: words(calculator.eyebrow),
    heading: words(calculator.heading),
    lead: words(calculator.lead),
    sliderLabels: [
      words(calculator.sliderLabels.projectValue),
      words(calculator.sliderLabels.delayDays),
      words(calculator.sliderLabels.progress),
    ],
    resultLabel: words(calculator.resultLabel),
    assumptions: words(calculator.assumptions),
    callToAction: { label: words(calculator.callToActionLabel), href: demoForm },
    words: {
      currency: words(calculator.currency),
      days: {
        one: words(calculator.days.one),
        two: words(calculator.days.two),
        few: words(calculator.days.few),
        many: words(calculator.days.many),
      },
      spent: words(calculator.spent),
    },
  };
}
