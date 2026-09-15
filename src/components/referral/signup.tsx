import { Inline, type InlineText } from '@/components/inline-text';
import { ReferralSignupForm } from '@/components/referral/signup-form';
import type { FormPageWording } from '@/forms/definition';
import type { ReferralSignupField } from '@/forms/referral-signup';

export type ReferralSignupContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly benefits: readonly string[];
  /** The pill under the benefits: «7 أيام عمل», in bold, then what it measures. */
  readonly guarantee: {
    readonly figure: InlineText;
    readonly text: string;
  };
};

/**
 * «التسجيل» on the referral page: what signing up gets the referrer, beside
 * the signup form. The hero's «سجّل واحصل على كودك» lands here.
 *
 * The form's words are its settings in the CMS (ticket 28), handed down beside
 * the section's own.
 */
export function Signup({ content, form }: { content: ReferralSignupContent; form: FormPageWording<ReferralSignupField> }) {
  return (
    <section id="signup" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sign-grid">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '32px' }}>{content.heading}</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              {content.lead}
            </p>
            <ul className="ben-row one">
              {content.benefits.map((benefit) => (
                <li key={benefit}>
                  <i>✓</i>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="guar" style={{ marginTop: '18px' }}>
              <b>
                <Inline text={content.guarantee.figure} />
              </b>{' '}
              {content.guarantee.text}
            </div>
          </div>

          <ReferralSignupForm wording={form} />
        </div>
      </div>
    </section>
  );
}
