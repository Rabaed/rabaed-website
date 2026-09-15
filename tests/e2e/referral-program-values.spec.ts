/**
 * The Referral Program values in the CMS (ticket 56): Ahmed changes the payout
 * and the client discount in one place, every mention on the site follows —
 * the referral page, its search title and the FAQ answers that name them — and
 * the admin warns, without stopping him, until the Referral Terms he publishes
 * say the same. The terms are never rewritten for him (ADR-0008).
 *
 * Publishing a value changes what the referral page's and the FAQs' suites
 * read, so this suite runs after everything else (`playwright.config.ts`), and
 * puts the values and the terms back as they were whether it passes or not.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { ADMIN_PATH, REFERRAL_VALUES_EDITOR, legalDocument, logInByApi } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/referral-program';

type Amounts = { payoutRiyals: number; clientDiscountPercent: number };

/** What the site launched with, and the Referral Terms state. */
const LAUNCH: Amounts = { payoutRiyals: 2000, clientDiscountPercent: 10 };

async function publishedAmounts(editor: APIRequestContext): Promise<Amounts> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  const { payoutRiyals, clientDiscountPercent } = await response.json();
  return { payoutRiyals, clientDiscountPercent };
}

function saveAmounts(editor: APIRequestContext, amounts: object, status: 'draft' | 'published') {
  return editor.post(`${GLOBAL}${status === 'draft' ? '?draft=true' : ''}`, { data: { ...amounts, _status: status } });
}

/** The words a visitor reads on a page, as the browser lays them out. */
async function visibleText(page: Page, path: string): Promise<string> {
  await page.goto(path);
  return page.evaluate(() => document.body.innerText);
}

/** The warning, wherever the admin shows it. */
const warning = (page: Page) => page.getByRole('alert').filter({ hasText: 'do not state the Referral Program values' });

test.beforeEach(async ({ page }) => {
  await logInByApi(page.request, REFERRAL_VALUES_EDITOR);
});

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('the values the site launched with are the ones the Referral Terms state, so nothing warns', async ({ page }) => {
  expect(await publishedAmounts(page.request)).toEqual(LAUNCH);

  await page.goto(ADMIN_PATH);
  await expect(page.getByRole('heading', { name: /Collections|المجموعات/ }).first()).toBeVisible();
  await expect(warning(page)).toHaveCount(0);
});

test('a value changed once changes every mention, and the admin warns until the Referral Terms say the same', async ({
  page,
  request,
}) => {
  const terms = await legalDocument(page.request, 'referral-terms');
  const privacy = await legalDocument(page.request, 'privacy');

  try {
    const changed = await saveAmounts(page.request, { payoutRiyals: 2500, clientDiscountPercent: 15 }, 'published');
    // Published although the terms still state the old values: the warning
    // never blocks.
    expect(changed.ok(), await changed.text()).toBe(true);

    await expect.poll(async () => (await request.get('/referral')).text()).toContain('أحِل مشروعاً واحداً. اكسب 2,500 ريال.');

    const html = await (await request.get('/referral')).text();
    expect(html).toContain('<title>ربائد · برنامج الإحالة — 2,500 ريال عن كل مشروع</title>');

    await page.goto('/referral');
    await expect(page.locator('.phero .pstat b')).toHaveText(['2,500 ريال', '15%', 'بلا حد']);
    await expect(page.locator('.phero .pstat b .mono')).toHaveText(['2,500', '15%']);
    await expect(page.locator('.phero p.lead')).toContainText('واحصل على 2,500 ريال عن كل مشروع');
    await expect(page.locator('#how .s p').nth(1)).toContainText('خصم 15%');
    await expect(page.locator('#how .s p').nth(3)).toContainText('تُحوَّل 2,500 ريال');
    await expect(page.locator('#offer .lead-block b')).toHaveText('2,500 ريال صافية عن كل مشروع');
    await expect(page.locator('#offer h3')).toHaveText(['2,500 ريال صافية', 'خصم 15%']);
    await expect(page.locator('#signup .ben-row li').last()).toHaveText('✓2,500 ريال صافية عن كل مشروع، بلا حد أقصى');
    // An FAQ answer that names the payout.
    await expect(page.locator('#faq')).toContainText('تُحتسب إحالة جديدة بـ 2,500 ريال أخرى.');

    const text = await visibleText(page, '/referral');
    for (const old of ['2,000', '10%']) expect(text, old).not.toContain(old);

    // The terms keep their own words.
    expect(await visibleText(page, '/referral-terms')).toContain('2,000 ريال سعودي');

    // The warning: on the dashboard, on the values and on the Referral Terms —
    // and not on the other legal documents.
    for (const path of [ADMIN_PATH, `${ADMIN_PATH}/globals/referral-program`, `${ADMIN_PATH}/collections/legal-documents/${terms.id}`]) {
      await page.goto(path);
      await expect(warning(page), path).toBeVisible();
      await expect(warning(page), path).toContainText('2,500');
      await expect(warning(page), path).toContainText('15%');
    }
    await page.goto(`${ADMIN_PATH}/collections/legal-documents/${privacy.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(privacy.title);
    await expect(warning(page)).toHaveCount(0);

    // The terms published stating the new payout alone still leave the
    // discount unstated.
    const statingPayout = JSON.parse(JSON.stringify(terms.clauses).replaceAll('2,000', '2,500'));
    const payoutOnly = await page.request.patch(`/api/legal-documents/${terms.id}`, { data: { clauses: statingPayout, _status: 'published' } });
    expect(payoutOnly.ok(), await payoutOnly.text()).toBe(true);
    await page.goto(ADMIN_PATH);
    await expect(warning(page)).toContainText('15%');
    await expect(warning(page)).not.toContainText('2,500');

    // Both stated: no warning anywhere.
    const statingBoth = JSON.parse(JSON.stringify(statingPayout).replaceAll('10%', '15%'));
    const both = await page.request.patch(`/api/legal-documents/${terms.id}`, { data: { clauses: statingBoth, _status: 'published' } });
    expect(both.ok(), await both.text()).toBe(true);
    for (const path of [ADMIN_PATH, `${ADMIN_PATH}/globals/referral-program`, `${ADMIN_PATH}/collections/legal-documents/${terms.id}`]) {
      await page.goto(path);
      await expect(page.locator('body')).toContainText(/Referral|الإحالة|Collections/);
      await expect(warning(page), path).toHaveCount(0);
    }
  } finally {
    const values = await saveAmounts(page.request, LAUNCH, 'published');
    expect(values.ok(), await values.text()).toBe(true);
    const restored = await page.request.patch(`/api/legal-documents/${terms.id}`, { data: { clauses: terms.clauses, _status: 'published' } });
    expect(restored.ok(), await restored.text()).toBe(true);
    await expect.poll(async () => (await request.get('/referral')).text()).toContain('أحِل مشروعاً واحداً. اكسب 2,000 ريال.');
  }
});

test('a value is a whole amount the page can write, or it is refused', async ({ page }) => {
  const refused: Record<string, object> = {
    'no payout': { payoutRiyals: 0, clientDiscountPercent: 10 },
    'a negative payout': { payoutRiyals: -2000, clientDiscountPercent: 10 },
    'a payout in fractions': { payoutRiyals: 2000.5, clientDiscountPercent: 10 },
    'a discount over the whole price': { payoutRiyals: 2000, clientDiscountPercent: 101 },
    'no discount given': { payoutRiyals: 2000, clientDiscountPercent: null },
  };
  for (const [what, amounts] of Object.entries(refused)) {
    const response = await saveAmounts(page.request, amounts, 'published');
    expect(response.status(), what).toBe(400);
  }
  expect(await publishedAmounts(page.request)).toEqual(LAUNCH);
});

test('a value saved as a draft is previewed on the page and in its answers, and neither reaches a visitor nor warns', async ({
  page,
  request,
}) => {
  try {
    const saved = await saveAmounts(page.request, { payoutRiyals: 3000, clientDiscountPercent: 10 }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.goto(`/api/preview?path=${encodeURIComponent('/referral')}`);
    await expect(page.getByRole('status')).toContainText('معاينة');
    await expect(page.locator('.phero h1')).toHaveText('أحِل مشروعاً واحداً. اكسب 3,000 ريال.');
    await expect(page.locator('#faq')).toContainText('تُحتسب إحالة جديدة بـ 3,000 ريال أخرى.');

    expect(await (await request.get('/referral')).text()).toContain('أحِل مشروعاً واحداً. اكسب 2,000 ريال.');
    await page.request.get('/api/preview/exit');
    await page.goto(ADMIN_PATH);
    await expect(page.getByRole('heading', { name: /Collections|المجموعات/ }).first()).toBeVisible();
    await expect(warning(page)).toHaveCount(0);
  } finally {
    const response = await page.request.get(`${GLOBAL}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1&depth=0`);
    const [latest] = (await response.json()).docs;
    const restored = await page.request.post(`${GLOBAL}/versions/${latest.id}?draft=true`);
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
