import { addressField, listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The words every page shares (ticket 59): the header's menu, the footer's
 * lines, and the page a visitor reaches when an address matches nothing.
 *
 * One entry rather than three, because the three are published together and in
 * the same languages: the header and footer are drawn on an English page only
 * once all three are published in English (ticket 40). The spec's Content
 * model names navigation and footer as separate globals; they are tabs of this one, which
 * gives an Editor the same two places to edit without a second set of tables
 * and a second publish to remember.
 */

/**
 * A menu label, and how many links the menu holds.
 *
 * Measured at the narrowest width that draws the menu as a row rather than
 * the panel, with every word at its longest and the case studies link
 * showing: four links and the Partnerships word beside them, at eleven
 * characters each, fill the row between the wordmark and the controls at its
 * edge. A twelfth character, or a fifth link, pushes the row past that edge —
 * at eight characters a fifth link would fit, which is shorter than the words
 * the site has.
 *
 * **The header is full at the words it launched with**: «قصص العملاء» is
 * eleven characters, the sign-in link twelve and the demo button fifteen. An
 * Editor rewords the menu within the room the design gives it rather than
 * adding to it, and the limits here are what that room measures.
 * `tests/e2e/site-words.spec.ts` fills the menu to these numbers and measures
 * the row.
 *
 * That narrowest width is **1100px**, and was 981px until ticket 40. The
 * language switcher joined the controls at the row's edge and wanted 57px the
 * row did not have at 981px, and these limits could not pay for it: «قصص
 * العملاء» is already at the eleven, so a lower limit would refuse a word the
 * site ships with. The row gives way to the panel earlier instead
 * (`src/styles/shell.css`, ADR-0015), which is what kept every limit here
 * unchanged.
 */
const MENU_LABEL = 11;
const MENU_LINKS = 4;
const SIGN_IN_LABEL = 12;
const DEMO_LABEL = 15;

/**
 * The Footer directory (ticket 75, ADR-0020): up to four columns of up to six
 * links. Four columns side by side is what the widest footer lays out and a
 * phone sits two by two; six links is two more than the fullest column the
 * site launched with, so a page added later has a place without a column
 * growing into a list nobody reads.
 *
 * A column is a quarter of the footer on a desktop and half of it on a phone,
 * so its words wrap rather than overflow: the heading's limit is about twice
 * «البرامج», and a label's leaves room for «Terms and conditions (Arabic)»,
 * the longest the site has, at 29.
 */
const FOOTER_COLUMNS = 4;
const FOOTER_LINKS = 6;
const FOOTER_HEADING = 20;
const FOOTER_LABEL = 40;

export const SiteWords = pageGlobal({
  slug: 'site-words',
  label: { ar: 'كلمات الموقع المشتركة', en: 'Site-wide words' },
  path: '/',
  group: null,
  sections: [
    sectionTab({
      name: 'header',
      label: { ar: 'الشريط العلوي', en: 'Header' },
      hideable: false,
      description: {
        ar: 'قائمة كل صفحة. رابط «قصص العملاء» لا يظهر قبل نشر أول قصة.',
        en: 'Every page’s menu. The case studies link does not show until the first story is published.',
      },
      fields: [
        listField({
          name: 'links',
          labels: {
            singular: { ar: 'رابط', en: 'Link' },
            plural: { ar: 'روابط القائمة', en: 'Menu links' },
          },
          rows: { min: 1, max: MENU_LINKS },
          description: {
            ar: 'بالترتيب الذي تظهر به. اسحبها لإعادة ترتيبها.',
            en: 'In the order they show. Drag them to reorder.',
          },
          fields: [
            wordsField('label', { ar: 'الكلمة', en: 'Label' }, MENU_LABEL, {
              description: { ar: 'على سطر واحد في الشريط العلوي.', en: 'On one line in the header.' },
            }),
            addressField('path', { ar: 'الوجهة', en: 'Goes to' }),
          ],
        }),
        wordsField('partnershipsLabel', { ar: 'كلمة قائمة الشراكات', en: 'Partnerships menu label' }, MENU_LABEL, {
          description: {
            ar: 'الكلمة التي تفتح القائمة المنسدلة. ليست رابطاً.',
            en: 'The word that opens the dropdown. Not a link itself.',
          },
        }),
        listField({
          name: 'partnerships',
          labels: {
            singular: { ar: 'برنامج', en: 'Programme' },
            plural: { ar: 'القائمة المنسدلة', en: 'Dropdown' },
          },
          // The panel hangs below the header rather than sitting in its row,
          // so it carries longer words than a menu label: about twice the two
          // programmes' own, which are 15 and 38 characters.
          rows: { min: 1, max: 4 },
          fields: [
            wordsField('label', { ar: 'الكلمة', en: 'Label' }, 28),
            wordsField('summary', { ar: 'السطر تحتها', en: 'Line under it' }, 60),
            addressField('path', { ar: 'الوجهة', en: 'Goes to' }),
          ],
        }),
        wordsField('signInLabel', { ar: 'كلمة تسجيل الدخول', en: 'Sign-in label' }, SIGN_IN_LABEL),
        addressField('signInUrl', { ar: 'وجهة تسجيل الدخول', en: 'Sign-in goes to' }, {
          description: {
            ar: 'تطبيق ربائد، وهو نظام آخر خارج هذا الموقع.',
            en: 'The Rabaed app, a separate system outside this site.',
          },
        }),
        wordsField('demoLabel', { ar: 'كلمة زر طلب العرض', en: 'Demo button label' }, DEMO_LABEL, {
          description: {
            ar: 'ينقل إلى نموذج طلب العرض في الصفحة، فوجهته ليست نصاً يُحرَّر.',
            en: 'Lands on the demo form in the page, so where it goes is not an editable address.',
          },
        }),
      ],
    }),
    sectionTab({
      name: 'footer',
      label: { ar: 'التذييل', en: 'Footer' },
      hideable: false,
      description: {
        ar: 'أسفل كل صفحة. أرقام التواصل وحسابات التواصل الاجتماعي في «إعدادات الموقع».',
        en: 'The bottom of every page. Contact numbers and social accounts are in Site settings.',
      },
      // The footer stacks its lines and wraps them, so these are about twice
      // today's words rather than a measured edge: the tagline is 50
      // characters and the rights line 26.
      fields: [
        wordsField('tagline', { ar: 'السطر تحت الشعار', en: 'Line under the logo' }, 70),
        listField({
          name: 'columns',
          labels: {
            singular: { ar: 'عمود', en: 'Column' },
            plural: { ar: 'أعمدة الروابط', en: 'Link columns' },
          },
          rows: { min: 1, max: FOOTER_COLUMNS },
          description: {
            ar: 'روابط أسفل كل صفحة، تصل منها إلى كل صفحة في الموقع. رابط «قصص العملاء» لا يظهر قبل نشر أول قصة بلغة الصفحة.',
            en: 'The links at the foot of every page, through which every page of the site can be reached. The case studies link does not show until the first story is published in the page’s language.',
          },
          fields: [
            wordsField('heading', { ar: 'عنوان العمود', en: 'Column heading' }, FOOTER_HEADING),
            listField({
              name: 'links',
              labels: {
                singular: { ar: 'رابط', en: 'Link' },
                plural: { ar: 'روابط العمود', en: 'Column links' },
              },
              rows: { min: 1, max: FOOTER_LINKS },
              description: {
                ar: 'بالترتيب الذي تظهر به. اسحبها لإعادة ترتيبها.',
                en: 'In the order they show. Drag them to reorder.',
              },
              fields: [
                wordsField('label', { ar: 'الكلمة', en: 'Label' }, FOOTER_LABEL, {
                  description: {
                    ar: 'الشروط والأحكام وسياسة الخصوصية وشروط برنامج الإحالة بالعربية وحدها، وروابطها في الصفحات الإنجليزية تنقل إلى العربية: اذكر ذلك في الكلمة الإنجليزية، مثل (Arabic).',
                    en: 'The terms, the privacy policy and the Referral Terms are in Arabic only, and their links on English pages lead to the Arabic: say so in the English label, as in (Arabic).',
                  },
                }),
                addressField('path', { ar: 'الوجهة', en: 'Goes to' }),
              ],
            }),
          ],
        }),
        wordsField('rights', { ar: 'سطر الحقوق', en: 'Rights line' }, 60, {
          description: {
            ar: 'يظهر بعد علامة © والسنة، وهما في الكود.',
            en: 'Shows after the © mark and the year, which are in the code.',
          },
        }),
      ],
    }),
    sectionTab({
      name: 'notFound',
      label: { ar: 'صفحة غير موجودة', en: 'Not found page' },
      hideable: false,
      description: {
        ar: 'ما يراه زائر كتب عنواناً لا يوجد. بالعربية وحدها: الصفحة لا تعرف لغة العنوان الذي طُلب.',
        en: 'What a visitor sees when an address matches nothing. Arabic only: the page cannot know the language of the address asked for.',
      },
      fields: [
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 40),
        wordsField('lead', { ar: 'السطر تحته', en: 'Line under it' }, 120),
        wordsField('homeLabel', { ar: 'كلمة الرابط للرئيسية', en: 'Home link label' }, 40, {
          description: { ar: 'ينقل إلى الصفحة الرئيسية.', en: 'Leads to the home page.' },
        }),
      ],
    }),
    sectionTab({
      name: 'screenMocks',
      label: { ar: 'صور الشاشات', en: 'Screen mocks' },
      hideable: false,
      description: {
        ar: 'على الهاتف تُعرض من كل شاشة لقطة مقرّبة، ويضغط عليها الزائر ليرى الشاشة كاملة. الشاشة التي استُبدلت صورتها تُعرض كاملة، ويسحبها الزائر جانباً.',
        en: 'On a phone each Screen mock shows a close-up crop, which the visitor taps to see the whole screen. A screen whose picture has been replaced shows whole, and the visitor swipes it sideways.',
      },
      fields: [
        // Ticket 78. Over the foot of the crop, on one line on the narrowest
        // phone, as the swipe hint is: the same room, so the same limit.
        wordsField('openWhole', { ar: 'زر الشاشة كاملة', en: 'Whole screen button' }, 40, {
          description: {
            ar: 'فوق أسفل اللقطة المقرّبة على الهاتف، ويفتح الشاشة كاملة عند الضغط.',
            en: 'Over the foot of the close-up crop on a phone. Tapping it opens the whole screen.',
          },
        }),
        // The two buttons at the top of the opened screen, side by side on the
        // narrowest phone.
        wordsField('closeWhole', { ar: 'زر الإغلاق', en: 'Close button' }, 16, {
          description: {
            ar: 'يغلق الشاشة المفتوحة ويعيد الزائر إلى الصفحة.',
            en: 'Closes the opened screen and returns the visitor to the page.',
          },
        }),
        wordsField('zoomWhole', { ar: 'زر التكبير', en: 'Zoom button' }, 16, {
          description: {
            ar: 'يكبّر الشاشة المفتوحة إلى حجمها الكامل ليسحبها الزائر، ويعيدها عند الضغط مرة أخرى.',
            en: 'Zooms the opened screen to its full size for the visitor to pan across, and back when pressed again.',
          },
        }),
        // Ticket 77. On one line over the foot of the picture, on the narrowest
        // phone: 40 characters is about half as long again as today's words,
        // which are 24 in Arabic and 29 in English.
        wordsField('swipeHint', { ar: 'تلميح السحب', en: 'Swipe hint' }, 40, {
          description: {
            ar: 'فوق أسفل الصورة على الهاتف وحده، ويختفي بعد أول سحبة.',
            en: 'Over the foot of the picture on a phone only, and gone after the first swipe.',
          },
        }),
      ],
    }),
  ],
});
