import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { RECORD_KEPT, RECORD_KEPT_UNDONE } from './pour-tracker-release-numbers/statements';

/**
 * Writes the Pour Tracker releases already kept into the record of release
 * numbers that `…_pour_tracker_release_numbers` creates (ticket 101). Why, in
 * `pour-tracker-release-numbers/statements.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(RECORD_KEPT));
}

/** Nothing to undo. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(RECORD_KEPT_UNDONE));
}
