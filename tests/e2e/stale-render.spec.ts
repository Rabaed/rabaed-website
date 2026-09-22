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
 * Runs last (`playwright.config.ts`): it publishes the tool page, and while it
 * holds the site settings every page being built waits a moment. The suites
 * beside it there publish too, and a publish of theirs landing in this test's
 * wait would rebuild `/tool` for it — so in the full suite this is a guard,
 * and the proof that it fails without the second mark is a run of it alone.
 */
import { test, expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import pg from 'pg';
import { STALE_RENDER_EDITOR, logInByApi, reachesVisitors } from './cms';

const GLOBAL = '/api/globals/tool-page';

type Words = { ar: string; en: string | null };
type ToolPage = { upsell: { lead: Words } } & Record<string, unknown>;

/**
 * The test server's database: `TEST_PORT + 2000`, as `scripts/test-server.mjs`
 * starts it and `scripts/local-database.mjs` names it. Restated rather than
 * imported, for the reason `routes.ts` gives.
 */
function testDatabase(baseURL: string): pg.Client {
  const port = Number(new URL(baseURL).port) + 2000;
  return new pg.Client({ connectionString: `postgres://postgres:postgres@127.0.0.1:${port}/rabaed` });
}

/** What the CMS adds to an entry and its list rows, which is not sent back — as `tool-page-text.spec.ts` has it. */
const NOT_SENT = new Set(['id', 'globalType', 'createdAt', 'updatedAt', '_status']);

function fields<T>(value: T): T {
  if (Array.isArray(value)) return value.map(fields) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !NOT_SENT.has(key))
        .map(([key, each]) => [key, fields(each)]),
    ) as T;
  }
  return value;
}

async function publish(editor: APIRequestContext, entry: ToolPage): Promise<void> {
  const response = await editor.post(GLOBAL, { data: { ...entry, _status: 'published' } });
  expect(response.ok(), await response.text()).toBe(true);
}

test('a change published while a page is being built still reaches that page', async ({ page, request, baseURL }) => {
  await logInByApi(page.request, STALE_RENDER_EDITOR);
  const entry = fields((await (await page.request.get(`${GLOBAL}?depth=0`)).json()) as ToolPage);
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.upsell.lead.ar} `;
  const reworded = { ...entry, upsell: { ...entry.upsell, lead: { ...entry.upsell.lead, ar: lead } } };

  // Two connections: one holds the lock, the other watches. Postgres answers
  // `pg_stat_activity` from one snapshot for the whole of a transaction, so the
  // connection holding the lock would never see the build arrive.
  const database = testDatabase(baseURL!);
  const watcher = testDatabase(baseURL!);
  let locked = false;
  let building: Promise<APIResponse> | undefined;
  try {
    await Promise.all([database.connect(), watcher.connect()]);

    // Every page marked, so that the next visit to /tool builds it again.
    await publish(page.request, entry);

    // The site settings held: a build of /tool reads the tool page's words, then waits.
    await database.query('BEGIN');
    await database.query('LOCK TABLE "site_settings" IN ACCESS EXCLUSIVE MODE');
    locked = true;
    building = request.get('/tool');
    await expect
      .poll(
        async () =>
          (
            await watcher.query<{ waiting: number }>(
              `SELECT count(*)::int AS waiting FROM pg_stat_activity
                WHERE wait_event_type = 'Lock' AND query LIKE '%site_settings%'`,
            )
          ).rows[0]!.waiting,
        { message: 'a build of /tool waiting on the site settings' },
      )
      .toBeGreaterThan(0);
    // The suites beside this one build pages too, and any of them may be what
    // the watcher saw: a moment for /tool's own build to have read its words.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // The words change while that build is under way. The build is held a
    // little longer, as a slow one would be: Next writes a publish's mark as it
    // finishes answering, and a build that finished within that moment would
    // be written before the mark rather than after it. Then it lets go, and
    // caches /tool as it read it: with the words from before, stamped after
    // the publish.
    await publish(page.request, reworded);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await database.query('COMMIT');
    locked = false;

    // The build that was held answered with the words from before, or this
    // test set up no race and would pass without testing anything.
    const held = await (await building).text();
    expect(held, 'the held build of /tool read the words from before the publish').toContain(
      `${entry.upsell.lead.ar}</p>`,
    );

    // `HIT` for the whole wait, if it fails, is the page that build cached.
    await reachesVisitors(request, '/tool', `${lead}</p>`, 'the words published while /tool was being built');
  } finally {
    // The words go back whatever happened above, before anything that could throw.
    try {
      if (locked) await database.query('ROLLBACK');
      await building?.catch(() => undefined);
    } finally {
      await Promise.allSettled([database.end(), watcher.end()]);
      await publish(page.request, entry);
    }
  }
});
