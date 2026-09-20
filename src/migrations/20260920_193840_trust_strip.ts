import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_trust_strip_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_trust_strip_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__trust_strip_v_version_languages" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__trust_strip_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "trust_strip_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_trust_strip_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "trust_strip_strip_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shows" boolean DEFAULT true,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"mark_id" integer,
  	"height" numeric DEFAULT 32,
  	"link" varchar
  );
  
  CREATE TABLE "trust_strip" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"strip_caption_ar" varchar,
  	"strip_caption_en" varchar,
  	"strip_section_name_ar" varchar,
  	"strip_section_name_en" varchar,
  	"_status" "enum_trust_strip_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_trust_strip_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__trust_strip_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_trust_strip_v_version_strip_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shows" boolean DEFAULT true,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"mark_id" integer,
  	"height" numeric DEFAULT 32,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trust_strip_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_strip_caption_ar" varchar,
  	"version_strip_caption_en" varchar,
  	"version_strip_section_name_ar" varchar,
  	"version_strip_section_name_en" varchar,
  	"version__status" "enum__trust_strip_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "trust_strip_languages" ADD CONSTRAINT "trust_strip_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trust_strip_strip_logos" ADD CONSTRAINT "trust_strip_strip_logos_mark_id_media_id_fk" FOREIGN KEY ("mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trust_strip_strip_logos" ADD CONSTRAINT "trust_strip_strip_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trust_strip_v_version_languages" ADD CONSTRAINT "_trust_strip_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_trust_strip_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trust_strip_v_version_strip_logos" ADD CONSTRAINT "_trust_strip_v_version_strip_logos_mark_id_media_id_fk" FOREIGN KEY ("mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trust_strip_v_version_strip_logos" ADD CONSTRAINT "_trust_strip_v_version_strip_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trust_strip_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "trust_strip_languages_order_idx" ON "trust_strip_languages" USING btree ("order");
  CREATE INDEX "trust_strip_languages_parent_idx" ON "trust_strip_languages" USING btree ("parent_id");
  CREATE INDEX "trust_strip_strip_logos_order_idx" ON "trust_strip_strip_logos" USING btree ("_order");
  CREATE INDEX "trust_strip_strip_logos_parent_id_idx" ON "trust_strip_strip_logos" USING btree ("_parent_id");
  CREATE INDEX "trust_strip_strip_logos_mark_idx" ON "trust_strip_strip_logos" USING btree ("mark_id");
  CREATE INDEX "trust_strip__status_idx" ON "trust_strip" USING btree ("_status");
  CREATE INDEX "_trust_strip_v_version_languages_order_idx" ON "_trust_strip_v_version_languages" USING btree ("order");
  CREATE INDEX "_trust_strip_v_version_languages_parent_idx" ON "_trust_strip_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_trust_strip_v_version_strip_logos_order_idx" ON "_trust_strip_v_version_strip_logos" USING btree ("_order");
  CREATE INDEX "_trust_strip_v_version_strip_logos_parent_id_idx" ON "_trust_strip_v_version_strip_logos" USING btree ("_parent_id");
  CREATE INDEX "_trust_strip_v_version_strip_logos_mark_idx" ON "_trust_strip_v_version_strip_logos" USING btree ("mark_id");
  CREATE INDEX "_trust_strip_v_version_version__status_idx" ON "_trust_strip_v" USING btree ("version__status");
  CREATE INDEX "_trust_strip_v_created_at_idx" ON "_trust_strip_v" USING btree ("created_at");
  CREATE INDEX "_trust_strip_v_updated_at_idx" ON "_trust_strip_v" USING btree ("updated_at");
  CREATE INDEX "_trust_strip_v_latest_idx" ON "_trust_strip_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "trust_strip_languages" CASCADE;
  DROP TABLE "trust_strip_strip_logos" CASCADE;
  DROP TABLE "trust_strip" CASCADE;
  DROP TABLE "_trust_strip_v_version_languages" CASCADE;
  DROP TABLE "_trust_strip_v_version_strip_logos" CASCADE;
  DROP TABLE "_trust_strip_v" CASCADE;
  DROP TYPE "public"."enum_trust_strip_languages";
  DROP TYPE "public"."enum_trust_strip_status";
  DROP TYPE "public"."enum__trust_strip_v_version_languages";
  DROP TYPE "public"."enum__trust_strip_v_version_status";`)
}
