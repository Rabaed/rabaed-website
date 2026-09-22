/**
 * The statements that propose the English of the Screen mocks' descriptions
 * (ticket 41): one draft of the Screen mocks entry, which is the published
 * entry with each screen's English description written in and English added
 * to the languages it is published in.
 *
 * **Built from `words.ts` beside this, which is what to read.** This is only
 * how the draft is made, and it is made as `english-site-words/seed.ts` makes
 * ticket 40's, to the same rules:
 *
 * - **Nothing is found by an id.** The published version is the newest one
 *   whose status says so.
 * - **The entry is copied rather than listed.** Its columns and its lists are
 *   read from the tables as they are when this runs, so a field added later —
 *   or a replacement picture an Editor chose — is carried into the draft
 *   rather than wiped from it.
 * - **Nothing is published, and nothing of the founder's is overwritten.** A
 *   draft already waiting means a proposal would bury his, so none is made; an
 *   entry already published in English has its English, so none is needed;
 *   and a description he has written in English already is kept, the proposal
 *   filling only what is empty.
 */
import { ENGLISH_SCREEN_MOCK_DESCRIPTIONS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** A mock's column, as Payload names it: `daily-report` is `daily_report`. */
const column = (mockId: string) => `"version_${mockId.replaceAll('-', '_')}_description_en"`;

/**
 * Each description's English, set where it is still empty — null, or cleared
 * to nothing, which the CMS saves as an empty string.
 */
const DESCRIPTIONS = Object.entries(ENGLISH_SCREEN_MOCK_DESCRIPTIONS)
  .map(([mockId, english]) => `${column(mockId)} = coalesce(nullif(${column(mockId)}, ''), ${text(english)})`)
  .join(',\n       ');

export const ENGLISH_SCREEN_MOCK_WORDS_SEED = `
DO $propose$
DECLARE
  published bigint;
  proposal bigint;
  list record;
  names text;
  copied text;
BEGIN
  -- The published version, and only while it is the newest: a draft of the
  -- founder's own is waiting otherwise, and a proposal would bury it.
  SELECT "id" INTO published FROM "_screen_mocks_v" WHERE "latest" AND "version__status" = 'published';
  IF published IS NULL THEN RETURN; END IF;

  -- Already published in English: it has its words, and wants none of these.
  IF EXISTS (SELECT 1 FROM "_screen_mocks_v_version_languages" WHERE "parent_id" = published AND "value" = 'en') THEN
    RETURN;
  END IF;

  -- The published version, copied whole as a draft.
  SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
         string_agg(CASE
                      WHEN column_name = 'version__status' THEN '''draft'''
                      WHEN column_name = 'latest' THEN 'true'
                      WHEN column_name IN ('created_at', 'updated_at', 'version_updated_at') THEN 'now()'
                      ELSE quote_ident(column_name)
                    END, ', ' ORDER BY ordinal_position)
    INTO names, copied
    FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = '_screen_mocks_v' AND column_name <> 'id';
  EXECUTE format('INSERT INTO "_screen_mocks_v" (%s) SELECT %s FROM "_screen_mocks_v" WHERE "id" = $1 RETURNING "id"',
                 names, copied)
    INTO proposal USING published;
  UPDATE "_screen_mocks_v" SET "latest" = false WHERE "id" <> proposal;

  -- And every row of every list that points at it — today only the languages
  -- — found by the foreign keys, so a list added later is copied too.
  FOR list IN
    SELECT f.conrelid::regclass AS held_in, a.attname AS points_at
      FROM pg_constraint f
      JOIN pg_attribute a ON a.attrelid = f.conrelid AND a.attnum = ANY (f.conkey)
     WHERE f.contype = 'f' AND f.confrelid = '"_screen_mocks_v"'::regclass AND f.conrelid <> f.confrelid
       AND array_length(f.conkey, 1) = 1
     ORDER BY f.conrelid::regclass::text
  LOOP
    SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
           string_agg(CASE WHEN column_name = list.points_at THEN '$2' ELSE quote_ident(column_name) END,
                      ', ' ORDER BY ordinal_position)
      INTO names, copied
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = (SELECT relname FROM pg_class WHERE oid = list.held_in)
       AND column_name <> 'id';
    EXECUTE format('INSERT INTO %s (%s) SELECT %s FROM %s WHERE %I = $1 ORDER BY "id"',
                   list.held_in, names, copied, list.held_in, list.points_at)
      USING published, proposal;
  END LOOP;

  UPDATE "_screen_mocks_v"
     SET ${DESCRIPTIONS}
   WHERE "id" = proposal;

  -- Published in English too, once the founder presses Publish.
  INSERT INTO "_screen_mocks_v_version_languages" ("order", "parent_id", "value")
  SELECT coalesce(max("order"), 0) + 1, proposal, 'en'
    FROM "_screen_mocks_v_version_languages" WHERE "parent_id" = proposal;
END $propose$;`;

/**
 * Takes the proposal back: every draft still carrying two of the descriptions
 * it proposed, the first screen's and the last's. Its languages go with it —
 * they point at it, and are deleted with it. What is published is never
 * touched, nor a draft whose English has been rewritten; a draft the founder
 * saved from the proposal leaving those two as they were would go with it,
 * which is the price of a rollback that cannot know a version by its id.
 */
export const ENGLISH_SCREEN_MOCK_WORDS_UNSEED = `
DELETE FROM "_screen_mocks_v"
 WHERE "version__status" = 'draft'
   AND ${column('correspondence')} = ${text(ENGLISH_SCREEN_MOCK_DESCRIPTIONS.correspondence)}
   AND ${column('submittal')} = ${text(ENGLISH_SCREEN_MOCK_DESCRIPTIONS.submittal)};

UPDATE "_screen_mocks_v" SET "latest" = true WHERE "id" = (SELECT max("id") FROM "_screen_mocks_v");`;
