import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { DEMO_REQUEST_SEED } from './demo-request-import/seed';

/**
 * Publishes the demo request form's words — the Reference site's, and the
 * messages ticket 27 added — so that every database, production's included,
 * starts with the form as built, and Editors change it from there.
 *
 * Written out in `demo-request-import/words.ts` rather than read from
 * `src/forms/demo-request.ts`, so that a later change to the form cannot
 * change what this migration did; and frozen as the SQL in `seed.ts` beside
 * them (ticket 68), so that a later field cannot make it write a column the
 * tables do not have yet.
 *
 * No alert address: none has been supplied (spec: Further Notes), and until
 * one is set the form sends no email at all.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(DEMO_REQUEST_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_demo_request_form_v";
    DELETE FROM "demo_request_form";
  `);
}
