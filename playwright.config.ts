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
 * Chromium is pinned to the same Playwright version the visual baselines were
 * captured with (see `tests/baselines/README.md`); bumping it changes text
 * rasterisation and invalidates the comparison.
 */
const PORT = testPort(process.env.TEST_PORT);
/** The suites that publish, or read, what every other suite would notice — run once those are done (below). */
const RUNS_LAST = /(case-studies|referral-program-values|ai-crawlers)\.spec\.ts$/;
const baseURL = `http://127.0.0.1:${PORT}`;

/** Reads `TEST_PORT`, and refuses a value that is not a usable port. */
function testPort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') return 3100;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`TEST_PORT must be a whole number from 1024 to 65535, not "${value}".`);
  }
  return port;
}

export default defineConfig({
  // `tests/e2e` drives the built site; `tests/unit` holds the one direct unit
  // tests the spec permits — the delay-cost formula and the SVG sanitiser —
  // which open no browser.
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
      testIgnore: RUNS_LAST,
      teardown: 'runs-last',
    },
    // After everything else has finished, never beside it. Publishing a case
    // study puts a link in the header of every page (ticket 24), and the
    // suites that hold the header to the Reference site would see it;
    // publishing a Referral Program value changes the amounts the referral
    // page's and the FAQs' suites read (ticket 56); and the AI crawler rules
    // suite reads `llms.txt`, which describes every page of the site at once,
    // and publishes a `robots.txt` rule (ticket 33). None reads what another
    // writes — what the first two publish, the third tolerates and says so —
    // so the three run side by side.
    //
    // A teardown project runs once the project it belongs to is done, whether
    // or not its tests passed. It is not divided between CI machines: each
    // runs all of it, against its own server. Running one file of the main
    // project runs this after it too; `--no-deps` leaves it out.
    //
    // A teardown and nothing else. These cannot be a project that *depends* on
    // `chromium` instead, though the ordering would read the same: Playwright
    // applies neither `--grep` nor `--shard` to a dependency, so the shard
    // carrying such a project runs the whole main project unfiltered — which
    // on CI meant one shard running all 889 tests, `@pixel` ones included,
    // and failing on the committed pixels that only their own machine can
    // match (ticket 05). Nor can one teardown chain to another: each waits for
    // the other, and neither ever runs.
    {
      name: 'runs-last',
      use: { ...devices['Desktop Chrome'] },
      testMatch: RUNS_LAST,
    },
  ],
  webServer: {
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
});
