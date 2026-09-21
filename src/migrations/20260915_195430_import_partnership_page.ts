import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PARTNERSHIP_PAGE_SEED } from './partnership-page-import/seed';

/**
 * Imports the partnership page's words into the CMS, verbatim, as its first
 * published version, in Arabic (ticket 55). From here on they are edited only
 * in the CMS.
 *
 * The statements are frozen in `partnership-page-import/seed.ts`, naming the
 * columns this entry's tables had on the day this was written (ticket 63);
 * `partnership-page-import/words.ts` is still where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PARTNERSHIP_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_partnership_page_v";
    DELETE FROM "partnership_page";
  `);
}
