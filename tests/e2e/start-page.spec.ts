/**
 * The start page (ticket 13): the three steps to going live, the questions
 * with the demo request form beside them, and the free tool teaser.
 *
 * What a visitor meets: every answer there to be opened, with or without
 * JavaScript; a form whose every field is named and which claims nothing it
 * has not done; the hero's two links landing clear of the header; and a page
 * that does not make them download the home and product pages' animations.
 *
 * Whether it *looks* like the Reference site is asked in
 * `start-matches-reference.spec.ts`. Console errors and failed requests are
 * `health.spec.ts`'s, which covers every route in `routes.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { sidewaysOverflow } from './geometry';
import { BASELINE_VIEWPORTS } from './reference-site';

const STEPS = [
  { label: '01 · إعداد', title: 'المشروع، الأطراف، النماذج' },
  { label: '02 · تشغيل', title: 'أقل من يوم — دون توقف للعمل' },
  { label: '03 · ضمان', title: '60 يوماً — أو نعيد المبلغ' },
] as const;

/** Verbatim from `reference/site/start.html`, in order. */
const QUESTIONS = [
  {
    question: 'كيف يعمل الاشتراك؟',
    answer:
      'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.',
  },
  {
    question: 'وإن لم يناسبنا بعد التشغيل؟',
    answer:
      'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.',
  },
  {
    question: 'كم يحتاج التشغيل؟',
    answer: 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.',
  },
  {
    question: 'هل النماذج سعودية؟',
    answer:
      'نعم. طلبات تسليم الأعمال WIR وفحص المواد MIR وعدم المطابقة NCR والاعتمادات والخطابات — بالعربية وبالصيغ المتعارف عليها في مشاريعنا، وتُخصَّص لكل مشروع.',
  },
  {
    question: 'مشروعنا قائم منذ سنة — ينفع؟',
    answer: 'نعم. نبدأ من حيث وصلتم: تُرفع المستندات المعتمدة الحالية، وتبدأ الطلبات الجديدة من اليوم الأول على المنصة.',
  },
  {
    question: 'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟',
    answer:
      'السجل ملكك. تختار إما استمرار الوصول إليه باشتراك سنوي رمزي يُحسب حسب حجم البيانات عند نهاية المشروع، أو استلام نسخة كاملة منه على قرص خارجي.',
  },
  {
    question: 'هل يدعم الإنجليزية للفرق غير العربية؟',
    answer: 'نعم. الواجهة عربية أولاً، وتتوفر بالإنجليزية للمهندسين غير الناطقين بالعربية في نفس المشروع.',
  },
] as const;

/** The Reference site's fake confirmation. It must not exist anywhere. */
const FAKE_CONFIRMATION = 'وصلنا طلبك';

const questions = (page: Page) => page.locator('#faq .faq-grid > div:first-child');
const demoForm = (page: Page) => page.getByRole('form', { name: 'احجز عرضاً حياً على مشروعك' });

test('every section is in the first response, every answer included', async ({ request }) => {
  const html = await (await request.get('/start')).text();

  expect(html).toContain('كيف نبدأ معك — وكل ما قد تسأل عنه.');
  for (const step of STEPS) expect(html).toContain(step.title);
  for (const entry of QUESTIONS) {
    expect(html).toContain(entry.question);
    // Closed or open, the answer is in the page: that is what a crawler reads.
    expect(html).toContain(entry.answer);
  }
  expect(html).toContain('احجز عرضاً حياً على مشروعك');
  expect(html).toContain('سجل صبّات الخرسانة ونتائج التكسير');

  expect(html).not.toContain(FAKE_CONFIRMATION);
  expect(html).not.toContain('data-fake-send');
  expect(html).not.toContain('id="sent"');
});

test('the three steps are in order, the guarantee last', async ({ page }) => {
  await page.goto('/start');

  const steps = page.locator('#start .start .s');
  await expect(steps.locator('h3')).toHaveText(STEPS.map((step) => step.title));
  await expect(steps.locator('.k')).toHaveText(STEPS.map((step) => step.label));
});

test('every question is a native disclosure element, and opens with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/start');

  const entries = questions(page).locator('details');
  await expect(entries.locator('summary')).toHaveText(QUESTIONS.map((entry) => entry.question));

  for (const [index, entry] of QUESTIONS.entries()) {
    const summary = entries.nth(index).locator('summary');
    const answer = entries.nth(index).getByText(entry.answer, { exact: true });

    await expect(answer).toBeHidden();
    await summary.click();
    await expect(answer).toBeVisible();
    await summary.click();
    await expect(answer).toBeHidden();
  }

  await context.close();
});

test('an answer opens from the keyboard', async ({ page }) => {
  await page.goto('/start');

  await questions(page).getByText(QUESTIONS[4].question, { exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(questions(page).getByText(QUESTIONS[4].answer, { exact: true })).toBeVisible();
});

test('the demo request form is a real form, with every field named', async ({ page }) => {
  await page.goto('/start');

  const names = await demoForm(page).evaluate((form: HTMLFormElement) =>
    [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')].map((field) => field.name),
  );
  expect(names).toEqual(['name', 'email', 'role', 'phone', 'company', 'activeProjects']);
});

test('nothing pretends to send the form', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') sent.push(`${request.method()} ${request.url()}`);
  });
  await page.goto('/start');
  const address = page.url();

  const form = demoForm(page);
  await form.getByLabel('الاسم الكامل').fill('سارة القحطاني');
  await form.getByLabel('رقم الجوال').fill('0500000000');
  await form.getByLabel('رقم الجوال').press('Enter');
  const button = form.getByRole('button', { name: 'احجز عرضاً حياً' });
  await expect(button).toBeDisabled();
  await button.click({ force: true });
  await page.waitForTimeout(500);

  expect(sent, 'the form sent something').toEqual([]);
  expect(page.url(), 'what was typed went into the address').toBe(address);
  await expect(page.getByText(FAKE_CONFIRMATION)).toHaveCount(0);
});

for (const { link, target } of [
  { link: 'الأسئلة الشائعة ↓', target: 'faq' },
  { link: 'احجز عرضاً حياً', target: 'demo' },
]) {
  test(`the hero's «${link}» lands on #${target}, clear of the header`, async ({ page }) => {
    // A short window, so the page has room to scroll the target all the way to
    // the top — on a tall one the jump can stop early, which would pass
    // without the rule that keeps it clear.
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto('/start');

    await page.locator('.phero').getByRole('link', { name: link }).click();
    await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#${target}`);

    const clearance = await page.evaluate((id) => {
      const header = document.querySelector('.nav')!.getBoundingClientRect();
      return document.getElementById(id)!.getBoundingClientRect().top - header.bottom;
    }, target);
    expect(clearance, 'the header covers the top of the target').toBeGreaterThanOrEqual(0);
    expect(clearance, 'the target did not scroll to the top').toBeLessThan(20);
  });
}

test('the form stands beside the questions at desktop widths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/start');

  const list = (await questions(page).boundingBox())!;
  const form = (await demoForm(page).boundingBox())!;
  // Right to left: the questions first, on the right; the form on their left.
  expect(form.x + form.width).toBeLessThanOrEqual(list.x);
  expect(form.y).toBeLessThan(list.y + list.height);
});

test('below 981px the form moves under the questions', async ({ page }) => {
  await page.setViewportSize({ width: 980, height: 900 });
  await page.goto('/start');

  const list = (await questions(page).boundingBox())!;
  const form = (await demoForm(page).boundingBox())!;
  expect(form.y).toBeGreaterThanOrEqual(list.y + list.height);
});

test('the free tool teaser leads to the tool page', async ({ page }) => {
  await page.goto('/start');

  // The Reference site's button goes nowhere (`href="#"`). The Pour Tracker is
  // described and delivered by the tool page (CONTEXT.md), which ticket 14 builds.
  await expect(page.locator('#faq .free').getByRole('link', { name: 'تحميل الأداة' })).toHaveAttribute('href', '/tool');
});

/**
 * "The page does not load the animation library or homepage animation code it
 * has no use for" (ticket 13). The Reference start page carries all of it.
 *
 * Each marker is a string from one behaviour's source that survives
 * minification. The same markers are looked for on the pages that do use the
 * code, so a marker that stopped appearing in the bundle — renamed, or
 * minified away — fails there rather than letting this pass by finding
 * nothing.
 *
 * GSAP itself does load here, and is meant to: the header's colour toggle and
 * the Trust strip are on this page and are built on it.
 */
const ANIMATIONS = [
  // The Reference start page runs its `.reveal` entrance with nothing to
  // reveal. Quoted, because React's `revealOrder` and Next's `revealAfter`
  // contain `.reveal` too.
  { name: 'the `.reveal` entrance', marker: '".reveal"', usedOn: '/' },
  { name: "the home page's hero loop", marker: 'hero-art', usedOn: '/' },
  { name: "the home page's card decks", marker: '.pcard', usedOn: '/' },
  { name: "the home page's four units", marker: '.jt-hint', usedOn: '/' },
  { name: "the product page's journey", marker: '.j-head', usedOn: '/product' },
  { name: "the product page's roles", marker: 'role on', usedOn: '/product' },
] as const;

/** Every script a page loads, as text. */
async function scriptsOf(page: Page, path: string) {
  const scripts: Promise<string>[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') scripts.push(response.text());
  });
  await page.goto(path, { waitUntil: 'networkidle' });
  return (await Promise.all(scripts)).join('\n');
}

test("the page loads none of the home and product pages' animations", async ({ page }) => {
  const start = await scriptsOf(page, '/start');
  for (const animation of ANIMATIONS) {
    expect(start.includes(animation.marker), `/start loads ${animation.name}`).toBe(false);
  }
});

test('the markers that test looks for are in the pages that use them', async ({ browser }) => {
  for (const path of new Set(ANIMATIONS.map((animation) => animation.usedOn))) {
    const context = await browser.newContext();
    const scripts = await scriptsOf(await context.newPage(), path);
    for (const animation of ANIMATIONS.filter((each) => each.usedOn === path)) {
      expect(scripts.includes(animation.marker), `${animation.name} no longer carries «${animation.marker}»`).toBe(true);
    }
    await context.close();
  }
});

for (const viewport of BASELINE_VIEWPORTS) {
  test(`no sideways scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/start');

    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}
