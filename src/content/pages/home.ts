import type { ClosingSectionContent } from '@/components/closing-section';
import type { HomeBeforeAfterContent } from '@/components/home/before-after';
import type { HomeDelayCalculatorContent } from '@/components/home/delay-calculator';
import type { HomeFiguresContent } from '@/components/home/figures';
import type { HomeFourUnitsContent } from '@/components/home/four-units';
import type { HomeHeroContent } from '@/components/home/hero';
import type { HomeQuestionsContent } from '@/components/home/questions';
import type { HomeRecordSectionContent } from '@/components/home/record';
import type { HomeSituationsContent } from '@/components/home/situations';
import type { TrustStripContent } from '@/components/home/trust-strip';
import { COMPARISON_STEPS } from '@/content/before-after';
import { DECK_HINT } from '@/content/card-deck';
import { CLOSING_SECTION } from '@/content/closing-section';
import { CALCULATOR_WORDS } from '@/content/delay-calculator';
import { HOME_FAQ } from '@/content/faq';
import { FIELD_SITUATIONS } from '@/content/field-situations';
import { UNIT_TABS } from '@/content/four-units';
import { PROOF_FIGURES } from '@/content/proof-figures';
import { TRANSACTION_TYPES } from '@/content/record-transactions';
import { TRUST_STRIP } from '@/content/trust-strip';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, type LinkedSection, type PageMeta, type Section } from './page-content';

export type HomePageContent = {
  readonly meta: PageMeta;
  readonly hero: HomeHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  readonly situations: Section<HomeSituationsContent>;
  readonly fourUnits: Section<HomeFourUnitsContent>;
  readonly record: Section<HomeRecordSectionContent>;
  readonly beforeAfter: Section<HomeBeforeAfterContent>;
  readonly calculator: Section<HomeDelayCalculatorContent>;
  readonly figures: Section<HomeFiguresContent>;
  readonly questions: Section<HomeQuestionsContent>;
  /** Its demo request form (`#demo`) is where this page's hero and calculator buttons, and the header's, land. */
  readonly closing: LinkedSection<ClosingSectionContent>;
};

/**
 * Verbatim from `reference/site/index.html`. Nothing here is placeholder text,
 * and nothing waits to be reworded.
 */
const AR: HomePageContent = {
  meta: {
    title: 'ربائد · ثلاثة أطراف. سجل واحد.',
    description: 'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
  },
  hero: {
    eyebrow: 'نظام تشغيل مشاريع الإنشاء · ربائد',
    title: { lines: ['ثلاثة أطراف.', 'سجل واحد.'], accent: 'مسؤولية واضحة.' },
    lead: 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة باسم من قام بها.',
    // The first jumps to the demo request form at the foot of this page
    // (ticket 11). The second points at `#journey`, which no section on this
    // page carries yet, so it goes nowhere — as the Reference site's own
    // anchors do on its sub-pages.
    primary: { label: 'احجز عرضاً حياً', href: '#demo' },
    secondary: { label: 'استكشف المنصة ↓', href: '#journey' },
    trust: 'عرض على مشروع حقيقي · 30 دقيقة · بالعربية',
    // Only the numeral is `.mono`: DM Mono has no Arabic glyphs, so setting
    // «يوماً» in it drops the word to a last-resort monospace face (spec:
    // Design system). The Reference site wraps both.
    guarantee: { period: [{ mono: '60' }, ' يوماً'], promise: 'ضمان استرجاع كامل المبلغ' },
    parties: { owner: 'المالك', contractor: 'المقاول', consultant: 'الاستشاري' },
    diagramDescription:
      'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.',
    statuses: ['أُرسل · 07:12', 'روجع · 09:20', 'اعتُمد · 12:05', 'وصل السجل للأطراف الثلاثة'],
    statusAtRest: 'موثّق ومؤرخ',
  },
  trustStrip: { shows: true, ...TRUST_STRIP.ar },
  situations: {
    shows: true,
    eyebrow: 'مواقف من الميدان',
    heading: 'تعرف هذه المواقف؟',
    close: {
      first: 'المشكلة ليست البريد الإلكتروني ولا الإكسل.',
      second: 'المشكلة أن الإجراء تحتها',
      accent: 'يدوي، ومشتّت.',
    },
    situations: FIELD_SITUATIONS,
    costLabel: 'الثمن',
    deck: {
      label: 'مواقف من الميدان — اسحب البطاقة أو استخدم الأسهم',
      previousLabel: 'الموقف السابق',
      nextLabel: 'الموقف التالي',
      hint: DECK_HINT,
    },
  },
  fourUnits: {
    shows: true,
    eyebrow: 'المنصة',
    heading: 'أربع وحدات. سجل واحد يجمعها.',
    tabsLabel: 'وحدات ربائد',
    tabs: UNIT_TABS,
    more: { label: 'شاهد الوحدات كاملة بالتفصيل', href: localePath('ar', '/product') },
  },
  record: {
    shows: true,
    eyebrow: 'السجل الموثّق',
    heading: ['لا نسأل "من اعتمد؟"', 'نفتح المعاملة.'],
    questions: ['من طلب؟', 'من استلم؟', 'من اعتمد؟', 'ومتى؟'],
    lead: 'ليست ميزة تُفعَّل — بل نتيجة كل خطوة. أي معاملة تمر في ربائد تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب تسليم أعمال، تحديث على الجدول الزمني، أو مستخلص مالي. وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.',
    types: TRANSACTION_TYPES,
    stamp: '✓ سجل كامل · 4 خطوات · 3 أطراف',
  },
  beforeAfter: {
    shows: true,
    eyebrow: 'قبل وبعد ربائد',
    heading: 'نفس الاعتماد… بطريقتين.',
    lead: [
      'أربع لحظات في اعتماد مادة واحد. ',
      { strong: 'اسحب المقبض' },
      ' ليمرّ على الخطوات — كل خطوة تتحول أمامك من الطريقة المعتادة إلى ربائد.',
    ],
    usualTag: 'الطريقة المعتادة',
    rabaedTag: 'مع ربائد',
    handleLabel: 'اسحب للمقارنة بين الطريقتين',
    verdicts: {
      usual: 'النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.',
      rabaed: 'النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.',
      between: 'اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.',
    },
    steps: COMPARISON_STEPS,
  },
  calculator: {
    shows: true,
    eyebrow: 'حاسبة تكلفة التأخير',
    heading: 'كم يكلفك أسبوع تأخير اعتماد واحد؟',
    lead: 'تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط — قبل أي مطالبة من المقاول.',
    sliderLabels: ['قيمة المشروع', 'أيام التأخير', 'مدة المشروع'],
    resultLabel: 'التكلفة التقديرية للتأخير',
    assumptions:
      'الافتراضات: تكلفة تمويل 8% سنوياً · تكاليف عامة للموقع 10% من قيمة المشروع موزعة على مدته. لا تشمل مطالبات المقاول ولا الغرامات.',
    // To the demo request form at the foot of this page.
    callToAction: { label: 'احجز عرضاً لترى كيف نمنعه', href: '#demo' },
    words: CALCULATOR_WORDS,
  },
  figures: {
    shows: true,
    eyebrow: 'الأثر',
    heading: 'ماذا يتغيّر بعد التشغيل؟',
    lead: 'الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — على مشروع يعمل فيه المالك والاستشاري والمقاول على المنصة نفسها.',
    figures: PROOF_FIGURES,
    deck: {
      label: 'أرقام الأثر — اسحب البطاقة أو استخدم الأسهم',
      previousLabel: 'الرقم السابق',
      nextLabel: 'الرقم التالي',
      hint: DECK_HINT,
    },
  },
  questions: {
    shows: true,
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل أن تسأل',
    entries: HOME_FAQ,
    // The rest of the questions, beside the form on the start page.
    more: { label: 'كل الأسئلة', href: `${localePath('ar', '/start')}#faq` },
  },
  closing: { shows: true, ...CLOSING_SECTION.ar },
};

/** The home page's content in `locale`, or a refusal (`inLocale`). */
export async function getHomePage(locale: Locale): Promise<HomePageContent> {
  return inLocale('home', { ar: AR }, locale);
}
