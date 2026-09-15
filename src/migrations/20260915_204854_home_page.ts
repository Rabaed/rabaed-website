import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_home_page_four_units_tabs_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum_home_page_blocks_comparison_icon" AS ENUM('approval', 'retrieval', 'time', 'governance', 'activation', 'onboarding');
  CREATE TYPE "public"."enum_home_page_blocks_commitment_icon" AS ENUM('approval', 'retrieval', 'time', 'governance', 'activation', 'onboarding');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__home_page_v_version_four_units_tabs_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum__home_page_v_blocks_comparison_icon" AS ENUM('approval', 'retrieval', 'time', 'governance', 'activation', 'onboarding');
  CREATE TYPE "public"."enum__home_page_v_blocks_commitment_icon" AS ENUM('approval', 'retrieval', 'time', 'governance', 'activation', 'onboarding');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_home_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar
  );
  
  CREATE TABLE "home_page_hero_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status_ar" varchar,
  	"status_en" varchar
  );
  
  CREATE TABLE "home_page_situations_situations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_ar" varchar,
  	"quote_en" varchar,
  	"cost_ar" varchar,
  	"cost_en" varchar
  );
  
  CREATE TABLE "home_page_four_units_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"final" boolean DEFAULT false,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"screen" "enum_home_page_four_units_tabs_screen"
  );
  
  CREATE TABLE "home_page_record_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar
  );
  
  CREATE TABLE "home_page_record_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question_ar" varchar,
  	"question_en" varchar
  );
  
  CREATE TABLE "home_page_record_types_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"action_ar" varchar,
  	"action_en" varchar,
  	"by_ar" varchar,
  	"by_en" varchar,
  	"time" varchar
  );
  
  CREATE TABLE "home_page_record_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "home_page_before_after_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"usual_channel_ar" varchar,
  	"usual_channel_en" varchar,
  	"usual_words_ar" varchar,
  	"usual_words_en" varchar,
  	"rabaed_channel_ar" varchar,
  	"rabaed_channel_en" varchar,
  	"rabaed_words_ar" varchar,
  	"rabaed_words_en" varchar
  );
  
  CREATE TABLE "home_page_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic_ar" varchar,
  	"topic_en" varchar,
  	"icon" "enum_home_page_blocks_comparison_icon",
  	"claim_ar" varchar,
  	"claim_en" varchar,
  	"figure" varchar,
  	"before_label_ar" varchar,
  	"before_label_en" varchar,
  	"before_height" numeric,
  	"after_label_ar" varchar,
  	"after_label_en" varchar,
  	"after_height" numeric,
  	"basis_ar" varchar,
  	"basis_en" varchar,
  	"source" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_commitment" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic_ar" varchar,
  	"topic_en" varchar,
  	"icon" "enum_home_page_blocks_commitment_icon",
  	"claim_ar" varchar,
  	"claim_en" varchar,
  	"value_ar" varchar,
  	"value_en" varchar,
  	"basis_ar" varchar,
  	"basis_en" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow_ar" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title_accent_ar" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_lead_ar" varchar,
  	"hero_lead_en" varchar,
  	"hero_primary_label_ar" varchar,
  	"hero_primary_label_en" varchar,
  	"hero_secondary_label_ar" varchar,
  	"hero_secondary_label_en" varchar,
  	"hero_trust_ar" varchar,
  	"hero_trust_en" varchar,
  	"hero_guarantee_period_ar" varchar,
  	"hero_guarantee_period_en" varchar,
  	"hero_guarantee_promise_ar" varchar,
  	"hero_guarantee_promise_en" varchar,
  	"hero_parties_owner_ar" varchar,
  	"hero_parties_owner_en" varchar,
  	"hero_parties_consultant_ar" varchar,
  	"hero_parties_consultant_en" varchar,
  	"hero_parties_contractor_ar" varchar,
  	"hero_parties_contractor_en" varchar,
  	"hero_diagram_description_ar" varchar,
  	"hero_diagram_description_en" varchar,
  	"hero_status_at_rest_ar" varchar,
  	"hero_status_at_rest_en" varchar,
  	"hero_pictures_owner_id" integer,
  	"hero_pictures_consultant_id" integer,
  	"hero_pictures_contractor_id" integer,
  	"hero_pictures_document_id" integer,
  	"trust_strip_shows" boolean DEFAULT true,
  	"situations_shows" boolean DEFAULT true,
  	"situations_eyebrow_ar" varchar,
  	"situations_eyebrow_en" varchar,
  	"situations_heading_ar" varchar,
  	"situations_heading_en" varchar,
  	"situations_close_first_ar" varchar,
  	"situations_close_first_en" varchar,
  	"situations_close_second_ar" varchar,
  	"situations_close_second_en" varchar,
  	"situations_close_accent_ar" varchar,
  	"situations_close_accent_en" varchar,
  	"situations_cost_label_ar" varchar,
  	"situations_cost_label_en" varchar,
  	"situations_deck_label_ar" varchar,
  	"situations_deck_label_en" varchar,
  	"situations_deck_previous_label_ar" varchar,
  	"situations_deck_previous_label_en" varchar,
  	"situations_deck_next_label_ar" varchar,
  	"situations_deck_next_label_en" varchar,
  	"situations_deck_hint_ar" varchar,
  	"situations_deck_hint_en" varchar,
  	"four_units_shows" boolean DEFAULT true,
  	"four_units_eyebrow_ar" varchar,
  	"four_units_eyebrow_en" varchar,
  	"four_units_heading_ar" varchar,
  	"four_units_heading_en" varchar,
  	"four_units_tabs_label_ar" varchar,
  	"four_units_tabs_label_en" varchar,
  	"four_units_output_label_ar" varchar,
  	"four_units_output_label_en" varchar,
  	"four_units_more_label_ar" varchar,
  	"four_units_more_label_en" varchar,
  	"record_shows" boolean DEFAULT true,
  	"record_eyebrow_ar" varchar,
  	"record_eyebrow_en" varchar,
  	"record_lead_ar" varchar,
  	"record_lead_en" varchar,
  	"record_stamp_ar" varchar,
  	"record_stamp_en" varchar,
  	"before_after_shows" boolean DEFAULT true,
  	"before_after_eyebrow_ar" varchar,
  	"before_after_eyebrow_en" varchar,
  	"before_after_heading_ar" varchar,
  	"before_after_heading_en" varchar,
  	"before_after_lead_ar" varchar,
  	"before_after_lead_en" varchar,
  	"before_after_usual_tag_ar" varchar,
  	"before_after_usual_tag_en" varchar,
  	"before_after_rabaed_tag_ar" varchar,
  	"before_after_rabaed_tag_en" varchar,
  	"before_after_handle_label_ar" varchar,
  	"before_after_handle_label_en" varchar,
  	"before_after_verdicts_usual_ar" varchar,
  	"before_after_verdicts_usual_en" varchar,
  	"before_after_verdicts_rabaed_ar" varchar,
  	"before_after_verdicts_rabaed_en" varchar,
  	"before_after_verdicts_between_ar" varchar,
  	"before_after_verdicts_between_en" varchar,
  	"calculator_shows" boolean DEFAULT true,
  	"calculator_eyebrow_ar" varchar,
  	"calculator_eyebrow_en" varchar,
  	"calculator_heading_ar" varchar,
  	"calculator_heading_en" varchar,
  	"calculator_lead_ar" varchar,
  	"calculator_lead_en" varchar,
  	"calculator_slider_labels_project_value_ar" varchar,
  	"calculator_slider_labels_project_value_en" varchar,
  	"calculator_slider_labels_delay_days_ar" varchar,
  	"calculator_slider_labels_delay_days_en" varchar,
  	"calculator_slider_labels_duration_months_ar" varchar,
  	"calculator_slider_labels_duration_months_en" varchar,
  	"calculator_result_label_ar" varchar,
  	"calculator_result_label_en" varchar,
  	"calculator_breakdown_financing_ar" varchar,
  	"calculator_breakdown_financing_en" varchar,
  	"calculator_breakdown_site_overhead_ar" varchar,
  	"calculator_breakdown_site_overhead_en" varchar,
  	"calculator_assumptions_ar" varchar,
  	"calculator_assumptions_en" varchar,
  	"calculator_call_to_action_label_ar" varchar,
  	"calculator_call_to_action_label_en" varchar,
  	"calculator_currency_ar" varchar,
  	"calculator_currency_en" varchar,
  	"calculator_days_one_ar" varchar,
  	"calculator_days_one_en" varchar,
  	"calculator_days_two_ar" varchar,
  	"calculator_days_two_en" varchar,
  	"calculator_days_few_ar" varchar,
  	"calculator_days_few_en" varchar,
  	"calculator_days_many_ar" varchar,
  	"calculator_days_many_en" varchar,
  	"calculator_months_few_ar" varchar,
  	"calculator_months_few_en" varchar,
  	"calculator_months_many_ar" varchar,
  	"calculator_months_many_en" varchar,
  	"figures_shows" boolean DEFAULT true,
  	"figures_eyebrow_ar" varchar,
  	"figures_eyebrow_en" varchar,
  	"figures_heading_ar" varchar,
  	"figures_heading_en" varchar,
  	"figures_lead_ar" varchar,
  	"figures_lead_en" varchar,
  	"figures_deck_label_ar" varchar,
  	"figures_deck_label_en" varchar,
  	"figures_deck_previous_label_ar" varchar,
  	"figures_deck_previous_label_en" varchar,
  	"figures_deck_next_label_ar" varchar,
  	"figures_deck_next_label_en" varchar,
  	"figures_deck_hint_ar" varchar,
  	"figures_deck_hint_en" varchar,
  	"questions_shows" boolean DEFAULT true,
  	"questions_eyebrow_ar" varchar,
  	"questions_eyebrow_en" varchar,
  	"questions_heading_ar" varchar,
  	"questions_heading_en" varchar,
  	"questions_more_label_ar" varchar,
  	"questions_more_label_en" varchar,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__home_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_hero_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"status_ar" varchar,
  	"status_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_situations_situations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote_ar" varchar,
  	"quote_en" varchar,
  	"cost_ar" varchar,
  	"cost_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_four_units_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"final" boolean DEFAULT false,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"screen" "enum__home_page_v_version_four_units_tabs_screen",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_record_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_record_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question_ar" varchar,
  	"question_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_record_types_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"action_ar" varchar,
  	"action_en" varchar,
  	"by_ar" varchar,
  	"by_en" varchar,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_record_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_before_after_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"usual_channel_ar" varchar,
  	"usual_channel_en" varchar,
  	"usual_words_ar" varchar,
  	"usual_words_en" varchar,
  	"rabaed_channel_ar" varchar,
  	"rabaed_channel_en" varchar,
  	"rabaed_words_ar" varchar,
  	"rabaed_words_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic_ar" varchar,
  	"topic_en" varchar,
  	"icon" "enum__home_page_v_blocks_comparison_icon",
  	"claim_ar" varchar,
  	"claim_en" varchar,
  	"figure" varchar,
  	"before_label_ar" varchar,
  	"before_label_en" varchar,
  	"before_height" numeric,
  	"after_label_ar" varchar,
  	"after_label_en" varchar,
  	"after_height" numeric,
  	"basis_ar" varchar,
  	"basis_en" varchar,
  	"source" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_commitment" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic_ar" varchar,
  	"topic_en" varchar,
  	"icon" "enum__home_page_v_blocks_commitment_icon",
  	"claim_ar" varchar,
  	"claim_en" varchar,
  	"value_ar" varchar,
  	"value_en" varchar,
  	"basis_ar" varchar,
  	"basis_en" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow_ar" varchar,
  	"version_hero_eyebrow_en" varchar,
  	"version_hero_title_accent_ar" varchar,
  	"version_hero_title_accent_en" varchar,
  	"version_hero_lead_ar" varchar,
  	"version_hero_lead_en" varchar,
  	"version_hero_primary_label_ar" varchar,
  	"version_hero_primary_label_en" varchar,
  	"version_hero_secondary_label_ar" varchar,
  	"version_hero_secondary_label_en" varchar,
  	"version_hero_trust_ar" varchar,
  	"version_hero_trust_en" varchar,
  	"version_hero_guarantee_period_ar" varchar,
  	"version_hero_guarantee_period_en" varchar,
  	"version_hero_guarantee_promise_ar" varchar,
  	"version_hero_guarantee_promise_en" varchar,
  	"version_hero_parties_owner_ar" varchar,
  	"version_hero_parties_owner_en" varchar,
  	"version_hero_parties_consultant_ar" varchar,
  	"version_hero_parties_consultant_en" varchar,
  	"version_hero_parties_contractor_ar" varchar,
  	"version_hero_parties_contractor_en" varchar,
  	"version_hero_diagram_description_ar" varchar,
  	"version_hero_diagram_description_en" varchar,
  	"version_hero_status_at_rest_ar" varchar,
  	"version_hero_status_at_rest_en" varchar,
  	"version_hero_pictures_owner_id" integer,
  	"version_hero_pictures_consultant_id" integer,
  	"version_hero_pictures_contractor_id" integer,
  	"version_hero_pictures_document_id" integer,
  	"version_trust_strip_shows" boolean DEFAULT true,
  	"version_situations_shows" boolean DEFAULT true,
  	"version_situations_eyebrow_ar" varchar,
  	"version_situations_eyebrow_en" varchar,
  	"version_situations_heading_ar" varchar,
  	"version_situations_heading_en" varchar,
  	"version_situations_close_first_ar" varchar,
  	"version_situations_close_first_en" varchar,
  	"version_situations_close_second_ar" varchar,
  	"version_situations_close_second_en" varchar,
  	"version_situations_close_accent_ar" varchar,
  	"version_situations_close_accent_en" varchar,
  	"version_situations_cost_label_ar" varchar,
  	"version_situations_cost_label_en" varchar,
  	"version_situations_deck_label_ar" varchar,
  	"version_situations_deck_label_en" varchar,
  	"version_situations_deck_previous_label_ar" varchar,
  	"version_situations_deck_previous_label_en" varchar,
  	"version_situations_deck_next_label_ar" varchar,
  	"version_situations_deck_next_label_en" varchar,
  	"version_situations_deck_hint_ar" varchar,
  	"version_situations_deck_hint_en" varchar,
  	"version_four_units_shows" boolean DEFAULT true,
  	"version_four_units_eyebrow_ar" varchar,
  	"version_four_units_eyebrow_en" varchar,
  	"version_four_units_heading_ar" varchar,
  	"version_four_units_heading_en" varchar,
  	"version_four_units_tabs_label_ar" varchar,
  	"version_four_units_tabs_label_en" varchar,
  	"version_four_units_output_label_ar" varchar,
  	"version_four_units_output_label_en" varchar,
  	"version_four_units_more_label_ar" varchar,
  	"version_four_units_more_label_en" varchar,
  	"version_record_shows" boolean DEFAULT true,
  	"version_record_eyebrow_ar" varchar,
  	"version_record_eyebrow_en" varchar,
  	"version_record_lead_ar" varchar,
  	"version_record_lead_en" varchar,
  	"version_record_stamp_ar" varchar,
  	"version_record_stamp_en" varchar,
  	"version_before_after_shows" boolean DEFAULT true,
  	"version_before_after_eyebrow_ar" varchar,
  	"version_before_after_eyebrow_en" varchar,
  	"version_before_after_heading_ar" varchar,
  	"version_before_after_heading_en" varchar,
  	"version_before_after_lead_ar" varchar,
  	"version_before_after_lead_en" varchar,
  	"version_before_after_usual_tag_ar" varchar,
  	"version_before_after_usual_tag_en" varchar,
  	"version_before_after_rabaed_tag_ar" varchar,
  	"version_before_after_rabaed_tag_en" varchar,
  	"version_before_after_handle_label_ar" varchar,
  	"version_before_after_handle_label_en" varchar,
  	"version_before_after_verdicts_usual_ar" varchar,
  	"version_before_after_verdicts_usual_en" varchar,
  	"version_before_after_verdicts_rabaed_ar" varchar,
  	"version_before_after_verdicts_rabaed_en" varchar,
  	"version_before_after_verdicts_between_ar" varchar,
  	"version_before_after_verdicts_between_en" varchar,
  	"version_calculator_shows" boolean DEFAULT true,
  	"version_calculator_eyebrow_ar" varchar,
  	"version_calculator_eyebrow_en" varchar,
  	"version_calculator_heading_ar" varchar,
  	"version_calculator_heading_en" varchar,
  	"version_calculator_lead_ar" varchar,
  	"version_calculator_lead_en" varchar,
  	"version_calculator_slider_labels_project_value_ar" varchar,
  	"version_calculator_slider_labels_project_value_en" varchar,
  	"version_calculator_slider_labels_delay_days_ar" varchar,
  	"version_calculator_slider_labels_delay_days_en" varchar,
  	"version_calculator_slider_labels_duration_months_ar" varchar,
  	"version_calculator_slider_labels_duration_months_en" varchar,
  	"version_calculator_result_label_ar" varchar,
  	"version_calculator_result_label_en" varchar,
  	"version_calculator_breakdown_financing_ar" varchar,
  	"version_calculator_breakdown_financing_en" varchar,
  	"version_calculator_breakdown_site_overhead_ar" varchar,
  	"version_calculator_breakdown_site_overhead_en" varchar,
  	"version_calculator_assumptions_ar" varchar,
  	"version_calculator_assumptions_en" varchar,
  	"version_calculator_call_to_action_label_ar" varchar,
  	"version_calculator_call_to_action_label_en" varchar,
  	"version_calculator_currency_ar" varchar,
  	"version_calculator_currency_en" varchar,
  	"version_calculator_days_one_ar" varchar,
  	"version_calculator_days_one_en" varchar,
  	"version_calculator_days_two_ar" varchar,
  	"version_calculator_days_two_en" varchar,
  	"version_calculator_days_few_ar" varchar,
  	"version_calculator_days_few_en" varchar,
  	"version_calculator_days_many_ar" varchar,
  	"version_calculator_days_many_en" varchar,
  	"version_calculator_months_few_ar" varchar,
  	"version_calculator_months_few_en" varchar,
  	"version_calculator_months_many_ar" varchar,
  	"version_calculator_months_many_en" varchar,
  	"version_figures_shows" boolean DEFAULT true,
  	"version_figures_eyebrow_ar" varchar,
  	"version_figures_eyebrow_en" varchar,
  	"version_figures_heading_ar" varchar,
  	"version_figures_heading_en" varchar,
  	"version_figures_lead_ar" varchar,
  	"version_figures_lead_en" varchar,
  	"version_figures_deck_label_ar" varchar,
  	"version_figures_deck_label_en" varchar,
  	"version_figures_deck_previous_label_ar" varchar,
  	"version_figures_deck_previous_label_en" varchar,
  	"version_figures_deck_next_label_ar" varchar,
  	"version_figures_deck_next_label_en" varchar,
  	"version_figures_deck_hint_ar" varchar,
  	"version_figures_deck_hint_en" varchar,
  	"version_questions_shows" boolean DEFAULT true,
  	"version_questions_eyebrow_ar" varchar,
  	"version_questions_eyebrow_en" varchar,
  	"version_questions_heading_ar" varchar,
  	"version_questions_heading_en" varchar,
  	"version_questions_more_label_ar" varchar,
  	"version_questions_more_label_en" varchar,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "home_page_languages" ADD CONSTRAINT "home_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_title_lines" ADD CONSTRAINT "home_page_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_statuses" ADD CONSTRAINT "home_page_hero_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_situations_situations" ADD CONSTRAINT "home_page_situations_situations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_four_units_tabs" ADD CONSTRAINT "home_page_four_units_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_record_heading_lines" ADD CONSTRAINT "home_page_record_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_record_questions" ADD CONSTRAINT "home_page_record_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_record_types_steps" ADD CONSTRAINT "home_page_record_types_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_record_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_record_types" ADD CONSTRAINT "home_page_record_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_before_after_steps" ADD CONSTRAINT "home_page_before_after_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_comparison" ADD CONSTRAINT "home_page_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_commitment" ADD CONSTRAINT "home_page_blocks_commitment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_pictures_owner_id_media_id_fk" FOREIGN KEY ("hero_pictures_owner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_pictures_consultant_id_media_id_fk" FOREIGN KEY ("hero_pictures_consultant_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_pictures_contractor_id_media_id_fk" FOREIGN KEY ("hero_pictures_contractor_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_pictures_document_id_media_id_fk" FOREIGN KEY ("hero_pictures_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_languages" ADD CONSTRAINT "_home_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_title_lines" ADD CONSTRAINT "_home_page_v_version_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_statuses" ADD CONSTRAINT "_home_page_v_version_hero_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_situations_situations" ADD CONSTRAINT "_home_page_v_version_situations_situations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_four_units_tabs" ADD CONSTRAINT "_home_page_v_version_four_units_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_record_heading_lines" ADD CONSTRAINT "_home_page_v_version_record_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_record_questions" ADD CONSTRAINT "_home_page_v_version_record_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_record_types_steps" ADD CONSTRAINT "_home_page_v_version_record_types_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_record_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_record_types" ADD CONSTRAINT "_home_page_v_version_record_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_before_after_steps" ADD CONSTRAINT "_home_page_v_version_before_after_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_comparison" ADD CONSTRAINT "_home_page_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_commitment" ADD CONSTRAINT "_home_page_v_blocks_commitment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_pictures_owner_id_media_id_fk" FOREIGN KEY ("version_hero_pictures_owner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_pictures_consultant_id_media_id_fk" FOREIGN KEY ("version_hero_pictures_consultant_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_pictures_contractor_id_media_id_fk" FOREIGN KEY ("version_hero_pictures_contractor_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_pictures_document_id_media_id_fk" FOREIGN KEY ("version_hero_pictures_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_languages_order_idx" ON "home_page_languages" USING btree ("order");
  CREATE INDEX "home_page_languages_parent_idx" ON "home_page_languages" USING btree ("parent_id");
  CREATE INDEX "home_page_hero_title_lines_order_idx" ON "home_page_hero_title_lines" USING btree ("_order");
  CREATE INDEX "home_page_hero_title_lines_parent_id_idx" ON "home_page_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_statuses_order_idx" ON "home_page_hero_statuses" USING btree ("_order");
  CREATE INDEX "home_page_hero_statuses_parent_id_idx" ON "home_page_hero_statuses" USING btree ("_parent_id");
  CREATE INDEX "home_page_situations_situations_order_idx" ON "home_page_situations_situations" USING btree ("_order");
  CREATE INDEX "home_page_situations_situations_parent_id_idx" ON "home_page_situations_situations" USING btree ("_parent_id");
  CREATE INDEX "home_page_four_units_tabs_order_idx" ON "home_page_four_units_tabs" USING btree ("_order");
  CREATE INDEX "home_page_four_units_tabs_parent_id_idx" ON "home_page_four_units_tabs" USING btree ("_parent_id");
  CREATE INDEX "home_page_record_heading_lines_order_idx" ON "home_page_record_heading_lines" USING btree ("_order");
  CREATE INDEX "home_page_record_heading_lines_parent_id_idx" ON "home_page_record_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_record_questions_order_idx" ON "home_page_record_questions" USING btree ("_order");
  CREATE INDEX "home_page_record_questions_parent_id_idx" ON "home_page_record_questions" USING btree ("_parent_id");
  CREATE INDEX "home_page_record_types_steps_order_idx" ON "home_page_record_types_steps" USING btree ("_order");
  CREATE INDEX "home_page_record_types_steps_parent_id_idx" ON "home_page_record_types_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_record_types_order_idx" ON "home_page_record_types" USING btree ("_order");
  CREATE INDEX "home_page_record_types_parent_id_idx" ON "home_page_record_types" USING btree ("_parent_id");
  CREATE INDEX "home_page_before_after_steps_order_idx" ON "home_page_before_after_steps" USING btree ("_order");
  CREATE INDEX "home_page_before_after_steps_parent_id_idx" ON "home_page_before_after_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_comparison_order_idx" ON "home_page_blocks_comparison" USING btree ("_order");
  CREATE INDEX "home_page_blocks_comparison_parent_id_idx" ON "home_page_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_comparison_path_idx" ON "home_page_blocks_comparison" USING btree ("_path");
  CREATE INDEX "home_page_blocks_commitment_order_idx" ON "home_page_blocks_commitment" USING btree ("_order");
  CREATE INDEX "home_page_blocks_commitment_parent_id_idx" ON "home_page_blocks_commitment" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_commitment_path_idx" ON "home_page_blocks_commitment" USING btree ("_path");
  CREATE INDEX "home_page_hero_pictures_hero_pictures_owner_idx" ON "home_page" USING btree ("hero_pictures_owner_id");
  CREATE INDEX "home_page_hero_pictures_hero_pictures_consultant_idx" ON "home_page" USING btree ("hero_pictures_consultant_id");
  CREATE INDEX "home_page_hero_pictures_hero_pictures_contractor_idx" ON "home_page" USING btree ("hero_pictures_contractor_id");
  CREATE INDEX "home_page_hero_pictures_hero_pictures_document_idx" ON "home_page" USING btree ("hero_pictures_document_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "_home_page_v_version_languages_order_idx" ON "_home_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_home_page_v_version_languages_parent_idx" ON "_home_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_version_hero_title_lines_order_idx" ON "_home_page_v_version_hero_title_lines" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_title_lines_parent_id_idx" ON "_home_page_v_version_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_hero_statuses_order_idx" ON "_home_page_v_version_hero_statuses" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_statuses_parent_id_idx" ON "_home_page_v_version_hero_statuses" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_situations_situations_order_idx" ON "_home_page_v_version_situations_situations" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_situations_situations_parent_id_idx" ON "_home_page_v_version_situations_situations" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_four_units_tabs_order_idx" ON "_home_page_v_version_four_units_tabs" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_four_units_tabs_parent_id_idx" ON "_home_page_v_version_four_units_tabs" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_record_heading_lines_order_idx" ON "_home_page_v_version_record_heading_lines" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_record_heading_lines_parent_id_idx" ON "_home_page_v_version_record_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_record_questions_order_idx" ON "_home_page_v_version_record_questions" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_record_questions_parent_id_idx" ON "_home_page_v_version_record_questions" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_record_types_steps_order_idx" ON "_home_page_v_version_record_types_steps" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_record_types_steps_parent_id_idx" ON "_home_page_v_version_record_types_steps" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_record_types_order_idx" ON "_home_page_v_version_record_types" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_record_types_parent_id_idx" ON "_home_page_v_version_record_types" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_before_after_steps_order_idx" ON "_home_page_v_version_before_after_steps" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_before_after_steps_parent_id_idx" ON "_home_page_v_version_before_after_steps" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_comparison_order_idx" ON "_home_page_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_comparison_parent_id_idx" ON "_home_page_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_comparison_path_idx" ON "_home_page_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_commitment_order_idx" ON "_home_page_v_blocks_commitment" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_commitment_parent_id_idx" ON "_home_page_v_blocks_commitment" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_commitment_path_idx" ON "_home_page_v_blocks_commitment" USING btree ("_path");
  CREATE INDEX "_home_page_v_version_hero_pictures_version_hero_pictures_idx" ON "_home_page_v" USING btree ("version_hero_pictures_owner_id");
  CREATE INDEX "_home_page_v_version_hero_pictures_version_hero_pictur_1_idx" ON "_home_page_v" USING btree ("version_hero_pictures_consultant_id");
  CREATE INDEX "_home_page_v_version_hero_pictures_version_hero_pictur_2_idx" ON "_home_page_v" USING btree ("version_hero_pictures_contractor_id");
  CREATE INDEX "_home_page_v_version_hero_pictures_version_hero_pictur_3_idx" ON "_home_page_v" USING btree ("version_hero_pictures_document_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_languages" CASCADE;
  DROP TABLE "home_page_hero_title_lines" CASCADE;
  DROP TABLE "home_page_hero_statuses" CASCADE;
  DROP TABLE "home_page_situations_situations" CASCADE;
  DROP TABLE "home_page_four_units_tabs" CASCADE;
  DROP TABLE "home_page_record_heading_lines" CASCADE;
  DROP TABLE "home_page_record_questions" CASCADE;
  DROP TABLE "home_page_record_types_steps" CASCADE;
  DROP TABLE "home_page_record_types" CASCADE;
  DROP TABLE "home_page_before_after_steps" CASCADE;
  DROP TABLE "home_page_blocks_comparison" CASCADE;
  DROP TABLE "home_page_blocks_commitment" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v_version_languages" CASCADE;
  DROP TABLE "_home_page_v_version_hero_title_lines" CASCADE;
  DROP TABLE "_home_page_v_version_hero_statuses" CASCADE;
  DROP TABLE "_home_page_v_version_situations_situations" CASCADE;
  DROP TABLE "_home_page_v_version_four_units_tabs" CASCADE;
  DROP TABLE "_home_page_v_version_record_heading_lines" CASCADE;
  DROP TABLE "_home_page_v_version_record_questions" CASCADE;
  DROP TABLE "_home_page_v_version_record_types_steps" CASCADE;
  DROP TABLE "_home_page_v_version_record_types" CASCADE;
  DROP TABLE "_home_page_v_version_before_after_steps" CASCADE;
  DROP TABLE "_home_page_v_blocks_comparison" CASCADE;
  DROP TABLE "_home_page_v_blocks_commitment" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TYPE "public"."enum_home_page_languages";
  DROP TYPE "public"."enum_home_page_four_units_tabs_screen";
  DROP TYPE "public"."enum_home_page_blocks_comparison_icon";
  DROP TYPE "public"."enum_home_page_blocks_commitment_icon";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_languages";
  DROP TYPE "public"."enum__home_page_v_version_four_units_tabs_screen";
  DROP TYPE "public"."enum__home_page_v_blocks_comparison_icon";
  DROP TYPE "public"."enum__home_page_v_blocks_commitment_icon";
  DROP TYPE "public"."enum__home_page_v_version_status";`)
}
