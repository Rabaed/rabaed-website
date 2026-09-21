import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import path from 'node:path';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { TRUST_STRIP_SEED } from './trust-strip-import/seed';
import { TRUST_STRIP_LOGOS } from './trust-strip-import/logos';

/**
 * Imports the Trust strip's eight marks into the CMS as its first published
 * version (ticket 20). From here on a client is added in the CMS.
 *
 * The first migration in this project to put a file into the CMS rather than
 * only words. Each mark is uploaded from `public/logos/`, where it has sat
 * since ticket 06, which gives every database its own copy: a preview and the
 * test server's throwaway database included. The files stay there afterwards —
 * this migration reads them each time it runs on a database that has never had
 * it — but no page does.
 *
 * The entry itself is frozen in `trust-strip-import/seed.ts`, naming the
 * columns its tables had on the day this was written (ticket 63), and finds
 * each mark by the file name it was stored under rather than by the id of that
 * moment. The **upload** is the one part no INSERT can stand in for: the mark
 * has to be converted and written to storage, so it goes on being created
 * through Payload — which means that a field added to Images, unlike one added
 * to a page's entry, would still stop a database built from scratch here
 * (docs/deployment.md).
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const directory = path.join(process.cwd(), 'public', 'logos');

  for (const logo of TRUST_STRIP_LOGOS) {
    await payload.create({
      collection: 'media',
      // The company's name, as every image in this collection carries one: it
      // is what a screen reader announces where the mark itself is decoration.
      data: { alt: logo.name },
      filePath: path.join(directory, logo.file),
      // A migration runs outside the site, where there are no pages to refresh
      // (`src/cms/globals/site-settings.ts`).
      context: { [SKIP_REVALIDATION]: true },
      req,
    });
  }

  await db.execute(sql.raw(TRUST_STRIP_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The marks go with the entry: they were uploaded by this migration and
  // nothing else points at them.
  await db.execute(sql`
    DELETE FROM "_trust_strip_v";
    DELETE FROM "trust_strip";
  `);
}
