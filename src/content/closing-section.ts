import { pageEntry, wordsIn } from '@/cms/pages';
import type { ClosingSectionContent } from '@/components/closing-section';
import { localePath, type Locale } from '@/lib/locales';

/**
 * «كيف نبدأ معك», the block the home and product pages both end on, in
 * `locale`: its one entry in the CMS (ticket 57), so the two pages cannot drift
 * apart — or a refusal, where it is not published in `locale`.
 *
 * A step is numbered by its place, so reordering renumbers it; the link on
 * leads to the start page, which stays in code.
 */
export async function getClosingSection(locale: Locale): Promise<ClosingSectionContent> {
  const { closing } = await pageEntry('closing-section', locale);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return {
    eyebrow: words(closing.eyebrow),
    heading: words(closing.heading),
    steps: closing.steps.map((step, index) => ({
      label: `${String(index + 1).padStart(2, '0')} · ${words(step.label)}`,
      text: words(step.text),
    })),
    more: { label: words(closing.moreLabel), href: localePath(locale, '/start') },
  };
}
