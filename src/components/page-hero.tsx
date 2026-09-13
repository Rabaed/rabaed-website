import { Inline, type InlineText } from '@/components/inline-text';

export type HeroLink = {
  readonly label: string;
  readonly href: string;
};

/** One of the figures under a programme page's hero: «2,000 ريال» over «عن كل مشروع». */
export type HeroFigure = {
  readonly figure: InlineText;
  readonly label: string;
};

export type PageHeroContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  /** The filled button. */
  readonly primary: HeroLink;
  /** The outlined one beside it. */
  readonly secondary: HeroLink;
  /** The referral and partnership pages carry three; the product and start pages none. */
  readonly figures?: readonly HeroFigure[];
};

/**
 * The compact dark hero the product, start, referral and partnership pages
 * open with: an eyebrow, the page's heading and lead, two buttons, and on the
 * programme pages a row of figures under them.
 */
export function PageHero({ content }: { content: PageHeroContent }) {
  return (
    <section className="phero dark">
      <div className="pglow" />
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h1>{content.title}</h1>
        <p className="lead">{content.lead}</p>
        <div className="ctas">
          <a className="btn p" href={content.primary.href}>
            {content.primary.label}
          </a>
          <a className="btn g" href={content.secondary.href}>
            {content.secondary.label}
          </a>
        </div>
        {content.figures === undefined ? null : (
          // Only the numerals are `.mono`: DM Mono has no Arabic glyphs
          // (spec: Design system). See `programmes.css`.
          <div className="pstats">
            {content.figures.map((figure) => (
              <div className="pstat" key={figure.label}>
                <b>
                  <Inline text={figure.figure} />
                </b>
                <span>{figure.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
