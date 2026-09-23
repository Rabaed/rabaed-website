import { pageEntry, wordsIn } from '@/cms/pages';
import { getSearchSettings } from '@/content/search-settings';
import { numeralsInMono } from '@/components/inline-text';
import type { PageHeroContent } from '@/components/page-hero';
import type { PartnershipApplyContent } from '@/components/partnership/apply';
import type { PartnershipAudienceContent } from '@/components/partnership/audience';
import type { PartnershipBenefitsContent } from '@/components/partnership/benefits';
import type { PartnershipIdeaContent } from '@/components/partnership/idea';
import type { PartnershipModesContent } from '@/components/partnership/modes';
import type { PartnershipPathContent } from '@/components/partnership/path';
import type { QuestionsContent } from '@/components/questions';
import type { FormPageWording } from '@/forms/definition';
import { PARTNERSHIP_APPLICATION, type PartnershipApplicationField } from '@/forms/partnership-application';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import { withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type PartnershipPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly idea: Section<PartnershipIdeaContent>;
  readonly audience: Section<PartnershipAudienceContent>;
  readonly modes: Section<PartnershipModesContent>;
  readonly benefits: Section<PartnershipBenefitsContent>;
  /** The hero's «كيف نبني الشراكة ↓» lands here. */
  readonly path: LinkedSection<PartnershipPathContent>;
  readonly questions: Section<QuestionsContent>;
  /** The hero's «اطلب اجتماع شراكة» and the path's link both land here. */
  readonly apply: LinkedSection<PartnershipApplyContent>;
  /** The words of the application form: its settings in the CMS. */
  readonly applicationForm: FormPageWording<PartnershipApplicationField>;
};

/**
 * The page's short name, as its breadcrumb structured data reads it
 * (ticket 32). Its search title and description are an Editor's, in the CMS
 * (ticket 26, `src/content/search-settings.ts`).
 */
const NAME: Readonly<Record<Locale, string>> = { ar: 'برنامج الشراكات', en: 'Partnership Program' };

/** A card or stage numbered by its place, so reordering renumbers it: «01». */
const numbered = (index: number) => String(index + 1).padStart(2, '0');

/**
 * The partnership page's content in `locale`: its words from its entry in the
 * CMS (ticket 55) — or a refusal, where the page is not published in `locale` —
 * with its questions as the CMS has them, and the application form's own
 * settings beside them (ticket 29).
 *
 * Where each link leads stays here, in code: an Editor changes what a link
 * says, never where it goes.
 */
export async function getPartnershipPage(locale: Locale): Promise<PartnershipPageContent> {
  const [entry, applicationForm, meta] = await Promise.all([
    pageEntry('partnership-page', locale),
    formPageWording(PARTNERSHIP_APPLICATION, locale),
    getSearchSettings(locale, 'partnership', { name: NAME[locale] }),
  ]);
  const { hero, idea, audience, modes, benefits, path, questions, apply } = entry;
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  const page: BeforeQuestions<Omit<PartnershipPageContent, 'applicationForm'>> = {
    meta,
    hero: {
      eyebrow: words(hero.eyebrow),
      title: words(hero.title),
      lead: words(hero.lead),
      // Both land further down this page: the application form, and the path.
      primary: { label: words(hero.primaryLabel), href: '#apply' },
      secondary: { label: words(hero.secondaryLabel), href: '#path' },
      figures: hero.figures.map((figure) => ({ figure: numeralsInMono(words(figure.figure)), label: words(figure.label) })),
    },
    idea: {
      shows: idea.shows !== false,
      eyebrow: words(idea.eyebrow),
      heading: words(idea.heading),
      paragraphs: idea.paragraphs.map((paragraph) => words(paragraph.text)),
      referralNote: {
        // With the space before the link that follows it.
        text: `${words(idea.referralNote.text)} `,
        link: { label: words(idea.referralNote.linkLabel), href: localePath(locale, '/referral') },
      },
    },
    audience: {
      shows: audience.shows !== false,
      eyebrow: words(audience.eyebrow),
      heading: words(audience.heading),
      kinds: audience.kinds.map((kind) => ({ title: words(kind.title), text: words(kind.text) })),
    },
    modes: {
      shows: modes.shows !== false,
      eyebrow: words(modes.eyebrow),
      heading: words(modes.heading),
      modes: modes.modes.map((mode, index) => ({
        number: numbered(index),
        label: words(mode.label),
        title: words(mode.title),
        text: words(mode.text),
        markedOut: false,
        fit: words(mode.fit),
      })),
      // Each run of text one string, so the bold lands where the Reference
      // site's does.
      note: [`${words(modes.note.before)} `, { strong: words(modes.note.bold) }, ` ${words(modes.note.after)}`],
    },
    benefits: {
      shows: benefits.shows !== false,
      eyebrow: words(benefits.eyebrow),
      heading: words(benefits.heading),
      benefits: benefits.benefits.map((benefit) => ({ lead: words(benefit.bold), rest: words(benefit.text) })),
    },
    path: {
      shows: true,
      eyebrow: words(path.eyebrow),
      heading: words(path.heading),
      lead: words(path.lead),
      link: { label: words(path.linkLabel), href: '#apply' },
      stageLabel: words(path.stageLabel),
      stages: path.stages.map((stage, index) => ({ number: numbered(index), title: words(stage.title), text: words(stage.text) })),
    },
    questions: {
      shows: questions.shows !== false,
      eyebrow: words(questions.eyebrow),
      heading: words(questions.heading),
    },
    apply: {
      shows: true,
      eyebrow: words(apply.eyebrow),
      heading: words(apply.heading),
      lead: words(apply.lead),
      reassurances: apply.reassurances.map((line) => words(line.text)),
      responseTime: { figure: words(apply.responseTime.bold), label: words(apply.responseTime.text) },
    },
  };

  return { ...(await withQuestions('partnership', locale, page)), applicationForm };
}
