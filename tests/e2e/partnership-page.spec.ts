/**
 * The partnership page (ticket 16): the idea, who the Partnership Program is
 * for, the three modes, what a partner gets, the path to joining, the
 * questions, and the application form.
 *
 * What a visitor meets: every section and every answer there to be read, with
 * or without JavaScript; the four audiences two to a row and the four stages in
 * order; an application form whose every field is named, whose commercial
 * registration is a document field reached from the keyboard, and which claims
 * nothing it has not done — no fake confirmation; the three links to the form
 * and the path landing clear of the header; and a page that does not make them
 * download the home and product pages' animations.
 *
 * Whether it *looks* like the Reference site is asked in
 * `partnership-matches-reference.spec.ts`. Console errors and failed requests
 * are `health.spec.ts`'s, which covers every route in `routes.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { ANIMATIONS, scriptsOf } from './animation-code';
import { sidewaysOverflow } from './geometry';
import { BASELINE_VIEWPORTS } from './reference-site';

const HEADINGS = [
  'لماذا شراكة، لا عمولة؟',
  'لمن هذا البرنامج',
  'ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك',
  'ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية',
  'من أول اجتماع إلى أول مشروع',
  'قبل الاجتماع الأول',
  'خلّنا نجلس ونصمّم النموذج المناسب لمكتبك',
] as const;

/** Verbatim from `reference/site/partnership.html`, in order. */
const AUDIENCES = [
  'المكاتب الهندسية الاستشارية',
  'شركات إدارة المشاريع (PMC)',
  'مجموعات المقاولات',
  'مطوّرون عقاريون متعددو المشاريع',
] as const;

/** Verbatim from `reference/site/partnership.html`, in order. */
const MODES = [
  {
    label: '01 · التضمين في العرض',
    title: 'المنصة ضمن نطاق خدماتك',
    fit: 'مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.',
  },
  {
    label: '02 · رخصة المكتب',
    title: 'اشتراك على مستوى المكتب',
    fit: 'مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.',
  },
  {
    label: '03 · الترشيح المعتمد',
    title: 'نتعاقد نحن مع المالك',
    fit: 'مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.',
  },
] as const;

/** Verbatim from `reference/site/partnership.html`, in order. */
const BENEFITS = [
  'تسعير شريك متفق عليه في الاتفاقية',
  'مدير حساب مخصص ونقطة تواصل واحدة',
  'تأهيل فريقك على المنصة، وإعادة التأهيل عند انضمام موظفين جدد',
  'دعم فني بأولوية لمشاريعك ولعملائك',
  'إعداد المشروع نيابةً عنك عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع',
  'لوحة شريك تعرض مشاريعك النشطة وحالة كل منها',
  'تسويق مشترك — ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع',
  'أولوية في خارطة الطريق لطلبات التطوير المتكررة من مشاريعك',
] as const;

/** Verbatim from `reference/site/partnership.html`, in order. */
const STAGES = [
  { label: 'المرحلة 01', title: 'اجتماع تعارف' },
  { label: 'المرحلة 02', title: 'تصميم نموذج التعاون' },
  { label: 'المرحلة 03', title: 'الاتفاقية والتأهيل' },
  { label: 'المرحلة 04', title: 'الإطلاق على أول مشروع' },
] as const;

/** Verbatim from `reference/site/partnership.html`, in order. */
const QUESTIONS = [
  {
    question: 'كم تكلفة الشراكة؟',
    answer: 'لا توجد رسوم انضمام. أما تسعير المنصة للشريك فيُحدَّد في اجتماع تصميم النموذج، لأنه يختلف باختلاف النمط وحجم المحفظة.',
  },
  {
    question: 'هل تتعاملون مباشرة مع عملائي؟',
    answer: 'يعتمد على النمط. في نمط التضمين تبقى العلاقة التعاقدية معك بالكامل، ونتعامل نحن مع فريق المشروع فنياً فقط.',
  },
  {
    question: 'ماذا يحدث للمشروع إذا انتهت علاقتي بالعميل في منتصفه؟',
    answer: 'هذه إحدى النقاط التي تُعالَج صراحةً في اتفاقية الشراكة، بما يضمن استمرار المشروع دون انقطاع وحفظ حقوق الطرفين.',
  },
  {
    question: 'هل هناك حد أدنى من المشاريع للانضمام؟',
    answer: 'لا حد معلن. لكن الأنماط تختلف بحسب حجم المحفظة، وسنقترح عليك الأنسب بعد الاجتماع الأول.',
  },
  {
    question: 'هل يمكن الجمع بين أكثر من نمط؟',
    answer: 'نعم، بعض الشركاء يبدأون بالترشيح المعتمد وينتقلون إلى التضمين بعد أول مشروعين.',
  },
  {
    question: 'نحن مكتب صغير — هل البرنامج لنا؟',
    answer: 'نعم. المشاريع المتوسطة هي تركيزنا، والمكاتب المتوسطة والصغيرة هي شريحتنا الأساسية.',
  },
] as const;

/** The Reference site's fake success: a confirmation of an application it never stored. */
const FAKE_CONFIRMATION = 'وصلنا طلبك';

const applicationForm = (page: Page) => page.getByRole('form', { name: 'اطلب اجتماع شراكة' });
const applyCopy = (page: Page) => page.locator('#apply .sign-grid > div:first-child');
const registrationField = (page: Page) =>
  applicationForm(page).locator('label', { has: page.getByLabel('السجل التجاري', { exact: true }) });

/** A small stand-in for a scanned commercial registration. */
const REGISTRATION = { name: 'commercial-registration.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n') };

test('every section is in the first response, every answer included', async ({ request }) => {
  const html = await (await request.get('/partnership')).text();

  expect(html).toContain('منصّة إدارة المشروع… ضمن عرضك أنت');
  for (const heading of HEADINGS) expect(html).toContain(heading);
  for (const audience of AUDIENCES) expect(html).toContain(audience);
  for (const mode of MODES) expect(html).toContain(mode.fit);
  for (const stage of STAGES) expect(html).toContain(stage.title);
  for (const entry of QUESTIONS) {
    expect(html).toContain(entry.question);
    // Closed or open, the answer is in the page: that is what a crawler reads.
    expect(html).toContain(entry.answer);
  }
  expect(html).toContain('اطلب اجتماع شراكة');

  expect(html).not.toContain(FAKE_CONFIRMATION);
  expect(html).not.toContain('data-fake-send');
});

test("the hero's figures are the Reference site's", async ({ page }) => {
  await page.goto('/partnership');

  await expect(page.locator('.phero .pstat b')).toHaveText(['3 أنماط', '4 مراحل', 'بلا رسوم']);
  await expect(page.locator('.phero .pstat > span')).toHaveText([
    'للتعاون، تختار معنا الأنسب',
    'من أول اجتماع إلى أول مشروع',
    'لا رسوم انضمام للبرنامج',
  ]);
});

test('the four audiences stand two to a row at desktop widths, and one to a row below 981px', async ({ page }) => {
  const tops = async () => page.locator('#who .rt-c').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/partnership');
  await expect(page.locator('#who .rt-c h3')).toHaveText([...AUDIENCES]);
  const [first, second, third, fourth] = await tops();
  expect(second).toBe(first);
  expect(fourth).toBe(third);
  expect(third).toBeGreaterThan(first);

  await page.setViewportSize({ width: 980, height: 900 });
  expect(new Set(await tops()).size, 'rows of audiences at 980px').toBe(4);
});

test('the three modes are in order, each with who it suits', async ({ page }) => {
  await page.goto('/partnership');

  const modes = page.locator('#modes .s');
  await expect(modes.locator('.k')).toHaveText(MODES.map((mode) => mode.label));
  await expect(modes.locator('h3')).toHaveText(MODES.map((mode) => mode.title));
  await expect(modes.locator('.fit')).toHaveText(MODES.map((mode) => mode.fit));
});

test("the partner's eight benefits are in order", async ({ page }) => {
  await page.goto('/partnership');

  await expect(page.locator('#benefits li > span')).toHaveText([...BENEFITS]);
});

test('the four stages are in order, each heading within its column and free to wrap', async ({ page }) => {
  // The narrowest phone, where a stage's text column is narrowest.
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto('/partnership');

  const stages = page.locator('#path .tail-steps li');
  await expect(stages.locator(':scope > b')).toHaveText(STAGES.map((stage) => stage.label));
  await expect(stages.locator('.ph')).toHaveText(STAGES.map((stage) => stage.title));

  for (const heading of await stages.locator('.ph').all()) {
    const [box, text] = await Promise.all([heading.boundingBox(), heading.locator('xpath=..').boundingBox()]);
    expect(box!.x + box!.width, 'a heading pushes out past its column').toBeLessThanOrEqual(text!.x + text!.width + 0.5);
    // HANDOFF §7.4 requires `.tail-steps .ph { white-space: normal }` to
    // survive. Today's four headings are short enough to fit their column on
    // one line with or without it, so nothing drawn shows the rule gone — a
    // build without it passed every other test. Its computed style is what
    // holds it, so a longer heading from the CMS (ticket 21) still wraps.
    await expect(heading).toHaveCSS('white-space', 'normal');
  }
});

test('every question is a native disclosure element, and opens with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/partnership');

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

test('the application form is a real form, with every field named and the required ones required', async ({ page }) => {
  await page.goto('/partnership');

  const fields = await applicationForm(page).evaluate((form: HTMLFormElement) =>
    [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')].map(
      (field) => ({
        name: field.name,
        type: field.type,
        required: field.required,
        accept: field instanceof HTMLInputElement ? field.accept : '',
      }),
    ),
  );

  expect(await applicationForm(page).getAttribute('method')).toBe('post');
  expect(await applicationForm(page).getAttribute('enctype')).toBe('multipart/form-data');

  // Starred on the Reference site; the free text is marked optional there
  // (HANDOFF §4.ج).
  expect(fields).toEqual([
    { name: 'company', type: 'text', required: true, accept: '' },
    { name: 'commercialRegistration', type: 'file', required: true, accept: '.pdf,.png,.jpg,.jpeg' },
    { name: 'city', type: 'text', required: true, accept: '' },
    { name: 'name', type: 'text', required: true, accept: '' },
    { name: 'jobTitle', type: 'text', required: true, accept: '' },
    { name: 'phone', type: 'tel', required: true, accept: '' },
    { name: 'email', type: 'email', required: true, accept: '' },
    { name: 'activity', type: 'select-one', required: true, accept: '' },
    { name: 'activeProjects', type: 'select-one', required: true, accept: '' },
    { name: 'clientType', type: 'select-one', required: true, accept: '' },
    { name: 'projectArea', type: 'select-one', required: true, accept: '' },
    { name: 'partnershipMode', type: 'select-one', required: true, accept: '' },
    { name: 'goals', type: 'textarea', required: false, accept: '' },
  ]);
});

test('each list offers every choice, and chooses none for the visitor', async ({ page }) => {
  await page.goto('/partnership');
  const form = applicationForm(page);

  const lists = [
    { label: 'نوع النشاط', options: ['نوع النشاط *', 'مكتب استشاري', 'إدارة مشاريع', 'مقاولات', 'تطوير عقاري', 'أخرى'] },
    {
      label: 'عدد المشاريع تحت الإشراف حالياً',
      options: ['عدد المشاريع تحت الإشراف *', '1–3', '4–10', '11–25', 'أكثر من 25'],
    },
    { label: 'نوع العملاء الغالب', options: ['نوع العملاء الغالب *', 'مطوّرون أفراد', 'شركات تطوير', 'جهات حكومية', 'مزيج'] },
    {
      label: 'متوسط مساحة المشروع',
      options: ['متوسط مساحة المشروع *', 'أقل من 5,000 م²', '5,000–20,000 م²', '20,000–50,000 م²', 'أكثر من 50,000 م²'],
    },
    {
      label: 'نمط التعاون المبدئي',
      options: ['نمط التعاون المبدئي *', 'التضمين في العرض', 'رخصة المكتب', 'الترشيح المعتمد', 'غير محدد'],
    },
  ];

  for (const list of lists) {
    const select = form.getByLabel(list.label, { exact: true });
    await expect(select).toHaveValue('');
    await expect(select.locator('option')).toHaveText(list.options);
    // Every real choice has a value, so the empty one is the only one
    // `required` refuses.
    const values = await select.locator('option').evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
    expect(values.slice(1).every((value) => value !== ''), `a choice in «${list.label}» has no value`).toBe(true);
  }
});

test('the free text says what the partnership is for, and is optional', async ({ page }) => {
  await page.goto('/partnership');

  const goals = applicationForm(page).getByRole('textbox', { name: 'ما الذي تريد تحقيقه من الشراكة' });
  await expect(goals).toHaveAttribute('placeholder', 'ما الذي تريد تحقيقه من الشراكة؟ (اختياري)');
  await expect(goals).toHaveAttribute('rows', '3');
  await expect(goals).not.toHaveAttribute('required');
});

test('the commercial registration shows the file chosen, and goes back to empty when it is cleared', async ({ page }) => {
  // Showing the name is the field's script, so it waits for the page to be
  // running rather than choosing a file into markup nothing is listening to.
  await page.goto('/partnership', { waitUntil: 'networkidle' });
  const field = registrationField(page);
  const input = applicationForm(page).getByLabel('السجل التجاري', { exact: true });

  await expect(field).toContainText('السجل التجاري *');
  await expect(field).toContainText('اختر ملفاً');

  await input.setInputFiles(REGISTRATION);
  await expect(field).toContainText(REGISTRATION.name);
  await expect(field).toHaveCSS('border-top-color', 'rgba(29, 158, 117, 0.45)');

  await input.setInputFiles([]);
  await expect(field).toContainText('اختر ملفاً');
  await expect(field).not.toContainText(REGISTRATION.name);
});

test('the commercial registration is reached from the keyboard, and shows it has focus', async ({ page }) => {
  await page.goto('/partnership');
  const form = applicationForm(page);

  // The field before it, then one Tab.
  await form.getByLabel('اسم المكتب أو الشركة').focus();
  await page.keyboard.press('Tab');

  await expect(form.getByLabel('السجل التجاري', { exact: true })).toBeFocused();
  await expect(registrationField(page)).toHaveCSS('outline-style', 'solid');
});


for (const { where, link, target } of [
  { where: '.phero', link: 'اطلب اجتماع شراكة', target: 'apply' },
  { where: '.phero', link: 'كيف نبني الشراكة ↓', target: 'path' },
  // The path's own link, beside its four stages.
  { where: '#path', link: 'اطلب اجتماع شراكة', target: 'apply' },
]) {
  test(`«${link}» in ${where} lands on #${target}, clear of the header`, async ({ page }) => {
    // A short window, so the page has room to scroll the target all the way to
    // the top — on a tall one the jump can stop early, which would pass
    // without the rule that keeps it clear.
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto('/partnership');

    await page.locator(where).getByRole('link', { name: link }).click();
    await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#${target}`);

    const clearance = await page.evaluate((id) => {
      const header = document.querySelector('.nav')!.getBoundingClientRect();
      return document.getElementById(id)!.getBoundingClientRect().top - header.bottom;
    }, target);
    expect(clearance, 'the header covers the top of the target').toBeGreaterThanOrEqual(0);
    expect(clearance, 'the target did not scroll to the top').toBeLessThan(20);
  });
}

test('the idea sends a visitor who wants something simpler to the Referral Program', async ({ page }) => {
  await page.goto('/partnership');

  await expect(page.locator('#idea').getByRole('link', { name: 'انتقل إلى برنامج الإحالة ←' })).toHaveAttribute('href', '/referral');
});

test('the header marks the partnership page as the one open', async ({ page }) => {
  await page.goto('/partnership');

  await expect(page.locator('.nsub-p a.on')).toHaveAttribute('href', '/partnership');
});

test('the form stands beside its copy at desktop widths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/partnership');

  const copy = (await applyCopy(page).boundingBox())!;
  const form = (await applicationForm(page).boundingBox())!;
  // Right to left: the copy first, on the right; the form on its left.
  expect(form.x + form.width).toBeLessThanOrEqual(copy.x);
  expect(form.y).toBeLessThan(copy.y + copy.height);
});

test('below 981px the form moves under its copy', async ({ page }) => {
  await page.setViewportSize({ width: 980, height: 900 });
  await page.goto('/partnership');

  const copy = (await applyCopy(page).boundingBox())!;
  const form = (await applicationForm(page).boundingBox())!;
  expect(form.y).toBeGreaterThanOrEqual(copy.y + copy.height);
});

test("the page loads none of the home and product pages' animations", async ({ page }) => {
  // The Reference partnership page carries all of them, for elements it does
  // not contain (spec: Analytics and performance).
  const partnership = await scriptsOf(page, '/partnership');
  for (const animation of ANIMATIONS) {
    expect(partnership.includes(animation.marker), `/partnership loads ${animation.name}`).toBe(false);
  }
});

for (const viewport of BASELINE_VIEWPORTS) {
  test(`no sideways scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/partnership');

    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}
