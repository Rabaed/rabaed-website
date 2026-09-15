import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_referral_program_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__referral_program_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_referral_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_referral_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__referral_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__referral_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "referral_program" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"payout_riyals" numeric,
  	"client_discount_percent" numeric,
  	"_status" "enum_referral_program_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_referral_program_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_payout_riyals" numeric,
  	"version_client_discount_percent" numeric,
  	"version__status" "enum__referral_program_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "referral_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_referral_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "referral_page_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure_ar" varchar,
  	"figure_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar
  );
  
  CREATE TABLE "referral_page_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"marked_out" boolean DEFAULT false
  );
  
  CREATE TABLE "referral_page_offer_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"after_ar" varchar,
  	"after_en" varchar
  );
  
  CREATE TABLE "referral_page_offer_sides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_ar" varchar,
  	"badge_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "referral_page_audience_kinds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "referral_page_what_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "referral_page_terms_summary_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"rest_ar" varchar,
  	"rest_en" varchar
  );
  
  CREATE TABLE "referral_page_signup_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "referral_page" (
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
  	"how_it_works_eyebrow_ar" varchar,
  	"how_it_works_eyebrow_en" varchar,
  	"how_it_works_heading_ar" varchar,
  	"how_it_works_heading_en" varchar,
  	"offer_shows" boolean DEFAULT true,
  	"offer_eyebrow_ar" varchar,
  	"offer_eyebrow_en" varchar,
  	"offer_heading_ar" varchar,
  	"offer_heading_en" varchar,
  	"audience_shows" boolean DEFAULT true,
  	"audience_eyebrow_ar" varchar,
  	"audience_eyebrow_en" varchar,
  	"audience_heading_ar" varchar,
  	"audience_heading_en" varchar,
  	"audience_lead_ar" varchar,
  	"audience_lead_en" varchar,
  	"audience_partnership_text_ar" varchar,
  	"audience_partnership_text_en" varchar,
  	"audience_partnership_bold_ar" varchar,
  	"audience_partnership_bold_en" varchar,
  	"audience_partnership_after_ar" varchar,
  	"audience_partnership_after_en" varchar,
  	"audience_partnership_link_label_ar" varchar,
  	"audience_partnership_link_label_en" varchar,
  	"what_is_referred_shows" boolean DEFAULT true,
  	"what_is_referred_eyebrow_ar" varchar,
  	"what_is_referred_eyebrow_en" varchar,
  	"what_is_referred_heading_ar" varchar,
  	"what_is_referred_heading_en" varchar,
  	"what_is_referred_link_label_ar" varchar,
  	"what_is_referred_link_label_en" varchar,
  	"terms_summary_shows" boolean DEFAULT true,
  	"terms_summary_eyebrow_ar" varchar,
  	"terms_summary_eyebrow_en" varchar,
  	"terms_summary_heading_ar" varchar,
  	"terms_summary_heading_en" varchar,
  	"terms_summary_link_label_ar" varchar,
  	"terms_summary_link_label_en" varchar,
  	"questions_shows" boolean DEFAULT true,
  	"questions_eyebrow_ar" varchar,
  	"questions_eyebrow_en" varchar,
  	"questions_heading_ar" varchar,
  	"questions_heading_en" varchar,
  	"signup_eyebrow_ar" varchar,
  	"signup_eyebrow_en" varchar,
  	"signup_heading_ar" varchar,
  	"signup_heading_en" varchar,
  	"signup_lead_ar" varchar,
  	"signup_lead_en" varchar,
  	"signup_guarantee_figure_ar" varchar,
  	"signup_guarantee_figure_en" varchar,
  	"signup_guarantee_text_ar" varchar,
  	"signup_guarantee_text_en" varchar,
  	"_status" "enum_referral_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_referral_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__referral_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_referral_page_v_version_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure_ar" varchar,
  	"figure_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"marked_out" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_offer_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"after_ar" varchar,
  	"after_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_offer_sides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_ar" varchar,
  	"badge_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_audience_kinds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_what_paragraphs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_terms_summary_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"rest_ar" varchar,
  	"rest_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v_version_signup_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_referral_page_v" (
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
  	"version_how_it_works_eyebrow_ar" varchar,
  	"version_how_it_works_eyebrow_en" varchar,
  	"version_how_it_works_heading_ar" varchar,
  	"version_how_it_works_heading_en" varchar,
  	"version_offer_shows" boolean DEFAULT true,
  	"version_offer_eyebrow_ar" varchar,
  	"version_offer_eyebrow_en" varchar,
  	"version_offer_heading_ar" varchar,
  	"version_offer_heading_en" varchar,
  	"version_audience_shows" boolean DEFAULT true,
  	"version_audience_eyebrow_ar" varchar,
  	"version_audience_eyebrow_en" varchar,
  	"version_audience_heading_ar" varchar,
  	"version_audience_heading_en" varchar,
  	"version_audience_lead_ar" varchar,
  	"version_audience_lead_en" varchar,
  	"version_audience_partnership_text_ar" varchar,
  	"version_audience_partnership_text_en" varchar,
  	"version_audience_partnership_bold_ar" varchar,
  	"version_audience_partnership_bold_en" varchar,
  	"version_audience_partnership_after_ar" varchar,
  	"version_audience_partnership_after_en" varchar,
  	"version_audience_partnership_link_label_ar" varchar,
  	"version_audience_partnership_link_label_en" varchar,
  	"version_what_is_referred_shows" boolean DEFAULT true,
  	"version_what_is_referred_eyebrow_ar" varchar,
  	"version_what_is_referred_eyebrow_en" varchar,
  	"version_what_is_referred_heading_ar" varchar,
  	"version_what_is_referred_heading_en" varchar,
  	"version_what_is_referred_link_label_ar" varchar,
  	"version_what_is_referred_link_label_en" varchar,
  	"version_terms_summary_shows" boolean DEFAULT true,
  	"version_terms_summary_eyebrow_ar" varchar,
  	"version_terms_summary_eyebrow_en" varchar,
  	"version_terms_summary_heading_ar" varchar,
  	"version_terms_summary_heading_en" varchar,
  	"version_terms_summary_link_label_ar" varchar,
  	"version_terms_summary_link_label_en" varchar,
  	"version_questions_shows" boolean DEFAULT true,
  	"version_questions_eyebrow_ar" varchar,
  	"version_questions_eyebrow_en" varchar,
  	"version_questions_heading_ar" varchar,
  	"version_questions_heading_en" varchar,
  	"version_signup_eyebrow_ar" varchar,
  	"version_signup_eyebrow_en" varchar,
  	"version_signup_heading_ar" varchar,
  	"version_signup_heading_en" varchar,
  	"version_signup_lead_ar" varchar,
  	"version_signup_lead_en" varchar,
  	"version_signup_guarantee_figure_ar" varchar,
  	"version_signup_guarantee_figure_en" varchar,
  	"version_signup_guarantee_text_ar" varchar,
  	"version_signup_guarantee_text_en" varchar,
  	"version__status" "enum__referral_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "referral_page_languages" ADD CONSTRAINT "referral_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_hero_figures" ADD CONSTRAINT "referral_page_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_how_it_works_steps" ADD CONSTRAINT "referral_page_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_offer_paragraphs" ADD CONSTRAINT "referral_page_offer_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_offer_sides" ADD CONSTRAINT "referral_page_offer_sides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_audience_kinds" ADD CONSTRAINT "referral_page_audience_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_what_paragraphs" ADD CONSTRAINT "referral_page_what_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_terms_summary_points" ADD CONSTRAINT "referral_page_terms_summary_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_page_signup_benefits" ADD CONSTRAINT "referral_page_signup_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_languages" ADD CONSTRAINT "_referral_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_hero_figures" ADD CONSTRAINT "_referral_page_v_version_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_how_it_works_steps" ADD CONSTRAINT "_referral_page_v_version_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_offer_paragraphs" ADD CONSTRAINT "_referral_page_v_version_offer_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_offer_sides" ADD CONSTRAINT "_referral_page_v_version_offer_sides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_audience_kinds" ADD CONSTRAINT "_referral_page_v_version_audience_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_what_paragraphs_v" ADD CONSTRAINT "_referral_page_what_paragraphs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_terms_summary_points" ADD CONSTRAINT "_referral_page_v_version_terms_summary_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_referral_page_v_version_signup_benefits" ADD CONSTRAINT "_referral_page_v_version_signup_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_referral_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "referral_program__status_idx" ON "referral_program" USING btree ("_status");
  CREATE INDEX "_referral_program_v_version_version__status_idx" ON "_referral_program_v" USING btree ("version__status");
  CREATE INDEX "_referral_program_v_created_at_idx" ON "_referral_program_v" USING btree ("created_at");
  CREATE INDEX "_referral_program_v_updated_at_idx" ON "_referral_program_v" USING btree ("updated_at");
  CREATE INDEX "_referral_program_v_latest_idx" ON "_referral_program_v" USING btree ("latest");
  CREATE INDEX "referral_page_languages_order_idx" ON "referral_page_languages" USING btree ("order");
  CREATE INDEX "referral_page_languages_parent_idx" ON "referral_page_languages" USING btree ("parent_id");
  CREATE INDEX "referral_page_hero_figures_order_idx" ON "referral_page_hero_figures" USING btree ("_order");
  CREATE INDEX "referral_page_hero_figures_parent_id_idx" ON "referral_page_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "referral_page_how_it_works_steps_order_idx" ON "referral_page_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "referral_page_how_it_works_steps_parent_id_idx" ON "referral_page_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "referral_page_offer_paragraphs_order_idx" ON "referral_page_offer_paragraphs" USING btree ("_order");
  CREATE INDEX "referral_page_offer_paragraphs_parent_id_idx" ON "referral_page_offer_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "referral_page_offer_sides_order_idx" ON "referral_page_offer_sides" USING btree ("_order");
  CREATE INDEX "referral_page_offer_sides_parent_id_idx" ON "referral_page_offer_sides" USING btree ("_parent_id");
  CREATE INDEX "referral_page_audience_kinds_order_idx" ON "referral_page_audience_kinds" USING btree ("_order");
  CREATE INDEX "referral_page_audience_kinds_parent_id_idx" ON "referral_page_audience_kinds" USING btree ("_parent_id");
  CREATE INDEX "referral_page_what_paragraphs_order_idx" ON "referral_page_what_paragraphs" USING btree ("_order");
  CREATE INDEX "referral_page_what_paragraphs_parent_id_idx" ON "referral_page_what_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "referral_page_terms_summary_points_order_idx" ON "referral_page_terms_summary_points" USING btree ("_order");
  CREATE INDEX "referral_page_terms_summary_points_parent_id_idx" ON "referral_page_terms_summary_points" USING btree ("_parent_id");
  CREATE INDEX "referral_page_signup_benefits_order_idx" ON "referral_page_signup_benefits" USING btree ("_order");
  CREATE INDEX "referral_page_signup_benefits_parent_id_idx" ON "referral_page_signup_benefits" USING btree ("_parent_id");
  CREATE INDEX "referral_page__status_idx" ON "referral_page" USING btree ("_status");
  CREATE INDEX "_referral_page_v_version_languages_order_idx" ON "_referral_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_referral_page_v_version_languages_parent_idx" ON "_referral_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_referral_page_v_version_hero_figures_order_idx" ON "_referral_page_v_version_hero_figures" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_hero_figures_parent_id_idx" ON "_referral_page_v_version_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_how_it_works_steps_order_idx" ON "_referral_page_v_version_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_how_it_works_steps_parent_id_idx" ON "_referral_page_v_version_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_offer_paragraphs_order_idx" ON "_referral_page_v_version_offer_paragraphs" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_offer_paragraphs_parent_id_idx" ON "_referral_page_v_version_offer_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_offer_sides_order_idx" ON "_referral_page_v_version_offer_sides" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_offer_sides_parent_id_idx" ON "_referral_page_v_version_offer_sides" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_audience_kinds_order_idx" ON "_referral_page_v_version_audience_kinds" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_audience_kinds_parent_id_idx" ON "_referral_page_v_version_audience_kinds" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_what_paragraphs_v_order_idx" ON "_referral_page_what_paragraphs_v" USING btree ("_order");
  CREATE INDEX "_referral_page_what_paragraphs_v_parent_id_idx" ON "_referral_page_what_paragraphs_v" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_terms_summary_points_order_idx" ON "_referral_page_v_version_terms_summary_points" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_terms_summary_points_parent_id_idx" ON "_referral_page_v_version_terms_summary_points" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_signup_benefits_order_idx" ON "_referral_page_v_version_signup_benefits" USING btree ("_order");
  CREATE INDEX "_referral_page_v_version_signup_benefits_parent_id_idx" ON "_referral_page_v_version_signup_benefits" USING btree ("_parent_id");
  CREATE INDEX "_referral_page_v_version_version__status_idx" ON "_referral_page_v" USING btree ("version__status");
  CREATE INDEX "_referral_page_v_created_at_idx" ON "_referral_page_v" USING btree ("created_at");
  CREATE INDEX "_referral_page_v_updated_at_idx" ON "_referral_page_v" USING btree ("updated_at");
  CREATE INDEX "_referral_page_v_latest_idx" ON "_referral_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "referral_program" CASCADE;
  DROP TABLE "_referral_program_v" CASCADE;
  DROP TABLE "referral_page_languages" CASCADE;
  DROP TABLE "referral_page_hero_figures" CASCADE;
  DROP TABLE "referral_page_how_it_works_steps" CASCADE;
  DROP TABLE "referral_page_offer_paragraphs" CASCADE;
  DROP TABLE "referral_page_offer_sides" CASCADE;
  DROP TABLE "referral_page_audience_kinds" CASCADE;
  DROP TABLE "referral_page_what_paragraphs" CASCADE;
  DROP TABLE "referral_page_terms_summary_points" CASCADE;
  DROP TABLE "referral_page_signup_benefits" CASCADE;
  DROP TABLE "referral_page" CASCADE;
  DROP TABLE "_referral_page_v_version_languages" CASCADE;
  DROP TABLE "_referral_page_v_version_hero_figures" CASCADE;
  DROP TABLE "_referral_page_v_version_how_it_works_steps" CASCADE;
  DROP TABLE "_referral_page_v_version_offer_paragraphs" CASCADE;
  DROP TABLE "_referral_page_v_version_offer_sides" CASCADE;
  DROP TABLE "_referral_page_v_version_audience_kinds" CASCADE;
  DROP TABLE "_referral_page_what_paragraphs_v" CASCADE;
  DROP TABLE "_referral_page_v_version_terms_summary_points" CASCADE;
  DROP TABLE "_referral_page_v_version_signup_benefits" CASCADE;
  DROP TABLE "_referral_page_v" CASCADE;
  DROP TYPE "public"."enum_referral_program_status";
  DROP TYPE "public"."enum__referral_program_v_version_status";
  DROP TYPE "public"."enum_referral_page_languages";
  DROP TYPE "public"."enum_referral_page_status";
  DROP TYPE "public"."enum__referral_page_v_version_languages";
  DROP TYPE "public"."enum__referral_page_v_version_status";`)
}
