/**
 * The answer-first copy pass, proposed (ticket 35).
 *
 * `reference/HANDOFF.md` §6.4 asks that the first paragraph under every major
 * heading be a standalone answer an engine can lift and quote, and says who
 * the words belong to: «هذا تعديل نصّي لا يمسّ التصميم — راجعه مع أحمد، النصّ
 * نصّه». So these are **proposed, not published**: the migration beside this
 * writes them into the CMS as drafts, and no visitor reads one until the
 * founder has read it and pressed Publish.
 *
 * **Frozen.** This is data for that migration, and a migration must do the
 * same thing on every database it ever runs on. Changing a word here changes
 * nothing anyone sees, and nothing already proposed.
 *
 * **Nothing here is new knowledge.** Every claim is one the site already
 * makes — the pages as the CMS holds them (tickets 53–58), the 31 answers as
 * ticket 22 imported them, and `reference/site/`. No figure, percentage,
 * client count or testimonial is introduced, and none of the four proof
 * figures nobody can yet source (ticket 47) is quoted. What changes is where
 * the subject of a sentence sits, not what the site claims.
 */
import type { FaqPageKey } from '../../cms/faq-pages';

/**
 * The opening paragraph of each of the four sections HANDOFF §6.4 names, in
 * the order a reader meets them: `#jt` and `#record` on the home page,
 * `#roles` and `#inner` on the product page.
 *
 * Two of the four had no paragraph at all — the Reference site opens both on
 * their tabs — so those two are written rather than rewritten, in the field
 * ticket 35 gave them. The other two are today's paragraph with its subject
 * named: «ليست ميزة تُفعَّل» cannot be quoted alone, because nothing in it says
 * what «it» is.
 *
 * Each is 30 to 60 words, which is the rule the CMS now holds these four
 * fields to (`src/cms/answer-first.ts`).
 */
export const SECTION_OPENERS = {
  /** «أربع وحدات. سجل واحد يجمعها.» — new, built from the tabs' own names. */
  homeFourUnits:
    'ربائد أربع وحدات تعمل على سجل واحد: المراسلات الرسمية، والاعتمادات والطلبات، والتقرير اليومي للموقع، والمستندات والإصدارات. كل وحدة تخدم عمل المالك والاستشاري والمقاول في موضعه، ومخرجها واحد: السجل الموثّق — كل طلب واعتماد مؤرخ باسم من قام به.',
  /** «لا نسأل "من اعتمد؟" نفتح المعاملة.» — today's paragraph, with its subject named. */
  homeRecord:
    'السجل الموثّق في ربائد ليس ميزة تُفعَّل، بل نتيجة كل خطوة: أي معاملة تمر في المنصة تحمل سجلها كاملاً — خطاب رسمي، اعتماد مادة، طلب تسليم أعمال، تحديث على الجدول الزمني، أو مستخلص مالي. وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.',
  /** «ماذا يرى كل طرف حين يفتح المنصة؟» — new: the answer its three tabs give, in one paragraph. */
  productRoles:
    'يفتح كل طرف في ربائد ما يخصّ عمله من السجل نفسه: المالك لوحة واحدة لكل مشاريعه وما ينتظر اعتماده، والاستشاري قائمة واحدة بطلبات المقاول وحالاتها، والمقاول طلباً واحداً يعرف من استلمه ومتى. ولكل جهة صلاحياتها، ونماذج عربية بالمعايير السعودية.',
  /** «ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟» — today's paragraph, naming the three parties. */
  productInnerCycle:
    'لكل جهة في ربائد — المقاول والاستشاري والمالك — دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً، لا يراها الطرفان الآخران إطلاقاً: لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر رسمياً هو المعاملة وحدها، بتاريخها ومن أرسلها.',
} as const;

export type FaqRewrite = {
  readonly page: FaqPageKey;
  /** The question as ticket 22 imported it, which is how the answer to rewrite is found. */
  readonly question: string;
  readonly answer: string;
};

/** A question the home page and the start page both ask, as ticket 22 imported it twice. */
const SHARED = ['home', 'start'] as const;

type ProposedAnswer = readonly [pages: readonly FaqPageKey[], question: string, answer: string];

/**
 * Every one of the 31 answers, rewritten to stand alone.
 *
 * An FAQ answer is quoted without its question — so «لا.» and «نعم.» and «أيام
 * لا شهور.» say nothing once lifted, and «الاشتراك سنوي لكل مشروع» does not say
 * whose subscription. Each answer below names its own subject in its first
 * clause and then says exactly what today's says.
 *
 * **Nothing is padded to a length.** The 30-to-60-word rule is for the
 * paragraph under a heading; an answer is as long as its answer, and HANDOFF
 * §6.9 warns against filling one out — «لا تحشُ كلمات مفتاحية». Six of the 31
 * were already 30 words or more and none of them grew for it.
 */
const PROPOSED_ANSWERS: readonly ProposedAnswer[] = [
  // The home page's «قبل أن تسأل», which is the start page's first three.
  [
    SHARED,
    'كيف يعمل الاشتراك؟',
    'الاشتراك في ربائد سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.',
  ],
  [
    SHARED,
    'وإن لم يناسبنا بعد التشغيل؟',
    'ضمان ربائد 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.',
  ],
  [
    SHARED,
    'كم يحتاج التشغيل؟',
    'تشغيل ربائد على مشروع يحتاج أياماً لا شهوراً: فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.',
  ],
  // The start page's own.
  [
    ['start'],
    'هل النماذج سعودية؟',
    'نعم، نماذج ربائد سعودية: طلبات تسليم الأعمال WIR، وفحص المواد MIR، وعدم المطابقة NCR، والاعتمادات والخطابات — بالعربية وبالصيغ المتعارف عليها في مشاريعنا، وتُخصَّص لكل مشروع.',
  ],
  [
    ['start'],
    'مشروعنا قائم منذ سنة — ينفع؟',
    'نعم، يمكن تشغيل ربائد على مشروع قائم منذ سنة: نبدأ من حيث وصلتم — تُرفع المستندات المعتمدة الحالية، وتبدأ الطلبات الجديدة من اليوم الأول على المنصة.',
  ],
  [
    ['start'],
    'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟',
    'سجل مشروعك في ربائد ملكك بعد نهاية المشروع أو الاشتراك. تختار إما استمرار الوصول إليه باشتراك سنوي رمزي يُحسب حسب حجم البيانات عند نهاية المشروع، أو استلام نسخة كاملة منه على قرص خارجي.',
  ],
  [
    ['start'],
    'هل يدعم الإنجليزية للفرق غير العربية؟',
    'نعم، تدعم ربائد الإنجليزية للفرق غير العربية: الواجهة عربية أولاً، وتتوفر بالإنجليزية للمهندسين غير الناطقين بالعربية في نفس المشروع.',
  ],
  // The tool page's «قبل أن تحمّل». Not one of the six named the Pour Tracker.
  [
    ['tool'],
    'هل هي مجانية فعلاً؟',
    'نعم، متتبّع الصبّات مجاني فعلاً: نسخة كاملة تعمل لمشروع واحد، بلا حد زمني ولا نسخة تجريبية ولا علامة مائية على الطباعة. نحن نصنع نسخة سحابية مدفوعة للفرق التي تدير عدة مشاريع، وهذه الأداة هي نصفها الفردي — تعمل وحدها بالكامل.',
  ],
  [
    ['tool'],
    'أين تُحفظ بياناتي بالضبط؟',
    'تُحفظ بيانات متتبّع الصبّات في المجلد الذي تختاره أنت على جهازك: ملف `concrete_db.json` يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد `attachments` يحوي نسخاً من التقارير والصور. لا شيء يُرفع إلى أي خادم — لا يوجد خادم أصلاً.',
  ],
  [
    ['tool'],
    'هل تعمل بدون إنترنت؟',
    'نعم، يعمل متتبّع الصبّات بدون إنترنت بالكامل. الشيء الوحيد الذي يُجلب من الإنترنت هو ملفا الخطوط عند أول فتح. بدون إنترنت يستخدم المتصفح خط النظام، ويبقى كل شيء — الحفظ، المرفقات، الطباعة — يعمل كما هو.',
  ],
  [
    ['tool'],
    'كم مشروعاً تدعم؟',
    'يدعم متتبّع الصبّات مشروعاً واحداً في كل مجلد: مجلد واحد = مشروع واحد. تقدر تفتح مجلداً آخر لمشروع آخر، لكن كل مجلد مستقل بذاته. لو تحتاج كل مشاريعك في لوحة واحدة مع مقارنة بينها، هذا ما تفعله النسخة السحابية.',
  ],
  [
    ['tool'],
    'هل أقدر أشاركها مع فريقي؟',
    'ملف متتبّع الصبّات نفسه تشاركه كما تشاء — أرسله لمن تشاء، لا يوجد ترخيص ولا مفتاح تفعيل. لكن انتبه: كل نسخة تعمل على مجلدها الخاص، فلا يوجد سجل مشترك بين شخصين ولا اعتماد إلكتروني من الاستشاري. المشاركة الحقيقية هي ما تضيفه النسخة السحابية.',
  ],
  [
    ['tool'],
    'ما الفرق بينها وبين النسخة السحابية؟',
    'النسخة المجانية من متتبّع الصبّات تحل مشكلة المهندس الفرد على مشروع واحد. النسخة السحابية تحل مشكلة الشركة: كل المشاريع في لوحة واحدة، اعتماد إلكتروني فوري من الاستشاري، حساب للمختبر يرفع تقريره بنفسه، ربط مع بقية منصة ربائد (إدارة الوثائق والتقارير اليومية والمراسلات)، وسجل تدقيق موثّق.',
  ],
  // The referral page's «قبل أن تسجّل».
  [
    ['referral'],
    'هل أحتاج سجلاً تجارياً؟',
    'لا يشترط برنامج الإحالة من ربائد سجلاً تجارياً: البرنامج مفتوح للأفراد، ويكفي أن تسجّل بياناتك وترفع شهادة الآيبان. وإن كان لديك سجل تجاري وشهادة تسجيل ضريبي، يمكنك إرفاقهما اختيارياً.',
  ],
  [
    ['referral'],
    'متى بالضبط أستلم المبلغ؟',
    'تُصرف مكافأة الإحالة عند تحصيل قيمة الاشتراك من العميل، خلال 7 أيام عمل من نهاية ذلك الشهر.',
  ],
  [
    ['referral'],
    'هل أحتاج أن أبيع أو أتابع العميل؟',
    'لا يطلب منك برنامج الإحالة بيعاً ولا متابعة للعميل: دورك ينتهي عند مشاركة الكود، وفريق ربائد يتولّى العرض والتفاوض والتعاقد والتفعيل.',
  ],
  [
    ['referral'],
    'عميلي عنده أكثر من مشروع — كيف تُحتسب؟',
    'تُحتسب الإحالة بالمشروع لا بالعميل: إن استُخدم كودك عند بدء مشروع ثانٍ، تُحتسب إحالة جديدة بـ {payout} ريال أخرى.',
  ],
  [
    ['referral'],
    'ماذا لو استخدم شخصان كودين مختلفين لنفس المشروع؟',
    'إذا وصل كودان مختلفان لمشروع واحد، يُعتمد كود الإحالة الذي وصلنا أولاً مع طلب العرض التوضيحي.',
  ],
  [
    ['referral'],
    'هل هناك حد أقصى للمبالغ؟',
    'لا حد أقصى للمبالغ في برنامج الإحالة من ربائد: لا على عدد المشاريع التي تُحيلها، ولا على إجمالي ما تستلمه.',
  ],
  [
    ['referral'],
    'هل أستطيع نشر كودي على حساباتي؟',
    'كود الإحالة شخصي ومخصص لمشاركته مباشرة مع من تعرفه، فنشره على حساباتك كإعلان عام للخصم غير مسموح، ويحق لنا إيقاف الكود في هذه الحالة.',
  ],
  [
    ['referral'],
    'كم يستغرق الأمر من مشاركة الكود حتى الاستحقاق؟',
    'تستغرق المدة من مشاركة كود الإحالة حتى الاستحقاق بين ثلاثة وثمانية أسابيع من أول عرض توضيحي في المتوسط، وتعتمد على المطوّر ودورة قراره.',
  ],
  [
    ['referral'],
    'أعمل لدى جهة قد يُعدّ هذا تعارضاً معها — ماذا أفعل؟',
    'مسؤوليتك أن تتأكد من عدم وجود ما يمنعك من قبول مقابل الإحالة من جهة عملك، وهذا ما يغطّيه الإقرار الذي توقّعه عند التسجيل في برنامج الإحالة.',
  ],
  // The partnership page's «قبل الاجتماع الأول».
  [
    ['partnership'],
    'كم تكلفة الشراكة؟',
    'لا توجد رسوم انضمام لبرنامج الشراكات من ربائد. أما تسعير المنصة للشريك فيُحدَّد في اجتماع تصميم النموذج، لأنه يختلف باختلاف النمط وحجم المحفظة.',
  ],
  [
    ['partnership'],
    'هل تتعاملون مباشرة مع عملائي؟',
    'تعامُل ربائد مع عملائك يعتمد على نمط الشراكة: في نمط التضمين تبقى العلاقة التعاقدية معك بالكامل، ونتعامل نحن مع فريق المشروع فنياً فقط.',
  ],
  [
    ['partnership'],
    'ماذا يحدث للمشروع إذا انتهت علاقتي بالعميل في منتصفه؟',
    'انتهاء علاقتك بالعميل في منتصف المشروع إحدى النقاط التي تُعالَج صراحةً في اتفاقية الشراكة، بما يضمن استمرار المشروع دون انقطاع وحفظ حقوق الطرفين.',
  ],
  [
    ['partnership'],
    'هل هناك حد أدنى من المشاريع للانضمام؟',
    'لا حد أدنى معلن لعدد المشاريع للانضمام إلى برنامج الشراكات. لكن الأنماط تختلف بحسب حجم المحفظة، وسنقترح عليك الأنسب بعد الاجتماع الأول.',
  ],
  [
    ['partnership'],
    'هل يمكن الجمع بين أكثر من نمط؟',
    'نعم، يمكن الجمع بين أكثر من نمط شراكة: بعض الشركاء يبدأون بالترشيح المعتمد وينتقلون إلى التضمين بعد أول مشروعين.',
  ],
  [
    ['partnership'],
    'نحن مكتب صغير — هل البرنامج لنا؟',
    'نعم، برنامج الشراكات مفتوح للمكاتب الصغيرة: المشاريع المتوسطة هي تركيز ربائد، والمكاتب المتوسطة والصغيرة هي شريحتنا الأساسية.',
  ],
];

/** One rewrite per entry there is: the questions shared by two pages become one for each. */
export const FAQ_REWRITES: readonly FaqRewrite[] = PROPOSED_ANSWERS.flatMap(([pages, question, answer]) =>
  pages.map((page): FaqRewrite => ({ page, question, answer })),
);

/**
 * The comparison questions, which the site does not ask (ticket 35).
 *
 * HANDOFF §6.5 breaks a buyer's one question into seven kinds and finds a
 * whole kind missing: «فئة «المقارنة» هي الأضعف حالياً وهي الأكثر طلباً في
 * محركات التوليد» — Rabaed against WhatsApp, email and the spreadsheet. Ticket
 * 38 answered it once, as a launch article; these answer it where a buyer
 * asks it, among the questions under the page.
 *
 * Every line of every answer is drawn from the home page's own «قبل وبعد
 * ربائد» and «مواقف من الميدان», which compare exactly these three against
 * Rabaed step by step. None of it is a new claim.
 */
export const COMPARISON_QUESTIONS: readonly FaqRewrite[] = [
  // On both lists, as the three questions the home and start pages share are.
  ...SHARED.map(
    (page): FaqRewrite => ({
      page,
      question: 'ما الفرق بين ربائد وواتساب والبريد الإلكتروني والإكسل؟',
      answer:
        'واتساب والبريد الإلكتروني والإكسل تنقل الرسائل ولا تُنشئ سجلاً: الطلب يصير محادثة، والاعتماد يُدفن في ثريد لا أحد يجده، والملف يُنسخ فيصير لنفس المستند تاريخان. في ربائد للطلب رقم مرجعي وإشعار استلام بالاسم والوقت، والاعتماد وملاحظاته داخل المستند نفسه، والنسخة المعتمدة واحدة.',
    }),
  ),
  {
    page: 'start',
    question: 'عندنا مجموعة واتساب للمشروع — لماذا ننتقل إلى ربائد؟',
    answer:
      'مجموعة واتساب تُوصل الرسالة ولا تُثبت شيئاً: لا رقم مرجعي للطلب، ولا إشعار استلام باسم ووقت، ولا حدود اطلاع تمنع طرفاً من قراءة مراسلات طرف آخر. ربائد تحفظ الطلب والاعتماد في سجل واحد يراه المالك والاستشاري والمقاول، كلٌّ في حدود صلاحيته.',
  },
  {
    page: 'start',
    question: 'ندير المشروع بملفات إكسل ومجلد مشترك — ما الذي يتغيّر؟',
    answer:
      'ملف الإكسل والمجلد المشترك يحفظان النسخ لا الإجراء: تاريخان لنفس المستند، ورقم قديم في الداشبورد لأن أحداً لم يفرغ لتحديثه، وصلاحيات تُقفل بعد نهاية المشروع. في ربائد للمستند إصدار واحد معتمد، وكل طلب واعتماد موثّق ومؤرخ باسم من قام به، والسجل يبقى بعد نهاية المشروع.',
  },
];
