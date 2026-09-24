import { defineConfig, devices } from '@playwright/test';

/**
 * The suite runs against the **built** application, never the dev server: dev
 * skips minification, prerendering and the production font pipeline, so a
 * green dev run proves nothing about what visitors receive.
 *
 * The server runs on port 3100 unless `TEST_PORT` names another. 3100 keeps out
 * of the way of a dev server on 3000 and the baseline capture's static server
 * on 4321. `TEST_PORT` exists so that several copies of the repo — one per
 * agent session, each in its own git worktree — can run the suite on one
 * machine at the same time: with a fixed port, the second run finds it taken
 * and stops, because `reuseExistingServer` is off on purpose (below). See
 * `docs/agents/parallel-sessions.md`.
 *
 * The suites that publish what others read run against a **second server**
 * with a database of its own, on `TEST_PORT + 1000` (ticket 89), below.
 *
 * Chromium is pinned to the same Playwright version the visual baselines were
 * captured with (see `tests/baselines/README.md`); bumping it changes text
 * rasterisation and invalidates the comparison.
 */
const PORT = testPort(process.env.TEST_PORT);
/**
 * The second server's port. A thousand up keeps it clear of the other lanes'
 * `TEST_PORT`s, which are 31NN, and puts its database, at `+ 2000` as every
 * test server's is, on `TEST_PORT + 3000`: clear of the lanes' own databases
 * and of the development ones from 55000 (`scripts/local-database.mjs`).
 */
const PUBLISHING_PORT = PORT + 1000;
/**
 * The suites that publish what every other suite would notice, or hold what
 * every other suite would wait for (`publishing`, below).
 */
const PUBLISHING = /(case-studies|referral-program-values|ai-crawlers|launch-articles|stale-render|english-pages|confirmation-limit)\.spec\.ts$/;
const baseURL = `http://127.0.0.1:${PORT}`;
const publishingURL = `http://127.0.0.1:${PUBLISHING_PORT}`;

/**
 * Reads `TEST_PORT`, and refuses a value that is not a usable port. Four
 * digits whose second server's port has four too: the second server serves
 * the first one's build with its address rewritten, which only works where
 * the two are the same length (`scripts/test-server.mjs`).
 */
function testPort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') return 3100;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 8999) {
    throw new Error(`TEST_PORT must be a whole number from 1024 to 8999, not "${value}".`);
  }
  return port;
}

export default defineConfig({
  // `tests/e2e` drives the built site; `tests/unit` holds the specs that open
  // no browser — the delay-cost formula and the SVG sanitiser, the two direct
  // unit tests the spec permits, and the privacy inventory held to the form
  // definitions.
  // `tests/baselines` is images and has no specs for this to find.
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  /**
   * How long an assertion that retries — `toBeVisible`, `toHaveText`, an
   * `expect.poll` that names no timeout of its own — may go on retrying
   * (ticket 61).
   *
   * Playwright's own default is five seconds, and that number is Playwright's,
   * not this suite's. It was what decided whether CI was green: a hosted
   * runner stalled once while the admin was re-rendering a tab's panel, the
   * assertion gave up at five seconds, and a pull request whose whole diff was
   * one line of a markdown file went red.
   *
   * **Twenty seconds is headroom for a stall, not an allowance for slow work.**
   * Measured on the hosted runner itself, that same re-render takes 4ms at its
   * fastest, 22ms at the median and 99ms at its slowest over 32 samples — so
   * the runner is not slow, and waiting longer costs a passing assertion
   * nothing, because it returns the moment it is true. What it buys is riding
   * out the occasional stall that no distribution of 32 samples can size.
   *
   * What it costs is that an assertion which will never be true now takes
   * twenty seconds to say so instead of five. That is the trade, and it is
   * worth it while a green run means something and a red one has to be
   * re-run. An assertion that should fail fast says so itself — the two
   * `{ timeout: 500 }` checks in the reference comparisons do.
   */
  expect: { timeout: 20_000 },
  /**
   * How long one test may take. Playwright's default is thirty seconds, and a
   * test that runs out of it reports "Test timeout of 30000ms exceeded",
   * which says nothing about what was expected — so the deadline has to leave
   * room for an assertion to fail in its own words on the budget above.
   *
   * Two minutes rather than one, because the tests this was raised for walk a
   * row of tabs and assert after each: eight on the home page, five on the
   * partnership page. Those assertions pass, but under a full suite at twenty
   * workers they pass *slowly*, and it is their sum that reaches the
   * deadline — a run on 20 September 2026 hit thirty seconds across five of
   * them without any one of them failing. `test.slow()` still multiplies this
   * by three.
   */
  timeout: 120_000,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: PUBLISHING,
    },
    // The suites that publish what every other suite would notice, against a
    // server and database of their own (ticket 89). Publishing a case study
    // puts a link in the header of every page (ticket 24); publishing a
    // Referral Program value changes the amounts the referral page and the
    // FAQs show (ticket 56); the AI crawler suite publishes a `robots.txt` rule
    // and reads `llms.txt`, which describes every page at once (ticket 33);
    // publishing a launch article puts it on the blog index, in the sitemap and
    // in `llms.txt` (ticket 38); the stale-render suite publishes the site
    // settings every footer shows, and holds `/tool` at the database while it
    // does (ticket 64); the English pages suite publishes English pages the
    // others hold to being notices (ticket 42); and the confirmation limit
    // suite spends the whole site's hour of confirmations (ticket 89). None of
    // that reaches the first server's database, so the suites there never see
    // it, and never wait for it.
    //
    // **One at a time.** They would notice each other too, as they would any
    // other suite: one worker for the project means no two of them ever
    // publish at once, or hold a lock while another publishes. The first
    // server's suites run beside them all the while, and on CI's one worker
    // nothing runs beside anything anyway (`.github/workflows/ci.yml`).
    {
      name: 'publishing',
      use: { ...devices['Desktop Chrome'], baseURL: publishingURL },
      testMatch: PUBLISHING,
      workers: 1,
    },
  ],
  // Started in this order, each once the one before it answers — which the
  // second relies on, since it serves the first one's build.
  webServer: [
    {
      // Starts a throwaway database, migrates it and creates the test editor,
      // then builds the application and starts it (ticket 19).
      command: 'node scripts/test-server.mjs',
      // Read by the build to work out the origin canonical URLs point at when
      // nothing else says (src/lib/environment.ts), and by the test server to
      // choose its port and its database's.
      env: { PORT: String(PORT) },
      url: baseURL,
      // Never reuse: a server already listening is either a dev server or a
      // stale build, and both would make the run a lie.
      reuseExistingServer: false,
      // The database, its migrations and the build, one after another.
      timeout: 300_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      // A database of its own, migrated, with the same editors, serving a
      // copy of the build above with its own address in place of the first
      // server's (`--publishing` in the script).
      command: 'node scripts/test-server.mjs --publishing',
      env: { PORT: String(PUBLISHING_PORT), FIRST_SERVER_PORT: String(PORT) },
      url: publishingURL,
      reuseExistingServer: false,
      timeout: 300_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
