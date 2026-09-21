/**
 * The statements that propose the answer-first copy pass (ticket 35): the four
 * section openers as a draft of each page's entry, the 31 rewritten answers as
 * a draft of each question, and the four comparison questions as new draft
 * entries.
 *
 * **Built from `words.ts` beside this, which is what to read.** The words are
 * frozen there; this names the columns and writes the statements, and is where
 * to look only for *how* a proposal is made, never for *what* it says.
 *
 * **Why it is written out rather than produced by `npm run cms:freeze-seed`.**
 * That tool freezes an import that fills empty tables, and says so itself when
 * one does not: it refuses to freeze a migration that adds rows to a table
 * another import has already filled, because it would write out both. This
 * migration does exactly that — it proposes changes to content the imports
 * before it wrote — so its statements are written here instead, to the same
 * rule and for the same reason (docs/deployment.md, ticket 63):
 *
 * - **Every column named is named as of today.** A field added to the FAQs
 *   later is not in these INSERTs, and takes its default, so a database built
 *   from scratch goes on running this.
 * - **No row is found by an id.** The imports before this one could use the
 *   ids of their own moment, because they ran into empty tables. This one runs
 *   after an Editor may have added or removed a question, so a question is
 *   found by its page and its words, and a new one lets the sequence give it
 *   an id.
 * - **A page's entry is copied rather than listed.** Copying the published
 *   version into a draft is the one thing that must *not* name its columns:
 *   the entry has 157 of them today and will have more, and a copy that missed
 *   one would propose an entry with a field wiped. So the copy reads the
 *   columns the table actually has, which is right on every schema this ever
 *   meets.
 *
 * **Nothing here publishes.** Every row written is a draft, and the published
 * rows a visitor reads are left exactly as they are. Each statement is also
 * guarded so that it proposes nothing where the founder has already written
 * something of his own. Each paragraph carries the words it expects to find
 * published, and is offered only where they are still there — so rewriting one
 * of them costs him that paragraph's proposal and no other's — and a question
 * is left alone unless its published answer is still ticket 22's with no draft
 * of its own waiting.
 */
import { IMPORTED_FAQ_ENTRIES } from '../faq-import/entries';
import { HOME_PAGE_WORDS } from '../home-page-import/words';
import { PRODUCT_PAGE_WORDS } from '../product-page-import/words';
import { COMPARISON_QUESTIONS, FAQ_REWRITES, SECTION_OPENERS } from './words';

/**
 * A value as a SQL string: a quote inside one is written twice.
 *
 * A page and a language are written out this way rather than copied from the
 * row being versioned, though the version holds the same value: the two tables
 * name the same set of pages as two enum types of their own, and Postgres will
 * not put one in a column of the other. Written out, the literal takes the type
 * of the column it lands in.
 */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/**
 * The two helpers the page entries need, made for this session alone and
 * dropped at the end. `copy_rows` calls itself: a page's entry has lists
 * inside lists — the Record's transaction types hold their steps, the
 * journey's panels hold their flow — and every row of every one of them
 * belongs to the draft as much as the paragraph being proposed does.
 */
const HELPERS = `
CREATE FUNCTION pg_temp.copy_rows(parent regclass, was bigint, becomes bigint) RETURNS void AS $copy$
DECLARE
  list record;
  names text;
  values text;
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
      INTO names, values
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = (SELECT relname FROM pg_class WHERE oid = list.held_in)
       AND column_name <> 'id';

    FOR row_was IN
      EXECUTE format('SELECT "id" FROM %s WHERE %I = $1 ORDER BY "id"', list.held_in, list.points_at) USING was
    LOOP
      EXECUTE format('INSERT INTO %s (%s) SELECT %s FROM %s WHERE "id" = $1 RETURNING "id"',
                     list.held_in, names, values, list.held_in)
        INTO row_becomes USING row_was, becomes;
      PERFORM pg_temp.copy_rows(list.held_in, row_was, row_becomes);
    END LOOP;
  END LOOP;
END $copy$ LANGUAGE plpgsql;

CREATE FUNCTION pg_temp.propose(entry regclass, proposed jsonb) RETURNS void AS $propose$
DECLARE
  published bigint;
  proposal bigint;
  untouched text;
  anything bigint;
  names text;
  values text;
BEGIN
  -- Each paragraph carries the words it expects to find, and is proposed only
  -- where they are still there. One paragraph the founder has rewritten
  -- therefore costs him that paragraph's proposal and no other's: a section he
  -- has not touched is still offered its own.
  SELECT string_agg(format('%I IS NOT DISTINCT FROM %L', key, value ->> 'expects'), ' OR ')
    INTO untouched
    FROM jsonb_each(proposed) AS paragraph(key, value);

  -- And only while nothing of his own is waiting as a draft: a draft is the
  -- newest version while it waits, so this finds nothing and proposes nothing.
  EXECUTE format('SELECT "id" FROM %s WHERE "latest" AND "version__status" = ''published''', entry)
    INTO published;
  IF published IS NULL THEN RETURN; END IF;

  -- Nothing left to propose is no reason to make a draft of the whole entry.
  EXECUTE format('SELECT count(*) FROM %s WHERE "id" = $1 AND (%s)', entry, untouched) INTO anything USING published;
  IF anything = 0 THEN RETURN; END IF;

  SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
         string_agg(CASE
                      WHEN proposed ? column_name THEN format(
                        'CASE WHEN %I IS NOT DISTINCT FROM %L THEN %L ELSE %I END',
                        column_name, proposed -> column_name ->> 'expects',
                        proposed -> column_name ->> 'becomes', column_name)
                      WHEN column_name = 'version__status' THEN '''draft'''
                      WHEN column_name = 'latest' THEN 'true'
                      WHEN column_name IN ('created_at', 'updated_at', 'version_updated_at') THEN 'now()'
                      ELSE quote_ident(column_name)
                    END, ', ' ORDER BY ordinal_position)
    INTO names, values
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = (SELECT relname FROM pg_class WHERE oid = entry)
     AND column_name <> 'id';

  EXECUTE format('INSERT INTO %s (%s) SELECT %s FROM %s WHERE "id" = $1 RETURNING "id"', entry, names, values, entry)
    INTO proposal USING published;
  EXECUTE format('UPDATE %s SET "latest" = false WHERE "id" <> $1', entry) USING proposal;

  PERFORM pg_temp.copy_rows(entry, published, proposal);
END $propose$ LANGUAGE plpgsql;`;

/**
 * A page's entry, with each paragraph proposed for it: the column, the words
 * it expects to find published there, and the words offered instead.
 *
 * A section the Reference site gave no paragraph expects `null`, which is what
 * its column holds until somebody writes one.
 */
function proposePage(entry: string, proposed: Record<string, { expects: string | null; becomes: string }>): string {
  return `SELECT pg_temp.propose('"${entry}"'::regclass, ${text(JSON.stringify(proposed))}::jsonb);`;
}

const PAGE_ENTRIES = [
  proposePage('_home_page_v', {
    version_four_units_lead_ar: { expects: null, becomes: SECTION_OPENERS.homeFourUnits },
    version_record_lead_ar: { expects: HOME_PAGE_WORDS.record.lead.ar, becomes: SECTION_OPENERS.homeRecord },
  }),
  proposePage('_product_page_v', {
    version_roles_lead_ar: { expects: null, becomes: SECTION_OPENERS.productRoles },
    version_inner_cycle_lead_ar: { expects: PRODUCT_PAGE_WORDS.innerCycle.lead, becomes: SECTION_OPENERS.productInnerCycle },
  }),
].join('\n\n');

/**
 * The question whose answer is being rewritten: found by its page and its
 * words, still saying what ticket 22 imported, with nothing of its own waiting
 * as a draft.
 */
function theQuestion(page: string, question: string, asImported: string): string {
  return `"page" = ${text(page)} AND "locale" = 'ar' AND "question" = ${text(question)}
       AND "answer" = ${text(asImported)}
       AND NOT EXISTS (SELECT 1 FROM "_faq_entries_v" waiting
                        WHERE waiting."parent_id" = "faq_entries"."id" AND waiting."version__status" = 'draft')`;
}

/** Every rewritten answer, as a draft of the question it belongs to. */
const ANSWERS = FAQ_REWRITES.map((rewrite) => {
  const asImported = IMPORTED_FAQ_ENTRIES.find(
    (entry) => entry.page === rewrite.page && entry.question === rewrite.question,
  );
  // Both modules are frozen, so this cannot start failing later; it says so
  // here rather than writing a statement that would quietly match nothing.
  if (!asImported) throw new Error(`No imported answer to rewrite: ${rewrite.page} — ${rewrite.question}`);
  const found = theQuestion(rewrite.page, rewrite.question, asImported.answer);
  return `UPDATE "_faq_entries_v" SET "latest" = false
 WHERE "parent_id" IN (SELECT "id" FROM "faq_entries" WHERE ${found});

INSERT INTO "_faq_entries_v" ("parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
SELECT "id", "_order", "question", ${text(rewrite.answer)}, ${text(rewrite.page)}, 'ar', "shows", now(), "created_at", 'draft', now(), now(), true
  FROM "faq_entries" WHERE ${found};`;
}).join('\n\n');

/**
 * The comparison questions, as new entries nobody has published.
 *
 * Each goes at the end of the list, where an Editor drags it to wherever it
 * belongs. `_order` is a fractional index — a key compared as text — so the
 * last key with a digit added to it sorts after that key and before whatever
 * key Payload gives the next question, and after the one added just before it,
 * since each of these reads the end of the list as it now stands.
 *
 * **The digit is a 1, and may not be a 0.** Payload refuses a key whose
 * fraction ends in the lowest digit — `au0` is not a key — and it refuses it
 * while *reading* the last key to make the next one, so a single such row
 * stops an Editor adding any question at all, with «Something went wrong».
 * `faqs.spec.ts` is what said so.
 */
const COMPARISONS = COMPARISON_QUESTIONS.map((entry) => {
  const alreadyAsked = `SELECT 1 FROM "faq_entries" WHERE "page" = ${text(entry.page)} AND "locale" = 'ar' AND "question" = ${text(entry.question)}`;
  return `INSERT INTO "faq_entries" ("_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
SELECT (SELECT max("_order") FROM "faq_entries") || '1', ${text(entry.question)}, ${text(entry.answer)}, ${text(entry.page)}, 'ar', true, now(), now(), 'draft'
 WHERE NOT EXISTS (${alreadyAsked});

INSERT INTO "_faq_entries_v" ("parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
SELECT "id", "_order", "question", "answer", ${text(entry.page)}, 'ar', "shows", "updated_at", "created_at", 'draft', now(), now(), true
  FROM "faq_entries"
 WHERE "page" = ${text(entry.page)} AND "locale" = 'ar' AND "question" = ${text(entry.question)}
   AND NOT EXISTS (SELECT 1 FROM "_faq_entries_v" WHERE "_faq_entries_v"."parent_id" = "faq_entries"."id");`;
}).join('\n\n');

/** A comparison question as the seed left it: in draft, and never published. */
const THE_COMPARISONS = `"_status" = 'draft' AND "locale" = 'ar'
   AND "question" IN (${[...new Set(COMPARISON_QUESTIONS.map((entry) => entry.question))].map(text).join(', ')})
   AND "id" NOT IN (SELECT "parent_id" FROM "_faq_entries_v" WHERE "version__status" = 'published')`;

/**
 * Takes back exactly what the seed wrote, and nothing else.
 *
 * A rollback that deleted every draft would delete the founder's own, so each
 * statement names the words it is undoing: a page's draft by the paragraph it
 * proposes, a question's by the answer, and a comparison question by its own
 * question. Anything he has written since, or published, is left alone.
 *
 * Deleting a version row takes its lists with it — the lists point at it, and
 * are deleted with it — so the copies the seed made go too.
 */
export const ANSWER_FIRST_PROPOSAL_UNSEED = [
  ...[
    { entry: '_home_page_v', column: 'version_record_lead_ar', proposed: SECTION_OPENERS.homeRecord },
    { entry: '_product_page_v', column: 'version_inner_cycle_lead_ar', proposed: SECTION_OPENERS.productInnerCycle },
  ].map(
    (page) => `DELETE FROM "${page.entry}" WHERE "version__status" = 'draft' AND "${page.column}" = ${text(page.proposed)};

UPDATE "${page.entry}" SET "latest" = true WHERE "id" = (SELECT max("id") FROM "${page.entry}");`,
  ),

  // The rewrites: the draft version alone, leaving the published answer, which
  // is what every visitor has been reading all along.
  `DELETE FROM "_faq_entries_v"
 WHERE "version__status" = 'draft' AND "version_answer" IN (${FAQ_REWRITES.map((rewrite) => text(rewrite.answer)).join(', ')});`,

  // The comparison questions, which nothing published: the entry and its one
  // version. A question the founder has since published is left where it is.
  //
  // The version goes first and by hand. A question's versions are not deleted
  // with it — deleting the question sets their `parent_id` to nothing instead —
  // so removing the entry alone would leave a row behind, pointing at nobody,
  // that a second run of this migration would add to rather than replace.
  `DELETE FROM "_faq_entries_v"
 WHERE "parent_id" IN (SELECT "id" FROM "faq_entries" WHERE ${THE_COMPARISONS});`,

  `DELETE FROM "faq_entries" WHERE ${THE_COMPARISONS};`,

  `UPDATE "_faq_entries_v" SET "latest" = true
 WHERE "id" IN (SELECT max("id") FROM "_faq_entries_v" GROUP BY "parent_id");`,
].join('\n\n');

export const ANSWER_FIRST_PROPOSAL_SEED = [
  HELPERS,
  PAGE_ENTRIES,
  ANSWERS,
  COMPARISONS,
  `DROP FUNCTION pg_temp.propose(regclass, jsonb);
DROP FUNCTION pg_temp.copy_rows(regclass, bigint, bigint);`,
].join('\n\n');
