/**
 * The Company profile's sections 06 to 08 (ticket 107), Ahmed's in the site's
 * style: our solution, three party cards round the documented Record; the
 * platform, four tabs each showing the site's own Screen mock of its unit,
 * with its Phone crop on a phone; and the documented Record, Ahmed's
 * illustrative timeline card. Every word is an Editor's, and each section has
 * its own switch.
 *
 * The profile is unpublished on this server (`profile-page.spec.ts` publishes
 * it on the second), so everything here is seen as an Editor previews it, and
 * nothing is published: each change is a draft of the profile's entry, which
 * no other suite on this server previews.
 *
 * Ahmed's words are restated from his profile (`.scratch/company-profile/source/`)
 * rather than imported from the migration, for the reason `routes.ts` gives.
 */
import type { Page } from '@playwright/test';
import { test, expect } from './entries';
import { sidewaysOverflow, whatOverflows } from './geometry';
import { drawnFrom, expectPhoneCrop } from './screen-mock-phone';

test.describe.configure({ mode: 'default' });

const PARTIES = {
  eyebrow: 'حلّنا',
  title: 'نغلق الفجوة بين أطراف المشروع.',
  lead: 'معظم البرمجيات تخدم طرفاً واحداً. ربائد تجمع المالك والاستشاري والمقاول على سجل واحد، ولكل طرف مراجعته الداخلية التي لا تراها الأطراف الأخرى.',
  cards: [
    ['مالك المشروع', 'يريد التسليم في موعده'],
    ['الاستشاري الهندسي', 'يريد ضمان الجودة'],
    ['المقاول الرئيسي', 'يريد ضبط التكلفة'],
  ],
  record: 'السجل الموثّق',
  footer: 'معادلة رابحة للأطراف الثلاثة.',
};

const PLATFORM = {
  eyebrow: 'المنصة',
  title: 'أربع وحدات. سجل واحد يجمعها.',
  lead: 'كل وحدة تخدم المالك والاستشاري والمقاول في موضعه، ومخرجها واحد: السجل الموثّق.',
  units: [
    {
      mock: 'correspondence',
      name: 'المراسلات الرسمية',
      text: 'خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف. وإذا ترك مدير المشروع العمل، تبقى الخطابات في سجل المشروع.',
    },
    {
      mock: 'kanban',
      name: 'الاعتمادات والطلبات',
      text: 'مسودة، ثم مراجعة داخلية، ثم اعتماد. التصعيد والتنبيهات تلقائية، وكل خطوة باسم صاحبها ووقتها. ويُصدَّر كل اعتماد PDF برقم مرجعي ورمز تحقق.',
    },
    {
      mock: 'daily-report',
      name: 'التقرير اليومي للموقع',
      text: 'العمالة والمعدات والأنشطة والمواد والصور، وتقارير أسبوعية وشهرية تُنشأ تلقائياً.',
    },
    {
      mock: 'documents',
      name: 'المستندات والإصدارات',
      text: 'أحدث إصدار دائماً، مع كل الإصدارات السابقة ومن رفعها، ومتاحة فوراً عند أي مطالبة أو نزاع.',
    },
  ],
  output: 'المخرَج: السجل الموثّق. كل طلب واعتماد مؤرخ باسم من قام به.',
};

const RECORD = {
  eyebrow: 'السجل الموثّق',
  title: 'لا نسأل «من اعتمد؟». نفتح المعاملة.',
  body: 'السجل في ربائد ليس ميزة تُفعَّل، بل نتيجة كل خطوة. أي معاملة تمر في المنصة تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب استلام أعمال، أو تحديث على الجدول الزمني. وبعد نهاية المشروع، السجل نفسه ما زال هناك.',
  code: 'LTR-088',
  doc: 'خطاب: طلب تمديد مدة',
  illustrative: 'مثال توضيحي',
  steps: [
    ['أُرسل', 'م. فهد · المقاول', '08:15'],
    ['استُلم', 'إشعار استلام تلقائي', '08:15'],
    ['دُقّق', 'م. سارة · الاستشاري', '13:40'],
    ['رُدّ عليه', '«يُمنح 14 يوماً» · المالك', '11:05'],
  ],
  summary: 'سجل كامل · 4 خطوات · 3 أطراف',
};

/** The words on a Phone crop's button (`phone-crops.spec.ts`). */
const OPEN = 'اضغط لرؤية الشاشة كاملة';

const section = (page: Page, id: string) => page.locator(`section#${id}`);
const tab = (page: Page, index: number) => section(page, 'platform').getByRole('tab').nth(index);
const panel = (page: Page, index: number) => section(page, 'platform').getByRole('tabpanel', { includeHidden: true }).nth(index);

/** The platform showing its `index`th unit, and no other: its tab chosen and its words, screen and caption showing. */
async function expectShowing(page: Page, index: number) {
  for (const [other, unit] of PLATFORM.units.entries()) {
    const chosen = other === index;
    await expect(tab(page, other)).toHaveAttribute('aria-selected', String(chosen));
    const text = tab(page, other).locator('.pf-unit-text');
    const picture = panel(page, other).locator(`img[data-screen-mock="${unit.mock}"]`);
    if (chosen) {
      await expect(text).toBeVisible();
      await expect(picture).toBeVisible();
      await expect(panel(page, other).locator('.shot-cap')).toBeVisible();
    } else {
      await expect(text).toBeHidden();
      await expect(picture).toBeHidden();
    }
  }
}

/** Where a masked icon of Ahmed's is drawn from: `/profile/icons/owner.png`. */
const iconsOf = (icons: ReturnType<Page['locator']>) =>
  icons.evaluateAll((marks) =>
    marks.map(
      (mark) =>
        /url\("?([^")]+)"?\)/.exec(getComputedStyle(mark).maskImage || getComputedStyle(mark).webkitMaskImage)?.[1]?.replace(/^.*\/profile\//, '/profile/') ?? '',
    ),
  );

test('06, our solution: the lead, the three parties with what each wants, and the documented Record at their centre', async ({
  page,
  cms,
}) => {
  await cms.preview('/profile');
  const parties = section(page, 'parties');
  await expect(parties.locator('.eyebrow')).toContainText('06');
  await expect(parties.locator('.eyebrow')).toContainText(PARTIES.eyebrow);
  await expect(parties.locator('h2')).toHaveText(PARTIES.title);
  await expect(parties.locator('.lead')).toHaveText(PARTIES.lead);
  await expect(parties.locator('li h3')).toHaveText(PARTIES.cards.map(([name]) => name));
  await expect(parties.locator('li p')).toHaveText(PARTIES.cards.map(([, want]) => want));
  await expect(parties.locator('.pf-centre strong')).toHaveText(PARTIES.record);
  await expect(parties.locator('.pf-centre p')).toHaveText(PARTIES.footer);
  // A dark section: the header stays dark over it.
  await expect(parties).not.toHaveClass(/\blight\b/);

  // Each party's icon is Ahmed's, by its place, and is served.
  const icons = await iconsOf(parties.locator('li .pf-icon'));
  expect(icons).toEqual(['owner', 'consultant', 'contractor'].map((name) => `/profile/icons/${name}.png`));
  for (const icon of icons) {
    const file = await page.request.get(icon);
    expect(file.status(), icon).toBe(200);
    expect(file.headers()['content-type']).toBe('image/png');
  }

  // Every word is the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [owner, ...rest] = saved.parties.cards;
  await profile.draft({
    ...saved,
    parties: {
      ...saved.parties,
      cards: [{ ...owner!, want: { ...owner!.want, ar: 'يريد وضوح الصورة' } }, ...rest],
      record: { ...saved.parties.record, ar: 'سجل المشروع' },
    },
  });
  await cms.preview('/profile');
  await expect(parties.locator('li p').first()).toHaveText('يريد وضوح الصورة');
  await expect(parties.locator('.pf-centre strong')).toHaveText('سجل المشروع');
});

test('07, the platform: its words, every unit and every screen in the first response, the first unit chosen', async ({ page, cms }) => {
  await cms.preview('/profile');
  // What the server sends, before any script runs.
  const html = await (await page.reload())!.text();
  for (const unit of PLATFORM.units) {
    expect(html).toContain(unit.name);
    expect(html).toContain(unit.text);
    expect(html).toContain(`data-screen-mock="${unit.mock}"`);
  }

  const platform = section(page, 'platform');
  await expect(platform.locator('.eyebrow')).toContainText('07');
  await expect(platform.locator('.eyebrow')).toContainText(PLATFORM.eyebrow);
  await expect(platform.locator('h2')).toHaveText(PLATFORM.title);
  await expect(platform.locator('.lead')).toHaveText(PLATFORM.lead);
  await expect(platform.locator('.pf-output')).toHaveText(PLATFORM.output);
  await expect(platform).not.toHaveClass(/\blight\b/);

  // A tab is named by its unit; what the unit does is its description.
  await expect(platform.getByRole('tablist')).toHaveAccessibleName(PLATFORM.title);
  for (const [index, unit] of PLATFORM.units.entries()) {
    await expect(tab(page, index)).toHaveAccessibleName(unit.name);
  }
  await expect(tab(page, 0)).toHaveAccessibleDescription(PLATFORM.units[0]!.text);

  await platform.scrollIntoViewIfNeeded();
  await expectShowing(page, 0);
});

test('07: a click chooses a unit', async ({ page, cms }) => {
  await cms.preview('/profile');
  await section(page, 'platform').scrollIntoViewIfNeeded();

  for (const index of [2, 1, 3, 0]) {
    await tab(page, index).click();
    await expectShowing(page, index);
  }
});

test('07: the arrow keys move between units in the reading direction, and wrap round', async ({ page, cms }) => {
  await cms.preview('/profile');

  await tab(page, 0).focus();
  // Reading right to left, the next unit is to the left.
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 1)).toBeFocused();
  await expectShowing(page, 1);

  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 0)).toBeFocused();
  await expectShowing(page, 0);

  // Back from the first is the last.
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 3)).toBeFocused();
  await expectShowing(page, 3);
});

test('07 in English: Ahmed’s English words, and the next unit is to the right', async ({ page, cms }) => {
  await cms.preview('/en/profile');
  const platform = section(page, 'platform');
  await expect(platform.locator('h2')).toHaveText('Four units. One record gathers them.');
  await expect(tab(page, 1)).toHaveAccessibleName('Approvals and requests');

  await tab(page, 0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 1)).toBeFocused();
  await expect(tab(page, 1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 3)).toBeFocused();
  await expect(tab(page, 3)).toHaveAttribute('aria-selected', 'true');
  // The English pages' own screens (ticket 41).
  const picture = panel(page, 3).locator('img[data-screen-mock]');
  expect(await drawnFrom(picture)).toBe('/screen-mocks/en/documents.webp');
});

test('07: each unit shows the site’s own Screen mock of it, described by its caption', async ({ page, cms }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await cms.preview('/profile');
  await section(page, 'platform').scrollIntoViewIfNeeded();

  for (const [index, unit] of PLATFORM.units.entries()) {
    await tab(page, index).click();
    const picture = panel(page, index).locator('img[data-screen-mock]');
    await expect(picture).toHaveAttribute('data-screen-mock', unit.mock);
    expect(await drawnFrom(picture)).toBe(`/screen-mocks/ar/${unit.mock}.webp`);
    // ADR-0002: what it shows is said again in words, the Screen mocks entry's.
    const description = await picture.getAttribute('alt');
    expect(description).toMatch(/.{20,}/);
    await expect(panel(page, index).locator('.shot-cap')).toHaveText(description!);
  }
});

test('07 on a phone: each unit’s screen is its Phone crop, which opens the whole screen', async ({ page, cms }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await cms.preview('/profile');

  for (const [index, unit] of PLATFORM.units.entries()) {
    await tab(page, index).click();
    await expectPhoneCrop(page, panel(page, index), {
      crop: [`/screen-mocks/ar/phone/${unit.mock}.webp`],
      whole: [`/screen-mocks/ar/${unit.mock}.webp`],
      open: OPEN,
    });
    // Nothing of it reaches past the screen.
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  }
});

test('07: each unit’s name and text, and the output line, are the Editor’s; its screen stays in its place', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [first, kanban, ...rest] = saved.platform.units;
  await profile.draft({
    ...saved,
    platform: {
      ...saved.platform,
      units: [first!, { ...kanban!, name: { ...kanban!.name, ar: 'الاعتمادات' }, text: { ...kanban!.text, ar: 'نص المحرر.' } }, ...rest],
      output: { ...saved.platform.output, ar: 'مخرج المحرر.' },
    },
  });
  await cms.preview('/profile');
  await expect(tab(page, 1)).toHaveAccessibleName('الاعتمادات');
  await tab(page, 1).click();
  await expect(tab(page, 1).locator('.pf-unit-text')).toHaveText('نص المحرر.');
  await expect(panel(page, 1).locator('img[data-screen-mock]')).toHaveAttribute('data-screen-mock', 'kanban');
  await expect(section(page, 'platform').locator('.pf-output')).toHaveText('مخرج المحرر.');
});

test('08, the documented Record: Ahmed’s illustrative timeline card, on a light ground', async ({ page, cms }) => {
  await cms.preview('/profile');
  const record = section(page, 'record');
  await expect(record.locator('.eyebrow')).toContainText('08');
  await expect(record.locator('.eyebrow')).toContainText(RECORD.eyebrow);
  await expect(record.locator('h2')).toHaveText(RECORD.title);
  await expect(record.locator('.lead')).toHaveText(RECORD.body);
  // The header turns light over it (ticket 104).
  await expect(record).toHaveClass(/\blight\b/);

  const card = record.locator('.pf-trail');
  await expect(card.locator('.pf-trail-code')).toHaveText(RECORD.code);
  await expect(card.locator('.pf-trail-doc')).toHaveText(RECORD.doc);
  await expect(card.locator('.pf-trail-tag')).toHaveText(RECORD.illustrative);
  await expect(card.locator('li .pf-step-verb')).toHaveText(RECORD.steps.map(([verb]) => verb));
  await expect(card.locator('li .pf-step-who')).toHaveText(RECORD.steps.map(([, who]) => who));
  await expect(card.locator('li time')).toHaveText(RECORD.steps.map(([, , time]) => time));
  await expect(card.locator('.pf-trail-sum')).toHaveText(RECORD.summary);
  expect(await iconsOf(card.locator('.pf-icon'))).toEqual(['/profile/icons/shield.png']);

  // Every step's words are the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [sent, received, checked, answered] = saved.record.steps;
  await profile.draft({
    ...saved,
    record: {
      ...saved.record,
      code: 'RFI-012',
      steps: [sent!, received!, { ...checked!, who: { ...checked!.who, ar: 'م. نورة · الاستشاري' }, time: '09:30' }, answered!],
      summary: { ...saved.record.summary, ar: 'ملخص المحرر' },
    },
  });
  await cms.preview('/profile');
  await expect(card.locator('.pf-trail-code')).toHaveText('RFI-012');
  await expect(card.locator('li .pf-step-who').nth(2)).toHaveText('م. نورة · الاستشاري');
  await expect(card.locator('li time').nth(2)).toHaveText('09:30');
  await expect(card.locator('.pf-trail-sum')).toHaveText('ملخص المحرر');
});

// The home page's Record is `#record` too, and its rules there are written to
// the id: 220vh tall on a desktop, a held stretch after it on a phone, dark,
// its paragraph dimmed (`home.css`). The profile's is a section like any other.
for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test(`08 at ${viewport.width}px is as tall as what it holds, on the light ground, none of the home page’s Record reaching it`, async ({
    page,
    cms,
  }) => {
    await page.setViewportSize(viewport);
    await cms.preview('/profile');
    const record = section(page, 'record');
    await record.scrollIntoViewIfNeeded();
    const look = await record.evaluate((element) => {
      const style = getComputedStyle(element);
      const wrap = element.querySelector('.wrap')!.getBoundingClientRect().height;
      return {
        extra: element.getBoundingClientRect().height - wrap - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
        after: getComputedStyle(element, '::after').content,
        background: style.backgroundColor,
        lead: getComputedStyle(element.querySelector('.lead')!).opacity,
      };
    });
    expect(look.extra).toBeLessThanOrEqual(1);
    expect(['none', 'normal']).toContain(look.after);
    expect(look.background).toBe('rgb(250, 250, 248)');
    expect(look.lead).toBe('1');
  });
}

test('each of the three hides with its own switch, and the others keep their numbers', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const ids = ['parties', 'platform', 'record'] as const;

  for (const hidden of ids) {
    await profile.draft({ ...saved, [hidden]: { ...saved[hidden], shows: false } });
    await cms.preview('/profile');
    await expect(section(page, hidden), hidden).toHaveCount(0);
    for (const [index, shown] of ids.entries()) {
      if (shown === hidden) continue;
      await expect(section(page, shown).locator('.pf-num'), `${shown} with ${hidden} hidden`).toHaveText(`0${index + 6}`);
    }
  }
});

for (const phone of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`at ${phone.width}px, nothing in the three sections reaches past the screen`, async ({ page, cms }) => {
    await page.setViewportSize(phone);
    await cms.preview('/profile');
    for (const id of ['parties', 'platform', 'record']) {
      await section(page, id).scrollIntoViewIfNeeded();
      // What sticks out, though the page clips it: the three sections' own.
      const past = (await whatOverflows(page)).filter((culprit) => culprit.startsWith(`#${id} `));
      expect(past, `#${id}`).toEqual([]);
      expect(await sidewaysOverflow(page), `#${id}`).toBeLessThanOrEqual(0);
    }
  });
}
