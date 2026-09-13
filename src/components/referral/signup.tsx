import { ReferralSignupForm } from '@/components/referral/signup-form';

/**
 * «التسجيل» on the referral page: what signing up gets the referrer, beside
 * the signup form. The hero's «سجّل واحصل على كودك» lands here.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
const BENEFITS = [
  'يصلك الكود فوراً على جوالك وبريدك',
  'لا رسوم انضمام، ولا التزام بعدد إحالات',
  'دورك ينتهي عند مشاركة الكود',
  '2,000 ريال صافية عن كل مشروع، بلا حد أقصى',
] as const;

export function Signup() {
  return (
    <section id="signup" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sign-grid">
          <div>
            <div className="eyebrow">التسجيل</div>
            <h2 style={{ fontSize: '32px' }}>كودك جاهز خلال دقيقة</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              سجّل الآن، وشارك الكود مع أول مطوّر يخطر ببالك.
            </p>
            <ul className="ben-row one">
              {BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <i>✓</i>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            {/* Only the numeral is `.mono`, as in every guarantee pill. */}
            <div className="guar" style={{ marginTop: '18px' }}>
              <b>
                <span className="mono">7</span> أيام عمل
              </b>{' '}
              مدة الصرف من نهاية شهر الاستحقاق
            </div>
          </div>

          <ReferralSignupForm />
        </div>
      </div>
    </section>
  );
}
