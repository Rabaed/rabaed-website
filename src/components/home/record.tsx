import { Fragment } from 'react';
import { RecordBehaviour } from '@/components/home/record-behaviour';
import { recordAt, transactionTypeAppearance } from '@/components/home/record-state';

/** One step of a trail: what happened, who did it or how, and at what time. */
export type TransactionStep = {
  readonly action: string;
  readonly by: string;
  readonly time: string;
};

export type TransactionType = {
  /** The chip naming the type. */
  readonly label: string;
  /** The reference number and subject of the one transaction shown for it. */
  readonly title: string;
  /** Its trail, always four steps: raised, received, checked, decided. The last is the decision. */
  readonly steps: readonly [TransactionStep, TransactionStep, TransactionStep, TransactionStep];
};

export type HomeRecordSectionContent = {
  readonly eyebrow: string;
  /** The heading, a line at a time. */
  readonly heading: readonly string[];
  /** The four questions the Record answers, set as one line with dots between. */
  readonly questions: readonly string[];
  readonly lead: string;
  readonly types: readonly TransactionType[];
  /** The seal the Record earns once the visitor has scrolled through every type. */
  readonly stamp: string;
};

/**
 * «لا نسأل "من اعتمد؟" نفتح المعاملة.» — the section that explains the Record.
 * The copy on one side, and on the other a card showing the trail one
 * transaction leaves in it. As the visitor scrolls through, the section turns
 * from dark to light and the card works through all five transaction types,
 * ending stamped complete; `RecordBehaviour` does both.
 *
 * A server component.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate: every type's trail is in
 * the first response**, the first showing and the rest `hidden`, where the
 * Reference site has a single trail and rewrites its words from a script. So
 * what a crawler or a visitor without JavaScript reads does not depend on
 * scrolling, as with the four units' screens. Each trail needs an element of
 * its own to be hidden by, and the Reference site has none to borrow, so it is
 * `.rec-entry`; `.doc`'s rules reach through it. `.rec-trails` holds the five
 * together so that below 981px they can share one space, as tall as the
 * tallest, and the card keeps its height whichever is showing (`home.css`).
 *
 * It is not a `.light` section, though it ends light: the Reference site keeps
 * the header dark over it, until the section after it begins.
 */
export function RecordSection({ content }: { content: HomeRecordSectionContent }) {
  // How the section looks before the visitor has scrolled into it.
  const atStart = recordAt(0, content.types.length);

  return (
    <section id="record" data-direction="rtl">
      <div className="sticky">
        <div className="wrap">
          <div className="rec-grid">
            <div>
              <div className="eyebrow">{content.eyebrow}</div>
              <h2>
                {content.heading.map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </h2>
              <div className="fourq">
                {content.questions.map((question, index) => (
                  <Fragment key={question}>
                    {index > 0 && <span>·</span>}
                    {question}
                  </Fragment>
                ))}
              </div>
              <p className="lead">{content.lead}</p>
              <div className="rec-types">
                {content.types.map((type, index) => (
                  <span key={type.label} className={transactionTypeAppearance(index, atStart.chosen).chipClass}>
                    {type.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rec-card">
              <div className="doc">
                <div className="rec-trails">
                {content.types.map((type, index) => (
                  <div
                    key={type.title}
                    className="rec-entry"
                    hidden={transactionTypeAppearance(index, atStart.chosen).trailHidden}
                  >
                    <div className="h">
                      <b>{type.title}</b>
                    </div>
                    <ul className="tl">
                      {type.steps.map((step, position) => (
                        <li key={position}>
                          {/* The decision, last, is marked in the brand colour. */}
                          <i className={position === type.steps.length - 1 ? 'acc' : undefined} />
                          <div>
                            <span className="a">{step.action}</span>
                            <small className="b">{step.by}</small>
                          </div>
                          <span className="time">{step.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                </div>
                <div className={atStart.stamped ? 'stamp on' : 'stamp'}>{content.stamp}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecordBehaviour />
    </section>
  );
}
