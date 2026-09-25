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
 * Neither server gets a database: `DATABASE_URL` is emptied, over anything a
 * `.env` file in the checkout would give it. A studio page never touches the
 * CMS, and a server that tried would fail here rather than pass by accident.
 *
 * They serve the first test server's build folder while it is serving it too,
 * which is safe only while neither of them rebuilds a page into it (ticket 89
 * copies the build for the second test server for that reason). So nothing
 * here asks for a page that could be rebuilt: the studio's pages are built
 * once and never rebuilt, a production studio address never reaches a page,
 * and the server is waited for with a file from `public/`.
 *
 * One server at a time, on one port: `TEST_PORT + 4000`, clear of the two
 * test servers, their databases (`playwright.config.ts`), and every other
 * lane's. A port already taken is refused, since whatever holds it would
 * answer in this server's place.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { SCREEN_MOCKS, studioPath } from '../../src/screen-mocks/registry';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const NEXT_BIN = createRequire(import.meta.url).resolve('next/dist/bin/next');
const MOCK = SCREEN_MOCKS[0].id;

test.describe.configure({ mode: 'serial' });

/** Refuses `port` if anything is listening on it already. */
async function requireFreePort(port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const probe = createServer();
    probe.once('error', (error: NodeJS.ErrnoException) =>
      reject(error.code === 'EADDRINUSE' ? new Error(`Something is already listening on port ${port}.`) : error),
    );
    probe.once('listening', () => probe.close(() => resolve()));
    probe.listen(port, '127.0.0.1');
  });
}

/** Starts the first test server's build on `port` with `environment` over the suite's own. */
async function startServer(port: number, environment: Record<string, string>): Promise<ChildProcess> {
  await requireFreePort(port);
  const server = spawn(process.execPath, [NEXT_BIN, 'start', '--port', String(port)], {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port), DATABASE_URL: '', ...environment },
    stdio: 'ignore',
  });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start exited with ${server.exitCode}.`);
    try {
      await fetch(`http://127.0.0.1:${port}/og-rabaed.png`, { method: 'HEAD', signal: AbortSignal.timeout(1000) });
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
  const server = await startServer(port, { VERCEL: '1', VERCEL_ENV: 'production' });
  try {
    // Each spelling of the address a page could be found by: plain, with a
    // trailing slash, as the client router asks for it, and with a letter of
    // the prefix percent-encoded, in case the page is found by a decoded path
    // the proxy was not asked about.
    const addresses: [string, HeadersInit?][] = [
      [studioPath('ar', MOCK)],
      [studioPath('en', MOCK)],
      [`${studioPath('ar', MOCK)}/`],
      [studioPath('ar', MOCK), { RSC: '1' }],
      [studioPath('ar', MOCK).replace('/studio', '/%73tudio')],
    ];
    for (const [address, headers] of addresses) {
      const label = `${address}${headers ? ' (RSC)' : ''}`;
      const response = await fetch(`http://127.0.0.1:${port}${address}`, { headers, redirect: 'follow' });
      expect(response.status, label).toBe(404);
      expect(await response.text(), label).not.toContain('data-vs-shot');
    }
  } finally {
    await stop(server);
  }
});

test('a preview deployment, from the same build, still shows the studio', async ({ baseURL }) => {
  const port = portFor(baseURL);
  const server = await startServer(port, { VERCEL: '1', VERCEL_ENV: 'preview' });
  try {
    const response = await fetch(`http://127.0.0.1:${port}${studioPath('ar', MOCK)}`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('data-vs-shot');
  } finally {
    await stop(server);
  }
});
