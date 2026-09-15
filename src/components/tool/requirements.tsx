import { Card, CardRow, TeaserHead, type TeaserCard } from '@/components/tool/parts';

export type ToolRequirementsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly cards: readonly TeaserCard[];
};

/**
 * «المتطلبات»: what the tool needs to run. The cards' labels are Arabic words
 * rather than numbers, so they keep the Arabic face (`tool.css`).
 */
export function Requirements({ content }: { content: ToolRequirementsContent }) {
  return (
    <section id="req" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} />
        <CardRow count={content.cards.length}>
          {content.cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </CardRow>
      </div>
    </section>
  );
}
