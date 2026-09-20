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
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { ADMIN_PATH, PAGES_EDITOR, logInAs, logInByApi, reachesVisitors } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/start-page';

/** A word as the CMS holds it: its Arabic and its English. */
type Words = { ar: string; en?: string | null };
type Step = { label: Words; title: Words; text: Words; markedOut: boolean };
type StartPage = {
  languages: string[];
  hero: { eyebrow: Words; title: Words; lead: Words; primaryLabel: Words; secondaryLabel: Words };
  trustStrip: { shows: boolean };
  steps: { shows: boolean; eyebrow: Words; heading: Words; steps: Step[] };
  questions: { eyebrow: Words; heading: Words };
  freeTool: { shows: boolean; eyebrow: Words; heading: Words; text: Words; linkLabel: Words };
};

const arabic = (words: string): Words => ({ ar: words, en: null });

/** The start page's entry as published. */
async function published(editor: APIRequestContext): Promise<StartPage> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

/** The entry's fields alone, ready to be sent back: no ids, no dates. */
function fields(page: StartPage) {
  const { languages, hero, trustStrip, steps, questions, freeTool } = page;
  const rows = steps.steps.map(({ label, title, text, markedOut }) => ({ label, title, text, markedOut }));
  return { languages, hero, trustStrip, steps: { ...steps, steps: rows }, questions, freeTool };
}

/** Saves the entry as the admin's Save Draft or Publish changes would. */
function save(editor: APIRequestContext, data: object, status: 'draft' | 'published') {
  return editor.post(`${GLOBAL}${status === 'draft' ? '?draft=true' : ''}`, { data: { ...data, _status: status } });
}

/** Puts the entry's latest version back to what is published, so a test's draft is not left waiting. */
async function discardDraft(editor: APIRequestContext): Promise<void> {
  const response = await editor.get(`${GLOBAL}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1&depth=0`);
  expect(response.ok()).toBe(true);
  const [latest] = (await response.json()).docs;
  const restored = await editor.post(`${GLOBAL}/versions/${latest.id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
}

async function visitorHtml(request: APIRequestContext): Promise<string> {
  return (await request.get('/start')).text();
}

/** Opens the site in preview at the start page, as the admin's Preview button does. */
async function preview(page: Page): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent('/start')}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('the start page shows the words the CMS has published, in Arabic only', async ({ page, request }) => {
  await logInByApi(page.request, PAGES_EDITOR);
  const entry = await published(page.request);
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
}) => {
  await logInByApi(page.request, PAGES_EDITOR);
  const entry = await published(page.request);
  const title = `${entry.hero.title.ar} — مسودة`;
  const fourth: Step = {
    label: arabic('متابعة'),
    title: arabic('مراجعة بعد الشهر الأول'),
    text: arabic('نجلس مع الأطراف الثلاثة بعد شهر من التشغيل.'),
    markedOut: false,
  };
  const draft = fields(entry);

  try {
    const saved = await save(
      page.request,
      {
        ...draft,
        hero: { ...draft.hero, title: { ...draft.hero.title, ar: title } },
        steps: { ...draft.steps, steps: [...draft.steps.steps, fourth] },
        freeTool: { ...draft.freeTool, shows: false },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);
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
  } finally {
    await discardDraft(page.request);
  }
});

test('a section links land on has no switch to hide it; a section that can hide has one', async ({ page }) => {
  await logInAs(page, PAGES_EDITOR);
  await page.goto(`${ADMIN_PATH}/globals/start-page`);
  const tab = (name: string) => page.getByRole('button', { name, exact: true });

  await tab('Steps').click();
  await expect(page.getByLabel('Shows on the page')).toBeVisible();

  await tab('Questions').click();
  await expect(page.getByText(/Always shows/)).toBeVisible();
  await expect(page.getByLabel('Shows on the page')).toHaveCount(0);
});

test('words too long for their place, a list too long or empty, and an English page with no English are refused', async ({
  page,
}) => {
  await logInByApi(page.request, PAGES_EDITOR);
  const entry = fields(await published(page.request));
  const step: Step = { label: arabic('خطوة'), title: arabic('خطوة إضافية'), text: arabic('نص خطوة إضافية.'), markedOut: false };

  const refused = {
    'a heading longer than its place': { ...entry, hero: { ...entry.hero, title: arabic('ع'.repeat(71)) } },
    'seven steps': { ...entry, steps: { ...entry.steps, steps: Array.from({ length: 7 }, () => step) } },
    'no steps': { ...entry, steps: { ...entry.steps, steps: [] } },
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
    'no Arabic': { ...entry, languages: ['en'] },
    'an empty Arabic heading': { ...entry, hero: { ...entry.hero, title: arabic('') } },
    'an Arabic heading of spaces': { ...entry, hero: { ...entry.hero, title: arabic('   ') } },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await save(page.request, data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(fields(await published(page.request))).toEqual(entry);
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
}) => {
  await logInByApi(page.request, PAGES_EDITOR);
  const entry = await published(page.request);

  try {
    // A visitor's Arabic page is meant to come back exactly as it was, which
    // leaves nothing in it to wait for — and a publish is in nobody's page the
    // moment it is saved (`cms.ts`). So the English is published together with a
    // space at the end of the hero's paragraph, which is in the HTML and drawn
    // nowhere, and the page waited for is the one that space arrives in: built
    // from this publish, not from before it.
    const english = withEnglish(fields(entry));
    const lead = `${entry.hero.lead.ar} `;
    const response = await save(
      page.request,
      { ...english, hero: { ...english.hero, lead: { ...english.hero.lead, ar: lead } }, languages: ['ar', 'en'] },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    const now = await published(page.request);
    expect(now.languages).toEqual(['ar', 'en']);
    expect(now.hero.title).toEqual({ ar: entry.hero.title.ar, en: 'English' });

    const html = await reachesVisitors(request, '/start', `${lead}</p>`, 'the start page published in English');
    expect(html).toContain(entry.hero.title.ar);
    expect(html).not.toContain('>English<');
  } finally {
    const restored = await save(page.request, fields(entry), 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test('a change published in the admin reaches visitors', async ({ page, request }) => {
  await logInAs(page, PAGES_EDITOR);
  const entry = await published(page.request);
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.hero.lead.ar} `;

  try {
    await page.goto(`${ADMIN_PATH}/globals/start-page`);
    // The admin reopens the tab an editor last had open, so the hero's is chosen.
    await page.getByRole('button', { name: 'Hero', exact: true }).click();
    // The Arabic box is the first one after the paragraph's heading.
    const heading = page.getByRole('heading', { name: 'Paragraph under the heading', exact: true });
    await heading.locator('xpath=following::textarea[1]').fill(lead);
    await page.getByRole('button', { name: 'Publish changes' }).click();
    await expect(page.getByText(/successfully/).first()).toBeVisible();

    await reachesVisitors(request, '/start', `${lead}</p>`, "the start page's reworded paragraph");
    expect((await published(page.request)).hero.lead.ar).toBe(lead);
  } finally {
    const restored = await save(page.request, fields(entry), 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
