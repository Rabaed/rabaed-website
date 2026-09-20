import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import path from 'node:path';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { TRUST_STRIP_LOGOS, TRUST_STRIP_WORDS } from './trust-strip-import/logos';

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
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const context = { [SKIP_REVALIDATION]: true };
  const directory = path.join(process.cwd(), 'public', 'logos');

  const logos = [];
  for (const logo of TRUST_STRIP_LOGOS) {
    const mark = await payload.create({
      collection: 'media',
      // The company's name, as every image in this collection carries one: it
      // is what a screen reader announces where the mark itself is decoration.
      data: { alt: logo.name },
      filePath: path.join(directory, logo.file),
      context,
      req,
    });
    logos.push({ shows: true, name: { ar: logo.name }, mark: mark.id, height: logo.height, link: null });
  }

  await payload.updateGlobal({
    slug: 'trust-strip',
    data: { languages: ['ar'], strip: { ...TRUST_STRIP_WORDS, logos }, _status: 'published' },
    context,
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The marks go with the entry: they were uploaded by this migration and
  // nothing else points at them.
  await db.execute(sql`
    DELETE FROM "_trust_strip_v";
    DELETE FROM "trust_strip";
  `);
}
