import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { IMPORTED_FAQ_ENTRIES } from './faq-import/entries';

/**
 * Imports the 31 questions the site's pages carried before the CMS, word for
 * word, as published Arabic FAQ entries (ticket 22).
 *
 * Created one after another in each page's order, which is the order they are
 * given in the list an Editor drags them in (`orderable`), and so the order
 * each page shows them in.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const entry of IMPORTED_FAQ_ENTRIES) {
    await payload.create({
      collection: 'faq-entries',
      data: { ...entry, locale: 'ar', shows: true, _status: 'published' },
      // A migration runs outside the site, where there are no pages to
      // refresh (`src/cms/globals/site-settings.ts`).
      context: { [SKIP_REVALIDATION]: true },
      req,
    });
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_faq_entries_v";
    DELETE FROM "faq_entries";
  `);
}
