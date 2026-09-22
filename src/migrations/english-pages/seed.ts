/**
 * The statements that propose the English pages (ticket 42): a draft of each
 * entry the six pages read, with its English written in, and a draft English
 * question for each Arabic one.
 *
 * **Built from the modules beside this, which are what to read.** This is only
 * how the drafts are made.
 *
 * Written out rather than produced by `npm run cms:freeze-seed`, for the
 * reason `answer-first-proposal/seed.ts` gives — that tool freezes an import
 * into empty tables, and this proposes a change to rows the imports already
 * wrote — and to the same rules:
 *
 * - **Nothing is found by an id, and no column is named.** An entry's newest
 *   version is found by being the newest; it and every row of every list in it
 *   are copied as the tables have them when this runs, so a field added later
 *   is carried into the draft rather than wiped from it.
 * - **A word's English is found by its Arabic.** Every English column of the
 *   copy — any column ending `_en` beside one ending `_ar` — is given the
 *   English of the Arabic beside it (`entries.ts`), wherever the two are in the
 *   entry, so an Editor who has reordered a list or moved a word loses nothing.
 *   A word whose Arabic is in Latin letters — a company's name, `PDF` — is the
 *   same in English. A word whose Arabic the founder has rewritten since it
 *   was imported has no English here, and is left empty: the CMS then refuses
 *   to publish the draft in English until it is written, and says which word
 *   it wants, which is right — nobody here knows its English.
 * - **Nothing is published, and nothing of the founder's is overwritten or
 *   buried.** An entry's draft is made from its newest version, draft or
 *   published — so a draft already waiting, the Arabic openers ticket 35
 *   proposed among them, is carried into this one with its Arabic untouched
 *   rather than pushed aside by it — and an English word already written is
 *   kept. An entry whose newest version has its English already — the word
 *   that marks this proposal written — is left alone; so is a question
 *   already asked in English.
 * - **English is not ticked.** The draft's languages are the ones it was
 *   copied with, Arabic alone. Ticking **الإنجليزية** under «منشورة باللغات» is
 *   the founder's approval of the English, and nothing else gives it: were it
 *   ticked here, publishing an Arabic edit made on top of this draft would put
 *   the page's English live with it, read or not.
 */
import { ENGLISH_WORDS } from './entries';
import { ENGLISH_QUESTIONS } from './faqs';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/**
 * The helpers, made for this session alone and dropped at the end.
 *
 * - `english_of` gives a row's English columns the English of the Arabic
 *   beside each.
 * - `copy_rows` copies every row of every list that points at a row, and
 *   every row of the lists inside those, the way ticket 35's does — the Record
 *   holds its transaction types, and they their steps — and gives each copy its
 *   English as it goes.
 * - `propose` makes the draft of one entry.
 */
const HELPERS = `
CREATE FUNCTION pg_temp.english_of(tbl regclass, row_id bigint, english jsonb) RETURNS void AS $english$
DECLARE
  settings text;
BEGIN
  SELECT string_agg(format(
           '%1$I = coalesce(nullif(%1$I, ''''), CASE WHEN coalesce(%2$I, '''') = '''' THEN NULL WHEN %2$I !~ ''[\\u0600-\\u06FF]'' THEN %2$I ELSE $2 ->> %2$I END)',
           en.column_name, left(en.column_name, -3) || '_ar'), ', ')
    INTO settings
    FROM information_schema.columns en
   WHERE en.table_schema = 'public'
     AND en.table_name = (SELECT relname FROM pg_class WHERE oid = tbl)
     AND en.column_name LIKE '%\\_en'
     AND EXISTS (SELECT 1 FROM information_schema.columns ar
                  WHERE ar.table_schema = 'public' AND ar.table_name = en.table_name
                    AND ar.column_name = left(en.column_name, -3) || '_ar');
  IF settings IS NULL THEN RETURN; END IF;
  EXECUTE format('UPDATE %s SET %s WHERE "id" = $1', tbl, settings) USING row_id, english;
END $english$ LANGUAGE plpgsql;

CREATE FUNCTION pg_temp.copy_rows(parent regclass, was bigint, becomes bigint, english jsonb) RETURNS void AS $copy$
DECLARE
  list record;
  names text;
  copied text;
  row_was bigint;
  row_becomes bigint;
BEGIN
  FOR list IN
    SELECT f.conrelid::regclass AS held_in, a.attname AS points_at
      FROM pg_constraint f
      JOIN pg_attribute a ON a.attrelid = f.conrelid AND a.attnum = ANY (f.conkey)
     WHERE f.contype = 'f' AND f.confrelid = parent AND f.conrelid <> f.confrelid
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

    FOR row_was IN
      EXECUTE format('SELECT "id" FROM %s WHERE %I = $1 ORDER BY "id"', list.held_in, list.points_at) USING was
    LOOP
      EXECUTE format('INSERT INTO %s (%s) SELECT %s FROM %s WHERE "id" = $1 RETURNING "id"',
                     list.held_in, names, copied, list.held_in)
        INTO row_becomes USING row_was, becomes;
      PERFORM pg_temp.english_of(list.held_in, row_becomes, english);
      PERFORM pg_temp.copy_rows(list.held_in, row_was, row_becomes, english);
    END LOOP;
  END LOOP;
END $copy$ LANGUAGE plpgsql;

CREATE FUNCTION pg_temp.propose(versions text, mark text, english jsonb) RETURNS void AS $propose$
DECLARE
  entry regclass := quote_ident(versions)::regclass;
  newest bigint;
  proposal bigint;
  in_english boolean;
  names text;
  copied text;
BEGIN
  -- The newest version, published or a draft that waits: the draft is made
  -- from it, so a draft of the founder's goes on waiting inside this one.
  EXECUTE format('SELECT "id" FROM %s WHERE "latest"', entry) INTO newest;
  IF newest IS NULL THEN RETURN; END IF;

  -- Already in English: it has its words, the founder's or this proposal's
  -- from a run before, and wants none of these.
  EXECUTE format('SELECT coalesce(%I, '''') <> '''' FROM %s WHERE "id" = $1', mark, entry)
    INTO in_english USING newest;
  IF in_english THEN RETURN; END IF;

  SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
         string_agg(CASE
                      WHEN column_name = 'version__status' THEN '''draft'''
                      WHEN column_name = 'latest' THEN 'true'
                      WHEN column_name IN ('created_at', 'updated_at', 'version_updated_at') THEN 'now()'
                      ELSE quote_ident(column_name)
                    END, ', ' ORDER BY ordinal_position)
    INTO names, copied
    FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = versions AND column_name <> 'id';

  EXECUTE format('INSERT INTO %s (%s) SELECT %s FROM %s WHERE "id" = $1 RETURNING "id"', entry, names, copied, entry)
    INTO proposal USING newest;
  EXECUTE format('UPDATE %s SET "latest" = false WHERE "id" <> $1', entry) USING proposal;

  PERFORM pg_temp.english_of(entry, proposal, english);
  PERFORM pg_temp.copy_rows(entry, newest, proposal, english);
END $propose$ LANGUAGE plpgsql;`;

/**
 * Each entry's table of versions, and one English word its proposal writes and
 * nobody else would, by the column it is in: how an entry that has its English
 * already is known, and how the proposal's draft is known again when it is
 * taken back.
 * Written out, so that a word changed in the English modules cannot quietly
 * leave a draft unmarked; the unit test holds each to what is proposed.
 */
export const MARKS: Readonly<Record<string, { readonly column: string; readonly english: string }>> = {
  '_home_page_v': { column: 'version_hero_eyebrow_en', english: 'The construction project OS · Rabaed' },
  '_product_page_v': { column: 'version_hero_title_en', english: 'Rabaed’s units — and what each party sees of them.' },
  '_start_page_v': { column: 'version_hero_title_en', english: 'How we start with you — and everything you might ask.' },
  '_tool_page_v': { column: 'version_hero_title_en', english: 'Log today’s pour, and know when the cube test is due —' },
  '_referral_page_v': { column: 'version_hero_title_en', english: 'Refer one project. Earn SAR {payout}.' },
  '_partnership_page_v': { column: 'version_hero_title_en', english: 'A project management platform… inside your own proposal' },
  '_closing_section_v': {
    column: 'version_closing_heading_en',
    english: 'Our team on your site. All three parties on the platform within days.',
  },
  '_screen_mocks_v': {
    column: 'version_correspondence_description_en',
    english:
      'Rabaed’s official correspondence screen: letters with reference numbers, reply statuses and how long each has waited between the parties',
  },
  '_trust_strip_v': { column: 'version_strip_caption_en', english: 'Parties using Rabaed right now' },
  '_search_settings_v': { column: 'version_home_title_en', english: 'Rabaed · Three parties. One record.' },
};

/** Every Arabic word's English, as the helpers read it. */
const ENGLISH = text(JSON.stringify(Object.fromEntries(ENGLISH_WORDS)));

const ENTRIES = Object.entries(MARKS)
  .map(([versions, mark]) => `SELECT pg_temp.propose(${text(versions)}, ${text(mark.column)}, ${ENGLISH}::jsonb);`)
  .join('\n');

/**
 * The English questions: each a new entry, a draft, placed in its page's list
 * where its Arabic is — the lists are dragged into order across both
 * languages, so the English go at the end, one after another in the order
 * their Arabic stands. `_order` is a fractional index, compared as text, so
 * the last key with one more digit sorts after it; the digits run from `1`,
 * never `0`, for the reason `answer-first-proposal/seed.ts` gives.
 *
 * Only for an Arabic question still asked as it was imported or proposed, and
 * not already asked in English on its page.
 */
const QUESTIONS = `
WITH english ("page", "arabic", "question", "answer") AS (
  VALUES
${ENGLISH_QUESTIONS.map((entry) => `    (${text(entry.page)}, ${text(entry.arabic)}, ${text(entry.question)}, ${text(entry.answer)})`).join(',\n')}
),
placed AS (
  SELECT english.*, row_number() OVER (ORDER BY arabic."_order", arabic."id") AS "place"
    FROM english
    JOIN "faq_entries" arabic
      ON arabic."page" = english."page"::"enum_faq_entries_page" AND arabic."locale" = 'ar' AND arabic."question" = english."arabic"
   WHERE NOT EXISTS (SELECT 1 FROM "faq_entries" asked
                      WHERE asked."page" = english."page"::"enum_faq_entries_page" AND asked."locale" = 'en'
                        AND asked."question" = english."question")
)
INSERT INTO "faq_entries" ("_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
SELECT (SELECT max("_order") FROM "faq_entries") || substr('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', "place"::int, 1),
       "question", "answer", "page"::"enum_faq_entries_page", 'en', true, now(), now(), 'draft'
  FROM placed
 ORDER BY "place";

INSERT INTO "_faq_entries_v" ("parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
SELECT "id", "_order", "question", "answer", "page"::text::"enum__faq_entries_v_version_page", 'en', "shows", "updated_at", "created_at", 'draft', now(), now(), true
  FROM "faq_entries"
 WHERE ${proposedQuestions()}
   AND NOT EXISTS (SELECT 1 FROM "_faq_entries_v" WHERE "_faq_entries_v"."parent_id" = "faq_entries"."id");`;

/** An English question as this proposes it: a draft, asking one of these questions. */
function proposedQuestions(): string {
  const questions = [...new Set(ENGLISH_QUESTIONS.map((entry) => entry.question))].map(text).join(', ');
  return `"locale" = 'en' AND "_status" = 'draft' AND "question" IN (${questions})`;
}

export const ENGLISH_PAGES_SEED = [
  HELPERS,
  ENTRIES,
  QUESTIONS,
  `DROP FUNCTION pg_temp.propose(text, text, jsonb);
DROP FUNCTION pg_temp.copy_rows(regclass, bigint, bigint, jsonb);
DROP FUNCTION pg_temp.english_of(regclass, bigint, jsonb);`,
].join('\n\n');

/**
 * Takes the proposals back: each entry's drafts still carrying the word that
 * marks this proposal, with their lists — which point at them, and are
 * deleted with them — and each English question this proposed that nobody
 * has published. What is published is never touched, and nor is a draft that
 * no longer carries its mark; a draft the founder saved from the proposal,
 * leaving that one word as it was, would go with it, which is the price of a
 * rollback that cannot know a version by its id.
 */
export const ENGLISH_PAGES_UNSEED = [
  ...Object.entries(MARKS).map(
    ([versions, mark]) => `DELETE FROM "${versions}" WHERE "version__status" = 'draft' AND "${mark.column}" = ${text(mark.english)};

UPDATE "${versions}" SET "latest" = true WHERE "id" = (SELECT max("id") FROM "${versions}");`,
  ),
  // The version first and by hand: deleting a question sets its versions'
  // `parent_id` to nothing rather than deleting them (`answer-first-proposal/seed.ts`).
  `DELETE FROM "_faq_entries_v"
 WHERE "parent_id" IN (SELECT "id" FROM "faq_entries" WHERE ${proposedQuestions()}
                          AND "id" NOT IN (SELECT "parent_id" FROM "_faq_entries_v" WHERE "version__status" = 'published'));`,
  `DELETE FROM "faq_entries" WHERE ${proposedQuestions()}
   AND "id" NOT IN (SELECT "parent_id" FROM "_faq_entries_v" WHERE "version__status" = 'published' AND "parent_id" IS NOT NULL);`,
].join('\n\n');
