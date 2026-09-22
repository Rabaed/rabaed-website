'use client';

import type { ReactNode } from 'react';
import { UploadField } from '@/components/upload-field';
import { fieldOptions, TRAP_FIELD, type FormPageWording } from '@/forms/definition';
import { REFERRAL_SIGNUP, type ReferralSignupField } from '@/forms/referral-signup';
import { useAnswers } from '@/forms/use-answers';
import { useSubmission } from '@/forms/use-submission';
import { localePath, type Locale } from '@/lib/locales';

/**
 * What the referrer agrees to and declares, in each language. The terms and
 * the privacy policy are Arabic alone, so both languages link to the Arabic.
 */
const CONSENTS: Readonly<Record<Locale, { readonly terms: ReactNode; readonly declaration: string; readonly declared: string }>> = {
  ar: {
    terms: (
      <>
        أوافق على <a href={localePath('ar', '/referral-terms')}>شروط وأحكام برنامج الإحالة</a> و
        <a href={localePath('ar', '/privacy')}>سياسة الخصوصية</a>.
      </>
    ),
    declaration:
      'أُقرّ بأن ترشيحي لمنصة ربائد لا يتعارض مع واجباتي المهنية، وأنه لا يؤثر على أي قرار فني أو تعاقدي أتخذه أو أُشارك فيه بحكم عملي. كما أُقرّ بعدم وجود ما يمنعني نظاماً أو تعاقدياً مع جهة عملي من قبول هذا المقابل، وأتحمّل وحدي مسؤولية أي إخلال بذلك.',
    declared: 'أُقرّ بما ورد أعلاه (إقرار عدم التعارض).',
  },
  en: {
    terms: (
      <>
        I agree to the{' '}
        <a href={localePath('ar', '/referral-terms')} hrefLang="ar">
          Referral Program terms and conditions
        </a>{' '}
        and the{' '}
        <a href={localePath('ar', '/privacy')} hrefLang="ar">
          privacy policy
        </a>
        , published in Arabic, which is their binding text.
      </>
    ),
    declaration:
      'I declare that referring Rabaed does not conflict with my professional duties, and does not influence any technical or contractual decision I make or take part in through my work. I also declare that nothing in law or in any contract with my employer prevents me from accepting this payment, and that I alone am responsible for any breach of this.',
    declared: 'I make the declaration above (no-conflict declaration).',
  },
};

/** The professions, in the Reference site's order. */
const PROFESSIONS = fieldOptions(REFERRAL_SIGNUP.fields.profession);

/**
 * The Referral Program signup form: the referrer's details, their bank
 * details as documents rather than typed numbers, and the two consents.
 *
 * Its fields and rules are its definition's (`src/forms/referral-signup.ts`),
 * its words the CMS's. It is sent to the submission pipeline (ticket 27),
 * which checks each document again by its contents, keeps them in private
 * storage, and records both consents with the submission (ticket 28).
 *
 * - **The Reference site's fake success is gone.** Its button revealed «تم
 *   تسجيلك. كودك هو RB-A47K» — a referral code nobody issued, for a
 *   registration nobody stored (spec: Forms). What the server says once the
 *   signup is stored promises only what happens.
 * - **The submit button stays disabled** until every required answer, the IBAN
 *   certificate and both consents are given, and while the signup is on its
 *   way; each document field shows its upload as it goes.
 * - **Each message sits under its row**, not inside it: the rows keep the
 *   Reference site's fields as their direct children, which its stylesheet
 *   and the comparison with it rely on.
 *
 * What the two consents say — the terms sentence with its links, and the
 * declaration — stays here: it is what the referrer agrees to, not wording.
 * In English it says the same, and says that the terms and the privacy policy
 * it links to are published in Arabic, which is their binding text (spec: Out
 * of Scope): an English reader agrees to them knowing that.
 */
export function ReferralSignupForm({ wording }: { wording: FormPageWording<ReferralSignupField> }) {
  const answers = useAnswers(REFERRAL_SIGNUP, wording);
  const { outcome, progress, sending, send } = useSubmission(REFERRAL_SIGNUP, wording.locale, answers.refuse);
  const words = wording.fields;

  const name = answers.field('name');
  const phone = answers.field('phone');
  const email = answers.field('email');
  const city = answers.field('city');
  const profession = answers.field('profession');
  const employer = answers.field('employer');
  const accountHolder = answers.field('accountHolder');
  const acceptTerms = answers.consent('acceptTerms');
  const declareNoConflict = answers.consent('declareNoConflict');

  const upload = (field: 'ibanCertificate' | 'commercialRegistration' | 'taxRegistrationCertificate') => {
    const state = answers.upload(field);
    return {
      element: (
        <UploadField
          locale={wording.locale}
          name={field}
          label={words[field].label}
          note={words[field].placeholder}
          required={state.required}
          onFile={state.onFile}
          invalid={state.invalid}
          rejected={state.rejected}
          describedBy={state.describedBy}
          progress={progress}
        />
      ),
      message: state.message,
    };
  };
  const ibanCertificate = upload('ibanCertificate');
  const commercialRegistration = upload('commercialRegistration');
  const taxRegistrationCertificate = upload('taxRegistrationCertificate');

  return (
    <form
      className="form"
      noValidate
      aria-labelledby="referral-signup-title"
      onSubmit={(event) => {
        event.preventDefault();
        if (answers.complete) void send(event.currentTarget);
      }}
    >
      <h3 id="referral-signup-title">{wording.heading}</h3>
      <small>{wording.lead}</small>

      {outcome.outcome === 'received' ? (
        // The fields go with the signup, so it cannot be sent again by mistake.
        <small role="status" className="sent">
          {outcome.message}
        </small>
      ) : (
        <>
          {/* Each field is named by its `aria-label`, as on the Reference site
              and in the demo request form; visible labels are ticket 36's. */}
          <div className="two">
            <input {...name.props} placeholder={words.name.placeholder} autoComplete="name" aria-label={words.name.label} />
            <input {...phone.props} type="tel" placeholder={words.phone.placeholder} autoComplete="tel" aria-label={words.phone.label} />
          </div>
          {name.message}
          {phone.message}
          <div className="two">
            <input
              {...email.props}
              type="email"
              placeholder={words.email.placeholder}
              autoComplete="email"
              aria-label={words.email.label}
            />
            <input {...city.props} placeholder={words.city.placeholder} aria-label={words.city.label} />
          </div>
          {email.message}
          {city.message}
          <div className="two">
            <select {...profession.props} aria-label={words.profession.label}>
              <option value="">{words.profession.placeholder}</option>
              {PROFESSIONS.map((value) => (
                <option key={value} value={value}>
                  {words.profession.options![value]}
                </option>
              ))}
            </select>
            <input
              {...employer.props}
              placeholder={words.employer.placeholder}
              autoComplete="organization"
              aria-label={words.employer.label}
            />
          </div>
          {profession.message}
          {employer.message}
          <div className="two">
            {ibanCertificate.element}
            <input {...accountHolder.props} placeholder={words.accountHolder.placeholder} aria-label={words.accountHolder.label} />
          </div>
          {ibanCertificate.message}
          {accountHolder.message}
          <div className="two">
            {commercialRegistration.element}
            {taxRegistrationCertificate.element}
          </div>
          {commercialRegistration.message}
          {taxRegistrationCertificate.message}

          <label className="chk">
            <input {...acceptTerms.props} aria-label={words.acceptTerms.label} aria-describedby={acceptTerms.describedBy} />
            <span>{CONSENTS[wording.locale].terms}</span>
          </label>
          {acceptTerms.message}
          {/* What the checkbox under it declares, so it is read with it. */}
          <div className="declar" id="referral-declaration">
            {CONSENTS[wording.locale].declaration}
          </div>
          <label className="chk">
            <input
              {...declareNoConflict.props}
              aria-label={words.declareNoConflict.label}
              aria-describedby={['referral-declaration', declareNoConflict.describedBy].filter(Boolean).join(' ')}
            />
            <span>{CONSENTS[wording.locale].declared}</span>
          </label>
          {declareNoConflict.message}

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
