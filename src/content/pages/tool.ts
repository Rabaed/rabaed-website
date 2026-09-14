import type { QuestionsContent } from '@/components/questions';
import type { ToolDownloadContent } from '@/components/tool/download';
import type { ToolFeaturesContent } from '@/components/tool/features';
import type { ToolHeroContent } from '@/components/tool/hero';
import type { ToolHowContent } from '@/components/tool/how';
import type { ToolPrivacyContent } from '@/components/tool/privacy';
import type { ToolRequirementsContent } from '@/components/tool/requirements';
import type { ToolUpsellContent } from '@/components/tool/upsell';
import type { ToolWhyContent } from '@/components/tool/why';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type ToolPageContent = {
  readonly meta: PageMeta;
  readonly hero: ToolHeroContent;
  readonly why: Section<ToolWhyContent>;
  readonly features: Section<ToolFeaturesContent>;
  /** The hero's «كيف تعمل؟ ↓» lands here. */
  readonly how: LinkedSection<ToolHowContent>;
  readonly privacy: Section<ToolPrivacyContent>;
  readonly requirements: Section<ToolRequirementsContent>;
  /** The hero's «حمّل الأداة مجاناً» lands here. */
  readonly download: LinkedSection<ToolDownloadContent>;
  readonly questions: Section<QuestionsContent>;
  readonly upsell: Section<ToolUpsellContent>;
};

/** All copy is verbatim from `reference/site/tool.html`. */
const AR: BeforeQuestions<ToolPageContent> = {
  meta: {
    title: 'ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية',
    description:
      'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.',
  },
  hero: {
    eyebrow: 'أداة مجانية · بدون حساب · بدون اشتراك',
    title: 'سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر — ',
    titleAccent: 'قبل أن يتأخر',
    lead: 'ملف HTML واحد يفتح بنقرتين على جهازك. تختار له مجلداً، ومن تلك اللحظة كل صبّة تسجّلها تُكتب هناك: العدّ التنازلي لـ ٧ و ٢٨ يوماً، تقارير المختبر، موافقات الاستشاري، وورقة اعتماد A4 جاهزة للطباعة.',
    // Both land further down this page: the form, and the steps.
    primary: { label: 'حمّل الأداة مجاناً', href: '#get' },
    secondary: { label: 'كيف تعمل؟ ↓', href: '#how' },
    promises: ['مجانية بالكامل', 'تعمل بدون إنترنت', 'بياناتك تبقى عندك', 'عربي / English'],
    mock: {
      project: 'برج النخيل — المرحلة الثانية',
      tiles: [
        { figure: '12', label: 'صبّة مسجّلة' },
        { figure: '3', label: 'اختبار قريب', tone: 'warn' },
        { figure: '1', label: 'اختبار متأخر', tone: 'bad' },
      ],
      pours: [
        {
          reference: 'ANT-014',
          name: 'أساسات — قاعدة F12، المنسوب −٣٫٥',
          tests: [
            { label: 'كسر ٧ أيام', state: { tone: 'warn', label: 'بعد يومين' } },
            { label: 'كسر ٢٨ يوماً', state: { tone: 'idle', label: 'لم يحن بعد' } },
          ],
        },
        {
          reference: 'ANT-013',
          name: 'أعمدة — الدور الأرضي، C1 إلى C6',
          tests: [
            { label: 'كسر ٧ أيام', state: { tone: 'ok', label: 'معتمد' } },
            { label: 'كسر ٢٨ يوماً', state: { tone: 'bad', label: 'متأخر ٣ أيام' } },
          ],
        },
      ],
    },
  },
  why: {
    shows: true,
    eyebrow: 'لماذا هذه الأداة',
    heading: 'الصبّة تُنفَّذ في ساعة. متابعتها تستمر شهراً.',
    lead: 'ثلاثة أشياء تجعل ملف الخرسانة يتأخر — ولا واحد منها له علاقة بجودة الخرسانة نفسها.',
    cards: [
      {
        label: '01',
        title: '٧ و ٢٨ يوماً تمرّ بصمت',
        text: 'التاريخ الوحيد الذي تتذكره هو تاريخ الصبّة. مواعيد كسر المكعبات تمرّ داخل البرنامج الأسبوعي بلا تنبيه، وتكتشف التأخير في اللحظة التي يسأل فيها الاستشاري.',
      },
      {
        label: '02',
        title: 'التقرير موجود… في مكان ما',
        text: 'تقرير المختبر في واتساب، وموافقة الاستشاري في الإيميل، وصورة الصبّة في جوال المراقب. عند إعداد ملف التسليم تبحث في ثلاثة أماكن مختلفة.',
      },
      {
        label: '03',
        title: 'الجدول لا يطاردك',
        text: 'إكسل ممتاز في التخزين، وسيّئ في التذكير. لا يعرف أن اختبار اليوم متأخر، ولا يفرّق بين اختبار عند المختبر واختبار عند الاستشاري.',
      },
    ],
  },
  features: {
    shows: true,
    eyebrow: 'ما الذي تفعله',
    heading: 'ستة أشياء تختصر عليك متابعة شهر كامل',
    lead: 'كل ما تحتاجه لملف خرسانة نظيف — في ملف واحد على جهازك.',
    countdown: {
      label: '01',
      title: 'عدّ تنازلي يحسب نفسه',
      text: 'أدخل تاريخ الصبّة فقط. الأداة تحسب موعد ٧ و ٢٨ يوماً وتعطي كل اختبار لوناً يقول حالته من مسافة متر.',
      states: [
        { tone: 'idle', label: 'بعيد' },
        { tone: 'warn', label: '٣ أيام أو أقل' },
        { tone: 'bad', label: 'متأخر' },
        { tone: 'info', label: 'عند الاستشاري' },
        { tone: 'ok', label: 'معتمد' },
      ],
    },
    cards: [
      {
        label: '02',
        title: 'المرفق هو الذي يحرّك الحالة',
        text: 'أرفق تقرير المختبر فتصبح الحالة «مستلم من المختبر» ويختفي زر تذكير المختبر. أرفق موافقة الاستشاري فيُغلق الاختبار أخضر. الحركة للأمام فقط — الاختبار المرفوض لا ينقلب معتمداً بصمت لأن أحدهم أسقط ملفاً.',
      },
      {
        label: '03',
        title: 'تذكير المختبر بنقرة',
        text: 'زر واحد يفتح بريدك أنت، بالموضوع والنص جاهزين، موجّهاً إلى بريد المختبر المسجّل في بيانات المشروع. الرسالة تخرج من عنوانك — وهذا ما يجعل المطالبة تصل فعلاً. كل تذكير يُسجَّل في تاريخ الاختبار.',
      },
      {
        label: '04',
        title: 'بوالص التوريد كما تصل',
        text: 'البوالص تصل طوال الصباح بعد تسجيل الصبّة بوقت طويل. أضف صفاً وقتما تشاء، أو الصق دفعة كاملة من جدولك: رقم البوليصة، الكمية، رقم الخلاطة، الوقت. يُحفظ فوراً ويحدّث إجمالي الكمية.',
      },
      {
        label: '05',
        title: 'ورقة اعتماد A4 جاهزة',
        text: 'كل بيانات الصبّة والعناصر والاختبارات والصور، مرتّبة في ورقة واحدة بخانات التواقيع الثلاث. اضغط طباعة وسلّمها كما هي، أو احفظها PDF.',
      },
      {
        label: '06',
        title: 'عربية وإنجليزية بالكامل',
        text: 'واجهة عربية بترتيب من اليمين لليسار — لا ترجمة نصف مكتملة ولا حقول مقلوبة. اختيار اللغة محفوظ لكل من يفتح الملف.',
      },
    ],
    also: [
      'عناصر متعددة في الصبّة الواحدة، مع وسم المبنى والدور',
      'صور الموقع تُصغَّر قبل الحفظ حتى لا ينتفخ المجلد',
      'تصدير CSV لكامل السجل بضغطة واحدة',
      'بحث وفلاتر حسب الحالة والعنصر والمورّد والتاريخ',
    ],
  },
  how: {
    shows: true,
    eyebrow: 'ثلاث خطوات',
    heading: 'من التحميل إلى أول صبّة مسجّلة — دقيقتان',
    lead: 'لا تثبيت، لا حساب، لا سيرفر محلي، لا Node، لا خطوة بناء.',
    steps: [
      {
        number: '01',
        label: 'حمّل الملف',
        title: 'ملف واحد',
        // Says the download starts as soon as the details are filled in. That
        // is what ticket 30 builds; until then the form unlocks but delivers
        // nothing (`download-form.tsx`), and the words describe the page as it
        // will be.
        text: 'املأ البيانات بالأسفل ويبدأ التحميل مباشرة. ملف HTML واحد — احفظه في أي مكان على جهازك.',
        markedOut: false,
      },
      {
        number: '02',
        label: 'افتحه بنقرتين',
        title: 'بدون أي خادم',
        text: 'في Chrome أو Edge. يعمل من الملف مباشرة بدون أي خادم. لو نقلته لجهاز آخر يعمل هناك أيضاً.',
        markedOut: false,
      },
      {
        number: '03',
        label: 'اختر مجلد المشروع',
        title: 'مرة واحدة فقط',
        text: 'الأداة تطلب منك مجلداً مرة واحدة. من تلك اللحظة كل ما تسجّله يُكتب داخله، وتفتحه في المرة القادمة بنقرة واحدة.',
        markedOut: true,
      },
    ],
  },
  privacy: {
    shows: true,
    eyebrow: 'الخصوصية',
    heading: 'ملفاتك لا تغادر جهازك — لأنه لا يوجد مكان تذهب إليه',
    points: [
      [
        { strong: 'لا يوجد سيرفر نرفع إليه شيئاً.' },
        ' لا حساب، لا تسجيل دخول، لا قاعدة بيانات عندنا. الأداة لا تعرف عنك شيئاً.',
      ],
      [
        { strong: 'مجلد واحد يملكه المشروع.' },
        ' تختاره أنت، ويحوي ملف السجل ومجلد المرفقات. انسخه، ارفعه على الشبكة الداخلية، أو خذه معك — يعمل كما هو.',
      ],
      [
        { strong: 'ملف نصي مفتوح، وليس صندوقاً مغلقاً.' },
        ' ',
        { latin: 'concrete_db.json' },
        // The space and the words after it are two runs, as the page was first
        // written, so the server draws them exactly as it did.
        ' ',
        'تقرؤه، تنسخه احتياطياً، وتفتحه بأي أداة. لا شيء محبوس في مخزن متصفح لا تصل إليه.',
      ],
      [
        { strong: 'تعمل والإنترنت مقطوع.' },
        ' في القبو، في موقع بعيد، أو في طائرة. (الخطوط فقط تُجلب من الإنترنت في أول فتح — بدونها يتغيّر شكل الخط ويبقى كل شيء يعمل.)',
      ],
    ],
    tree: {
      project: 'برج النخيل — المرحلة ٢',
      entries: [
        { name: 'concrete_db.json', description: 'كل صبّة واختبار وحالة', nested: false },
        { name: 'attachments/', description: 'التقارير والموافقات والصور', nested: false },
        { name: 'ANT-014 d7 lab report.pdf', nested: true },
        { name: 'ANT-014 photo IMG_4471.jpg', nested: true },
      ],
      caption: 'هذا هو كل ما تنتجه الأداة على جهازك. لا شيء غيره، ولا شيء في مكان آخر.',
    },
  },
  requirements: {
    shows: true,
    eyebrow: 'المتطلبات',
    heading: 'ما الذي تحتاجه لتشغيلها',
    cards: [
      { label: 'النظام', title: 'سطح المكتب', text: 'ويندوز أو ماك أو لينكس.' },
      { label: 'التجربة الكاملة', title: 'Chrome أو Edge', text: 'مع حفظ المرفقات داخل مجلد المشروع.' },
      { label: 'وضع مبسّط', title: 'Firefox و Safari', text: 'السجلات داخل المتصفح والمرفقات معطّلة.' },
    ],
  },
  // The copy says the download starts as soon as the details are complete, as
  // the first of the three steps does. That is what ticket 30 builds; until
  // then the form unlocks but delivers nothing (`download-form.tsx`), and the
  // words describe the page as it will be.
  download: {
    shows: true,
    eyebrow: 'التحميل',
    heading: 'حمّل الأداة الآن',
    lead: 'أكمل البيانات ويبدأ التحميل مباشرة. نستخدمها لإرسال التحديثات وتحسينات الأداة — لا أكثر.',
    ticks: [
      'نسخة كاملة لمشروع واحد، بلا حد زمني ولا علامة مائية',
      'ملف واحد — لا تثبيت ولا حساب ولا اشتراك',
      'تعمل بدون إنترنت، وبياناتك تبقى في مجلدك',
      'واجهة عربية كاملة من اليمين لليسار',
    ],
    promise: [{ strong: 'دقيقتان' }, ' من التحميل إلى أول صبّة مسجّلة'],
  },
  questions: {
    shows: true,
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل أن تحمّل',
  },
  upsell: {
    shows: true,
    eyebrow: 'الخطوة التالية',
    heading: 'تحتاج أكثر من مشروع واحد؟',
    lead: 'الأداة المجانية تصل إلى حدها الطبيعي عندما يدخل شخص ثانٍ على السجل. عندها تبدأ النسخة السحابية.',
    primary: { label: 'اطلب النسخة السحابية', href: localePath('ar', '/start') },
    secondary: { label: 'تعرّف على المنصة', href: localePath('ar', '/product') },
    adds: [
      'كل مشاريعك في لوحة واحدة، مع مقارنة بينها',
      'اعتماد إلكتروني فوري من الاستشاري — بدون بريد',
      'حساب للمختبر يرفع تقريره مباشرة',
      'ربط مع منصة ربائد: الوثائق، التقارير اليومية، المراسلات',
      'سجل تدقيق موثّق لكل تغيير ومن قام به',
    ],
    signOff: 'صُنعت في ربائد لمهندسي المواقع. الأداة مجانية — استخدمها كما تشاء.',
  },
};

/** The tool page's content in `locale`, or a refusal (`inLocale`), with its questions as the CMS has them. */
export async function getToolPage(locale: Locale): Promise<ToolPageContent> {
  return withQuestions('tool', locale, inLocale('tool', { ar: AR }, locale));
}
