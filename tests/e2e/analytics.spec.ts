/**
 * What the site measures, and what it does not (ticket 34).
 *
 * The two measurement scripts load on the production deployment alone
 * (`src/lib/environment.ts`), so what this build can be held to is that they
 * are absent here and that nothing is asked of an origin that has none of
 * them — the same division ticket 03 made for indexing, where the suite
 * proves the blocked state and the deployment proves the other one.
 *
 * The events are a different matter: they are raised everywhere and go
 * nowhere when no script is listening, so they can be read here. These tests
 * stand where the script would and collect what it would have sent — which is
 * the site's own behaviour, not Vercel's.
 */
import { test, expect, type Page } from '@playwright/test';
import { uniqueApplicant } from './forms';

/** Both scripts and both intakes are served from the deployment's own origin, under this path. */
const FROM_VERCEL = /_vercel\/(insights|speed-insights)/;

/** One event, as the script receives it. */
type Event = { name: string; data?: Record<string, unknown> };

/**
 * Stands in for the measurement script, from before the page's own code runs:
 * `track()` hands an event to `window.va`, which is what the script defines,
 * and this keeps them instead.
 */
async function eventsRaisedOn(page: Page): Promise<() => Promise<Event[]>> {
  await page.addInitScript(() => {
    const raised: Event[] = [];
    Object.assign(window, {
      __raised: raised,
      va: (kind: string, event: Event) => {
        if (kind === 'event') raised.push(event);
      },
    });
  });
  return () => page.evaluate(() => (window as unknown as { __raised?: Event[] }).__raised ?? []);
}

test('the pages ask for no measurement script, and send nothing, where there is nothing to receive it', async ({ page }) => {
  const asked: string[] = [];
  page.on('request', (request) => {
    if (FROM_VERCEL.test(request.url())) asked.push(request.url());
  });

  for (const path of ['/', '/product']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    expect(await page.content(), path).not.toMatch(FROM_VERCEL);
  }
  expect(asked).toEqual([]);
});

/** The three assistants the spec names, each arriving the way it does. */
const SENT_BY = [
  {
    assistant: 'chatgpt',
    how: 'the address it marks a link with',
    open: (page: Page) => page.goto('/?utm_source=chatgpt.com'),
  },
  {
    assistant: 'perplexity',
    how: 'the page it came from',
    open: (page: Page) => page.goto('/', { referer: 'https://www.perplexity.ai/search?q=rabaed' }),
  },
  {
    assistant: 'claude',
    how: 'the page it came from',
    open: (page: Page) => page.goto('/product', { referer: 'https://claude.ai/chat/2f1a' }),
  },
] as const;

for (const { assistant, how, open } of SENT_BY) {
  test(`a visit ${assistant} sent is counted, by ${how}`, async ({ page }) => {
    const raised = await eventsRaisedOn(page);
    await open(page);

    await expect.poll(raised, { message: `the visit ${assistant} sent was not counted` }).toEqual([
      { name: 'ai-referral', data: { assistant } },
    ]);
  });
}

test('a visit nobody sent, and one a search engine sent, are counted as neither', async ({ page }) => {
  const raised = await eventsRaisedOn(page);

  await page.goto('/');
  await page.goto('/', { referer: 'https://www.google.com/' });
  await page.goto('/?utm_source=newsletter');

  // Waiting first, so that an event raised late is still caught.
  await page.waitForLoadState('networkidle');
  expect(await raised()).toEqual([]);
});

/** The demo request form, as `form-submission.spec.ts` fills it in. */
const DEMO_FORM = 'احجز عرضاً حياً على مشروعك';
const DEMO_BUTTON = 'احجز عرضاً حياً';
const RECEIVED = 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.';
const REFUSED = 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.';

async function fillDemoRequest(page: Page, email: string) {
  const form = page.getByRole('form', { name: DEMO_FORM });
  await form.getByLabel('الاسم الكامل').fill('سارة القحطاني');
  await form.getByLabel('البريد الإلكتروني').fill(email);
  await form.getByLabel('دورك في المشروع').selectOption('owner');
  await form.getByLabel('رقم الجوال').fill('0500000000');
  return form;
}

test('a request the server stored is counted, under the name of the form it came from', async ({ page }) => {
  const raised = await eventsRaisedOn(page);
  const { email, ip } = uniqueApplicant('analytics-demo');
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip });

  await page.goto('/', { waitUntil: 'networkidle' });
  const form = await fillDemoRequest(page, email);
  await form.getByRole('button', { name: DEMO_BUTTON }).click();
  await expect(form.getByRole('status')).toHaveText(RECEIVED);

  expect(await raised()).toEqual([{ name: 'demo-request' }]);
});

test('a request the server refused is counted as nothing, because what is counted is what it kept', async ({ page }) => {
  const raised = await eventsRaisedOn(page);
  const { email, ip } = uniqueApplicant('analytics-refused');
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip });

  await page.goto('/', { waitUntil: 'networkidle' });
  const form = await fillDemoRequest(page, email);
  // The hidden trap, filled the way a bot fills every field.
  await form.locator('textarea[name="website"]').fill('https://spam.example', { force: true });
  await form.getByRole('button', { name: DEMO_BUTTON }).click();

  await expect(form.getByRole('alert')).toHaveText(REFUSED);
  expect(await raised()).toEqual([]);
});
