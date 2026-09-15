import { Card, CardRow, TeaserHead, TestStateBadge, type TeaserCard, type TestState } from '@/components/tool/parts';

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
 * «ما الذي تفعله»: cards, the first with the legend of a test's states, and
 * more things it does under them — six cards and four lines on the Reference
 * site; as many as an Editor gives it (ticket 54).
 */
export function Features({ content }: { content: ToolFeaturesContent }) {
  return (
    <section id="features" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} lead={content.lead} />
        <CardRow count={content.cards.length + 1} className="tl-feat">
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
          {content.cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </CardRow>
        <ul className="tl-also">
          {content.also.map((also, index) => (
            <li key={index}>
              <i>+</i>
              <span>{also}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
