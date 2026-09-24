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
 * The tests sign in as an editor of their own and run one at a time, and what
 * they change is put back when each ends (`entries.ts`).
 */
import type { APIRequestContext, Page } from '@playwright/test';
import { reachesVisitors, outsideTheHeader } from './cms';
import { test, expect, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

type Partnership = Entry<'partnership-page'>;
/** A word as the CMS holds it: its Arabic and its English. */
type Words = Partnership['hero']['title'];
type Mode = Partnership['modes']['modes'][number];
type Stage = Partnership['path']['stages'][number];

const arabic = (words: string): Words => ({ ar: words, en: null });

async function visitorHtml(request: APIRequestContext): Promise<string> {
  return (await request.get('/partnership')).text();
}

/** Where each of a row of cards sits. */
function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
}

test('the partnership page shows the words the CMS has published, every section of it, in Arabic only', async ({
  page,
  request,
  cms,
}) => {
  const partnership = cms.entry('partnership-page');
  const entry = await partnership.published();
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
  cms,
}) => {
  const partnership = cms.entry('partnership-page');
  const entry = await partnership.published();
  const title = `${entry.hero.title.ar} — مسودة`;
  const figure = '12 نمطاً';
  const mode: Mode = {
    label: arabic('التجربة المشتركة'),
    title: arabic('مشروع تجريبي أولاً'),
    text: arabic('نطلق معك مشروعاً واحداً قبل أي اتفاقية.'),
    fit: arabic('مناسب لـ: المكاتب التي تريد أن ترى قبل أن تقرر.'),
  };
  const stage: Stage = { title: arabic('المراجعة بعد ستة أشهر'), text: arabic('نراجع معك النموذج ونعدّله إن لزم.') };
  const draft = entry;

  await partnership.draft({
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
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/partnership');
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
});

test('the hero and the sections links land on have no switch to hide them; every other section has one', async ({ page, cms }) => {
  const admin = await cms.openInAdmin('partnership-page');

  for (const hideable of ['Idea', 'Who it is for', 'Modes', 'Benefits', 'Questions']) {
    await admin.openSection(hideable);
    await expect(page.getByLabel('Shows on the page'), hideable).toBeVisible();
  }

  for (const linked of ['Hero', 'Path', 'Application']) {
    await admin.openSection(linked);
    await expect(page.getByText(/Always shows/), linked).toBeVisible();
    await expect(page.getByLabel('Shows on the page'), linked).toHaveCount(0);
  }
});

test('a figure too long for its card, too many figures, too many or no modes, and words too long for their line are refused', async ({
  page,
  cms,
}) => {
  const partnership = cms.entry('partnership-page');
  const entry = await partnership.published();
  const { hero, modes, path, benefits, apply } = entry;
  const withFirst = <T,>(list: T[], changed: Partial<T>) => list.map((each, index) => (index === 0 ? { ...each, ...changed } : each));

  const refused: Record<string, Entry<'partnership-page'>> = {
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
    const response = await partnership.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(await partnership.published()).toEqual(entry);
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

test('the partnership page is published in English once every word it has is written in English', async ({ page, request, cms }) => {
  const partnership = cms.entry('partnership-page');
  const entry = await partnership.published();

  // A visitor's Arabic page is meant to come back exactly as it was, which
  // leaves nothing in it to wait for — and a publish is in nobody's page the
  // moment it is saved (`cms.ts`). So the English is published together with a
  // space at the end of the application's paragraph, which is in the HTML and drawn
  // nowhere, and the page waited for is the one that space arrives in: built
  // from this publish, not from before it.
  const english = withEnglish(entry);
  const lead = `${entry.apply.lead.ar} `;
  await partnership.publish({ ...english, apply: { ...english.apply, lead: { ...english.apply.lead, ar: lead } }, languages: ['ar', 'en'] });
  expect((await partnership.published()).languages).toEqual(['ar', 'en']);

  const html = await reachesVisitors(request, '/partnership', `${lead}</p>`, 'the partnership page published in English');
  expect(html).toContain(entry.hero.title.ar);
  expect(outsideTheHeader(html)).not.toContain('>English<');
});

test('a change published reaches visitors', async ({ page, request, cms }) => {
  const partnership = cms.entry('partnership-page');
  const entry = await partnership.published();
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.apply.lead.ar} `;

  await partnership.publish({ ...entry, apply: { ...entry.apply, lead: arabic(lead) } });
  await reachesVisitors(request, '/partnership', `${lead}</p>`, "the partnership page's reworded paragraph");
});
