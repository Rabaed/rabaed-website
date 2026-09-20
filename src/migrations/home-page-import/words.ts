/**
 * The home page's words as the site carried them before the CMS (tickets
 * 06–11), in the shape of its entry, as they become its first published
 * version in the CMS (ticket 58).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: the home page's words are edited and published in the CMS.
 * Changing a word here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/index.html`**, but for what the page now
 * draws itself, what an Editor writes differently, and one change the founders
 * made:
 *
 * - each situation's, unit's and step's number, which is its place, and where
 *   each button and link leads, which stays in code;
 * - the before-and-after's bold phrases and line breaks, written as an Editor
 *   writes them: between asterisks, and on a new line (`src/cms/emphasis.ts`);
 * - the line splitting the calculator's cost, as the two names the amounts
 *   follow;
 * - the calculator's words after a count, which follow Arabic's rule for one,
 *   two, three to ten, and eleven on, as the founders decided (ticket 58),
 *   where the Reference site writes «أيام» up to ten days and «شهراً» for any
 *   number of months.
 *
 * No picture is replaced: the hero's drawings stay today's until an Editor
 * chooses others. Four of the figures have no source yet (ticket 47), so they
 * stay off the live site, as they did before.
 */

/** A word in Arabic alone: the English is written when the page is translated (ticket 42). */
const ar = (text: string) => ({ ar: text });

const DECK_HINT = ar('اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم');

/** The receipt every transaction but the schedule update records the same way. */
const received = (time: string) => ({ action: ar('استُلم'), by: ar('إشعار استلام تلقائي'), time });

export const HOME_PAGE_WORDS = {
  hero: {
    eyebrow: ar('نظام تشغيل مشاريع الإنشاء · ربائد'),
    titleLines: [{ line: ar('ثلاثة أطراف.') }, { line: ar('سجل واحد.') }],
    titleAccent: ar('مسؤولية واضحة.'),
    lead: ar(
      'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة باسم من قام بها.',
    ),
    primaryLabel: ar('احجز عرضاً حياً'),
    secondaryLabel: ar('استكشف المنصة ↓'),
    trust: ar('عرض على مشروع حقيقي · 30 دقيقة · بالعربية'),
    guaranteePeriod: ar('60 يوماً'),
    guaranteePromise: ar('ضمان استرجاع كامل المبلغ'),
    parties: { owner: ar('المالك'), consultant: ar('الاستشاري'), contractor: ar('المقاول') },
    diagramDescription: ar(
      'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.',
    ),
    statuses: ['أُرسل · 07:12', 'روجع · 09:20', 'اعتُمد · 12:05', 'وصل السجل للأطراف الثلاثة'].map((status) => ({
      status: ar(status),
    })),
    statusAtRest: ar('موثّق ومؤرخ'),
  },
  trustStrip: { shows: true },
  situations: {
    shows: true,
    eyebrow: ar('مواقف من الميدان'),
    heading: ar('تعرف هذه المواقف؟'),
    close: {
      first: ar('المشكلة ليست البريد الإلكتروني ولا الإكسل.'),
      second: ar('المشكلة أن الإجراء تحتها'),
      accent: ar('يدوي، ومشتّت.'),
    },
    situations: [
      ['المقاول يقول الاستشاري مأخّر الشغل… والاستشاري يقول ما وصله شي.', 'نزاع بلا مرجع، وكل طرف معه نسخته.'],
      ['الداشبورد يقرأ من ملف إكسل… والمهندس ما فضي يحدّثه.', 'قرار مبني على رقم قديم.'],
      ['ملفين إكسل، تاريخين لنفس المستند… ونرجع للنسخة الورقية نتأكد.', 'ساعات ضائعة على سؤال واحد: وين وقف الموضوع؟'],
      ['الاعتماد وصل بالإيميل قبل شهور… وما أحد يلقاه.', 'اعتماد موجود ولا يمكن إثباته.'],
      ['الجدول الزمني تحدّث… والمطوّر ما يدري وش أثره على التسليم.', 'المفاجأة في موعد التسليم، لا في اجتماع المتابعة.'],
      ['بعد نهاية المشروع احتجنا اعتماداً قديماً… والشيرفولدر مقفولة صلاحياته.', 'سجل المشروع يضيع مع انتهاء المشروع.'],
    ].map(([quote, cost]) => ({ quote: ar(quote), cost: ar(cost) })),
    costLabel: ar('الثمن'),
    deck: {
      label: ar('مواقف من الميدان — اسحب البطاقة أو استخدم الأسهم'),
      previousLabel: ar('الموقف السابق'),
      nextLabel: ar('الموقف التالي'),
      hint: DECK_HINT,
    },
  },
  fourUnits: {
    shows: true,
    eyebrow: ar('المنصة'),
    heading: ar('أربع وحدات. سجل واحد يجمعها.'),
    tabsLabel: ar('وحدات ربائد'),
    outputLabel: ar('المخرَج'),
    tabs: [
      { final: false, title: ar('المراسلات الرسمية'), screen: 'correspondence' as const },
      { final: false, title: ar('الاعتمادات والطلبات'), screen: 'kanban' as const },
      { final: false, title: ar('التقرير اليومي للموقع'), screen: 'daily-report' as const },
      { final: false, title: ar('المستندات والإصدارات'), screen: 'documents' as const },
      { final: true, title: ar('السجل الموثّق'), screen: 'stamped-sheet' as const },
    ],
    moreLabel: ar('شاهد الوحدات كاملة بالتفصيل'),
  },
  record: {
    shows: true,
    eyebrow: ar('السجل الموثّق'),
    headingLines: [{ line: ar('لا نسأل "من اعتمد؟"') }, { line: ar('نفتح المعاملة.') }],
    questions: ['من طلب؟', 'من استلم؟', 'من اعتمد؟', 'ومتى؟'].map((question) => ({ question: ar(question) })),
    lead: ar(
      'ليست ميزة تُفعَّل — بل نتيجة كل خطوة. أي معاملة تمر في ربائد تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب تسليم أعمال، تحديث على الجدول الزمني، أو مستخلص مالي. وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.',
    ),
    types: [
      {
        label: ar('خطاب رسمي'),
        title: ar('LTR-088 · خطاب — طلب تمديد مدة'),
        steps: [
          { action: ar('أُرسل'), by: ar('م. فهد — المقاول'), time: '08:15' },
          received('08:15'),
          { action: ar('دُقق'), by: ar('م. سارة — الاستشاري'), time: '13:40' },
          { action: ar('رُدَّ عليه'), by: ar('“يُمنح 14 يوماً” — المالك'), time: '11:05' },
        ],
      },
      {
        label: ar('اعتماد مادة (MIR)'),
        title: ar('SUB-031 · اعتماد مادة — بلاط الواجهات'),
        steps: [
          { action: ar('أُرسل'), by: ar('م. فهد — المقاول'), time: '08:15' },
          received('08:15'),
          { action: ar('دُقق'), by: ar('م. سارة — الاستشاري'), time: '13:40' },
          { action: ar('اعتُمد بملاحظات'), by: ar('“عينة لون إضافية” — م. خالد'), time: '10:02' },
        ],
      },
      {
        label: ar('طلب تسليم أعمال (WIR)'),
        title: ar('WIR-0142 · طلب تسليم أعمال — حديد سقف الدور 3'),
        steps: [
          { action: ar('أُرسل'), by: ar('م. فهد — المقاول'), time: '07:50' },
          received('07:50'),
          { action: ar('فُحص في الموقع'), by: ar('م. سارة · 4 صور'), time: '11:20' },
          { action: ar('اعتُمد'), by: ar('“مطابق — يُسمح بالصب”'), time: '12:05' },
        ],
      },
      {
        label: ar('تحديث جدول زمني'),
        title: ar('SCH-04 · تحديث الجدول الزمني — أغسطس'),
        steps: [
          { action: ar('رُفع التحديث'), by: ar('مخطط المقاول'), time: '09:10' },
          { action: ar('استُلم'), by: ar('الاستشاري والمالك'), time: '09:10' },
          { action: ar('رُوجع الأثر'), by: ar('تأخر 6 أيام على التسليم'), time: '14:25' },
          { action: ar('اعتُمد التحديث'), by: ar('بملاحظة على المسار الحرج'), time: '16:40' },
        ],
      },
      {
        label: ar('مستخلص مالي (IPC)'),
        title: ar('IPC-06 · مستخلص مالي — الدفعة السادسة'),
        steps: [
          { action: ar('قُدِّم'), by: ar('المقاول — بالكميات المنفذة'), time: '08:00' },
          received('08:00'),
          { action: ar('دُقق'), by: ar('مطابقة مع الطلبات المعتمدة'), time: '12:30' },
          { action: ar('اعتُمد للصرف'), by: ar('بعد خصم بند غير مطابق'), time: '09:15' },
        ],
      },
    ],
    stamp: ar('✓ سجل كامل · 4 خطوات · 3 أطراف'),
  },
  beforeAfter: {
    shows: true,
    eyebrow: ar('قبل وبعد ربائد'),
    heading: ar('نفس الاعتماد… بطريقتين.'),
    lead: ar('أربع لحظات في اعتماد مادة واحد. *اسحب المقبض* ليمرّ على الخطوات — كل خطوة تتحول أمامك من الطريقة المعتادة إلى ربائد.'),
    usualTag: ar('الطريقة المعتادة'),
    rabaedTag: ar('مع ربائد'),
    handleLabel: ar('اسحب للمقارنة بين الطريقتين'),
    verdicts: {
      usual: ar('النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.'),
      rabaed: ar('النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.'),
      between: ar('اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.'),
    },
    steps: [
      {
        name: ar('الطلب'),
        usual: { channel: ar('ورق'), words: ar('يُطبع، يُوقَّع باليد، ويُصوَّر بالجوال.') },
        rabaed: { channel: ar('ربائد'), words: ar('طلب اعتماد *SUB-031* برقم مرجعي ومرفقاته.') },
      },
      {
        name: ar('الاستلام'),
        usual: { channel: ar('واتساب'), words: ar('"أرسله إيميل رسمي" — الطلب يصير محادثة.') },
        rabaed: { channel: ar('تلقائي'), words: ar('إشعار استلام *بالاسم والوقت* — لا أحد ينكره.') },
      },
      {
        name: ar('الاعتماد'),
        usual: { channel: ar('إيميل'), words: ar('رد بعد أسبوع… في ثريد آخر لا أحد يجده.') },
        rabaed: { channel: ar('موثّق'), words: ar('اعتماد بملاحظات، *والمالك يرى الحالة لحظياً*.') },
      },
      {
        name: ar('بعد شهرين'),
        usual: { channel: ar('إكسل'), words: ar('"ما وصلتني الموافقة."\nالدليل: لقطة شاشة واتساب.') },
        rabaed: { channel: ar('السجل'), words: ar('يُفتح المستند: أُرسل، استُلم، دُقق، اعتُمد.\n*الدليل: السجل نفسه.*') },
      },
    ],
  },
  calculator: {
    shows: true,
    eyebrow: ar('حاسبة تكلفة التأخير'),
    heading: ar('كم يكلفك أسبوع تأخير اعتماد واحد؟'),
    lead: ar('تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط — قبل أي مطالبة من المقاول.'),
    sliderLabels: { projectValue: ar('قيمة المشروع'), delayDays: ar('أيام التأخير'), durationMonths: ar('مدة المشروع') },
    resultLabel: ar('التكلفة التقديرية للتأخير'),
    breakdown: { financing: ar('تمويل'), siteOverhead: ar('تكاليف عامة للموقع') },
    assumptions: ar(
      'الافتراضات: تكلفة تمويل 8% سنوياً · تكاليف عامة للموقع 10% من قيمة المشروع موزعة على مدته. لا تشمل مطالبات المقاول ولا الغرامات.',
    ),
    callToActionLabel: ar('احجز عرضاً لترى كيف نمنعه'),
    currency: ar('ر.س'),
    days: { one: ar('يوم'), two: ar('يومان'), few: ar('أيام'), many: ar('يوماً') },
    months: { few: ar('أشهر'), many: ar('شهراً') },
  },
  figures: {
    shows: true,
    eyebrow: ar('الأثر'),
    heading: ar('ماذا يتغيّر بعد التشغيل؟'),
    lead: ar(
      'الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — على مشروع يعمل فيه المالك والاستشاري والمقاول على المنصة نفسها.',
    ),
    figures: [
      {
        blockType: 'comparison' as const,
        topic: ar('دورة الاعتماد'),
        icon: 'approval' as const,
        claim: ar('أسرع في الاعتمادات والاستلامات'),
        figure: '3.6×',
        before: { label: ar('يدوي'), height: 20 },
        after: { label: ar('ربائد'), height: 70 },
        basis: ar('مقارنةً بالدورة الورقية على المشروع نفسه'),
      },
      {
        blockType: 'comparison' as const,
        topic: ar('استرجاع الوثائق'),
        icon: 'retrieval' as const,
        claim: ar('أسرع في استرجاع الوثائق'),
        figure: '7×',
        before: { label: ar('يدوي'), height: 10 },
        after: { label: ar('ربائد'), height: 70 },
        basis: ar('زمن الوصول إلى آخر نسخة معتمدة'),
      },
      {
        blockType: 'comparison' as const,
        topic: ar('الوقت الإداري'),
        icon: 'time' as const,
        claim: ar('توفير في وقت المهام الإدارية'),
        figure: '31%',
        before: { label: ar('قبل'), height: 70 },
        after: { label: ar('بعد'), height: 48 },
        basis: ar('من ساعات فريق المشروع الأسبوعية'),
      },
      {
        blockType: 'comparison' as const,
        topic: ar('حوكمة الوثائق'),
        icon: 'governance' as const,
        claim: ar('تحسّن في حوكمة الوثائق'),
        figure: '22%',
        before: { label: ar('قبل'), height: 57 },
        after: { label: ar('بعد'), height: 70 },
        basis: ar('اكتمال أثر كل معاملة: من أرسل، من اعتمد، ومتى'),
      },
      {
        blockType: 'commitment' as const,
        topic: ar('التفعيل'),
        icon: 'activation' as const,
        claim: ar('تفعيل ميداني كامل دون توقّف للعمل'),
        value: ar('أقل من يوم'),
        basis: ar('من أول اجتماع إلى أول معاملة موثّقة'),
      },
      {
        blockType: 'commitment' as const,
        topic: ar('التأهيل'),
        icon: 'onboarding' as const,
        claim: ar('جلسة تعريفية واحدة لكل فريق'),
        value: ar('15 دقيقة'),
        basis: ar('جلسة واحدة لكل فريق، ثم العمل الفعلي'),
      },
    ],
    deck: {
      label: ar('أرقام الأثر — اسحب البطاقة أو استخدم الأسهم'),
      previousLabel: ar('الرقم السابق'),
      nextLabel: ar('الرقم التالي'),
      hint: DECK_HINT,
    },
  },
  questions: {
    shows: true,
    eyebrow: ar('الأسئلة الشائعة'),
    heading: ar('قبل أن تسأل'),
    moreLabel: ar('كل الأسئلة'),
  },
};
