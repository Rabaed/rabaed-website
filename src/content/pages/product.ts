import { pageEntry, wordsIn } from '@/cms/pages';
import { getSearchSettings } from '@/content/search-settings';
import type { ClosingSectionContent } from '@/components/closing-section';
import type { TrustStripContent } from '@/components/home/trust-strip';
import type { PageHeroContent } from '@/components/page-hero';
import type { ProductCustomStripContent } from '@/components/product/custom-strip';
import type { InnerCycleNote, ProductInnerCycleContent } from '@/components/product/inner-cycle';
import type { FlowStep, ProductJourneyContent } from '@/components/product/journey';
import type { ProductRolesContent } from '@/components/product/roles';
import { getClosingSection } from '@/content/closing-section';
import { getScreenMocks } from '@/content/screen-mocks';
import { getTrustStrip } from '@/content/trust-strip';
import type { FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { formPageWording } from '@/forms/settings';
import type { Locale } from '@/lib/locales';
import type { ProductPage } from '@/payload-types';
import { type LinkedSection, type PageMeta, type Section } from './page-content';

export type ProductPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  /** This page's hero lands here, «ابدأ من الوحدات ↓». */
  readonly journey: LinkedSection<ProductJourneyContent>;
  readonly customStrip: Section<ProductCustomStripContent>;
  readonly roles: Section<ProductRolesContent>;
  readonly innerCycle: Section<ProductInnerCycleContent>;
  /** Holds the demo request form, which the header, this page's hero and the custom strip all link to. */
  readonly closing: LinkedSection<ClosingSectionContent>;
  /** The words of the closing section's demo request form: its settings in the CMS. */
  readonly demoForm: FormPageWording<DemoRequestField>;
};

/**
 * The page's short name, as its breadcrumb structured data reads it
 * (ticket 32). Its search title and description are an Editor's, in the CMS
 * (ticket 26, `src/content/search-settings.ts`).
 */
const NAME = 'المنتج';

/** Between two parties, the way something travels: towards the reading's end. */
const TOWARDS: Readonly<Record<Locale, string>> = { ar: '←', en: '→' };
/** What separates one route from the next. */
const THEN = '·';

type Flow = NonNullable<ProductPage['journey']['panels'][number]['flow']>;

/** The row of pills at the foot of a panel: each party, then what the Editor put after it — never after the last. */
function flowSteps(locale: Locale, flow: Flow): FlowStep[] {
  return flow.flatMap((item, index): FlowStep[] => {
    const party: FlowStep = { party: wordsIn(locale, item.party) };
    if (index === flow.length - 1 || item.after === 'none') return [party];
    return [party, item.after === 'towards' ? { towards: TOWARDS[locale] } : { then: THEN }];
  });
}

/**
 * The product page's content in `locale`: its words from its entry in the CMS
 * (ticket 57), its screens from the Screen mocks entry and its closing section
 * from the entry it shares with the home page — or a refusal, where any of
 * them is not published in `locale` — with its form's words as the CMS has them.
 *
 * Where each button and link leads stays here, in code: an Editor changes what
 * a button says, never where it goes.
 */
export async function getProductPage(locale: Locale): Promise<ProductPageContent> {
  const [entry, screenOf, closing, demoForm, trustStrip, meta] = await Promise.all([
    pageEntry('product-page', locale),
    getScreenMocks(locale),
    getClosingSection(locale),
    formPageWording(DEMO_REQUEST),
    getTrustStrip(locale),
    getSearchSettings(locale, 'product', { name: NAME }),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);
  const { hero, journey, customStrip, roles, innerCycle } = entry;
  // The sentence before a bold one, and the space between them.
  const note = ({ label, text, emphasis }: ProductPage['innerCycle']['staysInside']): InnerCycleNote => ({
    label: words(label),
    text: [`${words(text)} `, { strong: words(emphasis) }],
  });

  return {
    meta,
    hero: {
      eyebrow: words(hero.eyebrow),
      title: words(hero.title),
      lead: words(hero.lead),
      // The first jumps to the demo request form at the foot of this page, the
      // second to the journey just below.
      primary: { label: words(hero.primaryLabel), href: '#demo' },
      secondary: { label: words(hero.secondaryLabel), href: '#journey' },
    },
    // The Reference site's product page carries the same strip as its home page.
    trustStrip: { ...trustStrip, shows: entry.trustStrip?.shows !== false },
    journey: {
      shows: true,
      eyebrow: words(journey.eyebrow),
      heading: words(journey.heading),
      // A unit is numbered by its place, so reordering renumbers it.
      panels: journey.panels.map((panel) => ({
        tag: panel.final ? { kind: 'output', name: words(journey.outputLabel) } : { kind: 'unit' },
        title: words(panel.title),
        tagline: words(panel.tagline),
        body: words(panel.body),
        flow: flowSteps(locale, panel.flow ?? []),
        screen: screenOf(panel.screen),
      })),
    },
    customStrip: {
      shows: customStrip.shows !== false,
      eyebrow: words(customStrip.eyebrow),
      heading: words(customStrip.heading),
      features: customStrip.features.map((feature) => ({ title: words(feature.title), body: words(feature.body) })),
      badge: words(customStrip.badge),
      // The demo request form, in the closing section at the foot of this page.
      ask: { label: words(customStrip.askLabel), href: '#demo' },
    },
    roles: {
      shows: roles.shows !== false,
      eyebrow: words(roles.eyebrow),
      heading: words(roles.heading),
      // Empty until an Editor writes the section's standalone answer, and
      // drawn only once one is written (ticket 35).
      lead: words(roles.lead),
      roles: roles.roles.map((role) => ({
        party: words(role.party),
        promise: words(role.promise),
        body: words(role.body),
        objection: words(role.objection),
        answer: words(role.answer),
        screen: screenOf(role.screen),
      })),
      sharedPromises: roles.sharedPromises.map((shared) => words(shared.promise)),
    },
    innerCycle: {
      shows: innerCycle.shows !== false,
      eyebrow: words(innerCycle.eyebrow),
      heading: words(innerCycle.heading),
      lead: words(innerCycle.lead),
      cycles: innerCycle.cycles.map((cycle) => ({
        party: words(cycle.party),
        note: words(cycle.note),
        reviewers: cycle.reviewers.map((reviewer) => words(reviewer.reviewer)),
        crosses: words(cycle.crosses),
      })),
      privateTag: words(innerCycle.privateTag),
      reviewAgain: words(innerCycle.reviewAgain),
      crossesLabel: words(innerCycle.crossesLabel),
      staysInside: note(innerCycle.staysInside),
      crossesOut: note(innerCycle.crossesOut),
    },
    closing: { shows: true, ...closing },
    demoForm,
  };
}
