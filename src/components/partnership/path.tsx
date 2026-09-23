import { Inline, numeralsInMono } from '@/components/inline-text';
import type { PageLink } from '@/components/page-link';
import { ONWARD, type ReadingDirection } from '@/lib/reading-direction';

/** One stage from a first meeting to a first project. */
export type PathStage = {
  readonly number: string;
  readonly title: string;
  readonly text: string;
};

export type PartnershipPathContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /** To the application form. */
  readonly link: PageLink;
  /** The word before each stage's number. */
  readonly stageLabel: string;
  readonly stages: readonly PathStage[];
};

/**
 * «مسار الشراكة» on the partnership page: the stages from a first meeting to a
 * first project — four on the Reference site; as many as an Editor gives it
 * (ticket 55), one under another — beside a link to the application form. The
 * hero's «كيف نبني الشراكة ↓» lands here.
 *
 * The stages are the closing section's `.tail-steps` (`shell.css`), with a
 * heading of their own in each — `.ph`, and HANDOFF §7.4's wrapping exception
 * in `programmes.css`.
 */
export function Path({
  content,
  direction,
}: {
  content: PartnershipPathContent;
  /** The page's reading direction, which its arrow points (`ONWARD`). */
  direction: ReadingDirection;
}) {
  return (
    <section id="path" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tail-grid">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '32px' }}>{content.heading}</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              {content.lead}
            </p>
            <div className="tz-foot">
              <a className="tz-more" href={content.link.href}>
                {content.link.label}
                <span className="ar">{ONWARD[direction]}</span>
              </a>
            </div>
          </div>
          <ul className="tail-steps">
            {content.stages.map((stage) => (
              <li key={stage.number}>
                {/* «المرحلة» in the label face and the numeral in DM Mono, as
                    the home and product pages' closing steps are:
                    `.tail-steps b` is theirs too (ADR-0018). */}
                <b>
                  <Inline text={numeralsInMono(`${content.stageLabel} ${stage.number}`)} />
                </b>
                <span>
                  <b className="ph">{stage.title}</b>
                  {stage.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
