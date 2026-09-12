/**
 * The site must be invisible to search engines until launch, and invisible in
 * every preview deployment forever (spec: user stories 62 and 63). Getting
 * this wrong is not recoverable on the timescale that matters — an indexed
 * unfinished page is out of our hands once it is crawled.
 *
 * The test environment is a non-production environment, so this asserts the
 * blocked case. Unblocking production is ticket 39's single deliberate step.
 */
import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

for (const route of ROUTES) {
  test(`${route.path} is noindex outside production`, async ({ page }) => {
    const response = await page.goto(route.path);

    // The header covers responses a <meta> tag cannot, and is what a crawler
    // fetching with HEAD sees.
    expect(response?.headers()['x-robots-tag']).toContain('noindex');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  });
}
