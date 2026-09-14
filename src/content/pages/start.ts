import type { TrustStripContent } from '@/components/home/trust-strip';
import type { PageHeroContent } from '@/components/page-hero';
import type { StartQuestionsContent } from '@/components/start/questions';
import type { StartStepsContent } from '@/components/start/steps';
import { START_FAQ } from '@/content/faq';
import { TRUST_STRIP } from '@/content/trust-strip';
import type { FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { formPageWording } from '@/forms/settings';
import { localePath, type Locale } from '@/lib/locales';
import { inLocale, type LinkedSection, type PageMeta, type Section } from './page-content';

export type StartPageContent = {
  readonly meta: PageMeta;
  readonly hero: PageHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  readonly steps: Section<StartStepsContent>;
  /** The home page's «كل الأسئلة» and this page's hero both land here. */
  readonly questions: LinkedSection<StartQuestionsContent>;
  /** The words of the demo request form beside the questions: its settings in the CMS. */
  readonly demoForm: FormPageWording<DemoRequestField>;
};

/** Verbatim from `reference/site/start.html`. */
const AR: Omit<StartPageContent, 'demoForm'> = {
  meta: {
    title: 'ربائد · ابدأ — كيف نبدأ والأسئلة الشائعة',
    description: 'ثلاث خطوات حتى التشغيل، الضمان، الاشتراك، والأسئلة الشائعة.',
  },
  hero: {
    eyebrow: 'ابدأ',
    title: 'كيف نبدأ معك — وكل ما قد تسأل عنه.',
    lead: 'ثلاث خطوات حتى التشغيل، وإجابات صريحة عن الاشتراك والضمان والنماذج والسجل بعد نهاية المشروع.',
    // Both land further down this page: the form, and the questions.
    primary: { label: 'احجز عرضاً حياً', href: '#demo' },
    secondary: { label: 'الأسئلة الشائعة ↓', href: '#faq' },
  },
  // The Reference site's start page carries the same strip as its home page,
  // under the same label.
  trustStrip: { shows: true, ...TRUST_STRIP.ar },
  steps: {
    shows: true,
    eyebrow: 'كيف نبدأ معك',
    heading: 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
    steps: [
      {
        number: '01',
        label: 'إعداد',
        title: 'المشروع، الأطراف، النماذج',
        text: 'فريقنا يُعدّ المشروع ويدعو المالك والاستشاري والمقاول، ويجلس مع كل فريق 15 دقيقة.',
        markedOut: false,
      },
      {
        number: '02',
        label: 'تشغيل',
        title: 'أقل من يوم — دون توقف للعمل',
        text: 'يبدأ الجميع من حيث وصل المشروع. لا تدريب، ولا فترة انتقالية.',
        markedOut: false,
      },
      {
        number: '03',
        label: 'ضمان',
        title: '60 يوماً — أو نعيد المبلغ',
        text: 'شغّلوها على مشروع حقيقي. إن قررتم التوقف خلال 60 يوماً من التفعيل، نعيد كامل المبلغ.',
        // The guarantee.
        markedOut: true,
      },
    ],
  },
  questions: {
    shows: true,
    eyebrow: 'الأسئلة الشائعة',
    heading: 'قبل أن تسأل',
    entries: START_FAQ,
    freeTool: {
      eyebrow: 'أداة مجانية',
      heading: 'سجل صبّات الخرسانة ونتائج التكسير',
      text: 'أداة مستقلة تعمل بلا حساب وبلا إنترنت — للمهندس في الموقع. من فريق ربائد.',
      link: { label: 'تحميل الأداة', href: localePath('ar', '/tool') },
    },
  },
};

/** The start page's content in `locale`, or a refusal (`inLocale`). */
export async function getStartPage(locale: Locale): Promise<StartPageContent> {
  return { ...inLocale('start', { ar: AR }, locale), demoForm: await formPageWording(DEMO_REQUEST) };
}
