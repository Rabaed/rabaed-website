import { Fragment } from 'react';
import { RecordBehaviour } from '@/components/home/record-behaviour';
import { recordAt, transactionTypeAppearance } from '@/components/home/record-state';
import {
  RECORD_HEADING,
  RECORD_LEAD,
  RECORD_QUESTIONS,
  RECORD_STAMP,
  TRANSACTION_TYPES,
} from '@/content/record-transactions';

/** How the section looks before the visitor has scrolled into it. */
const AT_START = recordAt(0, TRANSACTION_TYPES.length);

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
 * `.rec-entry`; it carries no styles, and `.doc`'s rules reach through it.
 *
 * It is not a `.light` section, though it ends light: the Reference site keeps
 * the header dark over it, until the section after it begins.
 */
export function RecordSection() {
  return (
    <section id="record" data-direction="rtl">
      <div className="sticky">
        <div className="wrap">
          <div className="rec-grid">
            <div>
              <div className="eyebrow">السجل الموثّق</div>
              <h2>
                {RECORD_HEADING.lines[0]}
                <br />
                {RECORD_HEADING.lines[1]}
              </h2>
              <div className="fourq">
                {RECORD_QUESTIONS.map((question, index) => (
                  <Fragment key={question}>
                    {index > 0 && <span>·</span>}
                    {question}
                  </Fragment>
                ))}
              </div>
              <p className="lead">{RECORD_LEAD}</p>
              <div className="rec-types">
                {TRANSACTION_TYPES.map((type, index) => (
                  <span key={type.label} className={transactionTypeAppearance(index, AT_START.chosen).chipClass}>
                    {type.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rec-card">
              <div className="doc">
                {TRANSACTION_TYPES.map((type, index) => (
                  <div
                    key={type.title}
                    className="rec-entry"
                    hidden={transactionTypeAppearance(index, AT_START.chosen).trailHidden}
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
                <div className={AT_START.stamped ? 'stamp on' : 'stamp'}>{RECORD_STAMP}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecordBehaviour />
    </section>
  );
}
