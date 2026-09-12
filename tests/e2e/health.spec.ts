/**
 * Every page loads clean. Kept from the first page onward so that the run that
 * introduces a broken asset or a hydration error is the run that fails, rather
 * than one months later where the cause is buried.
 */
import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

for (const route of ROUTES) {
  test(`${route.path} loads with no console errors and no failed requests`, async ({ page }) => {
    const problems: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
    page.on('requestfailed', (request) => {
      problems.push(`request failed: ${request.url()} ${request.failure()?.errorText}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
    });

    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);

    expect(problems).toEqual([]);
  });
}
