'use client';

import type { FormEvent } from 'react';
import { fieldNames } from '@/forms/definition';
import { TOOL_DOWNLOAD } from '@/forms/tool-download';
import { useAnswers } from '@/forms/use-answers';

const WORDING = TOOL_DOWNLOAD.wording;

/** The four details the button waits for; the country code has a default and the company is optional. */
const REQUIRED = fieldNames(TOOL_DOWNLOAD).filter((name) => TOOL_DOWNLOAD.fields[name].required);

const LOCKED = 'أكمل البيانات لتفعيل التحميل';

/**
 * The Pour Tracker download form, as the Reference site behaves: the button
 * stays locked, and says so, until the four required details are valid; the
 * bar above fills a quarter for each; and a field says what is wrong with it
 * only once the visitor has been into it and out again, then clears as soon as
 * it is put right.
 *
 * Its fields, rules and words are its definition's (`src/forms/tool-download.ts`),
 * the same one the server will check a download request against.
 *
 * A client component, rendered on the server first: the whole form, locked, is
 * in the first response, and with JavaScript off it stays locked.
 *
 * **Once unlocked it sends nothing and delivers nothing — yet.** The Reference
 * site starts the download on submit without keeping the details, and the
 * spec forbids exactly that: "The Pour Tracker download is delivered only
 * after the submission is recorded." Ticket 30 runs this form through the
 * submission pipeline and delivers the file. Until then a valid submit does
 * nothing a visitor can see, and nothing claims the download started.
 */
export function DownloadForm() {
  const { acceptable, complete, field, touch } = useAnswers(TOOL_DOWNLOAD, WORDING, { countryCode: '+966' });
  const validCount = REQUIRED.filter(acceptable).length;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // As on the Reference site, a submit counts every field as touched.
    touch(REQUIRED);
    // Ticket 30: record the details, then deliver the file.
  };

  const firstName = field('firstName');
  const lastName = field('lastName');
  const countryCode = field('countryCode');
  const phone = field('phone');
  const email = field('email');
  const company = field('company');
  const words = WORDING.fields;

  return (
    <div className="form" id="tl-form-card">
      <div id="tl-form-view">
        <h3 id="tl-form-title">{WORDING.heading}</h3>
        <small>{WORDING.lead}</small>
        <div className="tl-prog">
          <i style={{ width: `${Math.round((validCount / REQUIRED.length) * 100)}%` }} />
        </div>

        <form id="tl-form" method="post" noValidate autoComplete="on" aria-labelledby="tl-form-title" onSubmit={onSubmit}>
          <div className="two">
            <div>
              <input
                {...firstName.props}
                autoComplete="given-name"
                placeholder={words.firstName.placeholder}
                aria-label={words.firstName.label}
              />
              {firstName.message}
            </div>
            <div>
              <input
                {...lastName.props}
                autoComplete="family-name"
                placeholder={words.lastName.placeholder}
                aria-label={words.lastName.label}
              />
              {lastName.message}
            </div>
          </div>

          {/* The phone number and the address are Latin, so they are typed
              left to right, but aligned to the right like the rest of the
              form — the Reference site's override, kept. */}
          <div>
            <div className="tl-cc">
              <select {...countryCode.props} aria-label={words.countryCode.label}>
                {TOOL_DOWNLOAD.fields.countryCode.options!.map((value) => (
                  <option key={value} value={value}>
                    {words.countryCode.options![value]}
                  </option>
                ))}
              </select>
              <input
                {...phone.props}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                dir="ltr"
                style={{ textAlign: 'right' }}
                placeholder={words.phone.placeholder}
                aria-label={words.phone.label}
              />
            </div>
            {phone.message}
          </div>
          <div>
            <input
              {...email.props}
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              style={{ textAlign: 'right' }}
              placeholder={words.email.placeholder}
              aria-label={words.email.label}
            />
            {email.message}
          </div>
          <input {...company.props} autoComplete="organization" placeholder={words.company.placeholder} aria-label={words.company.label} />

          <button className="btn p" type="submit" disabled={!complete} style={{ justifyContent: 'center' }}>
            {complete ? WORDING.submit : LOCKED}
          </button>
          <small className="fine">{WORDING.finePrint}</small>
        </form>
      </div>
    </div>
  );
}
