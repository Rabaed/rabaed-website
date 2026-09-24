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
 * Needs no database. It leaves the working tree as it found it, whether or
 * not Payload succeeds: what it generates to compare with is taken away
 * again, and the difference printed.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  MIGRATIONS_DIRECTORY,
  PAYLOAD_BIN,
  WITHOUT_DATABASE,
  migrationFolder as folder,
  repoRoot,
  runNode,
} from './local-database.mjs';
import { changedStatements } from './migration-rebase.ts';

const INDEX = path.join(MIGRATIONS_DIRECTORY, 'index.ts');
const problems = [];

// ---------------------------------------------------------------------------
// Would a migration written now be empty?

const newest = folder()
  .filter((name) => name.endsWith('.json'))
  .sort()
  .at(-1);
const before = new Set(folder());
const index = existsSync(INDEX) ? readFileSync(INDEX, 'utf8') : null;

try {
  await runNode([PAYLOAD_BIN, 'migrate:create', 'unmigrated_changes', '--skip-empty'], WITHOUT_DATABASE);

  const written = folder().find((name) => !before.has(name) && name.endsWith('.ts') && name !== 'index.ts');
  if (written) {
    const source = readFileSync(path.join(MIGRATIONS_DIRECTORY, written), 'utf8');
    const statements = changedStatements({ previous: [], generated: source }).added;
    problems.push(
      `The configuration differs from the newest snapshot, src/migrations/${newest}. ` +
        'A migration written now would run:\n\n' +
        statements.map((statement) => `  ${statement};`).join('\n') +
        '\n\nWrite that migration — npm run cms:migration -- <name> — or, when this branch has merged main since ' +
        'it wrote its own, rebuild them: npm run cms:rebase-migrations (docs/agents/parallel-sessions.md).',
    );
  }
} finally {
  for (const name of folder()) if (!before.has(name)) rmSync(path.join(MIGRATIONS_DIRECTORY, name));
  if (index !== null) writeFileSync(INDEX, index);
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
  let generated;
  try {
    await runNode([PAYLOAD_BIN, command], WITHOUT_DATABASE);
    generated = readFileSync(location, 'utf8');
  } finally {
    writeFileSync(location, committed);
  }
  if (generated.replace(/\r/g, '').trim() === committed.replace(/\r/g, '').trim()) continue;

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
