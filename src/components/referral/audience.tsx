import { Inline, type InlineText } from '@/components/inline-text';
import type { HeroLink } from '@/components/page-hero';

/** One kind of person the programme is open to. */
export type AudienceKind = {
  readonly title: string;
  readonly text: string;
};

export type AudienceContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly kinds: readonly AudienceKind[];
  /** The note that sends a firm to the Partnership Program, and the link that takes it there. */
  readonly partnership: {
    readonly text: InlineText;
    readonly link: HeroLink;
  };
};

/**
 * «لمن هذا البرنامج» on the referral page: the five kinds of people it is open
 * to, and the note that sends engineering offices and project management
 * companies to the Partnership Program instead — a different programme for a
 * different audience (CONTEXT.md).
 */
export function Audience({ content }: { content: AudienceContent }) {
  return (
    <section id="who" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
          <p className="lead" style={{ marginTop: '12px' }}>
            {content.lead}
          </p>
        </div>
        <div className="rt-row">
          {content.kinds.map((kind, index) => (
            <div key={kind.title} className="rt-c">
              <div className="k">{String(index + 1).padStart(2, '0')}</div>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
            </div>
          ))}
        </div>
        <div className="gain" style={{ marginTop: '22px' }}>
          <Inline text={content.partnership.text} />
          <a className="inl" href={content.partnership.link.href}>
            {content.partnership.link.label}
          </a>
        </div>
      </div>
    </section>
  );
}
