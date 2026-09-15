import { Inline, type InlineText } from '@/components/inline-text';
import type { PageLink } from '@/components/page-link';
import { CardRow } from '@/components/tool/parts';

/** One kind of person the programme is open to. */
export type AudienceKind = {
  readonly title: string;
  readonly text: string;
};

export type ReferralAudienceContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly kinds: readonly AudienceKind[];
  /** The note that sends a firm to the Partnership Program, and the link that takes it there. */
  readonly partnership: {
    readonly text: InlineText;
    readonly link: PageLink;
  };
};

/**
 * «لمن هذا البرنامج» on the referral page: the kinds of people it is open to,
 * in the three-across row however many an Editor gives it (`CardRow`), and the
 * note that sends engineering offices and project management companies to the
 * Partnership Program instead — a different programme for a different
 * audience (CONTEXT.md).
 */
export function Audience({ content }: { content: ReferralAudienceContent }) {
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
        <CardRow count={content.kinds.length}>
          {content.kinds.map((kind, index) => (
            <div key={index} className="rt-c">
              <div className="k">{String(index + 1).padStart(2, '0')}</div>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
            </div>
          ))}
        </CardRow>
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
