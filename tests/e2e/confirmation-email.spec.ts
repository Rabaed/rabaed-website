/**
 * The confirmation email as Ahmed designs it in the CMS (ADR-0028): the
 * banner every form shares, each form's rich text and button, sent to the
 * applicant as an HTML email, and previewed under the form's settings.
 *
 * Runs against the second test server, one suite at a time
 * (`playwright.config.ts`): the banner is every form's, so while it is set
 * every confirmation any suite beside it sent would carry it.
 */
import { randomUUID } from 'node:crypto';
import { test, expect, request as newRequest } from '@playwright/test';
import sharp from 'sharp';
import { signIn, signedIn } from './editors';
import { postDemoRequest, publishDemoSettings, readDemoSettings } from './demo-request-api';
import { mailTo, uniqueApplicant } from './forms';
import { oneSuiteAtATime } from './one-suite-at-a-time';

oneSuiteAtATime(test);

const PREVIEW = '/api/preview/confirmation-email?form=demo-request&locale=ar';
const BANNER_ALT = 'فريق ربائد في موقع مشروع';

const text = (value: string, format = 0) => ({ type: 'text', text: value, format, detail: 0, mode: 'normal', style: '', version: 1 });
const block = (type: string, children: unknown[], extra: object = {}) => ({ type, children, format: '', indent: 0, version: 1, direction: null, ...extra });

/** The rich text this suite writes: a heading, the greeting, and a sentence with a bold word. */
const DESIGNED = {
  root: block('root', [
    block('heading', [text('أهلاً بك في ربائد')], { tag: 'h2' }),
    block('paragraph', [text('مرحباً {الاسم}،')], { textFormat: 0, textStyle: '' }),
    block('paragraph', [text('سنتواصل معك '), text('خلال يوم عمل', 1), text('.')], { textFormat: 0, textStyle: '' }),
  ]),
};

test('the preview answers only an editor who is signed in', async ({ baseURL }) => {
  const visitor = await newRequest.newContext({ baseURL });
  expect((await visitor.get(PREVIEW)).status()).toBe(401);
  await visitor.dispose();
});

test('a confirmation goes out as designed: the shared banner, the form’s rich text and its button', async ({ request, baseURL }) => {
  await signIn(request);
  const editor = signedIn(request);
  const original = await readDemoSettings(request);

  const jpeg = await sharp({ create: { width: 2400, height: 800, channels: 3, background: '#14161C' } }).jpeg().toBuffer();
  const uploaded = await editor.post('/api/email-images', {
    multipart: {
      file: { name: `banner-${randomUUID()}.jpg`, mimeType: 'image/jpeg', buffer: jpeg },
      _payload: JSON.stringify({ alt: BANNER_ALT }),
    },
  });
  expect(uploaded.ok(), await uploaded.text()).toBe(true);
  const banner = (await uploaded.json()).doc as { id: number; mimeType: string };
  // Kept as the JPEG it arrived as: Outlook shows no WebP in an email.
  expect(banner.mimeType).toBe('image/jpeg');

  try {
    const chosen = await editor.post('/api/globals/confirmation-email', { data: { banner: banner.id } });
    expect(chosen.ok(), await chosen.text()).toBe(true);
    const team = uniqueApplicant('confirmation-email-team').email;
    await publishDemoSettings(request, {
      ...original,
      alertAddress: team,
      confirmationMessage: DESIGNED,
      confirmationButton: { label: 'شاهد كيف يعمل ربائد', link: 'https://rabaedapp.com/product' },
    } as typeof original);

    // The preview draws what was saved, with an example name.
    const preview = await editor.get(PREVIEW);
    expect(preview.ok()).toBe(true);
    expect(preview.headers()['content-security-policy']).toContain("default-src 'none'");
    const previewed = await preview.text();
    expect(previewed).toContain('أهلاً بك في ربائد</h2>');
    expect(previewed).toContain('مرحباً سارة القحطاني،</p>');

    const applicant = uniqueApplicant('confirmation-email');
    await postDemoRequest(request, baseURL!, { email: applicant.email, ip: `10.28.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` });
    await expect.poll(() => mailTo(applicant.email)).toHaveLength(1);
    const [confirmation] = await mailTo(applicant.email);

    const html = confirmation.html ?? '';
    const bannerAt = html.match(new RegExp(`<img src="([^"]+)" alt="${BANNER_ALT}" width="598"`))?.[1];
    expect(bannerAt, 'the banner heads the email').toBeDefined();
    // At the size made for email, under a name none of the site's other images can have.
    expect(bannerAt).toMatch(/\/api\/email-images\/file\/email-banner-[^/]+-1200x400\.jpg$/);
    // Reachable by a mail client, which is signed in to nothing.
    const visitor = await newRequest.newContext();
    const fetched = await visitor.get(bannerAt!);
    expect(fetched.status()).toBe(200);
    expect(fetched.headers()['content-type']).toContain('image/jpeg');
    await visitor.dispose();

    expect(html).toContain('أهلاً بك في ربائد</h2>');
    expect(html).toContain('<strong>خلال يوم عمل</strong>');
    expect(html).toMatch(/<a href="https:\/\/rabaedapp\.com\/product" style="[^"]*">شاهد كيف يعمل ربائد<\/a>/);
    expect(confirmation.text).toBe(
      'أهلاً بك في ربائد\n\nمرحباً سارة القحطاني،\n\nسنتواصل معك خلال يوم عمل.\n\nشاهد كيف يعمل ربائد: https://rabaedapp.com/product',
    );
  } finally {
    await publishDemoSettings(request, original);
    await editor.post('/api/globals/confirmation-email', { data: { banner: null } });
    await editor.delete(`/api/email-images/${banner.id}`);
  }
});
