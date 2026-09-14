/**
 * Every form on the site, submitted (ticket 27). One module, run per form and
 * per placement, in place of the "sends nothing" test each page's suite used to
 * carry a copy of.
 *
 * **The demo request form works**, in all three of its places — the end of the
 * home and product pages and beside the start page's questions. A visitor is
 * told in Arabic what is wrong, cannot send until the request is valid, and a
 * request that is sent is stored exactly once, where an editor finds it, with
 * an alert to the team and an Arabic confirmation to the visitor. The server
 * checks every answer itself, turns away a bot-shaped request and too many
 * requests from one address, and sends no mail at all while nobody has said
 * where alerts go.
 *
 * **The other three forms do not send yet**, and must not pretend to: each is
 * wired by its own ticket, which moves it from the second list to the first.
 *
 * Messages are restated here rather than imported from the form definitions,
 * for the reason `routes.ts` gives.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { test, expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { ADMIN_PATH, FORM_EDITOR, logInAs, logInByApi } from './cms';
import {
  documentsDirectory,
  mailTo,
  readerDelete,
  readerGet,
  submissionsFrom,
  uniqueApplicant,
  type StoredSubmission,
} from './forms';

const DEMO_FORM = 'احجز عرضاً حياً على مشروعك';
const DEMO_BUTTON = 'احجز عرضاً حياً';

/** The Reference site's own words for a request received, true now that it is. */
const RECEIVED = 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.';
const REFUSED = 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.';

/** What each required field says when it is left wrong. */
const DEMO_MESSAGES = {
  'الاسم الكامل': 'اكتب اسمك الكامل (حرفان على الأقل)',
  'البريد الإلكتروني': 'اكتب بريداً إلكترونياً صحيحاً',
  'دورك في المشروع': 'اختر دورك في المشروع',
  'رقم الجوال': 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)',
} as const;

const DEMO_PLACEMENTS = [
  { page: 'home', path: '/' },
  { page: 'product', path: '/product' },
  { page: 'start', path: '/start' },
] as const;

const APPLICANT = { name: 'سارة القحطاني', phone: '0500000000', company: 'شركة الإعمار' } as const;

/** Opens `path` as a visitor on network address `ip`, and returns its demo request form. */
async function openDemoForm(page: Page, path: string, ip: string): Promise<Locator> {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip });
  // The form checks answers as they are typed, so it waits for the page to run.
  await page.goto(path, { waitUntil: 'networkidle' });
  return page.getByRole('form', { name: DEMO_FORM });
}

async function fillDemoRequest(form: Locator, email: string): Promise<void> {
  await form.getByLabel('الاسم الكامل').fill(APPLICANT.name);
  await form.getByLabel('البريد الإلكتروني').fill(email);
  await form.getByLabel('دورك في المشروع').selectOption('owner');
  await form.getByLabel('رقم الجوال').fill(APPLICANT.phone);
  await form.getByLabel('اسم الشركة').fill(APPLICANT.company);
  await form.getByLabel('عدد المشاريع النشطة').fill('3');
}

/** Fills in and sends a valid request from `path`, and waits to be told it arrived. */
async function sendDemoRequest(page: Page, path: string, applicant: { email: string; ip: string }): Promise<void> {
  const form = await openDemoForm(page, path, applicant.ip);
  await fillDemoRequest(form, applicant.email);
  await form.getByRole('button', { name: DEMO_BUTTON }).click();
  await expect(form.getByRole('status')).toHaveText(RECEIVED);
}

/** The one submission stored with this address, once the mail sent after it has settled. */
async function settledSubmission(request: APIRequestContext, email: string): Promise<StoredSubmission> {
  await expect
    .poll(async () => (await submissionsFrom(request, email)).map((each) => each.confirmation))
    .toEqual([expect.stringMatching(/^(sent|skipped|failed)$/)]);
  return (await submissionsFrom(request, email))[0];
}

for (const placement of DEMO_PLACEMENTS) {
  test.describe(`the demo request form on ${placement.path}`, () => {
    test('says in Arabic what is wrong once a field is left, and unlocks only when the request is valid', async ({ page }) => {
      const { email, ip } = uniqueApplicant(`demo-${placement.page}`);
      const form = await openDemoForm(page, placement.path, ip);
      const button = form.getByRole('button', { name: DEMO_BUTTON });

      await expect(button).toBeDisabled();
      for (const message of Object.values(DEMO_MESSAGES)) {
        await expect(form.getByText(message, { exact: true })).toBeHidden();
      }

      // Into each required field and out again, empty.
      for (const [label, message] of Object.entries(DEMO_MESSAGES)) {
        const field = form.getByLabel(label, { exact: true });
        await field.focus();
        await field.blur();
        await expect(form.getByText(message, { exact: true }), label).toBeVisible();
        await expect(field, label).toHaveAttribute('aria-invalid', 'true');
      }

      await fillDemoRequest(form, email);
      for (const message of Object.values(DEMO_MESSAGES)) {
        await expect(form.getByText(message, { exact: true })).toBeHidden();
      }
      await expect(button).toBeEnabled();

      // The company and the number of projects may be left out.
      await form.getByLabel('اسم الشركة').fill('');
      await form.getByLabel('عدد المشاريع النشطة').fill('');
      await expect(button).toBeEnabled();

      // And it locks again the moment an answer stops being valid.
      await form.getByLabel('البريد الإلكتروني').fill('sara@example');
      await expect(button).toBeDisabled();
    });

    test('a valid request is stored once, where an editor finds it, and the visitor is told it arrived', async ({
      page,
      request,
    }) => {
      const { email, ip } = uniqueApplicant(`demo-${placement.page}`);
      const form = await openDemoForm(page, placement.path, ip);
      const address = page.url();
      await fillDemoRequest(form, email);

      // Twice, as an impatient visitor would.
      await form.getByRole('button', { name: DEMO_BUTTON }).dblclick();

      await expect(form.getByRole('status')).toHaveText(RECEIVED);
      // The request is gone from the page, so it cannot be sent again by mistake.
      await expect(form.getByLabel('الاسم الكامل')).toHaveCount(0);
      expect(page.url(), 'what was typed went into the address').toBe(address);

      const stored = await submissionsFrom(request, email);
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({ form: 'demo-request', name: APPLICANT.name, email, phone: APPLICANT.phone });
      // Every answer, under the words the visitor saw; a choice keeps its value and its Arabic text.
      expect(stored[0].answers.map(({ field, label, value, option }) => ({ field, label, value, option }))).toEqual([
        { field: 'name', label: 'الاسم الكامل', value: APPLICANT.name, option: null },
        { field: 'email', label: 'البريد الإلكتروني', value: email, option: null },
        { field: 'role', label: 'دورك في المشروع', value: 'owner', option: 'مالك / مطوّر' },
        { field: 'phone', label: 'رقم الجوال', value: APPLICANT.phone, option: null },
        { field: 'company', label: 'اسم الشركة', value: APPLICANT.company, option: null },
        { field: 'activeProjects', label: 'عدد المشاريع النشطة', value: '3', option: null },
      ]);
    });
  });
}

test.describe('the demo request form, on the server', () => {
  test('checks every answer itself: a wrong one the browser let through is refused, and nothing is stored', async ({
    page,
    request,
  }) => {
    const { email, ip } = uniqueApplicant('demo-server-check');
    const form = await openDemoForm(page, '/start', ip);
    await fillDemoRequest(form, email);

    // A role the form does not offer, as a request made by hand could send.
    await form.getByLabel('دورك في المشروع').evaluate((select: HTMLSelectElement) => {
      select.selectedOptions[0].value = 'architect';
    });
    await form.getByRole('button', { name: DEMO_BUTTON }).click();

    await expect(form.getByText(DEMO_MESSAGES['دورك في المشروع'], { exact: true })).toBeVisible();
    await expect(form.getByText(RECEIVED)).toHaveCount(0);
    expect(await submissionsFrom(request, email)).toEqual([]);
  });

  test('a request with the hidden trap field filled in, the way a bot fills every field, is refused and stored nowhere', async ({
    page,
    request,
  }) => {
    const { email, ip } = uniqueApplicant('demo-trap');
    const form = await openDemoForm(page, '/', ip);
    await fillDemoRequest(form, email);

    // Out of sight and out of the keyboard order, so a person never reaches it.
    const trap = form.locator('textarea[name="website"]');
    await expect(trap).toHaveAttribute('tabindex', '-1');
    await trap.fill('https://spam.example', { force: true });
    await form.getByRole('button', { name: DEMO_BUTTON }).click();

    await expect(form.getByRole('alert')).toHaveText(REFUSED);
    await expect(form.getByText(RECEIVED)).toHaveCount(0);
    expect(await submissionsFrom(request, email)).toEqual([]);
  });

  test('from one network address, a sixth request within the hour is refused; another address is not held back', async ({
    page,
    request,
  }) => {
    const { ip } = uniqueApplicant('demo-limit');
    for (let count = 1; count <= 5; count++) {
      await sendDemoRequest(page, '/start', { ip, email: uniqueApplicant('demo-limit').email });
    }

    const sixth = uniqueApplicant('demo-limit');
    const form = await openDemoForm(page, '/start', ip);
    await fillDemoRequest(form, sixth.email);
    await form.getByRole('button', { name: DEMO_BUTTON }).click();
    await expect(form.getByRole('alert')).toHaveText(REFUSED);
    expect(await submissionsFrom(request, sixth.email)).toEqual([]);

    await sendDemoRequest(page, '/start', uniqueApplicant('demo-limit'));
  });
});

/**
 * Where alerts go and what the forms say are the CMS's, and every test in the
 * run shares them. These tests change them one at a time and put back what
 * they found; what they change — the alert address, one placeholder and the
 * confirmation's subject — is read by no other suite.
 */
test.describe('mail and wording from the admin', () => {
  test.describe.configure({ mode: 'default' });

  const SETTINGS = '/api/globals/demo-request-form';

  type Settings = Record<string, unknown> & {
    alertAddress?: string | null;
    confirmationSubject: string;
    fields: { company: { placeholder: string } };
  };

  async function readSettings(request: APIRequestContext): Promise<Settings> {
    const response = await request.get(`${SETTINGS}?depth=0`);
    expect(response.ok()).toBe(true);
    const { id, globalType, createdAt, updatedAt, ...settings } = await response.json();
    return settings;
  }

  async function publishSettings(request: APIRequestContext, settings: Settings): Promise<void> {
    const response = await request.post(SETTINGS, { data: { ...settings, _status: 'published' } });
    expect(response.ok(), await response.text()).toBe(true);
  }

  test('while no alert address is set, a request is still stored, and no mail at all is sent', async ({
    page,
    request,
  }) => {
    await logInByApi(request, FORM_EDITOR);
    expect((await readSettings(request)).alertAddress ?? '').toBe('');

    const applicant = uniqueApplicant('demo-unaddressed');
    await sendDemoRequest(page, '/product', applicant);

    const stored = await settledSubmission(request, applicant.email);
    expect(stored).toMatchObject({ alert: 'skipped', confirmation: 'skipped' });
    expect(await mailTo(applicant.email)).toEqual([]);
  });

  test('with an alert address set, the team is alerted and the visitor gets an Arabic confirmation', async ({
    page,
    request,
  }) => {
    await logInByApi(request, FORM_EDITOR);
    const original = await readSettings(request);
    const team = uniqueApplicant('team').email;

    try {
      await publishSettings(request, { ...original, alertAddress: team });
      const applicant = uniqueApplicant('demo-addressed');
      await sendDemoRequest(page, '/', applicant);

      // While the address is set, requests other suites send are alerted
      // there too; this one's alert is the one that answers to this visitor.
      const alertsFor = async () => (await mailTo(team)).filter((mail) => mail.replyTo === applicant.email);
      await expect.poll(alertsFor).toHaveLength(1);
      const [alert] = await alertsFor();
      expect(alert.subject).toContain(APPLICANT.name);
      for (const answer of [APPLICANT.name, applicant.email, APPLICANT.phone, 'مالك / مطوّر', APPLICANT.company]) {
        expect(alert.text).toContain(answer);
      }
      const stored = await settledSubmission(request, applicant.email);
      expect(alert.text).toContain(`${ADMIN_PATH}/collections/form-submissions/${stored.id}`);

      await expect.poll(() => mailTo(applicant.email)).toHaveLength(1);
      const [confirmation] = await mailTo(applicant.email);
      expect(confirmation.subject).toBe('ربائد — وصلنا طلبك للعرض الحي');
      expect(confirmation.text).toContain(`مرحباً ${APPLICANT.name}،`);
      expect(confirmation.text).toContain('سيتواصل معك فريقنا خلال يوم عمل لتحديد الموعد.');

      expect(stored).toMatchObject({ alert: 'sent', confirmation: 'sent' });
    } finally {
      await publishSettings(request, original);
    }
  });

  test('wording an editor publishes reaches the form in all three places, and the confirmation', async ({
    page,
    request,
  }) => {
    const PLACEHOLDER = 'اسم جهة العمل — للاختبار';
    const SUBJECT = 'ربائد — تأكيد للاختبار';
    await logInByApi(request, FORM_EDITOR);
    const original = await readSettings(request);

    try {
      await publishSettings(request, {
        ...original,
        alertAddress: uniqueApplicant('team').email,
        confirmationSubject: SUBJECT,
        fields: { ...original.fields, company: { ...original.fields.company, placeholder: PLACEHOLDER } },
      });

      for (const placement of DEMO_PLACEMENTS) {
        await expect
          .poll(async () => (await (await request.get(placement.path)).text()).includes(`placeholder="${PLACEHOLDER}"`), {
            message: placement.path,
          })
          .toBe(true);
      }

      const applicant = uniqueApplicant('demo-reworded');
      await sendDemoRequest(page, '/start', applicant);
      await expect.poll(() => mailTo(applicant.email)).toHaveLength(1);
      expect((await mailTo(applicant.email))[0].subject).toBe(SUBJECT);
    } finally {
      await publishSettings(request, original);
    }
  });

  test('an editor finds a request in the admin, among the form submissions', async ({ page, request }) => {
    const applicant = uniqueApplicant('demo-admin');
    await sendDemoRequest(page, '/start', applicant);

    await logInAs(page, FORM_EDITOR);
    await page.goto(`${ADMIN_PATH}/collections/form-submissions`);
    await expect(page.getByRole('link', { name: APPLICANT.name }).first()).toBeVisible();
    await expect(page.getByText(applicant.email)).toBeVisible();

    const stored = (await submissionsFrom(request, applicant.email))[0];
    await page.goto(`${ADMIN_PATH}/collections/form-submissions/${stored.id}`);
    await expect(page.getByRole('heading', { name: APPLICANT.name, level: 1 })).toBeVisible();
    // The role, third of the answers: its value, and beside it the Arabic the visitor chose.
    await expect(page.getByRole('textbox', { name: 'Answer', exact: true }).nth(2)).toHaveValue('owner');
    await expect(page.getByRole('textbox', { name: 'Option shown' }).nth(2)).toHaveValue('مالك / مطوّر');
  });

  test("an editor opens a signup's documents from its record in the admin", async ({ page, request }) => {
    const applicant = uniqueApplicant('referral-admin');
    await sendReferral(page, applicant);
    const [stored] = await submissionsFrom(request, applicant.email);

    await logInAs(page, FORM_EDITOR);
    await page.goto(`${ADMIN_PATH}/collections/form-submissions/${stored.id}`);
    const open = page.getByRole('link', { name: 'Open document' });
    await expect(open).toHaveCount(2);

    const href = await open.first().getAttribute('href');
    expect(href).toMatch(/^\/api\/form-documents\/\d+\/ibanCertificate\?/);
    const document = await page.request.get(href!);
    expect(document.status()).toBe(200);
    expect(Buffer.compare(await document.body(), IBAN.buffer)).toBe(0);
  });
});

/**
 * The Referral Program signup (ticket 28): the same pipeline, with documents.
 * The IBAN certificate is required and the two registrations optional; each is
 * a PDF or an image of at most 10 MB, checked as it is chosen and again, by
 * its contents, on the server. Documents go to private storage, and are opened
 * only by a signed-in editor through a link that expires.
 */
const REFERRAL_FORM = 'سجّل في برنامج الإحالة';
const REFERRAL_RECEIVED = 'وصلنا تسجيلك — سنراجع بياناتك ومستنداتك ونتواصل معك لإصدار كودك.';

const REFERRAL_MESSAGES = {
  'الاسم الكامل': 'اكتب اسمك الكامل (حرفان على الأقل)',
  'رقم الجوال': 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)',
  'البريد الإلكتروني': 'اكتب بريداً إلكترونياً صحيحاً',
  'المدينة': 'اكتب اسم مدينتك',
  'الصفة المهنية': 'اختر صفتك المهنية',
  'اسم صاحب الحساب البنكي': 'اكتب اسم صاحب الحساب كما في شهادة الآيبان',
} as const;

const TERMS_MESSAGE = 'يلزم الموافقة على الشروط والأحكام وسياسة الخصوصية';
const IBAN_MISSING = 'أرفق شهادة الآيبان';
const DOCUMENT_TOO_LARGE = 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر';
const DOCUMENT_WRONG_TYPE = 'ارفع ملف PDF أو صورة PNG أو JPG';

const IBAN = {
  name: 'iban-certificate.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n'),
};
/** The PNG signature and a few bytes more: an image by its contents, not only its name. */
const REGISTRATION = {
  name: 'commercial-registration.png',
  mimeType: 'image/png',
  buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]),
};

async function openReferralForm(page: Page, ip: string): Promise<Locator> {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip });
  await page.goto('/referral', { waitUntil: 'networkidle' });
  return page.getByRole('form', { name: REFERRAL_FORM });
}

const referralButton = (form: Locator) => form.getByRole('button', { name: REFERRAL_FORM });

async function fillReferral(form: Locator, email: string): Promise<void> {
  await form.getByLabel('الاسم الكامل').fill(APPLICANT.name);
  await form.getByLabel('رقم الجوال').fill(APPLICANT.phone);
  await form.getByLabel('البريد الإلكتروني').fill(email);
  await form.getByLabel('المدينة').fill('الرياض');
  await form.getByLabel('الصفة المهنية').selectOption('engineer');
  await form.getByLabel('شهادة الآيبان', { exact: true }).setInputFiles(IBAN);
  await form.getByLabel('اسم صاحب الحساب البنكي').fill(APPLICANT.name);
  await form.getByLabel('السجل التجاري', { exact: true }).setInputFiles(REGISTRATION);
  await form.getByRole('checkbox', { name: 'الموافقة على الشروط والأحكام' }).check();
  await form.getByRole('checkbox', { name: 'إقرار عدم التعارض' }).check();
}

/** Fills in and sends a valid signup, and waits to be told it arrived. */
async function sendReferral(page: Page, applicant: { email: string; ip: string }): Promise<void> {
  const form = await openReferralForm(page, applicant.ip);
  await fillReferral(form, applicant.email);
  await referralButton(form).click();
  await expect(form.getByRole('status')).toHaveText(REFERRAL_RECEIVED);
}

test.describe('the Referral Program signup', () => {
  test('says in Arabic what is wrong, and unlocks only with every answer, the IBAN certificate and both consents', async ({
    page,
  }) => {
    const { email, ip } = uniqueApplicant('referral-rules');
    const form = await openReferralForm(page, ip);
    await expect(referralButton(form)).toBeDisabled();

    for (const [label, message] of Object.entries(REFERRAL_MESSAGES)) {
      const field = form.getByLabel(label, { exact: true });
      await field.focus();
      await field.blur();
      await expect(form.getByText(message, { exact: true }), label).toBeVisible();
    }
    const terms = form.getByRole('checkbox', { name: 'الموافقة على الشروط والأحكام' });
    await terms.focus();
    await terms.blur();
    await expect(form.getByText(TERMS_MESSAGE, { exact: true })).toBeVisible();

    await fillReferral(form, email);
    await expect(referralButton(form)).toBeEnabled();

    // The registrations are optional.
    await form.getByLabel('السجل التجاري', { exact: true }).setInputFiles([]);
    await expect(referralButton(form)).toBeEnabled();

    // The IBAN certificate is not, and neither is either consent.
    const certificate = form.getByLabel('شهادة الآيبان', { exact: true });
    await certificate.setInputFiles([]);
    await expect(form.getByText(IBAN_MISSING, { exact: true })).toBeVisible();
    await expect(referralButton(form)).toBeDisabled();
    await certificate.setInputFiles(IBAN);
    await expect(referralButton(form)).toBeEnabled();
    await form.getByRole('checkbox', { name: 'إقرار عدم التعارض' }).uncheck();
    await expect(referralButton(form)).toBeDisabled();
  });

  test('a document too large or of the wrong kind is refused as soon as it is chosen, in Arabic', async ({ page }) => {
    const { email, ip } = uniqueApplicant('referral-chosen');
    const form = await openReferralForm(page, ip);
    await fillReferral(form, email);
    const certificate = form.getByLabel('شهادة الآيبان', { exact: true });

    await certificate.setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10 * 1024 * 1024 + 1, 0x25) });
    await expect(form.getByText(DOCUMENT_TOO_LARGE, { exact: true })).toBeVisible();
    await expect(certificate).toHaveAttribute('aria-invalid', 'true');
    await expect(referralButton(form)).toBeDisabled();

    await certificate.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not a certificate') });
    await expect(form.getByText(DOCUMENT_WRONG_TYPE, { exact: true })).toBeVisible();
    await expect(form.getByText(DOCUMENT_TOO_LARGE, { exact: true })).toBeHidden();
    await expect(referralButton(form)).toBeDisabled();

    await certificate.setInputFiles(IBAN);
    await expect(form.getByText(DOCUMENT_WRONG_TYPE, { exact: true })).toBeHidden();
    await expect(referralButton(form)).toBeEnabled();
  });

  test('the server checks each document by what is in it: a file only named like a PDF is refused, and nothing is stored', async ({
    page,
    request,
  }) => {
    const { email, ip } = uniqueApplicant('referral-disguised');
    const form = await openReferralForm(page, ip);
    await fillReferral(form, email);
    await form
      .getByLabel('شهادة الآيبان', { exact: true })
      .setInputFiles({ name: 'iban-certificate.pdf', mimeType: 'application/pdf', buffer: Buffer.from('this is not a PDF') });
    await referralButton(form).click();

    await expect(form.getByText(DOCUMENT_WRONG_TYPE, { exact: true })).toBeVisible();
    await expect(form.getByText(REFERRAL_RECEIVED)).toHaveCount(0);
    expect(await submissionsFrom(request, email)).toEqual([]);
  });

  test('the server refuses a document over 10 MB and a signup without both consents however they are sent, and a form sent from another site', async ({
    request,
    baseURL,
  }) => {
    const { email, ip } = uniqueApplicant('referral-direct');
    const answers = {
      name: APPLICANT.name,
      phone: APPLICANT.phone,
      email,
      city: 'الرياض',
      profession: 'engineer',
      accountHolder: APPLICANT.name,
      acceptTerms: 'on',
      declareNoConflict: 'on',
      submissionToken: '2f1d8c4e-3b6a-4d2e-9f1a-7c5b3e2d1a09',
    };
    const oversized = { name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.concat([IBAN.buffer, Buffer.alloc(10 * 1024 * 1024)]) };

    const sent = await request.post('/api/forms/referral-signup', {
      headers: { origin: baseURL!, 'x-forwarded-for': ip },
      multipart: { ...answers, ibanCertificate: oversized },
    });
    expect(await sent.json()).toMatchObject({ outcome: 'invalid', problems: { ibanCertificate: 'tooLarge' } });

    const { acceptTerms: _terms, declareNoConflict: _declaration, ...withoutConsents } = answers;
    const unconsented = await request.post('/api/forms/referral-signup', {
      headers: { origin: baseURL!, 'x-forwarded-for': ip },
      multipart: { ...withoutConsents, ibanCertificate: IBAN },
    });
    expect(await unconsented.json()).toEqual({ outcome: 'invalid', fields: ['acceptTerms', 'declareNoConflict'] });

    const crossSite = await request.post('/api/forms/referral-signup', {
      headers: { origin: 'https://example.com', 'x-forwarded-for': ip },
      multipart: { ...answers, ibanCertificate: IBAN },
    });
    expect(crossSite.status()).toBe(403);

    expect(await submissionsFrom(request, email)).toEqual([]);
  });

  test('a valid signup is stored once, with its documents and both consents, and shows its upload on the way', async ({
    page,
    request,
  }) => {
    const { email, ip } = uniqueApplicant('referral-stored');
    const form = await openReferralForm(page, ip);
    await fillReferral(form, email);

    // Held on its way, so the upload can be seen.
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route('**/api/forms/referral-signup', async (route) => {
      await held;
      await route.continue();
    });

    // Twice, as an impatient visitor would.
    await referralButton(form).dblclick();
    // Only that it shows while the signup is on its way: a request held by the
    // test is not on the network, so the browser reports no progress through
    // it, and on this machine an unheld upload is over before it can be seen.
    await expect(form.getByRole('progressbar', { name: 'رفع شهادة الآيبان' })).toBeVisible();
    await expect(referralButton(form)).toBeDisabled();
    release();

    await expect(form.getByRole('status')).toHaveText(REFERRAL_RECEIVED);
    await expect(form.getByRole('progressbar')).toHaveCount(0);

    const stored = await submissionsFrom(request, email);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ form: 'referral-signup', name: APPLICANT.name, email, phone: APPLICANT.phone });
    expect(stored[0].documents.map(({ field, fileName, contentType, size }) => ({ field, fileName, contentType, size }))).toEqual([
      { field: 'ibanCertificate', fileName: IBAN.name, contentType: 'application/pdf', size: IBAN.buffer.length },
      { field: 'commercialRegistration', fileName: REGISTRATION.name, contentType: 'image/png', size: REGISTRATION.buffer.length },
    ]);
    const consents = stored[0].answers
      .filter((answer) => answer.field === 'acceptTerms' || answer.field === 'declareNoConflict')
      .map(({ field, value }) => ({ field, value }));
    expect(consents).toEqual([
      { field: 'acceptTerms', value: 'accepted' },
      { field: 'declareNoConflict', value: 'accepted' },
    ]);
  });

  test('a document is not publicly retrievable: only a signed-in editor opens it, through a signed link that expires', async ({
    page,
    request,
    playwright,
    baseURL,
  }) => {
    const applicant = uniqueApplicant('referral-private');
    await sendReferral(page, applicant);
    const [stored] = await submissionsFrom(request, applicant.email);
    const certificate = stored.documents.find((document) => document.field === 'ibanCertificate')!;
    expect(certificate.link).toMatch(/^\/api\/form-documents\/\d+\/ibanCertificate\?expires=\d+&signature=[0-9a-f]+$/);

    // A signed-in editor with the link: the document, as it was uploaded.
    const opened = await readerGet(request, certificate.link);
    expect(opened.status()).toBe(200);
    expect(opened.headers()['content-type']).toBe('application/pdf');
    expect(opened.headers()['cache-control']).toContain('no-store');
    expect(Buffer.compare(await opened.body(), IBAN.buffer)).toBe(0);

    // Anyone else with the very same link: nothing.
    const stranger = await playwright.request.newContext({ baseURL });
    expect((await stranger.get(certificate.link)).status()).toBe(401);
    await stranger.dispose();

    // The editor, with the address guessed or the link altered: nothing.
    const link = new URL(certificate.link, baseURL);
    const expired = new URL(link);
    expired.searchParams.set('expires', String(Math.floor(Date.now() / 1000) - 1));
    const tampered = new URL(link);
    tampered.searchParams.set('signature', '0'.repeat(64));
    const otherField = new URL(link);
    otherField.pathname = otherField.pathname.replace('ibanCertificate', 'commercialRegistration');
    for (const attempt of [link.pathname, `${expired.pathname}${expired.search}`, `${tampered.pathname}${tampered.search}`, `${otherField.pathname}${otherField.search}`]) {
      expect((await readerGet(request, attempt)).status(), attempt).toBe(403);
    }
  });

  test("deleting a signup deletes its documents from storage", async ({ page, request }) => {
    const applicant = uniqueApplicant('referral-deleted');
    await sendReferral(page, applicant);
    const [stored] = await submissionsFrom(request, applicant.email);
    const files = stored.documents.map((document) => path.join(documentsDirectory(), document.key));
    expect(files).toHaveLength(2);
    for (const file of files) expect(existsSync(file), file).toBe(true);

    const deleted = await readerDelete(request, `/api/form-submissions/${stored.id}`);
    expect(deleted.ok()).toBe(true);

    for (const file of files) expect(existsSync(file), file).toBe(false);
    expect((await readerGet(request, stored.documents[0].link)).status()).toBe(404);
  });
});

/**
 * The forms whose tickets have not wired them yet. Until then each sends
 * nothing, delivers nothing, and claims nothing — not the Reference site's fake
 * confirmations, and not what the visitor typed in the address.
 */
const NOT_SENDING_YET = [
  {
    name: 'the partnership application',
    ticket: 29,
    path: '/partnership',
    form: 'اطلب اجتماع شراكة',
    fill: async (form: Locator) => {
      await form.getByLabel('اسم المكتب أو الشركة').fill('مكتب الرياض الهندسي');
      await form.getByLabel('اسم مقدّم الطلب').fill(APPLICANT.name);
      await form.getByLabel('رقم الجوال').fill(APPLICANT.phone);
      return form.getByLabel('رقم الجوال');
    },
    fakes: ['وصلنا طلبك'],
    finePrint: 'نموذج أولي — لا يُرسل فعلياً في هذه النسخة.',
  },
  {
    // Unlocked once its details are valid, as the Reference site's is, but the
    // file is delivered only after the details are recorded (spec: Forms).
    name: 'the Pour Tracker download',
    ticket: 30,
    path: '/tool',
    form: 'بيانات التحميل',
    fill: async (form: Locator) => {
      await form.getByLabel('الاسم الأول', { exact: true }).fill('أحمد');
      await form.getByLabel('اسم العائلة', { exact: true }).fill('السالم');
      await form.getByLabel('رقم الجوال', { exact: true }).fill('51 123 4567');
      await form.getByLabel('البريد الإلكتروني', { exact: true }).fill('ahmed@example.com');
      await expect(form.locator('button[type="submit"]')).toBeEnabled();
      return form.getByLabel('البريد الإلكتروني', { exact: true });
    },
    fakes: ['تم — التحميل بدأ'],
    finePrint: null,
  },
] as const;

for (const entry of NOT_SENDING_YET) {
  test(`${entry.name} sends nothing and claims nothing until ticket ${entry.ticket} wires it`, async ({ page }) => {
    const sent: string[] = [];
    const downloads: string[] = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') sent.push(`${request.method()} ${request.url()}`);
    });
    page.on('download', (download) => downloads.push(download.suggestedFilename()));

    await page.goto(entry.path, { waitUntil: 'networkidle' });
    const address = page.url();
    const form = page.getByRole('form', { name: entry.form });

    // Enter in a field, and the button itself.
    const lastField = await entry.fill(form);
    await lastField.press('Enter');
    await form.locator('button[type="submit"]').click({ force: true });
    await page.waitForTimeout(500);

    expect(sent, 'the form sent something').toEqual([]);
    expect(downloads, 'a file was delivered').toEqual([]);
    expect(page.url(), 'what was typed went into the address').toBe(address);
    for (const fake of entry.fakes) await expect(page.getByText(fake)).toHaveCount(0);
    // Nothing was cleared as though sent.
    await expect(lastField).not.toHaveValue('');
    if (entry.finePrint) await expect(form.locator('.fine')).toHaveText(entry.finePrint);
  });
}
