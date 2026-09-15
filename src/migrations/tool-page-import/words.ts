/**
 * The tool page's words as the site carried them before the CMS (tickets 14
 * and 52), in the shape of its entry, as they become its first published
 * version in the CMS (ticket 54).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: the tool page's words are edited and published in the CMS.
 * Changing a word here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/tool.html`**, but for three things the page
 * now draws itself: each card's and step's number, which is its place; the
 * space between a bold opening and the rest of its line, and between the
 * heading and its last words; and where each button leads, which stays in
 * code. The file name inside the third privacy point is marked between
 * backticks (`src/cms/latin-names.ts`).
 *
 * The first step and the download section say the download starts as soon as
 * the details are filled in. That is what ticket 30 builds; until then the
 * form unlocks but delivers nothing (`download-form.tsx`), and the words
 * describe the page as it will be.
 */

/** A word in Arabic alone: the English is written when the page is translated (ticket 42). */
const ar = (text: string) => ({ ar: text });
const lines = (texts: string[]) => texts.map((text) => ({ text: ar(text) }));

export const TOOL_PAGE_WORDS = {
  hero: {
    eyebrow: ar('أداة مجانية · بدون حساب · بدون اشتراك'),
    title: ar('سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر —'),
    titleAccent: ar('قبل أن يتأخر'),
    lead: ar(
      'ملف HTML واحد يفتح بنقرتين على جهازك. تختار له مجلداً، ومن تلك اللحظة كل صبّة تسجّلها تُكتب هناك: العدّ التنازلي لـ ٧ و ٢٨ يوماً، تقارير المختبر، موافقات الاستشاري، وورقة اعتماد A4 جاهزة للطباعة.',
    ),
    primaryLabel: ar('حمّل الأداة مجاناً'),
    secondaryLabel: ar('كيف تعمل؟ ↓'),
    promises: lines(['مجانية بالكامل', 'تعمل بدون إنترنت', 'بياناتك تبقى عندك', 'عربي / English']),
    mock: {
      project: ar('برج النخيل — المرحلة الثانية'),
      tiles: [
        { figure: '12', label: ar('صبّة مسجّلة'), tone: 'plain' as const },
        { figure: '3', label: ar('اختبار قريب'), tone: 'warn' as const },
        { figure: '1', label: ar('اختبار متأخر'), tone: 'bad' as const },
      ],
      pours: [
        {
          reference: 'ANT-014',
          name: ar('أساسات — قاعدة F12، المنسوب −٣٫٥'),
          tests: [
            { label: ar('كسر ٧ أيام'), tone: 'warn' as const, state: ar('بعد يومين') },
            { label: ar('كسر ٢٨ يوماً'), tone: 'idle' as const, state: ar('لم يحن بعد') },
          ],
        },
        {
          reference: 'ANT-013',
          name: ar('أعمدة — الدور الأرضي، C1 إلى C6'),
          tests: [
            { label: ar('كسر ٧ أيام'), tone: 'ok' as const, state: ar('معتمد') },
            { label: ar('كسر ٢٨ يوماً'), tone: 'bad' as const, state: ar('متأخر ٣ أيام') },
          ],
        },
      ],
    },
  },
  why: {
    shows: true,
    eyebrow: ar('لماذا هذه الأداة'),
    heading: ar('الصبّة تُنفَّذ في ساعة. متابعتها تستمر شهراً.'),
    lead: ar('ثلاثة أشياء تجعل ملف الخرسانة يتأخر — ولا واحد منها له علاقة بجودة الخرسانة نفسها.'),
    cards: [
      {
        title: ar('٧ و ٢٨ يوماً تمرّ بصمت'),
        text: ar(
          'التاريخ الوحيد الذي تتذكره هو تاريخ الصبّة. مواعيد كسر المكعبات تمرّ داخل البرنامج الأسبوعي بلا تنبيه، وتكتشف التأخير في اللحظة التي يسأل فيها الاستشاري.',
        ),
      },
      {
        title: ar('التقرير موجود… في مكان ما'),
        text: ar(
          'تقرير المختبر في واتساب، وموافقة الاستشاري في الإيميل، وصورة الصبّة في جوال المراقب. عند إعداد ملف التسليم تبحث في ثلاثة أماكن مختلفة.',
        ),
      },
      {
        title: ar('الجدول لا يطاردك'),
        text: ar(
          'إكسل ممتاز في التخزين، وسيّئ في التذكير. لا يعرف أن اختبار اليوم متأخر، ولا يفرّق بين اختبار عند المختبر واختبار عند الاستشاري.',
        ),
      },
    ],
  },
  features: {
    shows: true,
    eyebrow: ar('ما الذي تفعله'),
    heading: ar('ستة أشياء تختصر عليك متابعة شهر كامل'),
    lead: ar('كل ما تحتاجه لملف خرسانة نظيف — في ملف واحد على جهازك.'),
    countdown: {
      title: ar('عدّ تنازلي يحسب نفسه'),
      text: ar('أدخل تاريخ الصبّة فقط. الأداة تحسب موعد ٧ و ٢٨ يوماً وتعطي كل اختبار لوناً يقول حالته من مسافة متر.'),
      legend: {
        idle: ar('بعيد'),
        warn: ar('٣ أيام أو أقل'),
        bad: ar('متأخر'),
        info: ar('عند الاستشاري'),
        ok: ar('معتمد'),
      },
    },
    cards: [
      {
        title: ar('المرفق هو الذي يحرّك الحالة'),
        text: ar(
          'أرفق تقرير المختبر فتصبح الحالة «مستلم من المختبر» ويختفي زر تذكير المختبر. أرفق موافقة الاستشاري فيُغلق الاختبار أخضر. الحركة للأمام فقط — الاختبار المرفوض لا ينقلب معتمداً بصمت لأن أحدهم أسقط ملفاً.',
        ),
      },
      {
        title: ar('تذكير المختبر بنقرة'),
        text: ar(
          'زر واحد يفتح بريدك أنت، بالموضوع والنص جاهزين، موجّهاً إلى بريد المختبر المسجّل في بيانات المشروع. الرسالة تخرج من عنوانك — وهذا ما يجعل المطالبة تصل فعلاً. كل تذكير يُسجَّل في تاريخ الاختبار.',
        ),
      },
      {
        title: ar('بوالص التوريد كما تصل'),
        text: ar(
          'البوالص تصل طوال الصباح بعد تسجيل الصبّة بوقت طويل. أضف صفاً وقتما تشاء، أو الصق دفعة كاملة من جدولك: رقم البوليصة، الكمية، رقم الخلاطة، الوقت. يُحفظ فوراً ويحدّث إجمالي الكمية.',
        ),
      },
      {
        title: ar('ورقة اعتماد A4 جاهزة'),
        text: ar(
          'كل بيانات الصبّة والعناصر والاختبارات والصور، مرتّبة في ورقة واحدة بخانات التواقيع الثلاث. اضغط طباعة وسلّمها كما هي، أو احفظها PDF.',
        ),
      },
      {
        title: ar('عربية وإنجليزية بالكامل'),
        text: ar('واجهة عربية بترتيب من اليمين لليسار — لا ترجمة نصف مكتملة ولا حقول مقلوبة. اختيار اللغة محفوظ لكل من يفتح الملف.'),
      },
    ],
    also: lines([
      'عناصر متعددة في الصبّة الواحدة، مع وسم المبنى والدور',
      'صور الموقع تُصغَّر قبل الحفظ حتى لا ينتفخ المجلد',
      'تصدير CSV لكامل السجل بضغطة واحدة',
      'بحث وفلاتر حسب الحالة والعنصر والمورّد والتاريخ',
    ]),
  },
  how: {
    eyebrow: ar('ثلاث خطوات'),
    heading: ar('من التحميل إلى أول صبّة مسجّلة — دقيقتان'),
    lead: ar('لا تثبيت، لا حساب، لا سيرفر محلي، لا Node، لا خطوة بناء.'),
    steps: [
      {
        label: ar('حمّل الملف'),
        title: ar('ملف واحد'),
        text: ar('املأ البيانات بالأسفل ويبدأ التحميل مباشرة. ملف HTML واحد — احفظه في أي مكان على جهازك.'),
        markedOut: false,
      },
      {
        label: ar('افتحه بنقرتين'),
        title: ar('بدون أي خادم'),
        text: ar('في Chrome أو Edge. يعمل من الملف مباشرة بدون أي خادم. لو نقلته لجهاز آخر يعمل هناك أيضاً.'),
        markedOut: false,
      },
      {
        label: ar('اختر مجلد المشروع'),
        title: ar('مرة واحدة فقط'),
        text: ar('الأداة تطلب منك مجلداً مرة واحدة. من تلك اللحظة كل ما تسجّله يُكتب داخله، وتفتحه في المرة القادمة بنقرة واحدة.'),
        markedOut: true,
      },
    ],
  },
  privacy: {
    shows: true,
    eyebrow: ar('الخصوصية'),
    heading: ar('ملفاتك لا تغادر جهازك — لأنه لا يوجد مكان تذهب إليه'),
    points: [
      {
        bold: ar('لا يوجد سيرفر نرفع إليه شيئاً.'),
        text: ar('لا حساب، لا تسجيل دخول، لا قاعدة بيانات عندنا. الأداة لا تعرف عنك شيئاً.'),
      },
      {
        bold: ar('مجلد واحد يملكه المشروع.'),
        text: ar('تختاره أنت، ويحوي ملف السجل ومجلد المرفقات. انسخه، ارفعه على الشبكة الداخلية، أو خذه معك — يعمل كما هو.'),
      },
      {
        bold: ar('ملف نصي مفتوح، وليس صندوقاً مغلقاً.'),
        text: ar('`concrete_db.json` تقرؤه، تنسخه احتياطياً، وتفتحه بأي أداة. لا شيء محبوس في مخزن متصفح لا تصل إليه.'),
      },
      {
        bold: ar('تعمل والإنترنت مقطوع.'),
        text: ar(
          'في القبو، في موقع بعيد، أو في طائرة. (الخطوط فقط تُجلب من الإنترنت في أول فتح — بدونها يتغيّر شكل الخط ويبقى كل شيء يعمل.)',
        ),
      },
    ],
    tree: {
      project: ar('برج النخيل — المرحلة ٢'),
      entries: [
        { name: 'concrete_db.json', description: ar('كل صبّة واختبار وحالة'), nested: false },
        { name: 'attachments/', description: ar('التقارير والموافقات والصور'), nested: false },
        { name: 'ANT-014 d7 lab report.pdf', nested: true },
        { name: 'ANT-014 photo IMG_4471.jpg', nested: true },
      ],
      caption: ar('هذا هو كل ما تنتجه الأداة على جهازك. لا شيء غيره، ولا شيء في مكان آخر.'),
    },
  },
  requirements: {
    shows: true,
    eyebrow: ar('المتطلبات'),
    heading: ar('ما الذي تحتاجه لتشغيلها'),
    cards: [
      { label: ar('النظام'), title: ar('سطح المكتب'), text: ar('ويندوز أو ماك أو لينكس.') },
      { label: ar('التجربة الكاملة'), title: ar('Chrome أو Edge'), text: ar('مع حفظ المرفقات داخل مجلد المشروع.') },
      { label: ar('وضع مبسّط'), title: ar('Firefox و Safari'), text: ar('السجلات داخل المتصفح والمرفقات معطّلة.') },
    ],
  },
  download: {
    eyebrow: ar('التحميل'),
    heading: ar('حمّل الأداة الآن'),
    lead: ar('أكمل البيانات ويبدأ التحميل مباشرة. نستخدمها لإرسال التحديثات وتحسينات الأداة — لا أكثر.'),
    ticks: lines([
      'نسخة كاملة لمشروع واحد، بلا حد زمني ولا علامة مائية',
      'ملف واحد — لا تثبيت ولا حساب ولا اشتراك',
      'تعمل بدون إنترنت، وبياناتك تبقى في مجلدك',
      'واجهة عربية كاملة من اليمين لليسار',
    ]),
    promise: { bold: ar('دقيقتان'), text: ar('من التحميل إلى أول صبّة مسجّلة') },
  },
  questions: {
    shows: true,
    eyebrow: ar('الأسئلة الشائعة'),
    heading: ar('قبل أن تحمّل'),
  },
  upsell: {
    shows: true,
    eyebrow: ar('الخطوة التالية'),
    heading: ar('تحتاج أكثر من مشروع واحد؟'),
    lead: ar('الأداة المجانية تصل إلى حدها الطبيعي عندما يدخل شخص ثانٍ على السجل. عندها تبدأ النسخة السحابية.'),
    primaryLabel: ar('اطلب النسخة السحابية'),
    secondaryLabel: ar('تعرّف على المنصة'),
    adds: lines([
      'كل مشاريعك في لوحة واحدة، مع مقارنة بينها',
      'اعتماد إلكتروني فوري من الاستشاري — بدون بريد',
      'حساب للمختبر يرفع تقريره مباشرة',
      'ربط مع منصة ربائد: الوثائق، التقارير اليومية، المراسلات',
      'سجل تدقيق موثّق لكل تغيير ومن قام به',
    ]),
    signOff: ar('صُنعت في ربائد لمهندسي المواقع. الأداة مجانية — استخدمها كما تشاء.'),
  },
};
