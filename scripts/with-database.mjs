/**
 * Runs a command with a database behind it.
 *
 *   node scripts/with-database.mjs "next dev"
 *
 * If `DATABASE_URL` is set — in the environment or in `.env.local` — the
 * command runs against that database and nothing else happens. Otherwise a
 * Postgres of this checkout's own is started, kept in `.data/postgres` so
 * content survives between runs, brought up to date with the migrations, and
 * stopped again when the command ends.
 *
 * Its port is derived from where this checkout lives, so the worktrees of
 * parallel sessions each get their own (`DEVELOPMENT_DATABASE`).
 */
import { spawn } from 'node:child_process';
import nextEnv from '@next/env';
import { DEVELOPMENT_DATABASE, PAYLOAD_BIN, repoRoot, runNode, startDatabase } from './local-database.mjs';

const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('Usage: node scripts/with-database.mjs "<command>"');
  process.exit(1);
}

nextEnv.loadEnvConfig(repoRoot, true);

let database = null;
const env = { ...process.env };

if (!env.DATABASE_URL) {
  database = await startDatabase(DEVELOPMENT_DATABASE);
  env.DATABASE_URL = database.url;
  // Signs sessions on this machine only; a deployment always sets its own.
  env.PAYLOAD_SECRET ??= 'local-development-only';
  console.log(`Local database on port ${DEVELOPMENT_DATABASE.port} (.data/postgres).`);

  try {
    await runNode([PAYLOAD_BIN, 'migrate'], env);
  } catch (error) {
    await database.stop();
    throw error;
  }
}

// Through a shell, so the command can be a chain such as `a && b`.
const child = spawn(command, { cwd: repoRoot, env, shell: true, stdio: 'inherit' });

async function finish(code) {
  if (database) await database.stop().catch(() => {});
  process.exit(code);
}

child.once('exit', (code) => finish(code ?? 1));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => child.kill(signal));
