import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_product_page_journey_panels_flow_after" AS ENUM('towards', 'then', 'none');
  CREATE TYPE "public"."enum_product_page_journey_panels_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum_product_page_roles_roles_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum_product_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__product_page_v_version_journey_panels_flow_after" AS ENUM('towards', 'then', 'none');
  CREATE TYPE "public"."enum__product_page_v_version_journey_panels_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum__product_page_v_version_roles_roles_screen" AS ENUM('correspondence', 'kanban', 'daily-report', 'documents', 'stamped-sheet', 'overview', 'approvals-table', 'submittal');
  CREATE TYPE "public"."enum__product_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_closing_section_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_closing_section_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__closing_section_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__closing_section_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_screen_mocks_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_screen_mocks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__screen_mocks_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__screen_mocks_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "product_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_product_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "product_page_journey_panels_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"after" "enum_product_page_journey_panels_flow_after" DEFAULT 'towards'
  );
  
  CREATE TABLE "product_page_journey_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"final" boolean DEFAULT false,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"tagline_ar" varchar,
  	"tagline_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar,
  	"screen" "enum_product_page_journey_panels_screen"
  );
  
  CREATE TABLE "product_page_custom_strip_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar
  );
  
  CREATE TABLE "product_page_roles_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"promise_ar" varchar,
  	"promise_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar,
  	"objection_ar" varchar,
  	"objection_en" varchar,
  	"answer_ar" varchar,
  	"answer_en" varchar,
  	"screen" "enum_product_page_roles_roles_screen"
  );
  
  CREATE TABLE "product_page_roles_shared_promises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"promise_ar" varchar,
  	"promise_en" varchar
  );
  
  CREATE TABLE "product_page_reviewers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reviewer_ar" varchar,
  	"reviewer_en" varchar
  );
  
  CREATE TABLE "product_page_inner_cycle_cycles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"note_ar" varchar,
  	"note_en" varchar,
  	"crosses_ar" varchar,
  	"crosses_en" varchar
  );
  
  CREATE TABLE "product_page" (
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
  	"trust_strip_shows" boolean DEFAULT true,
  	"journey_eyebrow_ar" varchar,
  	"journey_eyebrow_en" varchar,
  	"journey_heading_ar" varchar,
  	"journey_heading_en" varchar,
  	"journey_output_label_ar" varchar,
  	"journey_output_label_en" varchar,
  	"custom_strip_shows" boolean DEFAULT true,
  	"custom_strip_eyebrow_ar" varchar,
  	"custom_strip_eyebrow_en" varchar,
  	"custom_strip_heading_ar" varchar,
  	"custom_strip_heading_en" varchar,
  	"custom_strip_badge_ar" varchar,
  	"custom_strip_badge_en" varchar,
  	"custom_strip_ask_label_ar" varchar,
  	"custom_strip_ask_label_en" varchar,
  	"roles_shows" boolean DEFAULT true,
  	"roles_eyebrow_ar" varchar,
  	"roles_eyebrow_en" varchar,
  	"roles_heading_ar" varchar,
  	"roles_heading_en" varchar,
  	"inner_cycle_shows" boolean DEFAULT true,
  	"inner_cycle_eyebrow_ar" varchar,
  	"inner_cycle_eyebrow_en" varchar,
  	"inner_cycle_heading_ar" varchar,
  	"inner_cycle_heading_en" varchar,
  	"inner_cycle_lead_ar" varchar,
  	"inner_cycle_lead_en" varchar,
  	"inner_cycle_private_tag_ar" varchar,
  	"inner_cycle_private_tag_en" varchar,
  	"inner_cycle_crosses_label_ar" varchar,
  	"inner_cycle_crosses_label_en" varchar,
  	"inner_cycle_review_again_ar" varchar,
  	"inner_cycle_review_again_en" varchar,
  	"inner_cycle_stays_inside_label_ar" varchar,
  	"inner_cycle_stays_inside_label_en" varchar,
  	"inner_cycle_stays_inside_text_ar" varchar,
  	"inner_cycle_stays_inside_text_en" varchar,
  	"inner_cycle_stays_inside_emphasis_ar" varchar,
  	"inner_cycle_stays_inside_emphasis_en" varchar,
  	"inner_cycle_crosses_out_label_ar" varchar,
  	"inner_cycle_crosses_out_label_en" varchar,
  	"inner_cycle_crosses_out_text_ar" varchar,
  	"inner_cycle_crosses_out_text_en" varchar,
  	"inner_cycle_crosses_out_emphasis_ar" varchar,
  	"inner_cycle_crosses_out_emphasis_en" varchar,
  	"_status" "enum_product_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_product_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__product_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_product_page_v_version_journey_panels_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"after" "enum__product_page_v_version_journey_panels_flow_after" DEFAULT 'towards',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v_version_journey_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"final" boolean DEFAULT false,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"tagline_ar" varchar,
  	"tagline_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar,
  	"screen" "enum__product_page_v_version_journey_panels_screen",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v_version_custom_strip_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v_version_roles_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"promise_ar" varchar,
  	"promise_en" varchar,
  	"body_ar" varchar,
  	"body_en" varchar,
  	"objection_ar" varchar,
  	"objection_en" varchar,
  	"answer_ar" varchar,
  	"answer_en" varchar,
  	"screen" "enum__product_page_v_version_roles_roles_screen",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v_version_roles_shared_promises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"promise_ar" varchar,
  	"promise_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_reviewers_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"reviewer_ar" varchar,
  	"reviewer_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v_version_inner_cycle_cycles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"party_ar" varchar,
  	"party_en" varchar,
  	"note_ar" varchar,
  	"note_en" varchar,
  	"crosses_ar" varchar,
  	"crosses_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_page_v" (
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
  	"version_trust_strip_shows" boolean DEFAULT true,
  	"version_journey_eyebrow_ar" varchar,
  	"version_journey_eyebrow_en" varchar,
  	"version_journey_heading_ar" varchar,
  	"version_journey_heading_en" varchar,
  	"version_journey_output_label_ar" varchar,
  	"version_journey_output_label_en" varchar,
  	"version_custom_strip_shows" boolean DEFAULT true,
  	"version_custom_strip_eyebrow_ar" varchar,
  	"version_custom_strip_eyebrow_en" varchar,
  	"version_custom_strip_heading_ar" varchar,
  	"version_custom_strip_heading_en" varchar,
  	"version_custom_strip_badge_ar" varchar,
  	"version_custom_strip_badge_en" varchar,
  	"version_custom_strip_ask_label_ar" varchar,
  	"version_custom_strip_ask_label_en" varchar,
  	"version_roles_shows" boolean DEFAULT true,
  	"version_roles_eyebrow_ar" varchar,
  	"version_roles_eyebrow_en" varchar,
  	"version_roles_heading_ar" varchar,
  	"version_roles_heading_en" varchar,
  	"version_inner_cycle_shows" boolean DEFAULT true,
  	"version_inner_cycle_eyebrow_ar" varchar,
  	"version_inner_cycle_eyebrow_en" varchar,
  	"version_inner_cycle_heading_ar" varchar,
  	"version_inner_cycle_heading_en" varchar,
  	"version_inner_cycle_lead_ar" varchar,
  	"version_inner_cycle_lead_en" varchar,
  	"version_inner_cycle_private_tag_ar" varchar,
  	"version_inner_cycle_private_tag_en" varchar,
  	"version_inner_cycle_crosses_label_ar" varchar,
  	"version_inner_cycle_crosses_label_en" varchar,
  	"version_inner_cycle_review_again_ar" varchar,
  	"version_inner_cycle_review_again_en" varchar,
  	"version_inner_cycle_stays_inside_label_ar" varchar,
  	"version_inner_cycle_stays_inside_label_en" varchar,
  	"version_inner_cycle_stays_inside_text_ar" varchar,
  	"version_inner_cycle_stays_inside_text_en" varchar,
  	"version_inner_cycle_stays_inside_emphasis_ar" varchar,
  	"version_inner_cycle_stays_inside_emphasis_en" varchar,
  	"version_inner_cycle_crosses_out_label_ar" varchar,
  	"version_inner_cycle_crosses_out_label_en" varchar,
  	"version_inner_cycle_crosses_out_text_ar" varchar,
  	"version_inner_cycle_crosses_out_text_en" varchar,
  	"version_inner_cycle_crosses_out_emphasis_ar" varchar,
  	"version_inner_cycle_crosses_out_emphasis_en" varchar,
  	"version__status" "enum__product_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "closing_section_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_closing_section_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "closing_section_closing_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "closing_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_eyebrow_ar" varchar,
  	"closing_eyebrow_en" varchar,
  	"closing_heading_ar" varchar,
  	"closing_heading_en" varchar,
  	"closing_more_label_ar" varchar,
  	"closing_more_label_en" varchar,
  	"_status" "enum_closing_section_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_closing_section_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__closing_section_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_closing_section_v_version_closing_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_closing_section_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_closing_eyebrow_ar" varchar,
  	"version_closing_eyebrow_en" varchar,
  	"version_closing_heading_ar" varchar,
  	"version_closing_heading_en" varchar,
  	"version_closing_more_label_ar" varchar,
  	"version_closing_more_label_en" varchar,
  	"version__status" "enum__closing_section_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "screen_mocks_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_screen_mocks_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "screen_mocks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"correspondence_picture_id" integer,
  	"correspondence_description_ar" varchar,
  	"correspondence_description_en" varchar,
  	"kanban_picture_id" integer,
  	"kanban_description_ar" varchar,
  	"kanban_description_en" varchar,
  	"daily_report_picture_id" integer,
  	"daily_report_description_ar" varchar,
  	"daily_report_description_en" varchar,
  	"documents_picture_id" integer,
  	"documents_description_ar" varchar,
  	"documents_description_en" varchar,
  	"stamped_sheet_picture_id" integer,
  	"stamped_sheet_description_ar" varchar,
  	"stamped_sheet_description_en" varchar,
  	"overview_picture_id" integer,
  	"overview_description_ar" varchar,
  	"overview_description_en" varchar,
  	"approvals_table_picture_id" integer,
  	"approvals_table_description_ar" varchar,
  	"approvals_table_description_en" varchar,
  	"submittal_picture_id" integer,
  	"submittal_description_ar" varchar,
  	"submittal_description_en" varchar,
  	"_status" "enum_screen_mocks_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_screen_mocks_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__screen_mocks_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_screen_mocks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_correspondence_picture_id" integer,
  	"version_correspondence_description_ar" varchar,
  	"version_correspondence_description_en" varchar,
  	"version_kanban_picture_id" integer,
  	"version_kanban_description_ar" varchar,
  	"version_kanban_description_en" varchar,
  	"version_daily_report_picture_id" integer,
  	"version_daily_report_description_ar" varchar,
  	"version_daily_report_description_en" varchar,
  	"version_documents_picture_id" integer,
  	"version_documents_description_ar" varchar,
  	"version_documents_description_en" varchar,
  	"version_stamped_sheet_picture_id" integer,
  	"version_stamped_sheet_description_ar" varchar,
  	"version_stamped_sheet_description_en" varchar,
  	"version_overview_picture_id" integer,
  	"version_overview_description_ar" varchar,
  	"version_overview_description_en" varchar,
  	"version_approvals_table_picture_id" integer,
  	"version_approvals_table_description_ar" varchar,
  	"version_approvals_table_description_en" varchar,
  	"version_submittal_picture_id" integer,
  	"version_submittal_description_ar" varchar,
  	"version_submittal_description_en" varchar,
  	"version__status" "enum__screen_mocks_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "product_page_languages" ADD CONSTRAINT "product_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_journey_panels_flow" ADD CONSTRAINT "product_page_journey_panels_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_journey_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_journey_panels" ADD CONSTRAINT "product_page_journey_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_custom_strip_features" ADD CONSTRAINT "product_page_custom_strip_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_roles_roles" ADD CONSTRAINT "product_page_roles_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_roles_shared_promises" ADD CONSTRAINT "product_page_roles_shared_promises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_reviewers" ADD CONSTRAINT "product_page_reviewers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_inner_cycle_cycles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_inner_cycle_cycles" ADD CONSTRAINT "product_page_inner_cycle_cycles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_languages" ADD CONSTRAINT "_product_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_journey_panels_flow" ADD CONSTRAINT "_product_page_v_version_journey_panels_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v_version_journey_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_journey_panels" ADD CONSTRAINT "_product_page_v_version_journey_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_custom_strip_features" ADD CONSTRAINT "_product_page_v_version_custom_strip_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_roles_roles" ADD CONSTRAINT "_product_page_v_version_roles_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_roles_shared_promises" ADD CONSTRAINT "_product_page_v_version_roles_shared_promises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_reviewers_v" ADD CONSTRAINT "_product_page_reviewers_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v_version_inner_cycle_cycles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_page_v_version_inner_cycle_cycles" ADD CONSTRAINT "_product_page_v_version_inner_cycle_cycles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "closing_section_languages" ADD CONSTRAINT "closing_section_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."closing_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "closing_section_closing_steps" ADD CONSTRAINT "closing_section_closing_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."closing_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_closing_section_v_version_languages" ADD CONSTRAINT "_closing_section_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_closing_section_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_closing_section_v_version_closing_steps" ADD CONSTRAINT "_closing_section_v_version_closing_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_closing_section_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_mocks_languages" ADD CONSTRAINT "screen_mocks_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."screen_mocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_correspondence_picture_id_media_id_fk" FOREIGN KEY ("correspondence_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_kanban_picture_id_media_id_fk" FOREIGN KEY ("kanban_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_daily_report_picture_id_media_id_fk" FOREIGN KEY ("daily_report_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_documents_picture_id_media_id_fk" FOREIGN KEY ("documents_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_stamped_sheet_picture_id_media_id_fk" FOREIGN KEY ("stamped_sheet_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_overview_picture_id_media_id_fk" FOREIGN KEY ("overview_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_approvals_table_picture_id_media_id_fk" FOREIGN KEY ("approvals_table_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_submittal_picture_id_media_id_fk" FOREIGN KEY ("submittal_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v_version_languages" ADD CONSTRAINT "_screen_mocks_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_screen_mocks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_correspondence_picture_id_media_id_fk" FOREIGN KEY ("version_correspondence_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_kanban_picture_id_media_id_fk" FOREIGN KEY ("version_kanban_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_daily_report_picture_id_media_id_fk" FOREIGN KEY ("version_daily_report_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_documents_picture_id_media_id_fk" FOREIGN KEY ("version_documents_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_stamped_sheet_picture_id_media_id_fk" FOREIGN KEY ("version_stamped_sheet_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_overview_picture_id_media_id_fk" FOREIGN KEY ("version_overview_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_approvals_table_picture_id_media_id_fk" FOREIGN KEY ("version_approvals_table_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_submittal_picture_id_media_id_fk" FOREIGN KEY ("version_submittal_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_page_languages_order_idx" ON "product_page_languages" USING btree ("order");
  CREATE INDEX "product_page_languages_parent_idx" ON "product_page_languages" USING btree ("parent_id");
  CREATE INDEX "product_page_journey_panels_flow_order_idx" ON "product_page_journey_panels_flow" USING btree ("_order");
  CREATE INDEX "product_page_journey_panels_flow_parent_id_idx" ON "product_page_journey_panels_flow" USING btree ("_parent_id");
  CREATE INDEX "product_page_journey_panels_order_idx" ON "product_page_journey_panels" USING btree ("_order");
  CREATE INDEX "product_page_journey_panels_parent_id_idx" ON "product_page_journey_panels" USING btree ("_parent_id");
  CREATE INDEX "product_page_custom_strip_features_order_idx" ON "product_page_custom_strip_features" USING btree ("_order");
  CREATE INDEX "product_page_custom_strip_features_parent_id_idx" ON "product_page_custom_strip_features" USING btree ("_parent_id");
  CREATE INDEX "product_page_roles_roles_order_idx" ON "product_page_roles_roles" USING btree ("_order");
  CREATE INDEX "product_page_roles_roles_parent_id_idx" ON "product_page_roles_roles" USING btree ("_parent_id");
  CREATE INDEX "product_page_roles_shared_promises_order_idx" ON "product_page_roles_shared_promises" USING btree ("_order");
  CREATE INDEX "product_page_roles_shared_promises_parent_id_idx" ON "product_page_roles_shared_promises" USING btree ("_parent_id");
  CREATE INDEX "product_page_reviewers_order_idx" ON "product_page_reviewers" USING btree ("_order");
  CREATE INDEX "product_page_reviewers_parent_id_idx" ON "product_page_reviewers" USING btree ("_parent_id");
  CREATE INDEX "product_page_inner_cycle_cycles_order_idx" ON "product_page_inner_cycle_cycles" USING btree ("_order");
  CREATE INDEX "product_page_inner_cycle_cycles_parent_id_idx" ON "product_page_inner_cycle_cycles" USING btree ("_parent_id");
  CREATE INDEX "product_page__status_idx" ON "product_page" USING btree ("_status");
  CREATE INDEX "_product_page_v_version_languages_order_idx" ON "_product_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_product_page_v_version_languages_parent_idx" ON "_product_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_product_page_v_version_journey_panels_flow_order_idx" ON "_product_page_v_version_journey_panels_flow" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_journey_panels_flow_parent_id_idx" ON "_product_page_v_version_journey_panels_flow" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_journey_panels_order_idx" ON "_product_page_v_version_journey_panels" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_journey_panels_parent_id_idx" ON "_product_page_v_version_journey_panels" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_custom_strip_features_order_idx" ON "_product_page_v_version_custom_strip_features" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_custom_strip_features_parent_id_idx" ON "_product_page_v_version_custom_strip_features" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_roles_roles_order_idx" ON "_product_page_v_version_roles_roles" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_roles_roles_parent_id_idx" ON "_product_page_v_version_roles_roles" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_roles_shared_promises_order_idx" ON "_product_page_v_version_roles_shared_promises" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_roles_shared_promises_parent_id_idx" ON "_product_page_v_version_roles_shared_promises" USING btree ("_parent_id");
  CREATE INDEX "_product_page_reviewers_v_order_idx" ON "_product_page_reviewers_v" USING btree ("_order");
  CREATE INDEX "_product_page_reviewers_v_parent_id_idx" ON "_product_page_reviewers_v" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_inner_cycle_cycles_order_idx" ON "_product_page_v_version_inner_cycle_cycles" USING btree ("_order");
  CREATE INDEX "_product_page_v_version_inner_cycle_cycles_parent_id_idx" ON "_product_page_v_version_inner_cycle_cycles" USING btree ("_parent_id");
  CREATE INDEX "_product_page_v_version_version__status_idx" ON "_product_page_v" USING btree ("version__status");
  CREATE INDEX "_product_page_v_created_at_idx" ON "_product_page_v" USING btree ("created_at");
  CREATE INDEX "_product_page_v_updated_at_idx" ON "_product_page_v" USING btree ("updated_at");
  CREATE INDEX "_product_page_v_latest_idx" ON "_product_page_v" USING btree ("latest");
  CREATE INDEX "closing_section_languages_order_idx" ON "closing_section_languages" USING btree ("order");
  CREATE INDEX "closing_section_languages_parent_idx" ON "closing_section_languages" USING btree ("parent_id");
  CREATE INDEX "closing_section_closing_steps_order_idx" ON "closing_section_closing_steps" USING btree ("_order");
  CREATE INDEX "closing_section_closing_steps_parent_id_idx" ON "closing_section_closing_steps" USING btree ("_parent_id");
  CREATE INDEX "closing_section__status_idx" ON "closing_section" USING btree ("_status");
  CREATE INDEX "_closing_section_v_version_languages_order_idx" ON "_closing_section_v_version_languages" USING btree ("order");
  CREATE INDEX "_closing_section_v_version_languages_parent_idx" ON "_closing_section_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_closing_section_v_version_closing_steps_order_idx" ON "_closing_section_v_version_closing_steps" USING btree ("_order");
  CREATE INDEX "_closing_section_v_version_closing_steps_parent_id_idx" ON "_closing_section_v_version_closing_steps" USING btree ("_parent_id");
  CREATE INDEX "_closing_section_v_version_version__status_idx" ON "_closing_section_v" USING btree ("version__status");
  CREATE INDEX "_closing_section_v_created_at_idx" ON "_closing_section_v" USING btree ("created_at");
  CREATE INDEX "_closing_section_v_updated_at_idx" ON "_closing_section_v" USING btree ("updated_at");
  CREATE INDEX "_closing_section_v_latest_idx" ON "_closing_section_v" USING btree ("latest");
  CREATE INDEX "screen_mocks_languages_order_idx" ON "screen_mocks_languages" USING btree ("order");
  CREATE INDEX "screen_mocks_languages_parent_idx" ON "screen_mocks_languages" USING btree ("parent_id");
  CREATE INDEX "screen_mocks_correspondence_correspondence_picture_idx" ON "screen_mocks" USING btree ("correspondence_picture_id");
  CREATE INDEX "screen_mocks_kanban_kanban_picture_idx" ON "screen_mocks" USING btree ("kanban_picture_id");
  CREATE INDEX "screen_mocks_daily_report_daily_report_picture_idx" ON "screen_mocks" USING btree ("daily_report_picture_id");
  CREATE INDEX "screen_mocks_documents_documents_picture_idx" ON "screen_mocks" USING btree ("documents_picture_id");
  CREATE INDEX "screen_mocks_stamped_sheet_stamped_sheet_picture_idx" ON "screen_mocks" USING btree ("stamped_sheet_picture_id");
  CREATE INDEX "screen_mocks_overview_overview_picture_idx" ON "screen_mocks" USING btree ("overview_picture_id");
  CREATE INDEX "screen_mocks_approvals_table_approvals_table_picture_idx" ON "screen_mocks" USING btree ("approvals_table_picture_id");
  CREATE INDEX "screen_mocks_submittal_submittal_picture_idx" ON "screen_mocks" USING btree ("submittal_picture_id");
  CREATE INDEX "screen_mocks__status_idx" ON "screen_mocks" USING btree ("_status");
  CREATE INDEX "_screen_mocks_v_version_languages_order_idx" ON "_screen_mocks_v_version_languages" USING btree ("order");
  CREATE INDEX "_screen_mocks_v_version_languages_parent_idx" ON "_screen_mocks_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_screen_mocks_v_version_correspondence_version_correspon_idx" ON "_screen_mocks_v" USING btree ("version_correspondence_picture_id");
  CREATE INDEX "_screen_mocks_v_version_kanban_version_kanban_picture_idx" ON "_screen_mocks_v" USING btree ("version_kanban_picture_id");
  CREATE INDEX "_screen_mocks_v_version_daily_report_version_daily_repor_idx" ON "_screen_mocks_v" USING btree ("version_daily_report_picture_id");
  CREATE INDEX "_screen_mocks_v_version_documents_version_documents_pict_idx" ON "_screen_mocks_v" USING btree ("version_documents_picture_id");
  CREATE INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped_sh_idx" ON "_screen_mocks_v" USING btree ("version_stamped_sheet_picture_id");
  CREATE INDEX "_screen_mocks_v_version_overview_version_overview_pictur_idx" ON "_screen_mocks_v" USING btree ("version_overview_picture_id");
  CREATE INDEX "_screen_mocks_v_version_approvals_table_version_approval_idx" ON "_screen_mocks_v" USING btree ("version_approvals_table_picture_id");
  CREATE INDEX "_screen_mocks_v_version_submittal_version_submittal_pict_idx" ON "_screen_mocks_v" USING btree ("version_submittal_picture_id");
  CREATE INDEX "_screen_mocks_v_version_version__status_idx" ON "_screen_mocks_v" USING btree ("version__status");
  CREATE INDEX "_screen_mocks_v_created_at_idx" ON "_screen_mocks_v" USING btree ("created_at");
  CREATE INDEX "_screen_mocks_v_updated_at_idx" ON "_screen_mocks_v" USING btree ("updated_at");
  CREATE INDEX "_screen_mocks_v_latest_idx" ON "_screen_mocks_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_page_languages" CASCADE;
  DROP TABLE "product_page_journey_panels_flow" CASCADE;
  DROP TABLE "product_page_journey_panels" CASCADE;
  DROP TABLE "product_page_custom_strip_features" CASCADE;
  DROP TABLE "product_page_roles_roles" CASCADE;
  DROP TABLE "product_page_roles_shared_promises" CASCADE;
  DROP TABLE "product_page_reviewers" CASCADE;
  DROP TABLE "product_page_inner_cycle_cycles" CASCADE;
  DROP TABLE "product_page" CASCADE;
  DROP TABLE "_product_page_v_version_languages" CASCADE;
  DROP TABLE "_product_page_v_version_journey_panels_flow" CASCADE;
  DROP TABLE "_product_page_v_version_journey_panels" CASCADE;
  DROP TABLE "_product_page_v_version_custom_strip_features" CASCADE;
  DROP TABLE "_product_page_v_version_roles_roles" CASCADE;
  DROP TABLE "_product_page_v_version_roles_shared_promises" CASCADE;
  DROP TABLE "_product_page_reviewers_v" CASCADE;
  DROP TABLE "_product_page_v_version_inner_cycle_cycles" CASCADE;
  DROP TABLE "_product_page_v" CASCADE;
  DROP TABLE "closing_section_languages" CASCADE;
  DROP TABLE "closing_section_closing_steps" CASCADE;
  DROP TABLE "closing_section" CASCADE;
  DROP TABLE "_closing_section_v_version_languages" CASCADE;
  DROP TABLE "_closing_section_v_version_closing_steps" CASCADE;
  DROP TABLE "_closing_section_v" CASCADE;
  DROP TABLE "screen_mocks_languages" CASCADE;
  DROP TABLE "screen_mocks" CASCADE;
  DROP TABLE "_screen_mocks_v_version_languages" CASCADE;
  DROP TABLE "_screen_mocks_v" CASCADE;
  DROP TYPE "public"."enum_product_page_languages";
  DROP TYPE "public"."enum_product_page_journey_panels_flow_after";
  DROP TYPE "public"."enum_product_page_journey_panels_screen";
  DROP TYPE "public"."enum_product_page_roles_roles_screen";
  DROP TYPE "public"."enum_product_page_status";
  DROP TYPE "public"."enum__product_page_v_version_languages";
  DROP TYPE "public"."enum__product_page_v_version_journey_panels_flow_after";
  DROP TYPE "public"."enum__product_page_v_version_journey_panels_screen";
  DROP TYPE "public"."enum__product_page_v_version_roles_roles_screen";
  DROP TYPE "public"."enum__product_page_v_version_status";
  DROP TYPE "public"."enum_closing_section_languages";
  DROP TYPE "public"."enum_closing_section_status";
  DROP TYPE "public"."enum__closing_section_v_version_languages";
  DROP TYPE "public"."enum__closing_section_v_version_status";
  DROP TYPE "public"."enum_screen_mocks_languages";
  DROP TYPE "public"."enum_screen_mocks_status";
  DROP TYPE "public"."enum__screen_mocks_v_version_languages";
  DROP TYPE "public"."enum__screen_mocks_v_version_status";`)
}
