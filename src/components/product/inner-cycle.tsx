import { Fragment } from 'react';
import { INNER_EYEBROW, INNER_HEADING, INNER_LEAD, ORGANISATIONS } from '@/content/inner-cycle';

/**
 * «ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟» — the three parties side by
 * side, each with the review cycle it runs inside its own walls, and what
 * crosses to the next party once that cycle is done.
 *
 * A server component with no behaviour. All copy is verbatim from
 * `reference/site/product.html`.
 */
export function InnerCycle() {
  return (
    <section id="inner" className="light pad">
      <div className="wrap">
        <div className="eyebrow">{INNER_EYEBROW}</div>
        <h2>{INNER_HEADING}</h2>
        <p className="lead">{INNER_LEAD}</p>

        <div className="orgs wired">
          {ORGANISATIONS.map((organisation, index) => (
            <Fragment key={organisation.party}>
              {/* The way the Record travels, from one party to the next. The
                  order of the cards already says it to a screen reader. */}
              {index > 0 && (
                <div className="cross" aria-hidden="true">
                  <span>←</span>
                </div>
              )}
              <div className="org">
                <div className="org-h">
                  <i />
                  {organisation.party}
                </div>
                <div className="role-note">{organisation.note}</div>
                <div className="priv">
                  <span className="priv-tag">دورة داخلية · محجوبة</span>
                  <ol className="steps-v">
                    {organisation.reviewers.map((reviewer, step) => (
                      <li key={reviewer}>
                        <i>{step + 1}</i>
                        {reviewer}
                      </li>
                    ))}
                  </ol>
                  <div className="reloop">
                    <ReviewAgain />
                    <span>إعادة ومراجعة داخلية — بلا حد، وبلا أثر خارج الجهة</span>
                  </div>
                </div>
                <div className="out">
                  <b>ما يعبر رسمياً</b>
                  {organisation.crosses}
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="inner-note">
          <div>
            <span className="k">ما يبقى داخل جهتك</span>
            المسودات، الملاحظات الداخلية، الاعتراضات، وعدد دورات المراجعة.{' '}
            <b>تعمل بحرية داخل حدودك — ولا يُحسب عليك ما لم تُرسله.</b>
          </div>
          <div>
            <span className="k">ما يعبر إلى الآخرين</span>
            المعاملة الرسمية فقط، بلحظة إرسالها واسم من أرسلها. <b>ومن تلك اللحظة تصبح جزءاً من السجل الموثّق.</b>
          </div>
        </div>
      </div>
    </section>
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
