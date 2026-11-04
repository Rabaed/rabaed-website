import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_COST_SEED, PROFILE_COST_UNSEED } from './profile-cost-import/seed';

/**
 * Sends the Company profile's Delay-cost calculator button to the home page's
 * demo request form (ticket 106), `/#demo` and `/en#demo`, as the profile's
 * hero sends its own. Written into the entry, its newest version and its
 * newest published one, where each is still empty. The profile stays as
 * unpublished as it was: this publishes nothing.
 *
 * The statements are in `profile-cost-import/seed.ts`, and the links in
 * `profile-cost-import/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_COST_SEED));
}

/** Takes the link back off, wherever it is still this one. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_COST_UNSEED));
}
