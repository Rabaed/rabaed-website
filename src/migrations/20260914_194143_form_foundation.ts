import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_form" AS ENUM('demo-request', 'tool-download');
  CREATE TYPE "public"."enum_form_submissions_alert" AS ENUM('sent', 'skipped', 'failed');
  CREATE TYPE "public"."enum_form_submissions_confirmation" AS ENUM('sent', 'skipped', 'failed');
  CREATE TYPE "public"."enum_demo_request_form_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__demo_request_form_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "form_submissions_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"option" varchar,
  	"field" varchar
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form" "enum_form_submissions_form" NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"alert" "enum_form_submissions_alert",
  	"confirmation" "enum_form_submissions_confirmation",
  	"token" varchar,
  	"source_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "demo_request_form" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alert_address" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"submit" varchar,
  	"fine_print" varchar,
  	"fields_name_label" varchar,
  	"fields_name_placeholder" varchar,
  	"fields_name_message" varchar,
  	"fields_email_label" varchar,
  	"fields_email_placeholder" varchar,
  	"fields_email_message" varchar,
  	"fields_role_label" varchar,
  	"fields_role_placeholder" varchar,
  	"fields_role_message" varchar,
  	"fields_role_options_option_owner" varchar,
  	"fields_role_options_option_consultant" varchar,
  	"fields_role_options_option_contractor" varchar,
  	"fields_phone_label" varchar,
  	"fields_phone_placeholder" varchar,
  	"fields_phone_message" varchar,
  	"fields_company_label" varchar,
  	"fields_company_placeholder" varchar,
  	"fields_company_message" varchar,
  	"fields_active_projects_label" varchar,
  	"fields_active_projects_placeholder" varchar,
  	"fields_active_projects_message" varchar,
  	"received" varchar,
  	"refused" varchar,
  	"failed" varchar,
  	"confirmation_subject" varchar,
  	"confirmation_body" varchar,
  	"_status" "enum_demo_request_form_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_demo_request_form_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_alert_address" varchar,
  	"version_heading" varchar,
  	"version_lead" varchar,
  	"version_submit" varchar,
  	"version_fine_print" varchar,
  	"version_fields_name_label" varchar,
  	"version_fields_name_placeholder" varchar,
  	"version_fields_name_message" varchar,
  	"version_fields_email_label" varchar,
  	"version_fields_email_placeholder" varchar,
  	"version_fields_email_message" varchar,
  	"version_fields_role_label" varchar,
  	"version_fields_role_placeholder" varchar,
  	"version_fields_role_message" varchar,
  	"version_fields_role_options_option_owner" varchar,
  	"version_fields_role_options_option_consultant" varchar,
  	"version_fields_role_options_option_contractor" varchar,
  	"version_fields_phone_label" varchar,
  	"version_fields_phone_placeholder" varchar,
  	"version_fields_phone_message" varchar,
  	"version_fields_company_label" varchar,
  	"version_fields_company_placeholder" varchar,
  	"version_fields_company_message" varchar,
  	"version_fields_active_projects_label" varchar,
  	"version_fields_active_projects_placeholder" varchar,
  	"version_fields_active_projects_message" varchar,
  	"version_received" varchar,
  	"version_refused" varchar,
  	"version_failed" varchar,
  	"version_confirmation_subject" varchar,
  	"version_confirmation_body" varchar,
  	"version__status" "enum__demo_request_form_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "form_submissions_answers" ADD CONSTRAINT "form_submissions_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "form_submissions_answers_order_idx" ON "form_submissions_answers" USING btree ("_order");
  CREATE INDEX "form_submissions_answers_parent_id_idx" ON "form_submissions_answers" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form");
  CREATE INDEX "form_submissions_email_idx" ON "form_submissions" USING btree ("email");
  CREATE UNIQUE INDEX "form_submissions_token_idx" ON "form_submissions" USING btree ("token");
  CREATE INDEX "form_submissions_source_hash_idx" ON "form_submissions" USING btree ("source_hash");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "demo_request_form__status_idx" ON "demo_request_form" USING btree ("_status");
  CREATE INDEX "_demo_request_form_v_version_version__status_idx" ON "_demo_request_form_v" USING btree ("version__status");
  CREATE INDEX "_demo_request_form_v_created_at_idx" ON "_demo_request_form_v" USING btree ("created_at");
  CREATE INDEX "_demo_request_form_v_updated_at_idx" ON "_demo_request_form_v" USING btree ("updated_at");
  CREATE INDEX "_demo_request_form_v_latest_idx" ON "_demo_request_form_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions_answers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "demo_request_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_demo_request_form_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "form_submissions_answers" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "demo_request_form" CASCADE;
  DROP TABLE "_demo_request_form_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TYPE "public"."enum_form_submissions_form";
  DROP TYPE "public"."enum_form_submissions_alert";
  DROP TYPE "public"."enum_form_submissions_confirmation";
  DROP TYPE "public"."enum_demo_request_form_status";
  DROP TYPE "public"."enum__demo_request_form_v_version_status";`)
}
