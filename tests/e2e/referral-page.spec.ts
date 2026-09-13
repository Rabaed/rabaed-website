/**
 * The referral page (ticket 15): how the Referral Program works, the offer, who
 * it is for, what is referred, the terms in eight points, the questions, and
 * the signup form.
 *
 * What a visitor meets: the amounts the founders approved, and not in the
 * header menu; every answer there to be opened, with or without JavaScript; a
 * form whose every field is named, whose document fields show the file chosen
 * and can be reached from the keyboard, and which claims nothing it has not
 * done — no fake referral code, no fake confirmation; the hero's two links
 * landing clear of the header; and a page that does not make them download
 * the home and product pages' animations.
 *
 * Whether it *looks* like the Reference site is asked in
 * `referral-matches-reference.spec.ts`. Console errors and failed requests are
 * `health.spec.ts`'s, which covers every route in `routes.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { ANIMATIONS, scriptsOf } from './animation-code';
import { sidewaysOverflow } from './geometry';
import { BASELINE_VIEWPORTS } from './reference-site';

const HEADINGS = [
  'أربع خطوات، وينتهي دورك بعد الثانية',
  'مبلغ ثابت. بلا شرائح، بلا حسابات.',
  'إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا',
  'ما الذي تُحيله بالضبط؟',
  'الشروط في ثماني نقاط',
  'قبل أن تسجّل',
  'كودك جاهز خلال دقيقة',
] as const;

const STEPS = [
  { label: '01 · سجّل', title: 'دقيقة واحدة' },
  { label: '02 · شارك الكود', title: 'مع صاحب القرار' },
  { label: '03 · نتولّى الباقي', title: 'لا متابعة ولا بيع' },
  { label: '04 · استلم مستحقاتك', title: 'خلال 7 أيام عمل' },
] as const;

/** Verbatim from `reference/site/referral.html`, in order. */
const TERMS = [
  'الإحالة بالمشروع لا بالعميل. تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.',
  'يُقدَّم الكود عند طلب العرض التوضيحي، أي قبل بدء التفاوض — لا عند التوقيع.',
  'لا يُقبل الكود لعميل قائم أو لمشروع سبق أن تواصلنا بشأنه مع المالك.',
  'الاشتراك السنوي المدفوع مقدماً هو ما يُحتسب عليه المبلغ.',
  'الاستحقاق عند تحصيل قيمة الاشتراك، لا عند التوقيع.',
  'الصرف خلال 7 أيام عمل من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.',
  'الإلغاء والاسترداد خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.',
  'إقرار عدم التعارض يُوقَّع إلكترونياً عند التسجيل.',
] as const;

/** Verbatim from `reference/site/referral.html`, in order. */
const QUESTIONS = [
  {
    question: 'هل أحتاج سجلاً تجارياً؟',
    answer:
      'لا. البرنامج مفتوح للأفراد. يكفي أن تسجّل بياناتك وترفع شهادة الآيبان. وإن كان لديك سجل تجاري وشهادة تسجيل ضريبي، يمكنك إرفاقهما اختيارياً.',
  },
  {
    question: 'متى بالضبط أستلم المبلغ؟',
    answer: 'عند تحصيل قيمة الاشتراك من العميل. يُصرف المبلغ خلال 7 أيام عمل من نهاية ذلك الشهر.',
  },
  {
    question: 'هل أحتاج أن أبيع أو أتابع العميل؟',
    answer: 'لا. دورك ينتهي عند مشاركة الكود. فريقنا يتولّى العرض والتفاوض والتعاقد والتفعيل.',
  },
  {
    question: 'عميلي عنده أكثر من مشروع — كيف تُحتسب؟',
    answer: 'الإحالة بالمشروع. إن استُخدم كودك عند بدء مشروع ثانٍ، تُحتسب إحالة جديدة بـ 2,000 ريال أخرى.',
  },
  {
    question: 'ماذا لو استخدم شخصان كودين مختلفين لنفس المشروع؟',
    answer: 'يُعتمد الكود الذي وصلنا أولاً مع طلب العرض التوضيحي.',
  },
  {
    question: 'هل هناك حد أقصى للمبالغ؟',
    answer: 'لا. لا حد على عدد المشاريع ولا على إجمالي ما تستلمه.',
  },
  {
    question: 'هل أستطيع نشر كودي على حساباتي؟',
    answer:
      'الكود شخصي ومخصص لمشاركته مباشرة مع من تعرفه. نشره كإعلان عام للخصم غير مسموح، ويحق لنا إيقاف الكود في هذه الحالة.',
  },
  {
    question: 'كم يستغرق الأمر من مشاركة الكود حتى الاستحقاق؟',
    answer: 'يعتمد على المطوّر ودورة قراره. في المتوسط بين ثلاثة وثمانية أسابيع من أول عرض توضيحي.',
  },
  {
    question: 'أعمل لدى جهة قد يُعدّ هذا تعارضاً معها — ماذا أفعل؟',
    answer: 'مسؤوليتك أن تتأكد من عدم وجود ما يمنعك من قبول المقابل، وهذا ما يغطّيه الإقرار الذي توقّعه عند التسجيل.',
  },
] as const;

/**
 * The Reference site's fake success: a referral code it never issued, under a
 * confirmation of a registration it never stored. Neither may exist anywhere.
 */
const FAKE_CODE = 'RB-A47K';
const FAKE_CONFIRMATION = 'تم تسجيلك';

const signupForm = (page: Page) => page.getByRole('form', { name: 'سجّل في برنامج الإحالة' });
const signupCopy = (page: Page) => page.locator('#signup .sign-grid > div:first-child');
const uploadField = (page: Page, name: string) =>
  signupForm(page).locator('label', { has: page.getByLabel(name, { exact: true }) });

/** A small stand-in for a scanned certificate. */
const CERTIFICATE = { name: 'iban-certificate.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n') };

test('every section is in the first response, every answer included', async ({ request }) => {
  const html = await (await request.get('/referral')).text();

  expect(html).toContain('أحِل مشروعاً واحداً. اكسب 2,000 ريال.');
  for (const heading of HEADINGS) expect(html).toContain(heading);
  for (const step of STEPS) expect(html).toContain(step.title);
  for (const entry of QUESTIONS) {
    expect(html).toContain(entry.question);
    // Closed or open, the answer is in the page: that is what a crawler reads.
    expect(html).toContain(entry.answer);
  }
  expect(html).toContain('سجّل في برنامج الإحالة');

  expect(html).not.toContain(FAKE_CODE);
  expect(html).not.toContain(FAKE_CONFIRMATION);
  expect(html).not.toContain('data-fake-send');
});

test("the amounts are the Reference site's, and the header menu repeats neither", async ({ page }) => {
  await page.goto('/referral');

  await expect(page.locator('.phero .pstat b')).toHaveText(['2,000 ريال', '10%', 'بلا حد']);
  await expect(page.locator('.phero .pstat > span')).toHaveText(['عن كل مشروع', 'خصم لعميلك', 'عدد المشاريع']);
  await expect(page.locator('#offer h3')).toHaveText(['2,000 ريال صافية', 'خصم 10%']);

  // The whole header, the closed dropdown and the mobile panel included: an
  // amount in the menu is a decision the founders made against (HANDOFF §2).
  const header = page.locator('.nav');
  await expect(header).toContainText('برنامج الإحالة');
  for (const amount of ['2,000', '2000', '10%', 'ريال']) await expect(header).not.toContainText(amount);
});

test('the four steps are in order', async ({ page }) => {
  await page.goto('/referral');

  const steps = page.locator('#how .s');
  await expect(steps.locator('h3')).toHaveText(STEPS.map((step) => step.title));
  await expect(steps.locator('.k')).toHaveText(STEPS.map((step) => step.label));
});

test('the four steps stand in one row at desktop widths, and two to a row below 981px', async ({ page }) => {
  const tops = async () => page.locator('#how .s').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/referral');
  expect(new Set(await tops()).size, 'rows of steps at 1280px').toBe(1);

  await page.setViewportSize({ width: 980, height: 900 });
  const [first, second, third, fourth] = await tops();
  expect(second).toBe(first);
  expect(fourth).toBe(third);
  expect(third).toBeGreaterThan(first);
});

test('the terms are in eight points, in order', async ({ page }) => {
  await page.goto('/referral');

  await expect(page.locator('#terms li')).toHaveCount(TERMS.length);
  await expect(page.locator('#terms li > span')).toHaveText([...TERMS]);
});

test('every question is a native disclosure element, and opens with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/referral');

  const entries = page.locator('#faq details');
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

test('the signup form is a real form, with every field named and the required ones required', async ({ page }) => {
  await page.goto('/referral');

  const fields = await signupForm(page).evaluate((form: HTMLFormElement) =>
    [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')].map((field) => ({
      name: field.name,
      type: field.type,
      required: field.required,
      accept: field instanceof HTMLInputElement ? field.accept : '',
    })),
  );

  // Starred on the Reference site, or required by its handoff (§4.ب).
  const documentTypes = '.pdf,.png,.jpg,.jpeg';
  expect(fields).toEqual([
    { name: 'name', type: 'text', required: true, accept: '' },
    { name: 'phone', type: 'tel', required: true, accept: '' },
    { name: 'email', type: 'email', required: true, accept: '' },
    { name: 'city', type: 'text', required: true, accept: '' },
    { name: 'profession', type: 'select-one', required: true, accept: '' },
    { name: 'employer', type: 'text', required: false, accept: '' },
    { name: 'ibanCertificate', type: 'file', required: true, accept: documentTypes },
    { name: 'accountHolder', type: 'text', required: true, accept: '' },
    { name: 'commercialRegistration', type: 'file', required: false, accept: documentTypes },
    { name: 'taxRegistrationCertificate', type: 'file', required: false, accept: documentTypes },
    { name: 'acceptTerms', type: 'checkbox', required: true, accept: '' },
    { name: 'declareNoConflict', type: 'checkbox', required: true, accept: '' },
  ]);
});

test('the profession list offers every role, and chooses none for the visitor', async ({ page }) => {
  await page.goto('/referral');

  const profession = signupForm(page).getByLabel('الصفة المهنية');
  await expect(profession).toHaveValue('');
  await expect(profession.locator('option')).toHaveText([
    'الصفة المهنية *',
    'مهندس',
    'مدير مشروع',
    'استشاري مستقل',
    'مقاول',
    'مستشار تطوير عقاري',
    'صانع محتوى',
    'أخرى',
  ]);
});

test('both consent checkboxes are there, each with what it agrees to', async ({ page }) => {
  await page.goto('/referral');
  const form = signupForm(page);

  const terms = form.getByRole('checkbox', { name: 'الموافقة على الشروط والأحكام' });
  await expect(terms).not.toBeChecked();
  // `has` is looked for inside the label, so it takes the checkbox on its own.
  const termsLabel = form.locator('label', { has: page.getByRole('checkbox', { name: 'الموافقة على الشروط والأحكام' }) });
  await expect(termsLabel.getByRole('link', { name: 'شروط وأحكام برنامج الإحالة' })).toHaveAttribute('href', '/referral-terms');
  await expect(termsLabel.getByRole('link', { name: 'سياسة الخصوصية' })).toHaveAttribute('href', '/privacy');

  // The declaration is a paragraph above its checkbox; a screen reader landing
  // on the checkbox hears what it declares.
  const declaration = form.getByRole('checkbox', { name: 'إقرار عدم التعارض' });
  await expect(declaration).not.toBeChecked();
  await expect(declaration).toHaveAccessibleDescription(/^أُقرّ بأن ترشيحي لمنصة ربائد لا يتعارض مع واجباتي المهنية/);
});

test('a document field shows the file chosen, and goes back to empty when it is cleared', async ({ page }) => {
  // Showing the name is the field's script, so it waits for the page to be
  // running rather than choosing a file into markup nothing is listening to.
  await page.goto('/referral', { waitUntil: 'networkidle' });
  const field = uploadField(page, 'شهادة الآيبان');
  const input = signupForm(page).getByLabel('شهادة الآيبان', { exact: true });

  await expect(field).toContainText('اختر ملفاً');
  const emptyBorder = await field.evaluate((label) => getComputedStyle(label).borderTopColor);

  await input.setInputFiles(CERTIFICATE);
  await expect(field).toContainText(CERTIFICATE.name);
  await expect(field).not.toContainText('اختر ملفاً');
  // The Reference site's selected state: the card turns green.
  await expect(field).toHaveCSS('border-top-color', 'rgba(29, 158, 117, 0.45)');

  await input.setInputFiles([]);
  await expect(field).toContainText('اختر ملفاً');
  await expect(field).not.toContainText(CERTIFICATE.name);
  await expect(field).toHaveCSS('border-top-color', emptyBorder);
});

test('a document field is reached from the keyboard, and shows it has focus', async ({ page }) => {
  await page.goto('/referral');
  const form = signupForm(page);

  // The field before the IBAN certificate, then one Tab.
  await form.getByLabel('جهة العمل').focus();
  await page.keyboard.press('Tab');

  await expect(form.getByLabel('شهادة الآيبان', { exact: true })).toBeFocused();
  await expect(uploadField(page, 'شهادة الآيبان')).toHaveCSS('outline-style', 'solid');
});

test('nothing pretends to send the form', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') sent.push(`${request.method()} ${request.url()}`);
  });
  await page.goto('/referral');
  const address = page.url();

  const form = signupForm(page);
  await form.getByLabel('الاسم الكامل').fill('سارة القحطاني');
  await form.getByLabel('رقم الجوال').fill('0500000000');
  await form.getByRole('checkbox', { name: 'الموافقة على الشروط والأحكام' }).check();
  await form.getByRole('checkbox', { name: 'إقرار عدم التعارض' }).check();
  await form.getByLabel('رقم الجوال').press('Enter');

  const button = form.getByRole('button', { name: 'سجّل في برنامج الإحالة' });
  await expect(button).toBeDisabled();
  await button.click({ force: true });
  await page.waitForTimeout(500);

  expect(sent, 'the form sent something').toEqual([]);
  expect(page.url(), 'what was typed went into the address').toBe(address);
  await expect(page.getByText(FAKE_CONFIRMATION)).toHaveCount(0);
  await expect(page.getByText(FAKE_CODE)).toHaveCount(0);
});

for (const { link, target } of [
  { link: 'سجّل واحصل على كودك', target: 'signup' },
  { link: 'كيف يعمل البرنامج ↓', target: 'how' },
]) {
  test(`the hero's «${link}» lands on #${target}, clear of the header`, async ({ page }) => {
    // A short window, so the page has room to scroll the target all the way to
    // the top — on a tall one the jump can stop early, which would pass
    // without the rule that keeps it clear.
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto('/referral');

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

test('each link on the page leads to the page it names', async ({ page }) => {
  await page.goto('/referral');

  await expect(page.locator('#who').getByRole('link', { name: 'انتقل إلى برنامج الشراكات ←' })).toHaveAttribute('href', '/partnership');
  await expect(page.locator('#what').getByRole('link', { name: 'تعرّف على المنصة' })).toHaveAttribute('href', '/product');
  await expect(page.locator('#terms').getByRole('link', { name: 'الشروط والأحكام الكاملة' })).toHaveAttribute('href', '/referral-terms');
});

test('the form stands beside its copy at desktop widths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/referral');

  const copy = (await signupCopy(page).boundingBox())!;
  const form = (await signupForm(page).boundingBox())!;
  // Right to left: the copy first, on the right; the form on its left.
  expect(form.x + form.width).toBeLessThanOrEqual(copy.x);
  expect(form.y).toBeLessThan(copy.y + copy.height);
});

test('below 981px the form moves under its copy', async ({ page }) => {
  await page.setViewportSize({ width: 980, height: 900 });
  await page.goto('/referral');

  const copy = (await signupCopy(page).boundingBox())!;
  const form = (await signupForm(page).boundingBox())!;
  expect(form.y).toBeGreaterThanOrEqual(copy.y + copy.height);
});

test("the page loads none of the home and product pages' animations", async ({ page }) => {
  // The Reference referral page carries none of them either, but ticket 13's
  // test holds every page off the path that brought them to the start page.
  const referral = await scriptsOf(page, '/referral');
  for (const animation of ANIMATIONS) {
    expect(referral.includes(animation.marker), `/referral loads ${animation.name}`).toBe(false);
  }
});

for (const viewport of BASELINE_VIEWPORTS) {
  test(`no sideways scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/referral');

    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}
