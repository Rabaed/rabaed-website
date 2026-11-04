import { SectionEyebrow } from './section-eyebrow';

export type ProfileStep = {
  /** What happened: «أُرسل». */
  readonly verb: string;
  /** Who did it, or what: «م. فهد · المقاول». */
  readonly who: string;
  /** When, Latin: «08:15». */
  readonly time: string;
};

export type ProfileRecordContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  /** The card's document: its code, Latin («LTR-088»), what it is, and the tag saying it is made up. */
  readonly document: { readonly code: string; readonly name: string; readonly example: string };
  readonly steps: readonly ProfileStep[];
  readonly summary: string;
};

/** Ahmed's tick, in each step's dot and before the summary. */
function Tick() {
  return (
    <svg className="pf-tick" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * Section 08 of the Company profile, "The documented Record" (`#record`,
 * ticket 107): Ahmed's heading and paragraph beside his illustrative timeline
 * card — a letter, tagged as an example, and the four steps it went through,
 * each with who took it and when, then the summary. A light section: the
 * header turns light over it (ticket 104).
 *
 * **The home page's Record is `#record` too**, and its rules in `home.css` are
 * written to the id. This section keeps the id, the anchor Ahmed's profile
 * has, and its own names for everything inside it, none of the home card's
 * (`.rec-card`, `.doc`, `.tl`); `profile.css` puts back what the id's rules
 * change on the section itself.
 *
 * The times are Ahmed's, illustrative and not in order, as he wrote them.
 */
export function DocumentedRecord({ content }: { content: ProfileRecordContent }) {
  return (
    <section id="record" className="light pad pf-record">
      <div className="wrap pf-split">
        <div>
          <SectionEyebrow number="08" words={content.eyebrow} />
          <h2>{content.title}</h2>
          <p className="lead">{content.body}</p>
        </div>
        <div className="pf-trail">
          <div className="pf-trail-head">
            <i className="pf-icon pf-icon-shield" aria-hidden="true" />
            <p>
              <b className="pf-trail-code">{content.document.code}</b>
              <span className="pf-trail-doc">{content.document.name}</span>
            </p>
            <em className="pf-trail-tag">{content.document.example}</em>
          </div>
          <ol>
            {content.steps.map((step, index) => (
              <li key={index}>
                <span className="pf-step-dot">
                  <Tick />
                </span>
                <div>
                  <p className="pf-step-verb">{step.verb}</p>
                  <p className="pf-step-who">{step.who}</p>
                </div>
                <time>{step.time}</time>
              </li>
            ))}
          </ol>
          <p className="pf-trail-sum">
            <Tick />
            {content.summary}
          </p>
        </div>
      </div>
    </section>
  );
}
