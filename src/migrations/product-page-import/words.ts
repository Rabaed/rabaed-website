/**
 * The product page's words, the closing section's and the Screen mocks'
 * descriptions as the site carried them before the CMS (tickets 08, 11, 12
 * and 52), as they become each entry's first published version in the CMS
 * (ticket 57).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: these words are edited and published in the CMS. Changing a
 * word here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/product.html` and `index.html`.** Numbers
 * that follow an item's place — a unit's, a closing step's — are not here, so
 * reordering renumbers them; nor where a button or link leads, which stays in
 * code. A bold sentence is held apart from the words before it, and the space
 * between the two is the page's to draw.
 */

type Flow = readonly { readonly party: string; readonly after: 'towards' | 'then' | 'none' }[];

/** Parties one after another, an arrow between each. */
const oneRoute = (...parties: string[]): Flow =>
  parties.map((party, index) => ({ party, after: index < parties.length - 1 ? 'towards' : 'none' }));

export const PRODUCT_PAGE_WORDS = {
  hero: {
    eyebrow: 'المنتج',
    title: 'وحدات ربائد — وما يراه كل طرف منها.',
    lead: 'أربع وحدات تغطي كل ما يمر بين الأطراف، ثم ما يراه كل طرف حين يفتح المنصة، ثم ما يبقى داخل جهته ولا يعبر إلى الآخرين.',
    primaryLabel: 'احجز عرضاً حياً',
    secondaryLabel: 'ابدأ من الوحدات ↓',
  },
  trustStrip: { shows: true },
  journey: {
    eyebrow: 'المنصة',
    heading: 'أربع وحدات. سجل واحد يجمعها.',
    outputLabel: 'المخرَج',
    panels: [
      {
        final: false,
        title: 'المراسلات الرسمية',
        tagline: 'خطاب برقم مرجعي، وإشعار استلام لا يُنكر.',
        body: 'خطابات، محاضر اجتماعات، استفسارات RFI — بترقيم مرجعي آلي، وإشعار استلام تلقائي يسجّل من استلم ومتى.',
        flow: oneRoute('أي طرف', 'أي طرف'),
        screen: 'correspondence',
      },
      {
        final: false,
        title: 'الاعتمادات والطلبات',
        tagline: 'من اعتماد المادة إلى طلب التسليم: مسار واحد بين المقاول والاستشاري.',
        body: 'اعتمادات الموردين والمواد والمخططات والمستندات · طلبات تسليم الأعمال WIR وفحص المواد MIR وإذن الأعمال · وبالاتجاه المقابل: عدم المطابقة NCR، تعليمات الموقع، وملاحظات التسليم النهائي.',
        flow: [
          { party: 'المقاول', after: 'towards' },
          { party: 'الاستشاري', after: 'then' },
          { party: 'الاستشاري', after: 'towards' },
          { party: 'المقاول', after: 'none' },
        ] as Flow,
        screen: 'kanban',
      },
      {
        final: false,
        title: 'التقرير اليومي للموقع',
        tagline: 'ما حدث في الموقع اليوم، عند المالك قبل أن ينتهي اليوم.',
        body: 'العمالة، المعدات، الطقس، إنتاجية اليوم، الصور — يُرفع من الجوال في الموقع ويظهر في لوحة المالك فوراً.',
        flow: oneRoute('الموقع', 'الاستشاري', 'المالك'),
        screen: 'daily-report',
      },
      {
        final: false,
        title: 'المستندات والإصدارات',
        tagline: 'الجميع على آخر إصدار معتمد — ولا أحد يرى أكثر مما يخصه.',
        body: 'مستودع واحد للمشروع: المخططات والمستندات بإصداراتها، الإصدار المعتمد فقط هو الظاهر للموقع، وصلاحيات محددة لكل جهة.',
        flow: [
          { party: 'المالك', after: 'none' },
          { party: 'الاستشاري', after: 'none' },
          { party: 'المقاول', after: 'none' },
        ] as Flow,
        screen: 'documents',
      },
      {
        final: true,
        title: 'السجل الموثّق',
        tagline: 'ثلاثة أطراف. سجل واحد.',
        body: 'كل مستند في ربائد يحمل تاريخه كاملاً: متى أُرسل، من استلمه، من دققه، من اعتمده — وبأي ملاحظات ومتى. ليس ميزة تُفعَّل، بل نتيجة كل خطوة.',
        flow: [] as Flow,
        screen: 'stamped-sheet',
      },
    ],
  },
  customStrip: {
    shows: true,
    eyebrow: 'يُخصَّص حسب المشروع',
    heading: 'ومشروعك يحتاج أكثر؟',
    badge: 'حسب المشروع',
    features: [
      {
        title: 'الجداول الزمنية ومتابعة الإنجاز',
        body: 'استيراد جداول Primavera P6 و MS Project، المسار الحرج، وأثر كل تحديث زمني على موعد التسليم.',
      },
      {
        title: 'جدول الكميات والمستخلصات',
        body: 'جدول كميات تفاعلي ومستخلصات مبنية على الطلبات المعتمدة فعلاً — لا على ما يُكتب في نهاية الشهر.',
      },
    ],
    askLabel: 'اسأل عنها في العرض التوضيحي ←',
  },
  roles: {
    shows: true,
    eyebrow: 'لكل طرف',
    heading: 'ماذا يرى كل طرف حين يفتح المنصة؟',
    roles: [
      {
        party: 'المالك / المطوّر',
        promise: 'لوحة واحدة لكل مشاريعك.',
        body: 'ما ينتظر اعتمادك، ما تجاوز مهلته، وما حدث في الموقع اليوم — بلا اجتماع متابعة، وبلا ملف إكسل يحتاج من يحدّثه.',
        objection: '«ما عندي وقت أتابع نظاماً جديداً.»',
        answer: 'لا تدخله لتتابع، بل لتعتمد. وما عدا ذلك يصلك مقروءاً في لوحة واحدة.',
        screen: 'overview',
      },
      {
        party: 'الاستشاري',
        promise: 'طلبات المقاول في قائمة واحدة.',
        body: 'كل طلبات التسليم والفحص والاعتماد أمامك بحالتها. تعتمد بملاحظاتك من المكتب أو من الموقع، وتُصدر NCR وتعليمات الموقع من الجوال — وكلها موثّقة باسمك ووقتك.',
        objection: '«سيُحمّلنا مسؤولية التأخير.»',
        answer: 'بالعكس: يوثّق أنك رددت في وقتك، ويوثّق الطلب الذي وصلك ناقصاً كما وصل.',
        screen: 'approvals-table',
      },
      {
        party: 'المقاول',
        promise: 'طلب واحد بدل خمس رسائل.',
        body: 'ترفع الطلب، تعرف من استلمه ومتى، وتعرف حالته دون مكالمة. وإن تأخر الاعتماد — سجلك جاهز يُظهر متى أرسلت ومتى وصل.',
        objection: '«سيُستخدم ضدنا.»',
        answer: 'السجل واحد للجميع: يوثّق تقديمك في موعده كما يوثّق تأخر الرد عليه.',
        screen: 'submittal',
      },
    ],
    sharedPromises: [
      'نماذج عربية بالمعايير السعودية',
      'إصدار واحد معتمد',
      'صلاحيات لكل جهة',
      'يعمل من الجوال',
      'يدعم الإنجليزية للفرق غير العربية',
    ],
  },
  innerCycle: {
    shows: true,
    eyebrow: 'داخل كل جهة',
    heading: 'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟',
    lead: 'لكل جهة دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً. هذه الدورة لا يراها الطرفان الآخران إطلاقاً — لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر هو المعاملة الرسمية وحدها.',
    cycles: [
      {
        party: 'المقاول',
        note: 'يجهّز الطلب قبل أن يرسله.',
        reviewers: ['مهندس الموقع', 'المكتب الفني', 'مدير المشروع'],
        crosses: 'طلب تسليم أعمال · اعتماد مادة · خطاب — بتاريخه ومن أرسله.',
      },
      {
        party: 'الاستشاري',
        note: 'يراجع ويقرر قبل أن يرد.',
        reviewers: ['مهندس التخصص', 'مدير المراقبة', 'مدير المشروع'],
        crosses: 'اعتماد أو رفض بملاحظات · عدم مطابقة · تعليمات موقع.',
      },
      {
        party: 'المالك / المطوّر',
        note: 'يدرس أثر القرار قبل أن يعتمد.',
        reviewers: ['مدير المشروع', 'إدارة العقود', 'صاحب القرار'],
        crosses: 'موافقة · رد على خطاب · اعتماد مستخلص.',
      },
    ],
    privateTag: 'دورة داخلية · محجوبة',
    reviewAgain: 'إعادة ومراجعة داخلية — بلا حد، وبلا أثر خارج الجهة',
    crossesLabel: 'ما يعبر رسمياً',
    staysInside: {
      label: 'ما يبقى داخل جهتك',
      text: 'المسودات، الملاحظات الداخلية، الاعتراضات، وعدد دورات المراجعة.',
      emphasis: 'تعمل بحرية داخل حدودك — ولا يُحسب عليك ما لم تُرسله.',
    },
    crossesOut: {
      label: 'ما يعبر إلى الآخرين',
      text: 'المعاملة الرسمية فقط، بلحظة إرسالها واسم من أرسلها.',
      emphasis: 'ومن تلك اللحظة تصبح جزءاً من السجل الموثّق.',
    },
  },
} as const;

/** «كيف نبدأ معك», from `reference/site/index.html`; the product page ends on the same. */
export const CLOSING_SECTION_WORDS = {
  eyebrow: 'كيف نبدأ معك',
  heading: 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
  steps: [
    { label: 'إعداد', text: 'نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول — و15 دقيقة مع كل فريق.' },
    { label: 'تشغيل', text: 'أقل من يوم، دون توقف للعمل. يبدأ الجميع من حيث وصل المشروع.' },
    { label: 'ضمان', text: '60 يوماً من التفعيل — أو نعيد كامل المبلغ، ونسلّمكم نسخة كاملة من السجل.' },
  ],
  moreLabel: 'التفاصيل والأسئلة الشائعة ←',
} as const;

/**
 * What each Screen mock shows, in words: the product page's descriptions, used
 * on both pages (ticket 08 explains why).
 */
export const SCREEN_MOCK_DESCRIPTIONS = {
  correspondence: 'شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف',
  kanban:
    'لوحة كانبان للاعتمادات في ربائد: مسودة، مراجعة داخلية بمسارَي مهندس المقاول ومدير المشروع، ثم انتظار الموافقة والمعتمدة',
  'daily-report':
    'تفاصيل التقرير اليومي في ربائد: الطقس والموقع، جدولا الفريق الإداري والعمالة بالعدد والساعات، والأنشطة والصور',
  documents: 'مستودع المستندات في ربائد: المجلدات وجدول الملفات بالإصدار والنوع ومعرف المصدر ومن رفعه',
  'stamped-sheet': 'ورقة الاعتماد المختومة في ربائد: أربعة توقيعات بالدور والشركة ووقت الفعل، ورمز الاعتماد B، والختم',
  overview: 'ما يراه المالك في ربائد: لوحة مشروع واحدة بمؤشرات الاعتمادات وأطراف المشروع',
  'approvals-table': 'ما يراه الاستشاري في ربائد: جدول الاعتمادات والطلبات بحالاتها وتخصصاتها وأنواعها',
  submittal: 'ما يراه المقاول في ربائد: تفاصيل الطلب وقسم الموافقات باسم كل من تصرّف ووقته',
} as const;
