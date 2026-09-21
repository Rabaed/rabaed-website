import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { REFERRAL_PAGE_SEED } from './referral-page-import/seed';

/**
 * Imports the Referral Program values the site launched with, and the referral
 * page's words, verbatim, in Arabic, each as its first published version
 * (ticket 56). From here on both are edited only in the CMS.
 *
 * The values first: the page names them rather than typing an amount.
 *
 * The statements are frozen in `referral-page-import/seed.ts`, naming the
 * columns both entries' tables had on the day this was written (ticket 63);
 * `referral-page-import/words.ts` is still where the words and the amounts
 * are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(REFERRAL_PAGE_SEED));
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
