import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_faq_entries_page" AS ENUM('home', 'start', 'tool', 'referral', 'partnership');
  CREATE TYPE "public"."enum_faq_entries_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_faq_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_entries_v_version_page" AS ENUM('home', 'start', 'tool', 'referral', 'partnership');
  CREATE TYPE "public"."enum__faq_entries_v_version_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__faq_entries_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "faq_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"question" varchar,
  	"answer" varchar,
  	"page" "enum_faq_entries_page",
  	"locale" "enum_faq_entries_locale" DEFAULT 'ar',
  	"shows" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faq_entries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faq_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_question" varchar,
  	"version_answer" varchar,
  	"version_page" "enum__faq_entries_v_version_page",
  	"version_locale" "enum__faq_entries_v_version_locale" DEFAULT 'ar',
  	"version_shows" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faq_entries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_entries_id" integer;
  ALTER TABLE "_faq_entries_v" ADD CONSTRAINT "_faq_entries_v_parent_id_faq_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq_entries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faq_entries__order_idx" ON "faq_entries" USING btree ("_order");
  CREATE INDEX "faq_entries_page_idx" ON "faq_entries" USING btree ("page");
  CREATE INDEX "faq_entries_locale_idx" ON "faq_entries" USING btree ("locale");
  CREATE INDEX "faq_entries_updated_at_idx" ON "faq_entries" USING btree ("updated_at");
  CREATE INDEX "faq_entries_created_at_idx" ON "faq_entries" USING btree ("created_at");
  CREATE INDEX "faq_entries__status_idx" ON "faq_entries" USING btree ("_status");
  CREATE INDEX "_faq_entries_v_parent_idx" ON "_faq_entries_v" USING btree ("parent_id");
  CREATE INDEX "_faq_entries_v_version_version__order_idx" ON "_faq_entries_v" USING btree ("version__order");
  CREATE INDEX "_faq_entries_v_version_version_page_idx" ON "_faq_entries_v" USING btree ("version_page");
  CREATE INDEX "_faq_entries_v_version_version_locale_idx" ON "_faq_entries_v" USING btree ("version_locale");
  CREATE INDEX "_faq_entries_v_version_version_updated_at_idx" ON "_faq_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_faq_entries_v_version_version_created_at_idx" ON "_faq_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_faq_entries_v_version_version__status_idx" ON "_faq_entries_v" USING btree ("version__status");
  CREATE INDEX "_faq_entries_v_created_at_idx" ON "_faq_entries_v" USING btree ("created_at");
  CREATE INDEX "_faq_entries_v_updated_at_idx" ON "_faq_entries_v" USING btree ("updated_at");
  CREATE INDEX "_faq_entries_v_latest_idx" ON "_faq_entries_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_entries_fk" FOREIGN KEY ("faq_entries_id") REFERENCES "public"."faq_entries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faq_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_entries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faq_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faq_entries_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faq_entries" CASCADE;
  DROP TABLE "_faq_entries_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_entries_fk";
  
  DROP INDEX "payload_locked_documents_rels_faq_entries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_entries_id";
  DROP TYPE "public"."enum_faq_entries_page";
  DROP TYPE "public"."enum_faq_entries_locale";
  DROP TYPE "public"."enum_faq_entries_status";
  DROP TYPE "public"."enum__faq_entries_v_version_page";
  DROP TYPE "public"."enum__faq_entries_v_version_locale";
  DROP TYPE "public"."enum__faq_entries_v_version_status";`)
}
