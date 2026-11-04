import { SectionEyebrow } from './section-eyebrow';

export type ProfileParty = { readonly name: string; readonly want: string };

export type ProfilePartiesContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  /** Three, whose icons are fixed by their places: `ICONS`. */
  readonly cards: readonly ProfileParty[];
  /** The documented Record, named on the bar the three cards meet at. */
  readonly record: string;
  /** The line beside it. */
  readonly footer: string;
};

/**
 * Each card's icon, by its place: the Owner, the Consultant and the
 * Contractor, as Ahmed draws them (`public/profile/icons/`). By place rather
 * than by name, because the names are the Editor's.
 */
const ICONS = ['owner', 'consultant', 'contractor'] as const;

/**
 * Section 06 of the Company profile, "Our solution" (`#parties`, ticket 107):
 * Ahmed's heading and lead over the three parties' cards, each with what that
 * party wants, joined by dashed lines to the bar under them, the documented
 * Record they all share, with its green dot. A dark section.
 */
export function Parties({ content }: { content: ProfilePartiesContent }) {
  return (
    <section id="parties" className="pad pf-parties">
      <div className="wrap">
        <SectionEyebrow number="06" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <p className="lead">{content.lead}</p>
        <ul className="pf-party-cards">
          {content.cards.map((card, index) => (
            <li key={index} className={`pf-party-${ICONS[index]}`}>
              <i className={`pf-icon pf-icon-${ICONS[index]}`} aria-hidden="true" />
              <h3>{card.name}</h3>
              <p>{card.want}</p>
            </li>
          ))}
        </ul>
        <div className="pf-centre">
          <span className="pf-pulse" aria-hidden="true" />
          <strong>{content.record}</strong>
          <p>{content.footer}</p>
        </div>
      </div>
    </section>
  );
}
