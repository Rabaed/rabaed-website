/**
 * The home page's text in the CMS (ticket 58): Ahmed rewords its hero, adds a
 * situation, a unit, a transaction type and a figure, hides sections, replaces
 * a building, previews the page and publishes it — and the CMS refuses what the
 * design cannot carry, and the page still holds what it allows at its longest.
 *
 * How page text works is `page-text.spec.ts`'s, on the start page, and the
 * closing section and Screen mocks the home page shares are
 * `product-text.spec.ts`'s. The home page's words and pictures are checked by
 * its own suites running beside this one, so nothing here publishes a change
 * they could notice (ticket 22's rule): changes are saved as drafts and checked
 * in the editor's preview, which visitors never see; the one change published
 * is a space at the end of the calculator's paragraph, which no screenshot
 * shows and no suite reads; refused changes are never saved at all.
 *
 * The tests sign in as an editor of their own (`cms.ts`) and run one at a time.
 */
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { HOME_EDITOR, expectSectionOpen, logInAs, logInByApi, openPageEntry, openSection, reachesVisitors, uploadImage, outsideTheHeader } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/home-page';

/** A word as the CMS holds it: its Arabic and its English. */
type Words = { ar: string; en?: string | null };
type Situation = { quote: Words; cost: Words };
type Tab = { final: boolean; title: Words; screen: string };
type Step = { action: Words; by: Words; time: string };
type TransactionType = { label: Words; title: Words; steps: Step[] };
type Face = { channel: Words; words: Words };
type Figure = { blockType: 'comparison' | 'commitment'; topic: Words; claim: Words; basis: Words } & Record<string, unknown>;
type HomeEntry = {
  languages: string[];
  hero: {
    titleAccent: Words;
    titleLines: { line: Words }[];
    primaryLabel: Words;
    secondaryLabel: Words;
    statuses: { status: Words }[];
    parties: Record<'owner' | 'consultant' | 'contractor', Words>;
    pictures?: Record<string, number | null>;
  } & Record<string, unknown>;
  situations: { shows: boolean; heading: Words; situations: Situation[] } & Record<string, unknown>;
  fourUnits: { shows: boolean; heading: Words; lead: Words; tabs: Tab[] } & Record<string, unknown>;
  record: { shows: boolean; lead: Words; types: TransactionType[] } & Record<string, unknown>;
  beforeAfter: {
    shows: boolean;
    heading: Words;
    lead: Words;
    steps: { name: Words; usual: Face; rabaed: Face }[];
  } & Record<string, unknown>;
  calculator: { shows: boolean; heading: Words; lead: Words; sliderLabels: Record<string, Words> } & Record<string, unknown>;
  figures: { shows: boolean; heading: Words; figures: Figure[] } & Record<string, unknown>;
  questions: { shows: boolean; heading: Words } & Record<string, unknown>;
};

const arabic = (words: string): Words => ({ ar: words, en: null });

const SENTENCE = 'نجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد ';

/** Arabic words exactly `length` characters long. */
function wordsOfLength(length: number): string {
  return SENTENCE.repeat(Math.ceil(length / SENTENCE.length)).slice(0, length).trimEnd().padEnd(length, 'ع');
}

/** An Arabic paragraph of exactly `count` words, for the answer-first rule (ticket 35). */
function wordsCounting(count: number): string {
  return Array.from({ length: count }, (_, index) => (index % 2 === 0 ? 'ربائد' : 'سجل')).join(' ');
}

const LEFT_OUT = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status']);

/** The entry's fields alone, ready to be sent back: no ids, no dates. */
function fields<T>(value: T): T {
  if (Array.isArray(value)) return value.map(fields) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).filter(([key]) => !LEFT_OUT.has(key)).map(([key, each]) => [key, fields(each)]),
    ) as T;
  }
  return value;
}

/** The home page's entry as published. */
async function published(editor: APIRequestContext): Promise<HomeEntry> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return fields(await response.json());
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
  return (await request.get('/')).text();
}

/** Opens the site in preview at the home page, as the admin's Preview button does. */
async function preview(page: Page): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent('/')}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

/**
 * The cards among `cards` that do not hold their words: something they draw —
 * a word, a bar, a label — past the card's border, or one part of the card run
 * into the next. A figure card's middle shrinks to make room, so a card too
 * full does not scroll; its parts overlap instead, which is what this looks
 * for. Measured with each card's resting fan taken off, since a turned card's
 * box is not its own shape.
 *
 * Handed to the page whole, so it refers to nothing outside itself.
 */
function cardsNotHoldingTheirWords(cards: Element[]): string[] {
  const boxOf = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent!.trim()) return null;
      const range = document.createRange();
      range.selectNodeContents(node);
      return range.getBoundingClientRect();
    }
    const box = (node as Element).getBoundingClientRect();
    return box.width || box.height ? box : null;
  };
  /** Every element and run of words inside `root` that draws something, with where it is drawn. */
  const drawnNodes = (root: Node, withRoot = false) => {
    const found: { node: Node; box: DOMRect }[] = [];
    const add = (node: Node) => {
      const box = boxOf(node);
      if (box) found.push({ node, box });
    };
    if (withRoot) add(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) add(node);
    return found;
  };

  return cards.flatMap((element) => {
    const card = element as HTMLElement;
    const transform = card.style.transform;
    card.style.transform = 'none';
    const style = getComputedStyle(card);
    const outer = card.getBoundingClientRect();
    const px = (value: string) => parseFloat(value);
    // Words stay inside the card's padding; a tag laid over the card — a
    // face's channel in its corner, a bar's label under it — inside its border.
    const within = (inset: (side: 'Top' | 'Bottom' | 'Left' | 'Right') => number) => ({
      top: outer.top + inset('Top') - 1,
      bottom: outer.bottom - inset('Bottom') + 1,
      left: outer.left + inset('Left') - 1,
      right: outer.right - inset('Right') + 1,
    });
    const border = within((side) => px(style[`border${side}Width`]));
    const padding = within((side) => px(style[`border${side}Width`]) + px(style[`padding${side}`]));
    const laidOver = (node: Node) => {
      for (let each = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element); each && each !== card; each = each.parentElement) {
        if (getComputedStyle(each).position === 'absolute') return true;
      }
      return false;
    };
    /** What a drawn thing is, for the failure message: `div.chead`, or the start of its words. */
    const named = (node: Node) => {
      const element = node.nodeType === Node.TEXT_NODE ? node.parentElement! : (node as Element);
      const classes = element.getAttribute('class');
      const words = node.nodeType === Node.TEXT_NODE ? ` «${node.textContent!.trim().slice(0, 16)}»` : '';
      return `${element.tagName.toLowerCase()}${classes ? `.${classes.trim().split(/\s+/).join('.')}` : ''}${words}`;
    };

    const faults: string[] = [];
    for (const { node, box } of drawnNodes(card)) {
      const edge = laidOver(node) ? border : padding;
      const past = Math.max(edge.top - box.top, box.bottom - edge.bottom, edge.left - box.left, box.right - edge.right);
      if (past > 0) faults.push(`${named(node)} is ${Math.round(past)}px past the card's ${laidOver(node) ? 'border' : 'padding'}`);
    }
    const parts = [...card.children].filter((child) => getComputedStyle(child).position !== 'absolute');
    parts.forEach((part, index) => {
      const next = parts[index + 1];
      if (!next) return;
      const into = drawnNodes(part, true).find(({ box }) => box.bottom > next.getBoundingClientRect().top + 1);
      if (into) faults.push(`${named(into.node)} runs into ${named(next)}`);
    });
    card.style.transform = transform;

    if (faults.length === 0) return [];
    return [`${card.closest('[id]')!.id} card ${[...card.parentElement!.children].indexOf(card) + 1}: ${faults.slice(0, 3).join('; ')}`];
  });
}

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('the home page shows the words the CMS has published, every section of it, in Arabic only', async ({ page, request }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  const html = await visitorHtml(request);

  expect(entry.languages).toEqual(['ar']);
  const [firstType] = entry.record.types;
  const [firstStep] = entry.beforeAfter.steps;
  for (const words of [
    entry.hero.titleLines[0].line,
    entry.hero.titleAccent,
    entry.hero.statuses[0].status,
    entry.hero.parties.consultant,
    entry.situations.heading,
    ...entry.situations.situations.map((situation) => situation.quote),
    entry.fourUnits.heading,
    ...entry.fourUnits.tabs.map((tab) => tab.title),
    entry.record.lead,
    firstType.title,
    ...firstType.steps.map((step) => step.action),
    entry.beforeAfter.heading,
    firstStep.name,
    firstStep.usual.words,
    entry.calculator.heading,
    entry.calculator.sliderLabels.delayDays,
    ...entry.figures.figures.map((figure) => figure.claim),
    entry.questions.heading,
  ]) {
    expect(html).toContain(words.ar);
  }
  // A phrase the Editor marks in bold is drawn in bold, without its marks.
  expect(html).toContain('<b>SUB-031</b>');
  expect(html).not.toContain('*SUB-031*');
});

test('a reworded heading, grown lists and hidden sections are previewed, and never reach a visitor', async ({ page, request }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  const accent = `${entry.hero.titleAccent.ar} مسودة`;
  const situation: Situation = { quote: arabic('الاستشاري يطلب النسخة الموقعة… والمقاول أرسلها بالواتساب.'), cost: arabic('نسخة بلا مرجع.') };
  const tab: Tab = { final: false, title: arabic('لوحة المالك'), screen: 'overview' };
  const type: TransactionType = {
    ...entry.record.types[0],
    label: arabic('محضر اجتماع'),
    title: arabic('MOM-12 · محضر اجتماع — التنسيق الأسبوعي'),
  };
  const commitment: Figure = {
    blockType: 'commitment',
    topic: arabic('الدعم'),
    icon: 'onboarding',
    claim: arabic('فريق يرد على أسئلتك بالعربية'),
    value: arabic('نفس اليوم'),
    basis: arabic('من أول سؤال إلى أول رد'),
  };
  // A unit before the Record, which stays last.
  const tabs = [...entry.fourUnits.tabs.slice(0, -1), tab, ...entry.fourUnits.tabs.slice(-1)];

  try {
    const saved = await save(
      page.request,
      {
        ...entry,
        hero: { ...entry.hero, titleAccent: arabic(accent) },
        situations: { ...entry.situations, situations: [...entry.situations.situations, situation] },
        fourUnits: { ...entry.fourUnits, tabs },
        record: { ...entry.record, types: [...entry.record.types, type] },
        figures: { ...entry.figures, figures: [...entry.figures.figures, commitment] },
        beforeAfter: { ...entry.beforeAfter, shows: false },
        calculator: { ...entry.calculator, shows: false },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(accent);

    const situations = page.locator('#situations-deck .pcard');
    await expect(situations).toHaveCount(7);
    await expect(situations.first().locator('.n')).toHaveText('01 / 07');
    await expect(situations.last().locator('q')).toHaveText(situation.quote.ar);

    // Units numbered by their place among the units; the Record by its name.
    await expect(page.locator('#jt [role="tab"] .n')).toHaveText(['01', '02', '03', '04', '05', 'المخرَج']);
    await expect(page.locator('#jt [role="tab"] h3').nth(4)).toHaveText(tab.title.ar);
    await expect(page.locator('#jt [role="tabpanel"]')).toHaveCount(6);

    await expect(page.locator('#record .rec-types span')).toHaveText(
      [...entry.record.types, type].map((each) => each.label.ar),
    );
    await expect(page.locator('#record .rec-entry')).toHaveCount(6);

    await expect(page.locator('#figures-deck .pcard')).toHaveCount(7);
    await expect(page.locator('#figures-deck .pcard').last().locator('.chead')).toHaveText(commitment.claim.ar);

    await expect(page.locator('#ba')).toHaveCount(0);
    await expect(page.locator('#calc')).toHaveCount(0);

    const html = await visitorHtml(request);
    for (const draft of [accent, situation.quote.ar, tab.title.ar, type.label.ar, commitment.claim.ar]) {
      expect(html).not.toContain(draft);
    }
    expect(html).toContain('id="ba"');
    expect(html).toContain('id="calc"');
  } finally {
    await discardDraft(page.request);
  }
});

test('the units section draws the answer under its heading once one is written, and nothing while it is empty', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  // A standalone answer of 30 to 60 words, which is what this field takes
  // (ticket 35). The Reference site gives this section no paragraph, so the
  // field is empty until an Editor writes one.
  const answer =
    'ربائد أربع وحدات على سجل واحد: المراسلات الرسمية، والاعتمادات والطلبات، والتقرير اليومي للموقع، والمستندات والإصدارات. هذه مسودة مكتوبة في الاختبار وحده لترى الصفحة كيف تحمل الفقرة تحت العنوان، ومخرج الوحدات واحد: السجل الموثّق.';
  expect(answer.trim().split(/\s+/).length).toBeGreaterThanOrEqual(30);
  expect(entry.fourUnits.lead.ar ?? '', 'the units section publishes no paragraph today').toBe('');
  // And a visitor is served the section with nothing under its heading.
  await page.goto('/');
  await expect(page.locator('#jt .tz-head p')).toHaveCount(0);

  try {
    const saved = await save(page.request, { ...entry, fourUnits: { ...entry.fourUnits, lead: arabic(answer) } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await preview(page);
    await expect(page.locator('#jt .tz-head .lead')).toHaveText(answer);
    // Under the heading, which is what makes it the section's opening answer.
    await expect(page.locator('#jt .tz-head > *').nth(2)).toHaveText(answer);

    expect(await visitorHtml(request)).not.toContain(answer);
  } finally {
    await discardDraft(page.request);
  }
});

test('with the units section switched off, the hero drops the button that leads to it, and keeps the demo button', async ({ page, request }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  const ctas = page.locator('#hero .ctas a');

  try {
    const saved = await save(page.request, { ...entry, fourUnits: { ...entry.fourUnits, shows: false } }, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    await preview(page);
    await expect(page.locator('#jt')).toHaveCount(0);
    // Nothing on the page for «استكشف المنصة ↓» to lead to, so no such button
    // (ticket 73).
    await expect(ctas).toHaveText([entry.hero.primaryLabel.ar]);

    // A visitor still has the section, and the button to it.
    const html = await visitorHtml(request);
    expect(html).toContain('id="jt"');
    expect(html).toContain(entry.hero.secondaryLabel.ar);
  } finally {
    await discardDraft(page.request);
  }
});

test('a replaced building, and words marked in bold and broken onto a new line, are previewed as the page draws them', async ({
  page,
  request,
}) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  // Twice the drawing's own 369×303.
  const building = await uploadImage(page.request, 'مبنى المالك', { width: 738, height: 606 });
  const [first, ...others] = entry.beforeAfter.steps;
  const words = 'يُرفع الطلب *برقم مرجعي*\nويصل إلى الاستشاري فوراً.';

  try {
    const saved = await save(
      page.request,
      {
        ...entry,
        hero: { ...entry.hero, pictures: { ...entry.hero.pictures, owner: building } },
        beforeAfter: {
          ...entry.beforeAfter,
          steps: [{ ...first, rabaed: { ...first.rabaed, words: arabic(words) } }, ...others],
        },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await preview(page);
    const owner = page.locator('#hero-art img.bld').first();
    await expect(owner).toHaveAttribute('src', /\/api\/media\/file\//);
    // In the drawing's own box.
    await expect(owner).toHaveAttribute('width', '369');
    await expect
      .poll(() => owner.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0), {
        message: 'the replacement never loaded',
      })
      .toBe(true);

    const face = page.locator('#ba .cmp-col').first().locator('.face.fa p');
    await expect(face.locator('b')).toHaveText('برقم مرجعي');
    await expect(face.locator('br')).toHaveCount(1);
    await expect(face).not.toContainText('*');

    const html = await visitorHtml(request);
    expect(html).toContain('src="/hero/b-owner.webp"');
    expect(html).not.toContain('برقم مرجعي</b>');
  } finally {
    await discardDraft(page.request);
  }
});

test('the hero has no switch to hide it; every other section of the home page has one', async ({ page }) => {
  await logInAs(page, HOME_EDITOR);
  await openPageEntry(page, 'home-page');

  for (const section of ['Trust strip', 'Situations', 'Units', 'Record', 'Before and after', 'Delay calculator', 'Figures', 'Questions']) {
    await openSection(page, section);
    await expect(page.getByLabel('Shows on the page'), section).toBeVisible();
  }
  await openSection(page, 'Hero');
  await expect(page.getByText(/Always shows/)).toBeVisible();
  await expect(page.getByLabel('Shows on the page')).toHaveCount(0);
});

/**
 * What `openPageEntry` is for (ticket 61). The admin reopens the tab an editor
 * last had open, and asks the server which one that was; the answer undoes a
 * tab clicked while it is still in flight, and the test above then reads
 * another section's panel — on CI, twice, as a switch that was never found.
 * That window is milliseconds on a machine nobody is squeezing, so the
 * request is held up here and the window is the whole of the hold.
 */
test('an entry is not handed over until the admin has reopened its remembered tab, and a section opened then stays open', async ({ page }) => {
  await logInAs(page, HOME_EDITOR);
  // Two seconds because the window has only to be wider than a test can walk
  // into by accident: on a runner it is the odd stall, hundreds of
  // milliseconds at most, and every one of those is inside this. The flag is
  // set before the request goes on, so the check below cannot race the answer
  // it releases.
  let released = false;
  await page.route('**/api/payload-preferences/global-home-page*', async (route) => {
    if (route.request().method() !== 'GET') return route.fallback();
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    released = true;
    await route.fallback();
  });

  await openPageEntry(page, 'home-page');
  expect(released, 'the entry was handed back while the admin was still waiting to hear which tab to reopen').toBe(true);

  // Situations, because the section the admin is told to reopen is the second
  // one — the Trust strip — and a tab put back where the test asked for it
  // would prove nothing.
  await openSection(page, 'Situations');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();

  // Waiting for nothing to happen is the point of this one: the restore is
  // over, and with the tab clicked after it rather than before, nothing is
  // left to put the Trust strip back. A second is orders of magnitude more
  // than the admin needs to act on an answer it already has, and erring the
  // other way would only let this test pass where it should fail.
  await page.waitForTimeout(1_000);
  await expectSectionOpen(page, 'Situations');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();
});

test('the CMS refuses what the home page cannot carry', async ({ page }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  const { hero, situations, fourUnits, record, beforeAfter, figures } = entry;
  const [situation, ...otherSituations] = situations.situations;
  const [type, ...otherTypes] = record.types;
  const [step, ...otherSteps] = beforeAfter.steps;
  const [figure, ...otherFigures] = figures.figures;
  const otherShape = await uploadImage(page.request, 'مبنى بمقاس آخر', { width: 740, height: 606 });

  const withFigure = (changed: Record<string, unknown>) => ({
    ...entry,
    figures: { ...figures, figures: [{ ...figure, ...changed }, ...otherFigures] },
  });

  // What is refused, what is sent, and the field it breaks.
  const refused: [string, object, string | RegExp][] = [
    ['three statuses', { ...entry, hero: { ...hero, statuses: hero.statuses.slice(0, 3) } }, 'hero.statuses'],
    ['five statuses', { ...entry, hero: { ...hero, statuses: [...hero.statuses, hero.statuses[0]] } }, 'hero.statuses'],
    [
      'a trail of three steps',
      { ...entry, record: { ...record, types: [{ ...type, steps: type.steps.slice(0, 3) }, ...otherTypes] } },
      'record.types.0.steps',
    ],
    [
      'a trail of five steps',
      { ...entry, record: { ...record, types: [{ ...type, steps: [...type.steps, type.steps[0]] }, ...otherTypes] } },
      'record.types.0.steps',
    ],
    ['three before-and-after steps', { ...entry, beforeAfter: { ...beforeAfter, steps: otherSteps } }, 'beforeAfter.steps'],
    ['no situations', { ...entry, situations: { ...situations, situations: [] } }, 'situations.situations'],
    [
      'a situation longer than its card',
      {
        ...entry,
        situations: { ...situations, situations: [{ ...situation, quote: arabic(wordsOfLength(76)) }, ...otherSituations] },
      },
      'situations.situations.0.quote.ar',
    ],
    ['a claim longer than its card', withFigure({ claim: arabic(wordsOfLength(37)) }), 'figures.figures.0.claim.ar'],
    ['a figure with Arabic numerals, which DM Mono has none of', withFigure({ figure: '٣٫٦×' }), 'figures.figures.0.figure'],
    ['a figure too wide to sit beside its bars', withFigure({ figure: '100.5%' }), 'figures.figures.0.figure'],
    [
      'a bar taller than the card draws',
      withFigure({ after: { ...(figure.after as object), height: 71 } }),
      'figures.figures.0.after.height',
    ],
    [
      'a bold mark left open',
      {
        ...entry,
        beforeAfter: { ...beforeAfter, steps: [{ ...step, rabaed: { ...step.rabaed, words: arabic('طلب اعتماد *SUB-031 برقم مرجعي.') } }, ...otherSteps] },
      },
      'beforeAfter.steps.0.rabaed.words.ar',
    ],
    [
      'a building of another shape',
      { ...entry, hero: { ...hero, pictures: { ...hero.pictures, owner: otherShape } } },
      'hero.pictures.owner',
    ],
    // The answer-first rule (ticket 35): the paragraph under these headings is
    // what an assistant lifts and quotes, so it is held to a standalone answer
    // of 30 to 60 words rather than only to a length.
    [
      'an opening answer of 29 words under the units',
      { ...entry, fourUnits: { ...fourUnits, lead: arabic(wordsCounting(29)) } },
      'fourUnits.lead.ar',
    ],
    [
      'an opening answer of 61 words under the Record',
      { ...entry, record: { ...record, lead: arabic(wordsCounting(61)) } },
      'record.lead.ar',
    ],
    ['English with no English words', { ...entry, languages: ['ar', 'en'] }, /\.en$/],
  ];
  for (const [what, data, field] of refused) {
    const response = await save(page.request, data, 'published');
    expect(response.status(), `${what} (${field}): ${await response.text()}`).toBe(400);
  }

  // Nothing refused was kept.
  expect(await published(page.request)).toEqual(entry);

  // And the entry, as published, is accepted: so each refusal above was for the
  // one thing it changed (`product-text.spec.ts` says why it is said this way).
  const response = await save(page.request, entry, 'published');
  expect(response.ok(), await response.text()).toBe(true);
});

test('a situation card, a figure card and a before-and-after card each hold their words at their longest, at every width', async ({
  page,
}) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  const longest = (length: number) => arabic(wordsOfLength(length));
  const face = (): Face => ({ channel: longest(10), words: longest(66) });

  const draft = {
    ...entry,
    situations: {
      ...entry.situations,
      costLabel: longest(12),
      situations: entry.situations.situations.map(() => ({ quote: longest(75), cost: longest(50) })),
    },
    beforeAfter: {
      ...entry.beforeAfter,
      steps: entry.beforeAfter.steps.map(() => ({ name: longest(12), usual: face(), rabaed: face() })),
    },
    figures: {
      ...entry.figures,
      figures: entry.figures.figures.map((figure) => {
        const frame = { ...figure, topic: longest(18), claim: longest(36), basis: longest(48) };
        return figure.blockType === 'comparison'
          ? { ...frame, figure: '99.5%', before: { label: longest(6), height: 70 }, after: { label: longest(6), height: 70 } }
          : { ...frame, value: longest(12) };
      }),
    },
  };

  try {
    const saved = await save(page.request, draft, 'draft');
    expect(saved.ok(), await saved.text()).toBe(true);

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1280, height: 700 },
      { width: 981, height: 551 },
      { width: 980, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 360, height: 740 },
    ]) {
      await page.setViewportSize(viewport);
      await preview(page);
      await page.evaluate(() => document.fonts.ready);

      // A before-and-after card is held to its words from 700px up. On a phone
      // its column is a fixed minimum height two columns wide, and the
      // founders' own longest words fill it only because of where their lines
      // happen to break: a limit short enough to hold any words there would
      // refuse theirs (ticket 58).
      const cards = viewport.width >= 700 ? '#situations-deck .pcard, #figures-deck .pcard, #ba .face' : '#situations-deck .pcard, #figures-deck .pcard';
      const overflowing = await page.locator(cards).evaluateAll(cardsNotHoldingTheirWords);
      expect(overflowing, `at ${viewport.width}x${viewport.height}`).toEqual([]);
    }
  } finally {
    await discardDraft(page.request);
  }
});

/**
 * Every word of an entry that has Arabic given English of its own; a word left
 * empty stays empty. Two letters, which the shortest place — a bar's label —
 * holds.
 *
 * A word whose Arabic is a paragraph of 30 words or more is given as many
 * English words instead: the opening paragraph of a section is held to a
 * standalone answer of 30 to 60 words in *either* language (ticket 35), and
 * «En» is not one. Two letters a word keeps it well inside whatever length the
 * field holds, since it already holds that many Arabic words.
 */
function withEnglish<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withEnglish) as T;
  if (value && typeof value === 'object') {
    if ('ar' in value) {
      if (!value.ar) return value;
      const words = String(value.ar).trim().split(/\s+/).length;
      return { ...value, en: words >= 30 ? Array.from({ length: Math.min(words, 60) }, () => 'En').join(' ') : 'En' };
    }
    return Object.fromEntries(Object.entries(value).map(([key, each]) => [key, withEnglish(each)])) as T;
  }
  return value;
}

test('the home page is published in English once every word it has is written in English', async ({ page, request }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);

  try {
    // A visitor's Arabic page is meant to come back exactly as it was, which
    // leaves nothing in it to wait for — and a publish is in nobody's page the
    // moment it is saved (`cms.ts`). So the English is published together with a
    // space at the end of the calculator's paragraph, which is in the HTML and drawn
    // nowhere, and the page waited for is the one that space arrives in: built
    // from this publish, not from before it.
    const english = withEnglish(entry);
    const lead = `${entry.calculator.lead.ar} `;
    const response = await save(
      page.request,
      { ...english, calculator: { ...english.calculator, lead: { ...english.calculator.lead, ar: lead } }, languages: ['ar', 'en'] },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    expect((await published(page.request)).languages).toEqual(['ar', 'en']);

    const html = await reachesVisitors(request, '/', `${lead}</p>`, 'the home page published in English');
    expect(html).toContain(entry.hero.titleAccent.ar);
    expect(outsideTheHeader(html)).not.toContain('>English<');
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});

test('a change to the home page published reaches visitors', async ({ page, request }) => {
  await logInByApi(page.request, HOME_EDITOR);
  const entry = await published(page.request);
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.calculator.lead.ar} `;

  try {
    const response = await save(
      page.request,
      { ...entry, calculator: { ...entry.calculator, lead: { ...entry.calculator.lead, ar: lead } } },
      'published',
    );
    expect(response.ok(), await response.text()).toBe(true);
    await reachesVisitors(request, '/', `${lead}</p>`, "the calculator's reworded paragraph");
  } finally {
    const restored = await save(page.request, entry, 'published');
    expect(restored.ok(), await restored.text()).toBe(true);
  }
});
