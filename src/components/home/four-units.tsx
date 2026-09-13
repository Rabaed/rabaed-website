import Image from 'next/image';
import { FourUnitsBehaviour } from '@/components/home/four-units-behaviour';
import { FIRST_CHOSEN, unitTabAppearance } from '@/components/home/four-units-state';
import type { HeroLink } from '@/components/page-hero';
import { findScreenMock, screenMockImagePath } from '@/screen-mocks/registry';

export type UnitTab = {
  /** The small line above the title: a unit's number, or the name of what the units produce. */
  readonly tag: { readonly kind: 'unit'; readonly number: string } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /** The Screen mock's id in `src/screen-mocks/registry.ts`, whose exported image the tab shows. */
  readonly mock: string;
  /** What the screen shows, in words: the picture's `alt` and the caption under it, both at once (ADR-0002). */
  readonly description: string;
};

export type FourUnitsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  /** Names the row of tabs, for a screen reader. */
  readonly tabsLabel: string;
  readonly tabs: readonly UnitTab[];
  /** The link on to the product page, which shows every unit in full. */
  readonly more: HeroLink;
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
 * **The screen does not break out of the content width**, though the ticket and
 * the handoff describe it widening to 1440px. No Reference page has that rule
 * any more, and the baselines were captured without it — ADR-0005.
 */
export function FourUnits({ content }: { content: FourUnitsContent }) {
  return (
    <section id="jt" className="dark pad" data-direction="rtl">
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.heading}</h2>
        </div>
        <div className="jt-line" />

        <div className="jt-row" role="tablist" aria-label={content.tabsLabel}>
          {content.tabs.map((unit, index) => {
            const look = unitTabAppearance(index, FIRST_CHOSEN);
            return (
              <button
                key={unit.mock}
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
          <div className="jt-stage">
            {content.tabs.map((unit, index) => {
              const mock = screenMockFor(unit.mock);
              return (
                <div
                  key={unit.mock}
                  id={`jt-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`jt-tab-${index}`}
                  className={unitTabAppearance(index, FIRST_CHOSEN).panelClass}
                >
                  <Image
                    src={screenMockImagePath('ar', mock.id)}
                    alt={unit.description}
                    width={mock.width}
                    height={mock.height}
                    // Below 700px the screen is shown at 1040px and panned
                    // across; above it, the stage is never wider than 820px.
                    sizes="(max-width: 700px) 1040px, 820px"
                  />
                </div>
              );
            })}
          </div>
          <div className="jt-hints" aria-hidden="true">
            {content.tabs.map((unit, index) => (
              <p key={unit.mock} className="jt-hint" hidden={unitTabAppearance(index, FIRST_CHOSEN).hintHidden}>
                {unit.description}
              </p>
            ))}
          </div>
        </div>

        <div className="tz-foot">
          <a className="tz-more" href={content.more.href}>
            <span>{content.more.label}</span>
            <span className="ar">←</span>
          </a>
        </div>
      </div>

      <FourUnitsBehaviour />
    </section>
  );
}

/** The registry entry for a mock named in the content, or a build that stops and says which. */
function screenMockFor(id: string) {
  const mock = findScreenMock(id);
  if (!mock) throw new Error(`No Screen mock called "${id}" in src/screen-mocks/registry.ts`);
  return mock;
}
