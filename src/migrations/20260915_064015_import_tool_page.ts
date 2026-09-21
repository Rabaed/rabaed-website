import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { TOOL_PAGE_SEED } from './tool-page-import/seed';

/**
 * Imports the tool page's words into the CMS, verbatim, as its first
 * published version, in Arabic (ticket 54). From here on they are edited only
 * in the CMS.
 *
 * The statements are frozen in `tool-page-import/seed.ts`, naming the columns
 * this entry's tables had on the day this was written (ticket 63);
 * `tool-page-import/words.ts` is still where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(TOOL_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_tool_page_v";
    DELETE FROM "tool_page";
  `);
}
