import { Fragment } from 'react';
import { HeroLoop } from '@/components/home/hero-loop';
import { HERO_DOCUMENT, HERO_STATIONS, HERO_START, type HeroStatuses, type StationName } from '@/components/home/hero-stations';
import { Inline, type InlineText } from '@/components/inline-text';
import type { PageLink } from '@/components/page-link';

export type HomeHeroContent = {
  readonly eyebrow: string;
  /** The promise: each of `lines` ends in a break, and `accent` after them is set in the brand colour. */
  readonly title: { readonly lines: readonly string[]; readonly accent: string };
  readonly lead: string;
  /** The filled button. */
  readonly primary: PageLink;
  /** The outlined one beside it, down to the four units — `null` while they are switched off. */
  readonly secondary: PageLink | null;
  /** The small line under the buttons. */
  readonly trust: string;
  /** The pill under that: the period in bold, then the promise. */
  readonly guarantee: { readonly period: InlineText; readonly promise: string };
  /** Each party's name, under or above its building. */
  readonly parties: Readonly<Record<StationName, string>>;
  /** What the diagram shows, stated in words for a screen reader. */
  readonly diagramDescription: string;
  /** What the status pill reads at each step of the document's journey. It opens on the first. */
  readonly statuses: HeroStatuses;
  /**
   * What the pill reads when the loop is not going to run. The animated
   * statuses are moments in a story — "sent at 07:12" means nothing without
   * the arrival that follows it — so a still hero states the promise instead.
   */
  readonly statusAtRest: string;
  /**
   * A drawing an Editor put in place of a building's or the document's own,
   * in its shape (ticket 58), or `null` for the drawing the page ships with.
   */
  readonly pictures: Readonly<Record<StationName | 'document', string | null>>;
};

/**
 * The home page's opening screen: the promise in three lines, and beside it a
 * document travelling between the Owner, the Consultant and the Contractor.
 *
 * A server component. Every word, every building and the document itself are
 * in the first response at their starting positions; `HeroLoop` only sets them
 * moving (ADR-0001). With JavaScript off, or motion turned down, what remains
 * is a complete and legible diagram of the three parties.
 *
 * The diagram is decorative to a screen reader — three cropped drawings and a
 * moving sprite say nothing when read aloud — so the images carry an empty
 * `alt` and the `.vh` line states in words what the picture states in pictures.
 */
export function Hero({ content }: { content: HomeHeroContent }) {
  return (
    <section id="hero" className="dark">
      <div className="glow" />
      <div className="glow2" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{content.eyebrow}</div>
            <h1>
              {content.title.lines.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
              <span>{content.title.accent}</span>
            </h1>
            <p className="lead">{content.lead}</p>
            <div className="ctas">
              <a className="btn p" href={content.primary.href}>
                {content.primary.label}
              </a>
              {content.secondary && (
                <a className="btn g" href={content.secondary.href}>
                  {content.secondary.label}
                </a>
              )}
            </div>
            <div className="trust">{content.trust}</div>
            <div className="guar">
              <b>
                <Inline text={content.guarantee.period} />
              </b>{' '}
              {content.guarantee.promise}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-art" id="hero-art">
              {/* The three dashed routes between the buildings, drawn in the
                  art box's own 600×360 coordinates so they scale with it. */}
              <svg className="hlines" viewBox="0 0 600 360" fill="none" aria-hidden="true">
                <g
                  stroke="rgba(255,255,255,.2)"
                  strokeWidth="1.6"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                >
                  <line x1="202" y1="272" x2="400" y2="272" />
                  <line x1="421" y1="214" x2="358" y2="161" />
                  <line x1="242" y1="161" x2="180" y2="214" />
                </g>
              </svg>

              {Object.entries(HERO_STATIONS).map(([key, station]) => (
                <img
                  key={key}
                  className="bld"
                  src={content.pictures[key as StationName] ?? station.building.src}
                  alt=""
                  aria-hidden="true"
                  width={station.building.intrinsic.width}
                  height={station.building.intrinsic.height}
                  style={{ left: `${station.left}%`, top: `${station.top}%`, width: `${station.building.width}%` }}
                />
              ))}

              <span
                className="hpulse"
                id="h-pulse"
                style={{ left: `${HERO_START.left}%`, top: `${HERO_START.top}%` }}
              />
              <img
                className="spr"
                id="h-doc"
                src={content.pictures.document ?? HERO_DOCUMENT.src}
                alt=""
                aria-hidden="true"
                width={HERO_DOCUMENT.intrinsic.width}
                height={HERO_DOCUMENT.intrinsic.height}
                style={{ left: `${HERO_START.left}%`, top: `${HERO_START.top}%`, width: '7%' }}
              />

              {Object.entries(HERO_STATIONS).map(([key, station]) => (
                <span
                  key={key}
                  className="party"
                  style={{ left: `${station.left}%`, top: `${station.labelTop}%` }}
                >
                  {content.parties[key as StationName]}
                </span>
              ))}

              <span className="vh">{content.diagramDescription}</span>
            </div>

            {/* The pill the loop rewrites as the document arrives somewhere.
                It opens on the first step's own text, so the diagram reads
                correctly before — and without — any script. */}
            <div className="hero-status">
              <i />
              <b id="h-status">{content.statuses[0]}</b>
            </div>
          </div>
        </div>
      </div>

      <HeroLoop statuses={content.statuses} statusAtRest={content.statusAtRest} />
    </section>
  );
}
