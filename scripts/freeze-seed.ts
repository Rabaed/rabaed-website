/**
 * Writes the `seed.ts` beside each data migration: the INSERT statements that
 * migration made, naming the columns its tables had at that point in the
 * chain (ticket 63).
 *
 *   npm run cms:freeze-seed
 *
 * Run against an empty database, which the wrapper provides. It replays the
 * migrations in order, and around each import in `IMPORTS` below records what
 * the import put into the database — every table that gained rows, the version
 * tables and the nested lists included — and writes it out as SQL.
 *
 * Why the imports cannot simply go on writing through Payload: one that calls
 * `payload.updateGlobal` builds its statement from the fields the code
 * declares *today*, so the day a field is added to that entry the import names
 * a column the database has not reached yet, and every database built from
 * scratch stops there. Frozen SQL names the columns of its own moment and goes
 * on working whatever is added later.
 *
 * **A one-time tool, not part of any build.** Once an import's `seed.ts` is
 * written and its migration executes it, running this again would replay the
 * frozen SQL and dump it straight back out, which proves nothing. It stays in
 * the repository as the way the *next* data migration is frozen: write it
 * against the local API, add it to `IMPORTS`, run this, then swap its `up`
 * over to the SQL it produced.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getPayload } from 'payload';
import { migrations } from '../src/migrations/index';
import config from '../src/payload.config';

/**
 * The imports to freeze, each with the directory its frozen words already live
 * in and the name to export the SQL under.
 *
 * `excludes` names a table whose rows the import must go on creating for
 * itself — `media`, whose rows stand for files that have to be converted and
 * uploaded, which no INSERT can do. A column pointing at one is written as a
 * lookup by file name rather than by the id of the moment.
 */
const IMPORTS: {
  migration: string;
  directory: string;
  export: string;
  excludes?: Record<string, string>;
}[] = [
  { migration: '20260915_040105_import_start_page', directory: 'start-page-import', export: 'START_PAGE_SEED' },
  {
    migration: '20260915_063744_import_product_page_closing_section_and_screen_mocks',
    directory: 'product-page-import',
    export: 'PRODUCT_PAGE_SEED',
  },
  { migration: '20260915_064015_import_tool_page', directory: 'tool-page-import', export: 'TOOL_PAGE_SEED' },
  {
    migration: '20260915_195430_import_partnership_page',
    directory: 'partnership-page-import',
    export: 'PARTNERSHIP_PAGE_SEED',
  },
  { migration: '20260915_200328_import_referral_page', directory: 'referral-page-import', export: 'REFERRAL_PAGE_SEED' },
  { migration: '20260915_211212_import_home_page', directory: 'home-page-import', export: 'HOME_PAGE_SEED' },
  {
    migration: '20260920_182914_import_site_words_and_index_leads',
    directory: 'site-words-import',
    export: 'SITE_WORDS_SEED',
  },
  {
    migration: '20260920_204226_import_trust_strip',
    directory: 'trust-strip-import',
    export: 'TRUST_STRIP_SEED',
    excludes: { media: 'filename' },
  },
  {
    migration: '20260920_211936_import_search_settings',
    directory: 'search-settings-import',
    export: 'SEARCH_SETTINGS_SEED',
  },
];

/**
 * The columns Payload fills with the moment it wrote. They stay `now()` rather
 * than being frozen to the day this ran, so that a database built from scratch
 * goes on dating its first version the day it was built.
 */
const CLOCK_COLUMNS = new Set(['created_at', 'updated_at', 'version_created_at', 'version_updated_at']);

type Rows = Record<string, string | null>[];

const payload = await getPayload({ config });
// Past Payload's public types on purpose, and only here: `pool` is the
// connection this script reads the rows back through, and `migrate` takes a
// list of migrations to run, which is what lets it stop after each import.
// `scripts/` is outside the typechecker (`tsconfig.json`), so nothing else
// depends on either shape.
const database = payload.db as unknown as {
  pool: { query: (text: string, values?: unknown[]) => Promise<{ rows: Rows }> };
  migrate: (args: { migrations: unknown[] }) => Promise<void>;
};

const query = async (text: string, values?: unknown[]) => (await database.pool.query(text, values)).rows;

/** Every table in the database, with the tables its foreign keys point at. */
async function tables(): Promise<Map<string, string[]>> {
  const rows = await query(`
    SELECT c.relname AS name,
           coalesce(
             string_agg(DISTINCT f.confrelid::regclass::text, ',') FILTER (WHERE f.confrelid IS NOT NULL),
             ''
           ) AS parents
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      LEFT JOIN pg_constraint f ON f.conrelid = c.oid AND f.contype = 'f' AND f.confrelid <> c.oid
     WHERE n.nspname = 'public' AND c.relkind = 'r'
     GROUP BY c.relname`);
  return new Map(
    rows.map((row) => [
      row.name as string,
      (row.parents as string)
        .split(',')
        .filter(Boolean)
        .map((name) => name.replace(/"/g, '')),
    ]),
  );
}

/** How many rows each table holds, so that what an import added can be told from what was there. */
async function counts(names: string[]): Promise<Map<string, number>> {
  if (names.length === 0) return new Map();
  const union = names.map((name) => `SELECT '${name}' AS name, count(*) AS rows FROM "${name}"`).join(' UNION ALL ');
  const rows = await query(union);
  return new Map(rows.map((row) => [row.name as string, Number(row.rows)]));
}

/** A value as SQL: the text Postgres itself prints, quoted, and read back as whatever the column is. */
function literal(value: string | null): string {
  if (value === null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

/** The rows of one table as INSERT statements, in the order they are stored. */
async function insertsFor(table: string, excludes: Record<string, string>): Promise<string[]> {
  const columns = (
    await query(
      `SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
      [table],
    )
  ).map((row) => row.column_name as string);

  // Which columns point at a table the import goes on filling for itself, and
  // the column to find that row by instead of the id of the moment.
  const lookups = new Map<string, { table: string; by: string }>();
  for (const [name, by] of Object.entries(excludes)) {
    const pointing = await query(
      `SELECT a.attname AS column
         FROM pg_constraint f
         JOIN pg_attribute a ON a.attrelid = f.conrelid AND a.attnum = ANY (f.conkey)
        WHERE f.contype = 'f' AND f.conrelid = $1::regclass AND f.confrelid = $2::regclass`,
      [`"${table}"`, `"${name}"`],
    );
    for (const row of pointing) lookups.set(row.column as string, { table: name, by });
  }

  const selected = columns.map((column) => `"${column}"::text AS "${column}"`).join(', ');
  const rows = await query(`SELECT ${selected} FROM "${table}"`);
  if (rows.length === 0) return [];

  const statements: string[] = [];
  for (const row of rows) {
    const values: string[] = [];
    for (const column of columns) {
      const value = row[column];
      const lookup = lookups.get(column);
      if (CLOCK_COLUMNS.has(column)) {
        values.push('now()');
      } else if (lookup && value !== null) {
        const [found] = await query(`SELECT "${lookup.by}"::text AS key FROM "${lookup.table}" WHERE "id"::text = $1`, [
          value,
        ]);
        values.push(`(SELECT "id" FROM "${lookup.table}" WHERE "${lookup.by}" = ${literal(found!.key)})`);
      } else {
        values.push(literal(value));
      }
    }
    const names = columns.map((column) => `"${column}"`).join(', ');
    statements.push(`INSERT INTO "${table}" (${names})\nVALUES (${values.join(', ')});`);
  }

  // The counter behind an `id` column, so that the next row an Editor adds
  // takes the id after the last of these rather than colliding with one.
  const [serial] = await query(`SELECT pg_get_serial_sequence($1, 'id') AS sequence`, [`"${table}"`]);
  if (serial?.sequence) {
    statements.push(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), (SELECT max("id") FROM "${table}"));`);
  }
  return statements;
}

/** Parents before the rows that point at them. */
function ordered(names: string[], parents: Map<string, string[]>): string[] {
  const remaining = new Set(names);
  const out: string[] = [];
  while (remaining.size > 0) {
    const next = [...remaining].filter((name) => (parents.get(name) ?? []).every((parent) => !remaining.has(parent)));
    if (next.length === 0) throw new Error(`Tables point at each other: ${[...remaining].join(', ')}`);
    for (const name of next.sort()) {
      out.push(name);
      remaining.delete(name);
    }
  }
  return out;
}

/** A SQL body as it has to read inside a TypeScript template literal. */
const escaped = (statements: string) =>
  statements
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

const byName = new Map(IMPORTS.map((entry) => [entry.migration, entry]));

/** The tables there are to count, which is every table the chain has reached so far. */
const countable = (structure: Map<string, string[]>) =>
  [...structure.keys()].filter((name) => name !== 'payload_migrations');

for (const [index, migration] of migrations.entries()) {
  const entry = byName.get(migration.name);
  // What was in the database before this import, so that what it added can be
  // told from what the imports before it left.
  const before = entry ? await counts(countable(await tables())) : null;
  await database.migrate({ migrations: migrations.slice(0, index + 1) });
  if (!entry || !before) continue;

  const excludes = entry.excludes ?? {};
  const structure = await tables();
  const after = await counts(countable(structure));
  const grew = countable(structure).filter(
    (name) => after.get(name)! > (before.get(name) ?? 0) && !(name in excludes),
  );

  // Every row of a table that grew is written out, so a table an earlier
  // import had already put rows into would be frozen twice — once here and
  // once where it belongs — and a database built from scratch would end up
  // with both. None of the imports frozen so far shares a table with another,
  // and the one that would have to is told rather than quietly duplicated.
  const shared = grew.filter((name) => (before.get(name) ?? 0) > 0);
  if (shared.length > 0) {
    throw new Error(
      `${migration.name} adds rows to tables another import had already filled: ${shared.join(', ')}. ` +
        'Freezing every row of those tables would import them twice. Teach this script to write out only ' +
        'the rows this import added before freezing it.',
    );
  }

  const statements: string[] = [];
  for (const table of ordered(grew, structure)) statements.push(...(await insertsFor(table, excludes)));

  const directory = path.resolve(import.meta.dirname, '..', 'src', 'migrations', entry.directory);
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, 'seed.ts'),
    [
      '/**',
      ' * The statements that seeded this import, as it made them on the day it was',
      ` * written: \`${migration.name}\` (ticket 63).`,
      ' *',
      ' * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the',
      ' * import as it ran, and nothing regenerates it: the column names below are the',
      ' * ones these tables had at that point in the chain, which is the whole point of',
      ' * the file. A field added to this entry later belongs in a migration of its',
      ' * own, never here.',
      ' *',
      ' * The words themselves are in `words.ts` beside this, which is what to read.',
      ' */',
      `export const ${entry.export} = \``,
      escaped(statements.join('\n\n')),
      '`;',
      '',
    ].join('\n'),
    'utf8',
  );
  console.log(`${entry.directory}/seed.ts: ${grew.length} tables, ${statements.length} statements`);
}

console.log('Done.');
process.exit(0);
