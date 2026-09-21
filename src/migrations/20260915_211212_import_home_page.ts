import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { HOME_PAGE_SEED } from './home-page-import/seed';

/**
 * Imports the home page's words into the CMS as its first published version,
 * in Arabic (ticket 58). From here on they are edited only in the CMS.
 *
 * The statements are frozen in `home-page-import/seed.ts`, naming the columns
 * this entry's tables had on the day this was written (ticket 63) — the
 * longest of the nine, because the home page's lists are the most nested;
 * `home-page-import/words.ts` is still where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(HOME_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists, the figures and the languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_home_page_v";
    DELETE FROM "home_page";
  `);
}
