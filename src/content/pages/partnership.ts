import type { PageHeroContent } from '@/components/page-hero';
import type { PartnershipApplyContent } from '@/components/partnership/apply';
import type { PartnershipAudienceContent } from '@/components/partnership/audience';
import type { PartnershipBenefitsContent } from '@/components/partnership/benefits';
import type { PartnershipIdeaContent } from '@/components/partnership/idea';
import type { PartnershipModesContent } from '@/components/partnership/modes';
import type { PartnershipPathContent } from '@/components/partnership/path';
import type { PartnershipQuestionsContent } from '@/components/partnership/questions';
import { PARTNERSHIP_FAQ } from '@/content/faq';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, type LinkedSection, type PageMeta, type Section } from './page-content';

export type PartnershipPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly idea: Section<PartnershipIdeaContent>;
  readonly audience: Section<PartnershipAudienceContent>;
  readonly modes: Section<PartnershipModesContent>;
  readonly benefits: Section<PartnershipBenefitsContent>;
  /** The hero's «كيف نبني الشراكة ↓» lands here. */
  readonly path: LinkedSection<PartnershipPathContent>;
  readonly questions: Section<PartnershipQuestionsContent>;
  /** The hero's «اطلب اجتماع شراكة» and the path's link both land here. */
  readonly apply: LinkedSection<PartnershipApplyContent>;
};

/** All copy is verbatim from `reference/site/partnership.html`. */
const AR: PartnershipPageContent = {
  meta: {
    title: 'ربائد · برنامج الشراكات للمكاتب الهندسية',
    description: 'شراكة تُصمَّم معك: تسعير شريك، أو رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.',
  },
  hero: {
    eyebrow: 'برنامج الشراكات',
    title: 'منصّة إدارة المشروع… ضمن عرضك أنت',
    lead: 'شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع ومجموعات المقاولات — نموذج تعاون يُصمَّم معك، لا باقة جاهزة تُعرض عليك.',
    // Both land further down this page: the application form, and the path.
    primary: { label: 'اطلب اجتماع شراكة', href: '#apply' },
    secondary: { label: 'كيف نبني الشراكة ↓', href: '#path' },
    figures: [
      { figure: [{ mono: '3' }, ' أنماط'], label: 'للتعاون، تختار معنا الأنسب' },
      { figure: [{ mono: '4' }, ' مراحل'], label: 'من أول اجتماع إلى أول مشروع' },
      { figure: 'بلا رسوم', label: 'لا رسوم انضمام للبرنامج' },
    ],
  },
  idea: {
    shows: true,
    eyebrow: 'الفكرة',
    heading: 'لماذا شراكة، لا عمولة؟',
    paragraphs: [
      'المكتب الذي يشرف على عشرة مشاريع في وقت واحد ليس «مُحيلاً». هو الطرف الذي يعيش على المنصة يومياً، ويُدخل الاعتمادات والملاحظات وتقارير الموقع، وهو من يقنع المالك بأسلوب عمل أفضل.',
      'ولذلك لا نعرض على المكاتب عمولة على ترشيح. نجلس معك، ونفهم كيف تبيع خدماتك اليوم وكيف تفوتر عميلك، ثم نبني نموذج تعاون يناسب ذلك — تسعير شريك، رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.',
    ],
    referralNote: {
      // Its trailing space included: the link follows it.
      text: 'تبحث عن ترتيب فردي أبسط — كود تشاركه وتستلم عنه مبلغاً ثابتاً؟ ',
      link: { label: 'انتقل إلى برنامج الإحالة ←', href: localePath('ar', '/referral') },
    },
  },
  audience: {
    shows: true,
    eyebrow: 'لمن هذا البرنامج',
    heading: 'لمن هذا البرنامج',
    kinds: [
      { title: 'المكاتب الهندسية الاستشارية', text: 'التي تشرف على مشاريع مطوّرين من القطاع الخاص.' },
      { title: 'شركات إدارة المشاريع (PMC)', text: 'التي تدير محافظ مشاريع لعملاء متعددين.' },
      { title: 'مجموعات المقاولات', text: 'التي تنفّذ عدة مشاريع بالتوازي وتحتاج سجلاً موحّداً مع الاستشاري.' },
      { title: 'مطوّرون عقاريون متعددو المشاريع', text: 'الذين يريدون ترتيباً على مستوى المحفظة لا المشروع الواحد.' },
    ],
  },
  modes: {
    shows: true,
    eyebrow: 'أنماط التعاون',
    heading: 'ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك',
    modes: [
      {
        number: '01',
        label: 'التضمين في العرض',
        title: 'المنصة ضمن نطاق خدماتك',
        text: 'تُدرج المنصة ضمن نطاق خدماتك في العرض الذي تقدّمه للمالك، وتفوترها ضمن أتعابك. يحصل المكتب على تسعير شريك، وتبقى علاقة العميل التعاقدية معك.',
        markedOut: false,
        fit: 'مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.',
      },
      {
        number: '02',
        label: 'رخصة المكتب',
        title: 'اشتراك على مستوى المكتب',
        text: 'يغطي مشاريعه القائمة والجديدة تحت مظلة واحدة، بلوحة إشراف موحّدة على كل المشاريع.',
        markedOut: false,
        fit: 'مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.',
      },
      {
        number: '03',
        label: 'الترشيح المعتمد',
        title: 'نتعاقد نحن مع المالك',
        text: 'ترشّح المنصة للمالك ونتعاقد نحن معه مباشرة، مع ترتيب متفق عليه للمكتب وأولوية في الدعم على مشاريعه.',
        markedOut: false,
        fit: 'مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.',
      },
    ],
    // Each run of text one string, so the bold lands where the Reference
    // site's does.
    note: [
      'شروط كل نمط — التسعير، مدى الحصرية، حدود الجغرافيا أو نوع العميل — تُحدَّد في اتفاقية الشراكة بعد اجتماع تصميم النموذج. ',
      { strong: 'لا نضع تسعيراً موحّداً' },
      ' لأن المكاتب تختلف في حجمها وطبيعة عملائها.',
    ],
  },
  benefits: {
    shows: true,
    eyebrow: 'ما يحصل عليه الشريك',
    heading: 'ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية',
    benefits: [
      { lead: 'تسعير شريك', rest: 'متفق عليه في الاتفاقية' },
      { lead: 'مدير حساب مخصص', rest: 'ونقطة تواصل واحدة' },
      { lead: 'تأهيل فريقك', rest: 'على المنصة، وإعادة التأهيل عند انضمام موظفين جدد' },
      { lead: 'دعم فني بأولوية', rest: 'لمشاريعك ولعملائك' },
      { lead: 'إعداد المشروع نيابةً عنك', rest: 'عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع' },
      { lead: 'لوحة شريك', rest: 'تعرض مشاريعك النشطة وحالة كل منها' },
      { lead: 'تسويق مشترك', rest: '— ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع' },
      { lead: 'أولوية في خارطة الطريق', rest: 'لطلبات التطوير المتكررة من مشاريعك' },
    ],
  },
  path: {
    shows: true,
    eyebrow: 'مسار الشراكة',
    heading: 'من أول اجتماع إلى أول مشروع',
    lead: 'أربع مراحل واضحة، ولا شيء منها يحتاج قراراً نهائياً منك قبل أن ترى المنصة كما يستخدمها الاستشاري فعلياً.',
    link: { label: 'اطلب اجتماع شراكة', href: '#apply' },
    stageLabel: 'المرحلة',
    stages: [
      {
        number: '01',
        title: 'اجتماع تعارف',
        text: 'جلسة نفهم فيها حجم مكتبك، طبيعة عملائك، وكيف تُبنى عروضك اليوم. ونعرض المنصة كما يستخدمها الاستشاري فعلياً.',
      },
      {
        number: '02',
        title: 'تصميم نموذج التعاون',
        text: 'نتفق على النمط، وآليات التسعير، والالتزامات المتبادلة، ومؤشرات النجاح.',
      },
      {
        number: '03',
        title: 'الاتفاقية والتأهيل',
        text: 'توقيع اتفاقية الشراكة، وتأهيل فريقك، وتجهيز المواد التي تحتاجها لعرض المنصة على عملائك.',
      },
      {
        number: '04',
        title: 'الإطلاق على أول مشروع',
        text: 'نُطلق معك على مشروع واحد كنموذج، ونتابع معك أولاً بأول حتى يستقر العمل.',
      },
    ],
  },
  questions: {
    shows: true,
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل الاجتماع الأول',
    entries: PARTNERSHIP_FAQ,
  },
  apply: {
    shows: true,
    eyebrow: 'طلب شراكة',
    heading: 'خلّنا نجلس ونصمّم النموذج المناسب لمكتبك',
    lead: 'املأ النموذج، ويتواصل معك فريق الشراكات خلال يومي عمل.',
    reassurances: [
      'لا رسوم انضمام، ولا التزام قبل اجتماع التعارف',
      'الاجتماع الأول يشمل عرض المنصة',
      'نموذج التعاون يُكتب في اتفاقية، لا في وعد شفهي',
    ],
    responseTime: { figure: 'يوما عمل', label: 'مدة الرد على طلبك' },
  },
};

/** The partnership page's content in `locale`, or a refusal (`inLocale`). */
export async function getPartnershipPage(locale: Locale): Promise<PartnershipPageContent> {
  return inLocale('partnership', { ar: AR }, locale);
}
