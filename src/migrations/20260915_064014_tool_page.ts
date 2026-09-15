import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tool_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_tool_page_hero_mock_tiles_tone" AS ENUM('plain', 'warn', 'bad');
  CREATE TYPE "public"."enum_tool_page_hero_mock_pours_tests_tone" AS ENUM('idle', 'warn', 'bad', 'info', 'ok');
  CREATE TYPE "public"."enum_tool_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tool_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__tool_page_v_version_hero_mock_tiles_tone" AS ENUM('plain', 'warn', 'bad');
  CREATE TYPE "public"."enum__tool_page_v_version_hero_mock_pours_tests_tone" AS ENUM('idle', 'warn', 'bad', 'info', 'ok');
  CREATE TYPE "public"."enum__tool_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "tool_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tool_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tool_page_hero_promises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_hero_mock_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"tone" "enum_tool_page_hero_mock_tiles_tone" DEFAULT 'plain',
  	"label_ar" varchar,
  	"label_en" varchar
  );
  
  CREATE TABLE "tool_page_hero_mock_pours_tests" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"tone" "enum_tool_page_hero_mock_pours_tests_tone" DEFAULT 'idle',
  	"state_ar" varchar,
  	"state_en" varchar
  );
  
  CREATE TABLE "tool_page_hero_mock_pours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"name_ar" varchar,
  	"name_en" varchar
  );
  
  CREATE TABLE "tool_page_why_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_features_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_features_also" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_how_steps" (
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
  
  CREATE TABLE "tool_page_privacy_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_privacy_tree_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description_ar" varchar,
  	"description_en" varchar,
  	"nested" boolean DEFAULT false
  );
  
  CREATE TABLE "tool_page_requirements_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_download_ticks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page_upsell_adds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "tool_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow_ar" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title_ar" varchar,
  	"hero_title_en" varchar,
  	"hero_title_accent_ar" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_lead_ar" varchar,
  	"hero_lead_en" varchar,
  	"hero_primary_label_ar" varchar,
  	"hero_primary_label_en" varchar,
  	"hero_secondary_label_ar" varchar,
  	"hero_secondary_label_en" varchar,
  	"hero_mock_project_ar" varchar,
  	"hero_mock_project_en" varchar,
  	"why_shows" boolean DEFAULT true,
  	"why_eyebrow_ar" varchar,
  	"why_eyebrow_en" varchar,
  	"why_heading_ar" varchar,
  	"why_heading_en" varchar,
  	"why_lead_ar" varchar,
  	"why_lead_en" varchar,
  	"features_shows" boolean DEFAULT true,
  	"features_eyebrow_ar" varchar,
  	"features_eyebrow_en" varchar,
  	"features_heading_ar" varchar,
  	"features_heading_en" varchar,
  	"features_lead_ar" varchar,
  	"features_lead_en" varchar,
  	"features_countdown_title_ar" varchar,
  	"features_countdown_title_en" varchar,
  	"features_countdown_text_ar" varchar,
  	"features_countdown_text_en" varchar,
  	"features_countdown_legend_idle_ar" varchar,
  	"features_countdown_legend_idle_en" varchar,
  	"features_countdown_legend_warn_ar" varchar,
  	"features_countdown_legend_warn_en" varchar,
  	"features_countdown_legend_bad_ar" varchar,
  	"features_countdown_legend_bad_en" varchar,
  	"features_countdown_legend_info_ar" varchar,
  	"features_countdown_legend_info_en" varchar,
  	"features_countdown_legend_ok_ar" varchar,
  	"features_countdown_legend_ok_en" varchar,
  	"how_eyebrow_ar" varchar,
  	"how_eyebrow_en" varchar,
  	"how_heading_ar" varchar,
  	"how_heading_en" varchar,
  	"how_lead_ar" varchar,
  	"how_lead_en" varchar,
  	"privacy_shows" boolean DEFAULT true,
  	"privacy_eyebrow_ar" varchar,
  	"privacy_eyebrow_en" varchar,
  	"privacy_heading_ar" varchar,
  	"privacy_heading_en" varchar,
  	"privacy_tree_project_ar" varchar,
  	"privacy_tree_project_en" varchar,
  	"privacy_tree_caption_ar" varchar,
  	"privacy_tree_caption_en" varchar,
  	"requirements_shows" boolean DEFAULT true,
  	"requirements_eyebrow_ar" varchar,
  	"requirements_eyebrow_en" varchar,
  	"requirements_heading_ar" varchar,
  	"requirements_heading_en" varchar,
  	"download_eyebrow_ar" varchar,
  	"download_eyebrow_en" varchar,
  	"download_heading_ar" varchar,
  	"download_heading_en" varchar,
  	"download_lead_ar" varchar,
  	"download_lead_en" varchar,
  	"download_promise_bold_ar" varchar,
  	"download_promise_bold_en" varchar,
  	"download_promise_text_ar" varchar,
  	"download_promise_text_en" varchar,
  	"questions_shows" boolean DEFAULT true,
  	"questions_eyebrow_ar" varchar,
  	"questions_eyebrow_en" varchar,
  	"questions_heading_ar" varchar,
  	"questions_heading_en" varchar,
  	"upsell_shows" boolean DEFAULT true,
  	"upsell_eyebrow_ar" varchar,
  	"upsell_eyebrow_en" varchar,
  	"upsell_heading_ar" varchar,
  	"upsell_heading_en" varchar,
  	"upsell_lead_ar" varchar,
  	"upsell_lead_en" varchar,
  	"upsell_primary_label_ar" varchar,
  	"upsell_primary_label_en" varchar,
  	"upsell_secondary_label_ar" varchar,
  	"upsell_secondary_label_en" varchar,
  	"upsell_sign_off_ar" varchar,
  	"upsell_sign_off_en" varchar,
  	"_status" "enum_tool_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_tool_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__tool_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_tool_page_v_version_hero_promises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_hero_mock_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"tone" "enum__tool_page_v_version_hero_mock_tiles_tone" DEFAULT 'plain',
  	"label_ar" varchar,
  	"label_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_hero_mock_pours_tests" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"tone" "enum__tool_page_v_version_hero_mock_pours_tests_tone" DEFAULT 'idle',
  	"state_ar" varchar,
  	"state_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_hero_mock_pours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_why_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_features_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_features_also" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_how_steps" (
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
  
  CREATE TABLE "_tool_page_v_version_privacy_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"bold_ar" varchar,
  	"bold_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_privacy_tree_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description_ar" varchar,
  	"description_en" varchar,
  	"nested" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_requirements_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_download_ticks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v_version_upsell_adds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tool_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow_ar" varchar,
  	"version_hero_eyebrow_en" varchar,
  	"version_hero_title_ar" varchar,
  	"version_hero_title_en" varchar,
  	"version_hero_title_accent_ar" varchar,
  	"version_hero_title_accent_en" varchar,
  	"version_hero_lead_ar" varchar,
  	"version_hero_lead_en" varchar,
  	"version_hero_primary_label_ar" varchar,
  	"version_hero_primary_label_en" varchar,
  	"version_hero_secondary_label_ar" varchar,
  	"version_hero_secondary_label_en" varchar,
  	"version_hero_mock_project_ar" varchar,
  	"version_hero_mock_project_en" varchar,
  	"version_why_shows" boolean DEFAULT true,
  	"version_why_eyebrow_ar" varchar,
  	"version_why_eyebrow_en" varchar,
  	"version_why_heading_ar" varchar,
  	"version_why_heading_en" varchar,
  	"version_why_lead_ar" varchar,
  	"version_why_lead_en" varchar,
  	"version_features_shows" boolean DEFAULT true,
  	"version_features_eyebrow_ar" varchar,
  	"version_features_eyebrow_en" varchar,
  	"version_features_heading_ar" varchar,
  	"version_features_heading_en" varchar,
  	"version_features_lead_ar" varchar,
  	"version_features_lead_en" varchar,
  	"version_features_countdown_title_ar" varchar,
  	"version_features_countdown_title_en" varchar,
  	"version_features_countdown_text_ar" varchar,
  	"version_features_countdown_text_en" varchar,
  	"version_features_countdown_legend_idle_ar" varchar,
  	"version_features_countdown_legend_idle_en" varchar,
  	"version_features_countdown_legend_warn_ar" varchar,
  	"version_features_countdown_legend_warn_en" varchar,
  	"version_features_countdown_legend_bad_ar" varchar,
  	"version_features_countdown_legend_bad_en" varchar,
  	"version_features_countdown_legend_info_ar" varchar,
  	"version_features_countdown_legend_info_en" varchar,
  	"version_features_countdown_legend_ok_ar" varchar,
  	"version_features_countdown_legend_ok_en" varchar,
  	"version_how_eyebrow_ar" varchar,
  	"version_how_eyebrow_en" varchar,
  	"version_how_heading_ar" varchar,
  	"version_how_heading_en" varchar,
  	"version_how_lead_ar" varchar,
  	"version_how_lead_en" varchar,
  	"version_privacy_shows" boolean DEFAULT true,
  	"version_privacy_eyebrow_ar" varchar,
  	"version_privacy_eyebrow_en" varchar,
  	"version_privacy_heading_ar" varchar,
  	"version_privacy_heading_en" varchar,
  	"version_privacy_tree_project_ar" varchar,
  	"version_privacy_tree_project_en" varchar,
  	"version_privacy_tree_caption_ar" varchar,
  	"version_privacy_tree_caption_en" varchar,
  	"version_requirements_shows" boolean DEFAULT true,
  	"version_requirements_eyebrow_ar" varchar,
  	"version_requirements_eyebrow_en" varchar,
  	"version_requirements_heading_ar" varchar,
  	"version_requirements_heading_en" varchar,
  	"version_download_eyebrow_ar" varchar,
  	"version_download_eyebrow_en" varchar,
  	"version_download_heading_ar" varchar,
  	"version_download_heading_en" varchar,
  	"version_download_lead_ar" varchar,
  	"version_download_lead_en" varchar,
  	"version_download_promise_bold_ar" varchar,
  	"version_download_promise_bold_en" varchar,
  	"version_download_promise_text_ar" varchar,
  	"version_download_promise_text_en" varchar,
  	"version_questions_shows" boolean DEFAULT true,
  	"version_questions_eyebrow_ar" varchar,
  	"version_questions_eyebrow_en" varchar,
  	"version_questions_heading_ar" varchar,
  	"version_questions_heading_en" varchar,
  	"version_upsell_shows" boolean DEFAULT true,
  	"version_upsell_eyebrow_ar" varchar,
  	"version_upsell_eyebrow_en" varchar,
  	"version_upsell_heading_ar" varchar,
  	"version_upsell_heading_en" varchar,
  	"version_upsell_lead_ar" varchar,
  	"version_upsell_lead_en" varchar,
  	"version_upsell_primary_label_ar" varchar,
  	"version_upsell_primary_label_en" varchar,
  	"version_upsell_secondary_label_ar" varchar,
  	"version_upsell_secondary_label_en" varchar,
  	"version_upsell_sign_off_ar" varchar,
  	"version_upsell_sign_off_en" varchar,
  	"version__status" "enum__tool_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "tool_page_languages" ADD CONSTRAINT "tool_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_hero_promises" ADD CONSTRAINT "tool_page_hero_promises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_hero_mock_tiles" ADD CONSTRAINT "tool_page_hero_mock_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_hero_mock_pours_tests" ADD CONSTRAINT "tool_page_hero_mock_pours_tests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page_hero_mock_pours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_hero_mock_pours" ADD CONSTRAINT "tool_page_hero_mock_pours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_why_cards" ADD CONSTRAINT "tool_page_why_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_features_cards" ADD CONSTRAINT "tool_page_features_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_features_also" ADD CONSTRAINT "tool_page_features_also_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_how_steps" ADD CONSTRAINT "tool_page_how_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_privacy_points" ADD CONSTRAINT "tool_page_privacy_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_privacy_tree_entries" ADD CONSTRAINT "tool_page_privacy_tree_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_requirements_cards" ADD CONSTRAINT "tool_page_requirements_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_download_ticks" ADD CONSTRAINT "tool_page_download_ticks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tool_page_upsell_adds" ADD CONSTRAINT "tool_page_upsell_adds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_languages" ADD CONSTRAINT "_tool_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_hero_promises" ADD CONSTRAINT "_tool_page_v_version_hero_promises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_hero_mock_tiles" ADD CONSTRAINT "_tool_page_v_version_hero_mock_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_hero_mock_pours_tests" ADD CONSTRAINT "_tool_page_v_version_hero_mock_pours_tests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v_version_hero_mock_pours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_hero_mock_pours" ADD CONSTRAINT "_tool_page_v_version_hero_mock_pours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_why_cards" ADD CONSTRAINT "_tool_page_v_version_why_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_features_cards" ADD CONSTRAINT "_tool_page_v_version_features_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_features_also" ADD CONSTRAINT "_tool_page_v_version_features_also_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_how_steps" ADD CONSTRAINT "_tool_page_v_version_how_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_privacy_points" ADD CONSTRAINT "_tool_page_v_version_privacy_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_privacy_tree_entries" ADD CONSTRAINT "_tool_page_v_version_privacy_tree_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_requirements_cards" ADD CONSTRAINT "_tool_page_v_version_requirements_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_download_ticks" ADD CONSTRAINT "_tool_page_v_version_download_ticks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tool_page_v_version_upsell_adds" ADD CONSTRAINT "_tool_page_v_version_upsell_adds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tool_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tool_page_languages_order_idx" ON "tool_page_languages" USING btree ("order");
  CREATE INDEX "tool_page_languages_parent_idx" ON "tool_page_languages" USING btree ("parent_id");
  CREATE INDEX "tool_page_hero_promises_order_idx" ON "tool_page_hero_promises" USING btree ("_order");
  CREATE INDEX "tool_page_hero_promises_parent_id_idx" ON "tool_page_hero_promises" USING btree ("_parent_id");
  CREATE INDEX "tool_page_hero_mock_tiles_order_idx" ON "tool_page_hero_mock_tiles" USING btree ("_order");
  CREATE INDEX "tool_page_hero_mock_tiles_parent_id_idx" ON "tool_page_hero_mock_tiles" USING btree ("_parent_id");
  CREATE INDEX "tool_page_hero_mock_pours_tests_order_idx" ON "tool_page_hero_mock_pours_tests" USING btree ("_order");
  CREATE INDEX "tool_page_hero_mock_pours_tests_parent_id_idx" ON "tool_page_hero_mock_pours_tests" USING btree ("_parent_id");
  CREATE INDEX "tool_page_hero_mock_pours_order_idx" ON "tool_page_hero_mock_pours" USING btree ("_order");
  CREATE INDEX "tool_page_hero_mock_pours_parent_id_idx" ON "tool_page_hero_mock_pours" USING btree ("_parent_id");
  CREATE INDEX "tool_page_why_cards_order_idx" ON "tool_page_why_cards" USING btree ("_order");
  CREATE INDEX "tool_page_why_cards_parent_id_idx" ON "tool_page_why_cards" USING btree ("_parent_id");
  CREATE INDEX "tool_page_features_cards_order_idx" ON "tool_page_features_cards" USING btree ("_order");
  CREATE INDEX "tool_page_features_cards_parent_id_idx" ON "tool_page_features_cards" USING btree ("_parent_id");
  CREATE INDEX "tool_page_features_also_order_idx" ON "tool_page_features_also" USING btree ("_order");
  CREATE INDEX "tool_page_features_also_parent_id_idx" ON "tool_page_features_also" USING btree ("_parent_id");
  CREATE INDEX "tool_page_how_steps_order_idx" ON "tool_page_how_steps" USING btree ("_order");
  CREATE INDEX "tool_page_how_steps_parent_id_idx" ON "tool_page_how_steps" USING btree ("_parent_id");
  CREATE INDEX "tool_page_privacy_points_order_idx" ON "tool_page_privacy_points" USING btree ("_order");
  CREATE INDEX "tool_page_privacy_points_parent_id_idx" ON "tool_page_privacy_points" USING btree ("_parent_id");
  CREATE INDEX "tool_page_privacy_tree_entries_order_idx" ON "tool_page_privacy_tree_entries" USING btree ("_order");
  CREATE INDEX "tool_page_privacy_tree_entries_parent_id_idx" ON "tool_page_privacy_tree_entries" USING btree ("_parent_id");
  CREATE INDEX "tool_page_requirements_cards_order_idx" ON "tool_page_requirements_cards" USING btree ("_order");
  CREATE INDEX "tool_page_requirements_cards_parent_id_idx" ON "tool_page_requirements_cards" USING btree ("_parent_id");
  CREATE INDEX "tool_page_download_ticks_order_idx" ON "tool_page_download_ticks" USING btree ("_order");
  CREATE INDEX "tool_page_download_ticks_parent_id_idx" ON "tool_page_download_ticks" USING btree ("_parent_id");
  CREATE INDEX "tool_page_upsell_adds_order_idx" ON "tool_page_upsell_adds" USING btree ("_order");
  CREATE INDEX "tool_page_upsell_adds_parent_id_idx" ON "tool_page_upsell_adds" USING btree ("_parent_id");
  CREATE INDEX "tool_page__status_idx" ON "tool_page" USING btree ("_status");
  CREATE INDEX "_tool_page_v_version_languages_order_idx" ON "_tool_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_tool_page_v_version_languages_parent_idx" ON "_tool_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_tool_page_v_version_hero_promises_order_idx" ON "_tool_page_v_version_hero_promises" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_hero_promises_parent_id_idx" ON "_tool_page_v_version_hero_promises" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_hero_mock_tiles_order_idx" ON "_tool_page_v_version_hero_mock_tiles" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_hero_mock_tiles_parent_id_idx" ON "_tool_page_v_version_hero_mock_tiles" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_hero_mock_pours_tests_order_idx" ON "_tool_page_v_version_hero_mock_pours_tests" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_hero_mock_pours_tests_parent_id_idx" ON "_tool_page_v_version_hero_mock_pours_tests" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_hero_mock_pours_order_idx" ON "_tool_page_v_version_hero_mock_pours" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_hero_mock_pours_parent_id_idx" ON "_tool_page_v_version_hero_mock_pours" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_why_cards_order_idx" ON "_tool_page_v_version_why_cards" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_why_cards_parent_id_idx" ON "_tool_page_v_version_why_cards" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_features_cards_order_idx" ON "_tool_page_v_version_features_cards" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_features_cards_parent_id_idx" ON "_tool_page_v_version_features_cards" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_features_also_order_idx" ON "_tool_page_v_version_features_also" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_features_also_parent_id_idx" ON "_tool_page_v_version_features_also" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_how_steps_order_idx" ON "_tool_page_v_version_how_steps" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_how_steps_parent_id_idx" ON "_tool_page_v_version_how_steps" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_privacy_points_order_idx" ON "_tool_page_v_version_privacy_points" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_privacy_points_parent_id_idx" ON "_tool_page_v_version_privacy_points" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_privacy_tree_entries_order_idx" ON "_tool_page_v_version_privacy_tree_entries" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_privacy_tree_entries_parent_id_idx" ON "_tool_page_v_version_privacy_tree_entries" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_requirements_cards_order_idx" ON "_tool_page_v_version_requirements_cards" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_requirements_cards_parent_id_idx" ON "_tool_page_v_version_requirements_cards" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_download_ticks_order_idx" ON "_tool_page_v_version_download_ticks" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_download_ticks_parent_id_idx" ON "_tool_page_v_version_download_ticks" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_upsell_adds_order_idx" ON "_tool_page_v_version_upsell_adds" USING btree ("_order");
  CREATE INDEX "_tool_page_v_version_upsell_adds_parent_id_idx" ON "_tool_page_v_version_upsell_adds" USING btree ("_parent_id");
  CREATE INDEX "_tool_page_v_version_version__status_idx" ON "_tool_page_v" USING btree ("version__status");
  CREATE INDEX "_tool_page_v_created_at_idx" ON "_tool_page_v" USING btree ("created_at");
  CREATE INDEX "_tool_page_v_updated_at_idx" ON "_tool_page_v" USING btree ("updated_at");
  CREATE INDEX "_tool_page_v_latest_idx" ON "_tool_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tool_page_languages" CASCADE;
  DROP TABLE "tool_page_hero_promises" CASCADE;
  DROP TABLE "tool_page_hero_mock_tiles" CASCADE;
  DROP TABLE "tool_page_hero_mock_pours_tests" CASCADE;
  DROP TABLE "tool_page_hero_mock_pours" CASCADE;
  DROP TABLE "tool_page_why_cards" CASCADE;
  DROP TABLE "tool_page_features_cards" CASCADE;
  DROP TABLE "tool_page_features_also" CASCADE;
  DROP TABLE "tool_page_how_steps" CASCADE;
  DROP TABLE "tool_page_privacy_points" CASCADE;
  DROP TABLE "tool_page_privacy_tree_entries" CASCADE;
  DROP TABLE "tool_page_requirements_cards" CASCADE;
  DROP TABLE "tool_page_download_ticks" CASCADE;
  DROP TABLE "tool_page_upsell_adds" CASCADE;
  DROP TABLE "tool_page" CASCADE;
  DROP TABLE "_tool_page_v_version_languages" CASCADE;
  DROP TABLE "_tool_page_v_version_hero_promises" CASCADE;
  DROP TABLE "_tool_page_v_version_hero_mock_tiles" CASCADE;
  DROP TABLE "_tool_page_v_version_hero_mock_pours_tests" CASCADE;
  DROP TABLE "_tool_page_v_version_hero_mock_pours" CASCADE;
  DROP TABLE "_tool_page_v_version_why_cards" CASCADE;
  DROP TABLE "_tool_page_v_version_features_cards" CASCADE;
  DROP TABLE "_tool_page_v_version_features_also" CASCADE;
  DROP TABLE "_tool_page_v_version_how_steps" CASCADE;
  DROP TABLE "_tool_page_v_version_privacy_points" CASCADE;
  DROP TABLE "_tool_page_v_version_privacy_tree_entries" CASCADE;
  DROP TABLE "_tool_page_v_version_requirements_cards" CASCADE;
  DROP TABLE "_tool_page_v_version_download_ticks" CASCADE;
  DROP TABLE "_tool_page_v_version_upsell_adds" CASCADE;
  DROP TABLE "_tool_page_v" CASCADE;
  DROP TYPE "public"."enum_tool_page_languages";
  DROP TYPE "public"."enum_tool_page_hero_mock_tiles_tone";
  DROP TYPE "public"."enum_tool_page_hero_mock_pours_tests_tone";
  DROP TYPE "public"."enum_tool_page_status";
  DROP TYPE "public"."enum__tool_page_v_version_languages";
  DROP TYPE "public"."enum__tool_page_v_version_hero_mock_tiles_tone";
  DROP TYPE "public"."enum__tool_page_v_version_hero_mock_pours_tests_tone";
  DROP TYPE "public"."enum__tool_page_v_version_status";`)
}
