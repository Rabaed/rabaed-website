import type { FlowStep, ProductJourneyContent } from '@/components/product/journey';
import { SCREEN_MOCK_DESCRIPTIONS } from '@/content/screen-mock-descriptions';

/**
 * The product page's journey: a panel for each of Rabaed's four units, and a
 * fifth for the Record they produce, each beside the Screen mock that shows it.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */

/** Right to left, the arrow points left: from the party before it to the one after. */
const TOWARDS: FlowStep = { towards: '←' };
const THEN: FlowStep = { then: '·' };

export const JOURNEY: { readonly ar: ProductJourneyContent } = {
  ar: {
    eyebrow: 'المنصة',
    heading: 'أربع وحدات. سجل واحد يجمعها.',
    panels: [
      {
        tag: { kind: 'unit' },
        title: 'المراسلات الرسمية',
        tagline: 'خطاب برقم مرجعي، وإشعار استلام لا يُنكر.',
        body: 'خطابات، محاضر اجتماعات، استفسارات RFI — بترقيم مرجعي آلي، وإشعار استلام تلقائي يسجّل من استلم ومتى.',
        flow: [{ party: 'أي طرف' }, TOWARDS, { party: 'أي طرف' }],
        screen: { mock: 'correspondence', description: SCREEN_MOCK_DESCRIPTIONS.correspondence },
      },
      {
        tag: { kind: 'unit' },
        title: 'الاعتمادات والطلبات',
        tagline: 'من اعتماد المادة إلى طلب التسليم: مسار واحد بين المقاول والاستشاري.',
        body:
          'اعتمادات الموردين والمواد والمخططات والمستندات · طلبات تسليم الأعمال WIR وفحص المواد MIR وإذن الأعمال · وبالاتجاه المقابل: عدم المطابقة NCR، تعليمات الموقع، وملاحظات التسليم النهائي.',
        flow: [
          { party: 'المقاول' },
          TOWARDS,
          { party: 'الاستشاري' },
          THEN,
          { party: 'الاستشاري' },
          TOWARDS,
          { party: 'المقاول' },
        ],
        screen: { mock: 'kanban', description: SCREEN_MOCK_DESCRIPTIONS.kanban },
      },
      {
        tag: { kind: 'unit' },
        title: 'التقرير اليومي للموقع',
        tagline: 'ما حدث في الموقع اليوم، عند المالك قبل أن ينتهي اليوم.',
        body: 'العمالة، المعدات، الطقس، إنتاجية اليوم، الصور — يُرفع من الجوال في الموقع ويظهر في لوحة المالك فوراً.',
        flow: [{ party: 'الموقع' }, TOWARDS, { party: 'الاستشاري' }, TOWARDS, { party: 'المالك' }],
        screen: { mock: 'daily-report', description: SCREEN_MOCK_DESCRIPTIONS['daily-report'] },
      },
      {
        tag: { kind: 'unit' },
        title: 'المستندات والإصدارات',
        tagline: 'الجميع على آخر إصدار معتمد — ولا أحد يرى أكثر مما يخصه.',
        body: 'مستودع واحد للمشروع: المخططات والمستندات بإصداراتها، الإصدار المعتمد فقط هو الظاهر للموقع، وصلاحيات محددة لكل جهة.',
        flow: [{ party: 'المالك' }, { party: 'الاستشاري' }, { party: 'المقاول' }],
        screen: { mock: 'documents', description: SCREEN_MOCK_DESCRIPTIONS.documents },
      },
      {
        tag: { kind: 'output', name: 'المخرَج' },
        title: 'السجل الموثّق',
        tagline: 'ثلاثة أطراف. سجل واحد.',
        body:
          'كل مستند في ربائد يحمل تاريخه كاملاً: متى أُرسل، من استلمه، من دققه، من اعتمده — وبأي ملاحظات ومتى. ليس ميزة تُفعَّل، بل نتيجة كل خطوة.',
        flow: [],
        screen: { mock: 'stamped-sheet', description: SCREEN_MOCK_DESCRIPTIONS['stamped-sheet'] },
      },
    ],
  },
};
