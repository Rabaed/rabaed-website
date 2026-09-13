/**
 * The situations on the home page's first deck: things people on a
 * construction project actually say, each with what it costs them.
 *
 * Written in the Gulf dialect a site engineer speaks, not in formal Arabic, and
 * deliberately so — the section works because a visitor recognises the
 * sentence. They are situations rather than testimonials: nobody is named,
 * nothing is attributed, and no figure is claimed.
 *
 * Verbatim from `reference/site/index.html`. Ticket 21 moves page copy into the
 * CMS; until then it is here.
 */

export type FieldSituation = {
  /** What gets said on site. */
  readonly quote: string;
  /** What it costs, shown under «الثمن». */
  readonly cost: string;
};

export const FIELD_SITUATIONS: readonly FieldSituation[] = [
  {
    quote: 'المقاول يقول الاستشاري مأخّر الشغل… والاستشاري يقول ما وصله شي.',
    cost: 'نزاع بلا مرجع، وكل طرف معه نسخته.',
  },
  {
    quote: 'الداشبورد يقرأ من ملف إكسل… والمهندس ما فضي يحدّثه.',
    cost: 'قرار مبني على رقم قديم.',
  },
  {
    quote: 'ملفين إكسل، تاريخين لنفس المستند… ونرجع للنسخة الورقية نتأكد.',
    cost: 'ساعات ضائعة على سؤال واحد: وين وقف الموضوع؟',
  },
  {
    quote: 'الاعتماد وصل بالإيميل قبل شهور… وما أحد يلقاه.',
    cost: 'اعتماد موجود ولا يمكن إثباته.',
  },
  {
    quote: 'الجدول الزمني تحدّث… والمطوّر ما يدري وش أثره على التسليم.',
    cost: 'المفاجأة في موعد التسليم، لا في اجتماع المتابعة.',
  },
  {
    quote: 'بعد نهاية المشروع احتجنا اعتماداً قديماً… والشيرفولدر مقفولة صلاحياته.',
    cost: 'سجل المشروع يضيع مع انتهاء المشروع.',
  },
];
