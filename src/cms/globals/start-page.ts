import { listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The start page's words, section by section, in the page's order (ticket 53):
 * the page every other marketing page's entry is built like.
 *
 * The lengths are what each place in the design carries, about twice the
 * Reference site's words: a button label on one line, a card's text in a few.
 * Where each link lands stays in code — `#demo`, `#faq`, the tool page — so an
 * Editor changes what a button says, never where it goes.
 */
export const StartPage = pageGlobal({
  slug: 'start-page',
  label: { ar: 'صفحة ابدأ', en: 'Start page' },
  path: '/start',
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وأزرارها. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading and buttons. Always shows: it holds the page’s only heading.',
      },
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30),
        wordsField('title', { ar: 'العنوان', en: 'Heading' }, 70),
        wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 200, { multiline: true }),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى نموذج طلب العرض.', en: 'Leads to the demo request form.' },
            }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى الأسئلة الشائعة.', en: 'Leads to the questions.' },
            }),
          ],
        },
      ],
    }),
    sectionTab({
      name: 'trustStrip',
      label: { ar: 'شريط الثقة', en: 'Trust strip' },
      hideable: true,
      description: {
        ar: 'شعارات الجهات التي تعمل على ربائد. هنا يُختار ظهوره في هذه الصفحة فقط.',
        en: 'The marks of the companies working on Rabaed. Here you choose only whether it shows on this page.',
      },
      fields: [],
    }),
    sectionTab({
      name: 'steps',
      label: { ar: 'خطوات البدء', en: 'Steps' },
      hideable: true,
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30),
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 100),
        listField({
          name: 'steps',
          labels: {
            singular: { ar: 'خطوة', en: 'Step' },
            plural: { ar: 'الخطوات', en: 'Steps' },
          },
          rows: { min: 1, max: 6 },
          description: {
            ar: 'تُرقَّم الخطوات حسب ترتيبها. اسحبها لإعادة ترتيبها.',
            en: 'Steps are numbered by their order. Drag them to reorder.',
          },
          fields: [
            wordsField('label', { ar: 'الكلمة بعد الرقم', en: 'Word after the number' }, 15),
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 50),
            wordsField('text', { ar: 'النص', en: 'Text' }, 160, { multiline: true }),
            {
              name: 'markedOut',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'مميّزة بإطار', en: 'Marked out' },
              admin: {
                description: {
                  ar: 'الخطوة التي يُراد أن تُتذكَّر، مثل الضمان.',
                  en: 'The step the section wants remembered, like the guarantee.',
                },
              },
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'questions',
      label: { ar: 'الأسئلة', en: 'Questions' },
      hideable: false,
      description: {
        ar: 'عنوان الأسئلة ونموذج طلب العرض بجانبها. يظهر دائماً: رابط «كل الأسئلة» والزر الثاني ينقلان إليه. الأسئلة نفسها في «الأسئلة الشائعة».',
        en: 'The questions’ heading, beside the demo request form. Always shows: «كل الأسئلة» and the second button land here. The questions themselves are under FAQs.',
      },
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30),
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 40),
      ],
    }),
    sectionTab({
      name: 'freeTool',
      label: { ar: 'الأداة المجانية', en: 'Free tool' },
      hideable: true,
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30),
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 60),
        wordsField('text', { ar: 'النص', en: 'Text' }, 150, { multiline: true }),
        wordsField('linkLabel', { ar: 'الزر', en: 'Button' }, 30, {
          description: { ar: 'ينقل إلى صفحة الأداة.', en: 'Leads to the tool page.' },
        }),
      ],
    }),
  ],
});
