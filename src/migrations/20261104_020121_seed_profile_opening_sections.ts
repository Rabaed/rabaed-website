import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_OPENING_SEED, PROFILE_OPENING_UNSEED } from './profile-opening-sections/seed';

/**
 * Writes Ahmed's words for the Company profile's sections 01 to 04
 * (ticket 105), in Arabic and in English, into the entry ticket 102 imported.
 * Like that import, nothing here is published: the profile reaches visitors
 * when the founder publishes it (ticket 110). Without them, the fields the
 * migration before this one adds would be empty and the CMS would refuse the
 * entry's next publish.
 *
 * The statements are in `profile-opening-sections/seed.ts`, and the words in
 * `profile-opening-sections/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_OPENING_SEED));
}

/** Takes the words and rows back off, where they are still the ones this wrote. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_OPENING_UNSEED));
}
