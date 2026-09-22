import { Fragment } from 'react';
import { Inline, type InlineText } from '@/components/inline-text';
import { ONWARD, type ReadingDirection } from '@/lib/reading-direction';

/** One party's review, inside its own walls. */
export type ReviewCycle = {
  readonly party: string;
  /** What the party does before anything leaves it. */
  readonly note: string;
  /** Who reviews inside the party, in order; the last one decides. */
  readonly reviewers: readonly string[];
  /** What crosses to the other parties, officially. */
  readonly crosses: string;
};

/** One of the two lines under the parties: a name, then what it covers. */
export type InnerCycleNote = {
  readonly label: string;
  readonly text: InlineText;
};

export type ProductInnerCycleContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /**
   * The three parties, no more and no fewer (spec: Content model), which the CMS
   * holds them to on publishing, in the order the Record travels: from the
   * Contractor, through the Consultant, to the Owner.
   */
  readonly cycles: readonly ReviewCycle[];
  /** The tag over each party's reviewers. */
  readonly privateTag: string;
  /** The line beside the dashed loop under the reviewers. */
  readonly reviewAgain: string;
  /** The label over what crosses. */
  readonly crossesLabel: string;
  /** What stays inside a party. */
  readonly staysInside: InnerCycleNote;
  /** What crosses to the others. */
  readonly crossesOut: InnerCycleNote;
};

/**
 * «ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟» — the three parties side by
 * side, each with the review cycle it runs inside its own walls, and what
 * crosses to the next party once that cycle is done.
 *
 * A server component with no behaviour.
 */
export function InnerCycle({
  content,
  direction,
}: {
  content: ProductInnerCycleContent;
  /** The page's reading direction, which the Record travels in from one party to the next (`ONWARD`). */
  direction: ReadingDirection;
}) {
  return (
    <section id="inner" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2>{content.heading}</h2>
        <p className="lead">{content.lead}</p>

        <div className="orgs wired">
          {content.cycles.map((cycle, index) => (
            <Fragment key={index}>
              {/* The way the Record travels, from one party to the next. The
                  order of the cards already says it to a screen reader. */}
              {index > 0 && (
                <div className="cross" aria-hidden="true">
                  <span>{ONWARD[direction]}</span>
                </div>
              )}
              <div className="org">
                <div className="org-h">
                  <i />
                  {cycle.party}
                </div>
                <div className="role-note">{cycle.note}</div>
                <div className="priv">
                  <span className="priv-tag">{content.privateTag}</span>
                  <ol className="steps-v">
                    {cycle.reviewers.map((reviewer, step) => (
                      <li key={step}>
                        <i>{step + 1}</i>
                        {reviewer}
                      </li>
                    ))}
                  </ol>
                  <div className="reloop">
                    <ReviewAgain />
                    <span>{content.reviewAgain}</span>
                  </div>
                </div>
                <div className="out">
                  <b>{content.crossesLabel}</b>
                  {cycle.crosses}
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="inner-note">
          <Note note={content.staysInside} />
          <Note note={content.crossesOut} />
        </div>
      </div>
    </section>
  );
}

function Note({ note }: { note: InnerCycleNote }) {
  return (
    <div>
      <span className="k">{note.label}</span>
      <Inline text={note.text} />
    </div>
  );
}

/** The dashed loop beside "review again": decoration, since the words beside it say it. */
function ReviewAgain() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 8a5 5 0 1 1-1.6-3.7" stroke="#F95738" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2.4" />
      <path d="M12.6 1.6v3.2H9.4" stroke="#F95738" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
