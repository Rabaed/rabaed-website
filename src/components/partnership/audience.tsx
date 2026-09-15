/** One kind of firm the programme is for. */
export type AudienceKind = {
  readonly title: string;
  readonly text: string;
};

export type PartnershipAudienceContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly kinds: readonly AudienceKind[];
};

/**
 * «لمن هذا البرنامج» on the partnership page: the kinds of firm it is for —
 * four on the Reference site; as many as an Editor gives it (ticket 55) — two
 * to a row at desktop widths (`programmes.css`), and one alone the whole width.
 */
export function Audience({ content }: { content: PartnershipAudienceContent }) {
  return (
    <section id="who" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <div className={content.kinds.length === 1 ? 'rt-row one' : 'rt-row two'}>
          {content.kinds.map((kind, index) => (
            <div key={index} className="rt-c">
              <div className="k">{String(index + 1).padStart(2, '0')}</div>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
