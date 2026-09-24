/**
 * Rebuilds this branch's CMS migrations after `main` has been merged into it
 * (ticket 88).
 *
 *   npm run cms:rebase-migrations
 *   npm run cms:rebase-migrations -- --base origin/main
 *
 * Each schema migration's snapshot assumes it is the latest, so two branches
 * that each add one cannot both be right once they meet. This deletes the
 * branch's own schema migrations — the ones `main` has no file of — and has
 * Payload write them again, as one, against the newest snapshot `main` has.
 * Then it gives each of the branch's migrations its name
 * (`scripts/migration-rebase.ts` decides which), marks the new one's type
 * imports `type`, regenerates `payload-types.ts` and the admin's import map,
 * and runs every migration on a database built from scratch.
 *
 * It needs no database of its own: Payload writes a migration from the
 * configuration and the snapshots alone. What it cannot decide — whether a
 * database it cannot reach has already run a migration it renamed — it prints
 * the statements for, and docs/agents/parallel-sessions.md says when to run
 * them.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import {
  DEVELOPMENT_DATABASE,
  PAYLOAD_BIN,
  WITHOUT_DATABASE,
  repoRoot,
  runNode,
  startDatabase,
  withThrowawayDatabase,
} from './local-database.mjs';
import { changedStatements, planRebase, tidyMigration } from './migration-rebase.ts';

const MIGRATIONS = path.join(repoRoot, 'src', 'migrations');

const git = (...args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
const succeeds = (...args) => spawnSync('git', args, { cwd: repoRoot }).status === 0;

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

/** The files directly in `src/migrations/`: the migrations, their snapshots and the index. */
const folder = () =>
  readdirSync(MIGRATIONS, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

const file = (name, extension) => path.join(MIGRATIONS, `${name}${extension}`);

// ---------------------------------------------------------------------------
// Which main, and has it been merged?

const at = process.argv.indexOf('--base');
const base = at === -1 ? 'origin/main' : process.argv[at + 1];
if (!base) fail('--base names the branch this one has merged, such as origin/main.');
if (!succeeds('rev-parse', '--verify', '--quiet', `${base}^{commit}`)) {
  fail(`There is no ${base} here to compare with. Fetch it first: git fetch origin`);
}
const merged =
  succeeds('merge-base', '--is-ancestor', base, 'HEAD') ||
  (succeeds('rev-parse', '--verify', '--quiet', 'MERGE_HEAD') && succeeds('merge-base', '--is-ancestor', base, 'MERGE_HEAD'));
if (!merged) fail(`${base} is not merged into this branch yet. Merge it first — git merge ${base} — then run this again.`);

const mainFiles = git('ls-tree', '--name-only', base, '--', 'src/migrations/')
  .split('\n')
  .map((line) => path.posix.basename(line))
  .filter((name) => /\.(ts|json)$/.test(name) && name !== 'index.ts');

const missing = mainFiles.filter((name) => !folder().includes(name));
if (missing.length > 0) {
  fail(
    `${base} has migration files this branch does not: ${missing.join(', ')}. ` +
      `Take them back from it — git checkout ${base} -- ${missing.map((name) => `src/migrations/${name}`).join(' ')} — ` +
      'then run this again.',
  );
}

// ---------------------------------------------------------------------------
// Regenerate the branch's schema migration against main's newest snapshot.

const plan = planRebase({ folder: folder(), base: mainFiles, now: new Date() });
const previous = plan.regenerate.map((name) => readFileSync(file(name, '.ts'), 'utf8'));

// Kept in memory until Payload has written the new one, and put back if it cannot.
const saved = plan.regenerate.flatMap((name) =>
  ['.ts', '.json'].map((extension) => [file(name, extension), readFileSync(file(name, extension), 'utf8')]),
);
for (const [location] of saved) rmSync(location);

const before = new Set(folder());
const suffix = plan.schema?.replace(/^\d{8}_\d{6}_/, '') ?? 'unmigrated_changes';
try {
  await runNode([PAYLOAD_BIN, 'migrate:create', suffix, '--skip-empty'], WITHOUT_DATABASE);
} catch (error) {
  for (const [location, content] of saved) writeFileSync(location, content);
  fail(`Payload could not write the migration, so this branch's are back as they were: ${error.message}`);
}
const created = folder().filter((name) => !before.has(name) && name !== 'index.ts');

if (created.length > 0 && plan.schema === null) {
  for (const name of created) rmSync(path.join(MIGRATIONS, name));
  fail(
    `The configuration asks for changes ${base}'s migrations do not make, and this branch has no schema migration ` +
      'of its own to write them into. Write one: npm run cms:migration -- <name>',
  );
}

let generated = null;
if (created.length > 0) {
  const written = created.find((name) => name.endsWith('.ts')).slice(0, -'.ts'.length);
  generated = tidyMigration({ generated: readFileSync(file(written, '.ts'), 'utf8'), previous: previous[0] ?? null });
  rmSync(file(written, '.ts'));
  writeFileSync(file(plan.schema, '.ts'), generated);
  renameSync(file(written, '.json'), file(plan.schema, '.json'));
}

for (const { from, to } of plan.renames) {
  if (!plan.regenerate.includes(from)) renameSync(file(from, '.ts'), file(to, '.ts'));
}

// The index Payload keeps beside the migrations lists them; this project
// does not commit it (.gitignore), but a stale one would mislead whoever reads it.
const { writeMigrationIndex } = await import('payload');
writeMigrationIndex({ migrationsDir: MIGRATIONS });

// ---------------------------------------------------------------------------
// Say what happened, and what a database that ran the old names needs.

console.log('');
if (plan.regenerate.length === 0) {
  console.log(`This branch has no schema migration of its own; the configuration matches ${base}'s.`);
} else if (generated === null) {
  console.log(
    `${plan.regenerate.join(', ')} ${plan.regenerate.length === 1 ? 'is' : 'are'} gone: ` +
      `${base}'s migrations already make everything the configuration asks for.`,
  );
} else {
  console.log(`Regenerated src/migrations/${plan.schema}.ts against ${base}'s newest snapshot.`);
  if (plan.regenerate.length > 1) {
    console.log(
      `It takes the place of ${plan.regenerate.join(' and ')}. Only the first one's comments were kept: ` +
        'add anything the others said.',
    );
  }
}

const changes = generated === null ? { dropped: [], added: [] } : changedStatements({ previous, generated });
const unchanged = changes.dropped.length === 0 && changes.added.length === 0;
if (generated !== null && unchanged) {
  console.log('Its SQL is the same, statement for statement, as what it replaces.');
} else if (!unchanged) {
  console.log('\nIts SQL differs from what it replaces. Read it before committing it.');
  for (const statement of changes.dropped) console.log(`  no longer: ${statement}`);
  for (const statement of changes.added) console.log(`  new:       ${statement}`);
  console.log(
    'A database that ran the old one does not have what the new one makes — see "CMS migrations" in ' +
      'docs/agents/parallel-sessions.md.',
  );
}

// Every row of `payload_migrations` that names a migration of this branch's
// by a name it no longer has: renamed, or folded into the regenerated one —
// or into main's, when nothing was left to regenerate.
const gone = generated === null ? plan.regenerate : plan.regenerate.slice(1);
const renamedRows = plan.renames
  .filter(({ from }) => !gone.includes(from))
  .map(({ from, to }) => ({ from, to, sql: `UPDATE payload_migrations SET name = '${to}' WHERE name = '${from}';` }));
const foldedRows = gone.map((name) => ({
  from: name,
  sql: `DELETE FROM payload_migrations WHERE name = '${name}';`,
}));
const rows = [...renamedRows, ...foldedRows];

if (renamedRows.length > 0) {
  console.log(`\nSome of this branch's migrations sorted before ${base}'s newest, so they now come after it:`);
  for (const { from, to } of renamedRows) console.log(`  ${from} → ${to}`);
}
if (rows.length > 0) {
  console.log(
    '\nA database that already ran them under the old names — the preview database, if it was migrated for this ' +
      'branch — records them by those names. Before it is migrated again, run on it:\n',
  );
  for (const { sql } of rows) console.log(`  ${sql}`);
  if (!unchanged) console.log('\nOnly once it has what the new SQL makes: the SQL above differs from what it ran.');

  const mentioned = spawnSync(
    'git',
    ['grep', '--untracked', '-n', '-F', ...rows.flatMap(({ from }) => ['-e', from])],
    { cwd: repoRoot, encoding: 'utf8' },
  ).stdout.trim();
  if (mentioned) console.log(`\nThese still name the old ones:\n${mentioned.replace(/^/gm, '  ')}`);

  await renameInDevelopmentDatabase(rows, unchanged);
}

/**
 * This checkout's own `.data/` database is the one database that ran the old
 * names which this can reach, and `npm run dev` would stop on it — it migrates
 * before it starts — so its rows are renamed here, when the SQL is unchanged.
 */
async function renameInDevelopmentDatabase(statements, safe) {
  if (!existsSync(path.join(DEVELOPMENT_DATABASE.directory, 'PG_VERSION'))) return;
  if (!safe) {
    console.log(
      '\nYour own .data/ database ran the old SQL. Rebuild it from the migrations by deleting .data/postgres, ' +
        'or bring it level by hand.',
    );
    return;
  }

  const url = `postgres://postgres:postgres@127.0.0.1:${DEVELOPMENT_DATABASE.port}/rabaed`;
  let started = null;
  const client = async () => {
    const connection = new pg.Client({ connectionString: url, connectionTimeoutMillis: 2000 });
    await connection.connect();
    return connection;
  };
  let connection;
  try {
    // Already running when `npm run dev` is.
    connection = await client().catch(async () => {
      started = await startDatabase(DEVELOPMENT_DATABASE);
      return client();
    });
    let renamed = 0;
    for (const { sql } of statements) renamed += (await connection.query(sql)).rowCount ?? 0;
    console.log(
      renamed === 0
        ? '\nYour own .data/ database had not run them under the old names, so it needs nothing.'
        : `\nYour own .data/ database had: ${renamed} of its rows now name them as the files do.`,
    );
  } catch (error) {
    console.log(`\nYour own .data/ database could not be reached (${error.message}). Run the statements above on it.`);
  } finally {
    await connection?.end().catch(() => {});
    await started?.stop().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// The generated files, and the proof that the chain runs.

console.log('\nRegenerating src/payload-types.ts and the admin\'s import map…');
await runNode([PAYLOAD_BIN, 'generate:types'], WITHOUT_DATABASE);
await runNode([PAYLOAD_BIN, 'generate:importmap'], WITHOUT_DATABASE);

console.log('\nRunning every migration on a database built from scratch…');
const failure = await withThrowawayDatabase('rebase-migrations', (env) => runNode([PAYLOAD_BIN, 'migrate'], env));
if (failure) {
  fail(
    `The migrations do not run on a database built from scratch: ${failure.message}\n` +
      'Read the regenerated migration: see "CMS migrations" in docs/agents/parallel-sessions.md.',
  );
}

console.log('\nDone. Read what changed in src/migrations/ before committing it.');
