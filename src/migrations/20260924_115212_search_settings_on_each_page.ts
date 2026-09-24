import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search_settings_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_settings_v_version_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "search_settings_languages" CASCADE;
  DROP TABLE "search_settings" CASCADE;
  DROP TABLE "_search_settings_v_version_languages" CASCADE;
  DROP TABLE "_search_settings_v" CASCADE;
  ALTER TABLE "start_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "start_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "start_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "start_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "start_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_start_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_start_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_start_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_start_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_start_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "tool_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "tool_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "tool_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "tool_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "tool_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_tool_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_tool_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_tool_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_tool_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_tool_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "referral_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "referral_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "referral_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "referral_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "referral_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_referral_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_referral_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_referral_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_referral_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_referral_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "product_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "product_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "product_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "product_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "product_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_product_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_product_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_product_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_product_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_product_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "home_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "home_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "partnership_page" ADD COLUMN "search_title_ar" varchar;
  ALTER TABLE "partnership_page" ADD COLUMN "search_title_en" varchar;
  ALTER TABLE "partnership_page" ADD COLUMN "search_description_ar" varchar;
  ALTER TABLE "partnership_page" ADD COLUMN "search_description_en" varchar;
  ALTER TABLE "partnership_page" ADD COLUMN "search_sharing_image_id" integer;
  ALTER TABLE "_partnership_page_v" ADD COLUMN "version_search_title_ar" varchar;
  ALTER TABLE "_partnership_page_v" ADD COLUMN "version_search_title_en" varchar;
  ALTER TABLE "_partnership_page_v" ADD COLUMN "version_search_description_ar" varchar;
  ALTER TABLE "_partnership_page_v" ADD COLUMN "version_search_description_en" varchar;
  ALTER TABLE "_partnership_page_v" ADD COLUMN "version_search_sharing_image_id" integer;
  ALTER TABLE "start_page" ADD CONSTRAINT "start_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_start_page_v" ADD CONSTRAINT "_start_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tool_page" ADD CONSTRAINT "tool_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tool_page_v" ADD CONSTRAINT "_tool_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "referral_page" ADD CONSTRAINT "referral_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_referral_page_v" ADD CONSTRAINT "_referral_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page" ADD CONSTRAINT "product_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_page_v" ADD CONSTRAINT "_product_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnership_page" ADD CONSTRAINT "partnership_page_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partnership_page_v" ADD CONSTRAINT "_partnership_page_v_version_search_sharing_image_id_sharing_images_id_fk" FOREIGN KEY ("version_search_sharing_image_id") REFERENCES "public"."sharing_images"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "start_page_search_search_sharing_image_idx" ON "start_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_start_page_v_version_search_version_search_sharing_imag_idx" ON "_start_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "tool_page_search_search_sharing_image_idx" ON "tool_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_tool_page_v_version_search_version_search_sharing_image_idx" ON "_tool_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "referral_page_search_search_sharing_image_idx" ON "referral_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_referral_page_v_version_search_version_search_sharing_i_idx" ON "_referral_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "product_page_search_search_sharing_image_idx" ON "product_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_product_page_v_version_search_version_search_sharing_im_idx" ON "_product_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "home_page_search_search_sharing_image_idx" ON "home_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_home_page_v_version_search_version_search_sharing_image_idx" ON "_home_page_v" USING btree ("version_search_sharing_image_id");
  CREATE INDEX "partnership_page_search_search_sharing_image_idx" ON "partnership_page" USING btree ("search_sharing_image_id");
  CREATE INDEX "_partnership_page_v_version_search_version_search_sharin_idx" ON "_partnership_page_v" USING btree ("version_search_sharing_image_id");
  DROP TYPE "public"."enum_search_settings_languages";
  DROP TYPE "public"."enum_search_settings_status";
  DROP TYPE "public"."enum__search_settings_v_version_languages";
  DROP TYPE "public"."enum__search_settings_v_version_status";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_search_settings_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_search_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__search_settings_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__search_settings_v_version_status" AS ENUM('draft', 'published');
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
  
  ALTER TABLE "start_page" DROP CONSTRAINT "start_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_start_page_v" DROP CONSTRAINT "_start_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "tool_page" DROP CONSTRAINT "tool_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_tool_page_v" DROP CONSTRAINT "_tool_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "referral_page" DROP CONSTRAINT "referral_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_referral_page_v" DROP CONSTRAINT "_referral_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "product_page" DROP CONSTRAINT "product_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_product_page_v" DROP CONSTRAINT "_product_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "partnership_page" DROP CONSTRAINT "partnership_page_search_sharing_image_id_sharing_images_id_fk";
  
  ALTER TABLE "_partnership_page_v" DROP CONSTRAINT "_partnership_page_v_version_search_sharing_image_id_sharing_images_id_fk";
  
  DROP INDEX "start_page_search_search_sharing_image_idx";
  DROP INDEX "_start_page_v_version_search_version_search_sharing_imag_idx";
  DROP INDEX "tool_page_search_search_sharing_image_idx";
  DROP INDEX "_tool_page_v_version_search_version_search_sharing_image_idx";
  DROP INDEX "referral_page_search_search_sharing_image_idx";
  DROP INDEX "_referral_page_v_version_search_version_search_sharing_i_idx";
  DROP INDEX "product_page_search_search_sharing_image_idx";
  DROP INDEX "_product_page_v_version_search_version_search_sharing_im_idx";
  DROP INDEX "home_page_search_search_sharing_image_idx";
  DROP INDEX "_home_page_v_version_search_version_search_sharing_image_idx";
  DROP INDEX "partnership_page_search_search_sharing_image_idx";
  DROP INDEX "_partnership_page_v_version_search_version_search_sharin_idx";
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
  ALTER TABLE "start_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "start_page" DROP COLUMN "search_title_en";
  ALTER TABLE "start_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "start_page" DROP COLUMN "search_description_en";
  ALTER TABLE "start_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_start_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_start_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_start_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_start_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_start_page_v" DROP COLUMN "version_search_sharing_image_id";
  ALTER TABLE "tool_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "tool_page" DROP COLUMN "search_title_en";
  ALTER TABLE "tool_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "tool_page" DROP COLUMN "search_description_en";
  ALTER TABLE "tool_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_tool_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_tool_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_tool_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_tool_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_tool_page_v" DROP COLUMN "version_search_sharing_image_id";
  ALTER TABLE "referral_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "referral_page" DROP COLUMN "search_title_en";
  ALTER TABLE "referral_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "referral_page" DROP COLUMN "search_description_en";
  ALTER TABLE "referral_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_referral_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_referral_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_referral_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_referral_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_referral_page_v" DROP COLUMN "version_search_sharing_image_id";
  ALTER TABLE "product_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "product_page" DROP COLUMN "search_title_en";
  ALTER TABLE "product_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "product_page" DROP COLUMN "search_description_en";
  ALTER TABLE "product_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_product_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_product_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_product_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_product_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_product_page_v" DROP COLUMN "version_search_sharing_image_id";
  ALTER TABLE "home_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "home_page" DROP COLUMN "search_title_en";
  ALTER TABLE "home_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "home_page" DROP COLUMN "search_description_en";
  ALTER TABLE "home_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_search_sharing_image_id";
  ALTER TABLE "partnership_page" DROP COLUMN "search_title_ar";
  ALTER TABLE "partnership_page" DROP COLUMN "search_title_en";
  ALTER TABLE "partnership_page" DROP COLUMN "search_description_ar";
  ALTER TABLE "partnership_page" DROP COLUMN "search_description_en";
  ALTER TABLE "partnership_page" DROP COLUMN "search_sharing_image_id";
  ALTER TABLE "_partnership_page_v" DROP COLUMN "version_search_title_ar";
  ALTER TABLE "_partnership_page_v" DROP COLUMN "version_search_title_en";
  ALTER TABLE "_partnership_page_v" DROP COLUMN "version_search_description_ar";
  ALTER TABLE "_partnership_page_v" DROP COLUMN "version_search_description_en";
  ALTER TABLE "_partnership_page_v" DROP COLUMN "version_search_sharing_image_id";`);
}
