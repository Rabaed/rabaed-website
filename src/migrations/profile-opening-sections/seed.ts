/**
 * The statements that write the Company profile's sections 01 to 04
 * (ticket 105) into its entry, in both languages.
 *
 * **Written out rather than produced by `npm run cms:freeze-seed`.** The
 * profile's entry was filled by ticket 102's import, and the freezer refuses a
 * migration adding to tables an earlier import filled (docs/deployment.md,
 * "What a data migration may and may not do"). So these are written to the
 * same rule by hand, from `words.ts` beside them:
 *
 * - **Every column is named as of today**, and a column added later takes its
 *   default, so a database built from scratch goes on running this.
 * - **Into the entry, and into its newest version and its newest published
 *   one**, as ticket 77's swipe hint was. Until the founder publishes the
 *   profile the newest version is ticket 102's draft, which is what an Editor
 *   opens and previews; older versions are history, and are left as they were.
 * - **Only where nothing is written yet.** A word is filled only where it is
 *   still empty, and a list only where it has no rows, so what an Editor has
 *   written — on a database where the profile was edited before this ran — is
 *   kept. A list's rows are found by the entry they belong to, never by an id.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { PROFILE_OPENING_WORDS as WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

type Both = { readonly ar: string; readonly en: string };

/** The entry's words, by the column each is kept in, without its language. */
const COLUMNS: readonly [string, Both][] = [
  ['truth_eyebrow', WORDS.truth.eyebrow],
  ['truth_title', WORDS.truth.title],
  ['truth_body', WORDS.truth.body],
  ['truth_caption', WORDS.truth.caption],
  ['truth_note_revision', WORDS.truth.noteRevision],
  ['truth_note_comments', WORDS.truth.noteComments],
  ['truth_note_who', WORDS.truth.noteWho],
  ['numbers_eyebrow', WORDS.numbers.eyebrow],
  ['numbers_title', WORDS.numbers.title],
  ['numbers_source', WORDS.numbers.source],
  ['trap_eyebrow', WORDS.trap.eyebrow],
  ['trap_title', WORDS.trap.title],
  ['trap_body', WORDS.trap.body],
  ['trap_kicker', WORDS.trap.kicker],
  ['about_eyebrow', WORDS.about.eyebrow],
  ['about_title', WORDS.about.title],
  ['about_title_accent', WORDS.about.titleAccent],
  ['about_body', WORDS.about.body],
  ['about_quote', WORDS.about.quote],
];

/**
 * Each list row's id in the entry, which its versions' rows carry as `_uuid`:
 * made up here, as Payload makes one up for a row added in the admin. Written
 * only into an entry whose list is empty, so it can meet no other row's.
 */
const FIGURE_IDS = ['6aea85eceefa064f2c623101', '6aea85eceefa064f2c623102', '6aea85eceefa064f2c623103'];
const TOOL_IDS = ['6aea85eceefa064f2c623104', '6aea85eceefa064f2c623105', '6aea85eceefa064f2c623106', '6aea85eceefa064f2c623107'];

/** Every word, set where it is still empty — null, or cleared to nothing. */
const filled = (prefix: '' | 'version_') =>
  COLUMNS.flatMap(([column, words]) =>
    (['ar', 'en'] as const).map((language) => {
      const name = `"${prefix}${column}_${language}"`;
      return `${name} = coalesce(nullif(${name}, ''), ${text(words[language])})`;
    }),
  ).join(',\n       ');

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

const FIGURES = WORDS.numbers.figures
  .map(({ figure, label }, index) => `(${index + 1}, ${text(FIGURE_IDS[index]!)}, ${text(figure)}, ${text(label.ar)}, ${text(label.en)})`)
  .join(',\n         ');

const TOOLS = WORDS.trap.tools
  .map(
    ({ name, text: line }, index) =>
      `(${index + 1}, ${text(TOOL_IDS[index]!)}, ${text(name.ar)}, ${text(name.en)}, ${text(line.ar)}, ${text(line.en)})`,
  )
  .join(',\n         ');

/** A list's rows, into the entry and into each version written, where that one's list is still empty. */
function rows(list: string, columns: string, values: string): string {
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
         ${values}) AS seeded ("_order", "id", ${columns})
 WHERE NOT EXISTS (SELECT 1 FROM ${entryTable} WHERE "_parent_id" = entry."id");

INSERT INTO ${versionTable} ("_order", "_parent_id", "_uuid", ${columns})
SELECT seeded."_order", version."id", seeded."id", ${seededColumns}
  FROM "_profile_page_v" AS version
 CROSS JOIN (VALUES
         ${values}) AS seeded ("_order", "id", ${columns})
 WHERE version."id" IN (${WRITTEN_VERSIONS})
   AND NOT EXISTS (SELECT 1 FROM ${versionTable} WHERE "_parent_id" = version."id");
`;
}

export const PROFILE_OPENING_SEED = `
UPDATE "profile_page"
   SET ${filled('')};

UPDATE "_profile_page_v"
   SET ${filled('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
${rows('numbers_figures', '"figure", "label_ar", "label_en"', FIGURES)}${rows('trap_tools', '"name_ar", "name_en", "text_ar", "text_en"', TOOLS)}`;

/**
 * Takes the words back off, where they are still these, and the rows this
 * wrote, from the same places. The schema migration before it then drops the
 * columns and the lists' tables.
 */
export const PROFILE_OPENING_UNSEED = `
UPDATE "profile_page"
   SET ${COLUMNS.flatMap(([column, words]) => (['ar', 'en'] as const).map((language) => `"${column}_${language}" = NULLIF("${column}_${language}", ${text(words[language])})`)).join(',\n       ')};

UPDATE "_profile_page_v"
   SET ${COLUMNS.flatMap(([column, words]) => (['ar', 'en'] as const).map((language) => `"version_${column}_${language}" = NULLIF("version_${column}_${language}", ${text(words[language])})`)).join(',\n       ')}
 WHERE "id" IN (${WRITTEN_VERSIONS});

DELETE FROM "profile_page_numbers_figures" WHERE "id" IN (${FIGURE_IDS.map(text).join(', ')});
DELETE FROM "_profile_page_v_version_numbers_figures" WHERE "_uuid" IN (${FIGURE_IDS.map(text).join(', ')});
DELETE FROM "profile_page_trap_tools" WHERE "id" IN (${TOOL_IDS.map(text).join(', ')});
DELETE FROM "_profile_page_v_version_trap_tools" WHERE "_uuid" IN (${TOOL_IDS.map(text).join(', ')});
`;
