import { FAQ_PAGES } from '@/cms/faq-pages';
import { pageEntry, wordsIn } from '@/cms/pages';
import { getSearchSettings } from '@/content/search-settings';
import type { TrustStripContent } from '@/components/home/trust-strip';
import type { PageHeroContent } from '@/components/page-hero';
import type { QuestionsContent } from '@/components/questions';
import type { StartFreeToolTeaserContent } from '@/components/start/free-tool-teaser';
import type { StartStepsContent } from '@/components/start/steps';
import { getTrustStrip } from '@/content/trust-strip';
import type { FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import { withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type StartPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  readonly steps: Section<StartStepsContent>;
  /** The home page's «كل الأسئلة» and this page's hero both land here, and the demo request form stands in it. */
  readonly questions: LinkedSection<QuestionsContent>;
  /** Under the questions and the form. */
  readonly freeTool: Section<StartFreeToolTeaserContent>;
  /** The words of the demo request form beside the questions: its settings in the CMS. */
  readonly demoForm: FormPageWording<DemoRequestField>;
};

/**
 * The page's short name, as its breadcrumb structured data reads it
 * (ticket 32). Its search title and description are an Editor's, in the CMS
 * (ticket 26, `src/content/search-settings.ts`).
 */
const NAME = 'ابدأ';

/**
 * The start page's content in `locale`: its words from its entry in the CMS
 * (ticket 53) — or a refusal, where the page is not published in `locale` —
 * with its questions and its form's words as the CMS has them.
 *
 * Where each button and link leads stays here, in code: an Editor changes what
 * a button says, never where it goes.
 */
export async function getStartPage(locale: Locale): Promise<StartPageContent> {
  const [entry, demoForm, trustStrip, meta] = await Promise.all([
    pageEntry('start-page', locale),
    formPageWording(DEMO_REQUEST),
    getTrustStrip(locale),
    getSearchSettings(locale, 'start', { name: NAME }),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  const page: BeforeQuestions<Omit<StartPageContent, 'demoForm'>> = {
    meta,
    hero: {
      eyebrow: words(entry.hero.eyebrow),
      title: words(entry.hero.title),
      lead: words(entry.hero.lead),
      // Both land further down this page: the form, and the questions.
      primary: { label: words(entry.hero.primaryLabel), href: '#demo' },
      secondary: { label: words(entry.hero.secondaryLabel), href: `#${FAQ_PAGES.start.sectionId}` },
    },
    trustStrip: { ...trustStrip, shows: entry.trustStrip?.shows !== false },
    steps: {
      shows: entry.steps.shows !== false,
      eyebrow: words(entry.steps.eyebrow),
      heading: words(entry.steps.heading),
      // A step is numbered by its place, so reordering renumbers it.
      steps: entry.steps.steps.map((step, index) => ({
        number: String(index + 1).padStart(2, '0'),
        label: words(step.label),
        title: words(step.title),
        text: words(step.text),
        markedOut: step.markedOut === true,
      })),
    },
    questions: {
      shows: true,
      eyebrow: words(entry.questions.eyebrow),
      heading: words(entry.questions.heading),
    },
    freeTool: {
      shows: entry.freeTool.shows !== false,
      eyebrow: words(entry.freeTool.eyebrow),
      heading: words(entry.freeTool.heading),
      text: words(entry.freeTool.text),
      link: { label: words(entry.freeTool.linkLabel), href: localePath(locale, '/tool') },
    },
  };

  const withEntries = await withQuestions<Omit<StartPageContent, 'demoForm'>>('start', locale, page);
  return { ...withEntries, demoForm };
}
