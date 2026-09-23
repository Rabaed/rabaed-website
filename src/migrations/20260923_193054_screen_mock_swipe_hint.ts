import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the words every page shares a place for the hint a phone shows over
 * each Screen mock (ticket 77): «اسحب لرؤية الشاشة كاملة», in both languages.
 *
 * Empty here. `20260923_193055_publish_screen_mock_swipe_hint` writes the
 * words in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_words" ADD COLUMN "screen_mocks_swipe_hint_ar" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_swipe_hint_en" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_swipe_hint_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_swipe_hint_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_words" DROP COLUMN "screen_mocks_swipe_hint_ar";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_swipe_hint_en";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_swipe_hint_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_swipe_hint_en";`);
}
