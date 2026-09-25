import type { Block, Field } from 'payload';
import { HERO_DOCUMENT, HERO_STATIONS } from '../../components/home/hero-stations';
import { latinField, listField, openingAnswerField, pictureField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';
import { MARKETING_PAGES } from '../../lib/page-registry';
import { screenField } from './screen-mocks';

const EYEBROW = wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40);
const HEADING: Words = { ar: 'العنوان', en: 'Heading' };
const LEAD: Words = { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' };
const TO_DEMO: Words = { ar: 'ينقل إلى نموذج طلب العرض.', en: 'Leads to the demo request form.' };
const READ_OUT: Words = { ar: 'يُقرأ لقارئات الشاشة.', en: 'Read out by screen readers.' };

/** A picture in the hero's drawing, held to the shape of the drawing it replaces. */
function drawing(name: string, label: Words, size: { readonly width: number; readonly height: number }): Field {
  return pictureField({
    name,
    label,
    size,
    required: false,
    description: {
      ar: `بمقاس ${size.width}×${size.height} أو أكبر بالنسبة نفسها، بخلفية شفافة. احذفها لتعود الرسمة الحالية.`,
      en: `${size.width}×${size.height}, or larger in the same proportions, on a transparent background. Remove it to bring back today’s drawing.`,
    },
  });
}

/** The words a deck of cards is drawn with. */
const deckField: Field = {
  name: 'deck',
  type: 'group',
  label: { ar: 'أزرار البطاقات', en: 'Card deck' },
  fields: [
    wordsField('label', { ar: 'اسم البطاقات وطريقة تحريكها', en: 'The deck’s name, and how to move it' }, 80, {
      description: READ_OUT,
    }),
    {
      type: 'row',
      fields: [
        wordsField('previousLabel', { ar: 'زر السابق', en: 'Previous button' }, 30, { description: READ_OUT }),
        wordsField('nextLabel', { ar: 'زر التالي', en: 'Next button' }, 30, { description: READ_OUT }),
      ],
    },
    wordsField('hint', { ar: 'السطر تحت الأزرار', en: 'Line under the buttons' }, 60),
  ],
};

/** One side of a before-and-after step: its tag, and its words, which may carry bold and line breaks. */
function faceField(name: string, label: Words): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      wordsField('channel', { ar: 'الوسم في زاوية البطاقة', en: 'Tag in the card’s corner' }, 10),
      wordsField('words', { ar: 'النص', en: 'Text' }, 66, { multiline: true, emphasis: true }),
    ],
  };
}

/** A bar of a before-and-after figure: its label, and how tall it is drawn, out of 70. */
function barField(name: string, label: Words): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        type: 'row',
        fields: [
          wordsField('label', { ar: 'تحت العمود', en: 'Under the bar' }, 6),
          {
            name: 'height',
            type: 'number',
            required: true,
            min: 1,
            max: 70,
            label: { ar: 'ارتفاع العمود', en: 'Bar height' },
            admin: { description: { ar: 'من 1 إلى 70.', en: 'From 1 to 70.' } },
          },
        ],
      },
    ],
  };
}

/** What every card of the figures deck shows around its figure. */
const FIGURE_FRAME: Field[] = [
  {
    type: 'row',
    fields: [
      wordsField('topic', { ar: 'الوسم أعلى البطاقة', en: 'Pill at the top of the card' }, 18),
      {
        name: 'icon',
        type: 'select',
        required: true,
        label: { ar: 'الرسمة في الزاوية', en: 'Icon in the corner' },
        options: [
          { value: 'approval', label: { ar: 'مستند معتمد', en: 'Approved document' } },
          { value: 'retrieval', label: { ar: 'بحث', en: 'Search' } },
          { value: 'time', label: { ar: 'ساعة', en: 'Clock' } },
          { value: 'governance', label: { ar: 'درع', en: 'Shield' } },
          { value: 'activation', label: { ar: 'برق', en: 'Lightning' } },
          { value: 'onboarding', label: { ar: 'فريق', en: 'Team' } },
        ],
      },
    ],
  },
  wordsField('claim', { ar: 'ما يتغيّر', en: 'What changes' }, 36),
];

const BASIS = wordsField('basis', { ar: 'على ماذا يُقاس، أسفل البطاقة', en: 'What it is measured against, at the foot' }, 48);

const COMPARISON: Block = {
  slug: 'comparison',
  labels: {
    singular: { ar: 'رقم قبل وبعد', en: 'Before-and-after figure' },
    plural: { ar: 'أرقام قبل وبعد', en: 'Before-and-after figures' },
  },
  fields: [
    ...FIGURE_FRAME,
    // Five characters: set at 60px in DM Mono beside its two bars, a sixth
    // pushes the bars past the card's edge at desktop widths.
    latinField('figure', { ar: 'الرقم', en: 'Figure' }, 5),
    { type: 'row', fields: [barField('before', { ar: 'العمود قبل', en: 'Bar before' }), barField('after', { ar: 'العمود بعد', en: 'Bar after' })] },
    BASIS,
    {
      name: 'source',
      type: 'textarea',
      maxLength: 300,
      label: { ar: 'مصدر الرقم', en: 'Where the figure comes from' },
      admin: {
        rows: 3,
        description: {
          ar: 'أي مشروع، وكيف قيس، ومن قاسه، وعلى أي مدة. لا يراه الزوار، ولا تظهر البطاقة على الموقع المنشور حتى يُكتب.',
          en: 'Which project, measured how, by whom, over what period. Visitors never see it, and the card stays off the live site until it is written.',
        },
      },
    },
  ],
};

const COMMITMENT: Block = {
  slug: 'commitment',
  labels: {
    singular: { ar: 'التزام', en: 'Commitment' },
    plural: { ar: 'التزامات', en: 'Commitments' },
  },
  fields: [
    ...FIGURE_FRAME,
    wordsField('value', { ar: 'الالتزام بخط كبير', en: 'The commitment, in large type' }, 12, {
      description: { ar: 'مثل «أقل من يوم». يظهر دائماً: وعد لا رقم يحتاج مصدراً.', en: 'Like «أقل من يوم». Always shows: a promise, not a figure needing a source.' },
    }),
    BASIS,
  ],
};

/**
 * The home page's words and pictures, section by section, in the page's order
 * (ticket 58), built like the product page's (`product-page.ts`). Its closing
 * section is the entry it shares with the product page (`closing-section.ts`),
 * its four units' screens are the Screen mocks entry's (`screen-mocks.ts`), and
 * the Trust strip's marks are ticket 20's: here the strip only shows or hides.
 *
 * **Locked counts** (spec: Content model): the hero's three buildings and its
 * four statuses, which follow the document's route round them
 * (`hero-stations.ts`); each Record trail's four steps, which the seal counts;
 * the before-and-after's four steps, whose resting state `home.css` draws
 * column by column; and the calculator's three sliders. Every other list grows
 * and shrinks.
 *
 * **Where the design stops the words.** A situation card is 340×348 and a
 * figure card 344×296 (268px tall on a short window), and a before-and-after
 * face is laid over its column, which is only as tall as its minimum. Their
 * limits are what still fits there with every word at its longest, which
 * `tests/e2e/home-text.spec.ts` checks.
 *
 * Where each link lands stays in code — `#demo`, the four units (`#jt`), the
 * product and start pages — so an Editor changes what a button says, never
 * where it goes.
 */
export const HomePage = pageGlobal({
  slug: MARKETING_PAGES.home.entry.slug,
  label: MARKETING_PAGES.home.entry.label,
  path: MARKETING_PAGES.home.path,
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وأزرارها ورسم الأطراف الثلاثة. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading, its buttons and the drawing of the three parties. Always shows: it holds the page’s only heading.',
      },
      fields: [
        EYEBROW,
        listField({
          name: 'titleLines',
          labels: {
            singular: { ar: 'سطر', en: 'Line' },
            plural: { ar: 'أسطر العنوان', en: 'Heading lines' },
          },
          rows: { min: 1, max: 2 },
          description: {
            ar: 'كل سطر على حدة، ثم السطر الملوّن تحتها.',
            en: 'A line at a time, then the line in colour under them.',
          },
          fields: [wordsField('line', { ar: 'السطر', en: 'Line' }, 18)],
        }),
        wordsField('titleAccent', { ar: 'السطر الملوّن آخر العنوان', en: 'Line in colour, last' }, 18),
        wordsField('lead', LEAD, 220, { multiline: true }),
        {
          type: 'row',
          fields: [
            wordsField('primaryLabel', { ar: 'الزر الأول', en: 'First button' }, 30, { description: TO_DEMO }),
            wordsField('secondaryLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: {
                ar: 'الزر المحدَّد بإطار بجانب الأول. ينزل بالزائر إلى قسم الوحدات الأربع، ويختفي ما دام ذلك القسم مخفياً.',
                en: 'The outlined button beside the first. It takes the visitor down to the four units, and is hidden while that section is hidden.',
              },
            }),
          ],
        },
        wordsField('trust', { ar: 'السطر تحت الأزرار', en: 'Line under the buttons' }, 50),
        {
          type: 'row',
          fields: [
            wordsField('guaranteePeriod', { ar: 'مدة الضمان', en: 'Guarantee period' }, 16, {
              description: { ar: 'بخط عريض، مثل «60 يوماً».', en: 'In bold, like «60 يوماً».' },
            }),
            wordsField('guaranteePromise', { ar: 'الضمان', en: 'The guarantee' }, 40),
          ],
        },
        {
          name: 'parties',
          type: 'group',
          label: { ar: 'أسماء الأطراف في الرسم', en: 'The parties’ names in the drawing' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('owner', { ar: 'المالك', en: 'Owner' }, 14),
                wordsField('consultant', { ar: 'الاستشاري', en: 'Consultant' }, 14),
                wordsField('contractor', { ar: 'المقاول', en: 'Contractor' }, 14),
              ],
            },
          ],
        },
        wordsField('diagramDescription', { ar: 'ما يُظهره الرسم', en: 'What the drawing shows' }, 200, {
          multiline: true,
          description: { ar: 'يُقرأ لقارئات الشاشة بدل الرسم.', en: 'Read out by screen readers in place of the drawing.' },
        }),
        listField({
          name: 'statuses',
          labels: {
            singular: { ar: 'حالة', en: 'Status' },
            plural: { ar: 'حالات المستند', en: 'The document’s statuses' },
          },
          rows: { min: 4, max: 4 },
          description: {
            ar: 'أربع دائماً، بترتيب رحلة المستند: عند المقاول، ثم الاستشاري، ثم المالك، ثم عودته إلى الأطراف الثلاثة. تظهر كل حالة حين يصل المستند.',
            en: 'Always four, in the order the document travels: at the Contractor, then the Consultant, then the Owner, then back to all three. Each shows as the document arrives.',
          },
          fields: [wordsField('status', { ar: 'الحالة', en: 'Status' }, 30)],
        }),
        wordsField('statusAtRest', { ar: 'الحالة حين لا يتحرك الرسم', en: 'Status when the drawing stays still' }, 30, {
          description: { ar: 'لمن يطلب جهازه تقليل الحركة.', en: 'For visitors whose device asks for less motion.' },
        }),
        {
          name: 'pictures',
          type: 'group',
          label: { ar: 'رسومات الأطراف والمستند', en: 'The drawings of the parties and the document' },
          admin: {
            description: {
              ar: 'بلا صورة مختارة تظهر الرسمة الحالية.',
              en: 'With no picture chosen, today’s drawing shows.',
            },
          },
          fields: [
            drawing('owner', { ar: 'مبنى المالك', en: 'Owner’s building' }, HERO_STATIONS.owner.building.intrinsic),
            drawing('consultant', { ar: 'مبنى الاستشاري', en: 'Consultant’s building' }, HERO_STATIONS.consultant.building.intrinsic),
            drawing('contractor', { ar: 'مبنى المقاول', en: 'Contractor’s building' }, HERO_STATIONS.contractor.building.intrinsic),
            drawing('document', { ar: 'المستند المتنقل', en: 'The travelling document' }, HERO_DOCUMENT.intrinsic),
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
      name: 'situations',
      label: { ar: 'مواقف من الميدان', en: 'Situations' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 40),
        {
          name: 'close',
          type: 'group',
          label: { ar: 'السطر الختامي تحت العنوان', en: 'Closing line under the heading' },
          fields: [
            wordsField('first', { ar: 'الجملة الأولى', en: 'First sentence' }, 60),
            wordsField('second', { ar: 'الجملة الثانية', en: 'Second sentence' }, 40, {
              description: { ar: 'تكملها الكلمات الملوّنة بعدها.', en: 'Runs on into the words in colour after it.' },
            }),
            wordsField('accent', { ar: 'الكلمات الملوّنة', en: 'Words in colour' }, 20),
          ],
        },
        listField({
          name: 'situations',
          labels: {
            singular: { ar: 'موقف', en: 'Situation' },
            plural: { ar: 'المواقف', en: 'Situations' },
          },
          rows: { min: 1, max: 10 },
          description: {
            ar: 'بطاقة لكل موقف، تُرقَّم حسب ترتيبها. اسحبها لإعادة ترتيبها. البطاقة بمقاس ثابت، فالنصوص محدودة بما يتسع لها.',
            en: 'A card each, numbered by its order. Drag them to reorder. A card is a fixed size, so its words are held to what fits.',
          },
          fields: [
            wordsField('quote', { ar: 'ما يُقال في الموقع', en: 'What gets said on site' }, 75, { multiline: true }),
            wordsField('cost', { ar: 'الثمن', en: 'What it costs' }, 50, { multiline: true }),
          ],
        }),
        wordsField('costLabel', { ar: 'العنوان فوق الثمن', en: 'Label over the cost' }, 12),
        deckField,
      ],
    }),
    sectionTab({
      name: 'fourUnits',
      label: { ar: 'الوحدات', en: 'Units' },
      hideable: true,
      description: {
        ar: 'تبويبات بجانب شاشة المنصة. صورة كل شاشة ووصفها في «شاشات المنصة».',
        en: 'Tabs beside a screen of the platform. Each screen’s picture and description are under Screen mocks.',
      },
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 50),
        // The Reference site opens this section on its tabs, with no paragraph
        // between them and the heading — so the field is optional, and the
        // section is drawn exactly as it is today while it stands empty
        // (ticket 35).
        openingAnswerField(400, { optional: true }),
        wordsField('tabsLabel', { ar: 'اسم التبويبات', en: 'The tabs’ name' }, 40, { description: READ_OUT }),
        wordsField('outputLabel', { ar: 'اسم ما تنتجه الوحدات', en: 'Name for what the units produce' }, 15, {
          description: {
            ar: 'يظهر مكان الرقم على التبويب المميّز، مثل «المخرَج».',
            en: 'Shows in place of the number on the marked-out tab, like «المخرَج».',
          },
        }),
        listField({
          name: 'tabs',
          labels: {
            singular: { ar: 'تبويب', en: 'Tab' },
            plural: { ar: 'التبويبات', en: 'Tabs' },
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
                  ar: 'تبويب مميّز يحمل الاسم أعلاه بدل رقم، مثل السجل الموثّق.',
                  en: 'A marked-out tab carrying the name above instead of a number, like the Record.',
                },
              },
            },
            wordsField('title', { ar: 'العنوان', en: 'Title' }, 30),
            screenField,
          ],
        }),
        wordsField('moreLabel', { ar: 'الرابط تحت الشاشة', en: 'Link under the screen' }, 40, {
          description: { ar: 'ينقل إلى صفحة المنتج.', en: 'Leads to the product page.' },
        }),
      ],
    }),
    sectionTab({
      name: 'record',
      label: { ar: 'السجل الموثّق', en: 'Record' },
      hideable: true,
      fields: [
        EYEBROW,
        listField({
          name: 'headingLines',
          labels: {
            singular: { ar: 'سطر', en: 'Line' },
            plural: { ar: 'أسطر العنوان', en: 'Heading lines' },
          },
          rows: { min: 1, max: 3 },
          fields: [wordsField('line', { ar: 'السطر', en: 'Line' }, 30)],
        }),
        listField({
          name: 'questions',
          labels: {
            singular: { ar: 'سؤال', en: 'Question' },
            plural: { ar: 'الأسئلة التي يجيب عنها السجل', en: 'The questions the Record answers' },
          },
          rows: { min: 1, max: 6 },
          description: { ar: 'متتالية تفصل بينها نقاط.', en: 'Set in a row, with dots between.' },
          fields: [wordsField('question', { ar: 'السؤال', en: 'Question' }, 15)],
        }),
        openingAnswerField(400),
        listField({
          name: 'types',
          labels: {
            singular: { ar: 'نوع معاملة', en: 'Transaction type' },
            plural: { ar: 'أنواع المعاملات', en: 'Transaction types' },
          },
          rows: { min: 1, max: 8 },
          description: {
            ar: 'تمر البطاقة عليها بالترتيب مع التمرير، وتعرض لكل نوع أثر معاملة واحدة منه.',
            en: 'The card works through them in order as the visitor scrolls, showing the trail one transaction of each type leaves.',
          },
          fields: [
            wordsField('label', { ar: 'اسم النوع', en: 'Type' }, 24),
            wordsField('title', { ar: 'رقم المعاملة وموضوعها', en: 'Reference and subject' }, 50),
            listField({
              name: 'steps',
              labels: {
                singular: { ar: 'خطوة', en: 'Step' },
                plural: { ar: 'خطوات المعاملة', en: 'The transaction’s steps' },
              },
              rows: { min: 4, max: 4 },
              description: {
                ar: 'أربع دائماً: رُفعت، استُلمت، دُققت، ثم القرار، وهو الأخير. الختم يعدّها «4 خطوات».',
                en: 'Always four: raised, received, checked, and the decision, last. The seal counts them as four steps.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    wordsField('action', { ar: 'ما حدث', en: 'What happened' }, 18),
                    wordsField('by', { ar: 'من قام به أو كيف', en: 'Who, or how' }, 32),
                    latinField('time', { ar: 'الوقت', en: 'Time' }, 5),
                  ],
                },
              ],
            }),
          ],
        }),
        wordsField('stamp', { ar: 'الختم', en: 'Seal' }, 40, {
          description: { ar: 'يظهر حين يصل الزائر إلى آخر الأنواع.', en: 'Shows once the visitor reaches the last type.' },
        }),
      ],
    }),
    sectionTab({
      name: 'beforeAfter',
      label: { ar: 'قبل وبعد', en: 'Before and after' },
      hideable: true,
      description: {
        ar: 'ضع ما يُكتب بخط عريض بين علامتي *، مثل *اسحب المقبض*، وابدأ سطراً جديداً حيث تريد فاصل السطر.',
        en: 'Put what is set in bold between two * marks, like *drag the handle*, and start a new line where a line break goes.',
      },
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 40),
        wordsField('lead', LEAD, 200, { multiline: true, emphasis: true }),
        {
          type: 'row',
          fields: [
            wordsField('usualTag', { ar: 'الوسم فوق الطريقة المعتادة', en: 'Tag over the usual way' }, 20),
            wordsField('rabaedTag', { ar: 'الوسم فوق ربائد', en: 'Tag over Rabaed’s way' }, 20),
          ],
        },
        wordsField('handleLabel', { ar: 'اسم المقبض', en: 'The handle’s name' }, 60, { description: READ_OUT }),
        {
          name: 'verdicts',
          type: 'group',
          label: { ar: 'النتيجة تحت الخطوات', en: 'The verdict under the steps' },
          fields: [
            wordsField('usual', { ar: 'حين تظهر الطريقة المعتادة كلها', en: 'When all of the usual way shows' }, 70),
            wordsField('rabaed', { ar: 'حين تظهر ربائد كلها', en: 'When all of Rabaed’s way shows' }, 70),
            wordsField('between', { ar: 'بين الطريقتين', en: 'In between' }, 70),
          ],
        },
        listField({
          name: 'steps',
          labels: {
            singular: { ar: 'خطوة', en: 'Step' },
            plural: { ar: 'الخطوات الأربع', en: 'The four steps' },
          },
          rows: { min: 4, max: 4 },
          description: {
            ar: 'أربع دائماً: المقارنة مبنية على أربعة أعمدة. البطاقة بارتفاع ثابت، فالنصوص محدودة بما يتسع لها.',
            en: 'Always four: the comparison is built on four columns. A card is a fixed height, so its words are held to what fits.',
          },
          fields: [
            wordsField('name', { ar: 'اسم الخطوة', en: 'Step' }, 12),
            faceField('usual', { ar: 'الطريقة المعتادة', en: 'The usual way' }),
            faceField('rabaed', { ar: 'مع ربائد', en: 'With Rabaed' }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'calculator',
      label: { ar: 'حاسبة التأخير', en: 'Delay calculator' },
      hideable: true,
      description: {
        ar: 'ما يسمح به كل مؤشر وطريقة الحساب في الكود؛ هنا كلماتها.',
        en: 'What each slider allows, and the formula, are in code; its words are here.',
      },
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 60),
        wordsField('lead', LEAD, 200, { multiline: true }),
        {
          name: 'sliderLabels',
          type: 'group',
          label: { ar: 'أسماء المؤشرات الثلاثة', en: 'The three sliders’ names' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('projectValue', { ar: 'قيمة المشروع', en: 'Project value' }, 20),
                wordsField('delayDays', { ar: 'أيام التأخير', en: 'Days of delay' }, 20),
                wordsField('durationMonths', { ar: 'مدة المشروع', en: 'Project length' }, 20),
              ],
            },
          ],
        },
        wordsField('resultLabel', { ar: 'العنوان فوق التكلفة', en: 'Label over the cost' }, 40),
        {
          name: 'breakdown',
          type: 'group',
          label: { ar: 'السطر الذي يقسم التكلفة', en: 'The line splitting the cost' },
          admin: { description: { ar: 'يُكتب المبلغ بعد كل اسم.', en: 'Each amount is written after its name.' } },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('financing', { ar: 'التمويل', en: 'Financing' }, 20),
                wordsField('siteOverhead', { ar: 'التكاليف العامة للموقع', en: 'Site overhead' }, 30),
              ],
            },
          ],
        },
        wordsField('assumptions', { ar: 'الافتراضات تحت التكلفة', en: 'Assumptions under the cost' }, 240, { multiline: true }),
        wordsField('callToActionLabel', { ar: 'الزر', en: 'Button' }, 40, { description: TO_DEMO }),
        wordsField('currency', { ar: 'العملة بعد المبلغ', en: 'Currency after an amount' }, 8),
        {
          name: 'days',
          type: 'group',
          label: { ar: 'الكلمة بعد عدد الأيام', en: 'Word after a number of days' },
          admin: {
            description: {
              ar: 'كما يعدّ العربي: بعد 1، وبعد 2، ومن 3 إلى 10، ومن 11 فأكثر.',
              en: 'As Arabic counts: after 1, after 2, from 3 to 10, and from 11 on.',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('one', { ar: 'بعد 1', en: 'After 1' }, 10),
                wordsField('two', { ar: 'بعد 2', en: 'After 2' }, 10),
                wordsField('few', { ar: 'من 3 إلى 10', en: '3 to 10' }, 10),
                wordsField('many', { ar: 'من 11 فأكثر', en: '11 or more' }, 10),
              ],
            },
          ],
        },
        {
          name: 'months',
          type: 'group',
          label: { ar: 'الكلمة بعد عدد الأشهر', en: 'Word after a number of months' },
          admin: {
            description: {
              ar: 'تبدأ مدة المشروع من 6 أشهر.',
              en: 'A project’s length starts at 6 months.',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('few', { ar: 'من 6 إلى 10', en: '6 to 10' }, 10),
                wordsField('many', { ar: 'من 11 فأكثر', en: '11 or more' }, 10),
              ],
            },
          ],
        },
      ],
    }),
    sectionTab({
      name: 'figures',
      label: { ar: 'الأثر', en: 'Figures' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 50),
        wordsField('lead', LEAD, 250, { multiline: true }),
        {
          name: 'figures',
          type: 'blocks',
          required: true,
          minRows: 1,
          maxRows: 8,
          labels: {
            singular: { ar: 'بطاقة', en: 'Card' },
            plural: { ar: 'البطاقات', en: 'Cards' },
          },
          admin: {
            description: {
              ar: 'رقم قبل وبعد لا يظهر على الموقع المنشور حتى يُكتب مصدره. البطاقة بمقاس ثابت، فالنصوص محدودة بما يتسع لها. اسحبها لإعادة ترتيبها.',
              en: 'A before-and-after figure stays off the live site until its source is written. A card is a fixed size, so its words are held to what fits. Drag them to reorder.',
            },
          },
          blocks: [COMPARISON, COMMITMENT],
        },
        deckField,
      ],
    }),
    sectionTab({
      name: 'questions',
      label: { ar: 'الأسئلة', en: 'Questions' },
      hideable: true,
      description: {
        ar: 'عنوان الأسئلة الشائعة. الأسئلة نفسها في «الأسئلة الشائعة».',
        en: 'The questions’ heading. The questions themselves are under FAQs.',
      },
      fields: [
        EYEBROW,
        wordsField('heading', HEADING, 40),
        wordsField('moreLabel', { ar: 'الرابط تحت الأسئلة', en: 'Link under the questions' }, 30, {
          description: {
            ar: 'ينقل إلى بقية الأسئلة في صفحة ابدأ.',
            en: 'Leads to the rest of the questions, on the start page.',
          },
        }),
      ],
    }),
    searchTab(),
  ],
});
