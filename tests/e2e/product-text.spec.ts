/**
 * The product page's text, the closing section it shares with the home page,
 * and the Screen mocks, in the CMS (ticket 57): Ahmed rewords the closing
 * section once for both pages, adds a panel and a card, hides sections,
 * replaces a screen — and the CMS refuses what the design cannot carry, and
 * the page still holds what it allows at its longest.
 *
 * The product and home pages' words and pictures are checked by their own
 * suites running beside this one, so nothing here publishes a change they
 * could notice (ticket 22's rule, as `page-text.spec.ts` keeps it). Changes
 * are saved as drafts and checked in the editor's preview, which visitors never
 * see; the one change published is a space at the end of the hero's paragraph,
 * which no screenshot shows and no suite reads; refused changes are never
 * saved at all.
 *
 * The tests sign in as an editor of their own and run one at a time, and what
 * they change is put back when each ends (`entries.ts`).
 */
import type { APIRequestContext, Locator, Page } from '@playwright/test';
import { ADMIN_PATH, reachesVisitors, uploadImage } from './cms';
import { test, expect, type Cms, type CmsEntry, type Entry } from './entries';
import { drawnFrom, expectPhoneCrop, expectWholeToSwipe, frameShowing, mediaFiles } from './screen-mock-phone';
import { screenMockFieldName } from '../../src/cms/screen-mock-fields';
import { ENGLISH_SCREEN_MOCK_DESCRIPTIONS } from '../../src/migrations/english-screen-mock-words/words';
import { phoneCropExportSize, SCREEN_MOCKS } from '../../src/screen-mocks/registry';

test.describe.configure({ mode: 'default' });

type Global = 'product-page' | 'closing-section' | 'screen-mocks';

type Product = Entry<'product-page'>;
type Mocks = Entry<'screen-mocks'>;
/** A word as the CMS holds it: its Arabic and its English. */
type Words = Product['hero']['title'];
type Panel = Product['journey']['panels'][number];
type FlowItem = NonNullable<Panel['flow']>[number];
type Feature = Product['customStrip']['features'][number];
type MockFields = Mocks['correspondence'];

const arabic = (words: string): Words => ({ ar: words, en: null });

/** A screen's own fields in the Screen mocks entry, found by the mock's id (`screenMockFieldName`). */
function screen(mocks: Mocks, mockId: string): MockFields {
  return mocks[screenMockFieldName(mockId) as Exclude<keyof Mocks, 'languages'>];
}

const SENTENCE = 'نجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد ';

/** Arabic words exactly `length` characters long. */
function wordsOfLength(length: number): string {
  return SENTENCE.repeat(Math.ceil(length / SENTENCE.length)).slice(0, length).trimEnd().padEnd(length, 'ع');
}

/** An Arabic paragraph of exactly `count` words, for the answer-first rule (ticket 35). */
function wordsCounting(count: number): string {
  return Array.from({ length: count }, (_, index) => (index % 2 === 0 ? 'ربائد' : 'سجل')).join(' ');
}

async function visitorHtml(request: APIRequestContext, path: string): Promise<string> {
  return (await request.get(path)).text();
}

async function boxesOf(locator: Locator) {
  return locator.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
}

test('the product page, and the closing section and screens it shares with the home page, show what the CMS has published', async ({
  page,
  request,
  cms,
}) => {
  const productPage = cms.entry('product-page');
  const closingSection = cms.entry('closing-section');
  const screenMocks = cms.entry('screen-mocks');
  const product = await productPage.published();
  const { closing, languages } = await closingSection.published();
  const mocks = await screenMocks.published();
  const productHtml = await visitorHtml(request, '/product');
  const homeHtml = await visitorHtml(request, '/');

  for (const each of [product.languages, languages, mocks.languages]) expect(each).toEqual(['ar']);
  for (const words of [
    product.hero.title,
    product.journey.heading,
    product.customStrip.heading,
    ...product.journey.panels.map((panel) => panel.title),
    ...product.roles.roles.map((role) => role.promise),
    ...product.innerCycle.cycles.map((cycle) => cycle.party),
  ]) {
    expect(productHtml).toContain(words.ar);
  }

  for (const html of [productHtml, homeHtml]) {
    expect(html).toContain(closing.heading.ar);
    for (const step of closing.steps) expect(html).toContain(step.text.ar);
    // Both pages show the kanban screen, described in the CMS's words.
    expect(html).toContain(`alt="${mocks.kanban.description.ar}"`);
  }

  // No screen is replaced until an Editor replaces one: each is its export.
  for (const panel of product.journey.panels) expect(screen(mocks, panel.screen).picture).toBeNull();
});

test('the closing section is reworded once for both pages that end on it, previewed, and never reaches a visitor', async ({
  page,
  request,
  cms,
}) => {
  const closingSection = cms.entry('closing-section');
  const entry = await closingSection.published();
  const heading = `${entry.closing.heading.ar} — مسودة`;
  const step = { label: arabic('متابعة'), text: arabic('نراجع مع الأطراف الثلاثة ما تغيّر بعد الشهر الأول.') };

  await closingSection.draft({
    ...entry,
    closing: { ...entry.closing, heading: arabic(heading), steps: [...entry.closing.steps, step] },
  });

  for (const path of ['/product', '/']) {
    await cms.preview(path);
    await expect(page.locator('#tail h2'), path).toHaveText(heading);
    // Numbered by their place.
    await expect(page.locator('.tail-steps b'), path).toHaveText([
      ...entry.closing.steps.map((each, index) => `0${index + 1} · ${each.label.ar}`),
      `04 · ${step.label.ar}`,
    ]);
  }

  for (const path of ['/product', '/']) expect(await visitorHtml(request, path)).not.toContain(heading);
});

test("the product page's lists grow, its sections hide, and its grids stay neat", async ({ page, request, cms }) => {
  const productPage = cms.entry('product-page');
  const entry = await productPage.published();
  const added: Panel = {
    final: false,
    title: arabic('تنبيهات المهل'),
    tagline: arabic('كل مهلة تقترب من نهايتها، عند من ينتظرها.'),
    body: arabic('يُرفع الجدول المحدَّث ويراه المالك والاستشاري بتاريخه ومن رفعه.'),
    flow: [
      { party: arabic('المقاول'), after: 'towards' },
      { party: arabic('المالك'), after: 'none' },
    ],
    screen: 'overview',
  };
  // Before the Record, which stays last.
  const panels = [...entry.journey.panels.slice(0, -1), added, ...entry.journey.panels.slice(-1)];
  const feature: Feature = { title: arabic('سجل المخاطر'), body: arabic('مخاطر المشروع بأصحابها ومواعيد مراجعتها.') };

  await productPage.draft({
    ...entry,
    journey: { ...entry.journey, panels },
    customStrip: { ...entry.customStrip, features: [...entry.customStrip.features, feature] },
    roles: { ...entry.roles, shows: false },
    innerCycle: { ...entry.innerCycle, shows: false },
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/product');
  const journey = page.locator('#journey');
  await expect(journey.locator('.panel h3')).toHaveText(panels.map((panel) => panel.title.ar));
  // Units numbered by their place, out of every panel; one progress mark each.
  await expect(journey.locator('.panel .num:not(.out)')).toHaveText(['01 / 06', '02 / 06', '03 / 06', '04 / 06', '05 / 06']);
  await expect(journey.locator('.dots i')).toHaveCount(6);
  await expect(journey.locator('.panel').nth(4).locator('.flow')).toHaveText('المقاول←المالك');
  await expect(page.locator('#roles')).toHaveCount(0);
  await expect(page.locator('#inner')).toHaveCount(0);

  // Three cards at desktop widths: two side by side as today, and the third
  // under them across the whole row, rather than one left beside a gap.
  const cards = page.locator('#custom .strip .c');
  await expect(cards.locator('h3')).toHaveText([...entry.customStrip.features, feature].map((each) => each.title.ar));
  const wide = await boxesOf(cards);
  const row = (await page.locator('#custom .strip').boundingBox())!;
  expect(wide[0].y).toBe(wide[1].y);
  expect(wide[0].width).toBeCloseTo(wide[1].width, 0);
  expect(wide[2].y).toBeGreaterThan(wide[0].y);
  expect(wide[2].width).toBeCloseTo(row.width, 0);

  // On a phone they stand one under another, as two do today.
  await page.setViewportSize({ width: 390, height: 844 });
  const narrow = await boxesOf(cards);
  expect(new Set(narrow.map((box) => Math.round(box.x))).size).toBe(1);
  for (let index = 1; index < narrow.length; index += 1) expect(narrow[index].y).toBeGreaterThan(narrow[index - 1].y);

  const html = await visitorHtml(request, '/product');
  expect(html).not.toContain(added.title.ar);
  expect(html).not.toContain(feature.title.ar);
  expect(html).toContain('id="roles"');
});

test('the parties section draws the answer under its heading once one is written, and nothing while it is empty', async ({
  page,
  request,
  cms,
}) => {
  const productPage = cms.entry('product-page');
  const entry = await productPage.published();
  // A standalone answer of 30 to 60 words, which is what this field takes
  // (ticket 35). The Reference site gives this section no paragraph, so the
  // field is empty until an Editor writes one.
  const answer =
    'يفتح كل طرف ما يخصّ عمله من السجل نفسه: المالك، والاستشاري، والمقاول. هذه مسودة مكتوبة في الاختبار وحده لترى الصفحة كيف تحمل الفقرة تحت العنوان، ولكل جهة صلاحياتها ونماذجها العربية بالمعايير السعودية.';
  expect(answer.trim().split(/\s+/).length).toBeGreaterThanOrEqual(30);
  expect(entry.roles.lead?.ar ?? '', 'the parties section publishes no paragraph today').toBe('');

  await productPage.draft({ ...entry, roles: { ...entry.roles, lead: arabic(answer) } });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/product');
  await expect(page.locator('#roles .lead')).toHaveText(answer);
  // Between the heading and the tabs, which is what makes it the section's
  // opening answer rather than a note under the section.
  await expect(page.locator('#roles h2 + p.lead + .tabs')).toHaveCount(1);

  // And it pushes the tabs down by its own height and no more: the paragraph
  // needs no rule of its own, because its margin and the tabs' collapse into
  // the one gap the heading leaves today (product.css says so, ticket 35).
  const [heading, lead, tabs] = await boxesOf(page.locator('#roles h2, #roles .lead, #roles .tabs'));
  expect(Math.round(lead!.top - heading!.bottom), 'the gap the heading leaves').toBe(12);
  expect(Math.round(tabs!.top - lead!.bottom), 'the gap above the tabs').toBe(28);

  expect(await visitorHtml(request, '/product')).not.toContain(answer);
});

test('a replaced screen shows, described in its own words, on every page that shows it', async ({ page, request, cms }) => {
  const screenMocks = cms.entry('screen-mocks');
  const mocks = await screenMocks.published();
  // Twice the mock's size, as sharp on a dense screen as its export.
  const picture = await uploadImage(page.request, 'شاشة مراسلات بديلة', { width: 2880, height: 1800 });
  const description = 'شاشة المراسلات بعد التحديث: الخطابات وحالة الرد على كل منها';

  await screenMocks.draft({ ...mocks, correspondence: { picture, description: arabic(description) } });

  // The journey's first panel and the home page's first tab both show it.
  for (const [path, section] of [
    ['/product', '#journey'],
    ['/', '#jt'],
  ]) {
    await cms.preview(path);
    const image = page.locator(section).getByRole('img', { name: description, exact: true });
    await expect(image, path).toHaveAttribute('src', /\/api\/media\/file\//);
    // In the mock's own box.
    await expect(image, path).toHaveAttribute('width', '1440');
    await expect(image, path).toHaveAttribute('height', '900');
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0), {
        message: `the replacement never loaded on ${path}`,
      })
      .toBe(true);
    await expect(page.locator(section).getByText(description, { exact: true }), path).toHaveCount(1);
  }

  const html = await visitorHtml(request, '/product');
  expect(html).not.toContain(description);
  expect(html).toContain(`alt="${mocks.correspondence.description.ar}"`);
});

test('a replacement for the English pages leaves the Arabic pages showing theirs', async ({ page, cms }) => {
  const screenMocks = cms.entry('screen-mocks');
  const mocks = await screenMocks.published();
  // A screen's words are in its picture, so each language has its own
  // replacement (ticket 41): this one is for the English pages alone.
  const englishPicture = await uploadImage(page.request, 'English correspondence screen', { width: 2880, height: 1800 });

  await screenMocks.draft({ ...mocks, correspondence: { ...mocks.correspondence, englishPicture } });

  for (const [path, section] of [
    ['/product', '#journey'],
    ['/', '#jt'],
  ]) {
    await cms.preview(path);
    const image = page.locator(section).locator('img[data-screen-mock="correspondence"]');
    await expect(image, path).toHaveAttribute('src', /screen-mocks%2Far%2Fcorrespondence\.webp/);
    await expect(image, path).toHaveAttribute('alt', mocks.correspondence.description.ar);
  }
});

/**
 * A replaced screen on a phone (tickets 77 and 78). A replacement with no
 * Phone crop uploaded beside it (ticket 79) has none — an exported one would
 * show the screen it replaced — so a phone is shown the whole picture, 1040px
 * wide in a box that pans, with ticket 77's swipe hint over its foot and a
 * fade at each edge with more behind it.
 *
 * Every Screen mock still showing its export is its crop on a phone, and
 * `phone-crops.spec.ts` checks that. This is the one place a replaced screen
 * can be made — in a draft, seen in the preview — so ticket 77's checks of the
 * pan are here, where there is one to swipe.
 */
test.describe('a replaced screen, on a phone', () => {
  test.use({ viewport: { width: 390, height: 812 } });

  const HINT = 'اسحب لرؤية الشاشة كاملة';

  /** Every place a Screen mock pans on a phone, and the frame the hint sits in. */
  const PANS = [
    { path: '/', where: 'the four units', frames: '#jt .jt-pan' },
    { path: '/product', where: 'the journey', frames: '#journey .win' },
    { path: '/product', where: 'the roles', frames: '#roles .role.on .win' },
  ] as const;

  /** The box inside a frame that pans. */
  const pan = (frame: Locator) => frame.locator('[data-pan]');

  /**
   * How far in from each edge the picture fades, in pixels. The mask is a
   * gradient from left to right, `transparent, black <left>, black
   * calc(100% - <right>), transparent`, and a width of nothing is written as
   * the edge itself. Read as the edges a visitor sees, not by the
   * stylesheet's own names for them.
   */
  async function fades(frame: Locator): Promise<{ left: number; right: number }> {
    const mask = await pan(frame).evaluate((element) => getComputedStyle(element).maskImage);
    const stops = /rgb\(0, 0, 0\) ([\d.]+)px, rgb\(0, 0, 0\) (?:100%|calc\(100% - ([\d.]+)px\))/.exec(mask);
    expect(stops, `a mask that is not a fade at both edges: ${mask}`).not.toBeNull();
    return { left: Math.round(Number(stops![1])), right: Math.round(Number(stops![2] ?? 0)) };
  }

  /** At rest, the far edge — the left, right to left — fades and the near one does not. */
  const AT_REST = { left: 36, right: 0 };

  /** Swipes a pan as far as `share` of the way along, as a finger would take it. */
  async function swipe(frame: Locator, share: number): Promise<void> {
    await pan(frame).evaluate((element, share) => {
      // Right to left, the rest of the screen is to the left: scrollLeft runs
      // from 0 down to minus the hidden width.
      const hidden = element.scrollWidth - element.clientWidth;
      const towards = getComputedStyle(element).direction === 'rtl' ? -1 : 1;
      element.scrollTo({ left: towards * hidden * share, behavior: 'instant' });
    }, share);
  }

  /** Replaces every screen's picture for the Arabic pages in a draft, runs `check`, and discards the draft. */
  async function withEveryScreenReplaced(page: Page, cms: Cms, check: () => Promise<void>): Promise<void> {
    const screenMocks = cms.entry('screen-mocks');
    const mocks = await screenMocks.published();
    const picture = await uploadImage(page.request, 'شاشة بديلة', { width: 2880, height: 1800 });
    const replaced = Object.fromEntries(
      SCREEN_MOCKS.map(({ id }) => [screenMockFieldName(id), { ...screen(mocks, id), picture }]),
    );
    await screenMocks.draft({ ...mocks, ...replaced });
    await check();
  }

  async function open(page: Page, cms: Cms, path: string, frames: string): Promise<Locator> {
    await cms.preview(path);
    const first = page.locator(frames).first();
    await first.scrollIntoViewIfNeeded();
    return first;
  }

  test('is the whole picture, to swipe, and says so; the fade follows the swipe and the hint goes once swiped', async ({
    page,
    cms,
  }) => {
    await withEveryScreenReplaced(page, cms, async () => {
      for (const { path, where, frames } of PANS) {
        const frame = await open(page, cms, path, frames);
        const picture = frame.locator('img[data-screen-mock]').first();

        // The replacement, whole, with no crop and nothing to tap.
        await expect(picture, where).toHaveAttribute('src', /\/api\/media\/file\//);
        await expect(picture, where).not.toHaveAttribute('data-phone-crop');
        expect((await picture.boundingBox())?.width, where).toBe(1040);
        await expect(frame.getByRole('button'), where).toHaveCount(0);

        const hint = frame.locator('.pan-hint');
        await expect(hint, where).toBeVisible();
        await expect(hint, where).toHaveText(HINT);
        await expect(hint, where).toHaveCSS('opacity', '1');
        // Centred over the foot of the picture, whatever the page's own rules
        // for the words around it.
        const off = await frame.evaluate((box) => {
          const outer = box.getBoundingClientRect();
          const inner = box.querySelector('.pan-hint')!.getBoundingClientRect();
          return {
            centre: Math.abs((inner.left + inner.right) / 2 - (outer.left + outer.right) / 2),
            foot: outer.bottom - inner.bottom,
          };
        });
        expect(off.centre, where).toBeLessThan(2);
        expect(off.foot, where).toBeGreaterThan(0);
        expect(off.foot, where).toBeLessThan(40);

        // At rest the screen shows from where it begins, so the far edge
        // fades and the near one does not.
        await expect.poll(() => fades(frame), { message: where }).toEqual(AT_REST);

        await swipe(frame, 0.5);
        // Part of the way along, there is more of the screen at both edges.
        await expect.poll(() => fades(frame), { message: where }).toEqual({ left: 36, right: 36 });
        await expect(hint, where).toHaveCSS('opacity', '0');

        await swipe(frame, 1);
        // At the far edge there is nothing more that way.
        await expect.poll(() => fades(frame), { message: where }).toEqual({ left: 0, right: 36 });

        await swipe(frame, 0);
        // Back where it began, and the hint does not come back: it has been read.
        await expect.poll(() => fades(frame), { message: where }).toEqual(AT_REST);
        await expect(hint, where).toHaveCSS('opacity', '0');
      }
    });
  });

  test('only the swiped screen loses its hint, and each of the four units is swiped afresh', async ({ page, cms }) => {
    await withEveryScreenReplaced(page, cms, async () => {
      await open(page, cms, '/product', '#journey .win');
      const frames = page.locator('#journey .win');
      expect(await frames.count()).toBeGreaterThan(1);
      await swipe(frames.first(), 0.5);
      await expect(frames.first().locator('.pan-hint')).toHaveCSS('opacity', '0');
      await expect(frames.nth(1).locator('.pan-hint')).toHaveCSS('opacity', '1');

      // The home page's units share the one box. A screen the visitor has not
      // swiped yet is shown from where it begins, and says it can be.
      const units = await open(page, cms, '/', '#jt .jt-pan');
      const hint = units.locator('.pan-hint');
      await swipe(units, 0.5);
      await expect(hint).toHaveCSS('opacity', '0');
      await page.locator('#jt [role="tab"]').nth(2).click();
      await expect(hint).toHaveCSS('opacity', '1');
      await expect.poll(() => fades(units)).toEqual(AT_REST);
      await swipe(units, 0.5);
      await expect(hint).toHaveCSS('opacity', '0');
    });
  });
});

/**
 * A Phone crop an Editor uploads beside a screen's picture (ticket 79). On a
 * phone each language shows its uploaded crop if there is one; otherwise the
 * exported crop, while the screen is not replaced; otherwise the replaced
 * picture whole, to swipe — never an exported crop of a screen that has
 * changed. An uploaded crop opens the language's current whole screen: the
 * replacement if there is one. The English pages are checked the same way in
 * `english-pages.spec.ts`, which can preview them.
 */
test.describe('a Phone crop an Editor uploads', () => {
  test.use({ viewport: { width: 390, height: 812 } });

  const OPEN = 'اضغط لرؤية الشاشة كاملة';
  const HINT = 'اسحب لرؤية الشاشة كاملة';

  test('is what a phone shows; without one, the exported crop, or a replaced screen whole', async ({ page, cms }) => {
    const screenMocks = cms.entry('screen-mocks');
    const mocks = await screenMocks.published();
    // The size the export makes a crop at.
    const crop = await uploadImage(page.request, 'صورة مقرّبة للهاتف', phoneCropExportSize(SCREEN_MOCKS[0]));
    const picture = await uploadImage(page.request, 'شاشة بديلة', { width: 2880, height: 1800 });
    const [cropFiles, pictureFiles] = [await mediaFiles(page.request, crop), await mediaFiles(page.request, picture)];
    const changed = (mock: string, change: Partial<MockFields>) => ({
      [screenMockFieldName(mock)]: { ...screen(mocks, mock), ...change },
    });

    // The journey's first four panels, one case each.
    await screenMocks.draft({
      ...mocks,
      ...changed('correspondence', { phoneCrop: crop }),
      ...changed('kanban', { picture, phoneCrop: crop }),
      ...changed('daily-report', { picture }),
      // The English pages' crop, which the Arabic pages never show.
      ...changed('documents', { englishPhoneCrop: crop }),
    });
    await cms.preview('/product');
    const frame = (mock: string) => frameShowing(page, '#journey .ui', mock);

    // An uploaded crop over the export opens the export whole.
    await expectPhoneCrop(page, frame('correspondence'), {
      crop: cropFiles,
      whole: ['/screen-mocks/ar/correspondence.webp'],
      open: OPEN,
    });
    // Beside a replacement, it opens the replacement.
    await expectPhoneCrop(page, frame('kanban'), { crop: cropFiles, whole: pictureFiles, open: OPEN });
    // A replacement with no crop is shown whole, to swipe.
    await expectWholeToSwipe(frame('daily-report'), { whole: pictureFiles, hint: HINT });
    // Neither replaced nor cropped in Arabic: the export's own crop.
    await expectPhoneCrop(page, frame('documents'), {
      crop: ['/screen-mocks/ar/phone/documents.webp'],
      whole: ['/screen-mocks/ar/documents.webp'],
      open: OPEN,
    });

    // The home page's units show an uploaded crop the same way.
    await cms.preview('/');
    await expectPhoneCrop(page, frameShowing(page, '#jt .jt-shot.on', 'correspondence'), {
      crop: cropFiles,
      whole: ['/screen-mocks/ar/correspondence.webp'],
      open: OPEN,
    });

    // Wider than a phone, an uploaded crop is never shown: each is its whole screen.
    await page.setViewportSize({ width: 768, height: 1024 });
    await cms.preview('/product');
    for (const [mock, whole] of [
      ['correspondence', ['/screen-mocks/ar/correspondence.webp']],
      ['kanban', pictureFiles],
    ] as const) {
      const shown = frame(mock).locator('img[data-screen-mock]');
      await shown.scrollIntoViewIfNeeded();
      expect(whole, mock).toContain(await drawnFrom(shown));
    }
  });
});

test('the CMS refuses what the product page, the closing section and the screens cannot carry', async ({ page, cms }) => {
  const productPage = cms.entry('product-page');
  const closingSection = cms.entry('closing-section');
  const screenMocks = cms.entry('screen-mocks');
  const product = await productPage.published();
  const closing = await closingSection.published();
  const mocks = await screenMocks.published();
  const { journey, customStrip, roles, innerCycle } = product;
  const [panel, ...otherPanels] = journey.panels;
  const [card, ...otherCards] = customStrip.features;
  const [step, ...otherSteps] = closing.closing.steps;
  const party: FlowItem = { party: arabic('المالك'), after: 'towards' };
  const otherShape = await uploadImage(page.request, 'صورة بمقاس آخر', { width: 1600, height: 900 });
  const tooSmall = await uploadImage(page.request, 'صورة أصغر من مكانها', { width: 720, height: 450 });
  const larger = await uploadImage(page.request, 'صورة بضعف المقاس', { width: 2880, height: 1800 });
  // The crop's shape, at half and at twice the size the export makes it.
  const exportedCrop = phoneCropExportSize(SCREEN_MOCKS[0]);
  const smallCrop = await uploadImage(page.request, 'صورة مقرّبة صغيرة', { width: exportedCrop.width / 2, height: exportedCrop.height / 2 });
  const largerCrop = await uploadImage(page.request, 'صورة مقرّبة أكبر', { width: exportedCrop.width * 2, height: exportedCrop.height * 2 });

  // What is refused, where it is saved, what is sent, and the field it breaks.
  const refused: [string, Global, object, string | RegExp][] = [
    ['two parties', 'product-page', { ...product, roles: { ...roles, roles: roles.roles.slice(0, 2) } }, 'roles.roles'],
    ['four parties', 'product-page', { ...product, roles: { ...roles, roles: [...roles.roles, roles.roles[0]] } }, 'roles.roles'],
    [
      'four review cycles',
      'product-page',
      { ...product, innerCycle: { ...innerCycle, cycles: [...innerCycle.cycles, innerCycle.cycles[0]] } },
      'innerCycle.cycles',
    ],
    ['no panels', 'product-page', { ...product, journey: { ...journey, panels: [] } }, 'journey.panels'],
    [
      'a panel title longer than a panel holds',
      'product-page',
      { ...product, journey: { ...journey, panels: [{ ...panel, title: arabic(wordsOfLength(41)) }, ...otherPanels] } },
      'journey.panels.0.title.ar',
    ],
    [
      'five parties under a panel',
      'product-page',
      { ...product, journey: { ...journey, panels: [{ ...panel, flow: Array(5).fill(party) }, ...otherPanels] } },
      'journey.panels.0.flow',
    ],
    [
      "a journey heading longer than its line",
      'product-page',
      { ...product, journey: { ...journey, heading: arabic(wordsOfLength(41)) } },
      'journey.heading.ar',
    ],
    [
      'a card title that would run under the badge',
      'product-page',
      { ...product, customStrip: { ...customStrip, features: [{ ...card, title: arabic(wordsOfLength(33)) }, ...otherCards] } },
      'customStrip.features.0.title.ar',
    ],
    ['English with no English words', 'product-page', { ...product, languages: ['ar', 'en'] }, /\.en$/],
    [
      'six closing steps',
      'closing-section',
      { ...closing, closing: { ...closing.closing, steps: Array(6).fill(step) } },
      'closing.steps',
    ],
    [
      'a closing step label too long for its line',
      'closing-section',
      { ...closing, closing: { ...closing.closing, steps: [{ ...step, label: arabic(wordsOfLength(11)) }, ...otherSteps] } },
      'closing.steps.0.label.ar',
    ],
    // The answer-first rule (ticket 35): the paragraph under these two
    // headings is what an assistant lifts and quotes, so it is held to a
    // standalone answer of 30 to 60 words rather than only to a length.
    [
      'an opening answer of 29 words under the parties',
      'product-page',
      { ...product, roles: { ...roles, lead: arabic(wordsCounting(29)) } },
      'roles.lead.ar',
    ],
    [
      'an opening answer of 61 words inside each party',
      'product-page',
      { ...product, innerCycle: { ...innerCycle, lead: arabic(wordsCounting(61)) } },
      'innerCycle.lead.ar',
    ],
    [
      'a replacement of another shape',
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, picture: otherShape } },
      'correspondence.picture',
    ],
    [
      'a replacement smaller than its place',
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, picture: tooSmall } },
      'correspondence.picture',
    ],
    [
      'an English pages replacement of another shape',
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, englishPicture: otherShape } },
      'correspondence.englishPicture',
    ],
    // A Phone crop keeps the export's crop shape, at the size the export
    // makes it or larger (ticket 79).
    [
      "a Phone crop of the whole screen's shape",
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, phoneCrop: larger } },
      'correspondence.phoneCrop',
    ],
    [
      'a Phone crop smaller than the export makes one',
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, phoneCrop: smallCrop } },
      'correspondence.phoneCrop',
    ],
    [
      'an English pages Phone crop of another shape',
      'screen-mocks',
      { ...mocks, correspondence: { ...mocks.correspondence, englishPhoneCrop: otherShape } },
      'correspondence.englishPhoneCrop',
    ],
    [
      'a screen with no description',
      'screen-mocks',
      { ...mocks, kanban: { ...mocks.kanban, description: arabic('') } },
      'kanban.description.ar',
    ],
  ];
  for (const [what, global, data, field] of refused) {
    // Sent as it stands: what the CMS is to refuse need not be an entry it would take.
    const response = await cms.entry(global).attempt(data as never, 'published');
    expect(response.status(), `${what} (${field}): ${await response.text()}`).toBe(400);
  }

  // A picture of the mock's shape, larger, and a crop larger than the export
  // makes, are not what gets refused. Published beside a fault of their own, so that
  // nothing is saved either way; the refusal names the one screen at fault, by
  // its tab, and not the one beside it.
  const beside = await screenMocks.attempt(
    {
      ...mocks,
      correspondence: { ...mocks.correspondence, picture: larger, phoneCrop: largerCrop, englishPhoneCrop: largerCrop },
      kanban: { ...mocks.kanban, description: arabic('') },
    },
    'published',
  );
  const refusal = await beside.text();
  expect(beside.status(), refusal).toBe(400);
  expect(refusal).toContain('لوحة الاعتمادات والطلبات');
  expect(refusal).not.toContain('المراسلات الرسمية');

  // Nothing refused was kept.
  expect(await productPage.published()).toEqual(product);
  expect(await closingSection.published()).toEqual(closing);
  expect(await screenMocks.published()).toEqual(mocks);

  // And each entry, as published, is accepted: so each refusal above was for
  // the one thing it changed. Said this way because Payload does not always
  // send back the list of fields it refused, only its message. Publishing an
  // entry unchanged changes nothing a visitor or a suite beside this one sees.
  await productPage.publish(product);
  await closingSection.publish(closing);
  await screenMocks.publish(mocks);
});

test('the journey and the closing section have no switch to hide them; the custom strip has one', async ({ page, cms }) => {

  const admin = await cms.openInAdmin('product-page');
  await admin.openSection('Custom strip');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();
  await admin.openSection('Units');
  await expect(page.getByText(/Always shows/)).toBeVisible();
  await expect(page.getByLabel('Shows on the page')).toHaveCount(0);

  // Its own entry, and the one page global of a single section: with no other
  // tab there is no click for the admin to undo, so it needs no
  // `cms.openInAdmin` (`entries.ts`).
  await page.goto(`${ADMIN_PATH}/globals/closing-section`);
  await expect(page.getByText(/Always shows/)).toBeVisible();
  await expect(page.getByLabel('Shows on the page')).toHaveCount(0);
});

test("each screen has a Phone crop upload beside each language's picture, which says what a Phone crop is", async ({ page, cms }) => {
  const admin = await cms.openInAdmin('screen-mocks');
  await admin.openSection('Correspondence');

  const uploads = page.locator('.field-type.upload');
  await expect(uploads.locator('.field-label')).toHaveText([
    'Replacement picture, Arabic pages',
    'Phone crop, Arabic pages',
    'Replacement picture, English pages',
    'Phone crop, English pages',
  ]);
  for (const crop of [uploads.nth(1), uploads.nth(3)]) {
    const help = crop.locator('.field-description');
    await expect(help).toContainText('too small to read');
    await expect(help).toContainText('1040×1300');
    await expect(help).toContainText('Without one, phones show the replacement picture whole, for visitors to swipe across.');
  }
});

test('on the smallest windows that pin the journey, every panel holds its words at their longest', async ({ page, cms }) => {
  const productPage = cms.entry('product-page');
  const entry = await productPage.published();
  // Every panel at every limit: the longest title, line and text, and four
  // parties with an arrow and a break between them.
  const panels = entry.journey.panels.map((panel): Panel => ({
    ...panel,
    title: arabic(wordsOfLength(40)),
    tagline: arabic(wordsOfLength(80)),
    body: arabic(wordsOfLength(200)),
    flow: [0, 1, 2, 3].map((index) => ({
      party: arabic(wordsOfLength(16)),
      after: index === 1 ? 'then' : 'towards',
    })),
  }));

  await productPage.draft({ ...entry, journey: { ...entry.journey, heading: arabic(wordsOfLength(40)), panels } });

  for (const viewport of [
    { width: 981, height: 551 },
    { width: 1280, height: 551 },
  ]) {
    await page.setViewportSize(viewport);
    await cms.preview('/product');
    await page.evaluate(() => document.fonts.ready);

    // Polled: the room under the heading is measured once the fonts have
    // settled its height.
    await expect
      .poll(
        () =>
          page.locator('#journey').evaluate((section) => {
            const heading = section.querySelector('h2')!.getBoundingClientRect();
            return [...section.querySelectorAll('.panel')].map((panel) => {
              const box = panel.getBoundingClientRect();
              const inner = box.bottom - parseFloat(getComputedStyle(panel).paddingBottom);
              const words = [...panel.querySelector(':scope > div:first-child')!.children].at(-1)!;
              return {
                clearOfHeading: heading.bottom <= box.top,
                // A panel sized to the window it pins in, wherever the page is scrolled.
                asTallAsTheWindowAllows: box.height <= window.innerHeight,
                wordsInside: words.getBoundingClientRect().bottom <= inner + 0.5,
              };
            });
          }),
        { message: `at ${viewport.width}x${viewport.height}` },
      )
      .toEqual(panels.map(() => ({ clearOfHeading: true, asTallAsTheWindowAllows: true, wordsInside: true })));
  }
});

test('a custom strip card title at its longest stays clear of the badge at desktop widths', async ({ page, cms }) => {
  const productPage = cms.entry('product-page');
  // On a phone the Reference site's badge already sits over today's titles;
  // the limit keeps a card as clear as it is today where it is clear today.
  // Three cards: two side by side, the narrowest a card gets, and one across
  // the row.
  const entry = await productPage.published();
  const features = [...entry.customStrip.features, entry.customStrip.features[0]].map((feature) => ({
    ...feature,
    title: arabic(wordsOfLength(32)),
  }));

  await productPage.draft({ ...entry, customStrip: { ...entry.customStrip, features } });

  for (const width of [981, 1024, 1280, 1440, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await cms.preview('/product');
    await page.evaluate(() => document.fonts.ready);
    const underBadge = await page.locator('#custom .strip .c').evaluateAll((cards) =>
      cards.map((card) => {
        const badge = card.querySelector('.badge')!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(card.querySelector('h3')!);
        return [...range.getClientRects()].some(
          (line) => line.left < badge.right && line.right > badge.left && line.top < badge.bottom && line.bottom > badge.top,
        );
      }),
    );
    expect(underBadge, `at ${width}px`).toEqual(features.map(() => false));
  }
});

test('a change to the product page published reaches visitors', async ({ page, request, cms }) => {
  const productPage = cms.entry('product-page');
  const entry = await productPage.published();
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.hero.lead.ar} `;

  await productPage.publish({ ...entry, hero: { ...entry.hero, lead: { ...entry.hero.lead, ar: lead } } });
  await reachesVisitors(request, '/product', `${lead}</p>`, "the product page's reworded paragraph");
});

/**
 * The English descriptions, among the entry's versions (ticket 41): this suite
 * drafts and discards all the while, so the proposal is seldom still the
 * newest version by the time a test looks.
 */
async function englishProposal(screenMocks: CmsEntry<'screen-mocks'>): Promise<Mocks> {
  const proposal = (await screenMocks.drafts()).find(
    ({ version }) => version.correspondence?.description.en === ENGLISH_SCREEN_MOCK_DESCRIPTIONS.correspondence,
  );
  expect(proposal, 'no draft carries the English descriptions proposed').toBeTruthy();
  return proposal!.version;
}

test('the English descriptions of the screens wait as a draft, and the CMS publishes every word of them', async ({
  page,
  request,
  cms,
}) => {
  const screenMocks = cms.entry('screen-mocks');
  const mocks = await screenMocks.published();
  const proposal = await englishProposal(screenMocks);

  // In English as well as Arabic, each screen described in both, and the
  // Arabic untouched: the draft is the published entry with English added.
  expect(proposal.languages).toEqual(['ar', 'en']);
  for (const mock of SCREEN_MOCKS) {
    expect(screen(proposal, mock.id).description.en, mock.id).toBe(ENGLISH_SCREEN_MOCK_DESCRIPTIONS[mock.id]);
    expect(screen(proposal, mock.id).description.ar, mock.id).toBe(screen(mocks, mock.id).description.ar);
  }

  // Nothing a visitor reads is in it.
  expect(await visitorHtml(request, '/product')).not.toContain(ENGLISH_SCREEN_MOCK_DESCRIPTIONS.correspondence);

  // And the CMS takes it as it stands, when the founder presses Publish: every
  // English word fits its place. Published, then put straight back. Nothing a
  // visitor or another suite reads changes in between: the Arabic is the
  // published Arabic, and no page shows a screen in English until ticket 42.
  await screenMocks.publish(proposal);
  await screenMocks.restore();
  expect(await screenMocks.published()).toEqual(mocks);
});
