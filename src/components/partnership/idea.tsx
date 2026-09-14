import type { PageLink } from '@/components/page-link';

export type PartnershipIdeaContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  /** The note under them, sending a visitor to the Referral Program. */
  readonly referralNote: {
    /** Its trailing space included, before the link. */
    readonly text: string;
    readonly link: PageLink;
  };
};

/**
 * «الفكرة» on the partnership page: why an office is offered a partnership
 * rather than a referral fee, and the note that sends a visitor who wants the
 * simpler arrangement to the Referral Program.
 */
export function Idea({ content }: { content: PartnershipIdeaContent }) {
  return (
    <section id="idea" className="light pad">
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
        {/* One string, its trailing space included: split in two, the server
            marks the join with a comment, the browser lays out two runs of
            text, and the link lands a hundredth of a pixel off the Reference
            site's. */}
        <div className="gain" style={{ marginTop: '22px' }}>
          {content.referralNote.text}
          <a className="inl" href={content.referralNote.link.href}>
            {content.referralNote.link.label}
          </a>
        </div>
      </div>
    </section>
  );
}
