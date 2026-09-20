import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { INDEX_LEADS, SITE_WORDS } from './site-words-import/words';

/**
 * Imports the words every page shares into the CMS as their first published
 * version (ticket 59). From here on they are edited only in the CMS.
 *
 * The header, the footer and the not-found page are published in Arabic: they
 * have no English words yet, and an English page shows none of them until
 * ticket 40 writes them. The two index leads are published in both, because
 * the blog and the case studies are (tickets 23 and 24).
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // A migration runs outside the site, where there are no pages to refresh
  // (`src/cms/globals/site-settings.ts`).
  const context = { [SKIP_REVALIDATION]: true };

  await payload.updateGlobal({
    slug: 'site-words',
    data: { languages: ['ar'], ...SITE_WORDS, _status: 'published' },
    context,
    req,
  });

  await payload.updateGlobal({
    slug: 'index-leads',
    data: { languages: ['ar', 'en'], ...INDEX_LEADS, _status: 'published' },
    context,
    req,
  });
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
