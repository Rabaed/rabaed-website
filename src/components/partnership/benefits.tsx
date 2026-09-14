/** One of Rabaed's commitments to a partner: its bold opening, then the rest of the line. */
export type PartnerBenefit = {
  readonly lead: string;
  readonly rest: string;
};

export type PartnershipBenefitsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly benefits: readonly PartnerBenefit[];
};

/**
 * «ما يحصل عليه الشريك» on the partnership page: Rabaed's eight commitments to
 * a partner, two columns at desktop widths.
 */
export function Benefits({ content }: { content: PartnershipBenefitsContent }) {
  return (
    <section id="benefits" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <ul className="ben-row">
          {content.benefits.map((benefit) => (
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
