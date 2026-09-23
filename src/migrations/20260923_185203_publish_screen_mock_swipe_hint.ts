import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SWIPE_HINT_SEED, SWIPE_HINT_UNSEED } from './screen-mock-swipe-hint/seed';

/**
 * Publishes the hint a phone shows over each Screen mock (ticket 77), in
 * Arabic and English. The founder agreed its words on 23 September 2026, and
 * without them the field ticket 77 adds would be empty and the CMS would
 * refuse the entry's next save.
 *
 * The statements are in `screen-mock-swipe-hint/seed.ts`, and the words in
 * `screen-mock-swipe-hint/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(SWIPE_HINT_SEED));
}

/** Takes the hint back off, where it is still the one this wrote. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(SWIPE_HINT_UNSEED));
}
