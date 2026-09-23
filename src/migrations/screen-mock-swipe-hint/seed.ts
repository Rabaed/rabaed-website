/**
 * The statements that write the swipe hint into the words every page shares
 * (ticket 77), in both languages.
 *
 * Written into what is published, which the site reads, and into the entry's
 * newest version and its newest published one, as ticket 47's source was.
 * Where a draft is waiting — the English of ticket 40, or an Editor's own —
 * that is the newest version, and it keeps its place: it is given
 * the hint rather than pushed aside, so publishing it later does not take the
 * hint off the site. Older versions are history, and are left as they were.
 *
 * Only where a language's hint is still empty: words an Editor has written
 * are kept. English is written with Arabic even where the entry is not published in
 * English, so the English is there, waiting, on the day it is.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { SWIPE_HINT } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** A column's hint, set where it is still empty — null, or cleared to nothing. */
const fill = (column: string, words: string) => `${column} = coalesce(nullif(${column}, ''), ${text(words)})`;

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_site_words_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_site_words_v" WHERE "version__status" = 'published'`;

export const SWIPE_HINT_SEED = `
UPDATE "site_words"
   SET ${fill('"screen_mocks_swipe_hint_ar"', SWIPE_HINT.ar)},
       ${fill('"screen_mocks_swipe_hint_en"', SWIPE_HINT.en)};

UPDATE "_site_words_v"
   SET ${fill('"version_screen_mocks_swipe_hint_ar"', SWIPE_HINT.ar)},
       ${fill('"version_screen_mocks_swipe_hint_en"', SWIPE_HINT.en)}
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;

/** Takes the hint back off, where it is still this one, from the same rows. */
export const SWIPE_HINT_UNSEED = `
UPDATE "site_words"
   SET "screen_mocks_swipe_hint_ar" = NULLIF("screen_mocks_swipe_hint_ar", ${text(SWIPE_HINT.ar)}),
       "screen_mocks_swipe_hint_en" = NULLIF("screen_mocks_swipe_hint_en", ${text(SWIPE_HINT.en)});

UPDATE "_site_words_v"
   SET "version_screen_mocks_swipe_hint_ar" = NULLIF("version_screen_mocks_swipe_hint_ar", ${text(SWIPE_HINT.ar)}),
       "version_screen_mocks_swipe_hint_en" = NULLIF("version_screen_mocks_swipe_hint_en", ${text(SWIPE_HINT.en)})
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;
