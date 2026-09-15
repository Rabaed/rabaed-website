import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { HOME_PAGE_WORDS } from './home-page-import/words';

/**
 * Imports the home page's words into the CMS as its first published version,
 * in Arabic (ticket 58). From here on they are edited only in the CMS.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'home-page',
    data: { languages: ['ar'], ...HOME_PAGE_WORDS, _status: 'published' },
    // A migration runs outside the site, where there are no pages to
    // refresh (`src/cms/globals/site-settings.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists, the figures and the languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_home_page_v";
    DELETE FROM "home_page";
  `);
}
