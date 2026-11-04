import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_PDF_LABEL_SEED, PROFILE_PDF_LABEL_UNSEED } from './profile-pdf-label/seed';

/**
 * Writes the words on the Company profile's Download PDF button (ticket 104),
 * «تنزيل PDF» and "Download PDF", into its entry, which ticket 102 imported
 * unpublished. Without them the field `20261104_034952_profile_pdf` adds would
 * be empty, and the CMS would refuse the founder's publish.
 *
 * The statements are in `profile-pdf-label/seed.ts`, and the words in
 * `profile-pdf-label/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_PDF_LABEL_SEED));
}

/** Takes the words back off, where they are still the ones this wrote. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_PDF_LABEL_UNSEED));
}
