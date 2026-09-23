/**
 * A deployment's database connections have a ceiling, and a wait for one has
 * an end (ticket 83).
 *
 * Every server Vercel runs the site on opens its own pool of connections, and
 * `pg`'s defaults give each one ten and let a request wait for a free one for
 * ever. So a traffic spike asks Supabase for ten more connections with each
 * server it starts, and anything that finds its server's all busy hangs.
 *
 * This is only observable on a deployment, which the suite never runs on, so
 * it asks the Payload config directly: loaded as a Vercel deployment, what
 * pool does it hand the Postgres adapter? And loaded as the test server is,
 * the same question must come back with `pg`'s own pool — the suites lean on
 * those ten connections (ticket 70), and nothing here is meant to change them.
 *
 * Each load runs in a process of its own, through Payload's own runner, as
 * `cms-boots-without-jsdom.spec.ts` does and for the same reasons: what the
 * config reads from its environment is decided once, when it is first loaded.
 */
import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const PROBE = path.join('tests', 'unit', 'database-pool.probe.ts');
const PAYLOAD_BIN = path.join('node_modules', 'payload', 'bin.js');

type Pool = { max: number | null; connectionTimeoutMillis: number | null };

/**
 * The pool the config hands the adapter under `environment`. Every value is a
 * stand-in: nothing is connected to, and a deployment only has to find each
 * variable set (`src/cms/environment.ts`).
 */
function poolUnder(environment: Record<string, string>): Pool {
  const { status, stdout, stderr } = spawnSync(process.execPath, [PAYLOAD_BIN, 'run', PROBE], {
    encoding: 'utf8',
    cwd: repoRoot,
    env: {
      ...process.env,
      DATABASE_URL: 'postgres://unused:unused@127.0.0.1:1/unused',
      PAYLOAD_SECRET: 'unused-in-this-test',
      ...environment,
    },
  });

  if (status !== 0) throw new Error(`loading the config failed:\n${stdout}\n${stderr}`);
  return JSON.parse(stdout.trim().split(/\r?\n/).at(-1) ?? '') as Pool;
}

// Loading a Payload config is slower than the test runner's own deadline
// expects, and this does it twice.
test.slow();

test('a deployment holds at most five connections, and waits at most ten seconds for one', () => {
  const pool = poolUnder({
    VERCEL_ENV: 'production',
    S3_BUCKET: 'unused',
    S3_ENDPOINT: 'https://unused.invalid',
    S3_REGION: 'unused',
    S3_ACCESS_KEY_ID: 'unused',
    S3_SECRET_ACCESS_KEY: 'unused',
  });
  expect(pool).toEqual({ max: 5, connectionTimeoutMillis: 10_000 });
});

test('the test server keeps pg’s own pool', () => {
  expect(poolUnder({ VERCEL_ENV: '' })).toEqual({ max: null, connectionTimeoutMillis: null });
});
