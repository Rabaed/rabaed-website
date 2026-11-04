import type { Tab } from 'payload';
import { buttonLinkField, latinField, listField, sectionTab, wordsField, type Words } from '../page-fields';

/**
 * The Company profile's close (ticket 109): Ahmed's sections 10 to 14 — the
 * pre-made templates, why Rabaed, the impact, the plans and how we start —
 * then his footer as the page's last section, `#contact`, and the WhatsApp
 * button that floats over the page. One tab each, in the page's order.
 *
 * A section's number is its place in Ahmed's order, which is fixed, so it is
 * code and never an Editor's, as it is for 01 to 09. Where a card carries one
 * of Ahmed's icons, the icon is fixed by the card's place, and the list keeps
 * the count the icons are drawn for.
 *
 * Every button's words and link are an Editor's, as on the rest of this page
 * (spec: Buttons and links). A WhatsApp link left empty is the site's one
 * WhatsApp address, from the site settings; so is the company WhatsApp in the
 * contact section, which is not this entry's at all.
 */

const EYEBROW = wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40, {
  description: { ar: 'يُكتب بعد رقم القسم، والرقم ثابت.', en: 'Follows the section’s number, which is fixed.' },
});
const HEADING: Words = { ar: 'العنوان', en: 'Heading' };
const LEAD: Words = { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' };

/** What every WhatsApp button's link says it is for, on the whole profile. */
export const WHATSAPP_LINK_DESCRIPTION: Words = {
  ar: 'اتركه فارغاً ليفتح رقم واتساب الموقع من «إعدادات الموقع»، أو اكتب رابطاً آخر مثل رابط حملة. رابط خارج الموقع يُفتح في نافذة جديدة.',
  en: 'Leave it empty to open the site’s WhatsApp number from Site settings, or write another link, such as a campaign’s. A link away from the site opens in a new tab.',
};

/** What every "Book a live demo" button's link says it is for, on the whole profile. */
export const DEMO_LINK_DESCRIPTION: Words = {
  ar: 'نموذج طلب العرض في الصفحة الرئيسية: ‎/#demo في العربية و‎/en#demo في الإنجليزية. رابط خارج الموقع يُفتح في نافذة جديدة.',
  en: 'The demo request form on the home page: /#demo in Arabic and /en#demo in English. A link away from the site opens in a new tab.',
};

export function profileCloseTabs(): Tab[] {
  return [
    sectionTab({
      name: 'templates',
      label: { ar: '10 نماذج جاهزة', en: '10 Pre-made templates' },
      hideable: true,
      description: {
        ar: 'بطاقات النماذج: يظهر رمز النموذج واسمه، وتنقلب البطاقة عند الضغط لتُظهر استخدامه.',
        en: 'The form cards: each shows the form’s code and name, and turns over when pressed to show what it is for.',
      },
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 80),
        wordsField('lead', LEAD, 320, { multiline: true }),
        wordsField('hint', { ar: 'التلميح فوق البطاقات', en: 'Hint above the cards' }, 70),
        listField({
          name: 'cards',
          labels: { singular: { ar: 'نموذج', en: 'Form' }, plural: { ar: 'النماذج', en: 'Forms' } },
          rows: { min: 3, max: 12 },
          description: {
            ar: 'بالترتيب الذي تظهر به، ثلاث في الصف واثنتان على الجوال.',
            en: 'In the order they show, three to a row, two on a phone.',
          },
          fields: [
            latinField('code', { ar: 'رمز النموذج، مثل SAR', en: 'The form’s code, like SAR' }, 6),
            wordsField('name', { ar: 'اسم النموذج', en: 'The form’s name' }, 40),
            wordsField('text', { ar: 'استخدامه، على ظهر البطاقة', en: 'What it is for, on the back of the card' }, 120, { multiline: true }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'why',
      label: { ar: '11 لماذا ربائد', en: '11 Why Rabaed' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 90),
        listField({
          name: 'reasons',
          labels: { singular: { ar: 'ميزة', en: 'Reason' }, plural: { ar: 'الميزات', en: 'Reasons' } },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'ثلاث دائماً، وأيقونة كل بطاقة ثابتة بمكانها: الواجهة العربية، ثم الدعم الميداني، ثم السعر.',
            en: 'Always three, and each card’s icon is fixed by its place: the Arabic interface, then onsite support, then the price.',
          },
          fields: [
            wordsField('name', { ar: 'الميزة', en: 'Reason' }, 50),
            wordsField('text', { ar: 'شرحها', en: 'What it means' }, 220, { multiline: true }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'impact',
      label: { ar: '12 الأثر', en: '12 The impact' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 80),
        wordsField('lead', LEAD, 220, { multiline: true }),
        listField({
          name: 'figures',
          labels: { singular: { ar: 'رقم', en: 'Figure' }, plural: { ar: 'الأرقام', en: 'Figures' } },
          rows: { min: 6, max: 6 },
          description: {
            ar: 'ستة دائماً، ثلاثة في الصف، وأيقونة كل رقم ثابتة بمكانه. يعدّ الرقم صعوداً حين يصل إليه الزائر.',
            en: 'Always six, three to a row, and each figure’s icon is fixed by its place. Each counts up as the visitor reaches it.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                latinField('figure', { ar: 'الرقم بعلامته، مثل 3.6× أو ‎+1,900', en: 'Figure with its sign, like 3.6× or +1,900' }, 8),
                wordsField('unit', { ar: 'كلمة بعده، مثل «دقيقة»', en: 'A word after it, like “min”' }, 12, {
                  optional: true,
                  description: { ar: 'اختيارية.', en: 'Optional.' },
                }),
              ],
            },
            wordsField('label', { ar: 'ما يعنيه الرقم', en: 'What it means' }, 70),
          ],
        }),
        wordsField('activation', { ar: 'السطر تحت الأرقام', en: 'Line under the figures' }, 120),
        wordsField('source', { ar: 'مصدر الأرقام، تحتها', en: 'Where the figures come from, under them' }, 80),
      ],
    }),
    sectionTab({
      name: 'plans',
      label: { ar: '13 الباقات', en: '13 Plans' },
      hideable: true,
      description: {
        ar: 'الباقات الثلاث بميزاتها، بلا أسعار.',
        en: 'The three plans and their features, without prices.',
      },
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 120),
        wordsField('badge', { ar: 'الشارة على الباقة الوسطى', en: 'Badge on the middle plan' }, 20),
        listField({
          name: 'tiers',
          labels: { singular: { ar: 'باقة', en: 'Plan' }, plural: { ar: 'الباقات', en: 'Plans' } },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'ثلاث دائماً، وأيقونة كل باقة ثابتة بمكانها. الوسطى هي البارزة، وعليها الشارة.',
            en: 'Always three, and each plan’s icon is fixed by its place. The middle one stands out, with the badge on it.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('kicker', { ar: 'السطر فوق الاسم', en: 'Line above the name' }, 30),
                wordsField('name', { ar: 'اسم الباقة', en: 'The plan’s name' }, 30),
              ],
            },
            listField({
              name: 'features',
              labels: { singular: { ar: 'ميزة', en: 'Feature' }, plural: { ar: 'الميزات', en: 'Features' } },
              rows: { min: 1, max: 6 },
              fields: [wordsField('feature', { ar: 'الميزة', en: 'Feature' }, 60)],
            }),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'start',
      label: { ar: '14 كيف نبدأ', en: '14 How we start' },
      hideable: true,
      description: {
        ar: 'الخطوات الثلاث، ثم بطاقة الختام بزرّيها.',
        en: 'The three steps, then the closing card and its two buttons.',
      },
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 120),
        listField({
          name: 'steps',
          labels: { singular: { ar: 'خطوة', en: 'Step' }, plural: { ar: 'الخطوات', en: 'Steps' } },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'ثلاث دائماً، مرقّمة بترتيبها، وأيقونة كل خطوة ثابتة بمكانها.',
            en: 'Always three, numbered in their order, and each step’s icon is fixed by its place.',
          },
          fields: [
            wordsField('name', { ar: 'الخطوة', en: 'Step' }, 30),
            wordsField('text', { ar: 'شرحها', en: 'What happens' }, 200, { multiline: true }),
          ],
        }),
        wordsField('cardTitle', { ar: 'عنوان بطاقة الختام', en: 'The closing card’s heading' }, 80),
        wordsField('cardLine', { ar: 'السطر تحته', en: 'Line under it' }, 160),
        {
          type: 'row',
          fields: [
            wordsField('demoLabel', { ar: 'الزر الأول', en: 'First button' }, 30),
            wordsField('whatsappLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30),
          ],
        },
        buttonLinkField('demoLink', { ar: 'وجهة الزر الأول', en: 'First button goes to' }, { description: DEMO_LINK_DESCRIPTION }),
        buttonLinkField('whatsappLink', { ar: 'وجهة الزر الثاني', en: 'Second button goes to' }, {
          optional: true,
          description: WHATSAPP_LINK_DESCRIPTION,
        }),
      ],
    }),
    sectionTab({
      name: 'contact',
      label: { ar: 'التواصل', en: 'Contact' },
      hideable: true,
      description: {
        ar: 'القسم الأخير فوق تذييل الموقع، كما ختم أحمد ملفه. رقم واتساب الشركة وحسابات التواصل من «إعدادات الموقع».',
        en: 'The last section, above the site’s footer, as Ahmed closes his profile. The company WhatsApp and the social accounts come from Site settings.',
      },
      fields: [
        wordsField('tagline', { ar: 'الجملة تحت الشعار', en: 'Line under the wordmark' }, 80),
        wordsField('name', { ar: 'الاسم', en: 'Name' }, 40),
        {
          type: 'row',
          fields: [
            wordsField('phoneLabel', { ar: 'كلمة الجوال', en: 'Label for the mobile' }, 20),
            latinField('phone', { ar: 'رقم الجوال، كما يُكتب', en: 'Mobile number, as written' }, 24),
          ],
        },
        {
          type: 'row',
          fields: [
            wordsField('emailLabel', { ar: 'كلمة البريد', en: 'Label for the email' }, 20),
            latinField('email', { ar: 'البريد', en: 'Email' }, 60),
          ],
        },
        wordsField('whatsappLabel', { ar: 'كلمة واتساب الشركة', en: 'Label for the company WhatsApp' }, 30, {
          description: {
            ar: 'الرقم بجانبها رقم واتساب الموقع من «إعدادات الموقع».',
            en: 'The number beside it is the site’s WhatsApp number, from Site settings.',
          },
        }),
        wordsField('location', { ar: 'المكان', en: 'Location' }, 60),
      ],
    }),
    {
      name: 'whatsappButton',
      label: { ar: 'زر واتساب العائم', en: 'Floating WhatsApp button' },
      description: {
        ar: 'الزر الأخضر في أسفل هذه الصفحة وحدها، على جانب نهاية السطر.',
        en: 'The green button at the bottom of this page alone, on the side lines end on.',
      },
      fields: [
        wordsField('label', { ar: 'اسم الزر', en: 'Button name' }, 30, {
          description: { ar: 'يُقرأ لقارئات الشاشة، فالزر أيقونة بلا كلمات.', en: 'Read out by screen readers: the button is an icon with no words.' },
        }),
        buttonLinkField('link', { ar: 'وجهة الزر', en: 'Button goes to' }, { optional: true, description: WHATSAPP_LINK_DESCRIPTION }),
      ],
    },
  ];
}
