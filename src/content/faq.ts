/**
 * The questions and answers on the site's pages, grouped by the page they
 * appear on — the grouping ticket 22 keeps when it moves them into the CMS.
 * Tickets 15 and 16 add their pages' lists here until then.
 *
 * Each answer is drawn in a native disclosure element, so its text is in the
 * page whether or not the visitor has opened it. That is what lets search
 * engines and AI assistants read the answers, and what ticket 32's FAQ
 * structured data will be generated from, word for word.
 *
 * Verbatim from `reference/site/`.
 */

/**
 * Latin text inside an Arabic answer — a file name — which is set left to
 * right, in DM Mono, so its dots and underscores stay where they belong.
 */
export type LatinText = { readonly latin: string };

export type FaqEntry = {
  readonly question: string;
  /** Plain text, or text with Latin names inside it. */
  readonly answer: string | readonly (string | LatinText)[];
};

/** The start page's «قبل أن تسأل»: the full set, which the home page links to. */
export const START_FAQ: readonly FaqEntry[] = [
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
  {
    question: 'هل النماذج سعودية؟',
    answer:
      'نعم. طلبات تسليم الأعمال WIR وفحص المواد MIR وعدم المطابقة NCR والاعتمادات والخطابات — بالعربية وبالصيغ المتعارف عليها في مشاريعنا، وتُخصَّص لكل مشروع.',
  },
  {
    question: 'مشروعنا قائم منذ سنة — ينفع؟',
    answer: 'نعم. نبدأ من حيث وصلتم: تُرفع المستندات المعتمدة الحالية، وتبدأ الطلبات الجديدة من اليوم الأول على المنصة.',
  },
  {
    question: 'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟',
    answer:
      'السجل ملكك. تختار إما استمرار الوصول إليه باشتراك سنوي رمزي يُحسب حسب حجم البيانات عند نهاية المشروع، أو استلام نسخة كاملة منه على قرص خارجي.',
  },
  {
    question: 'هل يدعم الإنجليزية للفرق غير العربية؟',
    answer: 'نعم. الواجهة عربية أولاً، وتتوفر بالإنجليزية للمهندسين غير الناطقين بالعربية في نفس المشروع.',
  },
];

/** The tool page's «قبل أن تحمّل». */
export const TOOL_FAQ: readonly FaqEntry[] = [
  {
    question: 'هل هي مجانية فعلاً؟',
    answer:
      'نعم. نسخة كاملة تعمل لمشروع واحد، بلا حد زمني ولا نسخة تجريبية ولا علامة مائية على الطباعة. نحن نصنع نسخة سحابية مدفوعة للفرق التي تدير عدة مشاريع، وهذه الأداة هي نصفها الفردي — تعمل وحدها بالكامل.',
  },
  {
    question: 'أين تُحفظ بياناتي بالضبط؟',
    answer: [
      'في المجلد الذي تختاره أنت على جهازك: ملف ',
      { latin: 'concrete_db.json' },
      ' يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد ',
      { latin: 'attachments' },
      ' يحوي نسخاً من التقارير والصور. لا شيء يُرفع إلى أي خادم — لا يوجد خادم أصلاً.',
    ],
  },
  {
    question: 'هل تعمل بدون إنترنت؟',
    answer:
      'نعم، بالكامل. الشيء الوحيد الذي يُجلب من الإنترنت هو ملفا الخطوط عند أول فتح. بدون إنترنت يستخدم المتصفح خط النظام، ويبقى كل شيء — الحفظ، المرفقات، الطباعة — يعمل كما هو.',
  },
  {
    question: 'كم مشروعاً تدعم؟',
    answer:
      'مجلد واحد = مشروع واحد. تقدر تفتح مجلداً آخر لمشروع آخر، لكن كل مجلد مستقل بذاته. لو تحتاج كل مشاريعك في لوحة واحدة مع مقارنة بينها، هذا ما تفعله النسخة السحابية.',
  },
  {
    question: 'هل أقدر أشاركها مع فريقي؟',
    answer:
      'الملف نفسه نعم — أرسله لمن تشاء، لا يوجد ترخيص ولا مفتاح تفعيل. لكن انتبه: كل نسخة تعمل على مجلدها الخاص، فلا يوجد سجل مشترك بين شخصين ولا اعتماد إلكتروني من الاستشاري. المشاركة الحقيقية هي ما تضيفه النسخة السحابية.',
  },
  {
    question: 'ما الفرق بينها وبين النسخة السحابية؟',
    answer:
      'النسخة المجانية تحل مشكلة المهندس الفرد على مشروع واحد. النسخة السحابية تحل مشكلة الشركة: كل المشاريع في لوحة واحدة، اعتماد إلكتروني فوري من الاستشاري، حساب للمختبر يرفع تقريره بنفسه، ربط مع بقية منصة ربائد (إدارة الوثائق والتقارير اليومية والمراسلات)، وسجل تدقيق موثّق.',
  },
];

/**
 * The home page's «قبل أن تسأل» section. The Reference site words these three
 * as the start page's first three, but each page's list is its own: the home
 * page's does not change when the start page's is reordered.
 */
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
