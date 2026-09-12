import { defineConfig, devices } from '@playwright/test';

/**
 * The suite runs against the **built** application, never the dev server: dev
 * skips minification, prerendering and the production font pipeline, so a
 * green dev run proves nothing about what visitors receive.
 *
 * Port 3100 keeps out of the way of a dev server on 3000 and the baseline
 * capture's static server on 4321.
 *
 * Chromium is pinned to the same Playwright version the visual baselines were
 * captured with (see `tests/baselines/README.md`); bumping it changes text
 * rasterisation and invalidates the comparison.
 */
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    // Also handed to the build, which reads it to work out the origin
    // canonical URLs point at when nothing else says (src/lib/environment.ts).
    env: { PORT: String(PORT) },
    url: baseURL,
    // Never reuse: a server already listening is either a dev server or a
    // stale build, and both would make the run a lie.
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
