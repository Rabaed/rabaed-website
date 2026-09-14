/**
 * The tool page (ticket 14): the landing page for the free Pour Tracker, with
 * its download form.
 *
 * What a visitor meets: every section and every answer there to be read, with
 * or without JavaScript; a download form whose button stays locked until the
 * details are valid, saying what is wrong only once a field has been left; a
 * and a phone number and an email typed left to right inside a right-to-left
 * page. That the unlocked button neither sends anything nor pretends to, until
 * ticket 30 records the details before delivering the file, is
 * `form-submission.spec.ts`'s.
 *
 * Whether it *looks* like the Reference site is asked in
 * `tool-matches-reference.spec.ts`. Console errors and failed requests are
 * `health.spec.ts`'s, which covers every route in `routes.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { sidewaysOverflow } from './geometry';
import { BASELINE_VIEWPORTS } from './reference-site';

const HEADINGS = [
  'الصبّة تُنفَّذ في ساعة. متابعتها تستمر شهراً.',
  'ستة أشياء تختصر عليك متابعة شهر كامل',
  'من التحميل إلى أول صبّة مسجّلة — دقيقتان',
  'ملفاتك لا تغادر جهازك — لأنه لا يوجد مكان تذهب إليه',
  'ما الذي تحتاجه لتشغيلها',
  'حمّل الأداة الآن',
  'قبل أن تحمّل',
  'تحتاج أكثر من مشروع واحد؟',
] as const;

/** Verbatim from `reference/site/tool.html`, as a visitor reads them. */
const QUESTIONS = [
  {
    question: 'هل هي مجانية فعلاً؟',
    answer:
      'نعم. نسخة كاملة تعمل لمشروع واحد، بلا حد زمني ولا نسخة تجريبية ولا علامة مائية على الطباعة. نحن نصنع نسخة سحابية مدفوعة للفرق التي تدير عدة مشاريع، وهذه الأداة هي نصفها الفردي — تعمل وحدها بالكامل.',
  },
  {
    question: 'أين تُحفظ بياناتي بالضبط؟',
    answer:
      'في المجلد الذي تختاره أنت على جهازك: ملف concrete_db.json يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد attachments يحوي نسخاً من التقارير والصور. لا شيء يُرفع إلى أي خادم — لا يوجد خادم أصلاً.',
  },
  {
    question: 'هل تعمل بدون إنترنت؟',
    answer:
      'نعم، بالكامل. الشيء الوحيد الذي يُجلب من الإنترنت هو ملفا الخطوط عند أول فتح. بدون إنترنت يستخدم المتصفح خط النظام، ويبقى كل شيء — الحفظ، المرفقات، الطباعة — يعمل كما هو.',
  },
  {
    question: 'كم مشروعاً تدعم؟',
    answer:
      'مجلد واحد = مشروع واحد. تقدر تفتح مجلداً آخر لمشروع آخر، لكن كل مجلد مستقل بذاته. لو تحتاج كل مشاريعك في لوحة واحدة مع مقارنة بينها، هذا ما تفعله النسخة السحابية.',
  },
  {
    question: 'هل أقدر أشاركها مع فريقي؟',
    answer:
      'الملف نفسه نعم — أرسله لمن تشاء، لا يوجد ترخيص ولا مفتاح تفعيل. لكن انتبه: كل نسخة تعمل على مجلدها الخاص، فلا يوجد سجل مشترك بين شخصين ولا اعتماد إلكتروني من الاستشاري. المشاركة الحقيقية هي ما تضيفه النسخة السحابية.',
  },
  {
    question: 'ما الفرق بينها وبين النسخة السحابية؟',
    answer:
      'النسخة المجانية تحل مشكلة المهندس الفرد على مشروع واحد. النسخة السحابية تحل مشكلة الشركة: كل المشاريع في لوحة واحدة، اعتماد إلكتروني فوري من الاستشاري، حساب للمختبر يرفع تقريره بنفسه، ربط مع بقية منصة ربائد (إدارة الوثائق والتقارير اليومية والمراسلات)، وسجل تدقيق موثّق.',
  },
] as const;

const LOCKED = 'أكمل البيانات لتفعيل التحميل';
const UNLOCKED = 'حمّل الأداة الآن';

/** The Reference site's confirmation, shown after a download that recorded nothing. */
const FAKE_CONFIRMATION = 'تم — التحميل بدأ';

const ERRORS = {
  first: 'اكتب الاسم الأول (حرفان على الأقل)',
  last: 'اكتب اسم العائلة (حرفان على الأقل)',
  phone: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
} as const;

const downloadForm = (page: Page) => page.getByRole('form', { name: 'بيانات التحميل' });
const field = (page: Page, label: string) => downloadForm(page).getByLabel(label, { exact: true });
const submit = (page: Page) => downloadForm(page).locator('button[type="submit"]');

/** How far the progress bar has filled, from 0 to 1. */
async function progress(page: Page) {
  return page.locator('.tl-prog').evaluate((track) => {
    const bar = track.querySelector('i')!;
    return Math.round((bar.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100) / 100;
  });
}

async function fillValid(page: Page) {
  await field(page, 'الاسم الأول').fill('أحمد');
  await field(page, 'اسم العائلة').fill('السالم');
  await field(page, 'رقم الجوال').fill('512345678');
  await field(page, 'البريد الإلكتروني').fill('ahmed@example.com');
}

test('every section is in the first response, every answer included', async ({ request }) => {
  const html = await (await request.get('/tool')).text();

  expect(html).toContain('سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر');
  for (const heading of HEADINGS) expect(html).toContain(heading);
  for (const entry of QUESTIONS) {
    expect(html).toContain(entry.question);
    // An answer with a file name in it is split by the element that sets the
    // name left to right; its words either side of the name are looked for
    // below. Every other answer is in the page whole.
    if (!entry.answer.includes('concrete_db.json')) expect(html).toContain(entry.answer);
  }
  expect(html).toContain('في المجلد الذي تختاره أنت على جهازك: ملف ');
  expect(html).toContain(' يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد ');
  expect(html).toContain('صُنعت في ربائد لمهندسي المواقع. الأداة مجانية — استخدمها كما تشاء.');

  expect(html).not.toContain(FAKE_CONFIRMATION);
});

test('every question is a native disclosure element, and opens with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/tool');

  const entries = page.locator('#faq details');
  await expect(entries.locator('summary')).toHaveText(QUESTIONS.map((entry) => entry.question));

  for (const [index, entry] of QUESTIONS.entries()) {
    const answer = entries.nth(index).locator('p');
    await expect(answer).toHaveText(entry.answer);
    await expect(answer).toBeHidden();
    await entries.nth(index).locator('summary').click();
    await expect(answer).toBeVisible();
  }

  await context.close();
});

test('the numerals are written as the Reference site writes them', async ({ request }) => {
  // Arabic-Indic where the Reference site uses them, Latin where it does not —
  // never converted either way.
  const html = await (await request.get('/tool')).text();
  for (const phrase of [
    'العدّ التنازلي لـ ٧ و ٢٨ يوماً',
    '٧ و ٢٨ يوماً تمرّ بصمت',
    'المنسوب −٣٫٥',
    'متأخر ٣ أيام',
    '٣ أيام أو أقل',
    'برج النخيل — المرحلة ٢',
    ERRORS.phone,
    // The description search results show.
    'موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر',
  ]) {
    expect(html).toContain(phrase);
  }
  expect(html).toContain('ANT-014');
});

test('the download form is a real form, with every field named', async ({ page }) => {
  await page.goto('/tool');

  const fields = await downloadForm(page).evaluate((form: HTMLFormElement) =>
    [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')].map((each) => ({
      name: each.name,
      type: each instanceof HTMLSelectElement ? 'select' : each.type,
      autocomplete: each.getAttribute('autocomplete'),
      required: each.required,
    })),
  );
  expect(fields).toEqual([
    { name: 'firstName', type: 'text', autocomplete: 'given-name', required: true },
    { name: 'lastName', type: 'text', autocomplete: 'family-name', required: true },
    { name: 'countryCode', type: 'select', autocomplete: null, required: false },
    { name: 'phone', type: 'tel', autocomplete: 'tel-national', required: true },
    { name: 'email', type: 'email', autocomplete: 'email', required: true },
    { name: 'company', type: 'text', autocomplete: 'organization', required: false },
  ]);

  const codes = await field(page, 'مفتاح الدولة').evaluate((select: HTMLSelectElement) =>
    [...select.options].map((option) => option.value),
  );
  expect(codes).toEqual(['+966', '+971', '+965', '+974', '+973', '+968', '+962', '+20', '+90', 'other']);
});

test('the phone number and the email are typed left to right, aligned to the right', async ({ page }) => {
  await page.goto('/tool');

  for (const label of ['رقم الجوال', 'البريد الإلكتروني']) {
    const look = await field(page, label).evaluate((input) => {
      const style = getComputedStyle(input);
      return { dir: input.getAttribute('dir'), direction: style.direction, align: style.textAlign };
    });
    expect(look, label).toEqual({ dir: 'ltr', direction: 'ltr', align: 'right' });
  }
  // The rest of the form reads right to left.
  const name = await field(page, 'الاسم الأول').evaluate((input) => getComputedStyle(input).direction);
  expect(name).toBe('rtl');
});

test('with JavaScript off, the button is locked', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/tool');

  await expect(submit(page)).toBeDisabled();
  await expect(submit(page)).toHaveText(LOCKED);
  await context.close();
});

test('the button unlocks once the four required details are valid, and not before', async ({ page }) => {
  await page.goto('/tool');
  await expect(submit(page)).toBeDisabled();
  await expect(submit(page)).toHaveText(LOCKED);
  expect(await progress(page)).toBe(0);

  const steps: [string, string][] = [
    ['الاسم الأول', 'أحمد'],
    ['اسم العائلة', 'السالم'],
    ['رقم الجوال', '51 123 4567'],
    ['البريد الإلكتروني', 'ahmed@example.com'],
  ];
  for (const [index, [label, value]] of steps.entries()) {
    await expect(submit(page)).toBeDisabled();
    await field(page, label).fill(value);
    await expect.poll(() => progress(page)).toBe((index + 1) / 4);
  }

  // The company is optional: the button is unlocked without it.
  await expect(submit(page)).toBeEnabled();
  await expect(submit(page)).toHaveText(UNLOCKED);

  // And locks again the moment a detail stops being valid.
  await field(page, 'البريد الإلكتروني').fill('ahmed@example');
  await expect(submit(page)).toBeDisabled();
  await expect(submit(page)).toHaveText(LOCKED);
  await expect.poll(() => progress(page)).toBe(0.75);
});

for (const { label, invalid, valid } of [
  { label: 'الاسم الأول', invalid: ['', ' أ '], valid: 'أح' },
  { label: 'اسم العائلة', invalid: ['س'], valid: 'سا' },
  { label: 'رقم الجوال', invalid: ['12345', '1234567890123456', 'ابجد'], valid: '123456' },
  { label: 'البريد الإلكتروني', invalid: ['ahmed', 'ahmed@example', 'ahmed@example.c', 'a b@example.com'], valid: 'a@b.co' },
]) {
  test(`«${label}» is valid only as the Reference site allows`, async ({ page }) => {
    await page.goto('/tool');
    await fillValid(page);
    await expect(submit(page)).toBeEnabled();

    for (const value of invalid) {
      await field(page, label).fill(value);
      await expect(submit(page), `«${value}»`).toBeDisabled();
    }
    await field(page, label).fill(valid);
    await expect(submit(page), `«${valid}»`).toBeEnabled();
  });
}

test('a field says what is wrong once it has been left, not while it is being typed', async ({ page }) => {
  await page.goto('/tool');
  for (const message of Object.values(ERRORS)) {
    await expect(downloadForm(page).getByText(message, { exact: true })).toBeHidden();
  }

  const first = field(page, 'الاسم الأول');
  const error = downloadForm(page).getByText(ERRORS.first, { exact: true });
  await first.fill('أ');
  await expect(error).toBeHidden();
  await expect(first).not.toHaveAttribute('aria-invalid', 'true');

  await first.blur();
  await expect(error).toBeVisible();
  await expect(first).toHaveAttribute('aria-invalid', 'true');
  // Only that field: the others have not been touched yet.
  for (const message of [ERRORS.last, ERRORS.phone, ERRORS.email]) {
    await expect(downloadForm(page).getByText(message, { exact: true })).toBeHidden();
  }

  // Corrected, the message goes as it is typed.
  await first.fill('أحمد');
  await expect(error).toBeHidden();
  await expect(first).not.toHaveAttribute('aria-invalid', 'true');
});

for (const { link, target } of [
  { link: 'حمّل الأداة مجاناً', target: 'get' },
  { link: 'كيف تعمل؟ ↓', target: 'how' },
]) {
  test(`the hero's «${link}» lands on #${target}, clear of the header`, async ({ page }) => {
    // A short window, so the page has room to scroll the target to the top.
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto('/tool');

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

test('the page ends by leading to the start and product pages', async ({ page }) => {
  await page.goto('/tool');
  const up = page.locator('#up');

  await expect(up.getByRole('link', { name: 'اطلب النسخة السحابية' })).toHaveAttribute('href', '/start');
  await expect(up.getByRole('link', { name: 'تعرّف على المنصة' })).toHaveAttribute('href', '/product');
});

test('the drawing of the tool in the hero is hidden from assistive technology', async ({ page }) => {
  // It is an illustration of the Pour Tracker, and every claim it makes is
  // said in words beside it.
  await page.goto('/tool');
  await expect(page.locator('.tl-mock')).toHaveAttribute('aria-hidden', 'true');
});

for (const viewport of BASELINE_VIEWPORTS) {
  test(`no sideways scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/tool');

    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}
