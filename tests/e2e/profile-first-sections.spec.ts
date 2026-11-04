/**
 * The Company profile's first four sections (ticket 105), Ahmed's 01 to 04 in
 * the site's style: the truth, with his redacted paper photo and its three red
 * notes; the real site's three figures, which count up as they come into view;
 * the trap's four tool cards; and who we are, with its quote. Every word is an
 * Editor's, and each section has its own switch.
 *
 * The profile is unpublished on this server (`profile-page.spec.ts` publishes
 * it on the second), so everything here is seen as an Editor previews it, and
 * nothing is published: each change is a draft of the profile's entry.
 * `profile-solution-sections.spec.ts` drafts the same entry on this server,
 * so the two take turns (`oneSuiteAtATime`).
 *
 * Ahmed's words are restated from his profile (`.scratch/company-profile/source/`)
 * rather than imported from the migration, for the reason `routes.ts` gives.
 */
import type { Page } from '@playwright/test';
import { transparentMark, uploadFile } from './cms';
import { test, expect } from './entries';
import { sidewaysOverflow, whatOverflows } from './geometry';
import { oneSuiteAtATime } from './one-suite-at-a-time';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

const TRUTH = {
  eyebrow: 'الحقيقة كما هي',
  title: 'اعتماداتكم مبعثرة في قصاصات ورق.',
  body: 'كل طلب اعتماد وكل خطاب رسمي: ملاحظات بخط اليد، أختام، صورة بالجوال، ثم ملف ضائع بين الإيميل والواتساب وSharePoint. حتى يأتي اليوم الذي تحتاجون فيه إثبات ما حدث في الموقع.',
  caption: 'طلب اعتماد مواد حقيقي من مشروع سكني، أبريل 2023. الأسماء والأختام مخفية.',
  notes: ['REV 00… هل هي الأخيرة؟', 'ملاحظات فوق الحقول… من يقرأها؟', 'وعند من الآن؟'],
};

const NUMBERS = {
  eyebrow: 'الموقع الحقيقي',
  title: 'الأرقام التي تكشف الفوضى.',
  figures: ['35%', '30%', '95%'],
  labels: [
    'من وقت فريق المشروع يذهب في الأعمال الورقية وجمع البيانات',
    'من تأخيرات مشاريع البناء سببها الأعمال الورقية',
    'من بيانات البناء تذهب دون استخدام',
  ],
  source: 'المصدر: بيانات مشاريع ربائد',
};

const TRAP = {
  eyebrow: 'الفخ',
  title: 'نعم، المهندس المحترف قادر على ترتيب الفوضى.',
  body: 'لكن ذلك يستهلك ضعف الجهد والوقت. تدفعون رواتب كوادر محترفة لتنظيم الأوراق، لا للتفرغ لأعمال الموقع.',
  kicker: 'المشكلة ليست البريد الإلكتروني ولا الإكسل. المشكلة أن الإجراء تحتها يدوي ومشتّت.',
  tools: [
    ['WhatsApp', 'قرارات المشروع مدفونة في محادثات لا يمكن تتبّعها أو تدقيقها'],
    ['البريد الإلكتروني', 'معلومات مجزأة تضيع فيها القرارات والمسؤوليات'],
    ['Excel', 'غير متزامن، ويحتاج تحديثاً يدوياً بعد كل اعتماد'],
    ['SharePoint', 'جهد يدوي ثقيل لتخزين بيانات لا يمكن الاستفادة منها'],
  ],
};

const ABOUT = {
  eyebrow: 'من نحن',
  title: ['لم نسمع بهذه المشاكل فقط.', 'عشناها.'],
  body: 'نحن مهندسون ومديرو مشاريع أمضينا سنوات في الميدان، نواجه نفس التأخيرات والاتصالات الضائعة والأعمال الورقية التي لا تنتهي، والتي تواجهونها كل يوم.',
  quote: 'لذلك قررنا أن نبني المنصة التي طالما تمنّينا وجودها.',
};

const section = (page: Page, id: string) => page.locator(`section#${id}`);
/** The figures as drawn, which is what counts up; each is also there, whole, for a screen reader. */
const figures = (page: Page) => section(page, 'numbers').locator('[data-count-up]');

test('01, the truth: Ahmed’s words, and his redacted paper photo with its three red notes and caption', async ({ page, cms }) => {
  await cms.preview('/profile');
  const truth = section(page, 'truth');
  await expect(truth.locator('.eyebrow')).toContainText('01');
  await expect(truth.locator('.eyebrow')).toContainText(TRUTH.eyebrow);
  await expect(truth.locator('h2')).toHaveText(TRUTH.title);
  await expect(truth.locator('.lead')).toHaveText(TRUTH.body);
  await expect(truth.locator('figcaption')).toHaveText(TRUTH.caption);
  await expect(truth.locator('.pf-note')).toHaveText(TRUTH.notes);

  // Ahmed's photo, with a smaller file for a phone: the default an Editor may replace.
  const photo = truth.locator('figure img');
  await expect(photo).toHaveAttribute('src', /\/profile\/paper-800\.webp$/);
  await expect(photo).toHaveAttribute('srcset', /\/profile\/paper-480\.webp 480w/);
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  // A dark section: the header stays dark over it.
  await expect(truth).not.toHaveClass(/\blight\b/);

  // Every word is the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({
    ...saved,
    truth: {
      ...saved.truth,
      title: { ...saved.truth.title, ar: 'عنوان المحرر' },
      noteWho: { ...saved.truth.noteWho, ar: 'من يحملها؟' },
    },
  });
  await cms.preview('/profile');
  await expect(truth.locator('h2')).toHaveText('عنوان المحرر');
  await expect(truth.locator('.pf-note').nth(2)).toHaveText('من يحملها؟');
});

test('01’s paper photo is an Editor’s to replace, the red notes staying where they are pinned', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const replacement = await uploadFile(
    page.request,
    { name: 'paper.png', mimeType: 'image/png', buffer: await transparentMark({ width: 800, height: 1069 }) },
    'طلب اعتماد ورقي آخر',
  );

  try {
    await profile.draft({ ...saved, truth: { ...saved.truth, photo: replacement.id } });
    await cms.preview('/profile');
    const truth = section(page, 'truth');
    const photo = truth.locator('figure img');
    await expect(photo).toHaveAttribute('src', replacement.url);
    await expect(photo).toHaveAttribute('alt', 'طلب اعتماد ورقي آخر');
    await expect(truth.locator('.pf-note')).toHaveText(TRUTH.notes);

    // Taken out again, Ahmed's is back.
    await profile.draft({ ...saved, truth: { ...saved.truth, photo: null } });
    await cms.preview('/profile');
    await expect(photo).toHaveAttribute('src', /\/profile\/paper-800\.webp$/);
  } finally {
    await profile.restore();
    await page.request.delete(`/api/media/${replacement.id}`);
  }
});

test('02, the real site: three figures, their labels and their source, whole in the first response', async ({ page, cms }) => {
  await cms.preview('/profile');
  // What the server sends, before any script runs: every figure at its value.
  const html = await (await page.reload())!.text();
  for (const figure of NUMBERS.figures) expect(html).toContain(`>${figure}<`);

  const numbers = section(page, 'numbers');
  await expect(numbers.locator('.eyebrow')).toContainText('02');
  await expect(numbers.locator('.eyebrow')).toContainText(NUMBERS.eyebrow);
  await expect(numbers.locator('h2')).toHaveText(NUMBERS.title);
  await expect(numbers.locator('li p')).toHaveText(NUMBERS.labels);
  await expect(numbers.locator('.pf-source')).toHaveText(NUMBERS.source);
  await expect(numbers).not.toHaveClass(/\blight\b/);

  // Below the fold they wait at nothing, and count up to their value once reached.
  await expect(figures(page)).toHaveText(['0%', '0%', '0%']);
  await numbers.locator('ul').scrollIntoViewIfNeeded();
  await expect(figures(page)).toHaveText(NUMBERS.figures);

  // The figure, its label and the source are the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [first, ...rest] = saved.numbers.figures;
  await profile.draft({
    ...saved,
    numbers: {
      ...saved.numbers,
      figures: [{ ...first!, figure: '1,250+', label: { ...first!.label, ar: 'مشروع' } }, ...rest],
      source: { ...saved.numbers.source, ar: 'المصدر: دراسة' },
    },
  });
  await cms.preview('/profile');
  await numbers.locator('ul').scrollIntoViewIfNeeded();
  await expect(figures(page).first()).toHaveText('1,250+');
  await expect(numbers.locator('li p').first()).toHaveText('مشروع');
  await expect(numbers.locator('.pf-source')).toHaveText('المصدر: دراسة');
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('02’s figures stand at their values and never count', async ({ page, cms }) => {
    await cms.preview('/profile');
    await expect(figures(page)).toHaveText(NUMBERS.figures);
    await section(page, 'numbers').scrollIntoViewIfNeeded();
    // Long enough for a count-up to have begun, had one been started.
    await page.waitForTimeout(400);
    await expect(figures(page)).toHaveText(NUMBERS.figures);
  });
});

test('03, the trap: its words beside four tool cards, each with Ahmed’s icon in its place, on the profile’s first light ground', async ({
  page,
  cms,
}) => {
  await cms.preview('/profile');
  const trap = section(page, 'trap');
  await expect(trap.locator('.eyebrow')).toContainText('03');
  await expect(trap.locator('.eyebrow')).toContainText(TRAP.eyebrow);
  await expect(trap.locator('h2')).toHaveText(TRAP.title);
  await expect(trap.locator('.lead')).toHaveText(TRAP.body);
  await expect(trap.locator('.pf-kicker')).toHaveText(TRAP.kicker);
  await expect(trap.locator('li h3')).toHaveText(TRAP.tools.map(([name]) => name));
  await expect(trap.locator('li p')).toHaveText(TRAP.tools.map(([, text]) => text));
  // The header turns light over it (ticket 104).
  await expect(trap).toHaveClass(/\blight\b/);

  // Each icon is Ahmed's, by its place, and is served.
  const icons = await trap.locator('li .pf-icon').evaluateAll((marks) =>
    marks.map((mark) => /url\("?([^")]+)"?\)/.exec(getComputedStyle(mark).maskImage || getComputedStyle(mark).webkitMaskImage)?.[1] ?? ''),
  );
  expect(icons.map((icon) => icon.replace(/^.*\/profile\//, '/profile/'))).toEqual(
    ['wa', 'mail', 'excel', 'folder'].map((name) => `/profile/icons/${name}.png`),
  );
  for (const icon of icons) {
    const file = await page.request.get(icon);
    expect(file.status(), icon).toBe(200);
    expect(file.headers()['content-type']).toBe('image/png');
  }

  // The words are the Editor's; the icons stay in their places.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [, mail, ...rest] = saved.trap.tools;
  await profile.draft({
    ...saved,
    trap: {
      ...saved.trap,
      kicker: { ...saved.trap.kicker, ar: 'جملة المحرر' },
      tools: [saved.trap.tools[0]!, { ...mail!, name: { ...mail!.name, ar: 'Outlook' } }, ...rest],
    },
  });
  await cms.preview('/profile');
  await expect(trap.locator('.pf-kicker')).toHaveText('جملة المحرر');
  await expect(trap.locator('li h3').nth(1)).toHaveText('Outlook');
  await expect(trap.locator('li').nth(1).locator('.pf-icon')).toHaveClass(/pf-icon-mail/);
});

test('04, who we are: the two-line heading, its second line in colour, the paragraph and the quote', async ({ page, cms }) => {
  await cms.preview('/profile');
  const about = section(page, 'about');
  await expect(about.locator('.eyebrow')).toContainText('04');
  await expect(about.locator('.eyebrow')).toContainText(ABOUT.eyebrow);
  expect(await about.locator('h2').evaluate((heading: HTMLElement) => heading.innerText.split('\n').map((line) => line.trim()))).toEqual(
    ABOUT.title,
  );
  await expect(about.locator('h2 span')).toHaveText(ABOUT.title[1]);
  await expect(about.locator('.lead')).toHaveText(ABOUT.body);
  await expect(about.locator('blockquote')).toHaveText(ABOUT.quote);
  await expect(about).not.toHaveClass(/\blight\b/);

  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({
    ...saved,
    about: {
      ...saved.about,
      titleAccent: { ...saved.about.titleAccent, ar: 'وما زلنا.' },
      quote: { ...saved.about.quote, ar: 'اقتباس المحرر.' },
    },
  });
  await cms.preview('/profile');
  await expect(about.locator('h2 span')).toHaveText('وما زلنا.');
  await expect(about.locator('blockquote')).toHaveText('اقتباس المحرر.');
});

test('each of the four hides with its own switch, keeping its words, and the others keep their numbers', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const ids = ['truth', 'numbers', 'trap', 'about'] as const;

  for (const hidden of ids) {
    await profile.draft({ ...saved, [hidden]: { ...saved[hidden], shows: false } });
    await cms.preview('/profile');
    await expect(section(page, hidden), hidden).toHaveCount(0);
    for (const [index, shown] of ids.entries()) {
      if (shown === hidden) continue;
      await expect(section(page, shown).locator('.pf-num'), `${shown} with ${hidden} hidden`).toHaveText(`0${index + 1}`);
    }
  }

  // Shown again, its words are where they were.
  await profile.draft({ ...saved, trap: { ...saved.trap, shows: true } });
  await cms.preview('/profile');
  await expect(section(page, 'trap').locator('h2')).toHaveText(TRAP.title);
});

for (const phone of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`at ${phone.width}px, nothing in the four sections reaches past the screen`, async ({ page, cms }) => {
    await page.setViewportSize(phone);
    await cms.preview('/profile');
    for (const id of ['truth', 'numbers', 'trap', 'about']) {
      await section(page, id).scrollIntoViewIfNeeded();
      // What sticks out, though the page clips it: the four sections' own.
      const past = (await whatOverflows(page)).filter((culprit) => culprit.startsWith(`#${id} `));
      expect(past, `#${id}`).toEqual([]);
      expect(await sidewaysOverflow(page), `#${id}`).toBeLessThanOrEqual(0);
    }
  });
}
