/**
 * The questions and answers on the site's pages, grouped by the page they
 * appear on — the grouping ticket 22 keeps when it moves them into the CMS.
 * Tickets 13–16 add their pages' lists here until then.
 *
 * Each answer is drawn in a native disclosure element, so its text is in the
 * page whether or not the visitor has opened it. That is what lets search
 * engines and AI assistants read the answers, and what ticket 32's FAQ
 * structured data will be generated from, word for word.
 *
 * Verbatim from `reference/site/`.
 */

export type FaqEntry = {
  readonly question: string;
  readonly answer: string;
};

/** The home page's «قبل أن تسأل» section. The full set is on the start page. */
export const HOME_FAQ: readonly FaqEntry[] = [
  {
    question: 'كيف يعمل الاشتراك؟',
    answer:
      'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.',
  },
  {
    question: 'وإن لم يناسبنا بعد التشغيل؟',
    answer:
      'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.',
  },
  {
    question: 'كم يحتاج التشغيل؟',
    answer: 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.',
  },
];
