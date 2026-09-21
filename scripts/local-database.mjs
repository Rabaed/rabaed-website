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
import { createRequire } from 'node:module';
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
 * A port for a throwaway database, derived from where this checkout lives, so
 * that the worktrees of parallel sessions never collide on one
 * (docs/agents/parallel-sessions.md). Out of the way of the development
 * database's range and of the test server's `TEST_PORT + 2000`.
 */
export function freshDatabasePort(root) {
  return 56000 + (createHash('sha256').update(root).digest().readUInt16BE(0) % 1000) * 2;
}

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
