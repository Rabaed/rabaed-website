import type { DescribedScreenMock } from '@/content/screen-mock-descriptions';

/**
 * The product page's «ماذا يرى كل طرف» section: what each of the three parties
 * sees when it opens Rabaed, the objection that party raises, and the answer.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */

export type Role = {
  /** The tab's label. */
  readonly party: string;
  /** The promise, as the heading. */
  readonly promise: string;
  readonly body: string;
  /** What this party says against a new system, in the party's own words and quotation marks. */
  readonly objection: string;
  readonly answer: string;
  readonly mock: DescribedScreenMock;
};

export const ROLES_EYEBROW = 'لكل طرف';
export const ROLES_HEADING = 'ماذا يرى كل طرف حين يفتح المنصة؟';

export const ROLES: readonly Role[] = [
  {
    party: 'المالك / المطوّر',
    promise: 'لوحة واحدة لكل مشاريعك.',
    body: 'ما ينتظر اعتمادك، ما تجاوز مهلته، وما حدث في الموقع اليوم — بلا اجتماع متابعة، وبلا ملف إكسل يحتاج من يحدّثه.',
    objection: '«ما عندي وقت أتابع نظاماً جديداً.»',
    answer: 'لا تدخله لتتابع، بل لتعتمد. وما عدا ذلك يصلك مقروءاً في لوحة واحدة.',
    mock: 'overview',
  },
  {
    party: 'الاستشاري',
    promise: 'طلبات المقاول في قائمة واحدة.',
    body:
      'كل طلبات التسليم والفحص والاعتماد أمامك بحالتها. تعتمد بملاحظاتك من المكتب أو من الموقع، وتُصدر NCR وتعليمات الموقع من الجوال — وكلها موثّقة باسمك ووقتك.',
    objection: '«سيُحمّلنا مسؤولية التأخير.»',
    answer: 'بالعكس: يوثّق أنك رددت في وقتك، ويوثّق الطلب الذي وصلك ناقصاً كما وصل.',
    mock: 'approvals-table',
  },
  {
    party: 'المقاول',
    promise: 'طلب واحد بدل خمس رسائل.',
    body: 'ترفع الطلب، تعرف من استلمه ومتى، وتعرف حالته دون مكالمة. وإن تأخر الاعتماد — سجلك جاهز يُظهر متى أرسلت ومتى وصل.',
    objection: '«سيُستخدم ضدنا.»',
    answer: 'السجل واحد للجميع: يوثّق تقديمك في موعده كما يوثّق تأخر الرد عليه.',
    mock: 'submittal',
  },
];

/** What every party gets, whichever is chosen. */
export const SHARED_PROMISES: readonly string[] = [
  'نماذج عربية بالمعايير السعودية',
  'إصدار واحد معتمد',
  'صلاحيات لكل جهة',
  'يعمل من الجوال',
  'يدعم الإنجليزية للفرق غير العربية',
];
