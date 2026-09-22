import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ENGLISH_FORM_WORDING_SEED, ENGLISH_FORM_WORDING_UNSEED } from './english-form-wording/seed';

/**
 * Puts the English of the four forms in front of the founder, as a draft of
 * each form's English entry (ticket 42).
 *
 * The English pages carry every form the Arabic ones do, and a form's words
 * are an Editor's (spec: Forms) — so, as with the English pages' own words,
 * they are proposed and not published. A visitor reads the same words either
 * way: until the founder publishes an English entry, an English page shows
 * the English its form was written with (`src/forms/*.ts`), which is these.
 * What publishing adds is that they are his, and his to change.
 *
 * The statements are in `english-form-wording/seed.ts`, and the words in
 * `english-form-wording/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_FORM_WORDING_SEED));
}

/** Takes the proposals back. An English entry the founder has published is left as it is. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_FORM_WORDING_UNSEED));
}
