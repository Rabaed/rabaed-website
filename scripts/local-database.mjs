/**
 * A real Postgres on this machine, for development and the test suite, with
 * no Docker and nothing to install: `embedded-postgres` downloads the server
 * as an npm package for whichever platform it runs on.
 *
 * Real Postgres rather than a stand-in, because production is Supabase
 * Postgres (ADR-0004) and the migrations have to run against the same engine
 * they will meet there.
 */
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const require = createRequire(import.meta.url);

/** Payload's and Next's command lines, run under this Node rather than a shell. */
export const PAYLOAD_BIN = path.join(repoRoot, 'node_modules', 'payload', 'bin.js');
export const NEXT_BIN = require.resolve('next/dist/bin/next');

const DATABASE = 'rabaed';

/**
 * This checkout's development database: kept in `.data/postgres` so content
 * survives between runs, on a port derived from where the checkout lives, so
 * the worktrees of parallel sessions each get their own
 * (docs/agents/parallel-sessions.md).
 */
export const DEVELOPMENT_DATABASE = {
  directory: path.join(repoRoot, '.data', 'postgres'),
  port: 55000 + (createHash('sha256').update(repoRoot).digest().readUInt16BE(0) % 1000),
};

/**
 * Starts Postgres with its data in `directory`, creating the cluster the first
 * time, and resolves with the connection string once it accepts connections.
 */
export async function startDatabase({ directory, port }) {
  const fresh = !existsSync(path.join(directory, 'PG_VERSION'));
  const server = new EmbeddedPostgres({
    databaseDir: directory,
    port,
    user: 'postgres',
    password: 'postgres',
    persistent: true,
    // UTF-8 whatever the machine's own locale: on Windows initdb otherwise
    // picks the system code page, which cannot store Arabic.
    initdbFlags: ['--encoding=UTF8', '--no-locale'],
    onLog: () => {},
    onError: (message) => {
      const text = String(message instanceof Error ? message.message : message).trim();
      if (text) process.stderr.write(`[postgres] ${text}\n`);
    },
  });

  if (fresh) await server.initialise();
  await server.start();
  if (fresh) await server.createDatabase(DATABASE);

  return {
    url: `postgres://postgres:postgres@127.0.0.1:${port}/${DATABASE}`,
    stop: () => server.stop(),
  };
}

/**
 * Runs `work` against an empty Postgres in the system's temporary directory,
 * and takes the database and its directory away again afterwards, whether or
 * not the work succeeded. Returns what the work threw, or `null`.
 *
 * `work` is given the environment to run a command in: the connection string,
 * a secret good for nothing outside this machine, and upload directories in
 * the same temporary place, so that a migration which uploads a file cannot
 * leave one in the checkout.
 *
 * The port is derived from **where this checkout lives and what `name` is**,
 * over a range of 2000. The checkout keeps the worktrees of parallel sessions
 * off each other's databases (docs/agents/parallel-sessions.md); the name
 * keeps two of these scripts running at once in one worktree off each other's.
 * 56000 and up is clear of the development database's range and of the test
 * server's `TEST_PORT + 2000`.
 */
export async function withThrowawayDatabase(name, work) {
  const directory = await mkdtemp(path.join(tmpdir(), `rabaed-${name}-`));
  const port = 56000 + (createHash('sha256').update(`${repoRoot}
${name}`).digest().readUInt16BE(0) % 2000);
  const database = await startDatabase({ directory: path.join(directory, 'postgres'), port });
  console.log(`Empty database on port ${port}.`);

  let failure = null;
  try {
    await work({
      ...process.env,
      DATABASE_URL: database.url,
      PAYLOAD_SECRET: 'local-development-only',
      MEDIA_DIR: path.join(directory, 'media'),
      SHARING_IMAGE_DIR: path.join(directory, 'sharing-images'),
    });
  } catch (error) {
    failure = error;
  }

  await database.stop().catch(() => {});
  await rm(directory, { recursive: true, force: true }).catch(() => {});
  return failure;
}

/**
 * The environment for the Payload commands that never connect: `migrate:create`
 * and `generate:types` read the configuration alone. The configuration will
 * not load without a connection string, so it is given one that nothing
 * listens at — a command that ever did connect would fail, rather than reach
 * whatever database `.env.local` names.
 */
export const WITHOUT_DATABASE = {
  ...process.env,
  DATABASE_URL: 'postgres://no-database@127.0.0.1:1/none',
  PAYLOAD_SECRET: 'local-development-only',
};

/** Runs a Node script to completion, and throws if it fails. */
export function runNode(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: repoRoot, env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(args[0])} ${args[1] ?? ''} exited with ${code}`)),
    );
  });
}
