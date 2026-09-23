import { FourUnitsBehaviour } from '@/components/home/four-units-behaviour';
import { FIRST_CHOSEN, unitTabAppearance } from '@/components/home/four-units-state';
import type { PageLink } from '@/components/page-link';
import { PanningScreen, ScreenMockImage, type ScreenMockPictureContent } from '@/components/screen-mock-picture';
import { ONWARD, type ReadingDirection } from '@/lib/reading-direction';

export type UnitTab = {
  /** The small line above the title: a unit's number, or the name of what the units produce. */
  readonly tag: { readonly kind: 'unit'; readonly number: string } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /**
   * The Screen mock the tab shows, and what it shows in words: the picture's
   * `alt` and the caption under it, both at once (ADR-0002).
   */
  readonly screen: ScreenMockPictureContent;
};

export type HomeFourUnitsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  /**
   * The standalone answer the section opens with (ticket 35), or `''` for the
   * Reference site's own opening, which puts the tabs straight under the
   * heading.
   */
  readonly lead: string;
  /** Names the row of tabs, for a screen reader. */
  readonly tabsLabel: string;
  readonly tabs: readonly UnitTab[];
  /** The link on to the product page, which shows every unit in full. */
  readonly more: PageLink;
};

/**
 * «أربع وحدات. سجل واحد يجمعها.» — five tabs down one side, and beside them the
 * app screen for whichever is chosen: the four units, and the Record they feed.
 *
 * A server component. All five screens, all five captions and every tab are in
 * the first response, with the first tab chosen; `FourUnitsBehaviour` switches
 * between them.
 *
 * **The screens are the exported images from ticket 05, not markup.** The
 * Reference site carries the five mocks inline — about 120 KB of hand-positioned
 * HTML in this one section — and scales them to fit with a script on every
 * resize. Here each is a picture through `next/image`, which serves a size for
 * the screen asking and reserves the box before the picture arrives (ADR-0002).
 *
 * **The caption under the screen is not on the Reference site.** ADR-0002
 * requires one: the mock's own text is a picture of text, so what it shows is
 * said again in words, and the words are the image's `alt`. The caption is
 * hidden from screen readers only because they already hear the same words as
 * the image's description; announcing them twice would say nothing new.
 *
 * **The opening paragraph is not on the Reference site**, which puts the tabs
 * straight under the heading. Ticket 35 gives the section somewhere to carry
 * the standalone answer HANDOFF §6.4 asks every major heading for; while that
 * is unwritten the section is drawn exactly as the baselines have it.
 *
 * **The screen does not break out of the content width**, though the ticket and
 * the handoff describe it widening to 1440px. No Reference page has that rule
 * any more, and the baselines were captured without it — ADR-0005.
 */
export function FourUnits({
  content,
  direction,
}: {
  content: HomeFourUnitsContent;
  /** The page's reading direction, which the section's behaviour turns round by (`src/lib/reading-direction.ts`). */
  direction: ReadingDirection;
}) {
  return (
    <section id="jt" className="dark pad" data-direction={direction}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
          {content.lead ? <p className="lead">{content.lead}</p> : null}
        </div>
        <div className="jt-line" />

        <div className="jt-row" role="tablist" aria-label={content.tabsLabel}>
          {content.tabs.map((unit, index) => {
            const look = unitTabAppearance(index, FIRST_CHOSEN);
            return (
              <button
                key={index}
                type="button"
                role="tab"
                id={`jt-tab-${index}`}
                aria-controls={`jt-panel-${index}`}
                aria-selected={look.selected}
                className={look.tabClass}
              >
                {unit.tag.kind === 'unit' ? (
                  <span className="n">{unit.tag.number}</span>
                ) : (
                  <span className="n out">{unit.tag.name}</span>
                )}
                {/* A heading inside a tab, as on the Reference site, whose
                    stylesheet is written against it. A tab's children are
                    presentational, so assistive technology hears the tab's
                    name rather than a stray heading in the page outline. */}
                <h3>{unit.title}</h3>
              </button>
            );
          })}
        </div>

        {/* The screen and its caption travel together: in the desktop grid
            they share one cell, so the caption sits under the screen rather
            than under whichever of the two columns is taller. */}
        <div className="jt-view">
          {/* The frame the swipe hint sits in, over the foot of the stage, on
              a phone (ticket 77). It draws nothing of its own: the stage's
              margins pass through it, so the stage sits where it always has. */}
          <div className="jt-pan">
            <PanningScreen locale={content.tabs[0].screen.locale} className="jt-stage">
              {content.tabs.map((unit, index) => (
                <div
                  key={index}
                  id={`jt-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`jt-tab-${index}`}
                  className={unitTabAppearance(index, FIRST_CHOSEN).panelClass}
                >
                  {/* Below 700px the screen is shown at 1040px and panned
                      across; above it, the stage is never wider than 820px. */}
                  <ScreenMockImage content={unit.screen} sizes="(max-width: 700px) 1040px, 820px" />
                </div>
              ))}
            </PanningScreen>
          </div>
          <div className="jt-hints" aria-hidden="true">
            {content.tabs.map((unit, index) => (
              <p key={index} className="jt-hint" hidden={unitTabAppearance(index, FIRST_CHOSEN).hintHidden}>
                {unit.screen.description}
              </p>
            ))}
          </div>
        </div>

        <div className="tz-foot">
          <a className="tz-more" href={content.more.href}>
            <span>{content.more.label}</span>
            <span className="ar">{ONWARD[direction]}</span>
          </a>
        </div>
      </div>

      <FourUnitsBehaviour />
    </section>
  );
}
