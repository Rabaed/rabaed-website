import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { screenMockFieldName } from '../cms/screen-mock-fields';
import type { ScreenMock } from '../payload-types';
import {
  CLOSING_SECTION_WORDS as closing,
  PRODUCT_PAGE_WORDS as product,
  SCREEN_MOCK_DESCRIPTIONS,
} from './product-page-import/words';

/** A word in Arabic alone: the English is written when the pages are translated (ticket 42). */
const arabic = (text: string) => ({ ar: text });

/**
 * Imports the Screen mocks' descriptions, the closing section and the product
 * page's words into the CMS, verbatim, each as its entry's first published
 * version, in Arabic (ticket 57). No mock is replaced: each shows its exported
 * image until an Editor chooses another. From here on they are edited only in
 * the CMS.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // A migration runs outside the site, where there are no pages to refresh
  // (`src/cms/globals/site-settings.ts`).
  const context = { [SKIP_REVALIDATION]: true };

  const mocks = Object.fromEntries(
    Object.entries(SCREEN_MOCK_DESCRIPTIONS).map(([id, description]) => [
      screenMockFieldName(id),
      { description: arabic(description) },
    ]),
  ) as unknown as Omit<ScreenMock, 'id' | 'languages'>;
  await payload.updateGlobal({
    slug: 'screen-mocks',
    data: { languages: ['ar'], ...mocks, _status: 'published' },
    context,
    req,
  });

  await payload.updateGlobal({
    slug: 'closing-section',
    data: {
      languages: ['ar'],
      closing: {
        eyebrow: arabic(closing.eyebrow),
        heading: arabic(closing.heading),
        steps: closing.steps.map((step) => ({ label: arabic(step.label), text: arabic(step.text) })),
        moreLabel: arabic(closing.moreLabel),
      },
      _status: 'published',
    },
    context,
    req,
  });

  const { hero, journey, customStrip, roles, innerCycle } = product;
  const note = (words: { label: string; text: string; emphasis: string }) => ({
    label: arabic(words.label),
    text: arabic(words.text),
    emphasis: arabic(words.emphasis),
  });
  await payload.updateGlobal({
    slug: 'product-page',
    data: {
      languages: ['ar'],
      hero: {
        eyebrow: arabic(hero.eyebrow),
        title: arabic(hero.title),
        lead: arabic(hero.lead),
        primaryLabel: arabic(hero.primaryLabel),
        secondaryLabel: arabic(hero.secondaryLabel),
      },
      trustStrip: { shows: product.trustStrip.shows },
      journey: {
        eyebrow: arabic(journey.eyebrow),
        heading: arabic(journey.heading),
        outputLabel: arabic(journey.outputLabel),
        panels: journey.panels.map((panel) => ({
          final: panel.final,
          title: arabic(panel.title),
          tagline: arabic(panel.tagline),
          body: arabic(panel.body),
          flow: panel.flow.map((item) => ({ party: arabic(item.party), after: item.after })),
          screen: panel.screen,
        })),
      },
      customStrip: {
        shows: customStrip.shows,
        eyebrow: arabic(customStrip.eyebrow),
        heading: arabic(customStrip.heading),
        badge: arabic(customStrip.badge),
        features: customStrip.features.map((feature) => ({ title: arabic(feature.title), body: arabic(feature.body) })),
        askLabel: arabic(customStrip.askLabel),
      },
      roles: {
        shows: roles.shows,
        eyebrow: arabic(roles.eyebrow),
        heading: arabic(roles.heading),
        roles: roles.roles.map((role) => ({
          party: arabic(role.party),
          promise: arabic(role.promise),
          body: arabic(role.body),
          objection: arabic(role.objection),
          answer: arabic(role.answer),
          screen: role.screen,
        })),
        sharedPromises: roles.sharedPromises.map((promise) => ({ promise: arabic(promise) })),
      },
      innerCycle: {
        shows: innerCycle.shows,
        eyebrow: arabic(innerCycle.eyebrow),
        heading: arabic(innerCycle.heading),
        lead: arabic(innerCycle.lead),
        cycles: innerCycle.cycles.map((cycle) => ({
          party: arabic(cycle.party),
          note: arabic(cycle.note),
          reviewers: cycle.reviewers.map((reviewer) => ({ reviewer: arabic(reviewer) })),
          crosses: arabic(cycle.crosses),
        })),
        privateTag: arabic(innerCycle.privateTag),
        reviewAgain: arabic(innerCycle.reviewAgain),
        crossesLabel: arabic(innerCycle.crossesLabel),
        staysInside: note(innerCycle.staysInside),
        crossesOut: note(innerCycle.crossesOut),
      },
      _status: 'published',
    },
    context,
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Every list and language goes with the row it belongs to.
  await db.execute(sql`
    DELETE FROM "_product_page_v";
    DELETE FROM "product_page";
    DELETE FROM "_closing_section_v";
    DELETE FROM "closing_section";
    DELETE FROM "_screen_mocks_v";
    DELETE FROM "screen_mocks";
  `);
}
