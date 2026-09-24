import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SET_ASIDE, SET_ASIDE_UNDONE } from './search-settings-move/statements';

/**
 * Sets each page's search title, description and sharing picture aside,
 * before the entry that held all six is dropped (ticket 91):
 * `…_move_search_settings_onto_pages` puts them onto each page's own entry.
 * Why it takes three migrations is in `search-settings-move/statements.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(SET_ASIDE));
}

/** The old entry again, published with what was set aside. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(SET_ASIDE_UNDONE));
}
