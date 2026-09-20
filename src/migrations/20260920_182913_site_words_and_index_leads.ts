import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_words_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_site_words_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_words_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__site_words_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_index_leads_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_index_leads_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__index_leads_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__index_leads_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "site_words_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_words_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_words_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar
  );
  
  CREATE TABLE "site_words_header_partnerships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"summary_ar" varchar,
  	"summary_en" varchar,
  	"path" varchar
  );
  
  CREATE TABLE "site_words_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar
  );
  
  CREATE TABLE "site_words" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_partnerships_label_ar" varchar,
  	"header_partnerships_label_en" varchar,
  	"header_sign_in_label_ar" varchar,
  	"header_sign_in_label_en" varchar,
  	"header_sign_in_url" varchar,
  	"header_demo_label_ar" varchar,
  	"header_demo_label_en" varchar,
  	"footer_tagline_ar" varchar,
  	"footer_tagline_en" varchar,
  	"footer_rights_ar" varchar,
  	"footer_rights_en" varchar,
  	"not_found_heading_ar" varchar,
  	"not_found_heading_en" varchar,
  	"not_found_lead_ar" varchar,
  	"not_found_lead_en" varchar,
  	"not_found_home_label_ar" varchar,
  	"not_found_home_label_en" varchar,
  	"_status" "enum_site_words_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_words_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__site_words_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_site_words_v_version_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_words_v_version_header_partnerships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"summary_ar" varchar,
  	"summary_en" varchar,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_words_v_version_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_words_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_header_partnerships_label_ar" varchar,
  	"version_header_partnerships_label_en" varchar,
  	"version_header_sign_in_label_ar" varchar,
  	"version_header_sign_in_label_en" varchar,
  	"version_header_sign_in_url" varchar,
  	"version_header_demo_label_ar" varchar,
  	"version_header_demo_label_en" varchar,
  	"version_footer_tagline_ar" varchar,
  	"version_footer_tagline_en" varchar,
  	"version_footer_rights_ar" varchar,
  	"version_footer_rights_en" varchar,
  	"version_not_found_heading_ar" varchar,
  	"version_not_found_heading_en" varchar,
  	"version_not_found_lead_ar" varchar,
  	"version_not_found_lead_en" varchar,
  	"version_not_found_home_label_ar" varchar,
  	"version_not_found_home_label_en" varchar,
  	"version__status" "enum__site_words_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "index_leads_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_index_leads_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "index_leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blog_lead_ar" varchar,
  	"blog_lead_en" varchar,
  	"case_studies_lead_ar" varchar,
  	"case_studies_lead_en" varchar,
  	"_status" "enum_index_leads_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_index_leads_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__index_leads_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_index_leads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_blog_lead_ar" varchar,
  	"version_blog_lead_en" varchar,
  	"version_case_studies_lead_ar" varchar,
  	"version_case_studies_lead_en" varchar,
  	"version__status" "enum__index_leads_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "site_words_languages" ADD CONSTRAINT "site_words_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_words_header_links" ADD CONSTRAINT "site_words_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_words_header_partnerships" ADD CONSTRAINT "site_words_header_partnerships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_words_footer_legal_links" ADD CONSTRAINT "site_words_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_languages" ADD CONSTRAINT "_site_words_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_header_links" ADD CONSTRAINT "_site_words_v_version_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_header_partnerships" ADD CONSTRAINT "_site_words_v_version_header_partnerships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_words_v_version_footer_legal_links" ADD CONSTRAINT "_site_words_v_version_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_words_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "index_leads_languages" ADD CONSTRAINT "index_leads_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."index_leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_index_leads_v_version_languages" ADD CONSTRAINT "_index_leads_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_index_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_words_languages_order_idx" ON "site_words_languages" USING btree ("order");
  CREATE INDEX "site_words_languages_parent_idx" ON "site_words_languages" USING btree ("parent_id");
  CREATE INDEX "site_words_header_links_order_idx" ON "site_words_header_links" USING btree ("_order");
  CREATE INDEX "site_words_header_links_parent_id_idx" ON "site_words_header_links" USING btree ("_parent_id");
  CREATE INDEX "site_words_header_partnerships_order_idx" ON "site_words_header_partnerships" USING btree ("_order");
  CREATE INDEX "site_words_header_partnerships_parent_id_idx" ON "site_words_header_partnerships" USING btree ("_parent_id");
  CREATE INDEX "site_words_footer_legal_links_order_idx" ON "site_words_footer_legal_links" USING btree ("_order");
  CREATE INDEX "site_words_footer_legal_links_parent_id_idx" ON "site_words_footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "site_words__status_idx" ON "site_words" USING btree ("_status");
  CREATE INDEX "_site_words_v_version_languages_order_idx" ON "_site_words_v_version_languages" USING btree ("order");
  CREATE INDEX "_site_words_v_version_languages_parent_idx" ON "_site_words_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_site_words_v_version_header_links_order_idx" ON "_site_words_v_version_header_links" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_header_links_parent_id_idx" ON "_site_words_v_version_header_links" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_header_partnerships_order_idx" ON "_site_words_v_version_header_partnerships" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_header_partnerships_parent_id_idx" ON "_site_words_v_version_header_partnerships" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_footer_legal_links_order_idx" ON "_site_words_v_version_footer_legal_links" USING btree ("_order");
  CREATE INDEX "_site_words_v_version_footer_legal_links_parent_id_idx" ON "_site_words_v_version_footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "_site_words_v_version_version__status_idx" ON "_site_words_v" USING btree ("version__status");
  CREATE INDEX "_site_words_v_created_at_idx" ON "_site_words_v" USING btree ("created_at");
  CREATE INDEX "_site_words_v_updated_at_idx" ON "_site_words_v" USING btree ("updated_at");
  CREATE INDEX "_site_words_v_latest_idx" ON "_site_words_v" USING btree ("latest");
  CREATE INDEX "index_leads_languages_order_idx" ON "index_leads_languages" USING btree ("order");
  CREATE INDEX "index_leads_languages_parent_idx" ON "index_leads_languages" USING btree ("parent_id");
  CREATE INDEX "index_leads__status_idx" ON "index_leads" USING btree ("_status");
  CREATE INDEX "_index_leads_v_version_languages_order_idx" ON "_index_leads_v_version_languages" USING btree ("order");
  CREATE INDEX "_index_leads_v_version_languages_parent_idx" ON "_index_leads_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_index_leads_v_version_version__status_idx" ON "_index_leads_v" USING btree ("version__status");
  CREATE INDEX "_index_leads_v_created_at_idx" ON "_index_leads_v" USING btree ("created_at");
  CREATE INDEX "_index_leads_v_updated_at_idx" ON "_index_leads_v" USING btree ("updated_at");
  CREATE INDEX "_index_leads_v_latest_idx" ON "_index_leads_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_words_languages" CASCADE;
  DROP TABLE "site_words_header_links" CASCADE;
  DROP TABLE "site_words_header_partnerships" CASCADE;
  DROP TABLE "site_words_footer_legal_links" CASCADE;
  DROP TABLE "site_words" CASCADE;
  DROP TABLE "_site_words_v_version_languages" CASCADE;
  DROP TABLE "_site_words_v_version_header_links" CASCADE;
  DROP TABLE "_site_words_v_version_header_partnerships" CASCADE;
  DROP TABLE "_site_words_v_version_footer_legal_links" CASCADE;
  DROP TABLE "_site_words_v" CASCADE;
  DROP TABLE "index_leads_languages" CASCADE;
  DROP TABLE "index_leads" CASCADE;
  DROP TABLE "_index_leads_v_version_languages" CASCADE;
  DROP TABLE "_index_leads_v" CASCADE;
  DROP TYPE "public"."enum_site_words_languages";
  DROP TYPE "public"."enum_site_words_status";
  DROP TYPE "public"."enum__site_words_v_version_languages";
  DROP TYPE "public"."enum__site_words_v_version_status";
  DROP TYPE "public"."enum_index_leads_languages";
  DROP TYPE "public"."enum_index_leads_status";
  DROP TYPE "public"."enum__index_leads_v_version_languages";
  DROP TYPE "public"."enum__index_leads_v_version_status";`)
}
