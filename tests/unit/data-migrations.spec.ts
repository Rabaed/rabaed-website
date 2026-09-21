/**
 * The two rules that keep a data migration working on a database built from
 * scratch (ticket 63).
 *
 * A data migration seeds content: the start page's words, the Trust strip's
 * marks, how each page appears in a search result. It runs once on every
 * database, in its place in the chain — which on a database built from scratch
 * is a point in the past, where the tables are not the tables the code
 * declares today. A migration that writes through Payload's local API does not
 * know that: `payload.updateGlobal` builds its statement from the fields the
 * code declares *now*, so the first field added to that entry makes an
 * untouched migration name a column that does not exist yet, and every fresh
 * database — the test server's, a preview's, a new deployment's — stops there.
 * Production never notices, having migrated before the column existed.
 *
 * So the rule: **a data migration writes its rows in SQL, frozen when it is
 * written.** The one thing no INSERT can stand in for is an upload — a file
 * has to be converted and written to storage — so creating an image is the
 * single allowance, and the migrations that predate the rule are named below
 * rather than left to be discovered.
 *
 * Here rather than in `tests/e2e` because it opens no browser: what it reads
 * is source in the repository, which no running application serves (spec:
 * Testing Decisions). That a fresh database really does migrate is
 * `npm run cms:migrate-fresh`, and the whole suite runs against one.
 */
import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { HOME_PAGE_SEED } from '../../src/migrations/home-page-import/seed';
import { HOME_PAGE_WORDS } from '../../src/migrations/home-page-import/words';
import { PARTNERSHIP_PAGE_SEED } from '../../src/migrations/partnership-page-import/seed';
import { PARTNERSHIP_PAGE_WORDS } from '../../src/migrations/partnership-page-import/words';
import { PRODUCT_PAGE_SEED } from '../../src/migrations/product-page-import/seed';
import {
  CLOSING_SECTION_WORDS,
  PRODUCT_PAGE_WORDS,
  SCREEN_MOCK_DESCRIPTIONS,
} from '../../src/migrations/product-page-import/words';
import { REFERRAL_PAGE_SEED } from '../../src/migrations/referral-page-import/seed';
import { REFERRAL_PAGE_WORDS } from '../../src/migrations/referral-page-import/words';
import { SEARCH_SETTINGS_SEED } from '../../src/migrations/search-settings-import/seed';
import { SEARCH_SETTINGS } from '../../src/migrations/search-settings-import/words';
import { SITE_WORDS_SEED } from '../../src/migrations/site-words-import/seed';
import { INDEX_LEADS, SITE_WORDS } from '../../src/migrations/site-words-import/words';
import { START_PAGE_SEED } from '../../src/migrations/start-page-import/seed';
import { START_PAGE_WORDS } from '../../src/migrations/start-page-import/words';
import { TOOL_PAGE_SEED } from '../../src/migrations/tool-page-import/seed';
import { TOOL_PAGE_WORDS } from '../../src/migrations/tool-page-import/words';
import { TRUST_STRIP_LOGOS, TRUST_STRIP_WORDS } from '../../src/migrations/trust-strip-import/logos';
import { TRUST_STRIP_SEED } from '../../src/migrations/trust-strip-import/seed';

const migrationsDirectory = path.resolve(import.meta.dirname, '..', '..', 'src', 'migrations');

/**
 * The seven data migrations written before the rule, which still seed their
 * rows through Payload.
 *
 * Each is the same trap as the one ticket 63 closed, still set: a field added
 * to the site settings, to a form's settings, to the legal documents, to the
 * FAQs or to an article would stop a database built from scratch at that
 * migration. `npm run cms:freeze-seed` is what brings one over, and ticket 64
 * asks for all seven.
 *
 * The list is exact on purpose. A new offender fails this test, and so does
 * converting one of these without striking it off.
 */
const PREDATING = [
  '20260913_191346_publish_contact_points',
  '20260914_061635_import_legal_documents',
  '20260914_193520_import_faq_entries',
  '20260914_194144_publish_demo_request_wording',
  '20260914_222809_publish_referral_signup_wording',
  '20260920_170917_publish_partnership_application_wording',
  '20260921_101500_import_launch_articles',
];

/**
 * Every import whose frozen SQL has the frozen words beside it. `except` skips
 * a value the import does not store as it is written — a mark's file name,
 * which is stored as the WebP it was converted to.
 */
const FROZEN: { name: string; words: unknown; seed: string; except?: (value: string) => boolean }[] = [
  { name: 'start page', words: START_PAGE_WORDS, seed: START_PAGE_SEED },
  {
    name: 'product page, closing section and Screen mocks',
    words: [PRODUCT_PAGE_WORDS, CLOSING_SECTION_WORDS, SCREEN_MOCK_DESCRIPTIONS],
    seed: PRODUCT_PAGE_SEED,
  },
  { name: 'tool page', words: TOOL_PAGE_WORDS, seed: TOOL_PAGE_SEED },
  { name: 'partnership page', words: PARTNERSHIP_PAGE_WORDS, seed: PARTNERSHIP_PAGE_SEED },
  { name: 'referral page', words: REFERRAL_PAGE_WORDS, seed: REFERRAL_PAGE_SEED },
  { name: 'home page', words: HOME_PAGE_WORDS, seed: HOME_PAGE_SEED },
  { name: 'site words and index leads', words: [SITE_WORDS, INDEX_LEADS], seed: SITE_WORDS_SEED },
  { name: 'search settings', words: SEARCH_SETTINGS, seed: SEARCH_SETTINGS_SEED },
  {
    name: 'Trust strip',
    words: [TRUST_STRIP_LOGOS, TRUST_STRIP_WORDS],
    seed: TRUST_STRIP_SEED,
    except: (value) => value.endsWith('.png'),
  },
];

/**
 * A data migration is one with no schema snapshot beside it: Payload writes a
 * `.json` next to every migration it generates from the configuration, and
 * only one written by hand to move content has none.
 */
async function dataMigrations(): Promise<string[]> {
  const files = await readdir(migrationsDirectory, { withFileTypes: true });
  const names = files.filter((file) => file.isFile() && file.name.endsWith('.ts')).map((file) => file.name.slice(0, -3));
  const snapshots = new Set(
    files.filter((file) => file.isFile() && file.name.endsWith('.json')).map((file) => file.name.slice(0, -5)),
  );
  return names.filter((name) => name !== 'index' && !snapshots.has(name)).sort();
}

/** What a migration's `up` does, without its `down` — a rollback is a developer's, run against the schema it finds. */
async function upOf(name: string): Promise<string> {
  const source = await readFile(path.join(migrationsDirectory, `${name}.ts`), 'utf8');
  const start = source.indexOf('export async function up(');
  expect(start, `${name} has no up()`).toBeGreaterThanOrEqual(0);
  const end = source.indexOf('export async function down(', start);
  return source.slice(start, end === -1 ? undefined : end);
}

/** Every string a frozen words module holds, however deeply it is nested. */
function strings(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) for (const item of value) strings(item, found);
  else if (value && typeof value === 'object') for (const item of Object.values(value)) strings(item, found);
  return found;
}

test.describe('data migrations', () => {
  test('seed their rows in SQL rather than through Payload', async () => {
    const offenders: string[] = [];
    for (const name of await dataMigrations()) {
      const up = await upOf(name);
      // An upload is the one call no INSERT can stand in for: the file has to
      // be converted and written to storage.
      const calls = [...up.matchAll(/payload\.\w+\(\{[\s\S]{0,160}/g)].map((match) => match[0]);
      if (calls.some((call) => !/^payload\.create\(\{[\s\S]*collection: 'media'/.test(call))) offenders.push(name);
    }

    expect(offenders).toEqual([...PREDATING].sort());
  });

  test('upload their files through Payload, since no INSERT can', async () => {
    // The two that put a file into the CMS. Named here so that the rule above
    // cannot be read as "no migration ever calls Payload": it is "no migration
    // writes *rows* through Payload".
    for (const name of ['20260920_204226_import_trust_strip', '20260921_101500_import_launch_articles']) {
      expect(await upOf(name), `${name} no longer uploads its files`).toContain("collection: 'media'");
    }
  });

  test('freeze the words they import, unchanged, into the SQL that writes them', () => {
    for (const entry of FROZEN) {
      const missing = strings(entry.words)
        .filter((value) => value.trim().length > 0 && !(entry.except?.(value) ?? false))
        // A quote inside a SQL string is written twice.
        .filter((value) => !entry.seed.includes(value.replaceAll("'", "''")));

      expect(missing, `${entry.name}: frozen words its seed does not write`).toEqual([]);
    }
  });
});
