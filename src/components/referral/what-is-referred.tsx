import type { PageLink } from '@/components/page-link';

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
export function WhatIsReferred({ content }: { content: ReferralWhatIsReferredContent }) {
  return (
    <section id="what" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <div className="lead-block">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="tz-foot">
          <a className="tz-more" href={content.link.href}>
            {content.link.label}
            <span className="ar">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
