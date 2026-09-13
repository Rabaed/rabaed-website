/**
 * «ما يحصل عليه الشريك» on the partnership page: Rabaed's eight commitments to
 * a partner, two columns at desktop widths.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
const BENEFITS = [
  { lead: 'تسعير شريك', rest: 'متفق عليه في الاتفاقية' },
  { lead: 'مدير حساب مخصص', rest: 'ونقطة تواصل واحدة' },
  { lead: 'تأهيل فريقك', rest: 'على المنصة، وإعادة التأهيل عند انضمام موظفين جدد' },
  { lead: 'دعم فني بأولوية', rest: 'لمشاريعك ولعملائك' },
  { lead: 'إعداد المشروع نيابةً عنك', rest: 'عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع' },
  { lead: 'لوحة شريك', rest: 'تعرض مشاريعك النشطة وحالة كل منها' },
  { lead: 'تسويق مشترك', rest: '— ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع' },
  { lead: 'أولوية في خارطة الطريق', rest: 'لطلبات التطوير المتكررة من مشاريعك' },
] as const;

export function Benefits() {
  return (
    <section id="benefits" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">ما يحصل عليه الشريك</div>
          <h2>ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية</h2>
        </div>
        <ul className="ben-row">
          {BENEFITS.map((benefit) => (
            <li key={benefit.lead}>
              <i>✓</i>
              <span>
                <b>{benefit.lead}</b>
                {` ${benefit.rest}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
