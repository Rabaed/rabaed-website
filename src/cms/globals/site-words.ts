import { addressField, listField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The words every page shares (ticket 59): the header's menu, the footer's
 * lines, and the page a visitor reaches when an address matches nothing.
 *
 * One entry rather than three, because the three are published together and in
 * one language: the header and footer are Arabic, and English pages have
 * neither until ticket 40 builds them. The spec's Content model names
 * navigation and footer as separate globals; they are tabs of this one, which
 * gives an Editor the same two places to edit without a second set of tables
 * and a second publish to remember.
 */

/**
 * A menu label, and how many links the menu holds.
 *
 * Measured at 981px, the narrowest width that draws the menu as a row rather
 * than the panel, with every word at its longest and the case studies link
 * showing: four links and the Partnerships word beside them, at eleven
 * characters each, fill the row between the wordmark and the two buttons. A
 * twelfth character, or a fifth link, pushes the row past the header's edge —
 * at eight characters a fifth link would fit, which is shorter than the words
 * the site has.
 *
 * **The header is full at the words it launched with**: «قصص العملاء» is
 * eleven characters, the sign-in link twelve and the demo button fifteen. An
 * Editor rewords the menu within the room the design gives it rather than
 * adding to it, and the limits here are what that room measures.
 * `tests/e2e/site-words.spec.ts` fills the menu to these numbers and measures
 * the row.
 */
const MENU_LABEL = 11;
const MENU_LINKS = 4;
const SIGN_IN_LABEL = 12;
const DEMO_LABEL = 15;

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
      // characters, the rights line 26, and the longest link label 15.
      fields: [
        wordsField('tagline', { ar: 'السطر تحت الشعار', en: 'Line under the logo' }, 70),
        listField({
          name: 'legalLinks',
          labels: {
            singular: { ar: 'رابط', en: 'Link' },
            plural: { ar: 'روابط الشروط والخصوصية', en: 'Terms and privacy links' },
          },
          rows: { min: 1, max: 4 },
          fields: [
            wordsField('label', { ar: 'الكلمة', en: 'Label' }, 30),
            addressField('path', { ar: 'الوجهة', en: 'Goes to' }),
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
  ],
});
