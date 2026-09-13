import { PartnershipApplicationForm } from '@/components/partnership/application-form';

/**
 * «طلب شراكة» on the partnership page: what applying commits an office to —
 * nothing before the first meeting — beside the application form. The hero's
 * «اطلب اجتماع شراكة» and the path's link land here.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
const REASSURANCES = [
  'لا رسوم انضمام، ولا التزام قبل اجتماع التعارف',
  'الاجتماع الأول يشمل عرض المنصة',
  'نموذج التعاون يُكتب في اتفاقية، لا في وعد شفهي',
] as const;

export function Apply() {
  return (
    <section id="apply" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sign-grid">
          <div>
            <div className="eyebrow">طلب شراكة</div>
            <h2 style={{ fontSize: '32px' }}>خلّنا نجلس ونصمّم النموذج المناسب لمكتبك</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              املأ النموذج، ويتواصل معك فريق الشراكات خلال يومي عمل.
            </p>
            <ul className="ben-row one">
              {REASSURANCES.map((reassurance) => (
                <li key={reassurance}>
                  <i>✓</i>
                  <span>{reassurance}</span>
                </li>
              ))}
            </ul>
            {/* «يوما عمل» has no numeral, so none of it is `.mono`: the
                Reference site sets it in DM Mono, which has no Arabic glyphs
                (spec: Design system). */}
            <div className="guar" style={{ marginTop: '18px' }}>
              <b>يوما عمل</b>
              {' مدة الرد على طلبك'}
            </div>
          </div>

          <PartnershipApplicationForm />
        </div>
      </div>
    </section>
  );
}
