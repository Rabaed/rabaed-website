/**
 * The Screen mock studio answers on every deployment but production (ticket 98,
 * ADR-0002).
 *
 * The studio exists to be photographed by `npm run mocks:export`, compared by
 * `screen-mocks.spec.ts`, and looked at by the founder on a preview, which
 * Vercel's sign-in already guards (ticket 78). On the live site it is only one
 * more address for a scanner to find.
 *
 * The test server is not production and cannot be made so: it serves a
 * throwaway database and writes mail to a folder. So this starts the build it
 * made a second time, as production starts it — with `VERCEL_ENV` set to
 * `production` — and asks it for studio pages. Then once more as a preview,
 * from the same build: that the one build answers both ways is what shows the
 * answer is decided when the page is asked for, not left out when the site is
 * built. A preview has to keep it.
 *
 * Neither server gets a database. A studio page never touches the CMS, and a
 * server that tried would fail here rather than pass by accident.
 *
 * One server at a time, on one port: `TEST_PORT + 4000`, clear of the two
 * test servers, their databases (`playwright.config.ts`), and every other
 * lane's.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { SCREEN_MOCKS, studioPath } from '../../src/screen-mocks/registry';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const NEXT_BIN = createRequire(import.meta.url).resolve('next/dist/bin/next');
const MOCK = SCREEN_MOCKS[0].id;

test.describe.configure({ mode: 'serial' });

/** Starts the first test server's build on `port` with `environment` over the suite's own. */
async function startBuild(port: number, environment: Record<string, string>): Promise<ChildProcess> {
  const server = spawn(process.execPath, [NEXT_BIN, 'start', '--port', String(port)], {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port), ...environment },
    stdio: 'ignore',
  });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start exited with ${server.exitCode}.`);
    try {
      await fetch(`http://127.0.0.1:${port}/`, { method: 'HEAD' });
      return server;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  server.kill();
  throw new Error(`next start did not answer on port ${port} within a minute.`);
}

async function stop(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) return;
  const exited = once(server, 'exit');
  server.kill();
  await exited;
}

function portFor(baseURL: string | undefined): number {
  return Number(new URL(baseURL!).port) + 4000;
}

test('the production deployment answers not found for the studio', async ({ baseURL }) => {
  const port = portFor(baseURL);
  const server = await startBuild(port, { VERCEL: '1', VERCEL_ENV: 'production' });
  try {
    for (const address of [studioPath('ar', MOCK), studioPath('en', MOCK), '/studio', '/studio/ar']) {
      const response = await fetch(`http://127.0.0.1:${port}${address}`, { redirect: 'manual' });
      expect(response.status, address).toBe(404);
      expect(await response.text(), address).not.toContain('data-vs-shot');
    }
  } finally {
    await stop(server);
  }
});

test('a preview deployment, from the same build, still shows the studio', async ({ baseURL }) => {
  const port = portFor(baseURL);
  const server = await startBuild(port, { VERCEL: '1', VERCEL_ENV: 'preview' });
  try {
    const response = await fetch(`http://127.0.0.1:${port}${studioPath('ar', MOCK)}`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('data-vs-shot');
  } finally {
    await stop(server);
  }
});
