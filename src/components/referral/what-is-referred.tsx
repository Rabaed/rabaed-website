import type { PageLink } from '@/components/page-link';
import { ONWARD, type ReadingDirection } from '@/lib/reading-direction';

export type ReferralWhatIsReferredContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly link: PageLink;
};

/**
 * «ما الذي تُحيله» on the referral page: Rabaed in two paragraphs, for a
 * referrer who has to explain it to someone else, and a link to the product
 * page.
 */
export function WhatIsReferred({
  content,
  direction,
}: {
  content: ReferralWhatIsReferredContent;
  /** The page's reading direction, which its arrow points (`ONWARD`). */
  direction: ReadingDirection;
}) {
  return (
    <section id="what" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <div className="lead-block">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
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
