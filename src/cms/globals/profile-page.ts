import { buttonLinkField, latinField, listField, pictureField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';
import { MARKETING_PAGES } from '../../lib/page-registry';

const EYEBROW = wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40, {
  description: { ar: 'يُكتب بعد رقم القسم، والرقم ثابت.', en: 'Follows the section’s number, which is fixed.' },
});
const HEADING: Words = { ar: 'العنوان', en: 'Heading' };
const LEAD: Words = { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' };

/** Ahmed's photo of the paper submittal (`public/profile/paper-800.webp`), whose shape a replacement keeps. */
const PAPER = { width: 800, height: 1069 } as const;

/**
 * The Company profile's words, section by section, in the page's order
 * (ticket 102): the home page's hero with Ahmed's words, and the shared Trust
 * strip, which here only shows or hides; then Ahmed's numbered sections, 01 to
 * 04 from ticket 105 and the rest from tickets 106–109. A section's number is
 * its place in Ahmed's order, which is fixed, so it is code rather than words,
 * and keeps the number Ahmed's Profile PDFs give it: hiding 03 leaves 01, 02
 * and 04.
 *
 * **Its buttons' links are an Editor's too**, unlike every other page's: the
 * founder chose on 4 November 2026 that a campaign's link may change tomorrow
 * without a developer (spec: Buttons and links). An empty WhatsApp link is
 * the site's one WhatsApp address, from the site settings.
 *
 * Its words' lengths are what the home page's hero carries, but for the
 * eyebrow and the lead, which carry Ahmed's longer ones: the eyebrow names the
 * country, and the lead says the platform runs within days.
 */
export const ProfilePage = pageGlobal({
  slug: MARKETING_PAGES.profile.entry.slug,
  label: MARKETING_PAGES.profile.entry.label,
  path: MARKETING_PAGES.profile.path,
  sections: [
    sectionTab({
      name: 'hero',
      label: { ar: 'أعلى الصفحة', en: 'Hero' },
      hideable: false,
      description: {
        ar: 'عنوان الصفحة وزرّيها ورسم الأطراف الثلاثة، كما في الصفحة الرئيسية. يظهر دائماً: فيه عنوان الصفحة الوحيد.',
        en: 'The page’s heading, its two buttons and the drawing of the three parties, as on the home page. Always shows: it holds the page’s only heading.',
      },
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 60),
        listField({
          name: 'titleLines',
          labels: { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'أسطر العنوان', en: 'Heading lines' } },
          rows: { min: 1, max: 2 },
          description: { ar: 'كل سطر على حدة، ثم السطر الملوّن تحتها.', en: 'A line at a time, then the line in colour under them.' },
          fields: [wordsField('line', { ar: 'السطر', en: 'Line' }, 18)],
        }),
        wordsField('titleAccent', { ar: 'السطر الملوّن آخر العنوان', en: 'Line in colour, last' }, 18),
        wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 320, { multiline: true }),
        {
          type: 'row',
          fields: [
            wordsField('demoLabel', { ar: 'الزر الأول', en: 'First button' }, 30),
            wordsField('whatsappLabel', { ar: 'الزر الثاني', en: 'Second button' }, 30, {
              description: { ar: 'الزر المحدَّد بإطار بجانب الأول.', en: 'The outlined button beside the first.' },
            }),
          ],
        },
        buttonLinkField('demoLink', { ar: 'وجهة الزر الأول', en: 'First button goes to' }, {
          description: {
            ar: 'نموذج طلب العرض في الصفحة الرئيسية: ‎/#demo في العربية و‎/en#demo في الإنجليزية.',
            en: 'The demo request form on the home page: /#demo in Arabic and /en#demo in English.',
          },
        }),
        buttonLinkField('whatsappLink', { ar: 'وجهة الزر الثاني', en: 'Second button goes to' }, {
          optional: true,
          description: {
            ar: 'اتركه فارغاً ليفتح رقم واتساب الموقع من «إعدادات الموقع»، أو اكتب رابطاً آخر مثل رابط حملة. رابط خارج الموقع يُفتح في نافذة جديدة.',
            en: 'Leave it empty to open the site’s WhatsApp number from Site settings, or write another link, such as a campaign’s. A link away from the site opens in a new tab.',
          },
        }),
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
          labels: { singular: { ar: 'حالة', en: 'Status' }, plural: { ar: 'حالات المستند', en: 'The document’s statuses' } },
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
      ],
    }),
    sectionTab({
      name: 'trustStrip',
      label: { ar: 'شريط الثقة', en: 'Trust strip' },
      hideable: true,
      description: {
        ar: 'شعارات الجهات التي تعمل على ربائد، وهي نفسها في كل صفحة. هنا يُختار ظهوره في هذه الصفحة فقط.',
        en: 'The marks of the companies working on Rabaed, the same on every page. Here you choose only whether it shows on this page.',
      },
      fields: [],
    }),
    sectionTab({
      name: 'truth',
      label: { ar: '01 الحقيقة كما هي', en: '01 Here’s the truth' },
      hideable: true,
      description: {
        ar: 'صورة طلب اعتماد ورقي حقيقي، وعليها ثلاث ملاحظات حمراء.',
        en: 'A photo of a real paper submittal, with three red notes on it.',
      },
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 80),
        wordsField('body', LEAD, 400, { multiline: true }),
        pictureField({
          name: 'photo',
          label: { ar: 'صورة الورقة', en: 'Photo of the paper' },
          size: PAPER,
          required: false,
          description: {
            ar: `بمقاس ${PAPER.width}×${PAPER.height} أو أكبر بالنسبة نفسها، والأسماء والأختام مخفية فيها. الملاحظات الحمراء ودوائرها مرسومة في أماكن ثابتة فوق الورقة الحالية، فالبديل يكون الورقة نفسها بالإطار نفسه. احذفها لتعود الصورة الحالية.`,
            en: `${PAPER.width}×${PAPER.height}, or larger in the same proportions, with names and stamps hidden. The red notes and their circles sit at fixed places over today’s sheet, so a replacement should be the same sheet, framed the same way. Remove it to bring back today’s photo.`,
          },
        }),
        wordsField('caption', { ar: 'السطر تحت الصورة', en: 'Line under the photo' }, 170),
        {
          type: 'row',
          fields: [
            wordsField('noteRevision', { ar: 'الملاحظة الأولى، عند رقم الإصدار', en: 'First note, at the revision number' }, 50),
            wordsField('noteComments', { ar: 'الملاحظة الثانية، عند الملاحظات المكتوبة', en: 'Second note, at the handwritten comments' }, 50),
            wordsField('noteWho', { ar: 'الملاحظة الثالثة، عند التوقيعات', en: 'Third note, at the signatures' }, 50),
          ],
        },
      ],
    }),
    sectionTab({
      name: 'numbers',
      label: { ar: '02 الموقع الحقيقي', en: '02 The real site' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 80),
        listField({
          name: 'figures',
          labels: { singular: { ar: 'رقم', en: 'Figure' }, plural: { ar: 'الأرقام', en: 'Figures' } },
          rows: { min: 3, max: 3 },
          description: {
            ar: 'ثلاثة دائماً، جنباً إلى جنب. يعدّ الرقم صعوداً حين يصل إليه الزائر.',
            en: 'Always three, side by side. Each counts up as the visitor reaches it.',
          },
          fields: [
            latinField('figure', { ar: 'الرقم، مثل 35%', en: 'Figure, like 35%' }, 6),
            wordsField('label', { ar: 'ما يعنيه الرقم', en: 'What it means' }, 120),
          ],
        }),
        wordsField('source', { ar: 'مصدر الأرقام، تحتها', en: 'Where the figures come from, under them' }, 80),
      ],
    }),
    sectionTab({
      name: 'trap',
      label: { ar: '03 الفخ', en: '03 The trap' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('title', HEADING, 90),
        wordsField('body', LEAD, 240, { multiline: true }),
        wordsField('kicker', { ar: 'الجملة البارزة تحت الفقرة', en: 'The line set off under the paragraph' }, 170),
        listField({
          name: 'tools',
          labels: { singular: { ar: 'أداة', en: 'Tool' }, plural: { ar: 'الأدوات', en: 'Tools' } },
          rows: { min: 4, max: 4 },
          description: {
            ar: 'أربع دائماً، وأيقونة كل بطاقة ثابتة بمكانها: واتساب، ثم البريد، ثم إكسل، ثم مجلد SharePoint.',
            en: 'Always four, and each card’s icon is fixed by its place: WhatsApp, then email, then Excel, then a SharePoint folder.',
          },
          fields: [
            wordsField('name', { ar: 'اسم الأداة', en: 'Tool' }, 34),
            wordsField('text', { ar: 'ما مشكلتها', en: 'What goes wrong with it' }, 120),
          ],
        }),
      ],
    }),
    sectionTab({
      name: 'about',
      label: { ar: '04 من نحن', en: '04 Who we are' },
      hideable: true,
      fields: [
        EYEBROW,
        wordsField('title', { ar: 'السطر الأول من العنوان', en: 'Heading, first line' }, 60),
        wordsField('titleAccent', { ar: 'السطر الملوّن تحته', en: 'Line in colour under it' }, 60),
        wordsField('body', LEAD, 300, { multiline: true }),
        wordsField('quote', { ar: 'الاقتباس', en: 'Quote' }, 120),
      ],
    }),
    searchTab(),
  ],
});
