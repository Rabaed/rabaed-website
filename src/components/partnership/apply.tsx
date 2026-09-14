import { PartnershipApplicationForm } from '@/components/partnership/application-form';

export type PartnershipApplyContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly reassurances: readonly string[];
  /** How soon the partnerships team replies: the bold figure, then what it measures. */
  readonly responseTime: {
    readonly figure: string;
    readonly label: string;
  };
};

/**
 * «طلب شراكة» on the partnership page: what applying commits an office to —
 * nothing before the first meeting — beside the application form. The hero's
 * «اطلب اجتماع شراكة» and the path's link land here.
 *
 * The form keeps its own words until ticket 27.
 */
export function Apply({ content }: { content: PartnershipApplyContent }) {
  return (
    <section id="apply" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sign-grid">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '32px' }}>{content.heading}</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              {content.lead}
            </p>
            <ul className="ben-row one">
              {content.reassurances.map((reassurance) => (
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
              <b>{content.responseTime.figure}</b>
              {` ${content.responseTime.label}`}
            </div>
          </div>

          <PartnershipApplicationForm />
        </div>
      </div>
    </section>
  );
}
