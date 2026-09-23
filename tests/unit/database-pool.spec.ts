/**
 * A deployment's database connections have a ceiling, a wait for one has an
 * end, and they go through Supabase's transaction pooler (ticket 83).
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
 * Each load runs in a process of its own (`payload-probe.ts` says why), as
 * `cms-boots-without-jsdom.spec.ts` does.
 */
import { test, expect } from '@playwright/test';
import { runProbe } from './payload-probe';

type Pool = { max: number | null; connectionTimeoutMillis: number | null; idleTimeoutMillis: number | null };

/**
 * The pool the config hands the adapter under `environment`. Every value is a
 * stand-in: nothing is connected to, and a deployment only has to find each
 * variable set (`src/cms/environment.ts`).
 */
function poolUnder(environment: Record<string, string>): Pool {
  return JSON.parse(runProbe('database-pool.probe.ts', environment)) as Pool;
}

/** A Vercel deployment's variables, every one a stand-in, with `DATABASE_URL` at `address`. */
function deployedAt(address: string): Record<string, string> {
  return {
    VERCEL_ENV: 'production',
    DATABASE_URL: address,
    S3_BUCKET: 'unused',
    S3_ENDPOINT: 'https://unused.invalid',
    S3_REGION: 'unused',
    S3_ACCESS_KEY_ID: 'unused',
    S3_SECRET_ACCESS_KEY: 'unused',
  };
}

/** The pool every deployment should be given. */
const DEPLOYED: Pool = { max: 5, connectionTimeoutMillis: 10_000, idleTimeoutMillis: 10_000 };

const TRANSACTION_POOLER = 'postgres://postgres.unused:unused@aws-0-unused.pooler.supabase.com:6543/postgres';

// Loading a Payload config is slower than the test runner's own deadline
// expects, and this does it several times.
test.slow();

test('a deployment holds at most five connections, waits at most ten seconds for one, and lets one go after ten idle seconds', () => {
  expect(poolUnder(deployedAt(TRANSACTION_POOLER))).toEqual(DEPLOYED);
});

test('a deployment accepts the dedicated pooler Supabase’s paid plans add, which is transaction mode too', () => {
  const dedicated = 'postgres://postgres:unused@db.unused.supabase.co:6543/postgres';
  expect(poolUnder(deployedAt(dedicated))).toEqual(DEPLOYED);
});

test('the test server keeps pg’s own pool', () => {
  expect(poolUnder({ VERCEL_ENV: '' })).toEqual({ max: null, connectionTimeoutMillis: null, idleTimeoutMillis: null });
});

/**
 * Supabase offers three addresses for one database, and only the transaction
 * pooler shares a few connections among many servers. The other two hold one
 * per connection each server opens, which is what the ceiling above is there
 * to keep small. The founder confirmed on 24 September 2026 that production
 * and the Preview environment both use the pooler; this keeps it that way.
 */
test.describe('a deployment refuses a Supabase address other than the transaction pooler', () => {
  for (const [name, address] of [
    ['a direct connection', 'postgres://postgres:unused@db.unused.supabase.co:5432/postgres'],
    ['the pooler’s session mode', 'postgres://postgres.unused:unused@aws-0-unused.pooler.supabase.com:5432/postgres'],
  ]) {
    test(name, () => {
      expect(() => poolUnder(deployedAt(address))).toThrow(/DATABASE_URL.*transaction pooler/s);
    });
  }

  test('and never repeats the address, which carries the database password', () => {
    const address = 'postgres://postgres:the-password@db.unused.supabase.co:5432/postgres';
    let refusal = '';
    try {
      poolUnder(deployedAt(address));
    } catch (error) {
      refusal = String(error);
    }
    expect(refusal).toMatch(/transaction pooler/);
    expect(refusal).not.toContain('the-password');
  });
});
