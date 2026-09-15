import { withLatinNames } from '@/cms/latin-names';
import { pageEntry, wordsIn } from '@/cms/pages';
import type { InlinePart, InlineText } from '@/components/inline-text';
import type { QuestionsContent } from '@/components/questions';
import type { ToolDownloadContent } from '@/components/tool/download';
import type { ToolFeaturesContent } from '@/components/tool/features';
import type { ToolHeroContent } from '@/components/tool/hero';
import type { ToolHowContent } from '@/components/tool/how';
import type { ToolPrivacyContent } from '@/components/tool/privacy';
import type { ToolRequirementsContent } from '@/components/tool/requirements';
import type { ToolUpsellContent } from '@/components/tool/upsell';
import type { ToolWhyContent } from '@/components/tool/why';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type ToolPageContent = {
  readonly meta: PageMeta;
  readonly hero: ToolHeroContent;
  readonly why: Section<ToolWhyContent>;
  readonly features: Section<ToolFeaturesContent>;
  /** The hero's «كيف تعمل؟ ↓» lands here. */
  readonly how: LinkedSection<ToolHowContent>;
  readonly privacy: Section<ToolPrivacyContent>;
  readonly requirements: Section<ToolRequirementsContent>;
  /** The hero's «حمّل الأداة مجاناً» lands here. */
  readonly download: LinkedSection<ToolDownloadContent>;
  readonly questions: Section<QuestionsContent>;
  readonly upsell: Section<ToolUpsellContent>;
};

/**
 * The page's search title and description, which ticket 26 moves into the CMS,
 * and the short name its breadcrumb structured data reads (ticket 32), which
 * travels with them. Verbatim from `reference/site/tool.html`.
 */
const META = {
  ar: {
    name: 'متتبّع الصبّات',
    title: 'ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية',
    description:
      'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.',
  },
} as const;

/** A test's states, in the order the legend lists them. */
const LEGEND = ['idle', 'warn', 'bad', 'info', 'ok'] as const;

/** A card or step numbered by its place, so reordering renumbers it: «01». */
const numbered = (index: number) => String(index + 1).padStart(2, '0');

/** A bold opening, then the rest of its line after a space. */
function boldThen(bold: string, rest: InlineText): InlinePart[] {
  const [first, ...others] = typeof rest === 'string' ? [rest] : rest;
  if (first === undefined) return [{ strong: bold }];
  return typeof first === 'string' ? [{ strong: bold }, ` ${first}`, ...others] : [{ strong: bold }, ' ', first, ...others];
}

/**
 * The tool page's content in `locale`: its words from its entry in the CMS
 * (ticket 54) — or a refusal, where the page is not published in `locale` —
 * with its questions as the CMS has them.
 *
 * Where each button leads stays here, in code: an Editor changes what a button
 * says, never where it goes.
 */
export async function getToolPage(locale: Locale): Promise<ToolPageContent> {
  const { hero, why, features, how, privacy, requirements, download, questions, upsell } = await pageEntry('tool-page', locale);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  const page: BeforeQuestions<ToolPageContent> = {
    meta: inLocale('tool', META, locale),
    hero: {
      eyebrow: words(hero.eyebrow),
      // With the space before its last words, which are drawn apart.
      title: `${words(hero.title)} `,
      titleAccent: words(hero.titleAccent),
      lead: words(hero.lead),
      // Both land further down this page: the form, and the steps.
      primary: { label: words(hero.primaryLabel), href: '#get' },
      secondary: { label: words(hero.secondaryLabel), href: '#how' },
      promises: hero.promises.map((promise) => words(promise.text)),
      mock: {
        project: words(hero.mock.project),
        tiles: hero.mock.tiles.map((tile) => ({
          figure: tile.figure,
          label: words(tile.label),
          ...(tile.tone === 'plain' ? {} : { tone: tile.tone }),
        })),
        pours: hero.mock.pours.map((pour) => ({
          reference: pour.reference,
          name: words(pour.name),
          tests: pour.tests.map((each) => ({ label: words(each.label), state: { tone: each.tone, label: words(each.state) } })),
        })),
      },
    },
    why: {
      shows: why.shows !== false,
      eyebrow: words(why.eyebrow),
      heading: words(why.heading),
      lead: words(why.lead),
      cards: why.cards.map((card, index) => ({ label: numbered(index), title: words(card.title), text: words(card.text) })),
    },
    features: {
      shows: features.shows !== false,
      eyebrow: words(features.eyebrow),
      heading: words(features.heading),
      lead: words(features.lead),
      countdown: {
        label: numbered(0),
        title: words(features.countdown.title),
        text: words(features.countdown.text),
        states: LEGEND.map((tone) => ({ tone, label: words(features.countdown.legend[tone]) })),
      },
      // Numbered after the countdown.
      cards: features.cards.map((card, index) => ({ label: numbered(index + 1), title: words(card.title), text: words(card.text) })),
      also: features.also.map((line) => words(line.text)),
    },
    how: {
      shows: true,
      eyebrow: words(how.eyebrow),
      heading: words(how.heading),
      lead: words(how.lead),
      steps: how.steps.map((step, index) => ({
        number: numbered(index),
        label: words(step.label),
        title: words(step.title),
        text: words(step.text),
        markedOut: step.markedOut === true,
      })),
    },
    privacy: {
      shows: privacy.shows !== false,
      eyebrow: words(privacy.eyebrow),
      heading: words(privacy.heading),
      points: privacy.points.map((point) => boldThen(words(point.bold), withLatinNames(words(point.text)))),
      tree: {
        project: words(privacy.tree.project),
        entries: privacy.tree.entries.map((file) => {
          const description = words(file.description);
          return { name: file.name, nested: file.nested === true, ...(description === '' ? {} : { description }) };
        }),
        caption: words(privacy.tree.caption),
      },
    },
    requirements: {
      shows: requirements.shows !== false,
      eyebrow: words(requirements.eyebrow),
      heading: words(requirements.heading),
      cards: requirements.cards.map((card) => ({ label: words(card.label), title: words(card.title), text: words(card.text) })),
    },
    download: {
      shows: true,
      eyebrow: words(download.eyebrow),
      heading: words(download.heading),
      lead: words(download.lead),
      ticks: download.ticks.map((line) => words(line.text)),
      promise: boldThen(words(download.promise.bold), words(download.promise.text)),
    },
    questions: {
      shows: questions.shows !== false,
      eyebrow: words(questions.eyebrow),
      heading: words(questions.heading),
    },
    upsell: {
      shows: upsell.shows !== false,
      eyebrow: words(upsell.eyebrow),
      heading: words(upsell.heading),
      lead: words(upsell.lead),
      primary: { label: words(upsell.primaryLabel), href: localePath(locale, '/start') },
      secondary: { label: words(upsell.secondaryLabel), href: localePath(locale, '/product') },
      adds: upsell.adds.map((line) => words(line.text)),
      signOff: words(upsell.signOff),
    },
  };

  return withQuestions('tool', locale, page);
}
