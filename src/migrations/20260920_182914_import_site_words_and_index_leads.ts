import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SITE_WORDS_SEED } from './site-words-import/seed';

/**
 * Imports the words every page shares into the CMS as their first published
 * version (ticket 59). From here on they are edited only in the CMS.
 *
 * The header, the footer and the not-found page are published in Arabic: they
 * have no English words yet, and an English page shows none of them until
 * ticket 40 writes them. The two index leads are published in both, because
 * the blog and the case studies are (tickets 23 and 24).
 *
 * The statements are frozen in `site-words-import/seed.ts`, naming the columns
 * both entries' tables had on the day this was written (ticket 63);
 * `site-words-import/words.ts` is still where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(SITE_WORDS_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and the languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_site_words_v";
    DELETE FROM "site_words";
    DELETE FROM "_index_leads_v";
    DELETE FROM "index_leads";
  `);
}
