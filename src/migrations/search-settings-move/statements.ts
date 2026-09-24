/**
 * The statements that move each page's search settings off the one entry that
 * held all six and onto the page's own entry (ticket 91, ADR-0023).
 *
 * **Three migrations, because the move is data between two schema changes.**
 * The columns a page's entry gains and the tables the old entry drops are one
 * generated migration, `…_search_settings_on_each_page`, and a branch's
 * generated migrations are rebuilt as one (`npm run cms:rebase-migrations`),
 * so no data step can stand between its `ADD COLUMN`s and its `DROP TABLE`s.
 * Instead the words are set aside in a table of their own just before it —
 * `SET_ASIDE` — and put onto the pages just after it — `MOVE` — which then
 * drops the table. Payload knows nothing of that table, and never sees it.
 *
 * **What each version of a page is given.** A page is read from its version
 * history (`src/cms/pages.ts`), so the words go onto every version of it, and
 * which words depends on what the version is:
 *
 * - a **published** version, which visitors read, is given the search settings
 *   as they were last published — what visitors were already shown;
 * - a **draft** is given them as they were last saved — what an Editor last
 *   wrote, the English waiting to be approved included (ticket 42), so a
 *   draft waiting on a page carries its search title's English with it;
 * - the entry itself, which Payload keeps as it was last published and
 *   changes only on publishing, is given them as they were last published.
 *
 * Both in Arabic and in English, with the sharing picture, whatever the old
 * entry's languages were: a page's own languages now decide whether its
 * English is shown.
 *
 * **No page becomes English by the move.** A page used to be shown in English
 * only once the old entry was published in English too. A page published in
 * English on its own entry, while the old entry's English waited as a draft,
 * was a notice — and would now be an English page with no search title. So a
 * published page, or a published version of one, left without its search
 * title's or description's English has English taken off its languages, as
 * visitors already saw it. Publishing it in English again asks for those
 * words. A draft keeps its languages: the CMS names what it wants when it is
 * published.
 *
 * Frozen like every data migration (`docs/deployment.md`): the pages and the
 * columns are written out as they are today, never read from the
 * configuration, which will go on changing after this has run.
 */

/** Each page's tab on the old entry, and the table of the page's own entry. */
const PAGES = [
  ['home', 'home_page'],
  ['product', 'product_page'],
  ['start', 'start_page'],
  ['tool', 'tool_page'],
  ['referral', 'referral_page'],
  ['partnership', 'partnership_page'],
] as const;

/** A page's words and picture, as the old entry and the page's own name them after their prefix. */
const FIELDS = ['title_ar', 'title_en', 'description_ar', 'description_en', 'sharing_image_id'] as const;

const SET_ASIDE_TABLE = `CREATE TABLE "search_settings_moving" (
  "page" varchar NOT NULL,
  "state" varchar NOT NULL,
  "title_ar" varchar,
  "title_en" varchar,
  "description_ar" varchar,
  "description_en" varchar,
  "sharing_image_id" integer,
  PRIMARY KEY ("page", "state")
);`;

/** A version table's newest published version, as the site reads it (`src/cms/pages.ts`). */
const NEWEST_PUBLISHED = `WHERE "version__status" = 'published' ORDER BY "updated_at" DESC, "id" DESC LIMIT 1`;

/** A version table's newest version, published or a draft: the one Payload marks `latest`. */
const NEWEST = `ORDER BY "latest" DESC NULLS LAST, "updated_at" DESC, "id" DESC LIMIT 1`;

const columns = (prefix: string) => FIELDS.map((field) => `"${prefix}${field}"`).join(', ');

/** Sets each page's search settings aside, as last published and as last saved. */
export const SET_ASIDE = [
  SET_ASIDE_TABLE,
  ...PAGES.flatMap(([tab]) => [
    `INSERT INTO "search_settings_moving" ("page", "state", ${columns('')})
SELECT '${tab}', 'published', ${columns(`version_${tab}_`)} FROM "_search_settings_v" ${NEWEST_PUBLISHED};`,
    `INSERT INTO "search_settings_moving" ("page", "state", ${columns('')})
SELECT '${tab}', 'saved', ${columns(`version_${tab}_`)} FROM "_search_settings_v" ${NEWEST};`,
  ]),
].join('\n\n');

/** `SET "search_title_ar" = m."title_ar", …` for a page's own entry, or its versions. */
const assignments = (prefix: string) => FIELDS.map((field) => `"${prefix}search_${field}" = m."${field}"`).join(',\n       ');

/** Puts the words set aside onto each page's entry and every version of it, then drops them. */
export const MOVE = [
  ...PAGES.flatMap(([tab, table]) => [
    `UPDATE "${table}" p
   SET ${assignments('')}
  FROM "search_settings_moving" m
 WHERE m."page" = '${tab}'
   AND m."state" = CASE WHEN p."_status" = 'published' THEN 'published' ELSE 'saved' END;`,
    `UPDATE "_${table}_v" v
   SET ${assignments('version_')}
  FROM "search_settings_moving" m
 WHERE m."page" = '${tab}'
   AND m."state" = CASE WHEN v."version__status" = 'published' THEN 'published' ELSE 'saved' END;`,
    `DELETE FROM "${table}_languages" l
 USING "${table}" p
 WHERE l."parent_id" = p."id" AND l."value" = 'en' AND p."_status" = 'published'
   AND (coalesce(p."search_title_en", '') = '' OR coalesce(p."search_description_en", '') = '');`,
    `DELETE FROM "_${table}_v_version_languages" l
 USING "_${table}_v" v
 WHERE l."parent_id" = v."id" AND l."value" = 'en' AND v."version__status" = 'published'
   AND (coalesce(v."version_search_title_en", '') = '' OR coalesce(v."version_search_description_en", '') = '');`,
  ]),
  'DROP TABLE "search_settings_moving";',
].join('\n\n');

/**
 * Undoes `MOVE`: sets aside each page's search settings as last published, for
 * the schema's rollback to be followed by `SET_ASIDE_UNDONE`. What a draft
 * held is not carried back — a rollback restores what visitors were shown.
 */
export const MOVE_UNDONE = [
  SET_ASIDE_TABLE,
  ...PAGES.map(
    ([tab, table]) => `INSERT INTO "search_settings_moving" ("page", "state", ${columns('')})
SELECT '${tab}', 'published', ${columns('version_search_')} FROM "_${table}_v" ${NEWEST_PUBLISHED};`,
  ),
].join('\n\n');

/** A page's word as set aside, as last published. */
const setAside = (tab: string, field: string) =>
  `(SELECT "${field}" FROM "search_settings_moving" WHERE "page" = '${tab}' AND "state" = 'published')`;

/**
 * Undoes `SET_ASIDE`: the old entry again, published with what was set aside
 * — in English too where every page's English was there — then the table
 * dropped.
 */
export const SET_ASIDE_UNDONE = [
  `INSERT INTO "search_settings" (${PAGES.map(([tab]) => columns(`${tab}_`)).join(', ')}, "_status", "updated_at", "created_at")
SELECT ${PAGES.flatMap(([tab]) => FIELDS.map((field) => setAside(tab, field))).join(', ')}, 'published', now(), now();`,
  `INSERT INTO "_search_settings_v" (${PAGES.map(([tab]) => columns(`version_${tab}_`)).join(', ')}, "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
SELECT ${PAGES.map(([tab]) => columns(`${tab}_`)).join(', ')}, 'published', now(), now(), now(), now(), true FROM "search_settings";`,
  `WITH languages ("order", "value") AS (
  SELECT 1, 'ar'
  UNION ALL
  SELECT 2, 'en' WHERE NOT EXISTS (
    SELECT 1 FROM "search_settings_moving"
     WHERE "state" = 'published' AND (coalesce("title_en", '') = '' OR coalesce("description_en", '') = '')
  )
)
INSERT INTO "search_settings_languages" ("order", "parent_id", "value")
SELECT languages."order", "search_settings"."id", languages."value"::"enum_search_settings_languages"
  FROM languages, "search_settings";`,
  `INSERT INTO "_search_settings_v_version_languages" ("order", "parent_id", "value")
SELECT languages."order", "_search_settings_v"."id", languages."value"::text::"enum__search_settings_v_version_languages"
  FROM "search_settings_languages" languages, "_search_settings_v";`,
  'DROP TABLE "search_settings_moving";',
].join('\n\n');
