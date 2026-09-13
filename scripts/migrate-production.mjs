/**
 * Runs before `next build`. On Vercel's production build — and nowhere else —
 * brings production's database up to date with the migrations in
 * `src/migrations/`, so a merged change that adds a field cannot be built
 * against tables that do not have it yet.
 *
 * Nowhere else, on purpose. A preview deployment is somebody trying out a pull
 * request; if it could migrate, trying out a change would alter the tables the
 * live site reads. Preview databases are migrated by hand (docs/deployment.md).
 * Locally and in the test suite, `scripts/with-database.mjs` and
 * `scripts/test-server.mjs` migrate their own databases.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.VERCEL_ENV !== 'production') process.exit(0);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrate = spawn(process.execPath, [path.join(repoRoot, 'node_modules', 'payload', 'bin.js'), 'migrate'], {
  cwd: repoRoot,
  stdio: 'inherit',
});
migrate.once('exit', (code) => process.exit(code ?? 1));
