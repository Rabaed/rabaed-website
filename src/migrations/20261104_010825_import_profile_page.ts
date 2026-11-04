import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_PAGE_SEED } from './profile-page-import/seed';

/**
 * Imports the Company profile's first words — Ahmed's, in Arabic and in
 * English — as its entry's first version, **unpublished** (ticket 102). Unlike
 * every page imported before it, nothing here reaches a visitor: `/profile`
 * is not found and `/en/profile` is the English notice until the founder
 * publishes the page, first in the preview CMS and then in production
 * (ticket 110). The entry is saved as an unpublished page is after the
 * admin's Unpublish: the entry itself and one version, both drafts, and
 * Arabic alone among its languages.
 *
 * The statements are frozen in `profile-page-import/seed.ts`, naming the
 * columns this entry's tables had on the day this was written (ticket 63);
 * `profile-page-import/words.ts` is where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and the languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_profile_page_v";
    DELETE FROM "profile_page";
  `);
}
