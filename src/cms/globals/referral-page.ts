import type { Field } from 'payload';
import { listField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';
import { MARKETING_PAGES } from '../../lib/page-registry';

/**
 * The referral page's words, section by section, in the page's order (ticket
 * 56), built like the tool page's (`tool-page.ts`).
 *
 * Every word may name a Referral Program value in braces — `{payout}`,
 * `{clientDiscount}` — which the page inserts rather than an amount typed
 * (`referral-program-values.ts`), and a name the site does not hold is
 * refused. The lengths are what each place in the design carries, about twice
 * the Reference site's words, counting a value by its name. Where each button
 * and link leads stays in code, and so does each step's and point's number,
 * which is its place.
 */

const QUOTING_VALUES: Words = {
  ar: 'لذكر مبلغ الإحالة اكتب {payout}، ولخصم العميل {clientDiscount}: تُدرج الصفحة القيمة المعتمدة في «قيم برنامج الإحالة».',
  en: 'Write {payout} for the referral payout and {clientDiscount} for the client discount: the page inserts the value set under Referral Program values.',
};

/** Words on this page, any of which may name a value. */
function wordsWithValues(
  name: string,
  label: Words,
  maxLength: number,
  options: { readonly multiline?: boolean; readonly description?: Words; readonly optional?: boolean } = {},
): Field {
  return wordsField(name, label, maxLength, { ...options, values: true });
}

const eyebrow = () => wordsWithValues('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40);
const heading = (maxLength: number) => wordsWithValues('heading', { ar: 'العنوان', en: 'Heading' }, maxLength);
const lead = (maxLength = 200) =>
  wordsWithValues('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, maxLength, { multiline: true });
const linkLabel = (leadsTo: Words) => wordsWithValues('linkLabel', { ar: 'نص الرابط', en: 'Link text' }, 40, { description: leadsTo });

/** A sentence with an optional bold phrase in it, and the rest of the sentence after that. */
function sentenceFields(lengths: { readonly text: number; readonly bold: number; readonly after: number }): Field[] {
  return [
    wordsWithValues('text', { ar: 'النص', en: 'Text' }, lengths.text, { multiline: true }),
    wordsWithValues('bold', { ar: 'ثم بخط عريض', en: 'Then in bold' }, lengths.bold, {
      optional: true,
      description: { ar: 'اختياري. تفصله عما قبله وما بعده مسافة.', en: 'Optional. A space sets it apart from the words either side.' },
    }),
    wordsWithValues('after', { ar: 'ثم بقية الجملة', en: 'Then the rest of it' }, lengths.after, { multiline: true, optional: true }),
  ];
}

const NUMBERED: Words = {
  ar: 'تُرقَّم حسب ترتيبها. اسحبها لإعادة ترتيبها.',
  en: 'Numbered by their order. Drag them to reorder.',
};

export const ReferralPage = pageGlobal({
  slug: MARKETING_PAGES.referral.entry.slug,
  label: MARKETING_PAGES.referral.entry.label,
  path: MARKETING_PAGES.referral.path,
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وأزرارها وأرقام البرنامج تحتها. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading, its buttons, and the programme’s figures under them. Always shows: it holds the page’s only heading.',
      },
      fields: [
        eyebrow(),
        wordsWithValues('title', { ar: 'العنوان', en: 'Heading' }, 90, { description: QUOTING_VALUES }),
        lead(320),
        {
          type: 'row',
          fields: [
            wordsWithValues('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى قسم التسجيل.', en: 'Leads to the signup section.' },
            }),
            wordsWithValues('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى «كيف يعمل».', en: 'Leads to How it works.' },
            }),
          ],
        },
        listField({
          name: 'figures',
          labels: { singular: { ar: 'رقم', en: 'Figure' }, plural: { ar: 'الأرقام تحت الأزرار', en: 'Figures under the buttons' } },
          rows: { min: 1, max: 4 },
          description: QUOTING_VALUES,
          fields: [
            {
              type: 'row',
              fields: [
                wordsWithValues('figure', { ar: 'الرقم', en: 'Figure' }, 24, {
                  description: { ar: 'تُكتب أرقامه بخط الأرقام.', en: 'Its numerals are set in the figures’ typeface.' },
                }),
                wordsWithValues('label', { ar: 'الكلمات تحته', en: 'Words under it' }, 24),
              ],
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'howItWorks',
      label: { ar: 'كيف يعمل', en: 'How it works' },
      hideable: false,
      description: {
        ar: 'الخطوات من التسجيل إلى استلام المبلغ. يظهر دائماً: الزر الثاني أعلى الصفحة ينقل إليه.',
        en: 'The steps from signing up to being paid. Always shows: the hero’s second button lands here.',
      },
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'steps',
          labels: { singular: { ar: 'خطوة', en: 'Step' }, plural: { ar: 'الخطوات', en: 'Steps' } },
          rows: { min: 1, max: 8 },
          description: NUMBERED,
          fields: [
            wordsWithValues('label', { ar: 'الكلمات بعد الرقم', en: 'Words after the number' }, 25),
            wordsWithValues('title', { ar: 'العنوان', en: 'Title' }, 40),
            wordsWithValues('text', { ar: 'النص', en: 'Text' }, 220, { multiline: true }),
            {
              name: 'markedOut',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'مميّزة بإطار', en: 'Marked out' },
              admin: {
                description: {
                  ar: 'الخطوة التي يُراد أن تُتذكَّر، مثل استلام المبلغ.',
                  en: 'The step the section wants remembered, like being paid.',
                },
              },
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'offer',
      label: { ar: 'المبلغ والخصم', en: 'Offer' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'paragraphs',
          labels: { singular: { ar: 'فقرة', en: 'Paragraph' }, plural: { ar: 'الفقرات', en: 'Paragraphs' } },
          rows: { min: 1, max: 4 },
          fields: sentenceFields({ text: 300, bold: 80, after: 400 }),
        }),
        listField({
          name: 'sides',
          labels: { singular: { ar: 'بطاقة', en: 'Card' }, plural: { ar: 'البطاقات', en: 'Cards' } },
          rows: { min: 1, max: 4 },
          description: {
            ar: 'بطاقتان في كل صف؛ الأخيرة من عدد فردي تأخذ الصف كله.',
            en: 'Two cards to a row; the last of an odd number takes the whole row.',
          },
          fields: [
            wordsWithValues('badge', { ar: 'الشارة في الزاوية', en: 'Badge in the corner' }, 12),
            wordsWithValues('title', { ar: 'العنوان', en: 'Title' }, 40),
            wordsWithValues('text', { ar: 'النص', en: 'Text' }, 120, { multiline: true }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'audience',
      label: { ar: 'لمن هذا البرنامج', en: 'Audience' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(120),
        lead(),
        listField({
          name: 'kinds',
          labels: { singular: { ar: 'فئة', en: 'Kind' }, plural: { ar: 'الفئات', en: 'Kinds of people' } },
          rows: { min: 1, max: 9 },
          description: NUMBERED,
          fields: [
            wordsWithValues('title', { ar: 'العنوان', en: 'Title' }, 45),
            wordsWithValues('text', { ar: 'النص', en: 'Text' }, 120, { multiline: true }),
          ],
        }),
        {
          name: 'partnership',
          type: 'group',
          label: { ar: 'الإشارة إلى برنامج الشراكات', en: 'Note on the Partnership Program' },
          fields: [
            ...sentenceFields({ text: 60, bold: 60, after: 200 }),
            linkLabel({ ar: 'ينقل إلى صفحة برنامج الشراكات.', en: 'Leads to the Partnership Program page.' }),
          ],
        },
      ],
    }),
    sectionTab({
      name: 'whatIsReferred',
      label: { ar: 'ما الذي تُحيله', en: 'What is referred' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(60),
        listField({
          name: 'paragraphs',
          // The name Payload makes of the names above it is too long for Postgres.
          dbName: 'referral_page_what_paragraphs',
          labels: { singular: { ar: 'فقرة', en: 'Paragraph' }, plural: { ar: 'الفقرات', en: 'Paragraphs' } },
          rows: { min: 1, max: 4 },
          fields: [wordsWithValues('text', { ar: 'النص', en: 'Text' }, 600, { multiline: true })],
        }),
        linkLabel({ ar: 'ينقل إلى صفحة المنتج.', en: 'Leads to the product page.' }),
      ],
    }),
    sectionTab({
      name: 'termsSummary',
      label: { ar: 'الشروط باختصار', en: 'Terms in brief' },
      hideable: true,
      description: {
        ar: 'ملخص للشروط. النص الملزم في «المستندات النظامية»، ولا يتغير بتغيير هذا.',
        en: 'A summary of the terms. The binding text is under Legal documents, and does not change with this.',
      },
      fields: [
        eyebrow(),
        heading(60),
        listField({
          name: 'points',
          labels: { singular: { ar: 'نقطة', en: 'Point' }, plural: { ar: 'النقاط', en: 'Points' } },
          rows: { min: 1, max: 12 },
          description: NUMBERED,
          fields: [
            wordsWithValues('bold', { ar: 'البداية بخط عريض', en: 'Bold opening' }, 60),
            wordsWithValues('rest', { ar: 'بقية النقطة', en: 'The rest of the point' }, 160, {
              multiline: true,
              description: {
                ar: 'تفصلها عن البداية مسافة، إلا إذا بدأت بفاصلة أو نقطة أو نقطتين أو فاصلة منقوطة.',
                en: 'A space sets it after the opening, unless it begins with a comma, a full stop, a colon or a semicolon.',
              },
            }),
          ],
        }),
        linkLabel({ ar: 'ينقل إلى الشروط والأحكام الكاملة.', en: 'Leads to the full Referral Terms.' }),
      ],
    }),
    sectionTab({
      name: 'questions',
      label: { ar: 'الأسئلة', en: 'Questions' },
      hideable: true,
      description: {
        ar: 'عنوان الأسئلة. الأسئلة نفسها في «الأسئلة الشائعة».',
        en: 'The questions’ heading. The questions themselves are under FAQs.',
      },
      fields: [eyebrow(), heading(40)],
    }),
    sectionTab({
      name: 'signup',
      label: { ar: 'التسجيل', en: 'Signup' },
      hideable: false,
      description: {
        ar: 'ما يحصل عليه المسجّل، بجانب نموذج التسجيل. يظهر دائماً: الزر الأول أعلى الصفحة ينقل إليه. كلمات النموذج نفسه في إعداداته.',
        en: 'What signing up gets the referrer, beside the signup form. Always shows: the hero’s first button lands here. The form’s own words are in its settings.',
      },
      fields: [
        eyebrow(),
        heading(40),
        lead(),
        listField({
          name: 'benefits',
          labels: { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'ما يحصل عليه', en: 'What they get' } },
          rows: { min: 1, max: 8 },
          description: QUOTING_VALUES,
          fields: [wordsWithValues('text', { ar: 'السطر', en: 'Line' }, 90)],
        }),
        {
          name: 'guarantee',
          type: 'group',
          label: { ar: 'الإطار تحتها', en: 'Pill under them' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsWithValues('figure', { ar: 'المدة بخط عريض', en: 'Period, in bold' }, 20, {
                  description: { ar: 'تُكتب أرقامها بخط الأرقام.', en: 'Its numerals are set in the figures’ typeface.' },
                }),
                wordsWithValues('text', { ar: 'ما تقيسه', en: 'What it measures' }, 60),
              ],
            },
          ],
        },
      ],
    }),
    searchTab({ values: true }),
  ],
});
