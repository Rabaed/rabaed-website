'use client';

import type { FormEvent } from 'react';
import { TRAP_FIELD, fieldNames, fieldOptions, isRequired, type FormPageWording } from '@/forms/definition';
import { TOOL_DOWNLOAD, type ToolDownloadField } from '@/forms/tool-download';
import { useAnswers } from '@/forms/use-answers';
import { useSubmission } from '@/forms/use-submission';

/** The four details the button waits for; the country code has a default and the company is optional. */
const REQUIRED = fieldNames(TOOL_DOWNLOAD).filter((name) => isRequired(TOOL_DOWNLOAD.fields[name]));

/** The country codes, in the Reference site's order. */
const COUNTRY_CODES = fieldOptions(TOOL_DOWNLOAD.fields.countryCode);

const LOCKED = 'أكمل البيانات لتفعيل التحميل';

/**
 * The file itself, at the address `next.config.ts` sends as an attachment.
 * The name is the Reference site's, and ticket 49 replaces what is behind it
 * with the real tool. Named once: the panel says it, the link saves under it,
 * and the confirmation email repeats it.
 */
const DOWNLOAD_NAME = 'Rabaed-Pour-Tracker.html';
const FILE = `/downloads/${DOWNLOAD_NAME}`;

/**
 * What to do with the file once it has arrived, the Reference site's three
 * steps. They describe the file rather than the page, so they stay in code
 * with the file's name: an Editor changing them would be describing a browser
 * (`reference/site/tool.html`, `#tl-done`).
 */
const STEPS = [
  { bold: 'احفظ الملف', text: 'في مكان ثابت — سطح المكتب أو مجلد المشروع. ليس في مجلد التنزيلات.' },
  { bold: 'افتحه بنقرتين', text: 'في Chrome أو Edge.' },
  { bold: 'اختر مجلداً للمشروع', text: 'عند أول تشغيل — وابدأ بتسجيل أول صبّة.' },
] as const;

/**
 * Starts the download. A link clicked from the page rather than a redirect:
 * the visitor stays on the page that just confirmed the details, which is
 * where the three steps for opening the file are.
 *
 * `download` as well as the `Content-Disposition` header `next.config.ts`
 * sends: the header is what makes the file save rather than open, and the
 * attribute is what saves it where the header does not reach — a file served
 * from somewhere else one day, or a browser reading a cached response.
 *
 * **It cannot report back.** A browser tells a page nothing about a download
 * it started, refused or lost, so nothing here may claim the file arrived.
 * What the panel claims is what this can promise: the details are kept, and
 * the file was asked for. The link beside it is what a visitor uses when it
 * did not come.
 */
function deliver(): void {
  const link = document.createElement('a');
  link.href = FILE;
  link.download = DOWNLOAD_NAME;
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * The Pour Tracker download form, as the Reference site behaves: the button
 * stays locked, and says so, until the four required details are valid; the
 * bar above fills a quarter for each; and a field says what is wrong with it
 * only once the visitor has been into it and out again, then clears as soon as
 * it is put right.
 *
 * Its fields and rules are its definition's (`src/forms/tool-download.ts`),
 * the same one the server checks a download request against; its words are an
 * Editor's, read from the CMS by the page (ticket 30).
 *
 * A client component, rendered on the server first: the whole form, locked, is
 * in the first response, and with JavaScript off it stays locked.
 *
 * **The details are stored before the file is sent**, which is the one place
 * this departs from the Reference site: there, a submit starts the download
 * whatever happens and writes the details to a console message. The spec is
 * the other way round — "delivered only after the submission is recorded" —
 * so a refusal or a failure here delivers nothing, and says so.
 */
export function DownloadForm({ wording }: { wording: FormPageWording<ToolDownloadField> }) {
  const answers = useAnswers(TOOL_DOWNLOAD, wording, { countryCode: '+966' });
  const { acceptable, complete, field, touch } = answers;
  const { outcome, sending, send } = useSubmission(TOOL_DOWNLOAD, answers.refuse);
  const validCount = REQUIRED.filter(acceptable).length;
  const delivered = outcome.outcome === 'received';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // As on the Reference site, a submit counts every field as touched —
    // every one, not only the required four, or an over-long company name
    // locks the button with nothing under the field to say why.
    touch(fieldNames(TOOL_DOWNLOAD));
    if (!complete) return;

    const form = event.currentTarget;
    const answer = await send(form);
    // Only once it is stored. A refusal, a failure or an answer the server
    // would not take delivers nothing at all.
    if (answer?.outcome === 'received') deliver();
  };

  const firstName = field('firstName');
  const lastName = field('lastName');
  const countryCode = field('countryCode');
  const phone = field('phone');
  const email = field('email');
  const company = field('company');
  const words = wording.fields;

  if (delivered) {
    return (
      <div className="form" id="tl-form-card">
        {/* The Reference site's panel for after the download has started,
            which it showed whether or not anything was recorded. Here it is
            shown only once the details are stored, so every word of it is
            true. */}
        <div id="tl-done" className="tl-done">
          <div className="tl-ok" role="status">
            {outcome.message}
          </div>
          <p>
            ابحث عن{' '}
            <b className="mono" dir="ltr">
              {DOWNLOAD_NAME}
            </b>{' '}
            في مجلد التنزيلات. ثلاث خطوات وتكون جاهزاً:
          </p>
          {/* A browser tells a page nothing about a download, so the panel
              says what it knows — the details are kept — and points at the
              link for the case it cannot see. */}
          <p>إن لم يبدأ التحميل خلال ثوانٍ، اضغط الرابط أسفل الخطوات.</p>
          <ol className="tl-steps">
            {STEPS.map((step, index) => (
              <li key={step.bold}>
                <i>{index + 1}</i>
                <span>
                  <b>{step.bold}</b> {step.text}
                </span>
              </li>
            ))}
          </ol>
          {/* A link, not a button: a browser that blocked the first download,
              or lost it, still follows a link the visitor pressed — and this
              one needs no JavaScript at all. The details are already stored,
              so it asks the server for nothing. */}
          <a
            className="btn o"
            href={FILE}
            download={DOWNLOAD_NAME}
            style={{ justifyContent: 'center', width: '100%' }}
          >
            لم يبدأ التحميل؟ اضغط هنا
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="form" id="tl-form-card">
      <div id="tl-form-view">
        <h3 id="tl-form-title">{wording.heading}</h3>
        <small>{wording.lead}</small>
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
                {COUNTRY_CODES.map((value) => (
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

          {/* The trap (`TRAP_FIELD`), as in the demo request form. */}
          <div className="vh" aria-hidden="true">
            <textarea name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          {(outcome.outcome === 'refused' || outcome.outcome === 'failed') && (
            <small role="alert" className="refusal">
              {outcome.message}
            </small>
          )}

          <button className="btn p" type="submit" disabled={!complete || sending} style={{ justifyContent: 'center' }}>
            {complete ? wording.submit : LOCKED}
          </button>
          <small className="fine">{wording.finePrint}</small>
        </form>
      </div>
    </div>
  );
}
