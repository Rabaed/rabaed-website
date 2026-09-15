import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { TOOL_PAGE_WORDS } from './tool-page-import/words';

/**
 * Imports the tool page's words into the CMS, verbatim, as its first
 * published version, in Arabic (ticket 54). From here on they are edited only
 * in the CMS.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'tool-page',
    data: { languages: ['ar'], ...TOOL_PAGE_WORDS, _status: 'published' },
    // A migration runs outside the site, where there are no pages to
    // refresh (`src/cms/globals/site-settings.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The lists and languages go with the rows they belong to.
  await db.execute(sql`
    DELETE FROM "_tool_page_v";
    DELETE FROM "tool_page";
  `);
}
