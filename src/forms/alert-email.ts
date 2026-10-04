/**
 * The team's alert, in Arabic: every answer under the words the Arabic form
 * gives it, and the way to the record — and, for a form filled in another
 * language, which one, so the reply goes back in it. Documents are named,
 * never attached: they are opened from the record, by a signed-in editor.
 *
 * Written twice, as plain text and as HTML in the site's email frame
 * (`./email-frame.ts`).
 */
import type { Locale } from '../lib/locales';
import { CONSENT_GIVEN, fieldNames, type Answers, type FormDefinition, type FormWording } from './definition';
import { button, COLOUR, emailDocument, escaped, FONT, footerBand, headerBand } from './email-frame';

/** How the alert names the language a form was filled in, where it was not the team's own. */
const FILLED_IN: Readonly<Record<Locale, string | null>> = { ar: null, en: 'بالإنجليزية' };

/** A letter of any right-to-left script the forms are filled in. */
const RIGHT_TO_LEFT = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

export function alertMail<Field extends string>(
  definition: FormDefinition<Field>,
  team: FormWording<Field>,
  answers: Answers<Field>,
  locale: Locale,
  recordUrl: string,
  sentAt: Date,
): { text: string; html: string } {
  const rows = fieldNames(definition).map((name) => {
    const wording = team.fields[name];
    const answer = answers[name];
    if (definition.fields[name].kind === 'consent') return { label: wording.label, answer: answer === CONSENT_GIVEN ? 'موافق' : '—' };
    return { label: wording.label, answer: wording.options?.[answer] ?? (answer || '—') };
  });
  const time = `${new Intl.DateTimeFormat('ar-u-nu-latn', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(sentAt)} بتوقيت الرياض`;
  const language = FILLED_IN[locale];
  const languageNote = language ? `مُلئ النموذج ${language}، فالرد على مقدّمه بها.` : null;
  const reply = 'للرد على مقدّم الطلب، أجب على هذه الرسالة.';

  const text = [
    `وصل طلب جديد من نموذج «${definition.title.ar}».`,
    ...(languageNote ? [languageNote] : []),
    '',
    ...rows.map(({ label, answer }) => `${label}: ${answer}`),
    '',
    `وقت الإرسال: ${time}`,
    `الطلب في لوحة التحرير: ${recordUrl}`,
    '',
    reply,
  ].join('\n');

  const answerRows = rows
    .map(
      ({ label, answer }) =>
        `<tr><td width="38%" valign="top" style="padding:12px 0 12px 16px;border-bottom:1px solid ${COLOUR.line};font-family:${FONT};font-size:14px;color:${COLOUR.muted};text-align:right">${escaped(label)}</td>` +
        `<td valign="top" style="padding:12px 0;border-bottom:1px solid ${COLOUR.line};font-family:${FONT};font-size:15px;font-weight:bold;color:${COLOUR.ink};text-align:right;word-break:break-word">${inItsDirection(answer)}</td></tr>`,
    )
    .join('');

  const html = emailDocument(
    'ar',
    definition.title.ar,
    headerBand('وصل طلب جديد', definition.title.ar, 'right') +
      (languageNote
        ? `<tr><td style="padding:14px 24px;background:#FFF1EC;border-bottom:1px solid ${COLOUR.line};font-family:${FONT};font-size:14px;color:${COLOUR.ink};text-align:right">${escaped(languageNote)}</td></tr>`
        : '') +
      `<tr><td style="padding:8px 24px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="border-collapse:collapse">${answerRows}</table></td></tr>` +
      `<tr><td style="padding:16px 24px;font-family:${FONT};font-size:13px;color:${COLOUR.muted};text-align:right">وقت الإرسال: ${escaped(time)}</td></tr>` +
      `<tr><td style="padding:0 24px 24px;text-align:right">${button('فتح الطلب في لوحة التحرير', recordUrl)}</td></tr>` +
      footerBand(escaped(reply), 'right'),
  );

  return { text, html };
}

/**
 * An answer, escaped, its line breaks kept — and laid out left to right where
 * it has no right-to-left letter in it, since inside the Arabic layout
 * «+966500000000» otherwise reads «966500000000+».
 */
function inItsDirection(answer: string): string {
  const shown = escaped(answer).replace(/\r?\n/g, '<br>');
  return RIGHT_TO_LEFT.test(answer) ? shown : `<span dir="ltr">${shown}</span>`;
}
