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
/** The suites that publish what every other suite would notice, run once those are done (below). */
const RUNS_LAST = /(case-studies|referral-program-values)\.spec\.ts$/;
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
  // test the spec permits (the delay-cost formula), which opens no browser.
  // `tests/baselines` is images and has no specs for this to find.
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
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
    // page's and the FAQs' suites read (ticket 56). Neither touches what the
    // other reads, so the two run side by side. A teardown project runs once
    // the project it belongs to is done, whether or not its tests passed. It
    // is not divided between CI machines: each runs all of it, against its own
    // server. Running one file of the main project runs this after it too;
    // `--no-deps` leaves it out.
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
