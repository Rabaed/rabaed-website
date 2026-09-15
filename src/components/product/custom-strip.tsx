import type { PageLink } from '@/components/page-link';

/** Something Rabaed builds for a project that needs it. */
export type OnRequestFeature = {
  readonly title: string;
  readonly body: string;
};

export type ProductCustomStripContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly features: readonly OnRequestFeature[];
  /** The badge on every card. */
  readonly badge: string;
  /** The link on every card, to where the feature is asked about. */
  readonly ask: PageLink;
};

/**
 * The strip's layout at desktop widths for `count` cards (`tokens.css`): two
 * across is `.strip` itself, so today's two cards keep their markup, and four
 * sit in two rows of it; one card takes the whole row, and so does the last of
 * an odd number. An Editor adds and removes cards (spec: Design system).
 *
 * Never three across: a card a third of the row wide would bring a long title
 * under the badge in its corner, which a card half the row wide or wider keeps
 * clear of (`src/cms/globals/product-page.ts`).
 */
function stripClass(count: number): string {
  return count % 2 === 1 ? 'strip odd' : 'strip';
}

/**
 * «ومشروعك يحتاج أكثر؟» — the things Rabaed builds for a project that needs
 * them, each pointing at the demo where they are asked about.
 *
 * A server component with no behaviour.
 */
export function CustomStrip({ content }: { content: ProductCustomStripContent }) {
  return (
    <section id="custom" className="light">
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2>{content.heading}</h2>
        <div className={stripClass(content.features.length)}>
          {content.features.map((feature, index) => (
            <div className="c" key={index}>
              <span className="badge">{content.badge}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <a href={content.ask.href}>{content.ask.label}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
