import { Fragment } from 'react';
import { JourneyBehaviour } from '@/components/product/journey-behaviour';
import { ScreenMockPicture } from '@/components/product/screen-mock-picture';
import { JOURNEY_EYEBROW, JOURNEY_HEADING, JOURNEY_PANELS, type JourneyPanel } from '@/content/journey';

/**
 * «أربع وحدات. سجل واحد يجمعها.» — five panels, the four units and the Record
 * they produce, each beside the screen that shows it. On a window at least
 * 981px wide and 551px tall the section holds still and the panels travel
 * sideways as the visitor scrolls; on anything smaller they stand one above
 * another. `JourneyBehaviour` does the travelling; this draws everything it
 * moves.
 *
 * A server component. All five panels, their screens' descriptions and their
 * captions are in the first response.
 *
 * **With JavaScript off, a wide window stacks the panels too** — a deliberate
 * difference from the Reference site, which leaves panels two to five out of
 * reach off the side of a clipped track with no script to bring them in. The
 * rule is inside `<noscript>`, so it never reaches a visitor whose script runs:
 * a stylesheet cannot tell whether a script runs, which is why these few rules
 * are here rather than in `product.css`.
 */
export function Journey() {
  return (
    // A plain wrapper, and it is load-bearing. Pinning moves the section into
    // a spacer element GSAP inserts around it, and React removes a page's
    // elements before it runs their effects' teardown — so were the section a
    // direct child of the page, a client-side navigation away would ask React
    // to remove it from a parent it no longer has, which throws. Removing the
    // wrapper takes the spacer and the section with it.
    <div>
      <section id="journey" className="dark" data-direction="rtl">
        <div className="j-head">
          <div className="wrap">
            <div>
              <div className="eyebrow">{JOURNEY_EYEBROW}</div>
              <h2>{JOURNEY_HEADING}</h2>
            </div>
            {/* How far along the journey is. The same thing is said by which
                panel is in view, so a screen reader is not told it twice. */}
            <div className="dots" aria-hidden="true">
              {JOURNEY_PANELS.map((panel, index) => (
                <i key={panel.mock} className={index === 0 ? 'on' : undefined} />
              ))}
            </div>
          </div>
        </div>

        <div className="track">
          {JOURNEY_PANELS.map((panel, index) => (
            <div key={panel.mock} className={panel.tag.kind === 'output' ? 'panel final' : 'panel'}>
              <div>
                {panel.tag.kind === 'unit' ? (
                  <div className="num">{`${twoDigits(index + 1)} / ${twoDigits(JOURNEY_PANELS.length)}`}</div>
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
                <ScreenMockPicture mock={panel.mock} sizes="(max-width: 700px) 1040px, (max-width: 980px) 920px, 720px" />
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

/** The row of parties at the foot of a panel — see `JourneyPanel.flow` for the two marks. */
function Flow({ steps }: { steps: JourneyPanel['flow'] }) {
  return (
    <div className="flow">
      {steps.map((step, index) =>
        step === '←' ? (
          <Fragment key={index}>←</Fragment>
        ) : step === '·' ? (
          <span key={index}>·</span>
        ) : (
          <b key={index}>{step}</b>
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
