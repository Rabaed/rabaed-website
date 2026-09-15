import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_start_page_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_start_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__start_page_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__start_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "start_page_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_start_page_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "start_page_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"marked_out" boolean DEFAULT false
  );
  
  CREATE TABLE "start_page" (
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
  	"steps_shows" boolean DEFAULT true,
  	"steps_eyebrow_ar" varchar,
  	"steps_eyebrow_en" varchar,
  	"steps_heading_ar" varchar,
  	"steps_heading_en" varchar,
  	"questions_eyebrow_ar" varchar,
  	"questions_eyebrow_en" varchar,
  	"questions_heading_ar" varchar,
  	"questions_heading_en" varchar,
  	"free_tool_shows" boolean DEFAULT true,
  	"free_tool_eyebrow_ar" varchar,
  	"free_tool_eyebrow_en" varchar,
  	"free_tool_heading_ar" varchar,
  	"free_tool_heading_en" varchar,
  	"free_tool_text_ar" varchar,
  	"free_tool_text_en" varchar,
  	"free_tool_link_label_ar" varchar,
  	"free_tool_link_label_en" varchar,
  	"_status" "enum_start_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_start_page_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__start_page_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_start_page_v_version_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"title_ar" varchar,
  	"title_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"marked_out" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_start_page_v" (
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
  	"version_steps_shows" boolean DEFAULT true,
  	"version_steps_eyebrow_ar" varchar,
  	"version_steps_eyebrow_en" varchar,
  	"version_steps_heading_ar" varchar,
  	"version_steps_heading_en" varchar,
  	"version_questions_eyebrow_ar" varchar,
  	"version_questions_eyebrow_en" varchar,
  	"version_questions_heading_ar" varchar,
  	"version_questions_heading_en" varchar,
  	"version_free_tool_shows" boolean DEFAULT true,
  	"version_free_tool_eyebrow_ar" varchar,
  	"version_free_tool_eyebrow_en" varchar,
  	"version_free_tool_heading_ar" varchar,
  	"version_free_tool_heading_en" varchar,
  	"version_free_tool_text_ar" varchar,
  	"version_free_tool_text_en" varchar,
  	"version_free_tool_link_label_ar" varchar,
  	"version_free_tool_link_label_en" varchar,
  	"version__status" "enum__start_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "start_page_languages" ADD CONSTRAINT "start_page_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."start_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "start_page_steps_steps" ADD CONSTRAINT "start_page_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."start_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_start_page_v_version_languages" ADD CONSTRAINT "_start_page_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_start_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_start_page_v_version_steps_steps" ADD CONSTRAINT "_start_page_v_version_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_start_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "start_page_languages_order_idx" ON "start_page_languages" USING btree ("order");
  CREATE INDEX "start_page_languages_parent_idx" ON "start_page_languages" USING btree ("parent_id");
  CREATE INDEX "start_page_steps_steps_order_idx" ON "start_page_steps_steps" USING btree ("_order");
  CREATE INDEX "start_page_steps_steps_parent_id_idx" ON "start_page_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "start_page__status_idx" ON "start_page" USING btree ("_status");
  CREATE INDEX "_start_page_v_version_languages_order_idx" ON "_start_page_v_version_languages" USING btree ("order");
  CREATE INDEX "_start_page_v_version_languages_parent_idx" ON "_start_page_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_start_page_v_version_steps_steps_order_idx" ON "_start_page_v_version_steps_steps" USING btree ("_order");
  CREATE INDEX "_start_page_v_version_steps_steps_parent_id_idx" ON "_start_page_v_version_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_start_page_v_version_version__status_idx" ON "_start_page_v" USING btree ("version__status");
  CREATE INDEX "_start_page_v_created_at_idx" ON "_start_page_v" USING btree ("created_at");
  CREATE INDEX "_start_page_v_updated_at_idx" ON "_start_page_v" USING btree ("updated_at");
  CREATE INDEX "_start_page_v_latest_idx" ON "_start_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "start_page_languages" CASCADE;
  DROP TABLE "start_page_steps_steps" CASCADE;
  DROP TABLE "start_page" CASCADE;
  DROP TABLE "_start_page_v_version_languages" CASCADE;
  DROP TABLE "_start_page_v_version_steps_steps" CASCADE;
  DROP TABLE "_start_page_v" CASCADE;
  DROP TYPE "public"."enum_start_page_languages";
  DROP TYPE "public"."enum_start_page_status";
  DROP TYPE "public"."enum__start_page_v_version_languages";
  DROP TYPE "public"."enum__start_page_v_version_status";`)
}
