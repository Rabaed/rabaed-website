import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * The Pour Tracker entry (ticket 100, ADR-0024): the release visitors download,
 * named by its checksum, release number, size and uploaded file name, with
 * drafts so that a release waits for Publish. The file itself is in the
 * documents store, never in a table.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pour_tracker_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pour_tracker_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pour_tracker" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sha256" varchar,
  	"release_number" varchar,
  	"size" numeric,
  	"file_name" varchar,
  	"_status" "enum_pour_tracker_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pour_tracker_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_sha256" varchar,
  	"version_release_number" varchar,
  	"version_size" numeric,
  	"version_file_name" varchar,
  	"version__status" "enum__pour_tracker_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE INDEX "pour_tracker__status_idx" ON "pour_tracker" USING btree ("_status");
  CREATE INDEX "_pour_tracker_v_version_version__status_idx" ON "_pour_tracker_v" USING btree ("version__status");
  CREATE INDEX "_pour_tracker_v_created_at_idx" ON "_pour_tracker_v" USING btree ("created_at");
  CREATE INDEX "_pour_tracker_v_updated_at_idx" ON "_pour_tracker_v" USING btree ("updated_at");
  CREATE INDEX "_pour_tracker_v_latest_idx" ON "_pour_tracker_v" USING btree ("latest");`)
}

/** Drops the Pour Tracker entry and its history. Its files stay in the documents store. */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pour_tracker" CASCADE;
  DROP TABLE "_pour_tracker_v" CASCADE;
  DROP TYPE "public"."enum_pour_tracker_status";
  DROP TYPE "public"."enum__pour_tracker_v_version_status";`)
}
