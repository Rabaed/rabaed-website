/**
 * What `npm run cms:rebase-migrations` decides after `main` is merged into a
 * branch (ticket 88): which of the migrations are the branch's own, what name
 * each takes, and what a regenerated migration keeps from the one it replaces.
 *
 * Tested directly because it is pure calculation over file names and file
 * text: the command around it runs Payload and git, and no running site
 * could observe any of it.
 */
import { test, expect } from '@playwright/test';
import { changedStatements, nameAfterMoment, planRebase, tidyMigration } from '../../scripts/migration-rebase.ts';

/** `main`'s migrations: a schema migration with its snapshot, and a data migration after it. */
const MAIN = [
  '20260923_180726_footer_directory.json',
  '20260923_180726_footer_directory.ts',
  '20260923_180727_publish_footer_directory.ts',
];

const NOW = new Date('2026-09-24T12:00:00Z');

test.describe('the names the branch’s migrations take', () => {
  test('a branch whose migrations still sort after all of main’s keeps every name', () => {
    const own = [
      '20260923_193054_screen_mock_swipe_hint.json',
      '20260923_193054_screen_mock_swipe_hint.ts',
      '20260923_193055_publish_screen_mock_swipe_hint.ts',
    ];

    const plan = planRebase({ folder: [...MAIN, ...own, 'index.ts'], base: MAIN, now: NOW });

    expect(plan.regenerate).toEqual(['20260923_193054_screen_mock_swipe_hint']);
    expect(plan.schema).toBe('20260923_193054_screen_mock_swipe_hint');
    expect(plan.renames).toEqual([]);
  });

  // Generated before main's but merged after them, the branch's would run
  // first on a database built from scratch, and main's snapshot, newer by
  // name, would be what the next migration is diffed against — without this
  // branch's tables in it.
  test('a branch with a migration older than one of main’s moves them all after main’s, in their order', () => {
    const own = [
      '20260923_170000_screen_mock_swipe_hint.json',
      '20260923_170000_screen_mock_swipe_hint.ts',
      '20260923_170001_publish_screen_mock_swipe_hint.ts',
    ];

    const plan = planRebase({ folder: [...MAIN, ...own], base: MAIN, now: NOW });

    expect(plan.schema).toBe('20260924_120000_screen_mock_swipe_hint');
    expect(plan.renames).toEqual([
      { from: '20260923_170000_screen_mock_swipe_hint', to: '20260924_120000_screen_mock_swipe_hint' },
      {
        from: '20260923_170001_publish_screen_mock_swipe_hint',
        to: '20260924_120001_publish_screen_mock_swipe_hint',
      },
    ]);
  });

  // Some of main's are named by hand, for an hour that may not have come yet.
  test('moved migrations start after main’s newest when it is named later than now', () => {
    const main = [...MAIN, '20260924_150000_propose_english_pages.ts'];
    const own = ['20260923_170000_trust_strip.json', '20260923_170000_trust_strip.ts'];

    const plan = planRebase({ folder: [...main, ...own], base: main, now: NOW });

    expect(plan.schema).toBe('20260924_150001_trust_strip');
  });

  // One regenerated migration holds the whole difference from main, so the
  // second has nothing left to say and is not given a name.
  test('two schema migrations of the branch’s become one, where the first was', () => {
    const own = [
      '20260923_170000_phone_crops.json',
      '20260923_170000_phone_crops.ts',
      '20260923_170001_publish_phone_crops.ts',
      '20260923_170100_phone_crop_upload.json',
      '20260923_170100_phone_crop_upload.ts',
    ];

    const plan = planRebase({ folder: [...MAIN, ...own], base: MAIN, now: NOW });

    expect(plan.regenerate).toEqual(['20260923_170000_phone_crops', '20260923_170100_phone_crop_upload']);
    expect(plan.schema).toBe('20260924_120000_phone_crops');
    expect(plan.renames).toEqual([
      { from: '20260923_170000_phone_crops', to: '20260924_120000_phone_crops' },
      { from: '20260923_170001_publish_phone_crops', to: '20260924_120001_publish_phone_crops' },
    ]);
  });
});

/** A migration as `payload migrate:create` writes it. */
const GENERATED = `import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" ADD COLUMN "screen_mocks_swipe_hint_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_swipe_hint_ar" varchar;\`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" DROP COLUMN "screen_mocks_swipe_hint_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_swipe_hint_ar";\`)
}
`;

/** The same migration as the branch had it before, explained by hand. */
const PREVIOUS = `import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the words every page shares a place for the swipe hint (ticket 77).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" ADD COLUMN "screen_mocks_swipe_hint_ar" varchar;\`);
}

/** Takes the place away again. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" DROP COLUMN "screen_mocks_swipe_hint_ar";\`);
}
`;

test.describe('the regenerated migration', () => {
  test('imports its types as types, and keeps what the old one said about itself', () => {
    expect(tidyMigration({ generated: GENERATED, previous: PREVIOUS })).toBe(
      `import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the words every page shares a place for the swipe hint (ticket 77).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" ADD COLUMN "screen_mocks_swipe_hint_ar" varchar;
  ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_swipe_hint_ar" varchar;\`);
}

/** Takes the place away again. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql\`
   ALTER TABLE "site_words" DROP COLUMN "screen_mocks_swipe_hint_ar";
  ALTER TABLE "_site_words_v" DROP COLUMN "version_screen_mocks_swipe_hint_ar";\`);
}
`,
    );
  });
});

test.describe('what the regenerated migration changes', () => {
  test('names each statement of up that one version has and the other does not', () => {
    expect(changedStatements({ previous: [PREVIOUS], generated: GENERATED })).toEqual({
      dropped: [],
      added: ['ALTER TABLE "_site_words_v" ADD COLUMN "version_screen_mocks_swipe_hint_ar" varchar'],
    });
  });

  test('finds nothing changed when only the spacing and the file around the SQL differ', () => {
    const tidied = tidyMigration({ generated: GENERATED, previous: PREVIOUS });
    expect(changedStatements({ previous: [GENERATED], generated: tidied })).toEqual({ dropped: [], added: [] });
  });

  // A statement added to the old migration by hand is not generated again.
  test('names a statement the old migration had that the configuration does not ask for', () => {
    const edited = PREVIOUS.replace(
      'varchar;`);',
      'varchar;\n  UPDATE "site_words" SET "screen_mocks_swipe_hint_ar" = \'اسحب\';`);',
    );
    expect(changedStatements({ previous: [edited], generated: GENERATED }).dropped).toEqual([
      `UPDATE "site_words" SET "screen_mocks_swipe_hint_ar" = 'اسحب'`,
    ]);
  });
});

test('the name a migration is written under, without the moment in front', () => {
  expect(nameAfterMoment('20260923_193055_publish_screen_mock_swipe_hint')).toBe('publish_screen_mock_swipe_hint');
});
