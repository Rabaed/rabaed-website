import type { Field } from 'payload';
import { SCREEN_MOCKS } from '../../screen-mocks/registry';
import { listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

const EYEBROW = wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 30);

/** Which Screen mock a panel or a party shows; its picture and words are in the Screen mocks entry, once for every page. */
const screenField: Field = {
  name: 'screen',
  type: 'select',
  required: true,
  options: SCREEN_MOCKS.map((mock) => ({ value: mock.id, label: mock.title })),
  label: { ar: 'الشاشة', en: 'Screen' },
  admin: {
    description: {
      ar: 'صورتها ووصفها في «شاشات المنصة».',
      en: 'Its picture and description are under Screen mocks.',
    },
  },
};

/**
 * The product page's words, section by section, in the page's order (ticket
 * 57), built like the start page's (`start-page.ts`). Its closing section is
 * the entry it shares with the home page (`closing-section.ts`), and its
 * screens are the Screen mocks entry's (`screen-mocks.ts`).
 *
 * **Where the design stops the words.** On a window that pins the journey, a
 * panel is the height of the window and clips what does not fit: at 981×551,
 * the smallest window that pins, the second panel's words have 31px to spare.
 * The panel's limits are what still fits there with every one at its longest,
 * which `tests/e2e/product-text.spec.ts` checks; the journey's heading is held
 * to one line, since the panels start under it. The custom strip's badge sits
 * in the corner of a card, over where a long title runs: at desktop widths, a
 * title of 32 characters stays clear of it, and the Reference site's longest
 * is 31.
 *
 * Where each link lands stays in code — `#demo`, `#journey` — so an Editor
 * changes what a button says, never where it goes.
 */
export const ProductPage = pageGlobal({
  slug: 'product-page',
  label: { ar: 'صفحة المنتج', en: 'Product page' },
  path: '/product',
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
        EYEBROW,
        wordsField('title', { ar: 'العنوان', en: 'Heading' }, 70),
        wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 200, { multiline: true }),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, {
              description: { ar: 'ينقل إلى نموذج طلب العرض.', en: 'Leads to the demo request form.' },
            }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'ينقل إلى الوحدات.', en: 'Leads to the units.' },
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
      name: 'journey',
      label: { ar: 'الوحدات', en: 'Units' },
      hideable: false,
      description: {
        ar: 'لوحات تمر أفقياً مع التمرير، كل لوحة بجانب شاشتها. يظهر دائماً: الزر الثاني ينقل إليه. اللوحة بطول النافذة، فالنصوص محدودة بما يتسع لها.',
        en: 'Panels that travel sideways as the visitor scrolls, each beside its screen. Always shows: the second button lands on it. A panel is the height of the window, so its words are held to what fits.',
      },
      fields: [
        EYEBROW,
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 40, {
          description: { ar: 'على سطر واحد: اللوحات تبدأ تحته.', en: 'On one line: the panels start under it.' },
        }),
        wordsField('outputLabel', { ar: 'اسم ما تنتجه الوحدات', en: 'Name for what the units produce' }, 15, {
          description: {
            ar: 'يظهر مكان الرقم على اللوحة المميّزة، مثل «المخرَج».',
            en: 'Shows in place of the number on the marked-out panel, like «المخرَج».',
          },
        }),
        listField({
          name: 'panels',
          labels: {
            singular: { ar: 'لوحة', en: 'Panel' },
            plural: { ar: 'اللوحات', en: 'Panels' },
          },
          rows: { min: 1, max: 8 },
          description: {
            ar: 'تُرقَّم الوحدات حسب ترتيبها. اسحبها لإعادة ترتيبها.',
            en: 'Units are numbered by their order. Drag them to reorder.',
          },
          fields: [
            {
              name: 'final',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'ما تنتجه الوحدات', en: 'What the units produce' },
              admin: {
                description: {
                  ar: 'لوحة مميّزة تحمل الاسم أعلاه بدل رقم، مثل السجل الموثّق.',
                  en: 'A marked-out panel carrying the name above instead of a number, like the Record.',
                },
              },
            },
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 40),
            wordsField('tagline', { ar: 'السطر تحت العنوان', en: 'Line under the title' }, 80),
            wordsField('body', { ar: 'النص', en: 'Text' }, 200, { multiline: true }),
            listField({
              name: 'flow',
              labels: {
                singular: { ar: 'طرف', en: 'Party' },
                plural: { ar: 'الأطراف أسفل اللوحة', en: 'Parties at the foot of the panel' },
              },
              rows: { min: 0, max: 4 },
              description: {
                ar: 'من تنتقل الوحدة بينهم، من اليمين إلى اليسار. اتركها فارغة لتُخفى.',
                en: 'Who the unit passes things between, right to left. Leave it empty to show none.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    wordsField('party', { ar: 'الطرف', en: 'Party' }, 16),
                    {
                      name: 'after',
                      type: 'select',
                      required: true,
                      defaultValue: 'towards',
                      options: [
                        { value: 'towards', label: { ar: 'سهم إلى الطرف التالي', en: 'An arrow to the next party' } },
                        { value: 'then', label: { ar: 'فاصل قبل مسار آخر', en: 'A break before another route' } },
                        { value: 'none', label: { ar: 'لا شيء', en: 'Nothing' } },
                      ],
                      label: { ar: 'بعده', en: 'After it' },
                      admin: {
                        description: { ar: 'لا يُرسم بعد آخر طرف.', en: 'Nothing is drawn after the last party.' },
                      },
                    },
                  ],
                },
              ],
            }),
            screenField,
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'customStrip',
      label: { ar: 'حسب المشروع', en: 'Custom strip' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 60),
        wordsField('badge', { ar: 'الشارة على كل بطاقة', en: 'Badge on every card' }, 16),
        listField({
          name: 'features',
          labels: {
            singular: { ar: 'بطاقة', en: 'Card' },
            plural: { ar: 'البطاقات', en: 'Cards' },
          },
          rows: { min: 1, max: 4 },
          fields: [
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 32, {
              description: {
                ar: 'قصير: الشارة في زاوية البطاقة فوق مكانه.',
                en: 'Short: the badge sits in the card’s corner, over where it runs.',
              },
            }),
            wordsField('body', { ar: 'النص', en: 'Text' }, 160, { multiline: true }),
          ],
        }),
        wordsField('askLabel', { ar: 'الرابط على كل بطاقة', en: 'Link on every card' }, 40, {
          description: { ar: 'ينقل إلى نموذج طلب العرض.', en: 'Leads to the demo request form.' },
        }),
      ],
    }),
    sectionTab({
      name: 'roles',
      label: { ar: 'لكل طرف', en: 'Each party' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 70),
        listField({
          name: 'roles',
          labels: {
            singular: { ar: 'طرف', en: 'Party' },
            plural: { ar: 'الأطراف الثلاثة', en: 'The three parties' },
          },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'الأطراف ثلاثة دائماً: المالك والاستشاري والمقاول. اسحبها لإعادة ترتيبها.',
            en: 'Always three: the Owner, the Consultant and the Contractor. Drag them to reorder.',
          },
          fields: [
            wordsField('party', { ar: 'اسم التبويب', en: 'Tab' }, 20),
            wordsField('promise', { ar: 'العنوان', en: 'Heading' }, 40),
            wordsField('body', { ar: 'النص', en: 'Text' }, 220, { multiline: true }),
            wordsField('objection', { ar: 'الاعتراض، بين علامتي تنصيص', en: 'The objection, in quotation marks' }, 60),
            wordsField('answer', { ar: 'الرد عليه', en: 'The answer' }, 140, { multiline: true }),
            screenField,
          ],
        }),
        listField({
          name: 'sharedPromises',
          labels: {
            singular: { ar: 'ميزة', en: 'Promise' },
            plural: { ar: 'ما يحصل عليه كل طرف', en: 'What every party gets' },
          },
          rows: { min: 1, max: 8 },
          fields: [wordsField('promise', { ar: 'الميزة', en: 'Promise' }, 40)],
        }),
      ],
    }),
    sectionTab({
      name: 'innerCycle',
      label: { ar: 'داخل كل جهة', en: 'Inside each party' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 70),
        wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 320, { multiline: true }),
        listField({
          name: 'cycles',
          labels: {
            singular: { ar: 'جهة', en: 'Party' },
            plural: { ar: 'الجهات الثلاث', en: 'The three parties' },
          },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'الجهات ثلاث دائماً، بترتيب انتقال المعاملة: من المقاول إلى الاستشاري إلى المالك.',
            en: 'Always three, in the order a transaction travels: from the Contractor, to the Consultant, to the Owner.',
          },
          fields: [
            wordsField('party', { ar: 'الجهة', en: 'Party' }, 20),
            wordsField('note', { ar: 'السطر تحت اسمها', en: 'Line under its name' }, 40),
            listField({
              name: 'reviewers',
              dbName: 'product_page_reviewers',
              labels: {
                singular: { ar: 'مراجع', en: 'Reviewer' },
                plural: { ar: 'المراجعون بالترتيب', en: 'Reviewers, in order' },
              },
              rows: { min: 1, max: 5 },
              description: {
                ar: 'الأخير هو صاحب القرار.',
                en: 'The last one decides.',
              },
              fields: [wordsField('reviewer', { ar: 'المراجع', en: 'Reviewer' }, 30)],
            }),
            wordsField('crosses', { ar: 'ما يعبر منها رسمياً', en: 'What crosses from it' }, 100, { multiline: true }),
          ],
        }),
        {
          type: 'row',
          fields: [
            wordsField('privateTag', { ar: 'الوسم فوق المراجعين', en: 'Tag over the reviewers' }, 25),
            wordsField('crossesLabel', { ar: 'العنوان فوق ما يعبر', en: 'Label over what crosses' }, 20),
          ],
        },
        wordsField('reviewAgain', { ar: 'السطر بجانب دائرة الإعادة', en: 'Line beside the review loop' }, 60),
        ...(['staysInside', 'crossesOut'] as const).map(
          (name): Field => ({
            name,
            type: 'group',
            label:
              name === 'staysInside'
                ? { ar: 'ما يبقى داخل الجهة', en: 'What stays inside' }
                : { ar: 'ما يعبر إلى الآخرين', en: 'What crosses to the others' },
            fields: [
              wordsField('label', { ar: 'العنوان', en: 'Label' }, 30),
              wordsField('text', { ar: 'النص', en: 'Text' }, 140, { multiline: true }),
              wordsField('emphasis', { ar: 'الجملة بخط عريض بعده', en: 'The sentence in bold after it' }, 100, {
                multiline: true,
              }),
            ],
          }),
        ),
      ],
    }),
  ],
});
