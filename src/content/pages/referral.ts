import { pageEntry, wordsIn } from '@/cms/pages';
import { getSearchSettings } from '@/content/search-settings';
import { referralProgramValues } from '@/cms/referral-program';
import { withValues, type ReferralProgramValues } from '@/cms/referral-program-values';
import { numeralsInMono, type InlinePart, type InlineText } from '@/components/inline-text';
import type { PageHeroContent } from '@/components/page-hero';
import type { QuestionsContent } from '@/components/questions';
import type { ReferralAudienceContent } from '@/components/referral/audience';
import type { ReferralHowItWorksContent } from '@/components/referral/how-it-works';
import type { ReferralOfferContent } from '@/components/referral/offer';
import type { ReferralSignupContent } from '@/components/referral/signup';
import type { ReferralTermsSummaryContent } from '@/components/referral/terms-summary';
import type { ReferralWhatIsReferredContent } from '@/components/referral/what-is-referred';
import type { FormPageWording } from '@/forms/definition';
import { REFERRAL_SIGNUP, type ReferralSignupField } from '@/forms/referral-signup';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type ReferralPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  /** The hero's «كيف يعمل البرنامج ↓» lands here. */
  readonly howItWorks: LinkedSection<ReferralHowItWorksContent>;
  readonly offer: Section<ReferralOfferContent>;
  readonly audience: Section<ReferralAudienceContent>;
  readonly whatIsReferred: Section<ReferralWhatIsReferredContent>;
  readonly termsSummary: Section<ReferralTermsSummaryContent>;
  readonly questions: Section<QuestionsContent>;
  /** The hero's «سجّل واحصل على كودك» lands here. */
  readonly signup: LinkedSection<ReferralSignupContent>;
  /** The words of the signup form: its settings in the CMS. */
  readonly signupForm: FormPageWording<ReferralSignupField>;
};

/**
 * The page's short name, as its breadcrumb structured data reads it
 * (ticket 32). Its search title and description are an Editor's, in the CMS,
 * and each may quote a Referral Program value by name — `{payout}` — which is
 * inserted here as it is in the page's own words (tickets 26 and 56).
 */
const NAME = 'برنامج الإحالة';

/** A step or kind numbered by its place, so reordering renumbers it: «01». */
const numbered = (index: number) => String(index + 1).padStart(2, '0');

/** A sentence with a bold phrase in it, if it has one: a space either side of the bold. */
function sentence(text: string, bold: string, after: string): InlineText {
  if (bold === '') return after === '' ? text : `${text} ${after}`;
  const parts: InlinePart[] = [`${text} `, { strong: bold }];
  return after === '' ? parts : [...parts, ` ${after}`];
}

/**
 * A run of text with a space at its end, inside its last piece of text: split
 * into two, the server marks the join with a comment, the browser lays out two
 * runs, and what follows lands a hundredth of a pixel off the Reference site's.
 */
function withSpaceAfter(text: InlineText): InlineText {
  if (typeof text === 'string') return `${text} `;
  const last = text.at(-1);
  return typeof last === 'string' ? [...text.slice(0, -1), `${last} `] : [...text, ' '];
}

/** The rest of a term after its bold opening: after a space, unless it opens with a comma or a stop. */
const restOfPoint = (rest: string) => (rest === '' || /^[،,.؛:]/.test(rest) ? rest : ` ${rest}`);

/**
 * The referral page's content in `locale`: its words from its entry in the CMS
 * (ticket 56) — or a refusal, where the page is not published in `locale` —
 * with every Referral Program value it names inserted, and its questions as
 * the CMS has them.
 *
 * Where each button and link leads stays here, in code: an Editor changes what
 * a button says, never where it goes.
 */
export async function getReferralPage(locale: Locale): Promise<ReferralPageContent> {
  const [entry, values, signupForm] = await Promise.all([
    pageEntry('referral-page', locale),
    referralProgramValues(),
    formPageWording(REFERRAL_SIGNUP),
  ]);
  const meta = await getSearchSettings(locale, 'referral', { name: NAME, values });
  const { hero, howItWorks, offer, audience, whatIsReferred, termsSummary, questions, signup } = entry;
  const words = (stored: Parameters<typeof wordsIn>[1]) => withValues(wordsIn(locale, stored), values);

  const page: BeforeQuestions<Omit<ReferralPageContent, 'signupForm'>> = {
    meta,
    hero: {
      eyebrow: words(hero.eyebrow),
      title: words(hero.title),
      lead: words(hero.lead),
      // Both land further down this page.
      primary: { label: words(hero.primaryLabel), href: '#signup' },
      secondary: { label: words(hero.secondaryLabel), href: '#how' },
      figures: hero.figures.map((figure) => ({ figure: numeralsInMono(words(figure.figure)), label: words(figure.label) })),
    },
    howItWorks: {
      shows: true,
      eyebrow: words(howItWorks.eyebrow),
      heading: words(howItWorks.heading),
      steps: howItWorks.steps.map((step, index) => ({
        number: numbered(index),
        label: words(step.label),
        title: words(step.title),
        text: words(step.text),
        markedOut: step.markedOut === true,
      })),
    },
    offer: {
      shows: offer.shows !== false,
      eyebrow: words(offer.eyebrow),
      heading: words(offer.heading),
      paragraphs: offer.paragraphs.map((paragraph) => sentence(words(paragraph.text), words(paragraph.bold), words(paragraph.after))),
      sides: offer.sides.map((side) => ({ badge: words(side.badge), title: words(side.title), text: words(side.text) })),
    },
    audience: {
      shows: audience.shows !== false,
      eyebrow: words(audience.eyebrow),
      heading: words(audience.heading),
      lead: words(audience.lead),
      kinds: audience.kinds.map((kind) => ({ title: words(kind.title), text: words(kind.text) })),
      partnership: {
        // The link follows the note on its line.
        text: withSpaceAfter(sentence(words(audience.partnership.text), words(audience.partnership.bold), words(audience.partnership.after))),
        link: { label: words(audience.partnership.linkLabel), href: localePath(locale, '/partnership') },
      },
    },
    whatIsReferred: {
      shows: whatIsReferred.shows !== false,
      eyebrow: words(whatIsReferred.eyebrow),
      heading: words(whatIsReferred.heading),
      paragraphs: whatIsReferred.paragraphs.map((paragraph) => words(paragraph.text)),
      link: { label: words(whatIsReferred.linkLabel), href: localePath(locale, '/product') },
    },
    termsSummary: {
      shows: termsSummary.shows !== false,
      eyebrow: words(termsSummary.eyebrow),
      heading: words(termsSummary.heading),
      terms: termsSummary.points.map((point) => ({ lead: words(point.bold), rest: restOfPoint(words(point.rest)) })),
      // The full terms are binding where this is a summary (ticket 17).
      link: { label: words(termsSummary.linkLabel), href: localePath(locale, '/referral-terms') },
    },
    questions: {
      shows: questions.shows !== false,
      eyebrow: words(questions.eyebrow),
      heading: words(questions.heading),
    },
    signup: {
      shows: true,
      eyebrow: words(signup.eyebrow),
      heading: words(signup.heading),
      lead: words(signup.lead),
      benefits: signup.benefits.map((benefit) => words(benefit.text)),
      guarantee: { figure: numeralsInMono(words(signup.guarantee.figure)), text: words(signup.guarantee.text) },
    },
  };

  return { ...(await withQuestions('referral', locale, page)), signupForm };
}
