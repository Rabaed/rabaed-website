'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  DETAIL_ERRORS,
  isValidDetail,
  REQUIRED_DETAILS,
  type RequiredDetail,
} from '@/components/tool/download-details';

/** The country codes offered, verbatim. Each label opens with a left-to-right mark, so the + stays before the digits. */
const COUNTRY_CODES = [
  { value: '+966', label: '‎+966 السعودية' },
  { value: '+971', label: '‎+971 الإمارات' },
  { value: '+965', label: '‎+965 الكويت' },
  { value: '+974', label: '‎+974 قطر' },
  { value: '+973', label: '‎+973 البحرين' },
  { value: '+968', label: '‎+968 عُمان' },
  { value: '+962', label: '‎+962 الأردن' },
  { value: '+20', label: '‎+20 مصر' },
  { value: '+90', label: '‎+90 تركيا' },
  { value: 'other', label: 'أخرى' },
] as const;

const LOCKED = 'أكمل البيانات لتفعيل التحميل';
const UNLOCKED = 'حمّل الأداة الآن';

/**
 * The Pour Tracker download form, as the Reference site behaves: the button
 * stays locked, and says so, until the four required details are valid; the
 * bar above fills a quarter for each; and a field says what is wrong with it
 * only once the visitor has left it, then clears as soon as it is put right.
 *
 * A client component, rendered on the server first: the whole form, locked, is
 * in the first response, and with JavaScript off it stays locked.
 *
 * **Once unlocked it sends nothing and delivers nothing — yet.** The Reference
 * site starts the download on submit without keeping the details, and the
 * spec forbids exactly that: "The Pour Tracker download is delivered only
 * after the submission is recorded." Ticket 30 records the submission and
 * delivers the file, and gives this form somewhere to send. Until then a valid
 * submit does nothing a visitor can see, and nothing claims the download
 * started.
 *
 * `method="post"` is set now so that the day it sends, the details travel in
 * the request body rather than the address.
 */
export function DownloadForm() {
  const [details, setDetails] = useState<Record<RequiredDetail, string>>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [left, setLeft] = useState<ReadonlySet<RequiredDetail>>(new Set());

  const validCount = REQUIRED_DETAILS.filter((detail) => isValidDetail(detail, details[detail])).length;
  const complete = validCount === REQUIRED_DETAILS.length;

  /** The props a required field takes, and the message under it. */
  const required = (detail: RequiredDetail) => {
    const wrong = left.has(detail) && !isValidDetail(detail, details[detail]);
    const errorId = `er-${detail}`;
    return {
      field: {
        name: detail,
        value: details[detail],
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          setDetails((previous) => ({ ...previous, [detail]: event.target.value })),
        onBlur: () => setLeft((previous) => (previous.has(detail) ? previous : new Set(previous).add(detail))),
        className: wrong ? 'bad' : undefined,
        'aria-invalid': wrong || undefined,
        // Only while the message is shown: a description that is always there
        // would be read out on a field that is fine.
        'aria-describedby': wrong ? errorId : undefined,
      },
      error: (
        <small className={wrong ? 'er on' : 'er'} id={errorId}>
          {DETAIL_ERRORS[detail]}
        </small>
      ),
    };
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // As on the Reference site, a submit counts every field as left.
    setLeft(new Set(REQUIRED_DETAILS));
    // Ticket 30: record the details, then deliver the file.
  };

  const firstName = required('firstName');
  const lastName = required('lastName');
  const phone = required('phone');
  const email = required('email');

  return (
    <div className="form" id="tl-form-card">
      <div id="tl-form-view">
        <h3 id="tl-form-title">بيانات التحميل</h3>
        <small>حقل الشركة اختياري. البقية مطلوبة لتفعيل زر التحميل.</small>
        <div className="tl-prog">
          <i style={{ width: `${Math.round((validCount / REQUIRED_DETAILS.length) * 100)}%` }} />
        </div>

        <form id="tl-form" method="post" noValidate autoComplete="on" aria-labelledby="tl-form-title" onSubmit={onSubmit}>
          <div className="two">
            <div>
              <input {...firstName.field} autoComplete="given-name" placeholder="الاسم الأول *" aria-label="الاسم الأول" />
              {firstName.error}
            </div>
            <div>
              <input {...lastName.field} autoComplete="family-name" placeholder="اسم العائلة *" aria-label="اسم العائلة" />
              {lastName.error}
            </div>
          </div>

          {/* The phone number and the address are Latin, so they are typed
              left to right, but aligned to the right like the rest of the
              form — the Reference site's override, kept. */}
          <div>
            <div className="tl-cc">
              <select name="countryCode" aria-label="مفتاح الدولة" defaultValue="+966">
                {COUNTRY_CODES.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>
              <input
                {...phone.field}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                dir="ltr"
                style={{ textAlign: 'right' }}
                placeholder="5X XXX XXXX *"
                aria-label="رقم الجوال"
              />
            </div>
            {phone.error}
          </div>
          <div>
            <input
              {...email.field}
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              style={{ textAlign: 'right' }}
              placeholder="البريد الإلكتروني *"
              aria-label="البريد الإلكتروني"
            />
            {email.error}
          </div>
          <input name="company" autoComplete="organization" placeholder="اسم الشركة (اختياري)" aria-label="اسم الشركة" />

          <button className="btn p" type="submit" disabled={!complete} style={{ justifyContent: 'center' }}>
            {complete ? UNLOCKED : LOCKED}
          </button>
          <small className="fine">
            بالضغط على زر التحميل توافق على أن نتواصل معك بخصوص الأداة وتحديثاتها. لن نشارك بياناتك مع أي جهة أخرى.
          </small>
        </form>
      </div>
    </div>
  );
}
