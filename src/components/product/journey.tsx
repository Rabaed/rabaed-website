import { Fragment } from 'react';
import { JourneyBehaviour } from '@/components/product/journey-behaviour';
import { ScreenMockPicture, type ScreenMockPictureContent } from '@/components/screen-mock-picture';
import type { ReadingDirection } from '@/lib/reading-direction';

/** One piece of the row of pills at the foot of a panel. */
export type FlowStep =
  /** A party, drawn as a pill. */
  | { readonly party: string }
  /** Drawn between two parties as the direction something travels: «←» right to left. */
  | { readonly towards: string }
  /** What separates one route from the next. */
  | { readonly then: string };

export type JourneyPanel = {
  /** A unit, numbered by its place in the journey; or what the units produce, named. */
  readonly tag: { readonly kind: 'unit' } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /** The one-line promise under the title. */
  readonly tagline: string;
  readonly body: string;
  /** Who the unit passes things between, as the row of pills at the foot of the panel. Empty for a panel with no row. */
  readonly flow: readonly FlowStep[];
  /** The Screen mock the panel shows. */
  readonly screen: ScreenMockPictureContent;
};

export type ProductJourneyContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly panels: readonly JourneyPanel[];
};

/**
 * «أربع وحدات. سجل واحد يجمعها.» — a panel for each unit, and one for the
 * Record they produce, each beside the screen that shows it; an Editor adds
 * and removes panels (ticket 57). On a window at least
 * 981px wide and 551px tall the section holds still and the panels travel
 * sideways as the visitor scrolls; on anything smaller they stand one above
 * another. `JourneyBehaviour` does the travelling; this draws everything it
 * moves.
 *
 * A server component. Every panel, its screen's description and its caption
 * are in the first response.
 *
 * **With JavaScript off, a wide window stacks the panels too** — a deliberate
 * difference from the Reference site, which leaves panels two to five out of
 * reach off the side of a clipped track with no script to bring them in. The
 * rule is inside `<noscript>`, so it never reaches a visitor whose script runs:
 * a stylesheet cannot tell whether a script runs, which is why these few rules
 * are here rather than in `product.css`.
 */
export function Journey({
  content,
  direction,
}: {
  content: ProductJourneyContent;
  /** The page's reading direction, which the section's behaviour turns round by (`src/lib/reading-direction.ts`). */
  direction: ReadingDirection;
}) {
  return (
    // A plain wrapper, and it is load-bearing. Pinning moves the section into
    // a spacer element GSAP inserts around it, and React removes a page's
    // elements before it runs their effects' teardown — so were the section a
    // direct child of the page, a client-side navigation away would ask React
    // to remove it from a parent it no longer has, which throws. Removing the
    // wrapper takes the spacer and the section with it.
    <div>
      <section id="journey" className="dark" data-direction={direction}>
        <div className="j-head">
          <div className="wrap">
            <div>
              <div className="eyebrow">{content.eyebrow}</div>
              <h2>{content.heading}</h2>
            </div>
            {/* How far along the journey is. The same thing is said by which
                panel is in view, so a screen reader is not told it twice. */}
            <div className="dots" aria-hidden="true">
              {content.panels.map((panel, index) => (
                <i key={index} className={index === 0 ? 'on' : undefined} />
              ))}
            </div>
          </div>
        </div>

        <div className="track">
          {content.panels.map((panel, index) => (
            <div key={index} className={panel.tag.kind === 'output' ? 'panel final' : 'panel'}>
              <div>
                {panel.tag.kind === 'unit' ? (
                  <div className="num">{`${twoDigits(index + 1)} / ${twoDigits(content.panels.length)}`}</div>
                ) : (
                  <div className="num out">{panel.tag.name}</div>
                )}
                <h3>{panel.title}</h3>
                <div className="tag">{panel.tagline}</div>
                <p>{panel.body}</p>
                {panel.flow.length > 0 && <Flow steps={panel.flow} />}
              </div>
              <div className="ui">
                {/* Below 700px the screen is shown at 1040px and panned across;
                    stacked, a panel is never wider than 920px; beside the copy,
                    the screen's column is never wider than 720px. */}
                <ScreenMockPicture
                  content={panel.screen}
                  sizes="(max-width: 700px) 1040px, (max-width: 980px) 920px, 720px"
                />
              </div>
            </div>
          ))}
        </div>

        <noscript dangerouslySetInnerHTML={{ __html: `<style>${STACKED_WITHOUT_SCRIPT}</style>` }} />

        <JourneyBehaviour />
      </section>
    </div>
  );
}

/** The row of parties at the foot of a panel. The direction mark is bare text between the pills, as the Reference site draws it. */
function Flow({ steps }: { steps: readonly FlowStep[] }) {
  return (
    <div className="flow">
      {steps.map((step, index) =>
        'towards' in step ? (
          <Fragment key={index}>{step.towards}</Fragment>
        ) : 'then' in step ? (
          <span key={index}>{step.then}</span>
        ) : (
          <b key={index}>{step.party}</b>
        ),
      )}
    </div>
  );
}

function twoDigits(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * The stacked layout the Reference site falls back to on a window too short to
 * pin in (`product.css`, the `max-height: 550px` block), applied to any window
 * when there is no script. The panels keep their two columns; only their fixed
 * heights, which exist to fit the pinned window, are let go.
 */
const STACKED_WITHOUT_SCRIPT = [
  '#journey{height:auto;overflow:visible}',
  '#journey .j-head{position:static;padding:var(--sp) 0 0}',
  '#journey .j-head .dots{display:none}',
  '#journey .track{flex-direction:column;width:auto;height:auto;padding:24px var(--gutter) 60px;align-items:stretch}',
  '#journey .panel{width:auto;height:auto}',
].join('');
