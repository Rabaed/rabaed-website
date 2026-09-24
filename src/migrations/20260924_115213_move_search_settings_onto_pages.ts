import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { MOVE, MOVE_UNDONE } from './search-settings-move/statements';

/**
 * Puts each page's search title, description and sharing picture onto the
 * page's own entry, in Arabic and in English (ticket 91): a published version
 * of the page is given them as they were last published, a draft as they were
 * last saved. `search-settings-move/statements.ts` says why.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(MOVE));
}

/** Sets each page's published search settings aside again, for the old entry to be rebuilt from. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(MOVE_UNDONE));
}
