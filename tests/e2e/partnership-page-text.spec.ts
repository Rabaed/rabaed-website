/**
 * The partnership page's text in the CMS (ticket 55): Ahmed rewords its hero
 * and a figure, adds a mode and a stage, hides sections, previews the page and
 * publishes it — and the CMS refuses what the design cannot carry: a figure too
 * long for its card, more figures than the hero holds, a page with no modes.
 *
 * How page text works is `page-text.spec.ts`'s, on the start page. This holds
 * the partnership page's entry to it, and nothing here publishes a change the
 * partnership page's other suites, running beside it, could notice: rewording,
 * adding and hiding are drafts checked in the editor's preview, and the one
 * change published is a space at the end of the application's paragraph, which
 * no screenshot shows and no suite reads.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { PARTNERSHIP_PAGE_EDITOR, logInAs, logInByApi, openPageEntry, openSection, reachesVisitors, outsideTheHeader } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/partnership-page';

/** A word as the CMS holds it: its Arabic and its English. */
type Words = { ar: string | null; en?: string | null };
type Line = { text: Words };
type Mode = { label: Words; title: Words; text: Words; fit: Words };
type Stage = { title: Words; text: Words };
type PartnershipPage = {
  languages: string[];
  hero: {
    eyebrow: Words;
    title: Words;
    lead: Words;
    primaryLabel: Words;
    secondaryLabel: Words;
    figures: { figure: Words; label: Words }[];
  };
  idea: { shows: boolean; eyebrow: Words; heading: Words; paragraphs: Line[]; referralNote: { text: Words; linkLabel: Words } };
  audience: { shows: boolean; eyebrow: Words; heading: Words; kinds: { title: Words; text: Words }[] };
  modes: { shows: boolean; eyebrow: Words; heading: Words; modes: Mode[]; note: { before: Words; bold: Words; after: Words } };
  benefits: { shows: boolean; eyebrow: Words; heading: Words; benefits: { bold: Words; text: Words }[] };
  path: { eyebrow: Words; heading: Words; lead: Words; linkLabel: Words; stageLabel: Words; stages: Stage[] };
  questions: { shows: boolean; eyebrow: Words; heading: Words };
  apply: {
    eyebrow: Words;
    heading: Words;
    lead: Words;
    reassurances: Line[];
    responseTime: { bold: Words; text: Words };
  };
};

const arabic = (words: string): Words => ({ ar: words, en: null });

/** The partnership page's entry as published. */
async function published(editor: APIRequestContext): Promise<PartnershipPage> {
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
  return (await request.get('/partnership')).text();
}

/** Opens the site in preview at the partnership page, as the admin's Preview button does. */
async function preview(page: Page): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent('/partnership')}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

/** Where each of a row of cards sits. */
function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('the partnership page shows the words the CMS has published, every section of it, in Arabic only', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, PARTNERSHIP_PAGE_EDITOR);
  const entry = await published(page.request);
  const html = await visitorHtml(request);

  expect(entry.languages).toEqual(['ar']);
  for (const words of [
    entry.hero.title,
    entry.hero.lead,
    entry.hero.figures[2].figure,
    entry.hero.figures[0].label,
    entry.idea.heading,
    entry.idea.paragraphs[1].text,
    entry.idea.referralNote.linkLabel,
    entry.audience.heading,
    entry.audience.kinds[3].text,
    entry.modes.heading,
    entry.modes.modes[0].fit,
    entry.modes.note.bold,
    entry.modes.note.after,
    entry.benefits.heading,
    entry.benefits.benefits[7].text,
    entry.path.heading,
    entry.path.lead,
    entry.questions.heading,
    entry.apply.heading,
    entry.apply.reassurances[2].text,
    entry.apply.responseTime.bold,
    entry.apply.responseTime.text,
  ]) {
    expect(html).toContain(words.ar);
  }
  for (const stage of entry.path.stages) expect(html).toContain(stage.title.ar);
});

test('a reworded heading and figure, a fourth mode, a fifth stage and hidden sections are previewed, and never reach a visitor', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, PARTNERSHIP_PAGE_EDITOR);
  const entry = await published(page.request);
  const title = `${entry.hero.title.ar} — مسودة`;
  const figure = '12 نمطاً';
  const mode: Mode = {
    label: arabic('التجربة المشتركة'),
    title: arabic('مشروع تجريبي أولاً'),
    text: arabic('نطلق معك مشروعاً واحداً قبل أي اتفاقية.'),
    fit: arabic('مناسب لـ: المكاتب التي تريد أن ترى قبل أن تقرر.'),
  };
  const stage: Stage = { title: arabic('المراجعة بعد ستة أشهر'), text: arabic('نراجع معك النموذج ونعدّله إن لزم.') };
  const draft = fields(entry);

  try {
    const saved = await save(
      page.request,
      {
        ...draft,
        hero: {
          ...draft.hero,
          title: { ...draft.hero.title, ar: title },
          figures: draft.hero.figures.map((each, index) => (index === 0 ? { ...each, figure: arabic(figure) } : each)),
        },
        modes: { ...draft.modes, modes: [...draft.modes.modes, mode] },
        path: { ...draft.path, stages: [...draft.path.stages, stage] },
        idea: { ...draft.idea, shows: false },
        benefits: { ...draft.benefits, shows: false },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    // Only the numerals in DM Mono, as the Reference site's figures are drawn here.
    await expect(page.locator('.phero .pstat b').first()).toHaveText(figure);
    await expect(page.locator('.phero .pstat b').first().locator('.mono')).toHaveText('12');

    const modes = page.locator('#modes .s');
    await expect(modes.locator('h3')).toHaveText([...entry.modes.modes.map((each) => each.title.ar!), mode.title.ar!]);
    await expect(modes.last().locator('.k')).toHaveText(`04 · ${mode.label.ar}`);
    const stages = page.locator('#path .tail-steps li');
    await expect(stages.locator('.ph')).toHaveText([...entry.path.stages.map((each) => each.title.ar!), stage.title.ar!]);
    await expect(stages.last().locator(':scope > b')).toHaveText(`${entry.path.stageLabel.ar} 05`);
    await expect(page.locator('#idea')).toHaveCount(0);
    await expect(page.locator('#benefits')).toHaveCount(0);

    // Four modes sit in two rows of two at desktop widths, not three and one alone.
    const wide = await boxes(page, '#modes .s');
    expect(wide[0].y).toBe(wide[1].y);
    expect(wide[2].y).toBe(wide[3].y);
    expect(wide[2].y).toBeGreaterThan(wide[0].y);
    expect(wide[0].width).toBeCloseTo(wide[2].width, 0);

    const html = await visitorHtml(request);
    expect(html).not.toContain(title);
    expect(html).not.toContain(figure);
    expect(html).not.toContain(mode.title.ar);
    expect(html).not.toContain(stage.title.ar);
    expect(html).toContain(entry.idea.heading.ar);
    expect(html).toContain(entry.benefits.heading.ar);
  } finally {
    await discardDraft(page.request);
  }
});

test('the hero and the sections links land on have no switch to hide them; every other section has one', async ({ page }) => {
  await logInAs(page, PARTNERSHIP_PAGE_EDITOR);
  await openPageEntry(page, 'partnership-page');

  for (const hideable of ['Idea', 'Who it is for', 'Modes', 'Benefits', 'Questions']) {
    await openSection(page, hideable);
    await expect(page.getByLabel('Shows on the page'), hideable).toBeVisible();
  }

  for (const linked of ['Hero', 'Path', 'Application']) {
    await openSection(page, linked);
    await expect(page.getByText(/Always shows/), linked).toBeVisible();
    await expect(page.getByLabel('Shows on the page'), linked).toHaveCount(0);
  }
});

test('a figure too long for its card, too many figures, too many or no modes, and words too long for their line are refused', async ({
  page,
}) => {
  await logInByApi(page.request, PARTNERSHIP_PAGE_EDITOR);
  const entry = fields(await published(page.request));
  const { hero, modes, path, benefits, apply } = entry;
  const withFirst = <T,>(list: T[], changed: Partial<T>) => list.map((each, index) => (index === 0 ? { ...each, ...changed } : each));

  const refused = {
    'a figure longer than its card': { ...entry, hero: { ...hero, figures: withFirst(hero.figures, { figure: arabic('ع'.repeat(15)) }) } },
    'a fifth figure': { ...entry, hero: { ...hero, figures: [...hero.figures, hero.figures[0], hero.figures[1]] } },
    'no modes': { ...entry, modes: { ...modes, modes: [] } },
    'seven modes': { ...entry, modes: { ...modes, modes: Array.from({ length: 7 }, () => modes.modes[0]) } },
    'a stage heading longer than its line': { ...entry, path: { ...path, stages: withFirst(path.stages, { title: arabic('ع'.repeat(41)) }) } },
    "a benefit's bold opening longer than its line": {
      ...entry,
      benefits: { ...benefits, benefits: withFirst(benefits.benefits, { bold: arabic('ع'.repeat(41)) }) },
    },
    'a response time longer than its pill': {
      ...entry,
      apply: { ...apply, responseTime: { ...apply.responseTime, bold: arabic('ع'.repeat(21)) } },
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

/** Every word of an entry given English of its own. */
function withEnglish<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withEnglish) as T;
  if (value && typeof value === 'object') {
    if ('ar' in value) return { ...value, en: 'English' };
    return Object.fromEntries(Object.entries(value).map(([key, each]) => [key, withEnglish(each)])) as T;
  }
  return value;
}

test('the partnership page is published in English once every word it has is written in English', async ({ page, request }) => {
  await logInByApi(page.request, PARTNERSHIP_PAGE_EDITOR);
  const entry = fields(await published(page.request));

  try {
    // A visitor's Arabic page is meant to come back exactly as it was, which
    // leaves nothing in it to wait for — and a publish is in nobody's page the
    // moment it is saved (`cms.ts`). So the English is published together with a
    // space at the end of the application's paragraph, which is in the HTML and drawn
    // nowhere, and the page waited for is the one that space arrives in: built
    // from this publish, not from before it.
    const english = withEnglish(entry);
    const lead = `${entry.apply.lead.ar} `;
    const response = await save(
      page.request,
      { ...english, apply: { ...english.apply, lead: { ...english.apply.lead, ar: lead } }, languages: ['ar', 'en'] },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    expect((await published(page.request)).languages).toEqual(['ar', 'en']);

    const html = await reachesVisitors(request, '/partnership', `${lead}</p>`, 'the partnership page published in English');
    expect(html).toContain(entry.hero.title.ar);
    expect(outsideTheHeader(html)).not.toContain('>English<');
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test('a change published reaches visitors', async ({ page, request }) => {
  await logInByApi(page.request, PARTNERSHIP_PAGE_EDITOR);
  const entry = fields(await published(page.request));
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.apply.lead.ar} `;

  try {
    const response = await save(page.request, { ...entry, apply: { ...entry.apply, lead: arabic(lead) } }, 'published');
    expect(response.ok(), await response.text()).toBe(true);
    await reachesVisitors(request, '/partnership', `${lead}</p>`, "the partnership page's reworded paragraph");
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
