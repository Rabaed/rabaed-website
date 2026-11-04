import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_SOLUTION_SEED, PROFILE_SOLUTION_UNSEED } from './profile-solution-sections/seed';

/**
 * Writes Ahmed's words for the Company profile's sections 06 to 08
 * (ticket 107), in Arabic and in English, into the entry ticket 102 imported.
 * Like that import, nothing here is published: the profile reaches visitors
 * when the founder publishes it (ticket 110). Without them, the fields ticket 107
 * adds (`20261104_020120_profile_opening_sections`) would be empty and the CMS would refuse the
 * entry's next publish.
 *
 * The statements are in `profile-solution-sections/seed.ts`, and the words in
 * `profile-solution-sections/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_SOLUTION_SEED));
}

/** Takes the words back off, where they are still these, and the list rows this added. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_SOLUTION_UNSEED));
}
