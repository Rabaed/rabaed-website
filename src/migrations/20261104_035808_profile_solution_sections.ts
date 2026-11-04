import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/** The Company profile's sections 06 to 08 (ticket 107): our solution, the platform and the documented Record, each with its switch. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  ALTER TABLE "profile_page_parties_cards" ADD CONSTRAINT "profile_page_parties_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_platform_units" ADD CONSTRAINT "profile_page_platform_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_record_steps" ADD CONSTRAINT "profile_page_record_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_parties_cards" ADD CONSTRAINT "_profile_page_v_version_parties_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_platform_units" ADD CONSTRAINT "_profile_page_v_version_platform_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_record_steps" ADD CONSTRAINT "_profile_page_v_version_record_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_page_parties_cards_order_idx" ON "profile_page_parties_cards" USING btree ("_order");
  CREATE INDEX "profile_page_parties_cards_parent_id_idx" ON "profile_page_parties_cards" USING btree ("_parent_id");
  CREATE INDEX "profile_page_platform_units_order_idx" ON "profile_page_platform_units" USING btree ("_order");
  CREATE INDEX "profile_page_platform_units_parent_id_idx" ON "profile_page_platform_units" USING btree ("_parent_id");
  CREATE INDEX "profile_page_record_steps_order_idx" ON "profile_page_record_steps" USING btree ("_order");
  CREATE INDEX "profile_page_record_steps_parent_id_idx" ON "profile_page_record_steps" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_parties_cards_order_idx" ON "_profile_page_v_version_parties_cards" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_parties_cards_parent_id_idx" ON "_profile_page_v_version_parties_cards" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_platform_units_order_idx" ON "_profile_page_v_version_platform_units" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_platform_units_parent_id_idx" ON "_profile_page_v_version_platform_units" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_record_steps_order_idx" ON "_profile_page_v_version_record_steps" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_record_steps_parent_id_idx" ON "_profile_page_v_version_record_steps" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_page_parties_cards" CASCADE;
  DROP TABLE "profile_page_platform_units" CASCADE;
  DROP TABLE "profile_page_record_steps" CASCADE;
  DROP TABLE "_profile_page_v_version_parties_cards" CASCADE;
  DROP TABLE "_profile_page_v_version_platform_units" CASCADE;
  DROP TABLE "_profile_page_v_version_record_steps" CASCADE;
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
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_record_summary_en";`)
}
