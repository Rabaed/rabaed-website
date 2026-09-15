import type { PageHeroContent } from '@/components/page-hero';
import type { QuestionsContent } from '@/components/questions';
import type { ReferralAudienceContent } from '@/components/referral/audience';
import type { ReferralHowItWorksContent } from '@/components/referral/how-it-works';
import type { ReferralOfferContent } from '@/components/referral/offer';
import type { ReferralSignupContent } from '@/components/referral/signup';
import type { ReferralTermsSummaryContent } from '@/components/referral/terms-summary';
import type { ReferralWhatIsReferredContent } from '@/components/referral/what-is-referred';
import { REFERRAL_PROGRAM_VALUES } from '@/content/referral-program';
import type { FormPageWording } from '@/forms/definition';
import { REFERRAL_SIGNUP, type ReferralSignupField } from '@/forms/referral-signup';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, withQuestions, type BeforeQuestions, type LinkedSection, type PageMeta, type Section } from './page-content';

export type ReferralPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  /** The hero's «كيف يعمل البرنامج ↓» lands here. */
  readonly howItWorks: LinkedSection<ReferralHowItWorksContent>;
  readonly offer: Section<ReferralOfferContent>;
  readonly audience: Section<ReferralAudienceContent>;
  readonly whatIsReferred: Section<ReferralWhatIsReferredContent>;
  readonly termsSummary: Section<ReferralTermsSummaryContent>;
  readonly questions: Section<QuestionsContent>;
  /** The hero's «سجّل واحصل على كودك» lands here. */
  readonly signup: LinkedSection<ReferralSignupContent>;
  /** The words of the signup form: its settings in the CMS. */
  readonly signupForm: FormPageWording<ReferralSignupField>;
};

const { payout, clientDiscount } = REFERRAL_PROGRAM_VALUES;

/**
 * All copy is verbatim from `reference/site/referral.html`. Every amount it
 * quotes, the payout and the client discount, is inserted from the Referral
 * Program values rather than typed, so the page cannot disagree with itself.
 */
const AR: BeforeQuestions<Omit<ReferralPageContent, 'signupForm'>> = {
  meta: {
    name: 'برنامج الإحالة',
    title: `ربائد · برنامج الإحالة — ${payout} ريال عن كل مشروع`,
    description: `أحِل مشروعاً واحداً واكسب ${payout} ريال صافية، ويحصل عميلك على خصم ${clientDiscount} على اشتراك مشروعه.`,
  },
  hero: {
    eyebrow: 'برنامج الإحالة',
    title: `أحِل مشروعاً واحداً. اكسب ${payout} ريال.`,
    lead: `تعرف مطوّراً يدير مشروعه على الإيميل والواتساب؟ شارك كودك، واحصل على ${payout} ريال عن كل مشروع يبدأ معنا — ويحصل هو على خصم على اشتراكه.`,
    // Both land further down this page.
    primary: { label: 'سجّل واحصل على كودك', href: '#signup' },
    secondary: { label: 'كيف يعمل البرنامج ↓', href: '#how' },
    figures: [
      { figure: [{ mono: payout }, ' ريال'], label: 'عن كل مشروع' },
      { figure: [{ mono: clientDiscount }], label: 'خصم لعميلك' },
      { figure: 'بلا حد', label: 'عدد المشاريع' },
    ],
  },
  howItWorks: {
    shows: true,
    eyebrow: 'كيف يعمل',
    heading: 'أربع خطوات، وينتهي دورك بعد الثانية',
    steps: [
      {
        number: '01',
        label: 'سجّل',
        title: 'دقيقة واحدة',
        text: 'املأ نموذجاً من دقيقة واحدة، ويصلك كودك الخاص فوراً على جوالك وبريدك.',
        markedOut: false,
      },
      {
        number: '02',
        label: 'شارك الكود',
        title: 'مع صاحب القرار',
        text: `الكود يمنحه خصم ${clientDiscount} على اشتراك مشروعه — فهو سبب حقيقي ليستخدمه، لا مجرد معرّف لك.`,
        markedOut: false,
      },
      {
        number: '03',
        label: 'نتولّى الباقي',
        title: 'لا متابعة ولا بيع',
        text: 'يطلب العرض التوضيحي ويُدخل الكود. فريقنا يتواصل معه، ويعرض المنصة، ويتفق على التفاصيل.',
        markedOut: false,
      },
      {
        number: '04',
        label: 'استلم مستحقاتك',
        title: 'خلال 7 أيام عمل',
        text: `عند تحصيل قيمة الاشتراك، تُحوَّل ${payout} ريال على حسابك خلال 7 أيام عمل من نهاية ذلك الشهر.`,
        // The payout.
        markedOut: true,
      },
    ],
  },
  offer: {
    shows: true,
    eyebrow: 'المبلغ والخصم',
    heading: 'مبلغ ثابت. بلا شرائح، بلا حسابات.',
    paragraphs: [
      [
        'اخترنا مبلغاً ثابتاً معلوماً بدل النسب المتغيّرة: ',
        { strong: `${payout} ريال صافية عن كل مشروع` },
        ' يبدأ اشتراكه بكودك — سواء كان مشروعاً من عشرة آلاف متر أو ثلاثين ألفاً. تعرف ما ستستلمه قبل أن تُحيل، ولا تحتاج أن تسأل عن قيمة الاشتراك.',
      ],
      'ولا يوجد حد أقصى لعدد المشاريع التي تُحيلها في السنة.',
    ],
    sides: [
      { badge: 'لك', title: `${payout} ريال صافية`, text: 'عن كل مشروع، تُحوَّل على حسابك البنكي مباشرة.' },
      { badge: 'لعميلك', title: `خصم ${clientDiscount}`, text: 'على اشتراك المشروع، بمجرّد استخدام كودك.' },
    ],
  },
  audience: {
    shows: true,
    eyebrow: 'لمن هذا البرنامج',
    heading: 'إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا',
    lead: 'البرنامج مفتوح لكل من يعمل في محيط مشاريع التطوير العقاري في السعودية:',
    kinds: [
      { title: 'مهندسون ومديرو مشاريع', text: 'تعرف من قرب كيف تضيع المراسلات والاعتمادات.' },
      { title: 'استشاريون مستقلون', text: 'تنتقل بين مشاريع ومطوّرين مختلفين.' },
      { title: 'مقاولون ومكاتب تنفيذ', text: 'تعمل مع أكثر من مالك في وقت واحد.' },
      { title: 'مستشارو تطوير عقاري ووسطاء', text: 'علاقتك بالمطوّرين هي أصلك الحقيقي.' },
      { title: 'صنّاع محتوى متخصصون', text: 'جمهورك من أهل القطاع.' },
    ],
    partnership: {
      // The sentence after the bold is one string, its trailing space
      // included: split in two, the server marks the join with a comment, the
      // browser lays out two runs of text, and the link lands a hundredth of a
      // pixel off the Reference site's.
      text: [
        'إن كنت ',
        { strong: 'مكتباً هندسياً أو شركة إدارة مشاريع' },
        ' وتريد ترتيباً أوسع من الإحالة الفردية، فبرنامج الشراكات هو الأنسب لك. ',
      ],
      link: { label: 'انتقل إلى برنامج الشراكات ←', href: localePath('ar', '/partnership') },
    },
  },
  whatIsReferred: {
    shows: true,
    eyebrow: 'ما الذي تُحيله',
    heading: 'ما الذي تُحيله بالضبط؟',
    paragraphs: [
      'ربائد منصّة تجمع المالك والاستشاري والمقاول على سجل واحد للمشروع: المراسلات الرسمية ومحاضر الاجتماعات وطلبات المعلومات، والاعتمادات وطلبات الفحص والتفتيش، والتقرير اليومي للموقع، ومستودع مستندات بأحدث نسخة معتمدة.',
      'كل مستند يحمل معه متى أُرسل، ومن اعتمده، وبأي ملاحظة، ومتى — فيبقى سجل المشروع كاملاً بعد تسليمه، لا مبعثراً بين بريد وواتساب ومجلدات مشتركة انتهت صلاحيتها.',
    ],
    link: { label: 'تعرّف على المنصة', href: localePath('ar', '/product') },
  },
  termsSummary: {
    shows: true,
    eyebrow: 'الشروط باختصار',
    heading: 'الشروط في ثماني نقاط',
    terms: [
      { lead: 'الإحالة بالمشروع لا بالعميل.', rest: ' تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.' },
      { lead: 'يُقدَّم الكود عند طلب العرض التوضيحي', rest: '، أي قبل بدء التفاوض — لا عند التوقيع.' },
      { lead: 'لا يُقبل الكود لعميل قائم', rest: ' أو لمشروع سبق أن تواصلنا بشأنه مع المالك.' },
      { lead: 'الاشتراك السنوي المدفوع مقدماً', rest: ' هو ما يُحتسب عليه المبلغ.' },
      { lead: 'الاستحقاق عند تحصيل قيمة الاشتراك', rest: '، لا عند التوقيع.' },
      { lead: 'الصرف خلال 7 أيام عمل', rest: ' من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.' },
      { lead: 'الإلغاء والاسترداد', rest: ' خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.' },
      { lead: 'إقرار عدم التعارض', rest: ' يُوقَّع إلكترونياً عند التسجيل.' },
    ],
    // The full terms are binding where this is a summary (ticket 17).
    link: { label: 'الشروط والأحكام الكاملة', href: localePath('ar', '/referral-terms') },
  },
  questions: {
    shows: true,
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل أن تسجّل',
  },
  signup: {
    shows: true,
    eyebrow: 'التسجيل',
    heading: 'كودك جاهز خلال دقيقة',
    lead: 'سجّل الآن، وشارك الكود مع أول مطوّر يخطر ببالك.',
    benefits: [
      'يصلك الكود فوراً على جوالك وبريدك',
      'لا رسوم انضمام، ولا التزام بعدد إحالات',
      'دورك ينتهي عند مشاركة الكود',
      `${payout} ريال صافية عن كل مشروع، بلا حد أقصى`,
    ],
    // Only the numeral is `.mono`, as in every guarantee pill.
    guarantee: { figure: [{ mono: '7' }, ' أيام عمل'], text: 'مدة الصرف من نهاية شهر الاستحقاق' },
  },
};

/** The referral page's content in `locale`, or a refusal (`inLocale`), with its questions as the CMS has them. */
export async function getReferralPage(locale: Locale): Promise<ReferralPageContent> {
  const [page, signupForm] = await Promise.all([
    withQuestions<Omit<ReferralPageContent, 'signupForm'>>('referral', locale, inLocale('referral', { ar: AR }, locale)),
    formPageWording(REFERRAL_SIGNUP),
  ]);
  return { ...page, signupForm };
}
