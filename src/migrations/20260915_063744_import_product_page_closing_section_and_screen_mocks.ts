import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PRODUCT_PAGE_SEED } from './product-page-import/seed';

/**
 * Imports the Screen mocks' descriptions, the closing section and the product
 * page's words into the CMS, verbatim, each as its entry's first published
 * version, in Arabic (ticket 57). No mock is replaced: each shows its exported
 * image until an Editor chooses another. From here on they are edited only in
 * the CMS.
 *
 * The statements are frozen in `product-page-import/seed.ts`, naming the
 * columns these three entries' tables had on the day this was written
 * (ticket 63); `product-page-import/words.ts` is still where the words are
 * read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PRODUCT_PAGE_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Every list and language goes with the row it belongs to.
  await db.execute(sql`
    DELETE FROM "_product_page_v";
    DELETE FROM "product_page";
    DELETE FROM "_closing_section_v";
    DELETE FROM "closing_section";
    DELETE FROM "_screen_mocks_v";
    DELETE FROM "screen_mocks";
  `);
}
