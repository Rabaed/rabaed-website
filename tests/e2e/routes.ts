/**
 * Every route the site serves, with a phrase from each that must survive the
 * trip to the browser. Later tickets add pages here; the suites that iterate
 * over this list then cover them without being edited.
 *
 * The phrases are real page copy, not test fixtures, because the thing being
 * proved is that *this* content reaches a client with no JavaScript.
 *
 * `locale` and `dir` are restated here rather than imported from
 * `src/lib/locales.ts` on purpose: a test that reads its expectation out of
 * the code it is testing agrees with that code by construction, and would keep
 * agreeing after somebody swapped the two directions over. `alternates` is
 * restated for the same reason — the address the page declares for itself in
 * each locale it exists in, and no other. The legal pages exist in Arabic
 * alone: the Arabic is binding, and they are never translated (spec: Out of
 * Scope). The product, start, tool, referral and partnership pages exist in
 * Arabic alone until ticket 42 writes their English, which adds their English
 * addresses here. Until then their English address is a notice, not a page of
 * the site's, and `localisation.spec.ts` holds it apart (ticket 40).
 */
export const ROUTES = [
  {
    path: '/',
    locale: 'ar',
    dir: 'rtl',
    text: ['ثلاثة أطراف', 'المالك والاستشاري والمقاول'],
    alternates: { ar: '/', en: '/en' },
  },
  {
    path: '/en',
    locale: 'en',
    dir: 'ltr',
    text: ['Rabaed', 'The English site is on its way'],
    alternates: { ar: '/', en: '/en' },
  },
  {
    path: '/product',
    locale: 'ar',
    dir: 'rtl',
    // The hero, the last panel of the journey — which a desktop visitor only
    // reaches by scrolling sideways — and the last section before the close.
    text: [
      'وحدات ربائد — وما يراه كل طرف منها.',
      'ليس ميزة تُفعَّل، بل نتيجة كل خطوة.',
      'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟',
    ],
    alternates: { ar: '/product' },
  },
  {
    path: '/start',
    locale: 'ar',
    dir: 'rtl',
    // The hero, the last of the questions, and the free tool teaser at the
    // foot of the page. Answers sit closed, so they are not visible to check
    // here; `start-page.spec.ts` finds every one in the first response.
    text: [
      'كيف نبدأ معك — وكل ما قد تسأل عنه.',
      'هل يدعم الإنجليزية للفرق غير العربية؟',
      'سجل صبّات الخرسانة ونتائج التكسير',
    ],
    alternates: { ar: '/start' },
  },
  {
    path: '/tool',
    locale: 'ar',
    dir: 'rtl',
    // The hero, the download form's heading, and the last line on the page.
    text: [
      'سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر',
      'حمّل الأداة الآن',
      'صُنعت في ربائد لمهندسي المواقع. الأداة مجانية — استخدمها كما تشاء.',
    ],
    alternates: { ar: '/tool' },
  },
  {
    path: '/referral',
    locale: 'ar',
    dir: 'rtl',
    // The hero, the last of the summarised terms, and the signup form at the
    // foot of the page. Answers sit closed; `referral-page.spec.ts` finds every
    // one in the first response.
    text: [
      'أحِل مشروعاً واحداً. اكسب 2,000 ريال.',
      'يُوقَّع إلكترونياً عند التسجيل.',
      'سجّل في برنامج الإحالة',
    ],
    alternates: { ar: '/referral' },
  },
  {
    path: '/partnership',
    locale: 'ar',
    dir: 'rtl',
    // The hero, the last stage of the path, and the application form at the
    // foot of the page. Answers sit closed; `partnership-page.spec.ts` finds
    // every one in the first response.
    text: [
      'منصّة إدارة المشروع… ضمن عرضك أنت',
      'الإطلاق على أول مشروع',
      'خلّنا نجلس ونصمّم النموذج المناسب لمكتبك',
    ],
    alternates: { ar: '/partnership' },
  },
  {
    path: '/blog',
    locale: 'ar',
    dir: 'rtl',
    // The hero. The articles themselves are CMS content that the test database
    // starts without; `blog.spec.ts` publishes some and finds them here.
    text: ['مدونة ربائد'],
    alternates: { ar: '/blog', en: '/en/blog' },
  },
  {
    path: '/en/blog',
    locale: 'en',
    dir: 'ltr',
    text: ['The Rabaed blog'],
    alternates: { ar: '/blog', en: '/en/blog' },
  },
  {
    path: '/terms',
    locale: 'ar',
    dir: 'rtl',
    // One of the three misspellings the approved document carries, which is
    // the phrase most likely to be "corrected" on its way to the browser.
    text: ['شروط الخدمة', 'يحق لبرائد رفض تقديم الخدمة أو استخدام النظام دون إبداء أسباب.'],
    alternates: { ar: '/terms' },
  },
  {
    path: '/privacy',
    locale: 'ar',
    dir: 'rtl',
    text: ['سياسة الخصوصية', 'تحكم سياسة الخصوصية الأسلوب الذي تقوم به'],
    alternates: { ar: '/privacy' },
  },
  {
    path: '/referral-terms',
    locale: 'ar',
    dir: 'rtl',
    text: ['الشروط والأحكام — برنامج الإحالة', '2,000 ريال سعودي صافية عن كل مشروع مُحال'],
    alternates: { ar: '/referral-terms' },
  },
] as const;
