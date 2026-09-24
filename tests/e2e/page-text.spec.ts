/**
 * Page text in the CMS (ticket 53), proven on the start page: Ahmed rewords a
 * section, adds a step, hides a section, previews the page and publishes it —
 * and the CMS refuses what the design cannot carry, and an English page that
 * has no English.
 *
 * The start page's words and pictures are checked by its own suites running
 * beside this one, so nothing here publishes a change they could notice.
 * Rewording, adding and hiding are saved as drafts and checked in the editor's
 * preview, which visitors never see. The one change published is a space at
 * the end of the hero's paragraph, which no screenshot shows and no suite
 * reads; the refused changes are never saved at all.
 *
 * The tests sign in as an editor of their own and run one at a time, and what
 * they change is put back when each ends (`entries.ts`).
 */
import type { APIRequestContext } from '@playwright/test';
import { reachesVisitors, outsideTheHeader } from './cms';
import { test, expect, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

/** A word as the CMS holds it: its Arabic and its English. */
type Words = Entry<'start-page'>['hero']['title'];
type Step = Entry<'start-page'>['steps']['steps'][number];

const arabic = (words: string): Words => ({ ar: words, en: null });

async function visitorHtml(request: APIRequestContext): Promise<string> {
  return (await request.get('/start')).text();
}

test('the start page shows the words the CMS has published, in Arabic only', async ({ page, request, cms }) => {
  const start = cms.entry('start-page');
  const entry = await start.published();
  const html = await visitorHtml(request);

  expect(entry.languages).toEqual(['ar']);
  for (const words of [entry.hero.title, entry.hero.lead, entry.steps.heading, entry.freeTool.heading, entry.questions.heading]) {
    expect(html).toContain(words.ar);
  }
  for (const step of entry.steps.steps) expect(html).toContain(step.title.ar);
});

test('a reworded heading, a fourth step and a hidden section are previewed, and never reach a visitor', async ({
  page,
  request,
  cms,
}) => {
  const start = cms.entry('start-page');
  const entry = await start.published();
  const title = `${entry.hero.title.ar} — مسودة`;
  const fourth: Step = {
    label: arabic('متابعة'),
    title: arabic('مراجعة بعد الشهر الأول'),
    text: arabic('نجلس مع الأطراف الثلاثة بعد شهر من التشغيل.'),
    markedOut: false,
  };

  await start.draft({
    ...entry,
    hero: { ...entry.hero, title: { ...entry.hero.title, ar: title } },
    steps: { ...entry.steps, steps: [...entry.steps.steps, fourth] },
    freeTool: { ...entry.freeTool, shows: false },
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/start');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  const cards = page.locator('#start .s');
  await expect(cards.locator('h3')).toHaveText([...entry.steps.steps.map((step) => step.title.ar), fourth.title.ar]);
  await expect(cards.last().locator('.k')).toHaveText(`04 · ${fourth.label.ar}`);
  await expect(page.locator('.free')).toHaveCount(0);

  // Four steps sit in two rows of two at desktop widths, not three and one alone.
  const boxes = await cards.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  expect(boxes[0].y).toBe(boxes[1].y);
  expect(boxes[2].y).toBe(boxes[3].y);
  expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
  expect(boxes[0].width).toBeCloseTo(boxes[2].width, 0);

  // On a phone they stand one under another, as three do today.
  await page.setViewportSize({ width: 390, height: 844 });
  const narrow = await cards.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  expect(new Set(narrow.map((box) => Math.round(box.x))).size).toBe(1);
  for (let index = 1; index < narrow.length; index += 1) expect(narrow[index].y).toBeGreaterThan(narrow[index - 1].y);

  const html = await visitorHtml(request);
  expect(html).not.toContain(title);
  expect(html).not.toContain(fourth.title.ar);
  expect(html).toContain(entry.freeTool.heading.ar);
});

test('a section links land on has no switch to hide it; a section that can hide has one', async ({ page, cms }) => {
  const admin = await cms.openInAdmin('start-page');

  await admin.openSection('Steps');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();

  await admin.openSection('Questions');
  await expect(page.getByText(/Always shows/)).toBeVisible();
  await expect(page.getByLabel('Shows on the page')).toHaveCount(0);
});

test('words too long for their place, a list too long or empty, and an English page with no English are refused', async ({
  page,
  cms,
}) => {
  const start = cms.entry('start-page');
  const entry = await start.published();
  const step: Step = { label: arabic('خطوة'), title: arabic('خطوة إضافية'), text: arabic('نص خطوة إضافية.'), markedOut: false };

  const refused: Record<string, Entry<'start-page'>> = {
    'a heading longer than its place': { ...entry, hero: { ...entry.hero, title: arabic('ع'.repeat(71)) } },
    'seven steps': { ...entry, steps: { ...entry.steps, steps: Array.from({ length: 7 }, () => step) } },
    'no steps': { ...entry, steps: { ...entry.steps, steps: [] } },
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
    'no Arabic': { ...entry, languages: ['en'] },
    'an empty Arabic heading': { ...entry, hero: { ...entry.hero, title: arabic('') } },
    'an Arabic heading of spaces': { ...entry, hero: { ...entry.hero, title: arabic('   ') } },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await start.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(await start.published()).toEqual(entry);
});

/** Every word of an entry given English of its own. */
function withEnglish<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withEnglish) as T;
  if (value && typeof value === 'object') {
    if ('ar' in value) return { ...value, en: 'English' };
    return Object.fromEntries(Object.entries(value).map(([key, each]) => [key, withEnglish(each)])) as T;
  }
  return value;
}

test('a page with every word written in English is published in English, and its Arabic page is unchanged', async ({
  page,
  request,
  cms,
}) => {
  const start = cms.entry('start-page');
  const entry = await start.published();

  // A visitor's Arabic page is meant to come back exactly as it was, which
  // leaves nothing in it to wait for — and a publish is in nobody's page the
  // moment it is saved (`cms.ts`). So the English is published together with a
  // space at the end of the hero's paragraph, which is in the HTML and drawn
  // nowhere, and the page waited for is the one that space arrives in: built
  // from this publish, not from before it.
  const english = withEnglish(entry);
  const lead = `${entry.hero.lead.ar} `;
  await start.publish({
    ...english,
    hero: { ...english.hero, lead: { ...english.hero.lead, ar: lead } },
    languages: ['ar', 'en'],
  });
  const now = await start.published();
  expect(now.languages).toEqual(['ar', 'en']);
  expect(now.hero.title).toEqual({ ar: entry.hero.title.ar, en: 'English' });

  const html = await reachesVisitors(request, '/start', `${lead}</p>`, 'the start page published in English');
  expect(html).toContain(entry.hero.title.ar);
  expect(outsideTheHeader(html)).not.toContain('>English<');
});

test('a change published in the admin reaches visitors', async ({ page, request, cms }) => {
  const start = cms.entry('start-page');
  const entry = await start.published();
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.hero.lead.ar} `;

  // Published in the admin, and put back when the test ends like any change.
  const admin = await cms.openInAdmin('start-page');
  // The admin reopens the tab an editor last had open, so the hero's is chosen.
  await admin.openSection('Hero');
  // The Arabic box is the first one after the paragraph's heading.
  const heading = page.getByRole('heading', { name: 'Paragraph under the heading', exact: true });
  await heading.locator('xpath=following::textarea[1]').fill(lead);
  await page.getByRole('button', { name: 'Publish changes' }).click();
  await expect(page.getByText(/successfully/).first()).toBeVisible();

  await reachesVisitors(request, '/start', `${lead}</p>`, "the start page's reworded paragraph");
  expect((await start.published()).hero.lead.ar).toBe(lead);
});
