/**
 * What each Screen mock shows, in words — one sentence per mock, used wherever
 * the mock is placed, as the image's `alt` and as the visible caption under it.
 * ADR-0002 asks for both: a mock's text is a picture of text, invisible to
 * search engines, AI crawlers and screen readers, so the claim it makes has to
 * be made again in real text.
 *
 * **One place, now that it can be.** Ticket 05 kept descriptions out of the
 * registry because the Reference site describes a mock differently on each
 * page. That difference turned out to be the home page *naming* its screens
 * where the product page *describes* them (ticket 08), and a name is not a
 * claim — so the product page's descriptions, verbatim, are the ones used on
 * both pages.
 *
 * **Here rather than in `src/screen-mocks/registry.ts`.** The registry is what
 * the export script imports under plain Node, and says how a mock is drawn;
 * this is copy, and ticket 21 moves copy into the CMS.
 */
export const SCREEN_MOCK_DESCRIPTIONS = {
  correspondence: 'شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف',
  kanban:
    'لوحة كانبان للاعتمادات في ربائد: مسودة، مراجعة داخلية بمسارَي مهندس المقاول ومدير المشروع، ثم انتظار الموافقة والمعتمدة',
  'daily-report':
    'تفاصيل التقرير اليومي في ربائد: الطقس والموقع، جدولا الفريق الإداري والعمالة بالعدد والساعات، والأنشطة والصور',
  documents: 'مستودع المستندات في ربائد: المجلدات وجدول الملفات بالإصدار والنوع ومعرف المصدر ومن رفعه',
  'stamped-sheet': 'ورقة الاعتماد المختومة في ربائد: أربعة توقيعات بالدور والشركة ووقت الفعل، ورمز الاعتماد B، والختم',
  overview: 'ما يراه المالك في ربائد: لوحة مشروع واحدة بمؤشرات الاعتمادات وأطراف المشروع',
  'approvals-table': 'ما يراه الاستشاري في ربائد: جدول الاعتمادات والطلبات بحالاتها وتخصصاتها وأنواعها',
  submittal: 'ما يراه المقاول في ربائد: تفاصيل الطلب وقسم الموافقات باسم كل من تصرّف ووقته',
} as const;

/** A Screen mock that has a description — which a page must name to place one. */
export type DescribedScreenMock = keyof typeof SCREEN_MOCK_DESCRIPTIONS;
