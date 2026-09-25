import type { Field } from 'payload';
import { listField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';
import { MARKETING_PAGES } from '../../lib/page-registry';

/**
 * The partnership page's words, section by section, in the page's order
 * (ticket 55), built like the start page's (`start-page.ts`).
 *
 * The lengths are what each place in the design carries, about twice the
 * Reference site's words, and tighter in the hero's figure cards and the
 * application's reply pill, which are small. Where each link leads stays in
 * code — `#apply`, `#path`, the referral page — and so does each card's and
 * stage's number, which is its place.
 */

const eyebrow = () => wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40);
const heading = (maxLength: number) => wordsField('heading', { ar: 'العنوان', en: 'Heading' }, maxLength);
const lead = (maxLength = 240) =>
  wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, maxLength, { multiline: true });

/** A list whose rows are each one line of words. */
function linesField(name: string, labels: { singular: Words; plural: Words }, rows: { min: number; max: number }, maxLength: number): Field {
  return listField({ name, labels, rows, fields: [wordsField('text', labels.singular, maxLength)] });
}

const NUMBERED: Words = {
  ar: 'تُرقَّم حسب ترتيبها. اسحبها لإعادة ترتيبها.',
  en: 'Numbered by their order. Drag them to reorder.',
};

export const PartnershipPage = pageGlobal({
  slug: MARKETING_PAGES.partnership.entry.slug,
  label: MARKETING_PAGES.partnership.entry.label,
  path: MARKETING_PAGES.partnership.path,
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وأزرارها والأرقام تحتها. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading, its buttons and the figures under them. Always shows: it holds the page’s only heading.',
      },
      fields: [
        eyebrow(),
        wordsField('title', { ar: 'العنوان', en: 'Heading' }, 70),
        lead(),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى نموذج طلب الشراكة.', en: 'Leads to the application form.' },
            }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى «مسار الشراكة».', en: 'Leads to the path.' },
            }),
          ],
        },
        listField({
          name: 'figures',
          labels: { singular: { ar: 'رقم', en: 'Figure' }, plural: { ar: 'الأرقام تحت الأزرار', en: 'Figures under the buttons' } },
          rows: { min: 1, max: 4 },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('figure', { ar: 'الرقم', en: 'Figure' }, 14, {
                  description: {
                    ar: 'اكتب الأرقام بالأرقام الإنجليزية، مثل 3 أنماط، لتظهر بخط الأرقام.',
                    en: 'Write numerals as 0–9, like 3 أنماط, to set them in the figures’ typeface.',
                  },
                }),
                wordsField('label', { ar: 'ما يعدّه', en: 'What it counts' }, 40),
              ],
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'idea',
      label: { ar: 'الفكرة', en: 'Idea' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        linesField('paragraphs', { singular: { ar: 'فقرة', en: 'Paragraph' }, plural: { ar: 'الفقرات', en: 'Paragraphs' } }, { min: 1, max: 4 }, 420),
        {
          name: 'referralNote',
          type: 'group',
          label: { ar: 'السطر تحت الفقرات', en: 'Line under the paragraphs' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('text', { ar: 'النص', en: 'Text' }, 140),
                wordsField('linkLabel', { ar: 'الرابط بعده', en: 'Link after it' }, 40, {
                  description: { ar: 'ينقل إلى صفحة برنامج الإحالة.', en: 'Leads to the referral page.' },
                }),
              ],
            },
          ],
        },
      ],
    }),
    sectionTab({
      name: 'audience',
      label: { ar: 'لمن هذا البرنامج', en: 'Who it is for' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'kinds',
          labels: { singular: { ar: 'جهة', en: 'Kind of firm' }, plural: { ar: 'الجهات', en: 'Kinds of firm' } },
          rows: { min: 1, max: 8 },
          description: NUMBERED,
          fields: [
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 45),
            wordsField('text', { ar: 'النص', en: 'Text' }, 140, { multiline: true }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'modes',
      label: { ar: 'أنماط التعاون', en: 'Modes' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'modes',
          labels: { singular: { ar: 'نمط', en: 'Mode' }, plural: { ar: 'الأنماط', en: 'Modes' } },
          rows: { min: 1, max: 6 },
          description: NUMBERED,
          fields: [
            wordsField('label', { ar: 'الكلمات بعد الرقم', en: 'Words after the number' }, 25),
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 45),
            wordsField('text', { ar: 'النص', en: 'Text' }, 260, { multiline: true }),
            wordsField('fit', { ar: 'لمن يناسب', en: 'Who it suits' }, 140, { multiline: true }),
          ],
        }),
        {
          name: 'note',
          type: 'group',
          label: { ar: 'السطر تحت الأنماط', en: 'Line under the modes' },
          admin: {
            description: {
              ar: 'جملة، ثم كلمات بخط عريض، ثم بقية السطر.',
              en: 'A sentence, then words in bold, then the rest of the line.',
            },
          },
          fields: [
            wordsField('before', { ar: 'قبل الخط العريض', en: 'Before the bold' }, 260, { multiline: true }),
            {
              type: 'row',
              fields: [
                wordsField('bold', { ar: 'بخط عريض', en: 'In bold' }, 60),
                wordsField('after', { ar: 'بعد الخط العريض', en: 'After the bold' }, 160),
              ],
            },
          ],
        },
      ],
    }),
    sectionTab({
      name: 'benefits',
      label: { ar: 'ما يحصل عليه الشريك', en: 'Benefits' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'benefits',
          labels: { singular: { ar: 'التزام', en: 'Commitment' }, plural: { ar: 'الالتزامات', en: 'Commitments' } },
          rows: { min: 1, max: 12 },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('bold', { ar: 'البداية بخط عريض', en: 'Bold opening' }, 40),
                wordsField('text', { ar: 'بقية السطر', en: 'The rest of the line' }, 100),
              ],
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'path',
      label: { ar: 'مسار الشراكة', en: 'Path' },
      hideable: false,
      description: {
        ar: 'المراحل من أول اجتماع إلى أول مشروع. يظهر دائماً: الزر الثاني أعلى الصفحة ينقل إليه.',
        en: 'The stages from a first meeting to a first project. Always shows: the hero’s second button lands here.',
      },
      fields: [
        eyebrow(),
        heading(60),
        lead(),
        wordsField('linkLabel', { ar: 'الرابط تحت الفقرة', en: 'Link under the paragraph' }, 30, {
          description: { ar: 'ينقل إلى نموذج طلب الشراكة.', en: 'Leads to the application form.' },
        }),
        wordsField('stageLabel', { ar: 'الكلمة قبل رقم كل مرحلة', en: 'Word before each stage’s number' }, 12),
        listField({
          name: 'stages',
          labels: { singular: { ar: 'مرحلة', en: 'Stage' }, plural: { ar: 'المراحل', en: 'Stages' } },
          rows: { min: 1, max: 8 },
          description: NUMBERED,
          fields: [
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 40),
            wordsField('text', { ar: 'النص', en: 'Text' }, 220, { multiline: true }),
          ],
        }),
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
      name: 'apply',
      label: { ar: 'طلب الشراكة', en: 'Application' },
      hideable: false,
      description: {
        ar: 'ما يلتزم به المكتب حين يطلب، بجانب نموذج الطلب. يظهر دائماً: الزر الأول أعلى الصفحة ورابط «مسار الشراكة» ينقلان إليه.',
        en: 'What applying commits an office to, beside the application form. Always shows: the hero’s first button and the path’s link land here.',
      },
      fields: [
        eyebrow(),
        heading(90),
        lead(200),
        linesField('reassurances', { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'ما يطمئن المكتب', en: 'Reassurances' } }, { min: 1, max: 6 }, 90),
        {
          name: 'responseTime',
          type: 'group',
          label: { ar: 'مدة الرد', en: 'Response time' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('bold', { ar: 'المدة بخط عريض', en: 'The time, in bold' }, 20),
                wordsField('text', { ar: 'ما تقيسه', en: 'What it measures' }, 40),
              ],
            },
          ],
        },
      ],
    }),
    searchTab(),
  ],
});
