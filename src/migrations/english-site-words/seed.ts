/**
 * The statements that propose the English of the words every page shares
 * (ticket 40): one draft of the site words entry, which is the published
 * entry with its English written in and English added to the languages it is
 * published in.
 *
 * **Built from `words.ts` beside this, which is what to read.** This is only
 * how the draft is made.
 *
 * Written out rather than produced by `npm run cms:freeze-seed`, for the
 * reason `answer-first-proposal/seed.ts` gives — that tool freezes an import
 * into empty tables, and this proposes a change to rows an import already
 * wrote — and to the same rules:
 *
 * - **Nothing is found by an id.** The published version is the newest one
 *   whose status says so; a link is found by where it goes, since an Editor
 *   may have reordered the menu.
 * - **The entry is copied rather than listed.** Its columns and its lists are
 *   read from the tables as they are when this runs, so a field added later is
 *   carried into the draft rather than wiped from it.
 * - **Nothing is published, and nothing of the founder's is overwritten.** A
 *   draft already waiting means a proposal would bury his, so none is made; an
 *   entry already published in English has its English, so none is needed;
 *   and a word he has written in English already is kept, the proposal filling
 *   only what is empty.
 *
 * A link an Editor has added since the import, to a page `words.ts` does not
 * name, is copied with its English empty. The CMS then refuses to publish the
 * draft in English until it is written, and says which word it wants — which
 * is right: nobody here knows what that link says.
 */
import { ENGLISH_SITE_WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/**
 * A column's English, set where it is still empty — null, or cleared to
 * nothing, which the CMS saves as an empty string.
 */
const fill = (column: string, english: string) => `${column} = coalesce(nullif(${column}, ''), ${text(english)})`;

/**
 * A list's English, set by where each row goes: `CASE path WHEN … END`, which
 * is null — leaving the row's English empty — for a path this does not know.
 */
function byPath(column: string, englishByPath: Record<string, string>): string {
  const cases = Object.entries(englishByPath)
    .map(([path, english]) => `WHEN ${text(path)} THEN ${text(english)}`)
    .join(' ');
  return `${column} = coalesce(nullif(${column}, ''), CASE "path" ${cases} END)`;
}

const { header, footer, notFound } = ENGLISH_SITE_WORDS;

/** The entry's own English words, on the draft's row. */
const ENTRY = [
  fill('"version_header_partnerships_label_en"', header.partnershipsLabel),
  fill('"version_header_sign_in_label_en"', header.signInLabel),
  fill('"version_header_demo_label_en"', header.demoLabel),
  fill('"version_footer_tagline_en"', footer.tagline),
  fill('"version_footer_rights_en"', footer.rights),
  fill('"version_not_found_heading_en"', notFound.heading),
  fill('"version_not_found_lead_en"', notFound.lead),
  fill('"version_not_found_home_label_en"', notFound.homeLabel),
].join(',\n       ');

const partnerships = (key: 'label' | 'summary') =>
  Object.fromEntries(Object.entries(header.partnerships).map(([path, group]) => [path, group[key]]));

/** The English of each list's rows, on the draft's copies of them. */
const LISTS = `
UPDATE "_site_words_v_version_header_links"
   SET ${byPath('"label_en"', header.links)}
 WHERE "_parent_id" = proposal;

UPDATE "_site_words_v_version_header_partnerships"
   SET ${byPath('"label_en"', partnerships('label'))},
       ${byPath('"summary_en"', partnerships('summary'))}
 WHERE "_parent_id" = proposal;

UPDATE "_site_words_v_version_footer_legal_links"
   SET ${byPath('"label_en"', footer.legalLinks)}
 WHERE "_parent_id" = proposal;`;

export const ENGLISH_SITE_WORDS_SEED = `
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
  SELECT "id" INTO published FROM "_site_words_v" WHERE "latest" AND "version__status" = 'published';
  IF published IS NULL THEN RETURN; END IF;

  -- Already published in English: it has its words, and wants none of these.
  IF EXISTS (SELECT 1 FROM "_site_words_v_version_languages" WHERE "parent_id" = published AND "value" = 'en') THEN
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
   WHERE table_schema = 'public' AND table_name = '_site_words_v' AND column_name <> 'id';
  EXECUTE format('INSERT INTO "_site_words_v" (%s) SELECT %s FROM "_site_words_v" WHERE "id" = $1 RETURNING "id"',
                 names, copied)
    INTO proposal USING published;
  UPDATE "_site_words_v" SET "latest" = false WHERE "id" <> proposal;

  -- And every row of every list that points at it — the menu, the dropdown,
  -- the footer's links, the languages — found by the foreign keys, so a list
  -- added later is copied too. One level only: none of them holds a list of
  -- its own. A list nested inside one later would need copying the way
  -- \`answer-first-proposal/seed.ts\` copies its lists, recursively.
  FOR list IN
    SELECT f.conrelid::regclass AS held_in, a.attname AS points_at
      FROM pg_constraint f
      JOIN pg_attribute a ON a.attrelid = f.conrelid AND a.attnum = ANY (f.conkey)
     WHERE f.contype = 'f' AND f.confrelid = '"_site_words_v"'::regclass AND f.conrelid <> f.confrelid
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

  UPDATE "_site_words_v"
     SET ${ENTRY}
   WHERE "id" = proposal;
${LISTS}

  -- Published in English too, once the founder presses Publish.
  INSERT INTO "_site_words_v_version_languages" ("order", "parent_id", "value")
  SELECT coalesce(max("order"), 0) + 1, proposal, 'en'
    FROM "_site_words_v_version_languages" WHERE "parent_id" = proposal;
END $propose$;`;

/**
 * Takes the proposal back: every draft still carrying two of the words it
 * proposed, the demo button and the footer's line. Its lists go with it — they
 * point at it, and are deleted with it. What is published is never touched,
 * nor a draft whose English has been rewritten; a draft the founder saved
 * from the proposal leaving those two words as they were would go with it,
 * which is the price of a rollback that cannot know a version by its id.
 */
export const ENGLISH_SITE_WORDS_UNSEED = `
DELETE FROM "_site_words_v"
 WHERE "version__status" = 'draft' AND "version_header_demo_label_en" = ${text(header.demoLabel)}
   AND "version_footer_tagline_en" = ${text(footer.tagline)};

UPDATE "_site_words_v" SET "latest" = true WHERE "id" = (SELECT max("id") FROM "_site_words_v");`;
