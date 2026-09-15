import { stripClass } from '@/components/columns';
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
 * «ومشروعك يحتاج أكثر؟» — the things Rabaed builds for a project that needs
 * them, each pointing at the demo where they are asked about. An Editor adds
 * and removes cards, laid out by `stripClass` (spec: Design system).
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
