import { SectionEyebrow } from './section-eyebrow';

export type ProfileTool = { readonly name: string; readonly text: string };

export type ProfileTrapContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly kicker: string;
  /** Four, whose icons are fixed by their places: `ICONS`. */
  readonly tools: readonly ProfileTool[];
};

/**
 * Each card's icon, by its place: WhatsApp, email, Excel and a folder for
 * SharePoint, as Ahmed draws them (`public/profile/icons/`). By place rather
 * than by name, because the names are the Editor's and the second is
 * «البريد الإلكتروني» in Arabic and "Email" in English.
 */
const ICONS = ['wa', 'mail', 'excel', 'folder'] as const;

/**
 * Section 03 of the Company profile, "The trap" (`#trap`, ticket 105): Ahmed's
 * heading, paragraph and the line set off under it, beside four cards for the
 * tools a site's paperwork is scattered across, each with its icon and a red
 * dot for what goes wrong with it. A light section, the profile's first: the
 * header turns light over it (ticket 104).
 */
export function Trap({ content }: { content: ProfileTrapContent }) {
  return (
    <section id="trap" className="light pad pf-trap">
      <div className="wrap pf-split even">
        <div>
          <SectionEyebrow number="03" words={content.eyebrow} />
          <h2>{content.title}</h2>
          <p className="lead">{content.body}</p>
          <p className="pf-kicker">{content.kicker}</p>
        </div>
        <ul className="pf-tools">
          {content.tools.map((tool, index) => (
            <li key={index}>
              <span className="pf-tile" aria-hidden="true">
                <i className={`pf-icon pf-icon-${ICONS[index]}`} />
              </span>
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
