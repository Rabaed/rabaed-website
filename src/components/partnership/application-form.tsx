'use client';

import { UploadField } from '@/components/upload-field';
import { fieldOptions, TRAP_FIELD, type FormPageWording } from '@/forms/definition';
import { PARTNERSHIP_APPLICATION, type PartnershipApplicationField } from '@/forms/partnership-application';
import { useAnswers } from '@/forms/use-answers';
import { useSubmission } from '@/forms/use-submission';

/** Each list's values, in the Reference site's order. */
const LISTS = {
  activity: fieldOptions(PARTNERSHIP_APPLICATION.fields.activity),
  activeProjects: fieldOptions(PARTNERSHIP_APPLICATION.fields.activeProjects),
  clientType: fieldOptions(PARTNERSHIP_APPLICATION.fields.clientType),
  projectArea: fieldOptions(PARTNERSHIP_APPLICATION.fields.projectArea),
  partnershipMode: fieldOptions(PARTNERSHIP_APPLICATION.fields.partnershipMode),
} as const;

/**
 * The Partnership Program application: the office, its commercial
 * registration, the person applying, five questions about the practice, and
 * what it wants from the partnership.
 *
 * Its fields and rules are its definition's (`src/forms/partnership-application.ts`),
 * its words the CMS's. It is sent to the submission pipeline (ticket 27),
 * which checks the registration again by its contents and keeps it in private
 * storage (ticket 28).
 *
 * - **The Reference site's fake success is gone.** Its button revealed «وصلنا
 *   طلبك. يتواصل معك فريق الشراكات خلال يومي عمل…» for an application nobody
 *   stored (spec: Forms). An office that believed it would wait two working
 *   days for a call that never came. The same sentence is what the server now
 *   says, once the application is stored.
 * - **The submit button stays disabled** until every starred answer and the
 *   commercial registration are given, and while the application is on its
 *   way; the registration shows its upload as it goes.
 * - **Each message sits under its row**, not inside it: the rows keep the
 *   Reference site's fields as their direct children, which its stylesheet
 *   and the comparison with it rely on.
 */
export function PartnershipApplicationForm({ wording }: { wording: FormPageWording<PartnershipApplicationField> }) {
  const answers = useAnswers(PARTNERSHIP_APPLICATION, wording);
  const { outcome, progress, sending, send } = useSubmission(PARTNERSHIP_APPLICATION, wording.locale, answers.refuse);
  const words = wording.fields;

  const company = answers.field('company');
  const city = answers.field('city');
  const name = answers.field('name');
  const jobTitle = answers.field('jobTitle');
  const phone = answers.field('phone');
  const email = answers.field('email');
  const goals = answers.field('goals');
  const registration = answers.upload('commercialRegistration');

  /** One of the five lists, with its prompt first: the empty option `required` refuses. */
  const list = (field: keyof typeof LISTS) => {
    const state = answers.field(field);
    return {
      element: (
        <select {...state.props} aria-label={words[field].label}>
          <option value="">{words[field].placeholder}</option>
          {LISTS[field].map((value) => (
            <option key={value} value={value}>
              {words[field].options![value]}
            </option>
          ))}
        </select>
      ),
      message: state.message,
    };
  };
  const activity = list('activity');
  const activeProjects = list('activeProjects');
  const clientType = list('clientType');
  const projectArea = list('projectArea');
  const partnershipMode = list('partnershipMode');

  return (
    <form
      className="form"
      noValidate
      aria-labelledby="partnership-apply-title"
      onSubmit={(event) => {
        event.preventDefault();
        if (answers.complete) void send(event.currentTarget);
      }}
    >
      <h3 id="partnership-apply-title">{wording.heading}</h3>
      <small>{wording.lead}</small>

      {outcome.outcome === 'received' ? (
        // The fields go with the application, so it cannot be sent again by mistake.
        <small role="status" className="sent">
          {outcome.message}
        </small>
      ) : (
        <>
          {/* Each field is named by its `aria-label`, as on the Reference site
              and in the other forms; visible labels are ticket 36's. */}
          <div className="two">
            <input
              {...company.props}
              placeholder={words.company.placeholder}
              autoComplete="organization"
              aria-label={words.company.label}
            />
            <UploadField
              locale={wording.locale}
              name="commercialRegistration"
              label={words.commercialRegistration.label}
              note={words.commercialRegistration.placeholder}
              required={registration.required}
              onFile={registration.onFile}
              invalid={registration.invalid}
              rejected={registration.rejected}
              describedBy={registration.describedBy}
              progress={progress}
            />
          </div>
          {company.message}
          {registration.message}
          <div className="two">
            <input {...city.props} placeholder={words.city.placeholder} aria-label={words.city.label} />
            <input {...name.props} placeholder={words.name.placeholder} autoComplete="name" aria-label={words.name.label} />
          </div>
          {city.message}
          {name.message}
          <div className="two">
            <input
              {...jobTitle.props}
              placeholder={words.jobTitle.placeholder}
              autoComplete="organization-title"
              aria-label={words.jobTitle.label}
            />
            <input {...phone.props} type="tel" placeholder={words.phone.placeholder} autoComplete="tel" aria-label={words.phone.label} />
          </div>
          {jobTitle.message}
          {phone.message}
          <div className="two">
            <input
              {...email.props}
              type="email"
              placeholder={words.email.placeholder}
              autoComplete="email"
              aria-label={words.email.label}
            />
            {activity.element}
          </div>
          {email.message}
          {activity.message}
          <div className="two">
            {activeProjects.element}
            {clientType.element}
          </div>
          {activeProjects.message}
          {clientType.message}
          <div className="two">
            {projectArea.element}
            {partnershipMode.element}
          </div>
          {projectArea.message}
          {partnershipMode.message}
          <textarea {...goals.props} rows={3} placeholder={words.goals.placeholder} aria-label={words.goals.label} />
          {goals.message}

          {/* The trap (`TRAP_FIELD`), as in the demo request form. */}
          <div className="vh" aria-hidden="true">
            <textarea name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          {(outcome.outcome === 'refused' || outcome.outcome === 'failed') && (
            <small role="alert" className="refusal">
              {outcome.message}
            </small>
          )}

          <button type="submit" className="btn p" disabled={!answers.complete || sending} style={{ justifyContent: 'center' }}>
            {wording.submit}
          </button>
        </>
      )}
      <small className="fine">{wording.finePrint}</small>
    </form>
  );
}
