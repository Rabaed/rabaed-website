import { Fragment } from 'react';
import { RecordBehaviour } from '@/components/home/record-behaviour';
import { recordAt, recordTypeAppearance } from '@/components/home/record-state';
import {
  RECORD_HEADING,
  RECORD_LEAD,
  RECORD_QUESTIONS,
  RECORD_STAMP,
  RECORD_TYPES,
} from '@/content/record-types';

/** How the section looks before the visitor has scrolled into it. */
const AT_START = recordAt(0, RECORD_TYPES.length);

/**
 * «لا نسأل "من اعتمد؟" نفتح المعاملة.» — the section that explains the Record.
 * The copy on one side, and on the other a card showing the record one kind of
 * transaction leaves. As the visitor scrolls through, the section turns from
 * dark to light and the card works through all five kinds, ending stamped
 * complete; `RecordBehaviour` does both.
 *
 * A server component. **Every kind's record is in the first response**, the
 * first one showing and the rest `hidden`, where the Reference site has a single
 * record and rewrites its words from a script. So what a crawler or a visitor
 * without JavaScript reads does not depend on scrolling, as with the four
 * units' screens.
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
                {RECORD_TYPES.map((kind, index) => (
                  <span key={kind.label} className={recordTypeAppearance(index, AT_START.chosen).chipOn ? 'on' : undefined}>
                    {kind.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rec-card">
              <div className="doc">
                {RECORD_TYPES.map((kind, index) => (
                  <div
                    key={kind.title}
                    className="rec-entry"
                    hidden={recordTypeAppearance(index, AT_START.chosen).recordHidden}
                  >
                    <div className="h">
                      <b>{kind.title}</b>
                    </div>
                    <ul className="tl">
                      {kind.steps.map((step, number) => (
                        <li key={number}>
                          {/* The decision, last, is marked in the brand colour. */}
                          <i className={number === kind.steps.length - 1 ? 'acc' : undefined} />
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
