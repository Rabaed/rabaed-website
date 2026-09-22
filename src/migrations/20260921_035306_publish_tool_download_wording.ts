import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { TOOL_DOWNLOAD_SEED } from './tool-download-import/seed';

/**
 * Publishes the Pour Tracker download form's words as its first version
 * (ticket 30), so the form reads them from the CMS as the other three do.
 *
 * Every word is written out in `tool-download-import/words.ts` rather than
 * read from `src/forms/tool-download.ts`, as the demo request's and the
 * partnership application's are: this is what the form was published with,
 * frozen, and the definition's own copy is only what a new database starts
 * from. The statements that write them are frozen in `seed.ts` beside the
 * words (ticket 68), naming the columns the form's tables had that day.
 *
 * The country codes are named as the CMS names them: a `+` is not a column
 * name, so `+966` is `option__966` (`optionFieldName`).
 *
 * No alert address: the founders supply one at ticket 39, and until they do
 * neither the team's alert nor the visitor's confirmation is sent
 * (`src/forms/submission.ts`).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(TOOL_DOWNLOAD_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_tool_download_form_v";
    DELETE FROM "tool_download_form";
  `);
}
