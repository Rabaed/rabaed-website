import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tool_download_form_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tool_download_form_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "tool_download_form" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alert_address" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"submit" varchar,
  	"fine_print" varchar,
  	"fields_first_name_label" varchar,
  	"fields_first_name_placeholder" varchar,
  	"fields_first_name_message" varchar,
  	"fields_last_name_label" varchar,
  	"fields_last_name_placeholder" varchar,
  	"fields_last_name_message" varchar,
  	"fields_country_code_label" varchar,
  	"fields_country_code_placeholder" varchar,
  	"fields_country_code_message" varchar,
  	"fields_country_code_options_option_966" varchar,
  	"fields_country_code_options_option_971" varchar,
  	"fields_country_code_options_option_965" varchar,
  	"fields_country_code_options_option_974" varchar,
  	"fields_country_code_options_option_973" varchar,
  	"fields_country_code_options_option_968" varchar,
  	"fields_country_code_options_option_962" varchar,
  	"fields_country_code_options_option_20" varchar,
  	"fields_country_code_options_option_90" varchar,
  	"fields_country_code_options_option_other" varchar,
  	"fields_phone_label" varchar,
  	"fields_phone_placeholder" varchar,
  	"fields_phone_message" varchar,
  	"fields_email_label" varchar,
  	"fields_email_placeholder" varchar,
  	"fields_email_message" varchar,
  	"fields_company_label" varchar,
  	"fields_company_placeholder" varchar,
  	"fields_company_message" varchar,
  	"received" varchar,
  	"refused" varchar,
  	"failed" varchar,
  	"confirmation_subject" varchar,
  	"confirmation_body" varchar,
  	"_status" "enum_tool_download_form_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_tool_download_form_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_alert_address" varchar,
  	"version_heading" varchar,
  	"version_lead" varchar,
  	"version_submit" varchar,
  	"version_fine_print" varchar,
  	"version_fields_first_name_label" varchar,
  	"version_fields_first_name_placeholder" varchar,
  	"version_fields_first_name_message" varchar,
  	"version_fields_last_name_label" varchar,
  	"version_fields_last_name_placeholder" varchar,
  	"version_fields_last_name_message" varchar,
  	"version_fields_country_code_label" varchar,
  	"version_fields_country_code_placeholder" varchar,
  	"version_fields_country_code_message" varchar,
  	"version_fields_country_code_options_option_966" varchar,
  	"version_fields_country_code_options_option_971" varchar,
  	"version_fields_country_code_options_option_965" varchar,
  	"version_fields_country_code_options_option_974" varchar,
  	"version_fields_country_code_options_option_973" varchar,
  	"version_fields_country_code_options_option_968" varchar,
  	"version_fields_country_code_options_option_962" varchar,
  	"version_fields_country_code_options_option_20" varchar,
  	"version_fields_country_code_options_option_90" varchar,
  	"version_fields_country_code_options_option_other" varchar,
  	"version_fields_phone_label" varchar,
  	"version_fields_phone_placeholder" varchar,
  	"version_fields_phone_message" varchar,
  	"version_fields_email_label" varchar,
  	"version_fields_email_placeholder" varchar,
  	"version_fields_email_message" varchar,
  	"version_fields_company_label" varchar,
  	"version_fields_company_placeholder" varchar,
  	"version_fields_company_message" varchar,
  	"version_received" varchar,
  	"version_refused" varchar,
  	"version_failed" varchar,
  	"version_confirmation_subject" varchar,
  	"version_confirmation_body" varchar,
  	"version__status" "enum__tool_download_form_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE INDEX "tool_download_form__status_idx" ON "tool_download_form" USING btree ("_status");
  CREATE INDEX "_tool_download_form_v_version_version__status_idx" ON "_tool_download_form_v" USING btree ("version__status");
  CREATE INDEX "_tool_download_form_v_created_at_idx" ON "_tool_download_form_v" USING btree ("created_at");
  CREATE INDEX "_tool_download_form_v_updated_at_idx" ON "_tool_download_form_v" USING btree ("updated_at");
  CREATE INDEX "_tool_download_form_v_latest_idx" ON "_tool_download_form_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tool_download_form" CASCADE;
  DROP TABLE "_tool_download_form_v" CASCADE;
  DROP TYPE "public"."enum_tool_download_form_status";
  DROP TYPE "public"."enum__tool_download_form_v_version_status";`)
}
