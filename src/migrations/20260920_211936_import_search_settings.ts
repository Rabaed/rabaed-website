import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SEARCH_SETTINGS_SEED } from './search-settings-import/seed';

/**
 * Imports how each page appears in a search result as the entry's first
 * published version (ticket 26). From here on it is an Editor's.
 *
 * In Arabic, as the six pages it covers are: an English search title belongs
 * to the English site, which is ticket 42's.
 *
 * The statements are frozen in `search-settings-import/seed.ts`, naming the
 * columns this entry's tables had on the day this was written (ticket 63).
 * This entry exists at all because the trap ticket 63 closes sent ticket 26
 * round it: rather than three fields on each of six page entries, the search
 * settings became an entry of their own. A seventh page, or a fourth field,
 * can now be added wherever it reads best; `search-settings-import/words.ts`
 * is still where the words are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(SEARCH_SETTINGS_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_search_settings_v";
    DELETE FROM "search_settings";
  `);
}
