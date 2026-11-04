import { PlatformBehaviour } from '@/components/profile/platform-behaviour';
import { FIRST_UNIT, unitAppearance } from '@/components/profile/platform-state';
import { ScreenMockPicture, type ScreenMockPictureContent } from '@/components/screen-mock-picture';
import type { ReadingDirection } from '@/lib/reading-direction';
import { SectionEyebrow } from './section-eyebrow';

export type ProfileUnit = {
  /** The tab's name. */
  readonly name: string;
  /** What the unit does, under its name while its tab is chosen. */
  readonly text: string;
  /**
   * The site's own Screen mock of the unit, and what it shows in words: the
   * picture's `alt` and the caption under it, the Screen mocks entry's
   * (ADR-0002).
   */
  readonly screen: ScreenMockPictureContent;
};

export type ProfilePlatformContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  /** Four, whose screens and icons are fixed by their places (`PLATFORM_SCREENS`, `ICONS`). */
  readonly units: readonly ProfileUnit[];
  /** The line under the tabs: what the four produce. */
  readonly output: string;
};

/**
 * Each tab's screen, by its place: the Screen mocks of the four units, in
 * Ahmed's order — the correspondence, the approvals board, the daily site
 * report and the documents (spec: Sections, in order). By place, as the names
 * are the Editor's.
 */
export const PLATFORM_SCREENS = ['correspondence', 'kanban', 'daily-report', 'documents'] as const;

/** Each tab's icon, by its place, as Ahmed draws them (`public/profile/icons/`). */
const ICONS = ['mail-open', 'approvals', 'chart', 'layers'] as const;

/**
 * Section 07 of the Company profile, "The platform" (`#platform`, ticket
 * 107): Ahmed's four units as tabs down one side, the chosen one open to what
 * it does, and beside them the site's own Screen mock of that unit, its Phone
 * crop on a phone (ADR-0022). The line under them says what all four produce.
 * Stacked, the screen comes first, as in Ahmed's. A dark section, on the
 * second dark ground.
 *
 * A server component. Every unit's words, screen and caption are in the first
 * response, with the first chosen; `PlatformBehaviour` switches between them.
 *
 * A tab is named by its unit and described by its text, so a screen reader
 * hears the name as the tab and the text as what it does, not both run
 * together as one long name.
 */
export function Platform({ content, direction }: { content: ProfilePlatformContent; direction: ReadingDirection }) {
  return (
    <section id="platform" className="pad pf-platform" data-direction={direction}>
      <div className="wrap">
        <SectionEyebrow number="07" words={content.eyebrow} />
        <h2 id="platform-heading">{content.title}</h2>
        <p className="lead">{content.lead}</p>

        <div className="pf-units">
          <div className="pf-unit-tabs" role="tablist" aria-labelledby="platform-heading" aria-orientation="vertical">
            {content.units.map((unit, index) => {
              const look = unitAppearance(index, FIRST_UNIT);
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  id={`platform-tab-${index}`}
                  aria-controls={`platform-panel-${index}`}
                  aria-selected={look.selected}
                  aria-labelledby={`platform-name-${index}`}
                  aria-describedby={`platform-text-${index}`}
                  className={look.tabClass}
                >
                  <i className={`pf-icon pf-icon-${ICONS[index]}`} aria-hidden="true" />
                  <span className="pf-unit-name" id={`platform-name-${index}`}>
                    {unit.name}
                  </span>
                  <span className="pf-unit-text" id={`platform-text-${index}`}>
                    {unit.text}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pf-stage">
            {content.units.map((unit, index) => (
              <div
                key={index}
                id={`platform-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`platform-tab-${index}`}
                className={unitAppearance(index, FIRST_UNIT).panelClass}
              >
                {/* Below 700px the screen is its Phone crop, or shown at
                    1040px and panned across; stacked, it is never wider than
                    920px; beside the tabs, never wider than 720px. */}
                <ScreenMockPicture content={unit.screen} sizes="(max-width: 700px) 1040px, (max-width: 980px) 920px, 720px" />
              </div>
            ))}
          </div>
        </div>

        <p className="pf-output">
          <span className="pf-pulse" aria-hidden="true" />
          {content.output}
        </p>
      </div>

      <PlatformBehaviour />
    </section>
  );
}
