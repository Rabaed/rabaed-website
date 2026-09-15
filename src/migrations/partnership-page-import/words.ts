/**
 * The partnership page's words as the site carried them before the CMS
 * (tickets 16 and 52), in the shape of its entry, as they become its first
 * published version in the CMS (ticket 55).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: the partnership page's words are edited and published in the
 * CMS. Changing a word here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/partnership.html`**, but for three things the
 * page now draws itself: each card's and stage's number, which is its place;
 * the spaces around a bold phrase and before a link; and where each link
 * leads, which stays in code. The figures' numerals are set in DM Mono by the
 * page, wherever they are written as 0–9.
 */

/** A word in Arabic alone: the English is written when the page is translated (ticket 42). */
const ar = (text: string) => ({ ar: text });
const lines = (texts: string[]) => texts.map((text) => ({ text: ar(text) }));

export const PARTNERSHIP_PAGE_WORDS = {
  hero: {
    eyebrow: ar('برنامج الشراكات'),
    title: ar('منصّة إدارة المشروع… ضمن عرضك أنت'),
    lead: ar(
      'شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع ومجموعات المقاولات — نموذج تعاون يُصمَّم معك، لا باقة جاهزة تُعرض عليك.',
    ),
    primaryLabel: ar('اطلب اجتماع شراكة'),
    secondaryLabel: ar('كيف نبني الشراكة ↓'),
    figures: [
      { figure: ar('3 أنماط'), label: ar('للتعاون، تختار معنا الأنسب') },
      { figure: ar('4 مراحل'), label: ar('من أول اجتماع إلى أول مشروع') },
      { figure: ar('بلا رسوم'), label: ar('لا رسوم انضمام للبرنامج') },
    ],
  },
  idea: {
    shows: true,
    eyebrow: ar('الفكرة'),
    heading: ar('لماذا شراكة، لا عمولة؟'),
    paragraphs: lines([
      'المكتب الذي يشرف على عشرة مشاريع في وقت واحد ليس «مُحيلاً». هو الطرف الذي يعيش على المنصة يومياً، ويُدخل الاعتمادات والملاحظات وتقارير الموقع، وهو من يقنع المالك بأسلوب عمل أفضل.',
      'ولذلك لا نعرض على المكاتب عمولة على ترشيح. نجلس معك، ونفهم كيف تبيع خدماتك اليوم وكيف تفوتر عميلك، ثم نبني نموذج تعاون يناسب ذلك — تسعير شريك، رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.',
    ]),
    referralNote: {
      text: ar('تبحث عن ترتيب فردي أبسط — كود تشاركه وتستلم عنه مبلغاً ثابتاً؟'),
      linkLabel: ar('انتقل إلى برنامج الإحالة ←'),
    },
  },
  audience: {
    shows: true,
    eyebrow: ar('لمن هذا البرنامج'),
    heading: ar('لمن هذا البرنامج'),
    kinds: [
      { title: ar('المكاتب الهندسية الاستشارية'), text: ar('التي تشرف على مشاريع مطوّرين من القطاع الخاص.') },
      { title: ar('شركات إدارة المشاريع (PMC)'), text: ar('التي تدير محافظ مشاريع لعملاء متعددين.') },
      { title: ar('مجموعات المقاولات'), text: ar('التي تنفّذ عدة مشاريع بالتوازي وتحتاج سجلاً موحّداً مع الاستشاري.') },
      { title: ar('مطوّرون عقاريون متعددو المشاريع'), text: ar('الذين يريدون ترتيباً على مستوى المحفظة لا المشروع الواحد.') },
    ],
  },
  modes: {
    shows: true,
    eyebrow: ar('أنماط التعاون'),
    heading: ar('ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك'),
    modes: [
      {
        label: ar('التضمين في العرض'),
        title: ar('المنصة ضمن نطاق خدماتك'),
        text: ar(
          'تُدرج المنصة ضمن نطاق خدماتك في العرض الذي تقدّمه للمالك، وتفوترها ضمن أتعابك. يحصل المكتب على تسعير شريك، وتبقى علاقة العميل التعاقدية معك.',
        ),
        fit: ar('مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.'),
      },
      {
        label: ar('رخصة المكتب'),
        title: ar('اشتراك على مستوى المكتب'),
        text: ar('يغطي مشاريعه القائمة والجديدة تحت مظلة واحدة، بلوحة إشراف موحّدة على كل المشاريع.'),
        fit: ar('مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.'),
      },
      {
        label: ar('الترشيح المعتمد'),
        title: ar('نتعاقد نحن مع المالك'),
        text: ar('ترشّح المنصة للمالك ونتعاقد نحن معه مباشرة، مع ترتيب متفق عليه للمكتب وأولوية في الدعم على مشاريعه.'),
        fit: ar('مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.'),
      },
    ],
    note: {
      before: ar(
        'شروط كل نمط — التسعير، مدى الحصرية، حدود الجغرافيا أو نوع العميل — تُحدَّد في اتفاقية الشراكة بعد اجتماع تصميم النموذج.',
      ),
      bold: ar('لا نضع تسعيراً موحّداً'),
      after: ar('لأن المكاتب تختلف في حجمها وطبيعة عملائها.'),
    },
  },
  benefits: {
    shows: true,
    eyebrow: ar('ما يحصل عليه الشريك'),
    heading: ar('ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية'),
    benefits: [
      { bold: ar('تسعير شريك'), text: ar('متفق عليه في الاتفاقية') },
      { bold: ar('مدير حساب مخصص'), text: ar('ونقطة تواصل واحدة') },
      { bold: ar('تأهيل فريقك'), text: ar('على المنصة، وإعادة التأهيل عند انضمام موظفين جدد') },
      { bold: ar('دعم فني بأولوية'), text: ar('لمشاريعك ولعملائك') },
      { bold: ar('إعداد المشروع نيابةً عنك'), text: ar('عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع') },
      { bold: ar('لوحة شريك'), text: ar('تعرض مشاريعك النشطة وحالة كل منها') },
      { bold: ar('تسويق مشترك'), text: ar('— ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع') },
      { bold: ar('أولوية في خارطة الطريق'), text: ar('لطلبات التطوير المتكررة من مشاريعك') },
    ],
  },
  path: {
    eyebrow: ar('مسار الشراكة'),
    heading: ar('من أول اجتماع إلى أول مشروع'),
    lead: ar('أربع مراحل واضحة، ولا شيء منها يحتاج قراراً نهائياً منك قبل أن ترى المنصة كما يستخدمها الاستشاري فعلياً.'),
    linkLabel: ar('اطلب اجتماع شراكة'),
    stageLabel: ar('المرحلة'),
    stages: [
      {
        title: ar('اجتماع تعارف'),
        text: ar('جلسة نفهم فيها حجم مكتبك، طبيعة عملائك، وكيف تُبنى عروضك اليوم. ونعرض المنصة كما يستخدمها الاستشاري فعلياً.'),
      },
      {
        title: ar('تصميم نموذج التعاون'),
        text: ar('نتفق على النمط، وآليات التسعير، والالتزامات المتبادلة، ومؤشرات النجاح.'),
      },
      {
        title: ar('الاتفاقية والتأهيل'),
        text: ar('توقيع اتفاقية الشراكة، وتأهيل فريقك، وتجهيز المواد التي تحتاجها لعرض المنصة على عملائك.'),
      },
      {
        title: ar('الإطلاق على أول مشروع'),
        text: ar('نُطلق معك على مشروع واحد كنموذج، ونتابع معك أولاً بأول حتى يستقر العمل.'),
      },
    ],
  },
  questions: {
    shows: true,
    eyebrow: ar('الأسئلة الشائعة'),
    heading: ar('قبل الاجتماع الأول'),
  },
  apply: {
    eyebrow: ar('طلب شراكة'),
    heading: ar('خلّنا نجلس ونصمّم النموذج المناسب لمكتبك'),
    lead: ar('املأ النموذج، ويتواصل معك فريق الشراكات خلال يومي عمل.'),
    reassurances: lines([
      'لا رسوم انضمام، ولا التزام قبل اجتماع التعارف',
      'الاجتماع الأول يشمل عرض المنصة',
      'نموذج التعاون يُكتب في اتفاقية، لا في وعد شفهي',
    ]),
    responseTime: { bold: ar('يوما عمل'), text: ar('مدة الرد على طلبك') },
  },
};
