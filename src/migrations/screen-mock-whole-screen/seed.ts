/**
 * The statements that write the words on a Phone crop and on the whole screen
 * it opens into the words every page shares (ticket 78), in both languages.
 *
 * Written where ticket 77's swipe hint was, and for the same reasons
 * (`screen-mock-swipe-hint/seed.ts`): into what is published, and into the
 * entry's newest version and its newest published one, so a waiting draft
 * keeps its place and gains the words. Only where a language's words are
 * still empty, so words an Editor has written are kept; English with Arabic,
 * so the English is waiting on the day the entry is published in it.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { WHOLE_SCREEN_WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** The column each field is stored in, and its version's. */
const COLUMNS = {
  openWhole: 'screen_mocks_open_whole',
  closeWhole: 'screen_mocks_close_whole',
  zoomWhole: 'screen_mocks_zoom_whole',
} as const satisfies Record<keyof typeof WHOLE_SCREEN_WORDS, string>;

const FIELDS = Object.entries(COLUMNS) as [keyof typeof COLUMNS, string][];

/** Every column, in both languages, set where it is still empty — null, or cleared to nothing. */
const fill = (prefix: string) =>
  FIELDS.flatMap(([field, column]) =>
    (['ar', 'en'] as const).map((language) => {
      const name = `"${prefix}${column}_${language}"`;
      return `${name} = coalesce(nullif(${name}, ''), ${text(WHOLE_SCREEN_WORDS[field][language])})`;
    }),
  ).join(',\n       ');

/** Every column cleared, where it still holds these words. */
const clear = (prefix: string) =>
  FIELDS.flatMap(([field, column]) =>
    (['ar', 'en'] as const).map((language) => {
      const name = `"${prefix}${column}_${language}"`;
      return `${name} = NULLIF(${name}, ${text(WHOLE_SCREEN_WORDS[field][language])})`;
    }),
  ).join(',\n       ');

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_site_words_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_site_words_v" WHERE "version__status" = 'published'`;

export const WHOLE_SCREEN_SEED = `
UPDATE "site_words"
   SET ${fill('')};

UPDATE "_site_words_v"
   SET ${fill('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;

/** Takes the words back off, where they are still these, from the same rows. */
export const WHOLE_SCREEN_UNSEED = `
UPDATE "site_words"
   SET ${clear('')};

UPDATE "_site_words_v"
   SET ${clear('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;
