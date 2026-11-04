import { CompareBehaviour } from '@/components/profile/compare-behaviour';
import { comparisonAppearance, FIRST_COMPARISON } from '@/components/profile/compare-state';
import { SectionEyebrow } from '@/components/profile/section-eyebrow';
import type { Comparison } from '@/lib/profile-comparisons';
import type { ReadingDirection } from '@/lib/reading-direction';

/** One of the five comparisons, as its tab and panel draw it. */
export type CompareItem = {
  readonly id: Comparison;
  /** The tab's name, and the line above the question. */
  readonly module: string;
  readonly question: string;
  readonly rows: readonly { readonly label: string; readonly before: string; readonly after: string }[];
  readonly note: string;
  /** Where the video is fetched from, once it is due. */
  readonly video: string;
  /** What stands in the video's place until it starts; its shape is the frame's. */
  readonly poster: { readonly url: string; readonly width: number; readonly height: number };
};

export type ProfileCompareContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly beforeLabel: string;
  readonly afterLabel: string;
  readonly playLabel: string;
  readonly comparisons: readonly CompareItem[];
};

/**
 * Each comparison's icon, and Ahmed's video and poster, the defaults an
 * Editor's replace (`public/profile/clips/`), with each frame's size: his
 * Approvals clip is a tall page, 720×1020, and the other four are 1552×1030
 * screens. The icon is one of Ahmed's (`.pf-icon-…`), fixed by the
 * comparison, as the platform section's are by their places
 * (`PLATFORM_UNITS`).
 */
export const COMPARISON_DEFAULTS: Readonly<
  Record<Comparison, { clip: string; poster: string; icon: string; width: number; height: number }>
> = {
  approvals: { clip: '01-approvals.mp4', poster: 'poster-01.webp', icon: 'approvals', width: 720, height: 1020 },
  documents: { clip: '02-documents.mp4', poster: 'poster-02.webp', icon: 'folder-search', width: 1552, height: 1030 },
  correspondence: { clip: '03-correspondence.mp4', poster: 'poster-03.webp', icon: 'mail-open', width: 1552, height: 1030 },
  dashboard: { clip: '04-dashboard.mp4', poster: 'poster-04.webp', icon: 'gauge', width: 1552, height: 1030 },
  dailyReport: { clip: '05-daily-report.mp4', poster: 'poster-05.webp', icon: 'chart', width: 1552, height: 1030 },
};

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
        <SectionEyebrow number="09" words={content.eyebrow} />
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
              aria-selected={comparisonAppearance(index, FIRST_COMPARISON).selected}
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
              className={comparisonAppearance(index, FIRST_COMPARISON).panelClass}
            >
              <div className="pf-cmp-text">
                <p className="pf-cmp-module">
                  <i className={`pf-icon pf-icon-${COMPARISON_DEFAULTS[comparison.id].icon}`} aria-hidden="true" />
                  {comparison.module}
                </p>
                <h3>{comparison.question}</h3>
                <table className="pf-cmp-table">
                  <thead>
                    <tr>
                      <td />
                      <th scope="col" className="pf-cmp-before">
                        {content.beforeLabel}
                      </th>
                      <th scope="col" className="pf-cmp-with">
                        {content.afterLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <th scope="row">{row.label}</th>
                        <td className="pf-cmp-before" data-column={content.beforeLabel}>
                          {row.before}
                        </td>
                        <td className="pf-cmp-with" data-column={content.afterLabel}>
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
