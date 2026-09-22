import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { FAQ_ENTRIES_SEED } from './faq-import/seed';

/**
 * Imports the 31 questions the site's pages carried before the CMS, word for
 * word, as published Arabic FAQ entries (ticket 22).
 *
 * Created one after another in each page's order, which is the order they are
 * given in the list an Editor drags them in (`orderable`), and so the order
 * each page shows them in.
 *
 * The statements are frozen in `faq-import/seed.ts`, naming the columns the
 * FAQ entries' tables had on the day this was written (ticket 68);
 * `faq-import/entries.ts` is where the questions are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(FAQ_ENTRIES_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_faq_entries_v";
    DELETE FROM "faq_entries";
  `);
}
