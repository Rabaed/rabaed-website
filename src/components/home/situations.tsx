import { CardDeck, type CardDeckWords } from '@/components/home/card-deck';

export type FieldSituation = {
  /** What gets said on site. */
  readonly quote: string;
  /** What it costs, shown under `costLabel`. */
  readonly cost: string;
};

export type SituationsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  /**
   * The closing line under the heading, in two sentences with a break
   * between: `first`, then `second` running on into `accent`, which is set in
   * the brand colour.
   */
  readonly close: { readonly first: string; readonly second: string; readonly accent: string };
  readonly situations: readonly FieldSituation[];
  /** The label over each card's cost. */
  readonly costLabel: string;
  readonly deck: CardDeckWords;
};

/**
 * «تعرف هذه المواقف؟» — the section after the Trust strip: six things people
 * on a construction project recognise saying, each with its cost, in a deck the
 * visitor throws through.
 *
 * The section keeps the Reference site's id, `pain`, because the stylesheet is
 * written against it and the class names and ids are load-bearing (spec:
 * Design system). Everywhere a name is ours to choose, it is "situations".
 */
export function Situations({ content }: { content: SituationsContent }) {
  const { close } = content;
  const total = content.situations.length;
  const cards = content.situations.map((situation, index) => (
    <>
      <div className="n">{`${twoDigits(index + 1)} / ${twoDigits(total)}`}</div>
      <q>{situation.quote}</q>
      <div className="cost">
        <div className="ct">
          <WarningIcon />
          <span>{content.costLabel}</span>
        </div>
        {situation.cost}
      </div>
    </>
  ));

  return (
    <section id="pain" className="dark">
      <div className="wrap pain-2col">
        <div className="pain-copy">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
          <p className="pain-close reveal">
            {close.first}
            <br />
            {/* One run of text with the space in it, as the Reference site
                writes it, rather than two beside each other. */}
            {`${close.second} `}
            <span>{close.accent}</span>
          </p>
        </div>

        <CardDeck id="situations-deck" {...content.deck} direction="rtl" cards={cards} />
      </div>
    </section>
  );
}

function twoDigits(n: number) {
  return String(n).padStart(2, '0');
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 1.9 18.3a1.9 1.9 0 0 0 1.7 2.9h16.8a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z" />
      <path d="M12 9.2v4.4" />
      <path d="M12 17.3v.1" />
    </svg>
  );
}
