import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/** The Company profile's sections 01 to 04 (ticket 105): the truth, the real site, the trap and who we are, each with its switch. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_page_numbers_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label_ar" varchar,
  	"label_en" varchar
  );
  
  CREATE TABLE "profile_page_trap_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_numbers_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_trap_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "profile_page" ADD COLUMN "truth_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "truth_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_body_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_body_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_photo_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "truth_caption_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_caption_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_revision_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_revision_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_comments_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_comments_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_who_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "truth_note_who_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_source_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "numbers_source_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "trap_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_body_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_body_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_kicker_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "trap_kicker_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "about_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_title_accent_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_title_accent_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_body_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_body_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_quote_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "about_quote_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_body_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_body_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_photo_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_caption_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_caption_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_revision_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_revision_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_comments_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_comments_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_who_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_truth_note_who_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_source_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_numbers_source_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_body_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_body_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_kicker_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_trap_kicker_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_title_accent_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_title_accent_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_body_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_body_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_quote_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_about_quote_en" varchar;
  ALTER TABLE "profile_page_numbers_figures" ADD CONSTRAINT "profile_page_numbers_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_trap_tools" ADD CONSTRAINT "profile_page_trap_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_numbers_figures" ADD CONSTRAINT "_profile_page_v_version_numbers_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_trap_tools" ADD CONSTRAINT "_profile_page_v_version_trap_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_page_numbers_figures_order_idx" ON "profile_page_numbers_figures" USING btree ("_order");
  CREATE INDEX "profile_page_numbers_figures_parent_id_idx" ON "profile_page_numbers_figures" USING btree ("_parent_id");
  CREATE INDEX "profile_page_trap_tools_order_idx" ON "profile_page_trap_tools" USING btree ("_order");
  CREATE INDEX "profile_page_trap_tools_parent_id_idx" ON "profile_page_trap_tools" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_numbers_figures_order_idx" ON "_profile_page_v_version_numbers_figures" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_numbers_figures_parent_id_idx" ON "_profile_page_v_version_numbers_figures" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_trap_tools_order_idx" ON "_profile_page_v_version_trap_tools" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_trap_tools_parent_id_idx" ON "_profile_page_v_version_trap_tools" USING btree ("_parent_id");
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_truth_photo_id_media_id_fk" FOREIGN KEY ("truth_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_truth_photo_id_media_id_fk" FOREIGN KEY ("version_truth_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_page_truth_truth_photo_idx" ON "profile_page" USING btree ("truth_photo_id");
  CREATE INDEX "_profile_page_v_version_truth_version_truth_photo_idx" ON "_profile_page_v" USING btree ("version_truth_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page_numbers_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_trap_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_numbers_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_trap_tools" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "profile_page_numbers_figures" CASCADE;
  DROP TABLE "profile_page_trap_tools" CASCADE;
  DROP TABLE "_profile_page_v_version_numbers_figures" CASCADE;
  DROP TABLE "_profile_page_v_version_trap_tools" CASCADE;
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_truth_photo_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_truth_photo_id_media_id_fk";
  
  DROP INDEX "profile_page_truth_truth_photo_idx";
  DROP INDEX "_profile_page_v_version_truth_version_truth_photo_idx";
  ALTER TABLE "profile_page" DROP COLUMN "truth_shows";
  ALTER TABLE "profile_page" DROP COLUMN "truth_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_body_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_body_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_photo_id";
  ALTER TABLE "profile_page" DROP COLUMN "truth_caption_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_caption_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_revision_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_revision_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_comments_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_comments_en";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_who_ar";
  ALTER TABLE "profile_page" DROP COLUMN "truth_note_who_en";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_shows";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_source_ar";
  ALTER TABLE "profile_page" DROP COLUMN "numbers_source_en";
  ALTER TABLE "profile_page" DROP COLUMN "trap_shows";
  ALTER TABLE "profile_page" DROP COLUMN "trap_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "trap_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "trap_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "trap_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "trap_body_ar";
  ALTER TABLE "profile_page" DROP COLUMN "trap_body_en";
  ALTER TABLE "profile_page" DROP COLUMN "trap_kicker_ar";
  ALTER TABLE "profile_page" DROP COLUMN "trap_kicker_en";
  ALTER TABLE "profile_page" DROP COLUMN "about_shows";
  ALTER TABLE "profile_page" DROP COLUMN "about_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "about_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "about_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "about_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "about_title_accent_ar";
  ALTER TABLE "profile_page" DROP COLUMN "about_title_accent_en";
  ALTER TABLE "profile_page" DROP COLUMN "about_body_ar";
  ALTER TABLE "profile_page" DROP COLUMN "about_body_en";
  ALTER TABLE "profile_page" DROP COLUMN "about_quote_ar";
  ALTER TABLE "profile_page" DROP COLUMN "about_quote_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_body_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_body_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_photo_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_caption_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_caption_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_revision_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_revision_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_comments_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_comments_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_who_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_truth_note_who_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_source_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_numbers_source_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_body_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_body_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_kicker_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_trap_kicker_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_title_accent_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_title_accent_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_body_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_body_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_quote_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_quote_en";`)
}
