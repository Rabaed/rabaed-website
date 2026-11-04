/**
 * The statements that write the Company profile's sections 06 to 08
 * (ticket 107) into its entry, in both languages.
 *
 * **Written out rather than produced by `npm run cms:freeze-seed`**, for the
 * reason ticket 105's sections were (`../profile-opening-sections/seed.ts`):
 * the profile's entry was filled by ticket 102's import, and the freezer
 * refuses a migration adding to tables an earlier import filled. So these are
 * written to the same rule by hand, from `words.ts` beside them:
 *
 * - **Every column is named as of today**, and a column added later takes its
 *   default, so a database built from scratch goes on running this.
 * - **Into the entry, and into its newest version and its newest published
 *   one.** Until the founder publishes the profile the newest version is the
 *   draft an Editor opens and previews; older versions are history, and are
 *   left as they were.
 * - **Only where nothing is written yet.** A word is filled only where it is
 *   still empty, and a list only where it has no rows, so what an Editor has
 *   written is kept. A list's rows are found by the entry they belong to,
 *   never by an id.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { PROFILE_SOLUTION_WORDS as WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

type Both = { readonly ar: string; readonly en: string };

/** The entry's words, by the column each is kept in, without its language. */
const COLUMNS: readonly [string, Both][] = [
  ['parties_eyebrow', WORDS.parties.eyebrow],
  ['parties_title', WORDS.parties.title],
  ['parties_lead', WORDS.parties.lead],
  ['parties_record', WORDS.parties.record],
  ['parties_footer', WORDS.parties.footer],
  ['platform_eyebrow', WORDS.platform.eyebrow],
  ['platform_title', WORDS.platform.title],
  ['platform_lead', WORDS.platform.lead],
  ['platform_output', WORDS.platform.output],
  ['record_eyebrow', WORDS.record.eyebrow],
  ['record_title', WORDS.record.title],
  ['record_body', WORDS.record.body],
  ['record_document', WORDS.record.document],
  ['record_example', WORDS.record.example],
  ['record_summary', WORDS.record.summary],
];

/** The entry's Latin values, one for both languages, by their column. */
const LATIN: readonly [string, string][] = [['record_code', WORDS.record.code]];

/**
 * Each list row's id in the entry, which its versions' rows carry as `_uuid`:
 * made up here, as Payload makes one up for a row added in the admin, after
 * the ones ticket 105 made up. Written only into an entry whose list is empty,
 * so it can meet no other row's.
 */
const CARD_IDS = ['6aea85eceefa064f2c623108', '6aea85eceefa064f2c623109', '6aea85eceefa064f2c623110'];
const UNIT_IDS = ['6aea85eceefa064f2c623111', '6aea85eceefa064f2c623112', '6aea85eceefa064f2c623113', '6aea85eceefa064f2c623114'];
const STEP_IDS = ['6aea85eceefa064f2c623115', '6aea85eceefa064f2c623116', '6aea85eceefa064f2c623117', '6aea85eceefa064f2c623118'];

/** Every column this writes, each language's on its own, with what it writes there. */
const WRITTEN: readonly (readonly [string, string])[] = [
  ...COLUMNS.flatMap(([column, words]) => (['ar', 'en'] as const).map((language) => [`${column}_${language}`, words[language]] as const)),
  ...LATIN,
];

/** Every word and Latin value, set where it is still empty — null, or cleared to nothing. */
const filled = (prefix: '' | 'version_') =>
  WRITTEN.map(([column, value]) => {
    const name = `"${prefix}${column}"`;
    return `${name} = coalesce(nullif(${name}, ''), ${text(value)})`;
  }).join(',\n       ');

/** Every word and Latin value taken back off, where it is still this one. */
const emptied = (prefix: '' | 'version_') =>
  WRITTEN.map(([column, value]) => `"${prefix}${column}" = NULLIF("${prefix}${column}", ${text(value)})`).join(',\n       ');

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

const values = (rows: readonly (readonly string[])[], ids: readonly string[]) =>
  rows.map((row, index) => `(${index + 1}, ${[ids[index]!, ...row].map(text).join(', ')})`).join(',\n         ');

const CARDS = values(
  WORDS.parties.cards.map(({ name, want }) => [name.ar, name.en, want.ar, want.en]),
  CARD_IDS,
);
const UNITS = values(
  WORDS.platform.units.map(({ name, text: line }) => [name.ar, name.en, line.ar, line.en]),
  UNIT_IDS,
);
const STEPS = values(
  WORDS.record.steps.map(({ verb, who, time }) => [verb.ar, verb.en, who.ar, who.en, time]),
  STEP_IDS,
);

/** A list's rows, into the entry and into each version written, where that one's list is still empty. */
function rows(list: string, columns: string, seeded: string): string {
  const seededColumns = columns
    .split(', ')
    .map((column) => `seeded.${column}`)
    .join(', ');
  const entryTable = `"profile_page_${list}"`;
  const versionTable = `"_profile_page_v_version_${list}"`;
  return `
INSERT INTO ${entryTable} ("_order", "_parent_id", "id", ${columns})
SELECT seeded."_order", entry."id", seeded."id", ${seededColumns}
  FROM "profile_page" AS entry
 CROSS JOIN (VALUES
         ${seeded}) AS seeded ("_order", "id", ${columns})
 WHERE NOT EXISTS (SELECT 1 FROM ${entryTable} WHERE "_parent_id" = entry."id");

INSERT INTO ${versionTable} ("_order", "_parent_id", "_uuid", ${columns})
SELECT seeded."_order", version."id", seeded."id", ${seededColumns}
  FROM "_profile_page_v" AS version
 CROSS JOIN (VALUES
         ${seeded}) AS seeded ("_order", "id", ${columns})
 WHERE version."id" IN (${WRITTEN_VERSIONS})
   AND NOT EXISTS (SELECT 1 FROM ${versionTable} WHERE "_parent_id" = version."id");
`;
}

export const PROFILE_SOLUTION_SEED = `
UPDATE "profile_page"
   SET ${filled('')};

UPDATE "_profile_page_v"
   SET ${filled('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
${rows('parties_cards', '"name_ar", "name_en", "want_ar", "want_en"', CARDS)}${rows(
  'platform_units',
  '"name_ar", "name_en", "text_ar", "text_en"',
  UNITS,
)}${rows('record_steps', '"verb_ar", "verb_en", "who_ar", "who_en", "time"', STEPS)}`;

const deleted = (list: string, ids: readonly string[]) => `
DELETE FROM "profile_page_${list}" WHERE "id" IN (${ids.map(text).join(', ')});
DELETE FROM "_profile_page_v_version_${list}" WHERE "_uuid" IN (${ids.map(text).join(', ')});`;

/**
 * Takes the words back off, where they are still these, and the rows this
 * wrote, from the same places. The schema migration before it then drops the
 * columns and the lists' tables.
 */
export const PROFILE_SOLUTION_UNSEED = `
UPDATE "profile_page"
   SET ${emptied('')};

UPDATE "_profile_page_v"
   SET ${emptied('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
${deleted('parties_cards', CARD_IDS)}${deleted('platform_units', UNIT_IDS)}${deleted('record_steps', STEP_IDS)}
`;
