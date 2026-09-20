import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The training-crawler switch (ticket 33). One table and no versions table:
 * the global keeps no drafts (`src/cms/globals/ai-crawlers.ts`).
 *
 * No row is written. The column's default and the field's agree — training
 * crawlers are allowed — so a database nobody has touched answers the same as
 * one saved with the box ticked, and `src/cms/crawler-policy.ts` reads either.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ai_crawlers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"allow_training" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ai_crawlers" CASCADE;`)
}
