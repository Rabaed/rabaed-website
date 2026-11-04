import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_COMPARE_SEED, PROFILE_COMPARE_UNSEED } from './profile-compare-import/seed';

/**
 * Writes the before-and-after section's first words (ticket 108) — Ahmed's,
 * in Arabic and in English — into the Company profile's entry, which ticket
 * 102's import made. Without them the fields the previous migration adds would
 * be empty, and the CMS would refuse to publish the entry. Nothing is
 * published here: the profile stays unpublished until the founder publishes it
 * (ticket 110).
 *
 * The statements are in `profile-compare-import/seed.ts`, and the words in
 * `profile-compare-import/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_COMPARE_SEED));
}

/** Takes the words back off, where they are still the ones this wrote. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_COMPARE_UNSEED));
}
