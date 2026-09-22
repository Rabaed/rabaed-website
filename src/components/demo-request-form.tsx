'use client';

import { fieldOptions, TRAP_FIELD, type FormPageWording } from '@/forms/definition';
import { DEMO_REQUEST, type DemoRequestField } from '@/forms/demo-request';
import { useAnswers } from '@/forms/use-answers';
import { useSubmission } from '@/forms/use-submission';
import type { Locale } from '@/lib/locales';

/**
 * The guarantee, in each language. A binding commitment rather than the
 * form's wording, so it stays here rather than in the form's settings; the
 * English says exactly what the Arabic does. Only the numeral is `.mono`: DM
 * Mono has no Arabic glyphs (spec: Design system).
 */
const GUARANTEE: Readonly<Record<Locale, { readonly days: string; readonly rest: string }>> = {
  ar: { days: 'يوماً', rest: 'ضمان استرجاع كامل المبلغ' },
  en: { days: 'days', rest: 'full money-back guarantee' },
};

/**
 * The demo request form: one form, placed at the end of the home and product
 * pages and beside the start page's questions, working the same in all three.
 *
 * Its fields and rules are its definition's (`src/forms/demo-request.ts`); its
 * words are the CMS's, handed down by the page. It is sent to the submission
 * pipeline on the server (ticket 27), and says a request arrived only once the
 * server has stored it — the Reference site said so without sending anything.
 *
 * The submit button stays disabled until every answer is acceptable, and while
 * a request is on its way. A client component rendered on the server first:
 * the whole form is in the first response, and with JavaScript off its button
 * stays disabled, as the tool page's does.
 */
export function DemoRequestForm({ wording }: { wording: FormPageWording<DemoRequestField> }) {
  const { complete, field, refuse } = useAnswers(DEMO_REQUEST, wording);
  const { outcome, sending, send } = useSubmission(DEMO_REQUEST, wording.locale, refuse);

  const name = field('name');
  const email = field('email');
  const role = field('role');
  const phone = field('phone');
  const company = field('company');
  const activeProjects = field('activeProjects');
  const words = wording.fields;

  return (
    <form
      className="form"
      id="demo"
      noValidate
      aria-labelledby="demo-title"
      onSubmit={(event) => {
        event.preventDefault();
        if (complete) void send(event.currentTarget);
      }}
    >
      <h3 id="demo-title">{wording.heading}</h3>
      <small>{wording.lead}</small>
      <div className="guar" style={{ marginBottom: '14px' }}>
        <b>
          <span className="mono">60</span> {GUARANTEE[wording.locale].days}
        </b>{' '}
        {GUARANTEE[wording.locale].rest}
      </div>

      {outcome.outcome === 'received' ? (
        // The fields go with the request, so it cannot be sent again by mistake.
        <small role="status" className="sent">
          {outcome.message}
        </small>
      ) : (
        <>
          {/* Each field is named by its `aria-label`; visible labels are
              ticket 36's to decide. */}
          <div className="two">
            <div>
              <input {...name.props} placeholder={words.name.placeholder} autoComplete="name" aria-label={words.name.label} />
              {name.message}
            </div>
            <div>
              <input
                {...email.props}
                type="email"
                placeholder={words.email.placeholder}
                autoComplete="email"
                aria-label={words.email.label}
              />
              {email.message}
            </div>
          </div>
          <div className="two">
            <div>
              <select {...role.props} aria-label={words.role.label}>
                <option value="">{words.role.placeholder}</option>
                {fieldOptions(DEMO_REQUEST.fields.role).map((value) => (
                  <option key={value} value={value}>
                    {words.role.options![value]}
                  </option>
                ))}
              </select>
              {role.message}
            </div>
            <div>
              <input
                {...phone.props}
                type="tel"
                placeholder={words.phone.placeholder}
                autoComplete="tel"
                aria-label={words.phone.label}
              />
              {phone.message}
            </div>
          </div>
          <div className="two">
            <div>
              <input
                {...company.props}
                placeholder={words.company.placeholder}
                autoComplete="organization"
                aria-label={words.company.label}
              />
              {company.message}
            </div>
            <div>
              <input
                {...activeProjects.props}
                type="number"
                min={0}
                placeholder={words.activeProjects.placeholder}
                aria-label={words.activeProjects.label}
              />
              {activeProjects.message}
            </div>
          </div>

          {/* The trap (`TRAP_FIELD`): out of sight, out of the keyboard order
              and hidden from screen readers, so only a bot fills it in. A
              textarea, so that it is not one of the form's inputs. */}
          <div className="vh" aria-hidden="true">
            <textarea name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          {(outcome.outcome === 'refused' || outcome.outcome === 'failed') && (
            <small role="alert" className="refusal">
              {outcome.message}
            </small>
          )}

          <button type="submit" className="btn p" disabled={!complete || sending} style={{ justifyContent: 'center' }}>
            {wording.submit}
          </button>
        </>
      )}
      <small className="fine">{wording.finePrint}</small>
    </form>
  );
}
