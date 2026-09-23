import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ENGLISH_SCREEN_MOCK_WORDS_SEED, ENGLISH_SCREEN_MOCK_WORDS_UNSEED } from './english-screen-mock-words/seed';

/**
 * Puts the English of the Screen mocks' descriptions in front of the founder,
 * as a draft (ticket 41).
 *
 * Every mock is described in words beside its picture — for screen readers,
 * and as the caption under it (ADR-0002) — and an English page showing the
 * English screens needs those words in English. They are an Editor's, so, as
 * with ticket 40's header and footer, they are proposed and not published.
 *
 * A visitor reads none of it until the founder opens «شاشات المنصة», reads the
 * English and presses Publish; and until ticket 42 writes the English home and
 * product pages, no page shows a mock in English at all. `docs/deployment.md`
 * has what he does, under «The English screen descriptions, waiting for a
 * decision».
 *
 * The statements are in `english-screen-mock-words/seed.ts`, and the words in
 * `english-screen-mock-words/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_SCREEN_MOCK_WORDS_SEED));
}

/** Takes the proposal back. What is published stays exactly as it was. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_SCREEN_MOCK_WORDS_UNSEED));
}
