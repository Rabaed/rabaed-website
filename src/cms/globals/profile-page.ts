import { buttonLinkField, listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { searchTab } from '../search-fields';
import { MARKETING_PAGES } from '../../lib/page-registry';

/**
 * The Company profile's words, section by section, in the page's order
 * (ticket 102): the home page's hero with Ahmed's words, and the shared Trust
 * strip, which here only shows or hides. The sections after them are tickets
 * 105–109's.
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
    // Section 05, «التكلفة الخفية» (ticket 106): the shared calculator, its
    // words its own entry's, so the two pages cannot disagree (ADR-0029). Here
    // the page chooses whether it shows, and its button's words and link, as
    // every button on this page has its own — for a campaign, without
    // touching the home page's. Words left empty are the shared entry's.
    sectionTab({
      name: 'cost',
      label: { ar: 'حاسبة تكلفة التأخير', en: 'Delay-cost calculator' },
      hideable: true,
      description: {
        ar: 'حاسبة الصفحة الرئيسية نفسها، بكلماتها من «حاسبة تكلفة التأخير» بجانب إعدادات الموقع، فتتفق الصفحتان. هنا يُختار ظهورها في هذه الصفحة فقط، وزرّها.',
        en: 'The home page’s own calculator, in its words from “Delay-cost calculator” beside the site settings, so the two pages agree. Here you choose only whether it shows on this page, and its button.',
      },
      fields: [
        wordsField('callToActionLabel', { ar: 'الزر', en: 'Button' }, 40, {
          optional: true,
          description: {
            ar: 'اتركه فارغاً ليقول ما يقوله زر الحاسبة في الصفحة الرئيسية، من «حاسبة تكلفة التأخير». ما تكتبه هنا يظهر في هذه الصفحة وحدها.',
            en: 'Leave it empty to say what the calculator’s button says on the home page, from “Delay-cost calculator”. What you write here shows on this page alone.',
          },
        }),
        buttonLinkField('callToActionLink', { ar: 'وجهة الزر', en: 'Button goes to' }, {
          description: {
            ar: 'نموذج طلب العرض في الصفحة الرئيسية: ‎/#demo في العربية و‎/en#demo في الإنجليزية. رابط خارج الموقع يُفتح في نافذة جديدة.',
            en: 'The demo request form on the home page: /#demo in Arabic and /en#demo in English. A link away from the site opens in a new tab.',
          },
        }),
      ],
    }),
    searchTab(),
  ],
});
