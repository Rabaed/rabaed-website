import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * The Company profile's sections 01 to 04 (ticket 105): the truth, the real site, the trap and who we are, each with its switch.
 *
 * And, folded in by `cms:rebase-migrations`, ticket 108's: the Company
 * profile's files, kept exactly as they were uploaded (its videos, and ticket
 * 104's PDFs), and the before-and-after section — its words, and each of its
 * five comparisons' table, video and poster. Its first words are
 * `20261104_030926_import_profile_compare`'s.
 *
 * And ticket 107's: sections 06 to 08 — our solution, the platform and the
 * documented Record — each with its switch, the three party cards, the four
 * platform units and the Record card's four steps. Their first words are
 * `20261104_035809_seed_profile_solution_sections`'s.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
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
  
  CREATE TABLE "profile_page_parties_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"want_ar" varchar,
  	"want_en" varchar
  );
  
  CREATE TABLE "profile_page_platform_units" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "profile_page_record_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"verb_ar" varchar,
  	"verb_en" varchar,
  	"who_ar" varchar,
  	"who_en" varchar,
  	"time" varchar
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
  
  CREATE TABLE "_profile_page_v_version_parties_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"want_ar" varchar,
  	"want_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_platform_units" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_record_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"verb_ar" varchar,
  	"verb_en" varchar,
  	"who_ar" varchar,
  	"who_en" varchar,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "profile_files_id" integer;
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
  ALTER TABLE "profile_page" ADD COLUMN "parties_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "parties_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_lead_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_lead_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_record_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_record_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_footer_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "parties_footer_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "platform_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_lead_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_lead_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_output_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "platform_output_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "record_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_body_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_body_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_code" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_document_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_document_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_example_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_example_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_summary_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "record_summary_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_lead_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_lead_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_before_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_before_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_after_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_after_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_play_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_play_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_module_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_module_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_question_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_question_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_first_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_second_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_third_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_note_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_note_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_video_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_approvals_poster_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_module_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_module_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_question_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_question_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_first_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_second_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_third_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_note_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_note_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_video_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_documents_poster_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_module_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_module_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_question_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_question_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_first_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_second_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_third_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_note_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_note_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_video_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_correspondence_poster_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_module_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_module_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_question_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_question_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_first_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_second_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_third_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_note_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_note_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_video_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_dashboard_poster_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_module_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_module_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_question_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_question_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_first_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_second_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_before_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_before_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_after_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_third_row_after_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_note_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_note_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_video_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "compare_daily_report_poster_id" integer;
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
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_lead_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_lead_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_record_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_record_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_footer_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_parties_footer_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_lead_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_lead_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_output_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_platform_output_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_body_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_body_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_code" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_document_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_document_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_example_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_example_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_summary_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_record_summary_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_lead_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_lead_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_before_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_before_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_after_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_after_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_play_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_play_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_module_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_module_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_question_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_question_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_first_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_second_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_third_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_note_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_note_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_video_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_approvals_poster_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_module_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_module_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_question_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_question_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_first_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_second_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_third_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_note_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_note_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_video_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_documents_poster_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_module_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_module_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_question_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_question_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_first_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_second_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_third_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_note_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_note_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_video_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_correspondence_poster_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_module_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_module_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_question_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_question_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_first_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_second_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_third_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_note_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_note_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_video_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_dashboard_poster_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_module_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_module_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_question_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_question_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_first_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_second_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_before_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_before_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_after_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_third_row_after_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_note_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_note_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_video_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_compare_daily_report_poster_id" integer;
  ALTER TABLE "profile_page_numbers_figures" ADD CONSTRAINT "profile_page_numbers_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_trap_tools" ADD CONSTRAINT "profile_page_trap_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_parties_cards" ADD CONSTRAINT "profile_page_parties_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_platform_units" ADD CONSTRAINT "profile_page_platform_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_record_steps" ADD CONSTRAINT "profile_page_record_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_numbers_figures" ADD CONSTRAINT "_profile_page_v_version_numbers_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_trap_tools" ADD CONSTRAINT "_profile_page_v_version_trap_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_parties_cards" ADD CONSTRAINT "_profile_page_v_version_parties_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_platform_units" ADD CONSTRAINT "_profile_page_v_version_platform_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_record_steps" ADD CONSTRAINT "_profile_page_v_version_record_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_files_updated_at_idx" ON "profile_files" USING btree ("updated_at");
  CREATE INDEX "profile_files_created_at_idx" ON "profile_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "profile_files_filename_idx" ON "profile_files" USING btree ("filename");
  CREATE INDEX "profile_page_numbers_figures_order_idx" ON "profile_page_numbers_figures" USING btree ("_order");
  CREATE INDEX "profile_page_numbers_figures_parent_id_idx" ON "profile_page_numbers_figures" USING btree ("_parent_id");
  CREATE INDEX "profile_page_trap_tools_order_idx" ON "profile_page_trap_tools" USING btree ("_order");
  CREATE INDEX "profile_page_trap_tools_parent_id_idx" ON "profile_page_trap_tools" USING btree ("_parent_id");
  CREATE INDEX "profile_page_parties_cards_order_idx" ON "profile_page_parties_cards" USING btree ("_order");
  CREATE INDEX "profile_page_parties_cards_parent_id_idx" ON "profile_page_parties_cards" USING btree ("_parent_id");
  CREATE INDEX "profile_page_platform_units_order_idx" ON "profile_page_platform_units" USING btree ("_order");
  CREATE INDEX "profile_page_platform_units_parent_id_idx" ON "profile_page_platform_units" USING btree ("_parent_id");
  CREATE INDEX "profile_page_record_steps_order_idx" ON "profile_page_record_steps" USING btree ("_order");
  CREATE INDEX "profile_page_record_steps_parent_id_idx" ON "profile_page_record_steps" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_numbers_figures_order_idx" ON "_profile_page_v_version_numbers_figures" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_numbers_figures_parent_id_idx" ON "_profile_page_v_version_numbers_figures" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_trap_tools_order_idx" ON "_profile_page_v_version_trap_tools" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_trap_tools_parent_id_idx" ON "_profile_page_v_version_trap_tools" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_parties_cards_order_idx" ON "_profile_page_v_version_parties_cards" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_parties_cards_parent_id_idx" ON "_profile_page_v_version_parties_cards" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_platform_units_order_idx" ON "_profile_page_v_version_platform_units" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_platform_units_parent_id_idx" ON "_profile_page_v_version_platform_units" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_record_steps_order_idx" ON "_profile_page_v_version_record_steps" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_record_steps_parent_id_idx" ON "_profile_page_v_version_record_steps" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profile_files_fk" FOREIGN KEY ("profile_files_id") REFERENCES "public"."profile_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_truth_photo_id_media_id_fk" FOREIGN KEY ("truth_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_approvals_video_id_profile_files_id_fk" FOREIGN KEY ("compare_approvals_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_approvals_poster_id_media_id_fk" FOREIGN KEY ("compare_approvals_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_documents_video_id_profile_files_id_fk" FOREIGN KEY ("compare_documents_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_documents_poster_id_media_id_fk" FOREIGN KEY ("compare_documents_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_correspondence_video_id_profile_files_id_fk" FOREIGN KEY ("compare_correspondence_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_correspondence_poster_id_media_id_fk" FOREIGN KEY ("compare_correspondence_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_dashboard_video_id_profile_files_id_fk" FOREIGN KEY ("compare_dashboard_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_dashboard_poster_id_media_id_fk" FOREIGN KEY ("compare_dashboard_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_daily_report_video_id_profile_files_id_fk" FOREIGN KEY ("compare_daily_report_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_compare_daily_report_poster_id_media_id_fk" FOREIGN KEY ("compare_daily_report_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_truth_photo_id_media_id_fk" FOREIGN KEY ("version_truth_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_approvals_video_id_profile_files_id_fk" FOREIGN KEY ("version_compare_approvals_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_approvals_poster_id_media_id_fk" FOREIGN KEY ("version_compare_approvals_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_documents_video_id_profile_files_id_fk" FOREIGN KEY ("version_compare_documents_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_documents_poster_id_media_id_fk" FOREIGN KEY ("version_compare_documents_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_correspondence_video_id_profile_files_id_fk" FOREIGN KEY ("version_compare_correspondence_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_correspondence_poster_id_media_id_fk" FOREIGN KEY ("version_compare_correspondence_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_dashboard_video_id_profile_files_id_fk" FOREIGN KEY ("version_compare_dashboard_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_dashboard_poster_id_media_id_fk" FOREIGN KEY ("version_compare_dashboard_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_daily_report_video_id_profile_files_id_fk" FOREIGN KEY ("version_compare_daily_report_video_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_compare_daily_report_poster_id_media_id_fk" FOREIGN KEY ("version_compare_daily_report_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_profile_files_id_idx" ON "payload_locked_documents_rels" USING btree ("profile_files_id");
  CREATE INDEX "profile_page_truth_truth_photo_idx" ON "profile_page" USING btree ("truth_photo_id");
  CREATE INDEX "profile_page_compare_approvals_compare_approvals_video_idx" ON "profile_page" USING btree ("compare_approvals_video_id");
  CREATE INDEX "profile_page_compare_approvals_compare_approvals_poster_idx" ON "profile_page" USING btree ("compare_approvals_poster_id");
  CREATE INDEX "profile_page_compare_documents_compare_documents_video_idx" ON "profile_page" USING btree ("compare_documents_video_id");
  CREATE INDEX "profile_page_compare_documents_compare_documents_poster_idx" ON "profile_page" USING btree ("compare_documents_poster_id");
  CREATE INDEX "profile_page_compare_correspondence_compare_corresponden_idx" ON "profile_page" USING btree ("compare_correspondence_video_id");
  CREATE INDEX "profile_page_compare_correspondence_compare_correspond_1_idx" ON "profile_page" USING btree ("compare_correspondence_poster_id");
  CREATE INDEX "profile_page_compare_dashboard_compare_dashboard_video_idx" ON "profile_page" USING btree ("compare_dashboard_video_id");
  CREATE INDEX "profile_page_compare_dashboard_compare_dashboard_poster_idx" ON "profile_page" USING btree ("compare_dashboard_poster_id");
  CREATE INDEX "profile_page_compare_daily_report_compare_daily_report_v_idx" ON "profile_page" USING btree ("compare_daily_report_video_id");
  CREATE INDEX "profile_page_compare_daily_report_compare_daily_report_p_idx" ON "profile_page" USING btree ("compare_daily_report_poster_id");
  CREATE INDEX "_profile_page_v_version_truth_version_truth_photo_idx" ON "_profile_page_v" USING btree ("version_truth_photo_id");
  CREATE INDEX "_profile_page_v_version_compare_approvals_version_compar_idx" ON "_profile_page_v" USING btree ("version_compare_approvals_video_id");
  CREATE INDEX "_profile_page_v_version_compare_approvals_version_comp_1_idx" ON "_profile_page_v" USING btree ("version_compare_approvals_poster_id");
  CREATE INDEX "_profile_page_v_version_compare_documents_version_compar_idx" ON "_profile_page_v" USING btree ("version_compare_documents_video_id");
  CREATE INDEX "_profile_page_v_version_compare_documents_version_comp_1_idx" ON "_profile_page_v" USING btree ("version_compare_documents_poster_id");
  CREATE INDEX "_profile_page_v_version_compare_correspondence_version_c_idx" ON "_profile_page_v" USING btree ("version_compare_correspondence_video_id");
  CREATE INDEX "_profile_page_v_version_compare_correspondence_version_1_idx" ON "_profile_page_v" USING btree ("version_compare_correspondence_poster_id");
  CREATE INDEX "_profile_page_v_version_compare_dashboard_version_compar_idx" ON "_profile_page_v" USING btree ("version_compare_dashboard_video_id");
  CREATE INDEX "_profile_page_v_version_compare_dashboard_version_comp_1_idx" ON "_profile_page_v" USING btree ("version_compare_dashboard_poster_id");
  CREATE INDEX "_profile_page_v_version_compare_daily_report_version_com_idx" ON "_profile_page_v" USING btree ("version_compare_daily_report_video_id");
  CREATE INDEX "_profile_page_v_version_compare_daily_report_version_c_1_idx" ON "_profile_page_v" USING btree ("version_compare_daily_report_poster_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_numbers_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_trap_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_parties_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_platform_units" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_page_record_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_numbers_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_trap_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_parties_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_platform_units" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_profile_page_v_version_record_steps" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "profile_files" CASCADE;
  DROP TABLE "profile_page_numbers_figures" CASCADE;
  DROP TABLE "profile_page_trap_tools" CASCADE;
  DROP TABLE "profile_page_parties_cards" CASCADE;
  DROP TABLE "profile_page_platform_units" CASCADE;
  DROP TABLE "profile_page_record_steps" CASCADE;
  DROP TABLE "_profile_page_v_version_numbers_figures" CASCADE;
  DROP TABLE "_profile_page_v_version_trap_tools" CASCADE;
  DROP TABLE "_profile_page_v_version_parties_cards" CASCADE;
  DROP TABLE "_profile_page_v_version_platform_units" CASCADE;
  DROP TABLE "_profile_page_v_version_record_steps" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_profile_files_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_truth_photo_id_media_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_approvals_video_id_profile_files_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_approvals_poster_id_media_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_documents_video_id_profile_files_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_documents_poster_id_media_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_correspondence_video_id_profile_files_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_correspondence_poster_id_media_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_dashboard_video_id_profile_files_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_dashboard_poster_id_media_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_daily_report_video_id_profile_files_id_fk";
  
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_compare_daily_report_poster_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_truth_photo_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_approvals_video_id_profile_files_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_approvals_poster_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_documents_video_id_profile_files_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_documents_poster_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_correspondence_video_id_profile_files_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_correspondence_poster_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_dashboard_video_id_profile_files_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_dashboard_poster_id_media_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_daily_report_video_id_profile_files_id_fk";
  
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_compare_daily_report_poster_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_profile_files_id_idx";
  DROP INDEX "profile_page_truth_truth_photo_idx";
  DROP INDEX "profile_page_compare_approvals_compare_approvals_video_idx";
  DROP INDEX "profile_page_compare_approvals_compare_approvals_poster_idx";
  DROP INDEX "profile_page_compare_documents_compare_documents_video_idx";
  DROP INDEX "profile_page_compare_documents_compare_documents_poster_idx";
  DROP INDEX "profile_page_compare_correspondence_compare_corresponden_idx";
  DROP INDEX "profile_page_compare_correspondence_compare_correspond_1_idx";
  DROP INDEX "profile_page_compare_dashboard_compare_dashboard_video_idx";
  DROP INDEX "profile_page_compare_dashboard_compare_dashboard_poster_idx";
  DROP INDEX "profile_page_compare_daily_report_compare_daily_report_v_idx";
  DROP INDEX "profile_page_compare_daily_report_compare_daily_report_p_idx";
  DROP INDEX "_profile_page_v_version_truth_version_truth_photo_idx";
  DROP INDEX "_profile_page_v_version_compare_approvals_version_compar_idx";
  DROP INDEX "_profile_page_v_version_compare_approvals_version_comp_1_idx";
  DROP INDEX "_profile_page_v_version_compare_documents_version_compar_idx";
  DROP INDEX "_profile_page_v_version_compare_documents_version_comp_1_idx";
  DROP INDEX "_profile_page_v_version_compare_correspondence_version_c_idx";
  DROP INDEX "_profile_page_v_version_compare_correspondence_version_1_idx";
  DROP INDEX "_profile_page_v_version_compare_dashboard_version_compar_idx";
  DROP INDEX "_profile_page_v_version_compare_dashboard_version_comp_1_idx";
  DROP INDEX "_profile_page_v_version_compare_daily_report_version_com_idx";
  DROP INDEX "_profile_page_v_version_compare_daily_report_version_c_1_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "profile_files_id";
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
  ALTER TABLE "profile_page" DROP COLUMN "parties_shows";
  ALTER TABLE "profile_page" DROP COLUMN "parties_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "parties_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "parties_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "parties_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "parties_lead_ar";
  ALTER TABLE "profile_page" DROP COLUMN "parties_lead_en";
  ALTER TABLE "profile_page" DROP COLUMN "parties_record_ar";
  ALTER TABLE "profile_page" DROP COLUMN "parties_record_en";
  ALTER TABLE "profile_page" DROP COLUMN "parties_footer_ar";
  ALTER TABLE "profile_page" DROP COLUMN "parties_footer_en";
  ALTER TABLE "profile_page" DROP COLUMN "platform_shows";
  ALTER TABLE "profile_page" DROP COLUMN "platform_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "platform_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "platform_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "platform_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "platform_lead_ar";
  ALTER TABLE "profile_page" DROP COLUMN "platform_lead_en";
  ALTER TABLE "profile_page" DROP COLUMN "platform_output_ar";
  ALTER TABLE "profile_page" DROP COLUMN "platform_output_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_shows";
  ALTER TABLE "profile_page" DROP COLUMN "record_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_body_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_body_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_code";
  ALTER TABLE "profile_page" DROP COLUMN "record_document_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_document_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_example_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_example_en";
  ALTER TABLE "profile_page" DROP COLUMN "record_summary_ar";
  ALTER TABLE "profile_page" DROP COLUMN "record_summary_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_lead_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_lead_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_before_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_before_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_after_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_after_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_play_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_play_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_module_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_module_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_question_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_question_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_first_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_second_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_third_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_note_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_note_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_video_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_approvals_poster_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_module_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_module_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_question_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_question_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_first_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_second_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_third_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_note_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_note_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_video_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_documents_poster_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_module_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_module_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_question_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_question_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_first_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_second_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_third_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_note_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_note_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_video_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_correspondence_poster_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_module_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_module_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_question_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_question_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_first_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_second_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_third_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_note_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_note_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_video_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_dashboard_poster_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_module_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_module_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_question_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_question_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_first_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_second_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_before_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_before_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_after_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_third_row_after_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_note_ar";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_note_en";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_video_id";
  ALTER TABLE "profile_page" DROP COLUMN "compare_daily_report_poster_id";
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
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_about_quote_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_lead_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_lead_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_record_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_record_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_footer_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_parties_footer_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_lead_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_lead_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_output_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_platform_output_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_body_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_body_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_code";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_document_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_document_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_example_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_example_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_summary_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_summary_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_lead_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_lead_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_before_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_before_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_after_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_after_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_play_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_play_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_module_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_module_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_question_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_question_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_first_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_second_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_third_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_note_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_note_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_video_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_approvals_poster_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_module_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_module_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_question_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_question_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_first_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_second_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_third_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_note_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_note_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_video_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_documents_poster_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_module_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_module_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_question_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_question_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_first_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_second_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_third_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_note_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_note_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_video_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_correspondence_poster_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_module_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_module_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_question_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_question_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_first_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_second_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_third_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_note_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_note_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_video_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_dashboard_poster_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_module_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_module_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_question_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_question_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_first_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_second_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_before_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_before_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_after_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_third_row_after_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_note_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_note_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_video_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_compare_daily_report_poster_id";`);
}
