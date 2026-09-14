/**
 * The end of the home page (ticket 11): the questions, and the closing section
 * with the demo request form — and bug 44, the closing section's empty column.
 *
 * What a visitor meets: an answer that opens, a form whose every field is named,
 * and a button that takes them to that form without the header covering it.
 * Sending the form is `form-submission.spec.ts`'s, which covers it here and in
 * its other two places.
 *
 * Whether it *looks* like the Reference site is asked in
 * `home-faq-and-closing-match-reference.spec.ts`.
 */
import { test, expect, type Page } from '@playwright/test';

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
] as const;

/** The Reference site's confirmation, shown without sending. Nothing on the page says it before a request is stored. */
const FAKE_CONFIRMATION = 'وصلنا طلبك';

const questions = (page: Page) => page.locator('#fq');
const demoForm = (page: Page) => page.getByRole('form', { name: 'احجز عرضاً حياً على مشروعك' });

test('both sections are in the first response, every answer included', async ({ request }) => {
  const html = await (await request.get('/')).text();

  for (const entry of QUESTIONS) {
    expect(html).toContain(entry.question);
    // Closed or open, the answer is in the page: that is what a crawler reads.
    expect(html).toContain(entry.answer);
  }
  expect(html).toContain('href="/start#faq"');
  expect(html).toContain('احجز عرضاً حياً على مشروعك');
  expect(html).not.toContain(FAKE_CONFIRMATION);
  // The ticket names the fake send `data-fake-send`; on the Reference home page
  // it is a hidden `#sent` that a script reveals. Neither is here.
  expect(html).not.toContain('data-fake-send');
  expect(html).not.toContain('id="sent"');
});

test('an answer opens and closes, with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  for (const entry of QUESTIONS) {
    const question = questions(page).getByText(entry.question, { exact: true });
    const answer = questions(page).getByText(entry.answer, { exact: true });

    await expect(answer).toBeHidden();
    await question.click();
    await expect(answer).toBeVisible();
    await question.click();
    await expect(answer).toBeHidden();
  }

  await context.close();
});

test('an answer opens from the keyboard', async ({ page }) => {
  await page.goto('/');

  await questions(page).getByText(QUESTIONS[1].question, { exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(questions(page).getByText(QUESTIONS[1].answer, { exact: true })).toBeVisible();
});

test('the demo request form is a real form, with every field named', async ({ page }) => {
  await page.goto('/');

  const fields = await demoForm(page).evaluate((form: HTMLFormElement) =>
    [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')].map((field) => ({
      name: field.name,
      type: field instanceof HTMLSelectElement ? 'select' : field.type,
      label: field.getAttribute('aria-label'),
    })),
  );
  expect(fields).toEqual([
    { name: 'name', type: 'text', label: 'الاسم الكامل' },
    { name: 'email', type: 'email', label: 'البريد الإلكتروني' },
    { name: 'role', type: 'select', label: 'دورك في المشروع' },
    { name: 'phone', type: 'tel', label: 'رقم الجوال' },
    { name: 'company', type: 'text', label: 'اسم الشركة' },
    { name: 'activeProjects', type: 'number', label: 'عدد المشاريع النشطة' },
  ]);

  // The three parties, each with a value a server can store — not the Arabic
  // label, which is copy and may change.
  const roles = await page.getByLabel('دورك في المشروع').evaluate((select: HTMLSelectElement) =>
    [...select.options].map((option) => option.value),
  );
  expect(roles).toEqual(['', 'owner', 'consultant', 'contractor']);
});

test('the call to action lands on the form, clear of the header', async ({ page }) => {
  // A short window, so the page has room to scroll the form all the way to the
  // top — on a tall one the jump stops early and the form sits lower anyway,
  // which would pass without the rule that keeps it clear.
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto('/');

  await page.locator('#hero').getByRole('link', { name: 'احجز عرضاً حياً' }).click();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#demo');

  const clearance = await page.evaluate(() => {
    const header = document.querySelector('.nav')!.getBoundingClientRect();
    const form = document.getElementById('demo')!.getBoundingClientRect();
    return form.top - header.bottom;
  });
  expect(clearance, 'the header covers the top of the form').toBeGreaterThanOrEqual(0);
  expect(clearance, 'the form did not scroll to the top').toBeLessThan(20);
});

test('the closing section has something in both columns at desktop widths (bug 44)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const steps = (await page.locator('#tail .tail-steps').boundingBox())!;
  const form = (await demoForm(page).boundingBox())!;

  // Side by side: the form in the other column, level with the steps.
  expect(form.x + form.width).toBeLessThanOrEqual(steps.x);
  expect(form.y).toBeLessThan(steps.y + steps.height);
});

test('below 981px the form moves under the steps', async ({ page }) => {
  await page.setViewportSize({ width: 980, height: 900 });
  await page.goto('/');

  const steps = (await page.locator('#tail .tail-steps').boundingBox())!;
  const form = (await demoForm(page).boundingBox())!;
  expect(form.y).toBeGreaterThan(steps.y + steps.height);
});
