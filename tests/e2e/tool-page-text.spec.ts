/**
 * The tool page's text in the CMS (ticket 54): Ahmed rewords its hero, adds a
 * step and a reason, hides sections, previews the page and publishes it — and
 * the CMS refuses what the design cannot carry: words too long for the drawing
 * of the tool, a drawing with more or fewer rows than it is drawn with, a file
 * name with Arabic in it.
 *
 * How page text works is `page-text.spec.ts`'s, on the start page. This holds
 * the tool page's entry to it, and nothing here publishes a change the tool
 * page's other suites, running beside it, could notice: rewording, adding and
 * hiding are drafts checked in the editor's preview, and the one change
 * published is a space at the end of the upsell's paragraph, which no
 * screenshot shows and no suite reads.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { TOOL_PAGE_EDITOR, logInAs, logInByApi, openPageEntry, openSection, reachesVisitors } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/tool-page';

/** A word as the CMS holds it: its Arabic and its English. */
type Words = { ar: string | null; en?: string | null };
type Line = { text: Words };
type Card = { title: Words; text: Words };
type Step = { label: Words; title: Words; text: Words; markedOut: boolean };
type ToolPage = {
  languages: string[];
  hero: {
    eyebrow: Words;
    title: Words;
    titleAccent: Words;
    lead: Words;
    primaryLabel: Words;
    secondaryLabel: Words;
    promises: Line[];
    mock: {
      project: Words;
      tiles: { figure: string; label: Words; tone: string }[];
      pours: { reference: string; name: Words; tests: { label: Words; tone: string; state: Words }[] }[];
    };
  };
  why: { shows: boolean; eyebrow: Words; heading: Words; lead: Words; cards: Card[] };
  features: {
    shows: boolean;
    eyebrow: Words;
    heading: Words;
    lead: Words;
    countdown: Card & { legend: Record<'idle' | 'warn' | 'bad' | 'info' | 'ok', Words> };
    cards: Card[];
    also: Line[];
  };
  how: { eyebrow: Words; heading: Words; lead: Words; steps: Step[] };
  privacy: {
    shows: boolean;
    eyebrow: Words;
    heading: Words;
    points: { bold: Words; text: Words }[];
    tree: { project: Words; entries: { name: string; description: Words; nested: boolean }[]; caption: Words };
  };
  requirements: { shows: boolean; eyebrow: Words; heading: Words; cards: (Card & { label: Words })[] };
  download: { eyebrow: Words; heading: Words; lead: Words; ticks: Line[]; promise: { bold: Words; text: Words } };
  questions: { shows: boolean; eyebrow: Words; heading: Words };
  upsell: {
    shows: boolean;
    eyebrow: Words;
    heading: Words;
    lead: Words;
    primaryLabel: Words;
    secondaryLabel: Words;
    adds: Line[];
    signOff: Words;
  };
};

const arabic = (words: string): Words => ({ ar: words, en: null });

/** The tool page's entry as published. */
async function published(editor: APIRequestContext): Promise<ToolPage> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

/** What the CMS adds to an entry and its list rows, which is not sent back. */
const NOT_SENT = new Set(['id', 'globalType', 'createdAt', 'updatedAt', '_status']);

/** The entry's fields alone, ready to be sent back: no ids, no dates. */
function fields<T>(value: T): T {
  if (Array.isArray(value)) return value.map(fields) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !NOT_SENT.has(key))
        .map(([key, each]) => [key, fields(each)]),
    ) as T;
  }
  return value;
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
  return (await request.get('/tool')).text();
}

/** Opens the site in preview at the tool page, as the admin's Preview button does. */
async function preview(page: Page): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent('/tool')}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

/** Where each of a row of cards sits. */
function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('the tool page shows the words the CMS has published, every section of it, in Arabic only', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, TOOL_PAGE_EDITOR);
  const entry = await published(page.request);
  const html = await visitorHtml(request);

  expect(entry.languages).toEqual(['ar']);
  const [firstPour] = entry.hero.mock.pours;
  for (const words of [
    entry.hero.title,
    entry.hero.titleAccent,
    entry.hero.promises[0].text,
    entry.hero.mock.project,
    entry.hero.mock.tiles[2].label,
    firstPour.name,
    firstPour.tests[1].state,
    entry.why.heading,
    entry.why.cards[0].title,
    entry.features.countdown.legend.info,
    entry.features.cards[0].title,
    entry.features.also[0].text,
    entry.how.heading,
    entry.privacy.heading,
    entry.privacy.points[0].bold,
    entry.privacy.tree.entries[0].description,
    entry.privacy.tree.caption,
    entry.requirements.cards[0].title,
    entry.download.heading,
    entry.download.ticks[0].text,
    entry.download.promise.bold,
    entry.questions.heading,
    entry.upsell.adds[0].text,
    entry.upsell.signOff,
  ]) {
    expect(html).toContain(words.ar);
  }
  expect(html).toContain(firstPour.reference);
  for (const step of entry.how.steps) expect(html).toContain(step.title.ar);
});

test('a reworded heading, a fourth step and reason, and hidden sections are previewed, and never reach a visitor', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, TOOL_PAGE_EDITOR);
  const entry = await published(page.request);
  const accent = `${entry.hero.titleAccent.ar} — مسودة`;
  const step: Step = {
    label: arabic('راجع السجل'),
    title: arabic('كل أسبوع'),
    text: arabic('افتح المجلد مرة في الأسبوع وراجع الاختبارات القريبة.'),
    markedOut: false,
  };
  const reason: Card = { title: arabic('الاستشاري يسأل فجأة'), text: arabic('ولا يوجد وقت للبحث عن التقرير.') };
  const draft = fields(entry);

  try {
    const saved = await save(
      page.request,
      {
        ...draft,
        hero: { ...draft.hero, titleAccent: { ...draft.hero.titleAccent, ar: accent } },
        why: { ...draft.why, cards: [...draft.why.cards, reason] },
        how: { ...draft.how, steps: [...draft.how.steps, step] },
        privacy: { ...draft.privacy, shows: false },
        upsell: { ...draft.upsell, shows: false },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(accent);

    const steps = page.locator('#how .s');
    await expect(steps.locator('h3')).toHaveText([...entry.how.steps.map((each) => each.title.ar!), step.title.ar!]);
    await expect(steps.last().locator('.k')).toHaveText(`04 · ${step.label.ar}`);
    await expect(page.locator('#why .rt-c h3')).toHaveText([...entry.why.cards.map((each) => each.title.ar!), reason.title.ar!]);
    await expect(page.locator('#why .rt-c').last().locator('.k')).toHaveText('04');
    await expect(page.locator('#data')).toHaveCount(0);
    await expect(page.locator('#up')).toHaveCount(0);

    // Four steps and four reasons each sit in two rows of two at desktop
    // widths, not three and one alone.
    for (const selector of ['#how .s', '#why .rt-c']) {
      const wide = await boxes(page, selector);
      expect(wide[0].y, selector).toBe(wide[1].y);
      expect(wide[2].y, selector).toBe(wide[3].y);
      expect(wide[2].y, selector).toBeGreaterThan(wide[0].y);
      expect(wide[0].width, selector).toBeCloseTo(wide[2].width, 0);
    }

    const html = await visitorHtml(request);
    expect(html).not.toContain(accent);
    expect(html).not.toContain(step.title.ar);
    expect(html).not.toContain(reason.title.ar);
    expect(html).toContain(entry.privacy.heading.ar);
    expect(html).toContain(entry.upsell.signOff.ar);
  } finally {
    await discardDraft(page.request);
  }
});

test('the sections the hero lands on have no switch to hide them; a section that can hide has one', async ({ page }) => {
  await logInAs(page, TOOL_PAGE_EDITOR);
  await openPageEntry(page, 'tool-page');

  await openSection(page, 'Why');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();

  for (const linked of ['How it works', 'Download']) {
    await openSection(page, linked);
    await expect(page.getByText(/Always shows/), linked).toBeVisible();
    await expect(page.getByLabel('Shows on the page'), linked).toHaveCount(0);
  }
});

test('words too long for the drawing, a drawing redrawn, a list too long or empty, and a broken file name are refused', async ({
  page,
}) => {
  await logInByApi(page.request, TOOL_PAGE_EDITOR);
  const entry = fields(await published(page.request));
  const { mock } = entry.hero;
  const step: Step = { label: arabic('خطوة'), title: arabic('خطوة إضافية'), text: arabic('نص خطوة إضافية.'), markedOut: false };
  const withMock = (changed: Partial<typeof mock>) => ({ ...entry, hero: { ...entry.hero, mock: { ...mock, ...changed } } });
  const withPoint = (text: string) => ({
    ...entry,
    privacy: { ...entry.privacy, points: [{ ...entry.privacy.points[0], text: arabic(text) }, ...entry.privacy.points.slice(1)] },
  });

  const refused = {
    'a tile label longer than its tile': withMock({ tiles: mock.tiles.map((tile, index) => (index === 0 ? { ...tile, label: arabic('ع'.repeat(17)) } : tile)) }),
    'a fourth tile': withMock({ tiles: [...mock.tiles, mock.tiles[0]] }),
    'one pour': withMock({ pours: mock.pours.slice(0, 1) }),
    'a pour with a third test': withMock({ pours: mock.pours.map((pour) => ({ ...pour, tests: [...pour.tests, pour.tests[0]] })) }),
    'seven steps': { ...entry, how: { ...entry.how, steps: Array.from({ length: 7 }, () => step) } },
    'no reasons': { ...entry, why: { ...entry.why, cards: [] } },
    'a Latin name left open': withPoint('`concrete_db.json تقرؤه وتنسخه.'),
    'Arabic between the marks of a Latin name': withPoint('`ملف السجل` تقرؤه وتنسخه.'),
    'Arabic in a file name': {
      ...entry,
      privacy: { ...entry.privacy, tree: { ...entry.privacy.tree, entries: [{ ...entry.privacy.tree.entries[0], name: 'السجل.json' }] } },
    },
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await save(page.request, data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(fields(await published(page.request))).toEqual(entry);
});

/** Every word of an entry that has Arabic given English of its own; a word left empty stays empty. */
function withEnglish<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withEnglish) as T;
  if (value && typeof value === 'object') {
    if ('ar' in value) return value.ar ? { ...value, en: 'English' } : value;
    return Object.fromEntries(Object.entries(value).map(([key, each]) => [key, withEnglish(each)])) as T;
  }
  return value;
}

test('the tool page is published in English once every word it has is written in English', async ({ page, request }) => {
  await logInByApi(page.request, TOOL_PAGE_EDITOR);
  const entry = fields(await published(page.request));

  try {
    // The nested files in the folder tree have no description in either
    // language, and that is no reason to refuse the English.
    // A visitor's Arabic page is meant to come back exactly as it was, which
    // leaves nothing in it to wait for — and a publish is in nobody's page the
    // moment it is saved (`cms.ts`). So the English is published together with a
    // space at the end of the upsell's paragraph, which is in the HTML and drawn
    // nowhere, and the page waited for is the one that space arrives in: built
    // from this publish, not from before it.
    const english = withEnglish(entry);
    const lead = `${entry.upsell.lead.ar} `;
    const response = await save(
      page.request,
      { ...english, upsell: { ...english.upsell, lead: { ...english.upsell.lead, ar: lead } }, languages: ['ar', 'en'] },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    expect((await published(page.request)).languages).toEqual(['ar', 'en']);

    const html = await reachesVisitors(request, '/tool', `${lead}</p>`, 'the tool page published in English');
    expect(html).toContain(entry.hero.title.ar);
    expect(html).not.toContain('>English<');
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test('a change published reaches visitors', async ({ page, request }) => {
  await logInByApi(page.request, TOOL_PAGE_EDITOR);
  const entry = fields(await published(page.request));
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.upsell.lead.ar} `;

  try {
    const response = await save(page.request, { ...entry, upsell: { ...entry.upsell, lead: arabic(lead) } }, 'published');
    expect(response.ok(), await response.text()).toBe(true);
    await reachesVisitors(request, '/tool', `${lead}</p>`, "the tool page's reworded paragraph");
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
