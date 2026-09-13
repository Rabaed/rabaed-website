/**
 * The CMS foundation (ticket 19): Ahmed signs in to an admin area on the
 * site's own domain, changes the contact points every page carries, and the
 * site follows — but only once he publishes.
 *
 * The site-settings tests edit the real settings of the test server's
 * database, and every page's footer reads them. They therefore run one at a
 * time, touch only the WhatsApp number and the social links — which no other
 * suite asserts on — and put back what they found.
 */
import { test, expect } from '@playwright/test';
import sharp from 'sharp';
import { ADMIN_PATH, footerLink, logIn, logInByApi } from './cms';

// One at a time, in order, and without the rest being skipped when one fails.
//
// Not only because of the shared site settings. Payload records a login by
// reading the editor's list of sessions, adding one and writing the list back,
// so two logins to the same account in the same instant can each overwrite
// the other's session — and a request made with the lost one is refused as if
// nobody were signed in. Run in parallel, these tests did exactly that. Two
// people signing in to one account within milliseconds is not a real risk;
// four tests doing so is a certainty.
test.describe.configure({ mode: 'default' });

/** The number the Reference site carries, which the first migration publishes. */
const REAL_NUMBER = '966576767900';
const REAL_WHATSAPP = `https://wa.me/${REAL_NUMBER}`;

test.describe('site settings', () => {
  test.afterEach(async ({ page }) => {
    await logInByApi(page.request);
    const restored = await page.request.post('/api/globals/site-settings', {
      data: {
        whatsappNumber: REAL_NUMBER,
        social: { linkedin: '', x: '', facebook: '', instagram: '' },
        _status: 'published',
      },
    });
    expect(restored.ok()).toBe(true);
  });

  test('a WhatsApp number published in the admin reaches the footer of every page', async ({ page, request }) => {
    expect(await footerLink(request, '/', 'واتساب')).toBe(REAL_WHATSAPP);

    await logIn(page);
    await page.goto(`${ADMIN_PATH}/globals/site-settings`);
    await page.getByLabel('WhatsApp number').fill('966500000019');
    await page.getByRole('button', { name: 'Publish changes' }).click();
    await expect(page.getByText('Updated successfully')).toBeVisible();

    for (const path of ['/', '/product', '/terms']) {
      await expect
        .poll(() => footerLink(request, path, 'واتساب'), { message: path })
        .toBe('https://wa.me/966500000019');
    }
  });

  test('social links published in the admin replace the empty footer icons', async ({ page, request }) => {
    // None has been supplied, so the icons keep the Reference site's `#`.
    expect(await footerLink(request, '/', 'لينكدإن')).toBe('#');

    await logIn(page);
    await page.goto(`${ADMIN_PATH}/globals/site-settings`);
    await page.getByLabel('LinkedIn').fill('https://www.linkedin.com/company/rabaed-test');
    await page.getByLabel('Instagram').fill('https://www.instagram.com/rabaed.test');
    await page.getByRole('button', { name: 'Publish changes' }).click();
    await expect(page.getByText('Updated successfully')).toBeVisible();

    await expect
      .poll(() => footerLink(request, '/start', 'لينكدإن'))
      .toBe('https://www.linkedin.com/company/rabaed-test');
    expect(await footerLink(request, '/start', 'إنستجرام')).toBe('https://www.instagram.com/rabaed.test');
    expect(await footerLink(request, '/start', 'إكس')).toBe('#');
  });

  test('a saved draft stays off the site until published, and the editor previews it first', async ({ page, request }) => {
    await logIn(page);
    await page.goto(`${ADMIN_PATH}/globals/site-settings`);
    await page.getByLabel('WhatsApp number').fill('966500000190');
    await page.getByRole('button', { name: 'Save Draft' }).click();
    await expect(page.getByText(/Draft saved successfully/)).toBeVisible();

    // A visitor still gets the published number. Asked twice, because a stale
    // page is served once more while it is rebuilt in the background: if the
    // draft had marked pages stale, the second answer would show it.
    await request.get('/');
    expect(await footerLink(request, '/', 'واتساب')).toBe(REAL_WHATSAPP);

    // The editor sees the draft on the real page, told that it is a preview.
    const previewOpened = page.context().waitForEvent('page');
    await page.getByRole('link', { name: 'Preview' }).click();
    const preview = await previewOpened;
    await expect(preview.locator('footer a[aria-label="واتساب"]')).toHaveAttribute('href', 'https://wa.me/966500000190');
    await expect(preview.getByRole('status')).toContainText('معاينة');

    // Leaving the preview shows the page as published again.
    await preview.getByRole('button', { name: 'إنهاء المعاينة' }).click();
    await expect(preview.locator('footer a[aria-label="واتساب"]')).toHaveAttribute('href', REAL_WHATSAPP);
    await expect(preview.getByRole('status')).toHaveCount(0);

    // Publishing the draft is what reaches visitors.
    await page.getByRole('button', { name: 'Publish changes' }).click();
    await expect(page.getByText('Updated successfully')).toBeVisible();
    await expect.poll(() => footerLink(request, '/', 'واتساب')).toBe('https://wa.me/966500000190');
  });

  test('a page rebuilt while a draft is waiting shows what is published, not the draft', async ({ page, request }) => {
    // Publishing marks every page stale; they are rebuilt on their next visit.
    // A draft saved before that visit must not be what they are rebuilt from.
    // The test above cannot see that mistake: nothing rebuilds a page after a
    // draft alone is saved, so it would pass even if pages read drafts.
    await logInByApi(page.request);
    const published = await page.request.post('/api/globals/site-settings', {
      data: { whatsappNumber: '966500000191', _status: 'published' },
    });
    expect(published.ok()).toBe(true);
    const drafted = await page.request.post('/api/globals/site-settings?draft=true', {
      data: { whatsappNumber: '966500000192', _status: 'draft' },
    });
    expect(drafted.ok()).toBe(true);

    await expect.poll(() => footerLink(request, '/referral', 'واتساب')).not.toBe(REAL_WHATSAPP);
    expect(await footerLink(request, '/referral', 'واتساب')).toBe('https://wa.me/966500000191');
  });

  test('preview is for signed-in editors only, and only of this site', async ({ page }) => {
    // A visitor who finds the address gets no preview: the site stays as published.
    const anonymous = await page.request.get('/api/preview?path=/', { maxRedirects: 0 });
    expect(anonymous.status()).toBe(401);
    await page.goto('/');
    await expect(page.getByRole('status')).toHaveCount(0);

    // An editor cannot be sent off the site through it, however the address is dressed up.
    await logInByApi(page.request);
    for (const trick of ['//example.com', '/%5Cexample.com', '/%09/example.com', 'https://example.com']) {
      const offSite = await page.request.get(`/api/preview?path=${trick}`, { maxRedirects: 0 });
      expect(offSite.status(), trick).toBeGreaterThanOrEqual(300);
      expect(offSite.status(), trick).toBeLessThan(400);
      expect(offSite.headers()['location'], trick).toBe('/');
    }
  });
});

test.describe('accounts', () => {
  const intruder = { email: 'intruder@example.com', password: 'a-perfectly-good-password' };

  test('nobody can sign up: the admin asks for a login and account creation is refused', async ({ page, request }) => {
    const admin = await page.goto(ADMIN_PATH);
    await expect(page).toHaveURL(new RegExp(`${ADMIN_PATH}/login`));
    expect(admin?.headers()['x-robots-tag']).toContain('noindex');

    expect((await request.post('/api/users/first-register', { data: intruder })).status()).toBe(403);
    expect((await request.post('/api/users', { data: intruder })).status()).toBe(403);
    expect((await request.post('/api/users/login', { data: intruder })).ok()).toBe(false);
  });

  test('the old address every scanner tries first is not the admin', async ({ request }) => {
    expect((await request.get('/admin')).status()).toBe(404);
  });

  test('an editor can invite another editor from inside the admin', async ({ page, browser }) => {
    await logInByApi(page.request);
    const invited = { email: `invited-${Date.now()}@rabaed.test`, password: 'invited-editor-password' };
    const created = await page.request.post('/api/users', { data: invited });
    expect(created.ok()).toBe(true);

    const fresh = await browser.newContext();
    const login = await fresh.request.post('/api/users/login', { data: invited });
    expect(login.ok()).toBe(true);
    await fresh.close();

    const { doc } = await created.json();
    expect((await page.request.delete(`/api/users/${doc.id}`)).ok()).toBe(true);
  });
});

test.describe('images', () => {
  test('an uploaded photograph is stored as WebP, with narrower copies made from it', async ({ page }) => {
    await logInByApi(page.request);
    const photograph = await sharp({
      create: { width: 2000, height: 1000, channels: 3, background: '#F95738' },
    })
      .png()
      .toBuffer();

    const response = await page.request.post('/api/media', {
      multipart: {
        file: { name: 'site-photo.png', mimeType: 'image/png', buffer: photograph },
        _payload: JSON.stringify({ alt: 'صورة للاختبار' }),
      },
    });
    expect(response.ok()).toBe(true);
    const { doc } = await response.json();

    try {
      expect(doc.mimeType).toBe('image/webp');
      const original = await page.request.get(doc.url);
      expect(original.headers()['content-type']).toBe('image/webp');

      for (const [name, width] of [['small', 480], ['medium', 960], ['large', 1600]] as const) {
        const file = await page.request.get(doc.sizes[name].url);
        expect(file.headers()['content-type'], name).toBe('image/webp');
        const metadata = await sharp(await file.body()).metadata();
        expect(metadata.format, name).toBe('webp');
        expect([metadata.width, metadata.height], name).toEqual([width, width / 2]);
      }
    } finally {
      await page.request.delete(`/api/media/${doc.id}`);
    }
  });

  test('an image without a description for screen readers is refused', async ({ page }) => {
    await logInByApi(page.request);
    const image = await sharp({ create: { width: 10, height: 10, channels: 3, background: '#222222' } }).png().toBuffer();
    const response = await page.request.post('/api/media', {
      multipart: { file: { name: 'no-alt.png', mimeType: 'image/png', buffer: image } },
    });
    expect(response.status()).toBe(400);
  });
});

test.describe('admin language', () => {
  test('an editor whose browser asks for Arabic gets the admin in Arabic, right to left', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ar-SA' });
    const page = await context.newPage();

    await page.goto(`${ADMIN_PATH}/login`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    // Payload writes it in capitals; the attribute is case-insensitive.
    await expect(page.locator('html')).toHaveAttribute('dir', /^rtl$/i);
    await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();

    await context.close();
  });
});
