import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Gives the Delay-cost calculator's words an entry of their own, for every page
 * that shows the calculator (ticket 103, ADR-0029), and takes them out of the
 * home page's entry, which keeps only its switch to show the calculator. The
 * project-length slider's words, the line splitting the cost in two and the
 * words after a number of months go with them: Ahmed's method has none.
 *
 * Empty here. `20261104_005957_import_delay_calculator` writes Ahmed's words in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_delay_calculator_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_delay_calculator_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__delay_calculator_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__delay_calculator_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "delay_calculator_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_delay_calculator_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "delay_calculator" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  	"calculator_slider_labels_progress_ar" varchar,
  	"calculator_slider_labels_progress_en" varchar,
  	"calculator_result_label_ar" varchar,
  	"calculator_result_label_en" varchar,
  	"calculator_spent_ar" varchar,
  	"calculator_spent_en" varchar,
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
  	"_status" "enum_delay_calculator_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_delay_calculator_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__delay_calculator_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_delay_calculator_v" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  	"version_calculator_slider_labels_progress_ar" varchar,
  	"version_calculator_slider_labels_progress_en" varchar,
  	"version_calculator_result_label_ar" varchar,
  	"version_calculator_result_label_en" varchar,
  	"version_calculator_spent_ar" varchar,
  	"version_calculator_spent_en" varchar,
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
  	"version__status" "enum__delay_calculator_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "delay_calculator_languages" ADD CONSTRAINT "delay_calculator_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."delay_calculator"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_delay_calculator_v_version_languages" ADD CONSTRAINT "_delay_calculator_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_delay_calculator_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "delay_calculator_languages_order_idx" ON "delay_calculator_languages" USING btree ("order");
  CREATE INDEX "delay_calculator_languages_parent_idx" ON "delay_calculator_languages" USING btree ("parent_id");
  CREATE INDEX "delay_calculator__status_idx" ON "delay_calculator" USING btree ("_status");
  CREATE INDEX "_delay_calculator_v_version_languages_order_idx" ON "_delay_calculator_v_version_languages" USING btree ("order");
  CREATE INDEX "_delay_calculator_v_version_languages_parent_idx" ON "_delay_calculator_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_delay_calculator_v_version_version__status_idx" ON "_delay_calculator_v" USING btree ("version__status");
  CREATE INDEX "_delay_calculator_v_created_at_idx" ON "_delay_calculator_v" USING btree ("created_at");
  CREATE INDEX "_delay_calculator_v_updated_at_idx" ON "_delay_calculator_v" USING btree ("updated_at");
  CREATE INDEX "_delay_calculator_v_latest_idx" ON "_delay_calculator_v" USING btree ("latest");
  ALTER TABLE "home_page" DROP COLUMN "calculator_eyebrow_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_eyebrow_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_heading_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_heading_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_lead_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_lead_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_project_value_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_project_value_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_delay_days_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_delay_days_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_duration_months_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_slider_labels_duration_months_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_result_label_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_result_label_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_breakdown_financing_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_breakdown_financing_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_breakdown_site_overhead_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_breakdown_site_overhead_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_assumptions_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_assumptions_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_call_to_action_label_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_call_to_action_label_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_currency_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_currency_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_one_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_one_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_two_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_two_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_few_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_few_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_many_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_days_many_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_months_few_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_months_few_en";
  ALTER TABLE "home_page" DROP COLUMN "calculator_months_many_ar";
  ALTER TABLE "home_page" DROP COLUMN "calculator_months_many_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_eyebrow_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_eyebrow_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_heading_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_heading_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_lead_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_lead_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_project_value_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_project_value_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_delay_days_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_delay_days_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_duration_months_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_slider_labels_duration_months_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_result_label_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_result_label_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_breakdown_financing_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_breakdown_financing_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_breakdown_site_overhead_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_breakdown_site_overhead_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_assumptions_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_assumptions_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_call_to_action_label_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_call_to_action_label_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_currency_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_currency_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_one_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_one_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_two_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_two_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_few_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_few_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_many_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_days_many_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_months_few_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_months_few_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_months_many_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_calculator_months_many_en";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "delay_calculator_languages" CASCADE;
  DROP TABLE "delay_calculator" CASCADE;
  DROP TABLE "_delay_calculator_v_version_languages" CASCADE;
  DROP TABLE "_delay_calculator_v" CASCADE;
  ALTER TABLE "home_page" ADD COLUMN "calculator_eyebrow_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_eyebrow_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_heading_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_heading_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_lead_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_lead_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_project_value_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_project_value_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_delay_days_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_delay_days_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_duration_months_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_slider_labels_duration_months_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_result_label_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_result_label_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_breakdown_financing_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_breakdown_financing_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_breakdown_site_overhead_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_breakdown_site_overhead_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_assumptions_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_assumptions_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_call_to_action_label_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_call_to_action_label_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_currency_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_currency_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_one_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_one_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_two_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_two_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_few_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_few_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_many_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_days_many_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_months_few_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_months_few_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_months_many_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "calculator_months_many_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_eyebrow_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_eyebrow_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_heading_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_heading_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_lead_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_lead_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_project_value_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_project_value_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_delay_days_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_delay_days_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_duration_months_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_slider_labels_duration_months_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_result_label_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_result_label_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_breakdown_financing_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_breakdown_financing_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_breakdown_site_overhead_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_breakdown_site_overhead_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_assumptions_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_assumptions_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_call_to_action_label_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_call_to_action_label_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_currency_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_currency_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_one_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_one_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_two_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_two_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_few_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_few_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_many_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_days_many_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_months_few_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_months_few_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_months_many_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_calculator_months_many_en" varchar;
  DROP TYPE "public"."enum_delay_calculator_languages";
  DROP TYPE "public"."enum_delay_calculator_status";
  DROP TYPE "public"."enum__delay_calculator_v_version_languages";
  DROP TYPE "public"."enum__delay_calculator_v_version_status";`)
}
