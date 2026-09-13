import Image from 'next/image';
import { FourUnitsBehaviour } from '@/components/home/four-units-behaviour';
import { FIRST_CHOSEN, unitTabAppearance } from '@/components/home/four-units-state';
import { FOUR_UNITS_HEADING, UNIT_TABS } from '@/content/four-units';
import { SCREEN_MOCK_DESCRIPTIONS } from '@/content/screen-mock-descriptions';
import { localePath } from '@/lib/locales';
import { findScreenMock, screenMockImagePath } from '@/screen-mocks/registry';

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
export function FourUnits() {
  return (
    <section id="jt" className="dark pad" data-direction="rtl">
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">المنصة</div>
          <h2>{FOUR_UNITS_HEADING}</h2>
        </div>
        <div className="jt-line" />

        <div className="jt-row" role="tablist" aria-label="وحدات ربائد">
          {UNIT_TABS.map((unit, index) => {
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
            {UNIT_TABS.map((unit, index) => {
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
                    alt={SCREEN_MOCK_DESCRIPTIONS[unit.mock]}
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
            {UNIT_TABS.map((unit, index) => (
              <p key={unit.mock} className="jt-hint" hidden={unitTabAppearance(index, FIRST_CHOSEN).hintHidden}>
                {SCREEN_MOCK_DESCRIPTIONS[unit.mock]}
              </p>
            ))}
          </div>
        </div>

        <div className="tz-foot">
          <a className="tz-more" href={localePath('ar', '/product')}>
            <span>شاهد الوحدات كاملة بالتفصيل</span>
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
