import type { CSSProperties } from 'react';
import { CompareBehaviour } from '@/components/profile/compare-behaviour';
import type { ProfileCompareContent } from '@/content/pages/profile-compare';
import type { ReadingDirection } from '@/lib/reading-direction';

/**
 * Section 09 of the Company profile, «قبل وبعد» (`#compare`, ticket 108): a
 * tab for each of five everyday questions, and under it the question, a table
 * of the usual way against Rabaed's, Ahmed's video of the two side by side
 * and the note under it. The four Profile PDFs link here, so it always shows.
 *
 * A server component. Every panel's words are in the first response, with the
 * first tab chosen (ADR-0001); `CompareBehaviour` switches between them and
 * plays the videos.
 *
 * **Nothing is fetched before it is needed.** Each video is sent with no
 * source at all, only `data-src`, `preload="none"` and its poster, which
 * loads lazily: the source is set when the video is due to play — on screen,
 * or its button pressed.
 *
 * A light section, as Ahmed's is, so the header turns light over it.
 */
export function Compare({ content, direction }: { content: ProfileCompareContent; direction: ReadingDirection }) {
  return (
    <section id="compare" className="light pad pf-compare" data-direction={direction}>
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2 id="compare-heading">{content.title}</h2>
        <p className="lead">{content.lead}</p>

        <div className="pf-cmp-tabs" role="tablist" aria-labelledby="compare-heading">
          {content.comparisons.map((comparison, index) => (
            <button
              key={comparison.id}
              type="button"
              role="tab"
              id={`compare-tab-${index}`}
              aria-controls={`compare-panel-${index}`}
              aria-selected={index === 0}
              className="pf-pill"
            >
              <span className="pf-pill-n mono" aria-hidden="true">
                {index + 1}
              </span>
              {comparison.module}
            </button>
          ))}
        </div>

        {content.comparisons.map((comparison, index) => {
          const { poster } = comparison;
          const tall = poster.height > poster.width;
          return (
            <div
              key={comparison.id}
              id={`compare-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`compare-tab-${index}`}
              className={index === 0 ? 'pf-cmp-panel on' : 'pf-cmp-panel'}
            >
              <div className="pf-cmp-text">
                <p className="pf-cmp-module">
                  <i style={{ '--icon': `url(${comparison.icon})` } as CSSProperties} aria-hidden="true" />
                  {comparison.module}
                </p>
                <h3>{comparison.question}</h3>
                <table className="pf-cmp-table">
                  <thead>
                    <tr>
                      <td />
                      <th scope="col" className="b">
                        {content.beforeLabel}
                      </th>
                      <th scope="col" className="a">
                        {content.afterLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <th scope="row">{row.label}</th>
                        <td className="b" data-l={content.beforeLabel}>
                          {row.before}
                        </td>
                        <td className="a" data-l={content.afterLabel}>
                          {row.after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <figure className="pf-cmp-media">
                <div
                  className={tall ? 'pf-clip tall' : 'pf-clip'}
                  data-clip
                  style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
                >
                  {/* A plain picture rather than `next/image`: it is fetched lazily,
                      at the one size it has, and the video takes its place. */}
                  <img
                    className="pf-clip-poster"
                    src={poster.url}
                    alt=""
                    width={poster.width}
                    height={poster.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <video data-src={comparison.video} preload="none" muted playsInline loop aria-label={comparison.module} />
                  <button type="button" className="pf-clip-play">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                    <span>{content.playLabel}</span>
                  </button>
                </div>
                <figcaption>{comparison.note}</figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      <CompareBehaviour />
    </section>
  );
}
