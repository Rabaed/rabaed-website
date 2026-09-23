import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { WHOLE_SCREEN_SEED, WHOLE_SCREEN_UNSEED } from './screen-mock-whole-screen/seed';

/**
 * Publishes the words on a Phone crop and on the whole screen it opens (ticket
 * 78), in Arabic and English. Without them the fields ticket 78 adds would be
 * empty, phones would show the whole screen to swipe rather than a crop with
 * no way to open it, and the CMS would refuse the entry's next save.
 *
 * The statements are in `screen-mock-whole-screen/seed.ts`, and the words in
 * `screen-mock-whole-screen/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(WHOLE_SCREEN_SEED));
}

/** Takes the words back off, where they are still the ones this wrote. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(WHOLE_SCREEN_UNSEED));
}
