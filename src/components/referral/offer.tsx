import { stripClass } from '@/components/columns';
import { Inline, type InlineText } from '@/components/inline-text';

/** One side of the offer: what the referrer gets, or what their client does. */
export type OfferSide = {
  readonly badge: string;
  readonly title: string;
  readonly text: string;
};

export type ReferralOfferContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly paragraphs: readonly InlineText[];
  readonly sides: readonly OfferSide[];
};

/**
 * «المبلغ والخصم» on the referral page: why the amount is fixed, and the sides
 * of the offer — the referrer's payout and the client's discount, two to a
 * row however many an Editor gives it (`stripClass`).
 */
export function Offer({ content }: { content: ReferralOfferContent }) {
  return (
    <section id="offer" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <div className="lead-block">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index}>
              <Inline text={paragraph} />
            </p>
          ))}
        </div>
        <div className={stripClass(content.sides.length)}>
          {/* By place: an Editor may write two badges alike. */}
          {content.sides.map((side, index) => (
            <div key={index} className="c">
              <span className="badge">{side.badge}</span>
              <h3>{side.title}</h3>
              <p>{side.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
