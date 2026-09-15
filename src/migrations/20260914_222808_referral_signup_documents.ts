import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_referral_signup_form_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__referral_signup_form_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_form_submissions_form" ADD VALUE 'referral-signup' BEFORE 'tool-download';
  CREATE TABLE "form_submissions_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_name" varchar,
  	"content_type" varchar,
  	"size" numeric,
  	"field" varchar,
  	"key" varchar
  );
  
  CREATE TABLE "referral_signup_form" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alert_address" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"submit" varchar,
  	"fine_print" varchar,
  	"fields_name_label" varchar,
  	"fields_name_placeholder" varchar,
  	"fields_name_message" varchar,
  	"fields_phone_label" varchar,
  	"fields_phone_placeholder" varchar,
  	"fields_phone_message" varchar,
  	"fields_email_label" varchar,
  	"fields_email_placeholder" varchar,
  	"fields_email_message" varchar,
  	"fields_city_label" varchar,
  	"fields_city_placeholder" varchar,
  	"fields_city_message" varchar,
  	"fields_profession_label" varchar,
  	"fields_profession_placeholder" varchar,
  	"fields_profession_message" varchar,
  	"fields_profession_options_option_engineer" varchar,
  	"fields_profession_options_option_project_manager" varchar,
  	"fields_profession_options_option_independent_consultant" varchar,
  	"fields_profession_options_option_contractor" varchar,
  	"fields_profession_options_option_real_estate_advisor" varchar,
  	"fields_profession_options_option_content_creator" varchar,
  	"fields_profession_options_option_other" varchar,
  	"fields_employer_label" varchar,
  	"fields_employer_placeholder" varchar,
  	"fields_employer_message" varchar,
  	"fields_iban_certificate_label" varchar,
  	"fields_iban_certificate_placeholder" varchar,
  	"fields_iban_certificate_message" varchar,
  	"fields_iban_certificate_too_large" varchar,
  	"fields_iban_certificate_wrong_type" varchar,
  	"fields_account_holder_label" varchar,
  	"fields_account_holder_placeholder" varchar,
  	"fields_account_holder_message" varchar,
  	"fields_commercial_registration_label" varchar,
  	"fields_commercial_registration_placeholder" varchar,
  	"fields_commercial_registration_message" varchar,
  	"fields_commercial_registration_too_large" varchar,
  	"fields_commercial_registration_wrong_type" varchar,
  	"fields_tax_registration_certificate_label" varchar,
  	"fields_tax_registration_certificate_placeholder" varchar,
  	"fields_tax_registration_certificate_message" varchar,
  	"fields_tax_registration_certificate_too_large" varchar,
  	"fields_tax_registration_certificate_wrong_type" varchar,
  	"fields_accept_terms_label" varchar,
  	"fields_accept_terms_message" varchar,
  	"fields_declare_no_conflict_label" varchar,
  	"fields_declare_no_conflict_message" varchar,
  	"received" varchar,
  	"refused" varchar,
  	"failed" varchar,
  	"confirmation_subject" varchar,
  	"confirmation_body" varchar,
  	"_status" "enum_referral_signup_form_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_referral_signup_form_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_alert_address" varchar,
  	"version_heading" varchar,
  	"version_lead" varchar,
  	"version_submit" varchar,
  	"version_fine_print" varchar,
  	"version_fields_name_label" varchar,
  	"version_fields_name_placeholder" varchar,
  	"version_fields_name_message" varchar,
  	"version_fields_phone_label" varchar,
  	"version_fields_phone_placeholder" varchar,
  	"version_fields_phone_message" varchar,
  	"version_fields_email_label" varchar,
  	"version_fields_email_placeholder" varchar,
  	"version_fields_email_message" varchar,
  	"version_fields_city_label" varchar,
  	"version_fields_city_placeholder" varchar,
  	"version_fields_city_message" varchar,
  	"version_fields_profession_label" varchar,
  	"version_fields_profession_placeholder" varchar,
  	"version_fields_profession_message" varchar,
  	"version_fields_profession_options_option_engineer" varchar,
  	"version_fields_profession_options_option_project_manager" varchar,
  	"version_fields_profession_options_option_independent_consultant" varchar,
  	"version_fields_profession_options_option_contractor" varchar,
  	"version_fields_profession_options_option_real_estate_advisor" varchar,
  	"version_fields_profession_options_option_content_creator" varchar,
  	"version_fields_profession_options_option_other" varchar,
  	"version_fields_employer_label" varchar,
  	"version_fields_employer_placeholder" varchar,
  	"version_fields_employer_message" varchar,
  	"version_fields_iban_certificate_label" varchar,
  	"version_fields_iban_certificate_placeholder" varchar,
  	"version_fields_iban_certificate_message" varchar,
  	"version_fields_iban_certificate_too_large" varchar,
  	"version_fields_iban_certificate_wrong_type" varchar,
  	"version_fields_account_holder_label" varchar,
  	"version_fields_account_holder_placeholder" varchar,
  	"version_fields_account_holder_message" varchar,
  	"version_fields_commercial_registration_label" varchar,
  	"version_fields_commercial_registration_placeholder" varchar,
  	"version_fields_commercial_registration_message" varchar,
  	"version_fields_commercial_registration_too_large" varchar,
  	"version_fields_commercial_registration_wrong_type" varchar,
  	"version_fields_tax_registration_certificate_label" varchar,
  	"version_fields_tax_registration_certificate_placeholder" varchar,
  	"version_fields_tax_registration_certificate_message" varchar,
  	"version_fields_tax_registration_certificate_too_large" varchar,
  	"version_fields_tax_registration_certificate_wrong_type" varchar,
  	"version_fields_accept_terms_label" varchar,
  	"version_fields_accept_terms_message" varchar,
  	"version_fields_declare_no_conflict_label" varchar,
  	"version_fields_declare_no_conflict_message" varchar,
  	"version_received" varchar,
  	"version_refused" varchar,
  	"version_failed" varchar,
  	"version_confirmation_subject" varchar,
  	"version_confirmation_body" varchar,
  	"version__status" "enum__referral_signup_form_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "form_submissions_documents" ADD CONSTRAINT "form_submissions_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "form_submissions_documents_order_idx" ON "form_submissions_documents" USING btree ("_order");
  CREATE INDEX "form_submissions_documents_parent_id_idx" ON "form_submissions_documents" USING btree ("_parent_id");
  CREATE INDEX "referral_signup_form__status_idx" ON "referral_signup_form" USING btree ("_status");
  CREATE INDEX "_referral_signup_form_v_version_version__status_idx" ON "_referral_signup_form_v" USING btree ("version__status");
  CREATE INDEX "_referral_signup_form_v_created_at_idx" ON "_referral_signup_form_v" USING btree ("created_at");
  CREATE INDEX "_referral_signup_form_v_updated_at_idx" ON "_referral_signup_form_v" USING btree ("updated_at");
  CREATE INDEX "_referral_signup_form_v_latest_idx" ON "_referral_signup_form_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "form_submissions_documents" CASCADE;
  DROP TABLE "referral_signup_form" CASCADE;
  DROP TABLE "_referral_signup_form_v" CASCADE;
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_form";
  CREATE TYPE "public"."enum_form_submissions_form" AS ENUM('demo-request', 'tool-download');
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE "public"."enum_form_submissions_form" USING "form"::"public"."enum_form_submissions_form";
  DROP TYPE "public"."enum_referral_signup_form_status";
  DROP TYPE "public"."enum__referral_signup_form_v_version_status";`)
}
