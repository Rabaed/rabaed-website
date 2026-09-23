import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { FOOTER_DIRECTORY_SEED, FOOTER_DIRECTORY_UNSEED } from './footer-directory/seed';

/**
 * The Footer directory (ticket 75, ADR-0020): the footer's one list of links,
 * Terms and Privacy, becomes up to four columns of links through which every
 * page of the site can be reached.
 *
 * The columns' tables are made first, then filled on every version of the
 * site words entry — the footer's two links moved into the Legal column as an
 * Editor left them — and only then is the old list dropped, so nothing an
 * Editor wrote is lost on the way. The words are in `footer-directory/words.ts`,
 * and the statements that write them in `footer-directory/seed.ts`.
 *
 * The Arabic reaches visitors as soon as this runs, as the founder decided;
 * the English waits with the rest of the English site words for the founder
 * to publish them (ticket 40). A preview deployment built before this ran
 * draws a footer from tables that are gone, and needs deploying again.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_words_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar
  );
  
  CREATE TABLE "site_words_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_ar" varchar,
  	"heading_en" varchar
  );
  
  CREATE TABLE "_site_words_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_words_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_ar" varchar,
  	"heading_en" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "site_words_footer_columns_links" ADD CONSTRAINT "site_words_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_words_footer_columns" ADD CONSTRAINT "site_words_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_footer_columns_links" ADD CONSTRAINT "_site_words_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_footer_columns" ADD CONSTRAINT "_site_words_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_words_footer_columns_links_order_idx" ON "site_words_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_words_footer_columns_links_parent_id_idx" ON "site_words_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_words_footer_columns_order_idx" ON "site_words_footer_columns" USING btree ("_order");
  CREATE INDEX "site_words_footer_columns_parent_id_idx" ON "site_words_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_footer_columns_links_order_idx" ON "_site_words_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_footer_columns_links_parent_id_idx" ON "_site_words_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_footer_columns_order_idx" ON "_site_words_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_footer_columns_parent_id_idx" ON "_site_words_v_version_footer_columns" USING btree ("_parent_id");`)
  await db.execute(sql.raw(FOOTER_DIRECTORY_SEED));
  await db.execute(sql`
  DROP TABLE "site_words_footer_legal_links" CASCADE;
  DROP TABLE "_site_words_v_version_footer_legal_links" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_words_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar
  );
  
  CREATE TABLE "_site_words_v_version_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "site_words_footer_legal_links" ADD CONSTRAINT "site_words_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_footer_legal_links" ADD CONSTRAINT "_site_words_v_version_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_words_footer_legal_links_order_idx" ON "site_words_footer_legal_links" USING btree ("_order");
  CREATE INDEX "site_words_footer_legal_links_parent_id_idx" ON "site_words_footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_footer_legal_links_order_idx" ON "_site_words_v_version_footer_legal_links" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_footer_legal_links_parent_id_idx" ON "_site_words_v_version_footer_legal_links" USING btree ("_parent_id");`)
  await db.execute(sql.raw(FOOTER_DIRECTORY_UNSEED));
  await db.execute(sql`
  DROP TABLE "site_words_footer_columns_links" CASCADE;
  DROP TABLE "site_words_footer_columns" CASCADE;
  DROP TABLE "_site_words_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_site_words_v_version_footer_columns" CASCADE;`)
}
