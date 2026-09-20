import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_search_settings_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_search_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__search_settings_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__search_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "sharing_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  
  CREATE TABLE "search_settings_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_search_settings_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "search_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_title_ar" varchar,
  	"home_title_en" varchar,
  	"home_description_ar" varchar,
  	"home_description_en" varchar,
  	"home_sharing_image_id" integer,
  	"product_title_ar" varchar,
  	"product_title_en" varchar,
  	"product_description_ar" varchar,
  	"product_description_en" varchar,
  	"product_sharing_image_id" integer,
  	"start_title_ar" varchar,
  	"start_title_en" varchar,
  	"start_description_ar" varchar,
  	"start_description_en" varchar,
  	"start_sharing_image_id" integer,
  	"tool_title_ar" varchar,
  	"tool_title_en" varchar,
  	"tool_description_ar" varchar,
  	"tool_description_en" varchar,
  	"tool_sharing_image_id" integer,
  	"referral_title_ar" varchar,
  	"referral_title_en" varchar,
  	"referral_description_ar" varchar,
  	"referral_description_en" varchar,
  	"referral_sharing_image_id" integer,
  	"partnership_title_ar" varchar,
  	"partnership_title_en" varchar,
  	"partnership_description_ar" varchar,
  	"partnership_description_en" varchar,
  	"partnership_sharing_image_id" integer,
  	"_status" "enum_search_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_search_settings_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__search_settings_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_search_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_home_title_ar" varchar,
  	"version_home_title_en" varchar,
  	"version_home_description_ar" varchar,
  	"version_home_description_en" varchar,
  	"version_home_sharing_image_id" integer,
  	"version_product_title_ar" varchar,
  	"version_product_title_en" varchar,
  	"version_product_description_ar" varchar,
  	"version_product_description_en" varchar,
  	"version_product_sharing_image_id" integer,
  	"version_start_title_ar" varchar,
  	"version_start_title_en" varchar,
  	"version_start_description_ar" varchar,
  	"version_start_description_en" varchar,
  	"version_start_sharing_image_id" integer,
  	"version_tool_title_ar" varchar,
  	"version_tool_title_en" varchar,
  	"version_tool_description_ar" varchar,
  	"version_tool_description_en" varchar,
  	"version_tool_sharing_image_id" integer,
  	"version_referral_title_ar" varchar,
  	"version_referral_title_en" varchar,
  	"version_referral_description_ar" varchar,
  	"version_referral_description_en" varchar,
  	"version_referral_sharing_image_id" integer,
  	"version_partnership_title_ar" varchar,
  	"version_partnership_title_en" varchar,
  	"version_partnership_description_ar" varchar,
  	"version_partnership_description_en" varchar,
  	"version_partnership_sharing_image_id" integer,
  	"version__status" "enum__search_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "posts" ADD COLUMN "sharing_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_sharing_image_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN "sharing_image_id" integer;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_sharing_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sharing_images_id" integer;
  ALTER TABLE "search_settings_languages" ADD CONSTRAINT "search_settings_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_home_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("home_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_product_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("product_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_start_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("start_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_tool_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("tool_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_referral_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("referral_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_partnership_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("partnership_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v_version_languages" ADD CONSTRAINT "_search_settings_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_search_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_home_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_home_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_product_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_product_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_start_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_start_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_tool_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_tool_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_referral_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_referral_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_settings_v" ADD CONSTRAINT "_search_settings_v_version_partnership_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_partnership_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sharing_images_updated_at_idx" ON "sharing_images" USING btree ("updated_at");
  CREATE INDEX "sharing_images_created_at_idx" ON "sharing_images" USING btree ("created_at");
  CREATE UNIQUE INDEX "sharing_images_filename_idx" ON "sharing_images" USING btree ("filename");
  CREATE INDEX "search_settings_languages_order_idx" ON "search_settings_languages" USING btree ("order");
  CREATE INDEX "search_settings_languages_parent_idx" ON "search_settings_languages" USING btree ("parent_id");
  CREATE INDEX "search_settings_home_home_sharing_image_idx" ON "search_settings" USING btree ("home_sharing_image_id");
  CREATE INDEX "search_settings_product_product_sharing_image_idx" ON "search_settings" USING btree ("product_sharing_image_id");
  CREATE INDEX "search_settings_start_start_sharing_image_idx" ON "search_settings" USING btree ("start_sharing_image_id");
  CREATE INDEX "search_settings_tool_tool_sharing_image_idx" ON "search_settings" USING btree ("tool_sharing_image_id");
  CREATE INDEX "search_settings_referral_referral_sharing_image_idx" ON "search_settings" USING btree ("referral_sharing_image_id");
  CREATE INDEX "search_settings_partnership_partnership_sharing_image_idx" ON "search_settings" USING btree ("partnership_sharing_image_id");
  CREATE INDEX "search_settings__status_idx" ON "search_settings" USING btree ("_status");
  CREATE INDEX "_search_settings_v_version_languages_order_idx" ON "_search_settings_v_version_languages" USING btree ("order");
  CREATE INDEX "_search_settings_v_version_languages_parent_idx" ON "_search_settings_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_search_settings_v_version_home_version_home_sharing_ima_idx" ON "_search_settings_v" USING btree ("version_home_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_product_version_product_shari_idx" ON "_search_settings_v" USING btree ("version_product_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_start_version_start_sharing_i_idx" ON "_search_settings_v" USING btree ("version_start_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_tool_version_tool_sharing_ima_idx" ON "_search_settings_v" USING btree ("version_tool_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_referral_version_referral_sha_idx" ON "_search_settings_v" USING btree ("version_referral_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_partnership_version_partnersh_idx" ON "_search_settings_v" USING btree ("version_partnership_sharing_image_id");
  CREATE INDEX "_search_settings_v_version_version__status_idx" ON "_search_settings_v" USING btree ("version__status");
  CREATE INDEX "_search_settings_v_created_at_idx" ON "_search_settings_v" USING btree ("created_at");
  CREATE INDEX "_search_settings_v_updated_at_idx" ON "_search_settings_v" USING btree ("updated_at");
  CREATE INDEX "_search_settings_v_latest_idx" ON "_search_settings_v" USING btree ("latest");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sharing_images_fk" FOREIGN KEY ("sharing_images_id") REFERENCES "public"."sharing_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_sharing_image_idx" ON "posts" USING btree ("sharing_image_id");
  CREATE INDEX "_posts_v_version_version_sharing_image_idx" ON "_posts_v" USING btree ("version_sharing_image_id");
  CREATE INDEX "case_studies_sharing_image_idx" ON "case_studies" USING btree ("sharing_image_id");
  CREATE INDEX "_case_studies_v_version_version_sharing_image_idx" ON "_case_studies_v" USING btree ("version_sharing_image_id");
  CREATE INDEX "payload_locked_documents_rels_sharing_images_id_idx" ON "payload_locked_documents_rels" USING btree ("sharing_images_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sharing_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_settings_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_settings_v_version_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sharing_images" CASCADE;
  DROP TABLE "search_settings_languages" CASCADE;
  DROP TABLE "search_settings" CASCADE;
  DROP TABLE "_search_settings_v_version_languages" CASCADE;
  DROP TABLE "_search_settings_v" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_case_studies_v" DROP CONSTRAINT "_case_studies_v_version_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sharing_images_fk";
  
  DROP INDEX "posts_sharing_image_idx";
  DROP INDEX "_posts_v_version_version_sharing_image_idx";
  DROP INDEX "case_studies_sharing_image_idx";
  DROP INDEX "_case_studies_v_version_version_sharing_image_idx";
  DROP INDEX "payload_locked_documents_rels_sharing_images_id_idx";
  ALTER TABLE "posts" DROP COLUMN "sharing_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_sharing_image_id";
  ALTER TABLE "case_studies" DROP COLUMN "sharing_image_id";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_sharing_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sharing_images_id";
  DROP TYPE "public"."enum_search_settings_languages";
  DROP TYPE "public"."enum_search_settings_status";
  DROP TYPE "public"."enum__search_settings_v_version_languages";
  DROP TYPE "public"."enum__search_settings_v_version_status";`)
}
