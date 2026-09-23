import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the words every page shares a place for the words on a Phone crop and
 * on the whole screen it opens (ticket 78): «اضغط لرؤية الشاشة كاملة», and the
 * opened screen's «إغلاق» and «تكبير», in both languages.
 *
 * Empty here. `20260923_230516_publish_screen_mock_whole_screen` writes the
 * words in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_words" ADD COLUMN "screen_mocks_open_whole_ar" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_open_whole_en" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_close_whole_ar" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_close_whole_en" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_zoom_whole_ar" varchar;
  ALTER TABLE "site_words" ADD COLUMN "screen_mocks_zoom_whole_en" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_open_whole_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_open_whole_en" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_close_whole_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_close_whole_en" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_zoom_whole_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_zoom_whole_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_words" DROP COLUMN "screen_mocks_open_whole_ar";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_open_whole_en";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_close_whole_ar";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_close_whole_en";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_zoom_whole_ar";
  ALTER TABLE "site_words" DROP COLUMN "screen_mocks_zoom_whole_en";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_open_whole_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_open_whole_en";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_close_whole_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_close_whole_en";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_zoom_whole_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_zoom_whole_en";`);
}
