import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ENGLISH_SITE_WORDS_SEED, ENGLISH_SITE_WORDS_UNSEED } from './english-site-words/seed';

/**
 * Puts the English of the header, the footer and the not-found page in front
 * of the founder, as a draft (ticket 40).
 *
 * The English pages have had neither header nor footer: every word in them
 * was Arabic, and an English page shows no Arabic in place of English it has
 * not got. Ticket 40 builds the English shell, and it needs about twenty
 * words the founder has not written — so, as with ticket 35's copy, they are
 * proposed and not published. He agreed to this on 22 September 2026.
 *
 * A visitor reads none of it. The English pages go on without a header or a
 * footer until he opens «كلمات الموقع المشتركة», reads the English and presses
 * Publish; then every English page has them at once. `docs/deployment.md`
 * has what he does, under «The English header and footer, waiting for a
 * decision».
 *
 * The statements are in `english-site-words/seed.ts`, and the words in
 * `english-site-words/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_SITE_WORDS_SEED));
}

/** Takes the proposal back. What is published stays exactly as it was. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_SITE_WORDS_UNSEED));
}
