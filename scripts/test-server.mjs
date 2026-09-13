/**
 * The server the end-to-end suite runs against (playwright.config.ts): a
 * throwaway database, migrated and given the suites' editor accounts, then the
 * application built and started against it.
 *
 * Throwaway on purpose. The spec asks for CMS content in tests to be real
 * content in a real database, not fixtures injected at render time; starting
 * from nothing each run also means a migration that only works on a database
 * somebody has already fiddled with fails here first.
 *
 * Postgres listens on `PORT + 2000` and keeps its data in a directory named
 * after `PORT`, so copies of the repository running the suite side by side on
 * different `TEST_PORT`s never share a database (docs/agents/parallel-sessions.md).
 */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { NEXT_BIN, PAYLOAD_BIN, repoRoot, runNode, startDatabase } from './local-database.mjs';
import { TEST_EDITORS } from '../tests/e2e/cms.ts';

const port = Number(process.env.PORT ?? 3100);
const scratch = path.join(os.tmpdir(), `rabaed-test-server-${port}`);

// Left behind by the last run, which ends by being killed.
await rm(scratch, { recursive: true, force: true });

const database = await startDatabase({ directory: path.join(scratch, 'postgres'), port: port + 2000 });

const env = {
  ...process.env,
  DATABASE_URL: database.url,
  PAYLOAD_SECRET: randomBytes(32).toString('hex'),
  MEDIA_DIR: path.join(scratch, 'media'),
};

try {
  await runNode([PAYLOAD_BIN, 'migrate'], env);
  for (const editor of TEST_EDITORS) {
    await runNode([PAYLOAD_BIN, 'run', 'scripts/create-editor.ts'], {
      ...env,
      EDITOR_EMAIL: editor.email,
      EDITOR_PASSWORD: editor.password,
    });
  }
  await runNode([NEXT_BIN, 'build'], env);
} catch (error) {
  await database.stop();
  throw error;
}

const server = spawn(process.execPath, [NEXT_BIN, 'start', '--port', String(port)], {
  cwd: repoRoot,
  env,
  stdio: 'inherit',
});

async function shutDown(code) {
  server.kill();
  await database.stop().catch(() => {});
  process.exit(code);
}

server.once('exit', (code) => shutDown(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => shutDown(0));
