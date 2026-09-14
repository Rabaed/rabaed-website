import { Card, TeaserHead, TestStateBadge, type TeaserCard, type TestState } from '@/components/tool/parts';

export type ToolFeaturesContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /** The first card, the countdown, which carries the legend of a test's states under its text. */
  readonly countdown: TeaserCard & { readonly states: readonly TestState[] };
  /** The cards after it. */
  readonly cards: readonly TeaserCard[];
  /** The further things it does, listed under the cards. */
  readonly also: readonly string[];
};

/**
 * «ما الذي تفعله»: six cards, the first with the legend of a test's states,
 * and four more things it does under them.
 */
export function Features({ content }: { content: ToolFeaturesContent }) {
  return (
    <section id="features" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} lead={content.lead} />
        <div className="rt-row tl-feat">
          <div className="rt-c">
            <div className="k">{content.countdown.label}</div>
            <h3>{content.countdown.title}</h3>
            <p>{content.countdown.text}</p>
            <div className="tl-legend">
              {content.countdown.states.map((state) => (
                <TestStateBadge key={state.tone} state={state} className="tl-s lt" />
              ))}
            </div>
          </div>
          {content.cards.map((card) => (
            <Card key={card.label} {...card} />
          ))}
        </div>
        <ul className="tl-also">
          {content.also.map((also) => (
            <li key={also}>
              <i>+</i>
              <span>{also}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
