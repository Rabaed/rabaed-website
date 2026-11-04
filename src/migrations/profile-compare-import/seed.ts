/**
 * The statements that write the before-and-after section's first words
 * (ticket 108) into the Company profile's entry, in both languages.
 *
 * **Written out rather than produced by `npm run cms:freeze-seed`**, which
 * refuses an import into tables an earlier import filled: ticket 102's import
 * wrote the entry's one row. These are `UPDATE`s of columns that row did not
 * have, on the rule `docs/deployment.md` gives for that case ("What a data
 * migration may and may not do"): every column named as it is today, and no
 * row found by an id.
 *
 * Written into the entry itself, and into its newest version and its newest
 * published one, as the swipe hint's were (`../screen-mock-swipe-hint/seed.ts`):
 * whichever an Editor opens or a visitor is shown has them. Only where a
 * language's words are still empty, so nothing an Editor has written is
 * overwritten. Nothing here publishes: the profile is the founder's to
 * publish (ticket 110).
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63). The words
 * are in `words.ts` beside this.
 */
import { PROFILE_COMPARE_WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** A field's name as Payload names its column: `dailyReport` is `daily_report`. */
const snake = (name: string) => name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/** Every column the words go in, under the entry's `compare` tab, with the words for it. */
function columns(value: unknown, path: string[] = ['compare']): [string, string][] {
  if (typeof value === 'string') return [[path.map(snake).join('_'), value]];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, each]) => columns(each, [...path, key]));
}

const WORDS = columns(PROFILE_COMPARE_WORDS);

/** A column's words, set where it is still empty — null, or cleared to nothing. */
const fill = (column: string, words: string) => `"${column}" = coalesce(nullif("${column}", ''), ${text(words)})`;

/** A column's words taken back off, where they are still these. */
const unfill = (column: string, words: string) => `"${column}" = nullif("${column}", ${text(words)})`;

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

function statements(set: (column: string, words: string) => string): string {
  return `
UPDATE "profile_page"
   SET ${WORDS.map(([column, words]) => set(column, words)).join(',\n       ')};

UPDATE "_profile_page_v"
   SET ${WORDS.map(([column, words]) => set(`version_${column}`, words)).join(',\n       ')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;
}

export const PROFILE_COMPARE_SEED = statements(fill);

export const PROFILE_COMPARE_UNSEED = statements(unfill);
