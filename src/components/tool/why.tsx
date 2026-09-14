import { Card, TeaserHead, type TeaserCard } from '@/components/tool/parts';

export type ToolWhyContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly cards: readonly TeaserCard[];
};

/** «لماذا هذه الأداة»: the three reasons a concrete file runs late. */
export function Why({ content }: { content: ToolWhyContent }) {
  return (
    <section id="why" className="light pad">
      <div className="wrap">
        <TeaserHead eyebrow={content.eyebrow} title={content.heading} lead={content.lead} />
        <div className="rt-row">
          {content.cards.map((card) => (
            <Card key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
