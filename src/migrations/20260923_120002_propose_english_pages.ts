import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ENGLISH_PAGES_SEED, ENGLISH_PAGES_UNSEED } from './english-pages/seed';

/**
 * Puts the English of the six marketing pages in front of the founder, as
 * drafts (ticket 42): a draft of each entry the pages read — the six pages'
 * own, the closing section, the Screen mocks, the Trust strip and the search
 * settings — with its English written in and English added to the languages
 * it is published in, and a draft English question for each Arabic one.
 *
 * The ticket asks that every page be drafted for the founder and published
 * only once he approves it, and that no English page be published with words
 * missing. So nothing here is published: an English page's address goes on
 * saying the page is not in English yet until he has published every entry
 * that page reads (`src/content/pages/*.ts`). `docs/deployment.md` has what he
 * does, under «The English pages, waiting for a decision».
 *
 * The statements are in `english-pages/seed.ts`, and the words in the modules
 * beside it.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_PAGES_SEED));
}

/** Takes the proposals back. What is published stays exactly as it was. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(ENGLISH_PAGES_UNSEED));
}
