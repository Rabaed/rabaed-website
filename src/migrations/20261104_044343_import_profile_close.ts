import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_CLOSE_SEED, PROFILE_CLOSE_UNSEED } from './profile-close-import/seed';

/**
 * Writes Ahmed's words for the Company profile's close (ticket 109) — sections
 * 10 to 14, the contact section and the floating WhatsApp button — in Arabic
 * and in English, into the entry ticket 102 imported. Like that import,
 * nothing here is published: the profile reaches visitors when the founder
 * publishes it (ticket 110). Without them, the fields
 * `20261104_023538_profile_cost` adds would be empty and the CMS would refuse
 * the entry's next publish.
 *
 * The statements are in `profile-close-import/seed.ts`, and the words in
 * `profile-close-import/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_CLOSE_SEED));
}

/** Takes the words back off, where they are still these, and the list rows this added. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_CLOSE_UNSEED));
}
