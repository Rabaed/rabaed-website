/**
 * «المبلغ والخصم» on the referral page: why the amount is fixed, and the two
 * sides of the offer — the referrer's 2,000 SAR and the client's 10%.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
export function Offer() {
  return (
    <section id="offer" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">المبلغ والخصم</div>
          <h2>مبلغ ثابت. بلا شرائح، بلا حسابات.</h2>
        </div>
        <div className="lead-block">
          <p>
            اخترنا مبلغاً ثابتاً معلوماً بدل النسب المتغيّرة: <b>2,000 ريال صافية عن كل مشروع</b> يبدأ اشتراكه بكودك — سواء كان مشروعاً من عشرة آلاف متر أو ثلاثين ألفاً. تعرف ما ستستلمه قبل أن تُحيل، ولا تحتاج أن تسأل عن قيمة الاشتراك.
          </p>
          <p>ولا يوجد حد أقصى لعدد المشاريع التي تُحيلها في السنة.</p>
        </div>
        <div className="strip">
          <div className="c">
            <span className="badge">لك</span>
            <h3>2,000 ريال صافية</h3>
            <p>عن كل مشروع، تُحوَّل على حسابك البنكي مباشرة.</p>
          </div>
          <div className="c">
            <span className="badge">لعميلك</span>
            <h3>خصم 10%</h3>
            <p>على اشتراك المشروع، بمجرّد استخدام كودك.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
