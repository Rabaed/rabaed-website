import { listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * «كيف نبدأ معك», the section the home and product pages both end on, beside
 * the demo request form (ticket 57): one entry for both pages, so the two
 * cannot drift apart. The form's own words are its settings (ticket 27).
 *
 * It cannot be hidden: the demo request form in it (`#demo`) is where the
 * header's button and both pages' heroes land. The steps' labels sit on one
 * line beside their text, so they are short.
 */
export const ClosingSection = pageGlobal({
  slug: 'closing-section',
  label: { ar: 'قسم «كيف نبدأ معك»', en: 'Closing section' },
  path: '/product',
  sections: [
    sectionTab({
      name: 'closing',
      label: { ar: 'كيف نبدأ معك', en: 'How we start' },
      hideable: false,
      description: {
        ar: 'تنتهي به الصفحة الرئيسية وصفحة المنتج، بجانب نموذج طلب العرض: نص واحد للصفحتين. يظهر دائماً: أزرار «احجز عرضاً» تنقل إليه.',
        en: 'The home and product pages both end on it, beside the demo request form: one text for both. Always shows: the “book a demo” buttons land on it.',
      },
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30),
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 80),
        listField({
          name: 'steps',
          labels: {
            singular: { ar: 'خطوة', en: 'Step' },
            plural: { ar: 'الخطوات', en: 'Steps' },
          },
          rows: { min: 1, max: 5 },
          description: {
            ar: 'تُرقَّم الخطوات حسب ترتيبها. اسحبها لإعادة ترتيبها.',
            en: 'Steps are numbered by their order. Drag them to reorder.',
          },
          fields: [
            wordsField('label', { ar: 'الكلمة بعد الرقم', en: 'Word after the number' }, 10, {
              description: { ar: 'على سطر واحد بجانب النص.', en: 'On one line, beside the text.' },
            }),
            wordsField('text', { ar: 'النص', en: 'Text' }, 140, { multiline: true }),
          ],
        }),
        wordsField('moreLabel', { ar: 'الرابط تحت الخطوات', en: 'Link under the steps' }, 40, {
          description: { ar: 'ينقل إلى صفحة ابدأ.', en: 'Leads to the start page.' },
        }),
      ],
    }),
  ],
});
