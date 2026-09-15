/**
 * The start page's words as the site carried them before the CMS (tickets 13
 * and 52), as they become the start page's first published version in the CMS
 * (ticket 53).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: the start page's words are edited and published in the CMS.
 * Changing a word here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/start.html`.** The steps' numbers are not
 * here: a step is numbered by its place, so reordering renumbers it. Where each
 * button and link leads is not here either: that stays in code.
 */
export const START_PAGE_WORDS = {
  hero: {
    eyebrow: 'ابدأ',
    title: 'كيف نبدأ معك — وكل ما قد تسأل عنه.',
    lead: 'ثلاث خطوات حتى التشغيل، وإجابات صريحة عن الاشتراك والضمان والنماذج والسجل بعد نهاية المشروع.',
    primaryLabel: 'احجز عرضاً حياً',
    secondaryLabel: 'الأسئلة الشائعة ↓',
  },
  trustStrip: { shows: true },
  steps: {
    shows: true,
    eyebrow: 'كيف نبدأ معك',
    heading: 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
    steps: [
      {
        label: 'إعداد',
        title: 'المشروع، الأطراف، النماذج',
        text: 'فريقنا يُعدّ المشروع ويدعو المالك والاستشاري والمقاول، ويجلس مع كل فريق 15 دقيقة.',
        markedOut: false,
      },
      {
        label: 'تشغيل',
        title: 'أقل من يوم — دون توقف للعمل',
        text: 'يبدأ الجميع من حيث وصل المشروع. لا تدريب، ولا فترة انتقالية.',
        markedOut: false,
      },
      {
        label: 'ضمان',
        title: '60 يوماً — أو نعيد المبلغ',
        text: 'شغّلوها على مشروع حقيقي. إن قررتم التوقف خلال 60 يوماً من التفعيل، نعيد كامل المبلغ.',
        // The guarantee.
        markedOut: true,
      },
    ],
  },
  questions: {
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل أن تسأل',
  },
  freeTool: {
    shows: true,
    eyebrow: 'أداة مجانية',
    heading: 'سجل صبّات الخرسانة ونتائج التكسير',
    text: 'أداة مستقلة تعمل بلا حساب وبلا إنترنت — للمهندس في الموقع. من فريق ربائد.',
    linkLabel: 'تحميل الأداة',
  },
} as const;
