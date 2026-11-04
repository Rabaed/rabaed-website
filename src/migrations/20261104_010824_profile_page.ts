import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/** The Company profile's entry in the CMS (ticket 102): its hero, its Trust strip switch and its search tab. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_profile_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_profile_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__profile_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__profile_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "profile_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_profile_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "profile_page_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar
  );
  
  CREATE TABLE "profile_page_hero_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status_ar" varchar,
  	"status_en" varchar
  );
  
  CREATE TABLE "profile_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow_ar" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title_accent_ar" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_lead_ar" varchar,
  	"hero_lead_en" varchar,
  	"hero_demo_label_ar" varchar,
  	"hero_demo_label_en" varchar,
  	"hero_whatsapp_label_ar" varchar,
  	"hero_whatsapp_label_en" varchar,
  	"hero_demo_link_ar" varchar,
  	"hero_demo_link_en" varchar,
  	"hero_whatsapp_link_ar" varchar,
  	"hero_whatsapp_link_en" varchar,
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
  	"trust_strip_shows" boolean DEFAULT true,
  	"search_title_ar" varchar,
  	"search_title_en" varchar,
  	"search_description_ar" varchar,
  	"search_description_en" varchar,
  	"search_sharing_image_id" integer,
  	"_status" "enum_profile_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_profile_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__profile_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_profile_page_v_version_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_ar" varchar,
  	"line_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_hero_statuses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"status_ar" varchar,
  	"status_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow_ar" varchar,
  	"version_hero_eyebrow_en" varchar,
  	"version_hero_title_accent_ar" varchar,
  	"version_hero_title_accent_en" varchar,
  	"version_hero_lead_ar" varchar,
  	"version_hero_lead_en" varchar,
  	"version_hero_demo_label_ar" varchar,
  	"version_hero_demo_label_en" varchar,
  	"version_hero_whatsapp_label_ar" varchar,
  	"version_hero_whatsapp_label_en" varchar,
  	"version_hero_demo_link_ar" varchar,
  	"version_hero_demo_link_en" varchar,
  	"version_hero_whatsapp_link_ar" varchar,
  	"version_hero_whatsapp_link_en" varchar,
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
  	"version_trust_strip_shows" boolean DEFAULT true,
  	"version_search_title_ar" varchar,
  	"version_search_title_en" varchar,
  	"version_search_description_ar" varchar,
  	"version_search_description_en" varchar,
  	"version_search_sharing_image_id" integer,
  	"version__status" "enum__profile_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "profile_page_languages" ADD CONSTRAINT "profile_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_hero_title_lines" ADD CONSTRAINT "profile_page_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_hero_statuses" ADD CONSTRAINT "profile_page_hero_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_languages" ADD CONSTRAINT "_profile_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_hero_title_lines" ADD CONSTRAINT "_profile_page_v_version_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_hero_statuses" ADD CONSTRAINT "_profile_page_v_version_hero_statuses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_page_languages_order_idx" ON "profile_page_languages" USING btree ("order");
  CREATE INDEX "profile_page_languages_parent_idx" ON "profile_page_languages" USING btree ("parent_id");
  CREATE INDEX "profile_page_hero_title_lines_order_idx" ON "profile_page_hero_title_lines" USING btree ("_order");
  CREATE INDEX "profile_page_hero_title_lines_parent_id_idx" ON "profile_page_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "profile_page_hero_statuses_order_idx" ON "profile_page_hero_statuses" USING btree ("_order");
  CREATE INDEX "profile_page_hero_statuses_parent_id_idx" ON "profile_page_hero_statuses" USING btree ("_parent_id");
  CREATE INDEX "profile_page_search_search_sharing_image_idx" ON "profile_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "profile_page__status_idx" ON "profile_page" USING btree ("_status");
  CREATE INDEX "_profile_page_v_version_languages_order_idx" ON "_profile_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_profile_page_v_version_languages_parent_idx" ON "_profile_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_profile_page_v_version_hero_title_lines_order_idx" ON "_profile_page_v_version_hero_title_lines" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_hero_title_lines_parent_id_idx" ON "_profile_page_v_version_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_hero_statuses_order_idx" ON "_profile_page_v_version_hero_statuses" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_hero_statuses_parent_id_idx" ON "_profile_page_v_version_hero_statuses" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_search_version_search_sharing_im_idx" ON "_profile_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "_profile_page_v_version_version__status_idx" ON "_profile_page_v" USING btree ("version__status");
  CREATE INDEX "_profile_page_v_created_at_idx" ON "_profile_page_v" USING btree ("created_at");
  CREATE INDEX "_profile_page_v_updated_at_idx" ON "_profile_page_v" USING btree ("updated_at");
  CREATE INDEX "_profile_page_v_latest_idx" ON "_profile_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_page_languages" CASCADE;
  DROP TABLE "profile_page_hero_title_lines" CASCADE;
  DROP TABLE "profile_page_hero_statuses" CASCADE;
  DROP TABLE "profile_page" CASCADE;
  DROP TABLE "_profile_page_v_version_languages" CASCADE;
  DROP TABLE "_profile_page_v_version_hero_title_lines" CASCADE;
  DROP TABLE "_profile_page_v_version_hero_statuses" CASCADE;
  DROP TABLE "_profile_page_v" CASCADE;
  DROP TYPE "public"."enum_profile_page_languages";
  DROP TYPE "public"."enum_profile_page_status";
  DROP TYPE "public"."enum__profile_page_v_version_languages";
  DROP TYPE "public"."enum__profile_page_v_version_status";`)
}
