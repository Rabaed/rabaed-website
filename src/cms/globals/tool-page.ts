import type { Field } from 'payload';
import { latinField, listField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';

/**
 * The tool page's words, section by section, in the page's order (ticket 54),
 * built like the start page's (`start-page.ts`).
 *
 * The lengths are what each place in the design carries, about twice the
 * Reference site's words, and tighter inside the drawing of the tool, whose
 * tiles and pills are small. Where each button leads stays in code — `#get`,
 * `#how`, the start and product pages — and so does each card's number, which
 * is its place.
 */

const eyebrow = () => wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40);
const heading = (maxLength: number) => wordsField('heading', { ar: 'العنوان', en: 'Heading' }, maxLength);
const lead = (maxLength = 200) =>
  wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, maxLength, { multiline: true });

/** A list whose rows are each one line of words. */
function linesField(name: string, labels: { singular: Words; plural: Words }, rows: { min: number; max: number }, maxLength: number): Field {
  return listField({ name, labels, rows, fields: [wordsField('text', labels.singular, maxLength)] });
}

const NUMBERED: Words = {
  ar: 'تُرقَّم البطاقات حسب ترتيبها. اسحبها لإعادة ترتيبها.',
  en: 'Cards are numbered by their order. Drag them to reorder.',
};

/** A card's title and text, numbered by its place. */
const cardFields = (textLength: number): Field[] => [
  wordsField('title', { ar: 'العنوان', en: 'Title' }, 45),
  wordsField('text', { ar: 'النص', en: 'Text' }, textLength, { multiline: true }),
];

/** Where a test stands, in the order the legend lists them, with the colour each is drawn in. */
const TEST_STATES: { value: 'idle' | 'warn' | 'bad' | 'info' | 'ok'; label: Words }[] = [
  { value: 'idle', label: { ar: 'رمادي: لم يحن بعد', en: 'Grey: not due yet' } },
  { value: 'warn', label: { ar: 'ذهبي: قريب', en: 'Gold: due soon' } },
  { value: 'bad', label: { ar: 'أحمر: متأخر', en: 'Red: late' } },
  { value: 'info', label: { ar: 'أزرق: عند الاستشاري', en: 'Blue: with the consultant' } },
  { value: 'ok', label: { ar: 'أخضر: معتمد', en: 'Green: approved' } },
];

export const ToolPage = pageGlobal({
  slug: 'tool-page',
  label: { ar: 'صفحة الأداة المجانية', en: 'Tool page' },
  path: '/tool',
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وأزرارها ورسم الأداة بجانبها. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading, its buttons, and the drawing of the tool beside them. Always shows: it holds the page’s only heading.',
      },
      fields: [
        eyebrow(),
        wordsField('title', { ar: 'العنوان، حتى كلماته الأخيرة', en: 'Heading, up to its last words' }, 90),
        wordsField('titleAccent', { ar: 'كلمات العنوان الأخيرة', en: 'The heading’s last words' }, 30, {
          description: { ar: 'تظهر بلون مميّز بعد العنوان.', en: 'Shown in the accent colour after the heading.' },
        }),
        lead(320),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى قسم التحميل.', en: 'Leads to the download section.' },
            }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى «كيف تعمل».', en: 'Leads to How it works.' },
            }),
          ],
        },
        linesField('promises', { singular: { ar: 'وعد', en: 'Promise' }, plural: { ar: 'الوعود تحت الأزرار', en: 'Promises under the buttons' } }, { min: 1, max: 6 }, 30),
        {
          name: 'mock',
          type: 'group',
          label: { ar: 'رسم الأداة', en: 'Drawing of the tool' },
          admin: {
            description: {
              ar: 'رسم شاشة الأداة بجانب العنوان. عدد صفوفه ثابت: ثلاثة أرقام، وصبّتان في كل منهما اختباران.',
              en: 'The drawing of the tool’s screen beside the heading. Its rows are fixed: three counts, and two pours of two tests each.',
            },
          },
          fields: [
            wordsField('project', { ar: 'اسم المشروع', en: 'Project name' }, 40),
            listField({
              name: 'tiles',
              labels: { singular: { ar: 'رقم', en: 'Count' }, plural: { ar: 'الأرقام', en: 'Counts' } },
              rows: { min: 3, max: 3 },
              fields: [
                {
                  type: 'row',
                  fields: [
                    latinField('figure', { ar: 'الرقم', en: 'Figure' }, 4),
                    {
                      name: 'tone',
                      type: 'select',
                      required: true,
                      defaultValue: 'plain',
                      label: { ar: 'لون الرقم', en: 'Figure colour' },
                      options: [
                        { value: 'plain', label: { ar: 'عادي', en: 'Plain' } },
                        { value: 'warn', label: { ar: 'ذهبي: اختبارات قريبة', en: 'Gold: tests due soon' } },
                        { value: 'bad', label: { ar: 'أحمر: اختبارات متأخرة', en: 'Red: tests late' } },
                      ],
                    },
                  ],
                },
                wordsField('label', { ar: 'الكلمات تحت الرقم', en: 'Words under the figure' }, 16),
              ],
            }),
            listField({
              name: 'pours',
              labels: { singular: { ar: 'صبّة', en: 'Pour' }, plural: { ar: 'الصبّات', en: 'Pours' } },
              rows: { min: 2, max: 2 },
              fields: [
                latinField('reference', { ar: 'رقم الصبّة', en: 'Pour reference' }, 12),
                wordsField('name', { ar: 'وصف الصبّة', en: 'Pour description' }, 60),
                listField({
                  name: 'tests',
                  labels: { singular: { ar: 'اختبار', en: 'Test' }, plural: { ar: 'الاختبارات', en: 'Tests' } },
                  rows: { min: 2, max: 2 },
                  fields: [
                    wordsField('label', { ar: 'الاختبار', en: 'Test' }, 20),
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'tone',
                          type: 'select',
                          required: true,
                          defaultValue: 'idle',
                          label: { ar: 'لون الحالة', en: 'State colour' },
                          options: TEST_STATES,
                        },
                      ],
                    },
                    wordsField('state', { ar: 'الحالة', en: 'State' }, 20),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    }),
    sectionTab({
      name: 'why',
      label: { ar: 'لماذا الأداة', en: 'Why' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        lead(),
        listField({
          name: 'cards',
          labels: { singular: { ar: 'سبب', en: 'Reason' }, plural: { ar: 'الأسباب', en: 'Reasons' } },
          rows: { min: 1, max: 6 },
          description: NUMBERED,
          fields: cardFields(260),
        }),
      ],
    }),
    sectionTab({
      name: 'features',
      label: { ar: 'ما الذي تفعله', en: 'Features' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        lead(),
        {
          name: 'countdown',
          type: 'group',
          label: { ar: 'البطاقة الأولى: العدّ التنازلي', en: 'First card: the countdown' },
          admin: {
            description: {
              ar: 'تحمل تحت نصها دليل ألوان حالة الاختبار.',
              en: 'It carries the legend of a test’s state colours under its text.',
            },
          },
          fields: [
            ...cardFields(320),
            {
              name: 'legend',
              type: 'group',
              label: { ar: 'دليل الألوان', en: 'Colour legend' },
              fields: TEST_STATES.map((state) => wordsField(state.value, state.label, 20)),
            },
          ],
        },
        listField({
          name: 'cards',
          labels: { singular: { ar: 'بطاقة', en: 'Card' }, plural: { ar: 'البطاقات بعدها', en: 'Cards after it' } },
          rows: { min: 1, max: 8 },
          description: NUMBERED,
          fields: cardFields(320),
        }),
        linesField('also', { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'أشياء أخرى تحت البطاقات', en: 'More it does, under the cards' } }, { min: 1, max: 8 }, 100),
      ],
    }),
    sectionTab({
      name: 'how',
      label: { ar: 'كيف تعمل', en: 'How it works' },
      hideable: false,
      description: {
        ar: 'الخطوات من التحميل إلى أول صبّة. يظهر دائماً: الزر الثاني أعلى الصفحة ينقل إليه.',
        en: 'The steps from the download to a first pour. Always shows: the hero’s second button lands here.',
      },
      fields: [
        eyebrow(),
        heading(90),
        lead(),
        listField({
          name: 'steps',
          labels: { singular: { ar: 'خطوة', en: 'Step' }, plural: { ar: 'الخطوات', en: 'Steps' } },
          rows: { min: 1, max: 6 },
          description: {
            ar: 'تُرقَّم الخطوات حسب ترتيبها. اسحبها لإعادة ترتيبها.',
            en: 'Steps are numbered by their order. Drag them to reorder.',
          },
          fields: [
            wordsField('label', { ar: 'الكلمات بعد الرقم', en: 'Words after the number' }, 25),
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 40),
            wordsField('text', { ar: 'النص', en: 'Text' }, 220, { multiline: true }),
            {
              name: 'markedOut',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'مميّزة بإطار', en: 'Marked out' },
              admin: {
                description: {
                  ar: 'الخطوة التي يُراد أن تُتذكَّر، مثل اختيار المجلد.',
                  en: 'The step the section wants remembered, like choosing the folder.',
                },
              },
            },
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'privacy',
      label: { ar: 'الخصوصية', en: 'Privacy' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'points',
          labels: { singular: { ar: 'نقطة', en: 'Point' }, plural: { ar: 'النقاط', en: 'Points' } },
          rows: { min: 1, max: 6 },
          fields: [
            wordsField('bold', { ar: 'البداية بخط عريض', en: 'Bold opening' }, 60),
            wordsField('text', { ar: 'بقية النقطة', en: 'The rest of the point' }, 260, {
              multiline: true,
              latinNames: true,
              description: {
                ar: 'ضع اسم الملف الإنجليزي بين علامتي ` ليُكتب من اليسار لليمين، مثل `concrete_db.json`.',
                en: 'Put a Latin file name between two ` marks to set it left to right, like `concrete_db.json`.',
              },
            }),
          ],
        }),
        {
          name: 'tree',
          type: 'group',
          label: { ar: 'مجلد المشروع', en: 'Project folder' },
          admin: {
            description: {
              ar: 'المجلد الذي تكتبه الأداة، مرسوماً كشجرة.',
              en: 'The folder the tool writes, drawn as a tree.',
            },
          },
          fields: [
            wordsField('project', { ar: 'اسم المجلد', en: 'Folder name' }, 40),
            listField({
              name: 'entries',
              labels: { singular: { ar: 'ملف', en: 'File' }, plural: { ar: 'الملفات', en: 'Files' } },
              rows: { min: 1, max: 8 },
              fields: [
                latinField('name', { ar: 'اسم الملف', en: 'File name' }, 40),
                wordsField('description', { ar: 'ما يحويه', en: 'What it holds' }, 40, { optional: true }),
                {
                  name: 'nested',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { ar: 'داخل المجلد الذي فوقه', en: 'Inside the folder above it' },
                },
              ],
            }),
            wordsField('caption', { ar: 'السطر تحت الشجرة', en: 'Line under the tree' }, 140, { multiline: true }),
          ],
        },
      ],
    }),
    sectionTab({
      name: 'requirements',
      label: { ar: 'المتطلبات', en: 'Requirements' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(90),
        listField({
          name: 'cards',
          labels: { singular: { ar: 'متطلب', en: 'Requirement' }, plural: { ar: 'المتطلبات', en: 'Requirements' } },
          rows: { min: 1, max: 6 },
          fields: [
            wordsField('label', { ar: 'السطر الصغير', en: 'Small line' }, 25),
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 30),
            wordsField('text', { ar: 'النص', en: 'Text' }, 90),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'download',
      label: { ar: 'التحميل', en: 'Download' },
      hideable: false,
      description: {
        ar: 'ما يحصل عليه الزائر، بجانب نموذج التحميل. يظهر دائماً: الزر الأول أعلى الصفحة ينقل إليه.',
        en: 'What the visitor gets, beside the download form. Always shows: the hero’s first button lands here.',
      },
      fields: [
        eyebrow(),
        heading(40),
        lead(),
        linesField('ticks', { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'ما يحصل عليه', en: 'What they get' } }, { min: 1, max: 6 }, 90),
        {
          name: 'promise',
          type: 'group',
          label: { ar: 'السطر تحتها', en: 'Line under them' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('bold', { ar: 'البداية بخط عريض', en: 'Bold opening' }, 20),
                wordsField('text', { ar: 'بقية السطر', en: 'The rest of the line' }, 60),
              ],
            },
          ],
        },
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
      name: 'upsell',
      label: { ar: 'الخطوة التالية', en: 'Upsell' },
      hideable: true,
      fields: [
        eyebrow(),
        heading(60),
        lead(),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى صفحة ابدأ.', en: 'Leads to the start page.' },
            }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى صفحة المنتج.', en: 'Leads to the product page.' },
            }),
          ],
        },
        linesField('adds', { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'ما تضيفه النسخة السحابية', en: 'What the cloud version adds' } }, { min: 1, max: 8 }, 90),
        wordsField('signOff', { ar: 'السطر الذي يختم الصفحة', en: 'Line that closes the page' }, 120),
      ],
    }),
    searchTab(),
  ],
});
