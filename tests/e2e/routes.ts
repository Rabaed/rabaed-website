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
 * Scope).
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
    alternates: { ar: '/product', en: '/en/product' },
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
    alternates: { ar: '/start', en: '/en/start' },
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
