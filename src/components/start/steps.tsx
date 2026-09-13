/**
 * «كيف نبدأ معك» on the start page: the three steps to going live, each in a
 * card of its own, the guarantee last and marked out.
 *
 * The home and product pages say the same three steps in a shorter list beside
 * the demo request form (`src/components/closing-section.tsx`); the Reference
 * site words the two differently, and each is kept as it wrote it.
 *
 * All copy is verbatim from `reference/site/start.html`.
 */
const STEPS = [
  {
    number: '01',
    label: 'إعداد',
    title: 'المشروع، الأطراف، النماذج',
    text: 'فريقنا يُعدّ المشروع ويدعو المالك والاستشاري والمقاول، ويجلس مع كل فريق 15 دقيقة.',
  },
  {
    number: '02',
    label: 'تشغيل',
    title: 'أقل من يوم — دون توقف للعمل',
    text: 'يبدأ الجميع من حيث وصل المشروع. لا تدريب، ولا فترة انتقالية.',
  },
  {
    number: '03',
    label: 'ضمان',
    title: '60 يوماً — أو نعيد المبلغ',
    text: 'شغّلوها على مشروع حقيقي. إن قررتم التوقف خلال 60 يوماً من التفعيل، نعيد كامل المبلغ.',
  },
] as const;

/** The guarantee: the step the card is marked out for. */
const GUARANTEE = STEPS.length - 1;

export function Steps() {
  return (
    <section id="start" className="light pad">
      <div className="wrap">
        <div className="eyebrow">كيف نبدأ معك</div>
        <h2>فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.</h2>
        <div className="start">
          {STEPS.map((step, index) => (
            <div key={step.number} className={index === GUARANTEE ? 's gs' : 's'}>
              {/* Only the numeral is `.mono`: DM Mono has no Arabic glyphs
                  (spec: Design system). See `start.css`. */}
              <div className="k">
                <span className="mono">{step.number}</span> · {step.label}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
