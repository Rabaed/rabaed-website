import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ENGLISH_PAGES_SEED, ENGLISH_PAGES_UNSEED } from './english-pages/seed';

/**
 * Puts the English of the six marketing pages in front of the founder, as
 * drafts (ticket 42): a draft of each entry the pages read — the six pages'
 * own, the closing section, the Trust strip and the search settings — with its
 * English written in, and a draft English question for each Arabic one. The
 * header and footer's English is ticket 40's proposal, and the Screen mocks'
 * ticket 41's. English is not ticked among an entry's languages: ticking it
 * is the founder's approval, and nothing else publishes a page in English.
 *
 * The ticket asks that every page be drafted for the founder and published
 * only once he approves it, and that no English page be published with words
 * missing. So nothing here is published: an English page's address goes on
 * saying the page is not in English yet until he has published every entry
 * that page reads in English (`inEnglish`, in
 * `src/content/pages/page-content.ts`). `docs/deployment.md` has what he does,
 * under «The English pages, waiting for a decision».
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
