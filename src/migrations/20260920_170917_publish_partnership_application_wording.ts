import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PARTNERSHIP_APPLICATION_SEED } from './partnership-application-import/seed';

/**
 * Publishes the Partnership Program application's words — the Reference site's,
 * and the messages ticket 29 added — so that every database, production's
 * included, starts with the form as built, and Editors change it from there.
 *
 * Written out in `partnership-application-import/words.ts` rather than read
 * from `src/forms/partnership-application.ts`, so that a later change to the
 * form cannot change what this migration did; and frozen as the SQL in
 * `seed.ts` beside them (ticket 68), so that a later field cannot make it
 * write a column the tables do not have yet.
 *
 * No alert address: none has been supplied, and until one is set the form
 * sends no email at all.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PARTNERSHIP_APPLICATION_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_partnership_application_form_v";
    DELETE FROM "partnership_application_form";
  `);
}
