import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * The Company profile's files, kept exactly as they were uploaded: its videos
 * (ticket 108) and its PDFs (ticket 104).
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_files" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "profile_files_id" integer;
  CREATE INDEX "profile_files_updated_at_idx" ON "profile_files" USING btree ("updated_at");
  CREATE INDEX "profile_files_created_at_idx" ON "profile_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "profile_files_filename_idx" ON "profile_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profile_files_fk" FOREIGN KEY ("profile_files_id") REFERENCES "public"."profile_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_profile_files_id_idx" ON "payload_locked_documents_rels" USING btree ("profile_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "profile_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_profile_files_fk";
  
  DROP INDEX "payload_locked_documents_rels_profile_files_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "profile_files_id";`)
}
