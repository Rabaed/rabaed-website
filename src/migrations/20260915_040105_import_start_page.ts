import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { START_PAGE_WORDS as words } from './start-page-import/words';

/** A word in Arabic alone: the English is written when the page is translated (ticket 42). */
const arabic = (text: string) => ({ ar: text });

/**
 * Imports the start page's words into the CMS, verbatim, as its first
 * published version, in Arabic (ticket 53). From here on they are edited only
 * in the CMS.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'start-page',
    data: {
      languages: ['ar'],
      hero: {
        eyebrow: arabic(words.hero.eyebrow),
        title: arabic(words.hero.title),
        lead: arabic(words.hero.lead),
        primaryLabel: arabic(words.hero.primaryLabel),
        secondaryLabel: arabic(words.hero.secondaryLabel),
      },
      trustStrip: { shows: words.trustStrip.shows },
      steps: {
        shows: words.steps.shows,
        eyebrow: arabic(words.steps.eyebrow),
        heading: arabic(words.steps.heading),
        steps: words.steps.steps.map((step) => ({
          label: arabic(step.label),
          title: arabic(step.title),
          text: arabic(step.text),
          markedOut: step.markedOut,
        })),
      },
      questions: {
        eyebrow: arabic(words.questions.eyebrow),
        heading: arabic(words.questions.heading),
      },
      freeTool: {
        shows: words.freeTool.shows,
        eyebrow: arabic(words.freeTool.eyebrow),
        heading: arabic(words.freeTool.heading),
        text: arabic(words.freeTool.text),
        linkLabel: arabic(words.freeTool.linkLabel),
      },
      _status: 'published',
    },
    // A migration runs outside the site, where there are no pages to
    // refresh (`src/cms/globals/site-settings.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The steps and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_start_page_v";
    DELETE FROM "start_page";
  `);
}
