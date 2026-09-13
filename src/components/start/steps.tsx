import { StepCards, type StepCard } from '@/components/step-cards';

/**
 * «كيف نبدأ معك» on the start page: the three steps to going live, the
 * guarantee last and marked out.
 *
 * The home and product pages say the same three steps in a shorter list beside
 * the demo request form (`src/components/closing-section.tsx`); the Reference
 * site words the two differently, and each is kept as it wrote it.
 *
 * All copy is verbatim from `reference/site/start.html`.
 */
const STEPS: readonly StepCard[] = [
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
];

export function Steps() {
  return (
    <section id="start" className="light pad">
      <div className="wrap">
        <div className="eyebrow">كيف نبدأ معك</div>
        <h2>فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.</h2>
        <StepCards steps={STEPS} />
      </div>
    </section>
  );
}
