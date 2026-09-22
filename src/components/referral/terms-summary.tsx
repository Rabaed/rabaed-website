import type { PageLink } from '@/components/page-link';
import { ONWARD, type ReadingDirection } from '@/lib/reading-direction';

/**
 * One of the points: its lead phrase, drawn in bold, and the rest of its
 * sentence, which begins with whatever follows the bold — a space or a comma.
 */
export type TermsPoint = {
  readonly lead: string;
  readonly rest: string;
};

export type ReferralTermsSummaryContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly terms: readonly TermsPoint[];
  /** To the full Referral Terms. */
  readonly link: PageLink;
};

/**
 * «الشروط باختصار» on the referral page: the Referral Terms in points, two
 * columns of however many an Editor gives it, and a link to the full terms,
 * which are binding where this is a summary (ticket 17).
 */
export function TermsSummary({
  content,
  direction,
}: {
  content: ReferralTermsSummaryContent;
  /** The page's reading direction, which its arrow points (`ONWARD`). */
  direction: ReadingDirection;
}) {
  return (
    <section id="terms" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <ol className="t8">
          {content.terms.map((term, index) => (
            <li key={index}>
              <i>{index + 1}</i>
              <span>
                <b>{term.lead}</b>
                {term.rest}
              </span>
            </li>
          ))}
        </ol>
        <div className="tz-foot">
          <a className="tz-more" href={content.link.href}>
            {content.link.label}
            <span className="ar">{ONWARD[direction]}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
