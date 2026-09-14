import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_legal_documents_slug" AS ENUM('terms', 'privacy', 'referral-terms');
  CREATE TYPE "public"."enum_legal_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_documents_v_version_slug" AS ENUM('terms', 'privacy', 'referral-terms');
  CREATE TYPE "public"."enum__legal_documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "legal_documents_clauses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"in_contents" boolean DEFAULT true,
  	"body" jsonb,
  	"contact" jsonb
  );
  
  CREATE TABLE "legal_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_legal_documents_slug",
  	"edited_by" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"meta_title" varchar,
  	"description" varchar,
  	"intro" jsonb,
  	"see_also" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_documents_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_legal_documents_v_version_clauses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"in_contents" boolean DEFAULT true,
  	"body" jsonb,
  	"contact" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" "enum__legal_documents_v_version_slug",
  	"version_edited_by" varchar,
  	"version_title" varchar,
  	"version_lead" varchar,
  	"version_meta_title" varchar,
  	"version_description" varchar,
  	"version_intro" jsonb,
  	"version_see_also" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_documents_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_documents_id" integer;
  ALTER TABLE "legal_documents_clauses" ADD CONSTRAINT "legal_documents_clauses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v_version_clauses" ADD CONSTRAINT "_legal_documents_v_version_clauses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_documents_v" ADD CONSTRAINT "_legal_documents_v_parent_id_legal_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "legal_documents_clauses_order_idx" ON "legal_documents_clauses" USING btree ("_order");
  CREATE INDEX "legal_documents_clauses_parent_id_idx" ON "legal_documents_clauses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_documents_slug_idx" ON "legal_documents" USING btree ("slug");
  CREATE INDEX "legal_documents_updated_at_idx" ON "legal_documents" USING btree ("updated_at");
  CREATE INDEX "legal_documents_created_at_idx" ON "legal_documents" USING btree ("created_at");
  CREATE INDEX "legal_documents__status_idx" ON "legal_documents" USING btree ("_status");
  CREATE INDEX "_legal_documents_v_version_clauses_order_idx" ON "_legal_documents_v_version_clauses" USING btree ("_order");
  CREATE INDEX "_legal_documents_v_version_clauses_parent_id_idx" ON "_legal_documents_v_version_clauses" USING btree ("_parent_id");
  CREATE INDEX "_legal_documents_v_parent_idx" ON "_legal_documents_v" USING btree ("parent_id");
  CREATE INDEX "_legal_documents_v_version_version_slug_idx" ON "_legal_documents_v" USING btree ("version_slug");
  CREATE INDEX "_legal_documents_v_version_version_updated_at_idx" ON "_legal_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_documents_v_version_version_created_at_idx" ON "_legal_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_documents_v_version_version__status_idx" ON "_legal_documents_v" USING btree ("version__status");
  CREATE INDEX "_legal_documents_v_created_at_idx" ON "_legal_documents_v" USING btree ("created_at");
  CREATE INDEX "_legal_documents_v_updated_at_idx" ON "_legal_documents_v" USING btree ("updated_at");
  CREATE INDEX "_legal_documents_v_latest_idx" ON "_legal_documents_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_documents_fk" FOREIGN KEY ("legal_documents_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_legal_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_documents_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "legal_documents_clauses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_documents_v_version_clauses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_documents_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "legal_documents_clauses" CASCADE;
  DROP TABLE "legal_documents" CASCADE;
  DROP TABLE "_legal_documents_v_version_clauses" CASCADE;
  DROP TABLE "_legal_documents_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_legal_documents_fk";
  
  DROP INDEX "payload_locked_documents_rels_legal_documents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_documents_id";
  DROP TYPE "public"."enum_legal_documents_slug";
  DROP TYPE "public"."enum_legal_documents_status";
  DROP TYPE "public"."enum__legal_documents_v_version_slug";
  DROP TYPE "public"."enum__legal_documents_v_version_status";`)
}
