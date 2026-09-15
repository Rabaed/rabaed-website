import { Card, CardRow, TeaserHead, type TeaserCard } from '@/components/tool/parts';

export type ToolWhyContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly cards: readonly TeaserCard[];
};

/**
 * «لماذا هذه الأداة»: the reasons a concrete file runs late — three on the
 * Reference site; as many as an Editor gives it (ticket 54).
 */
export function Why({ content }: { content: ToolWhyContent }) {
  return (
    <section id="why" className="light pad">
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} lead={content.lead} />
        <CardRow count={content.cards.length}>
          {content.cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </CardRow>
      </div>
    </section>
  );
}
