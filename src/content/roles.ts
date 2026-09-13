import type { RolesContent } from '@/components/product/roles';
import { SCREEN_MOCK_DESCRIPTIONS } from '@/content/screen-mock-descriptions';

/**
 * The product page's «ماذا يرى كل طرف» section: what each of the three parties
 * sees when it opens Rabaed, the objection that party raises, and the answer.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */
export const ROLES: { readonly ar: RolesContent } = {
  ar: {
    eyebrow: 'لكل طرف',
    heading: 'ماذا يرى كل طرف حين يفتح المنصة؟',
    roles: [
      {
        party: 'المالك / المطوّر',
        promise: 'لوحة واحدة لكل مشاريعك.',
        body: 'ما ينتظر اعتمادك، ما تجاوز مهلته، وما حدث في الموقع اليوم — بلا اجتماع متابعة، وبلا ملف إكسل يحتاج من يحدّثه.',
        objection: '«ما عندي وقت أتابع نظاماً جديداً.»',
        answer: 'لا تدخله لتتابع، بل لتعتمد. وما عدا ذلك يصلك مقروءاً في لوحة واحدة.',
        screen: { mock: 'overview', description: SCREEN_MOCK_DESCRIPTIONS.overview },
      },
      {
        party: 'الاستشاري',
        promise: 'طلبات المقاول في قائمة واحدة.',
        body:
          'كل طلبات التسليم والفحص والاعتماد أمامك بحالتها. تعتمد بملاحظاتك من المكتب أو من الموقع، وتُصدر NCR وتعليمات الموقع من الجوال — وكلها موثّقة باسمك ووقتك.',
        objection: '«سيُحمّلنا مسؤولية التأخير.»',
        answer: 'بالعكس: يوثّق أنك رددت في وقتك، ويوثّق الطلب الذي وصلك ناقصاً كما وصل.',
        screen: { mock: 'approvals-table', description: SCREEN_MOCK_DESCRIPTIONS['approvals-table'] },
      },
      {
        party: 'المقاول',
        promise: 'طلب واحد بدل خمس رسائل.',
        body: 'ترفع الطلب، تعرف من استلمه ومتى، وتعرف حالته دون مكالمة. وإن تأخر الاعتماد — سجلك جاهز يُظهر متى أرسلت ومتى وصل.',
        objection: '«سيُستخدم ضدنا.»',
        answer: 'السجل واحد للجميع: يوثّق تقديمك في موعده كما يوثّق تأخر الرد عليه.',
        screen: { mock: 'submittal', description: SCREEN_MOCK_DESCRIPTIONS.submittal },
      },
    ],
    sharedPromises: [
      'نماذج عربية بالمعايير السعودية',
      'إصدار واحد معتمد',
      'صلاحيات لكل جهة',
      'يعمل من الجوال',
      'يدعم الإنجليزية للفرق غير العربية',
    ],
  },
};
