import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { START_PAGE_SEED } from './start-page-import/seed';

/**
 * Imports the start page's words into the CMS, verbatim, as its first
 * published version, in Arabic (ticket 53). From here on they are edited only
 * in the CMS.
 *
 * The statements are frozen in `start-page-import/seed.ts`, naming the columns
 * this entry's tables had on the day this was written (ticket 63). It wrote
 * through `payload.updateGlobal` until then, which built its statement from
 * the fields the code declares *today* — so the first field added to the start
 * page would have made this name a column the database has not reached yet,
 * and stopped every database built from scratch. The words are unchanged:
 * `start-page-import/words.ts` is still where they are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(START_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The steps and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_start_page_v";
    DELETE FROM "start_page";
  `);
}
