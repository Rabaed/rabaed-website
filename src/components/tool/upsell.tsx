import type { PageLink } from '@/components/page-link';

export type ToolUpsellContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /** The filled button: to the start page. */
  readonly primary: PageLink;
  /** The outlined one beside it: to the product page. */
  readonly secondary: PageLink;
  /** What the cloud version adds. */
  readonly adds: readonly string[];
  /** The line that closes the page. */
  readonly signOff: string;
};

/**
 * «الخطوة التالية»: the end of the tool page, for a visitor who needs more than
 * one project — what Rabaed adds, and the way to the start and product pages.
 */
export function Upsell({ content }: { content: ToolUpsellContent }) {
  return (
    <section id="up" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-up">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '28px', lineHeight: 1.38, margin: 0 }}>{content.heading}</h2>
            <p className="lead" style={{ marginTop: '12px' }}>
              {content.lead}
            </p>
            <div className="ctas" style={{ marginTop: '20px' }}>
              <a className="btn p" href={content.primary.href}>
                {content.primary.label}
              </a>
              <a className="btn o" href={content.secondary.href}>
                {content.secondary.label}
              </a>
            </div>
          </div>
          <ul className="tl-up-list">
            {content.adds.map((line) => (
              <li key={line}>
                <i>✦</i>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="tl-foot-line">{content.signOff}</p>
      </div>
    </section>
  );
}
