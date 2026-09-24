/**
 * Fails when the CMS configuration and the files generated from it disagree
 * (ticket 88). CI runs it on every pull request.
 *
 *   npm run cms:check-migrations
 *
 * - **The migrations.** The configuration asks for something no migration
 *   creates — or no longer asks for something one does — so
 *   `payload migrate:create` would write a migration that is not empty.
 *   Payload diffs against the newest snapshot by name, so this also fails
 *   when that snapshot is not the whole schema: the next migration anyone
 *   wrote would make some of it again.
 * - **The generated code.** `src/payload-types.ts` or the admin's import map
 *   is not what the configuration generates.
 *
 * Needs no database. It leaves the working tree as it found it: what it
 * generates to compare with is taken away again, and the difference printed.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PAYLOAD_BIN, WITHOUT_DATABASE, repoRoot, runNode } from './local-database.mjs';
import { changedStatements } from './migration-rebase.ts';

const MIGRATIONS = path.join(repoRoot, 'src', 'migrations');
const INDEX = path.join(MIGRATIONS, 'index.ts');
const problems = [];

const folder = () =>
  readdirSync(MIGRATIONS, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

// ---------------------------------------------------------------------------
// Would a migration written now be empty?

const newest = folder()
  .filter((name) => name.endsWith('.json'))
  .sort()
  .at(-1);
const before = new Set(folder());
const index = existsSync(INDEX) ? readFileSync(INDEX, 'utf8') : null;

await runNode([PAYLOAD_BIN, 'migrate:create', 'unmigrated_changes', '--skip-empty'], WITHOUT_DATABASE);

const created = folder().filter((name) => !before.has(name) && name !== 'index.ts');
if (created.length > 0) {
  const written = created.find((name) => name.endsWith('.ts'));
  const statements = changedStatements({ previous: [], generated: readFileSync(path.join(MIGRATIONS, written), 'utf8') }).added;
  for (const name of created) rmSync(path.join(MIGRATIONS, name));
  if (index === null) rmSync(INDEX, { force: true });
  else writeFileSync(INDEX, index);

  problems.push(
    `The configuration differs from the newest snapshot, src/migrations/${newest}. ` +
      'A migration written now would run:\n\n' +
      statements.map((statement) => `  ${statement};`).join('\n') +
      '\n\nWrite that migration — npm run cms:migration -- <name> — or, when this branch has merged main since it ' +
      'wrote its own, rebuild them: npm run cms:rebase-migrations (docs/agents/parallel-sessions.md).',
  );
}

// ---------------------------------------------------------------------------
// Is the generated code what the configuration generates?

const GENERATED = [
  { file: 'src/payload-types.ts', command: 'generate:types' },
  { file: 'src/app/(payload)/maktab/importMap.js', command: 'generate:importmap' },
];

for (const { file, command } of GENERATED) {
  const location = path.join(repoRoot, file);
  const committed = readFileSync(location, 'utf8');
  await runNode([PAYLOAD_BIN, command], WITHOUT_DATABASE);
  const generated = readFileSync(location, 'utf8');
  if (generated.replace(/\r/g, '').trim() === committed.replace(/\r/g, '').trim()) continue;

  writeFileSync(location, committed);
  const scratch = mkdtempSync(path.join(tmpdir(), 'rabaed-check-migrations-'));
  writeFileSync(path.join(scratch, 'committed'), committed);
  writeFileSync(path.join(scratch, 'generated'), generated);
  const diff = spawnSync('git', ['diff', '--no-index', '--no-color', 'committed', 'generated'], {
    cwd: scratch,
    encoding: 'utf8',
  }).stdout;
  rmSync(scratch, { recursive: true, force: true });

  const lines = diff.split('\n').slice(4);
  problems.push(
    `${file} is not what the configuration generates. Regenerate it — npm run cms:generate — and commit it. ` +
      'The difference:\n\n' +
      lines.slice(0, 60).join('\n') +
      (lines.length > 60 ? `\n… and ${lines.length - 60} more lines` : ''),
  );
}

if (problems.length > 0) {
  console.error(`\n${problems.join('\n\n')}`);
  process.exit(1);
}
console.log('\nThe migrations make everything the configuration asks for, and the generated code is up to date.');
