/**
 * The applicant's confirmation email (`src/forms/confirmation-email.ts`):
 * Ahmed's rich text, the one banner every form shares and an optional button,
 * laid out as an HTML email Outlook draws faithfully, with plain text beside
 * it — and the applicant's name in the placeholder's place only when it reads
 * as a name (ADR-0022).
 *
 * A pure function of what the CMS stores, so asked directly. That a
 * submission's confirmation goes out with it, as the CMS has it, is held in
 * `tests/e2e/form-submission.spec.ts`.
 */
import { test, expect } from '@playwright/test';
import { confirmationMail, richTextFromPlainText, type RichText } from '../../src/forms/confirmation-email';
import { FORMS } from '../../src/forms/registry';
import { FORM_IDS } from '../../src/forms/definition';
import { LOCALE_CODES } from '../../src/lib/locales';

const ORIGIN = 'https://rabaedapp.com';

const text = (value: string, format = 0) => ({ type: 'text', text: value, format, detail: 0, mode: 'normal', style: '', version: 1 });
const paragraph = (...children: unknown[]) => ({ type: 'paragraph', children, format: '', indent: 0, version: 1 });
const message = (...children: unknown[]): RichText => ({ root: { type: 'root', children, format: '', indent: 0, version: 1 } }) as RichText;

const BANNER = {
  url: '/api/email-images/file/banner.jpg',
  alt: 'فريق ربائد في الموقع',
  width: 2400,
  height: 800,
  sizes: { email: { url: '/api/email-images/file/banner-1200x400.jpg', width: 1200, height: 400 } },
};

test('every form’s own confirmation text survives being made rich text, line for line', () => {
  // What each form has said until now is what it goes on saying: the stored
  // text is shown in the editor as rich text, and sent from it.
  for (const id of FORM_IDS) {
    for (const locale of LOCALE_CODES) {
      const body = FORMS[id].wording[locale].confirmationBody;
      const { text: sent } = confirmationMail(
        { message: richTextFromPlainText(body), banner: null, button: null },
        { locale, name: 'سارة', siteOrigin: ORIGIN },
      );
      expect(sent, `${id} ${locale}`).toBe(body.replace('{الاسم}', 'سارة').replace('{name}', 'سارة'));
    }
  }
});

test('the rich text is laid out in the email’s own language and direction, every style inline', () => {
  const { html } = confirmationMail(
    {
      message: message(
        paragraph(text('مرحباً {الاسم}،')),
        { type: 'heading', tag: 'h2', children: [text('ما الذي يحدث الآن')], format: '', indent: 0, version: 1 },
        paragraph(text('سطر أول'), { type: 'linebreak', version: 1 }, text('مهم', 1)),
        {
          type: 'list',
          listType: 'bullet',
          tag: 'ul',
          children: [{ type: 'listitem', value: 1, children: [text('عرض 30 دقيقة')], format: '', indent: 0, version: 1 }],
          format: '',
          indent: 0,
          version: 1,
        },
      ),
      banner: null,
      button: null,
    },
    { locale: 'ar', name: 'سارة القحطاني', siteOrigin: ORIGIN },
  );

  expect(html).toMatch(/^<!doctype html><html lang="ar" dir="rtl">/);
  expect(html).toMatch(/<p style="[^"]*text-align:right[^"]*">مرحباً سارة القحطاني،<\/p>/);
  expect(html).toMatch(/<h2 style="[^"]*">ما الذي يحدث الآن<\/h2>/);
  expect(html).toMatch(/سطر أول<br><strong>مهم<\/strong>/);
  expect(html).toMatch(/<ul style="[^"]*"><li style="[^"]*">عرض 30 دقيقة<\/li><\/ul>/);
  expect(html).not.toContain('class=');

  const english = confirmationMail(
    { message: message(paragraph(text('Hello {name},'))), banner: null, button: null },
    { locale: 'en', name: 'Sara', siteOrigin: ORIGIN },
  ).html;
  expect(english).toMatch(/^<!doctype html><html lang="en" dir="ltr">/);
  expect(english).toMatch(/<p style="[^"]*text-align:left[^"]*">Hello Sara,<\/p>/);
});

test('the shared banner heads the email at the width it was sized for email, from the site’s own address', () => {
  const withBanner = confirmationMail(
    { message: message(paragraph(text('نص'))), banner: BANNER, button: null },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  ).html;

  // Outlook sizes an image by its width attribute, and loads only an address it can reach.
  expect(withBanner).toMatch(
    /<img src="https:\/\/rabaedapp\.com\/api\/email-images\/file\/banner-1200x400\.jpg" alt="فريق ربائد في الموقع" width="598"[^>]*>/,
  );

  const without = confirmationMail(
    { message: message(paragraph(text('نص'))), banner: null, button: null },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  ).html;
  expect(without).not.toContain('<img');
  // Without one, the company's name heads it.
  expect(without).toMatch(/>ربائد<\/div>/);
});

test('an image in the text is shown no wider than the column, and one with no file is left out', () => {
  const { html } = confirmationMail(
    {
      message: message(
        { type: 'upload', relationTo: 'email-images', value: { url: '/api/email-images/file/plan.png', alt: 'المخطط', width: 300, height: 200 }, version: 3 },
        { type: 'upload', relationTo: 'email-images', value: 42, version: 3 },
      ),
      banner: null,
      button: null,
    },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  );

  expect(html).toMatch(/<img src="https:\/\/rabaedapp\.com\/api\/email-images\/file\/plan\.png" alt="المخطط" width="300"/);
  expect(html.match(/<img /g)).toHaveLength(1);
});

test('links keep their address; one that is not a web, mail or phone address is shown as words alone', () => {
  const link = (url: string, words: string) => ({ type: 'link', fields: { url, newTab: false, linkType: 'custom' }, children: [text(words)], version: 3 });
  const { html, text: plain } = confirmationMail(
    {
      message: message(paragraph(link('https://rabaedapp.com/product', 'صفحة المنتج'), text(' و'), link('javascript:alert(1)', 'هذا'))),
      banner: null,
      button: null,
    },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  );

  expect(html).toMatch(/<a href="https:\/\/rabaedapp\.com\/product" style="[^"]*">صفحة المنتج<\/a>/);
  expect(html).not.toContain('javascript:');
  expect(plain).toBe('صفحة المنتج (https://rabaedapp.com/product) وهذا');
});

test('the button goes under the text, and into the plain text as its words and address', () => {
  const { html, text: plain } = confirmationMail(
    { message: message(paragraph(text('نص'))), banner: null, button: { label: 'شاهد كيف يعمل ربائد', link: 'https://rabaedapp.com/product' } },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  );

  expect(html).toMatch(/<a href="https:\/\/rabaedapp\.com\/product" style="[^"]*">شاهد كيف يعمل ربائد<\/a>/);
  expect(plain).toBe('نص\n\nشاهد كيف يعمل ربائد: https://rabaedapp.com/product');

  // A button with nowhere safe to go is no button.
  const unsafe = confirmationMail(
    { message: message(paragraph(text('نص'))), banner: null, button: { label: 'اضغط', link: 'javascript:alert(1)' } },
    { locale: 'ar', name: 'سارة', siteOrigin: ORIGIN },
  );
  expect(unsafe.html).not.toContain('اضغط');
});

test('a name that does not read as one is left out of the greeting, in both the HTML and the text', () => {
  const { html, text: plain } = confirmationMail(
    { message: message(paragraph(text('مرحباً {الاسم}،'))), banner: null, button: null },
    { locale: 'ar', name: 'اربح الآن www.spam.example', siteOrigin: ORIGIN },
  );

  expect(plain).toBe('مرحباً،');
  expect(html).toContain('>مرحباً،</p>');
  expect(html).not.toContain('spam');
});
