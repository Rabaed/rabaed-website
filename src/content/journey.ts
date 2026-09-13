import type { DescribedScreenMock } from '@/content/screen-mock-descriptions';

/**
 * The product page's journey: a panel for each of Rabaed's four units, and a
 * fifth for the Record they produce, each beside the Screen mock that shows it.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */

export type JourneyPanel = {
  /** A unit, numbered by its place in the journey; or what the units produce, named. */
  readonly tag: { readonly kind: 'unit' } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /** The one-line promise under the title. */
  readonly tagline: string;
  readonly body: string;
  /**
   * Who the unit passes things between, as the row of pills at the foot of the
   * panel. Each entry is a party, except two marks: `'←'`, drawn between two
   * parties as the direction something travels, and `'·'`, which separates
   * one route from the next. Empty for a panel with no row.
   */
  readonly flow: readonly string[];
  /** The Screen mock the panel shows, which is also what its description is looked up by. */
  readonly mock: DescribedScreenMock;
};

export const JOURNEY_EYEBROW = 'المنصة';
export const JOURNEY_HEADING = 'أربع وحدات. سجل واحد يجمعها.';

export const JOURNEY_PANELS: readonly JourneyPanel[] = [
  {
    tag: { kind: 'unit' },
    title: 'المراسلات الرسمية',
    tagline: 'خطاب برقم مرجعي، وإشعار استلام لا يُنكر.',
    body: 'خطابات، محاضر اجتماعات، استفسارات RFI — بترقيم مرجعي آلي، وإشعار استلام تلقائي يسجّل من استلم ومتى.',
    flow: ['أي طرف', '←', 'أي طرف'],
    mock: 'correspondence',
  },
  {
    tag: { kind: 'unit' },
    title: 'الاعتمادات والطلبات',
    tagline: 'من اعتماد المادة إلى طلب التسليم: مسار واحد بين المقاول والاستشاري.',
    body:
      'اعتمادات الموردين والمواد والمخططات والمستندات · طلبات تسليم الأعمال WIR وفحص المواد MIR وإذن الأعمال · وبالاتجاه المقابل: عدم المطابقة NCR، تعليمات الموقع، وملاحظات التسليم النهائي.',
    flow: ['المقاول', '←', 'الاستشاري', '·', 'الاستشاري', '←', 'المقاول'],
    mock: 'kanban',
  },
  {
    tag: { kind: 'unit' },
    title: 'التقرير اليومي للموقع',
    tagline: 'ما حدث في الموقع اليوم، عند المالك قبل أن ينتهي اليوم.',
    body: 'العمالة، المعدات، الطقس، إنتاجية اليوم، الصور — يُرفع من الجوال في الموقع ويظهر في لوحة المالك فوراً.',
    flow: ['الموقع', '←', 'الاستشاري', '←', 'المالك'],
    mock: 'daily-report',
  },
  {
    tag: { kind: 'unit' },
    title: 'المستندات والإصدارات',
    tagline: 'الجميع على آخر إصدار معتمد — ولا أحد يرى أكثر مما يخصه.',
    body: 'مستودع واحد للمشروع: المخططات والمستندات بإصداراتها، الإصدار المعتمد فقط هو الظاهر للموقع، وصلاحيات محددة لكل جهة.',
    flow: ['المالك', 'الاستشاري', 'المقاول'],
    mock: 'documents',
  },
  {
    tag: { kind: 'output', name: 'المخرَج' },
    title: 'السجل الموثّق',
    tagline: 'ثلاثة أطراف. سجل واحد.',
    body:
      'كل مستند في ربائد يحمل تاريخه كاملاً: متى أُرسل، من استلمه، من دققه، من اعتمده — وبأي ملاحظات ومتى. ليس ميزة تُفعَّل، بل نتيجة كل خطوة.',
    flow: [],
    mock: 'stamped-sheet',
  },
];
