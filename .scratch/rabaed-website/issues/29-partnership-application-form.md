# 29: Partnership application form

**What to build:** An engineering office completes the partnership application, attaches its commercial registration, and the application reaches the team with a confirmation back to the applicant.

**Blocked by:** 27, 16

**Status:** ready-for-agent

- [ ] All fields from the Reference site captured and stored, including the free-text field
- [ ] Commercial registration uploaded to private storage as in ticket 28
- [ ] Arabic validation, alert email and applicant confirmation all working
- [ ] Spam protection applies as on the other forms
- [ ] Submissions are distinguishable from referral and demo submissions in the admin

## Comments

**What ticket 16 leaves for this one.**

The form is `src/components/partnership/application-form.tsx`, on `/partnership#apply`:

- **Its fields are ready.** Thirteen, named in the Reference site's order: `company`, `commercialRegistration` (the shared `src/components/upload-field.tsx`), `city`, `name`, `jobTitle`, `phone`, `email`, the five lists `activity`, `activeProjects`, `clientType`, `projectArea`, `partnershipMode`, and the free text `goals`. Every starred field and the commercial registration are `required`; `goals` is not.
- **The lists send English values, not their Arabic text.** The Reference site's options have no `value`, so they would have sent the words shown. Here each has a stable value — `consulting-office`, `over-25`, `under-5000` (square metres), `embedded-in-proposal` and the rest — and the first option of each is the empty prompt `required` refuses. Store these values, and show the admin the Arabic labels beside them.
- **Its submit button is disabled.**
- **Its small print still reads «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.»** That is true until this ticket, and must go with it.
