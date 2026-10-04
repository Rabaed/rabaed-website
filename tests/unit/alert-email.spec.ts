/**
 * The team's alert email (`src/forms/alert-email.ts`): the same answers as
 * plain text and as an HTML email whose layout survives Outlook, which drops
 * the CSS a plain block of text relies on for its line breaks — the first
 * real alert arrived as one long line.
 *
 * A pure function of a form, its answers and the record's address, so asked
 * directly. That a submission's alert goes out with it is held in
 * `tests/e2e/form-submission.spec.ts`.
 */
import { test, expect } from '@playwright/test';
import { alertMail } from '../../src/forms/alert-email';
import { DEMO_REQUEST } from '../../src/forms/demo-request';

const RECORD = 'https://rabaedapp.com/maktab/collections/form-submissions/6';
// 00:26 on 5 October 2026 in Riyadh.
const SENT_AT = new Date('2026-10-04T21:26:00Z');
const ANSWERS = {
  name: 'سارة القحطاني',
  email: 'sara@example.com',
  role: 'owner',
  phone: '+966500000000',
  company: '',
  activeProjects: '3',
};

/** Every table cell in the HTML that holds no other cell, as the text a reader sees in it. */
function cells(html: string): string[] {
  return [...html.matchAll(/<td\b[^>]*>((?:(?!<td\b)[\s\S])*?)<\/td>/g)].map(([, inner]) =>
    inner
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .trim(),
  );
}

test('each answer sits in its own row, beside the words the Arabic form gives it', () => {
  const { html } = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, ANSWERS, 'ar', RECORD, SENT_AT);

  const read = cells(html);
  for (const [label, answer] of [
    ['الاسم الكامل', 'سارة القحطاني'],
    ['البريد الإلكتروني', 'sara@example.com'],
    ['دورك في المشروع', 'مالك / مطوّر'],
    ['رقم الجوال', '+966500000000'],
    ['اسم الشركة', '—'],
    ['عدد المشاريع النشطة', '3'],
  ]) {
    const at = read.indexOf(label);
    expect(at, label).toBeGreaterThanOrEqual(0);
    expect(read[at + 1], label).toBe(answer);
  }
  expect(html).toMatch(/^<!doctype html><html lang="ar" dir="rtl">/);
  expect(html).toContain(`href="${RECORD}"`);
});

test('an answer written left to right stays in its order inside the Arabic layout; an Arabic one is left alone', () => {
  const { html } = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, ANSWERS, 'ar', RECORD, SENT_AT);

  // Laid out right to left, «+966500000000» reads «966500000000+».
  expect(html).toContain('<span dir="ltr">+966500000000</span>');
  expect(html).toContain('<span dir="ltr">sara@example.com</span>');
  expect(html).not.toContain('<span dir="ltr">سارة القحطاني</span>');
});

test('what a visitor typed is shown as text, never as markup', () => {
  const { html } = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, { ...ANSWERS, company: '<a href="https://x.example">اضغط</a>' }, 'ar', RECORD, SENT_AT);

  expect(html).not.toContain('<a href="https://x.example">');
  expect(cells(html)).toContain('<a href="https://x.example">اضغط</a>');
});

test('a form filled in English says so, so the reply goes back in English', () => {
  const english = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, ANSWERS, 'en', RECORD, SENT_AT);
  const arabic = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, ANSWERS, 'ar', RECORD, SENT_AT);

  expect(english.html).toContain('مُلئ النموذج بالإنجليزية، فالرد على مقدّمه بها.');
  expect(english.text).toContain('مُلئ النموذج بالإنجليزية، فالرد على مقدّمه بها.');
  expect(arabic.html).not.toContain('مُلئ النموذج');
});

test('the plain text keeps one answer to a line, the time in Riyadh and the way to the record', () => {
  const { text } = alertMail(DEMO_REQUEST, DEMO_REQUEST.wording.ar, ANSWERS, 'ar', RECORD, SENT_AT);

  expect(text.split('\n')).toEqual(
    expect.arrayContaining([
      'وصل طلب جديد من نموذج «طلب عرض حي».',
      'الاسم الكامل: سارة القحطاني',
      'رقم الجوال: +966500000000',
      'اسم الشركة: —',
      `الطلب في لوحة التحرير: ${RECORD}`,
      'للرد على مقدّم الطلب، أجب على هذه الرسالة.',
    ]),
  );
  expect(text).toMatch(/وقت الإرسال: 5 أكتوبر 2026 .* بتوقيت الرياض/);
});
