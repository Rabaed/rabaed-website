import { withEmphasis } from '@/cms/emphasis';
import { FAQ_PAGES } from '@/cms/faq-pages';
import { fetchedMedia } from '@/cms/fetched-media';
import { pageEntry, wordsIn } from '@/cms/pages';
import { getSearchSettings } from '@/content/search-settings';
import type { ClosingSectionContent } from '@/components/closing-section';
import type { ComparisonStep, Face, HomeBeforeAfterContent } from '@/components/home/before-after';
import type { HomeDelayCalculatorContent } from '@/components/home/delay-calculator';
import type { HomeFiguresContent, ProofFigure } from '@/components/home/figures';
import type { HomeFourUnitsContent, UnitTab } from '@/components/home/four-units';
import type { HomeHeroContent } from '@/components/home/hero';
import type { HomeRecordSectionContent, TransactionStep } from '@/components/home/record';
import type { HomeSituationsContent } from '@/components/home/situations';
import type { TrustStripContent } from '@/components/home/trust-strip';
import { numeralsInMono } from '@/components/inline-text';
import type { QuestionsContent } from '@/components/questions';
import { getClosingSection } from '@/content/closing-section';
import { getScreenMocks } from '@/content/screen-mocks';
import { getTrustStrip } from '@/content/trust-strip';
import type { FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import type { HomePage } from '@/payload-types';
import { withQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type HomePageContent = {
  readonly meta: PageMeta;
  readonly hero: HomeHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  readonly situations: Section<HomeSituationsContent>;
  readonly fourUnits: Section<HomeFourUnitsContent>;
  readonly record: Section<HomeRecordSectionContent>;
  readonly beforeAfter: Section<HomeBeforeAfterContent>;
  readonly calculator: Section<HomeDelayCalculatorContent>;
  readonly figures: Section<HomeFiguresContent>;
  readonly questions: Section<QuestionsContent>;
  /** Its demo request form (`#demo`) is where this page's hero and calculator buttons, and the header's, land. */
  readonly closing: LinkedSection<ClosingSectionContent>;
  /** The words of the closing section's demo request form: its settings in the CMS. */
  readonly demoForm: FormPageWording<DemoRequestField>;
};

/**
 * The page's short name, as its breadcrumb structured data reads it
 * (ticket 32). Its search title and description are an Editor's, in the CMS
 * (ticket 26, `src/content/search-settings.ts`).
 */
const NAME: Readonly<Record<Locale, string>> = { ar: 'الرئيسية', en: 'Home' };

/** A unit numbered by its place: «01». */
const numbered = (index: number) => String(index + 1).padStart(2, '0');

/**
 * A list the design holds at exactly four (spec: Content model), filled out to
 * four. The CMS publishes it only with four; a draft being previewed may have
 * fewer, and its missing places are drawn empty.
 */
function fillToFour<T>(items: readonly T[], empty: T): readonly [T, T, T, T] {
  const [first = empty, second = empty, third = empty, fourth = empty] = items;
  return [first, second, third, fourth];
}

const EMPTY_FACE: Face = { channel: '', words: '' };
const EMPTY_STEP: TransactionStep = { action: '', by: '', time: '' };

/**
 * The home page's content in `locale`: its words and pictures from its entry
 * in the CMS (ticket 58), its screens from the Screen mocks entry and its
 * closing section from the entry it shares with the product page — or a
 * refusal, where any of them is not published in `locale` — with its questions
 * and its form's words as the CMS has them.
 *
 * Where each button and link leads stays here, in code: an Editor changes what
 * a button says, never where it goes.
 */
export async function getHomePage(locale: Locale): Promise<HomePageContent> {
  const [entry, screenOf, closing, demoForm, trustStrip, meta] = await Promise.all([
    pageEntry('home-page', locale),
    getScreenMocks(locale),
    getClosingSection(locale),
    formPageWording(DEMO_REQUEST, locale),
    getTrustStrip(locale),
    getSearchSettings(locale, 'home', { name: NAME[locale] }),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);
  const { hero, situations, fourUnits, record, beforeAfter, calculator, figures, questions } = entry;

  const deck = ({ label, previousLabel, nextLabel, hint }: HomePage['situations']['deck']) => ({
    label: words(label),
    previousLabel: words(previousLabel),
    nextLabel: words(nextLabel),
    hint: words(hint),
  });
  /** Where a drawing an Editor put in place of the hero's own is, or `null` for today's. */
  const replacementDrawing = (value: NonNullable<HomePage['hero']['pictures']>['owner']) => fetchedMedia(value)?.url ?? null;
  const face = (side: HomePage['beforeAfter']['steps'][number]['usual']): Face => ({
    channel: words(side.channel),
    words: withEmphasis(words(side.words)),
  });

  const tabs = fourUnits.tabs.map(
    (tab, index): UnitTab => ({
      // A unit is numbered by its place among the units; what they produce
      // carries a name instead, so reordering renumbers them.
      tag: tab.final
        ? { kind: 'output', name: words(fourUnits.outputLabel) }
        : { kind: 'unit', number: numbered(fourUnits.tabs.slice(0, index).filter((each) => !each.final).length) },
      title: words(tab.title),
      screen: screenOf(tab.screen),
    }),
  );

  const page = await withQuestions<Omit<HomePageContent, 'demoForm'>>('home', locale, {
    meta,
    hero: {
      eyebrow: words(hero.eyebrow),
      title: { lines: hero.titleLines.map((each) => words(each.line)), accent: words(hero.titleAccent) },
      lead: words(hero.lead),
      // The first jumps to the demo request form at the foot of this page. The
      // second points at `#journey`, which no section on this page carries, so
      // it goes nowhere — as the Reference site's own anchors do on its
      // sub-pages.
      primary: { label: words(hero.primaryLabel), href: '#demo' },
      secondary: { label: words(hero.secondaryLabel), href: '#journey' },
      trust: words(hero.trust),
      // Only the numerals are `.mono`: DM Mono has no Arabic glyphs, so setting
      // «يوماً» in it drops the word to a last-resort monospace face (spec:
      // Design system). The Reference site wraps both.
      guarantee: { period: numeralsInMono(words(hero.guaranteePeriod)), promise: words(hero.guaranteePromise) },
      parties: {
        owner: words(hero.parties.owner),
        contractor: words(hero.parties.contractor),
        consultant: words(hero.parties.consultant),
      },
      diagramDescription: words(hero.diagramDescription),
      statuses: fillToFour(
        hero.statuses.map((each) => words(each.status)),
        '',
      ),
      statusAtRest: words(hero.statusAtRest),
      pictures: {
        owner: replacementDrawing(hero.pictures?.owner),
        contractor: replacementDrawing(hero.pictures?.contractor),
        consultant: replacementDrawing(hero.pictures?.consultant),
        document: replacementDrawing(hero.pictures?.document),
      },
    },
    // The Trust strip's marks are ticket 20's; the page chooses only whether it shows.
    trustStrip: { ...trustStrip, shows: entry.trustStrip?.shows !== false },
    situations: {
      shows: situations.shows !== false,
      eyebrow: words(situations.eyebrow),
      heading: words(situations.heading),
      close: {
        first: words(situations.close.first),
        second: words(situations.close.second),
        accent: words(situations.close.accent),
      },
      situations: situations.situations.map((situation) => ({ quote: words(situation.quote), cost: words(situation.cost) })),
      costLabel: words(situations.costLabel),
      deck: deck(situations.deck),
    },
    fourUnits: {
      shows: fourUnits.shows !== false,
      eyebrow: words(fourUnits.eyebrow),
      heading: words(fourUnits.heading),
      // Empty until an Editor writes the section's standalone answer, and
      // drawn only once one is written (ticket 35).
      lead: words(fourUnits.lead),
      tabsLabel: words(fourUnits.tabsLabel),
      tabs,
      more: { label: words(fourUnits.moreLabel), href: localePath(locale, '/product') },
    },
    record: {
      shows: record.shows !== false,
      eyebrow: words(record.eyebrow),
      heading: record.headingLines.map((each) => words(each.line)),
      questions: record.questions.map((each) => words(each.question)),
      lead: words(record.lead),
      types: record.types.map((type) => ({
        label: words(type.label),
        title: words(type.title),
        steps: fillToFour(
          type.steps.map((step) => ({ action: words(step.action), by: words(step.by), time: step.time })),
          EMPTY_STEP,
        ),
      })),
      stamp: words(record.stamp),
    },
    beforeAfter: {
      shows: beforeAfter.shows !== false,
      eyebrow: words(beforeAfter.eyebrow),
      heading: words(beforeAfter.heading),
      lead: withEmphasis(words(beforeAfter.lead)),
      usualTag: words(beforeAfter.usualTag),
      rabaedTag: words(beforeAfter.rabaedTag),
      handleLabel: words(beforeAfter.handleLabel),
      verdicts: {
        usual: words(beforeAfter.verdicts.usual),
        rabaed: words(beforeAfter.verdicts.rabaed),
        between: words(beforeAfter.verdicts.between),
      },
      steps: fillToFour(
        beforeAfter.steps.map((step): ComparisonStep => ({ name: words(step.name), usual: face(step.usual), rabaed: face(step.rabaed) })),
        { name: '', usual: EMPTY_FACE, rabaed: EMPTY_FACE },
      ),
    },
    calculator: {
      shows: calculator.shows !== false,
      eyebrow: words(calculator.eyebrow),
      heading: words(calculator.heading),
      lead: words(calculator.lead),
      sliderLabels: [
        words(calculator.sliderLabels.projectValue),
        words(calculator.sliderLabels.delayDays),
        words(calculator.sliderLabels.durationMonths),
      ],
      resultLabel: words(calculator.resultLabel),
      assumptions: words(calculator.assumptions),
      // To the demo request form at the foot of this page.
      callToAction: { label: words(calculator.callToActionLabel), href: '#demo' },
      words: {
        currency: words(calculator.currency),
        days: {
          one: words(calculator.days.one),
          two: words(calculator.days.two),
          few: words(calculator.days.few),
          many: words(calculator.days.many),
        },
        months: { few: words(calculator.months.few), many: words(calculator.months.many) },
        breakdown: { financing: words(calculator.breakdown.financing), siteOverhead: words(calculator.breakdown.siteOverhead) },
      },
    },
    figures: {
      shows: figures.shows !== false,
      eyebrow: words(figures.eyebrow),
      heading: words(figures.heading),
      lead: words(figures.lead),
      figures: figures.figures.map((figure): ProofFigure => {
        const frame = { topic: words(figure.topic), icon: figure.icon, claim: words(figure.claim), basis: words(figure.basis) };
        return figure.blockType === 'comparison'
          ? {
              ...frame,
              kind: 'comparison',
              value: figure.figure,
              before: { label: words(figure.before.label), height: figure.before.height },
              after: { label: words(figure.after.label), height: figure.after.height },
              source: figure.source?.trim() ?? '',
            }
          : { ...frame, kind: 'commitment', value: words(figure.value) };
      }),
      deck: deck(figures.deck),
    },
    questions: {
      shows: questions.shows !== false,
      eyebrow: words(questions.eyebrow),
      heading: words(questions.heading),
      // The rest of the questions, beside the form on the start page.
      more: {
        label: words(questions.moreLabel),
        href: `${localePath(locale, FAQ_PAGES.start.path)}#${FAQ_PAGES.start.sectionId}`,
      },
    },
    closing: { shows: true, ...closing },
  });
  return { ...page, demoForm };
}
