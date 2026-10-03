import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Every Pour Tracker release the CMS has kept, by its release number, unique
 * (ticket 101): what holds a number to the one file it names, for good.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pour_tracker_releases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"release_number" varchar NOT NULL,
  	"sha256" varchar NOT NULL,
  	"size" numeric NOT NULL,
  	"file_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pour_tracker_releases_id" integer;
  CREATE UNIQUE INDEX "pour_tracker_releases_release_number_idx" ON "pour_tracker_releases" USING btree ("release_number");
  CREATE INDEX "pour_tracker_releases_updated_at_idx" ON "pour_tracker_releases" USING btree ("updated_at");
  CREATE INDEX "pour_tracker_releases_created_at_idx" ON "pour_tracker_releases" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pour_tracker_releases_fk" FOREIGN KEY ("pour_tracker_releases_id") REFERENCES "public"."pour_tracker_releases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pour_tracker_releases_id_idx" ON "payload_locked_documents_rels" USING btree ("pour_tracker_releases_id");`)
}

/** Drops the record of kept releases. Their files stay in the documents store. */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pour_tracker_releases" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pour_tracker_releases" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pour_tracker_releases_fk";
  
  DROP INDEX "payload_locked_documents_rels_pour_tracker_releases_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pour_tracker_releases_id";`)
}
