# 29: Partnership application form

**What to build:** An engineering office completes the partnership application, attaches its commercial registration, and the application reaches the team with a confirmation back to the applicant.

**Blocked by:** 27, 16

**Status:** resolved

- [x] All fields from the Reference site captured and stored, including the free-text field
- [x] Commercial registration uploaded to private storage as in ticket 28
- [x] Arabic validation, alert email and applicant confirmation all working
- [x] Spam protection applies as on the other forms
- [x] Submissions are distinguishable from referral and demo submissions in the admin

## Comments

**What ticket 16 leaves for this one.**

The form is `src/components/partnership/application-form.tsx`, on `/partnership#apply`:

- **Its fields are ready.** Thirteen, named in the Reference site's order: `company`, `commercialRegistration` (the shared `src/components/upload-field.tsx`), `city`, `name`, `jobTitle`, `phone`, `email`, the five lists `activity`, `activeProjects`, `clientType`, `projectArea`, `partnershipMode`, and the free text `goals`. Every starred field and the commercial registration are `required`; `goals` is not.
- **The lists send English values, not their Arabic text.** The Reference site's options have no `value`, so they would have sent the words shown. Here each has a stable value — `consulting-office`, `over-25`, `under-5000` (square metres), `embedded-in-proposal` and the rest — and the first option of each is the empty prompt `required` refuses. Store these values, and show the admin the Arabic labels beside them.
- **Its submit button is disabled.**
- **Its small print still reads «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.»** That is true until this ticket, and must go with it.

**Mostly a definition (decided 13 September 2026).** Ticket 27 builds one submission pipeline and ticket 28 puts the upload checks and private storage inside it. This form is a new definition run through them, not a new pipeline. Its wording is editable by Editors; its fields are not (spec: Forms).

**Built on 20 September 2026.** A definition, as planned: no line of the pipeline changed. Where things are, and what was decided along the way.

- **The definition is `src/forms/partnership-application.ts`**, thirteen fields in the Reference site's order with the values ticket 16 gave them, and the commercial registration as a `document`. Its wording is the settings global `partnership-application-form`, published by `20260920_170917_publish_partnership_application_wording.ts`. The form itself, `src/components/partnership/application-form.tsx`, is now the referral signup's shape: `useAnswers` for the answers, `useSubmission` for the sending, and each message under its row rather than inside it.
- **The small print says what happens to the registration**, in place of «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.»: «يُحفظ سجلك التجاري في مساحة خاصة لا يصل إليها إلا فريق ربائد، ولا يُستخدم إلا لدراسة طلب الشراكة.» It wraps on narrow screens, so the comparison with the Reference site leaves its height out, as the referral page's does.
- **The Reference site's own «وصلنا طلبك. يتواصل معك فريق الشراكات خلال يومي عمل لترتيب اجتماع التعارف.»** is what the server says once the application is stored. It is in no page before one is sent.
- **The free text is the first `textarea` any form definition has had**, so `use-answers.tsx` now hands its props to one as well as to inputs and selects. The trap field's own textarea is clipped out of the page in a `.vh`, and the page's two suites leave it out of what they count and measure. Its placeholder — the Reference site's whole question, 41 characters — is longer than the 40 the CMS allowed a placeholder, so that limit is now 60 for every form: a form has to be able to carry its words as written.
- **`method="post"` and `enctype` are gone from the form**, as they went from the referral signup in ticket 28. Every form now sends through `/api/forms/<form>` so that an upload can report its progress; a `method` no submission uses would say the page does something it does not.
- **A list option's column can be longer than Postgres allows.** `option_embedded_in_proposal` under `partnershipMode` made a 67-character column in the versions table, which Postgres would have cut to 63 without saying so. Payload's `dbName` does not reach a column inside a group, so `optionFieldName` now names a whole list's options `o_` instead of `option_` when `option_` would overflow — this list only, today, and no other form's columns change. Payload itself warns when the CMS starts if a name still overflows, which is how this one was found.
- **No alert address, as for the other forms:** until one is set the application is stored and no email goes out at all.
- **Tests.** `tests/e2e/form-submission.spec.ts` has the form's own six: the Arabic messages and the locked button, an application stored once with every answer and the registration, the registration reachable only by a signed-in editor through a link that expires, the server refusing a choice it does not offer and a file only named like a PDF, the trap, and the alert and confirmation once an address is set. It has left the "not sending yet" list, which now holds the tool download alone.
