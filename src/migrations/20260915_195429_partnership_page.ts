import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_partnership_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_partnership_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partnership_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__partnership_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "partnership_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_partnership_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  CREATE TABLE "partnership_page_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure_ar" varchar,
  	"figure_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar
  );
  CREATE TABLE "partnership_page_idea_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  CREATE TABLE "partnership_page_audience_kinds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  CREATE TABLE "partnership_page_modes_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"fit_ar" varchar,
  	"fit_en" varchar
  );
  CREATE TABLE "partnership_page_benefits_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  CREATE TABLE "partnership_page_path_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  CREATE TABLE "partnership_page_apply_reassurances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  CREATE TABLE "partnership_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow_ar" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title_ar" varchar,
  	"hero_title_en" varchar,
  	"hero_lead_ar" varchar,
  	"hero_lead_en" varchar,
  	"hero_primary_label_ar" varchar,
  	"hero_primary_label_en" varchar,
  	"hero_secondary_label_ar" varchar,
  	"hero_secondary_label_en" varchar,
  	"idea_shows" boolean DEFAULT true,
  	"idea_eyebrow_ar" varchar,
  	"idea_eyebrow_en" varchar,
  	"idea_heading_ar" varchar,
  	"idea_heading_en" varchar,
  	"idea_referral_note_text_ar" varchar,
  	"idea_referral_note_text_en" varchar,
  	"idea_referral_note_link_label_ar" varchar,
  	"idea_referral_note_link_label_en" varchar,
  	"audience_shows" boolean DEFAULT true,
  	"audience_eyebrow_ar" varchar,
  	"audience_eyebrow_en" varchar,
  	"audience_heading_ar" varchar,
  	"audience_heading_en" varchar,
  	"modes_shows" boolean DEFAULT true,
  	"modes_eyebrow_ar" varchar,
  	"modes_eyebrow_en" varchar,
  	"modes_heading_ar" varchar,
  	"modes_heading_en" varchar,
  	"modes_note_before_ar" varchar,
  	"modes_note_before_en" varchar,
  	"modes_note_bold_ar" varchar,
  	"modes_note_bold_en" varchar,
  	"modes_note_after_ar" varchar,
  	"modes_note_after_en" varchar,
  	"benefits_shows" boolean DEFAULT true,
  	"benefits_eyebrow_ar" varchar,
  	"benefits_eyebrow_en" varchar,
  	"benefits_heading_ar" varchar,
  	"benefits_heading_en" varchar,
  	"path_eyebrow_ar" varchar,
  	"path_eyebrow_en" varchar,
  	"path_heading_ar" varchar,
  	"path_heading_en" varchar,
  	"path_lead_ar" varchar,
  	"path_lead_en" varchar,
  	"path_link_label_ar" varchar,
  	"path_link_label_en" varchar,
  	"path_stage_label_ar" varchar,
  	"path_stage_label_en" varchar,
  	"questions_shows" boolean DEFAULT true,
  	"questions_eyebrow_ar" varchar,
  	"questions_eyebrow_en" varchar,
  	"questions_heading_ar" varchar,
  	"questions_heading_en" varchar,
  	"apply_eyebrow_ar" varchar,
  	"apply_eyebrow_en" varchar,
  	"apply_heading_ar" varchar,
  	"apply_heading_en" varchar,
  	"apply_lead_ar" varchar,
  	"apply_lead_en" varchar,
  	"apply_response_time_bold_ar" varchar,
  	"apply_response_time_bold_en" varchar,
  	"apply_response_time_text_ar" varchar,
  	"apply_response_time_text_en" varchar,
  	"_status" "enum_partnership_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  CREATE TABLE "_partnership_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__partnership_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  CREATE TABLE "_partnership_page_v_version_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure_ar" varchar,
  	"figure_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_idea_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_audience_kinds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_modes_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"fit_ar" varchar,
  	"fit_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_benefits_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_path_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v_version_apply_reassurances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_partnership_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow_ar" varchar,
  	"version_hero_eyebrow_en" varchar,
  	"version_hero_title_ar" varchar,
  	"version_hero_title_en" varchar,
  	"version_hero_lead_ar" varchar,
  	"version_hero_lead_en" varchar,
  	"version_hero_primary_label_ar" varchar,
  	"version_hero_primary_label_en" varchar,
  	"version_hero_secondary_label_ar" varchar,
  	"version_hero_secondary_label_en" varchar,
  	"version_idea_shows" boolean DEFAULT true,
  	"version_idea_eyebrow_ar" varchar,
  	"version_idea_eyebrow_en" varchar,
  	"version_idea_heading_ar" varchar,
  	"version_idea_heading_en" varchar,
  	"version_idea_referral_note_text_ar" varchar,
  	"version_idea_referral_note_text_en" varchar,
  	"version_idea_referral_note_link_label_ar" varchar,
  	"version_idea_referral_note_link_label_en" varchar,
  	"version_audience_shows" boolean DEFAULT true,
  	"version_audience_eyebrow_ar" varchar,
  	"version_audience_eyebrow_en" varchar,
  	"version_audience_heading_ar" varchar,
  	"version_audience_heading_en" varchar,
  	"version_modes_shows" boolean DEFAULT true,
  	"version_modes_eyebrow_ar" varchar,
  	"version_modes_eyebrow_en" varchar,
  	"version_modes_heading_ar" varchar,
  	"version_modes_heading_en" varchar,
  	"version_modes_note_before_ar" varchar,
  	"version_modes_note_before_en" varchar,
  	"version_modes_note_bold_ar" varchar,
  	"version_modes_note_bold_en" varchar,
  	"version_modes_note_after_ar" varchar,
  	"version_modes_note_after_en" varchar,
  	"version_benefits_shows" boolean DEFAULT true,
  	"version_benefits_eyebrow_ar" varchar,
  	"version_benefits_eyebrow_en" varchar,
  	"version_benefits_heading_ar" varchar,
  	"version_benefits_heading_en" varchar,
  	"version_path_eyebrow_ar" varchar,
  	"version_path_eyebrow_en" varchar,
  	"version_path_heading_ar" varchar,
  	"version_path_heading_en" varchar,
  	"version_path_lead_ar" varchar,
  	"version_path_lead_en" varchar,
  	"version_path_link_label_ar" varchar,
  	"version_path_link_label_en" varchar,
  	"version_path_stage_label_ar" varchar,
  	"version_path_stage_label_en" varchar,
  	"version_questions_shows" boolean DEFAULT true,
  	"version_questions_eyebrow_ar" varchar,
  	"version_questions_eyebrow_en" varchar,
  	"version_questions_heading_ar" varchar,
  	"version_questions_heading_en" varchar,
  	"version_apply_eyebrow_ar" varchar,
  	"version_apply_eyebrow_en" varchar,
  	"version_apply_heading_ar" varchar,
  	"version_apply_heading_en" varchar,
  	"version_apply_lead_ar" varchar,
  	"version_apply_lead_en" varchar,
  	"version_apply_response_time_bold_ar" varchar,
  	"version_apply_response_time_bold_en" varchar,
  	"version_apply_response_time_text_ar" varchar,
  	"version_apply_response_time_text_en" varchar,
  	"version__status" "enum__partnership_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  ALTER TABLE "partnership_page_languages" ADD CONSTRAINT "partnership_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_hero_figures" ADD CONSTRAINT "partnership_page_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_idea_paragraphs" ADD CONSTRAINT "partnership_page_idea_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_audience_kinds" ADD CONSTRAINT "partnership_page_audience_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_modes_modes" ADD CONSTRAINT "partnership_page_modes_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_benefits_benefits" ADD CONSTRAINT "partnership_page_benefits_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_path_stages" ADD CONSTRAINT "partnership_page_path_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnership_page_apply_reassurances" ADD CONSTRAINT "partnership_page_apply_reassurances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_languages" ADD CONSTRAINT "_partnership_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_hero_figures" ADD CONSTRAINT "_partnership_page_v_version_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_idea_paragraphs" ADD CONSTRAINT "_partnership_page_v_version_idea_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_audience_kinds" ADD CONSTRAINT "_partnership_page_v_version_audience_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_modes_modes" ADD CONSTRAINT "_partnership_page_v_version_modes_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_benefits_benefits" ADD CONSTRAINT "_partnership_page_v_version_benefits_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_path_stages" ADD CONSTRAINT "_partnership_page_v_version_path_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partnership_page_v_version_apply_reassurances" ADD CONSTRAINT "_partnership_page_v_version_apply_reassurances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partnership_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partnership_page_languages_order_idx" ON "partnership_page_languages" USING btree ("order");
  CREATE INDEX "partnership_page_languages_parent_idx" ON "partnership_page_languages" USING btree ("parent_id");
  CREATE INDEX "partnership_page_hero_figures_order_idx" ON "partnership_page_hero_figures" USING btree ("_order");
  CREATE INDEX "partnership_page_hero_figures_parent_id_idx" ON "partnership_page_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_idea_paragraphs_order_idx" ON "partnership_page_idea_paragraphs" USING btree ("_order");
  CREATE INDEX "partnership_page_idea_paragraphs_parent_id_idx" ON "partnership_page_idea_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_audience_kinds_order_idx" ON "partnership_page_audience_kinds" USING btree ("_order");
  CREATE INDEX "partnership_page_audience_kinds_parent_id_idx" ON "partnership_page_audience_kinds" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_modes_modes_order_idx" ON "partnership_page_modes_modes" USING btree ("_order");
  CREATE INDEX "partnership_page_modes_modes_parent_id_idx" ON "partnership_page_modes_modes" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_benefits_benefits_order_idx" ON "partnership_page_benefits_benefits" USING btree ("_order");
  CREATE INDEX "partnership_page_benefits_benefits_parent_id_idx" ON "partnership_page_benefits_benefits" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_path_stages_order_idx" ON "partnership_page_path_stages" USING btree ("_order");
  CREATE INDEX "partnership_page_path_stages_parent_id_idx" ON "partnership_page_path_stages" USING btree ("_parent_id");
  CREATE INDEX "partnership_page_apply_reassurances_order_idx" ON "partnership_page_apply_reassurances" USING btree ("_order");
  CREATE INDEX "partnership_page_apply_reassurances_parent_id_idx" ON "partnership_page_apply_reassurances" USING btree ("_parent_id");
  CREATE INDEX "partnership_page__status_idx" ON "partnership_page" USING btree ("_status");
  CREATE INDEX "_partnership_page_v_version_languages_order_idx" ON "_partnership_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_partnership_page_v_version_languages_parent_idx" ON "_partnership_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_partnership_page_v_version_hero_figures_order_idx" ON "_partnership_page_v_version_hero_figures" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_hero_figures_parent_id_idx" ON "_partnership_page_v_version_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_idea_paragraphs_order_idx" ON "_partnership_page_v_version_idea_paragraphs" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_idea_paragraphs_parent_id_idx" ON "_partnership_page_v_version_idea_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_audience_kinds_order_idx" ON "_partnership_page_v_version_audience_kinds" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_audience_kinds_parent_id_idx" ON "_partnership_page_v_version_audience_kinds" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_modes_modes_order_idx" ON "_partnership_page_v_version_modes_modes" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_modes_modes_parent_id_idx" ON "_partnership_page_v_version_modes_modes" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_benefits_benefits_order_idx" ON "_partnership_page_v_version_benefits_benefits" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_benefits_benefits_parent_id_idx" ON "_partnership_page_v_version_benefits_benefits" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_path_stages_order_idx" ON "_partnership_page_v_version_path_stages" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_path_stages_parent_id_idx" ON "_partnership_page_v_version_path_stages" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_apply_reassurances_order_idx" ON "_partnership_page_v_version_apply_reassurances" USING btree ("_order");
  CREATE INDEX "_partnership_page_v_version_apply_reassurances_parent_id_idx" ON "_partnership_page_v_version_apply_reassurances" USING btree ("_parent_id");
  CREATE INDEX "_partnership_page_v_version_version__status_idx" ON "_partnership_page_v" USING btree ("version__status");
  CREATE INDEX "_partnership_page_v_created_at_idx" ON "_partnership_page_v" USING btree ("created_at");
  CREATE INDEX "_partnership_page_v_updated_at_idx" ON "_partnership_page_v" USING btree ("updated_at");
  CREATE INDEX "_partnership_page_v_latest_idx" ON "_partnership_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "partnership_page_languages" CASCADE;
  DROP TABLE "partnership_page_hero_figures" CASCADE;
  DROP TABLE "partnership_page_idea_paragraphs" CASCADE;
  DROP TABLE "partnership_page_audience_kinds" CASCADE;
  DROP TABLE "partnership_page_modes_modes" CASCADE;
  DROP TABLE "partnership_page_benefits_benefits" CASCADE;
  DROP TABLE "partnership_page_path_stages" CASCADE;
  DROP TABLE "partnership_page_apply_reassurances" CASCADE;
  DROP TABLE "partnership_page" CASCADE;
  DROP TABLE "_partnership_page_v_version_languages" CASCADE;
  DROP TABLE "_partnership_page_v_version_hero_figures" CASCADE;
  DROP TABLE "_partnership_page_v_version_idea_paragraphs" CASCADE;
  DROP TABLE "_partnership_page_v_version_audience_kinds" CASCADE;
  DROP TABLE "_partnership_page_v_version_modes_modes" CASCADE;
  DROP TABLE "_partnership_page_v_version_benefits_benefits" CASCADE;
  DROP TABLE "_partnership_page_v_version_path_stages" CASCADE;
  DROP TABLE "_partnership_page_v_version_apply_reassurances" CASCADE;
  DROP TABLE "_partnership_page_v" CASCADE;
  DROP TYPE "public"."enum_partnership_page_languages";
  DROP TYPE "public"."enum_partnership_page_status";
  DROP TYPE "public"."enum__partnership_page_v_version_languages";
  DROP TYPE "public"."enum__partnership_page_v_version_status";`)
}
