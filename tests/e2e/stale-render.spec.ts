/**
 * A publish that lands while a page is being built still reaches that page
 * (ticket 64, ADR-0017).
 *
 * Next decides whether a cached page is past a publish's mark by *when the
 * page was written*, not by what is in it. So a build that read the words
 * before a publish and finished after it caches the old words stamped later
 * than the mark, and counts them as fresh — until the next publish, or ticket
 * 66's ten minutes. Publishing now marks the site twice, the second time after
 * any build already under way has finished (`src/cms/revalidation.ts`).
 *
 * The build is held open at the database rather than in the page's code. A
 * build of `/tool` reads the tool page's own words first and then renders the
 * page around them, whose footer reads the site settings; the test locks the
 * site settings, so the build has the tool page's words and then waits. The
 * words are published while it waits, and the lock let go. Nothing in the site
 * knows it is being tested.
 *
 * Runs against the second test server (`playwright.config.ts`, ticket 89): it
 * publishes the tool page, and while it holds the site settings every page
 * being built there waits a moment. No other suite runs on that server while
 * it does, so no publish of theirs can land in this test's wait and rebuild
 * `/tool` for it.
 *
 * **The hold is bounded, and has to be** (ticket 70). Each build waiting on the
 * lock holds one of the server's ten database connections while it waits.
 * Once ten builds are waiting, the publish below has no connection to publish
 * with: it waits for the lock, and the lock waits for it. Nothing ended that
 * but this test's two minutes, and every page asked for in them waited too —
 * on 23 September 2026, when this ran on the server every suite shared, that
 * took five tests of the suites beside it down with this one. It has a server
 * to itself now, but a page a suite before it marked for rebuilding can still
 * be built while it holds. So the lock lets go at `HELD_AT_MOST` whatever the
 * test is doing, and the test then fails in words that say so.
 */
import type { APIResponse } from '@playwright/test';
import pg from 'pg';
import { reachesVisitors } from './cms';
import { test, expect } from './entries';

/**
 * The longest the site settings are held, whatever happens. A hold is about
 * four seconds — the build seen arriving, half a second, the publish, three
 * seconds — and every page being built waits for as long as it lasts.
 */
const HELD_AT_MOST = 10_000;

/**
 * The test server's database: `TEST_PORT + 2000`, as `scripts/test-server.mjs`
 * starts it and `scripts/local-database.mjs` names it. Restated rather than
 * imported, for the reason `routes.ts` gives.
 */
function testDatabase(baseURL: string, settings: pg.ClientConfig = {}): pg.Client {
  const port = Number(new URL(baseURL).port) + 2000;
  return new pg.Client({ connectionString: `postgres://postgres:postgres@127.0.0.1:${port}/rabaed`, ...settings });
}

/**
 * Lets go of the lock `database` holds — once, when the test asks or at
 * `HELD_AT_MOST`, whichever comes first. `overran` says it was the ceiling.
 */
function holdAtMost(database: pg.Client) {
  let released: Promise<unknown> | undefined;
  const hold = {
    overran: false,
    letGo: () => {
      clearTimeout(ceiling);
      // Nothing was written: ending the transaction is only letting go.
      return (released ??= database.query('ROLLBACK').catch(() => undefined));
    },
  };
  const ceiling = setTimeout(() => {
    hold.overran = true;
    void hold.letGo();
  }, HELD_AT_MOST);
  return hold;
}

/**
 * Given its own deadline: one that outlives the ceiling, so a publish the lock
 * held up is answered once the ceiling lets go, but never the test's two minutes.
 */
const PUBLISH_HELD_UP = { timeout: HELD_AT_MOST + 10_000 };

test('a change published while a page is being built still reaches that page', async ({ request, baseURL, cms }) => {
  const tool = cms.entry('tool-page');
  const entry = await tool.published();
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.upsell.lead.ar} `;
  const reworded = { ...entry, upsell: { ...entry.upsell, lead: { ...entry.upsell.lead, ar: lead } } };

  // Two connections: one holds the lock, the other watches. Postgres answers
  // `pg_stat_activity` from one snapshot for the whole of a transaction, so the
  // connection holding the lock would never see the build arrive.
  //
  // Postgres bounds the hold as well, should this process stall where the
  // ceiling cannot act: the lock is given up on rather than queued for, because
  // an exclusive lock still waiting holds up every reader behind it as surely
  // as one granted; and the session holding it is ended soon after the ceiling.
  const database = testDatabase(baseURL!, {
    lock_timeout: 2_000,
    idle_in_transaction_session_timeout: HELD_AT_MOST + 2_000,
  });
  // Postgres ending that session is the backstop at work, not a failure of its own.
  database.on('error', () => undefined);
  const watcher = testDatabase(baseURL!, { statement_timeout: 2_000 });
  let hold: ReturnType<typeof holdAtMost> | undefined;
  let building: Promise<APIResponse> | undefined;
  try {
    await Promise.all([database.connect(), watcher.connect()]);

    // Every page marked, so that the next visit to /tool builds it again.
    await tool.publish(entry, PUBLISH_HELD_UP);

    // The site settings held: a build of /tool reads the tool page's words, then waits.
    await database.query('BEGIN');
    await database.query('LOCK TABLE "site_settings" IN ACCESS EXCLUSIVE MODE');
    hold = holdAtMost(database);
    building = request.get('/tool', { timeout: HELD_AT_MOST + 20_000 });
    await expect
      .poll(
        async () =>
          (
            await watcher.query<{ waiting: number }>(
              `SELECT count(*)::int AS waiting FROM pg_stat_activity
                WHERE wait_event_type = 'Lock' AND query LIKE '%site_settings%'`,
            )
          ).rows[0]!.waiting,
        // A tenth of a second when all is well; the rest of the ceiling is the publish's.
        { message: 'a build of /tool waiting on the site settings', timeout: 3_000 },
      )
      .toBeGreaterThan(0);
    // A page a suite before this one marked for rebuilding may be what the
    // watcher saw: a moment for /tool's own build to have read its words.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // The words change while that build is under way. The build is held a
    // little longer, as a slow one would be: Next writes a publish's mark as it
    // finishes answering, and a build that finished within that moment would
    // be written before the mark rather than after it. Then it lets go, and
    // caches /tool as it read it: with the words from before, stamped after
    // the publish.
    await tool.publish(reworded, PUBLISH_HELD_UP);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await hold.letGo();
    expect(
      hold.overran,
      `the site settings were let go at the ${HELD_AT_MOST}ms ceiling, not by this test: the wait for /tool's build ` +
        `or the publish ran long — most likely every one of the server's database connections was held by a build ` +
        `waiting on the lock, leaving the publish none. Run this test alone, or on a machine not running another suite.`,
    ).toBe(false);

    // The build that was held answered with the words from before, or this
    // test set up no race and would pass without testing anything.
    const held = await (await building).text();
    expect(held, 'the held build of /tool read the words from before the publish').toContain(
      `${entry.upsell.lead.ar}</p>`,
    );

    // `HIT` for the whole wait, if it fails, is the page that build cached.
    await reachesVisitors(request, '/tool', `${lead}</p>`, 'the words published while /tool was being built');
  } finally {
    // The lock let go whatever happened above, before anything that could
    // throw; the words go back when the test ends (`entries.ts`).
    try {
      await hold?.letGo();
      await building?.catch(() => undefined);
    } finally {
      await Promise.allSettled([database.end(), watcher.end()]);
    }
  }
});
