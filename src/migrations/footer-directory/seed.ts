/**
 * The statements that build the Footer directory (ticket 75) into the site
 * words entry: four columns on every version of it — what is published, the
 * English ticket 40 proposed, every draft and every version in its history —
 * with the footer's two links moved into the fourth.
 *
 * **Built from `words.ts` beside this, which is what to read.** This is only
 * how the columns are written.
 *
 * Written out rather than produced by `npm run cms:freeze-seed`, for the
 * reason `english-site-words/seed.ts` gives: this changes rows already there,
 * and to the same rules.
 *
 * - **Every version, not only the newest.** Restoring an old version from the
 *   admin's Versions would otherwise bring back a footer with no directory,
 *   and the list its links were in no longer exists to hold them.
 * - **What an Editor wrote is kept.** The rows of the footer's old list move
 *   into the Legal column as they are — their Arabic, their order and where
 *   they go — and their English is replaced only where it is empty or still
 *   the word ticket 40 proposed, which says nothing of the page being Arabic.
 * - **Nothing is found by an id.** A link is known by where it goes, since an
 *   Editor may have reordered the list or pointed a row somewhere else.
 */
import { ENGLISH_SITE_WORDS } from '../english-site-words/words';
import { FOOTER_DIRECTORY, type SeededColumn } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** An id of the kind Payload gives a row of a list: 24 hexadecimal characters. */
const NEW_ID = `substr(md5(random()::text || clock_timestamp()::text), 1, 24)`;

/** The most a column may hold, as `src/cms/globals/site-words.ts` has it. */
const MOST_LINKS = 6;

/**
 * The tables one kind of row is held in. The entry itself — what is
 * published — keys its list rows by the ids Payload gives them; its versions
 * number them, and keep that id beside the number as `_uuid`.
 */
type Tables = {
  readonly entries: string;
  readonly columns: string;
  readonly links: string;
  /** The footer's old list of links, which the Legal column takes over. */
  readonly legalLinks: string;
  /** The variable a new column's key is read into. */
  readonly column: string;
  readonly versioned: boolean;
};

const VERSIONS: Tables = {
  entries: '"_site_words_v"',
  columns: '"_site_words_v_version_footer_columns"',
  links: '"_site_words_v_version_footer_columns_links"',
  legalLinks: '"_site_words_v_version_footer_legal_links"',
  column: 'version_column',
  versioned: true,
};

const ENTRY: Tables = {
  entries: '"site_words"',
  columns: '"site_words_footer_columns"',
  links: '"site_words_footer_columns_links"',
  legalLinks: '"site_words_footer_legal_links"',
  column: 'entry_column',
  versioned: false,
};

/** A new column of `entry`, its key read into the table's variable. */
function column(tables: Tables, order: number, { heading }: SeededColumn): string {
  return tables.versioned
    ? `INSERT INTO ${tables.columns} ("_order", "_parent_id", "heading_ar", "heading_en", "_uuid")
    VALUES (${order}, entry.id, ${text(heading.ar)}, ${text(heading.en)}, ${NEW_ID})
    RETURNING "id" INTO ${tables.column};`
    : `${tables.column} := ${NEW_ID};
    INSERT INTO ${tables.columns} ("_order", "_parent_id", "id", "heading_ar", "heading_en")
    VALUES (${order}, entry.id, ${tables.column}, ${text(heading.ar)}, ${text(heading.en)});`;
}

/** The columns every list row is written with: its place, its column, its id and its words. */
function linkColumns(tables: Tables): string {
  return `"_order", "_parent_id", ${tables.versioned ? '"_uuid"' : '"id"'}, "label_ar", "label_en", "path"`;
}

/** A column's links, as `words.ts` has them. */
function links(tables: Tables, { links }: SeededColumn): string {
  const rows = links.map(
    ({ label, path }, index) =>
      `(${index + 1}, ${tables.column}, ${NEW_ID}, ${text(label.ar)}, ${text(label.en)}, ${text(path)})`,
  );
  return `INSERT INTO ${tables.links} (${linkColumns(tables)})
    VALUES ${rows.join(',\n           ')};`;
}

/**
 * The English a moved link is given: the directory's, where the row's own is
 * empty or still the word ticket 40 proposed for it — «Terms and conditions»,
 * which does not say the page is in Arabic. A word an Editor wrote stays.
 */
function movedEnglish(): string {
  const proposed = Object.entries(ENGLISH_SITE_WORDS.footer.legalLinks)
    .map(([path, english]) => `(${text(path)}, ${text(english)})`)
    .join(', ');
  const directory = FOOTER_DIRECTORY.legal.links
    .map(({ path, label }) => `WHEN ${text(path)} THEN ${text(label.en)}`)
    .join(' ');
  return `CASE WHEN nullif("label_en", '') IS NULL OR ("path", "label_en") IN (${proposed})
              THEN coalesce(CASE "path" ${directory} END, "label_en")
              ELSE "label_en" END`;
}

/**
 * The Legal column's links: the footer's old rows, moved in their order, then
 * each link of the directory's that none of them already goes to — while the
 * column has room for it.
 */
function legalLinks(tables: Tables): string {
  const moved = `INSERT INTO ${tables.links} (${linkColumns(tables)})
    SELECT row_number() OVER (ORDER BY "_order", "id"), ${tables.column},
           ${tables.versioned ? `coalesce("_uuid", ${NEW_ID})` : '"id"'}, "label_ar",
           ${movedEnglish()},
           "path"
      FROM ${tables.legalLinks}
     WHERE "_parent_id" = entry.id;`;
  const added = FOOTER_DIRECTORY.legal.links.map(
    ({ label, path }) => `INSERT INTO ${tables.links} (${linkColumns(tables)})
    SELECT count(*) + 1, ${tables.column}, ${NEW_ID}, ${text(label.ar)}, ${text(label.en)}, ${text(path)}
      FROM ${tables.links}
     WHERE "_parent_id" = ${tables.column}
    HAVING count(*) < ${MOST_LINKS} AND bool_and("path" <> ${text(path)}) IS NOT FALSE;`,
  );
  return [moved, ...added].join('\n    ');
}

/** Every row of `tables.entries`, given the four columns. */
function directory(tables: Tables): string {
  const { rabaed, programmes, resources, legal } = FOOTER_DIRECTORY;
  return `FOR entry IN SELECT "id" FROM ${tables.entries} ORDER BY "id" LOOP
    ${column(tables, 1, rabaed)}
    ${links(tables, rabaed)}
    ${column(tables, 2, programmes)}
    ${links(tables, programmes)}
    ${column(tables, 3, resources)}
    ${links(tables, resources)}
    ${column(tables, 4, legal)}
    ${legalLinks(tables)}
  END LOOP;`;
}

/** Run after the directory's tables are made and before the footer's old list is dropped. */
export const FOOTER_DIRECTORY_SEED = `
DO $directory$
DECLARE
  entry record;
  version_column integer;
  entry_column varchar;
BEGIN
  ${directory(VERSIONS)}

  ${directory(ENTRY)}
END $directory$;`;

/**
 * Taking it back: the Legal column's terms and privacy links, returned to the
 * footer's old list, which is made again before this runs. The rest of the
 * directory has nowhere to go and goes with its tables; the English each
 * moved link was given stays with it.
 */
export const FOOTER_DIRECTORY_UNSEED = `
INSERT INTO "_site_words_v_version_footer_legal_links" ("_order", "_parent_id", "_uuid", "label_ar", "label_en", "path")
SELECT row_number() OVER (PARTITION BY c."_parent_id" ORDER BY c."_order", l."_order"), c."_parent_id",
       l."_uuid", l."label_ar", l."label_en", l."path"
  FROM "_site_words_v_version_footer_columns_links" l
  JOIN "_site_words_v_version_footer_columns" c ON c."id" = l."_parent_id"
 WHERE l."path" IN ('/terms', '/privacy');

INSERT INTO "site_words_footer_legal_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
SELECT row_number() OVER (PARTITION BY c."_parent_id" ORDER BY c."_order", l."_order"), c."_parent_id",
       l."id", l."label_ar", l."label_en", l."path"
  FROM "site_words_footer_columns_links" l
  JOIN "site_words_footer_columns" c ON c."id" = l."_parent_id"
 WHERE l."path" IN ('/terms', '/privacy');`;
