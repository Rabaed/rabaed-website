/**
 * ADR-0001 in executable form: Next.js was chosen over Astro on the promise
 * that the complete document arrives in the first server response. That is a
 * promise a React codebase can break silently — one `'use client'` in the
 * wrong place and the text is gone from the HTML while the page still looks
 * right in a browser. So it is asserted, per route, with JavaScript off.
 */
import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

test.describe('server-rendered content', () => {
  for (const route of ROUTES) {
    test(`${route.path} carries its text in the raw HTML`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status()).toBe(200);

      const html = await response.text();
      for (const phrase of route.text) {
        expect(html).toContain(phrase);
      }
    });

    test(`${route.path} renders its text with JavaScript disabled`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(route.path);

      for (const phrase of route.text) {
        await expect(page.getByText(phrase, { exact: false }).first()).toBeVisible();
      }

      await context.close();
    });
  }
});
