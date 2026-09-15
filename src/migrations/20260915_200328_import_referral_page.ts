import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { REFERRAL_PAGE_WORDS, REFERRAL_PROGRAM_AMOUNTS } from './referral-page-import/words';

/**
 * Imports the Referral Program values the site launched with, and the referral
 * page's words, verbatim, in Arabic, each as its first published version
 * (ticket 56). From here on both are edited only in the CMS.
 *
 * The values first: the page names them rather than typing an amount.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // A migration runs outside the site, where there are no pages to refresh
  // (`src/cms/globals/site-settings.ts`).
  const context = { [SKIP_REVALIDATION]: true };
  await payload.updateGlobal({
    slug: 'referral-program',
    data: { ...REFERRAL_PROGRAM_AMOUNTS, _status: 'published' },
    context,
    req,
  });
  await payload.updateGlobal({
    slug: 'referral-page',
    data: { languages: ['ar'], ...REFERRAL_PAGE_WORDS, _status: 'published' },
    context,
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_referral_page_v";
    DELETE FROM "referral_page";
    DELETE FROM "_referral_program_v";
    DELETE FROM "referral_program";
  `);
}
