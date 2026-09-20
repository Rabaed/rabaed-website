import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { SEARCH_SETTINGS } from './search-settings-import/words';

/**
 * Imports how each page appears in a search result as the entry's first
 * published version (ticket 26). From here on it is an Editor's.
 *
 * In Arabic, as the six pages it covers are: an English search title belongs
 * to the English site, which is ticket 42's.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'search-settings',
    data: { languages: ['ar'], ...SEARCH_SETTINGS, _status: 'published' },
    // A migration runs outside the site, where there are no pages to refresh
    // (`src/cms/globals/site-settings.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_search_settings_v";
    DELETE FROM "search_settings";
  `);
}
