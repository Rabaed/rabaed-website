# 27: Forms that work, delivered through the demo request

**What to build:** A visitor fills in the demo request form and it genuinely arrives: stored in the database, an alert email to the team, and an Arabic confirmation to the visitor. This ticket builds the machinery every other form then reuses.

**Blocked by:** 19, 11

**Status:** resolved

- [x] Real form submission handled on the server, not in the browser
- [x] Arabic validation messages; the submit button gates on validity
- [x] One submission creates exactly one stored record, visible in the admin
- [x] Alert email sent through the existing Microsoft 365 no-reply mailbox to a configurable address (left empty until supplied — the site must not break when it is unset)
- [x] Arabic confirmation email sent to the applicant
- [x] Honeypot field plus per-address rate limiting; a bot-shaped submission is rejected
- [x] Credentials are supplied as environment variables and never committed
- [x] The same form works identically in all three of its placements
- [x] Each form is a definition — fields, rules, Arabic messages — that the browser and the server both read; the tool download's `download-details.ts` is the first of them, widened
- [x] One server-side submission pipeline — validate, honeypot and rate limit, store, alert, confirm — that tickets 28–30 reuse by adding a definition rather than rebuilding it
- [x] Mail sits behind an adapter: Microsoft 365 in production, an outbox the tests can read, and nothing sent while no alert address is set
- [x] Editors change the form's wording (labels, placeholders, messages, the confirmation email) and the alert address from the CMS; which fields exist stays in code
- [x] One submission test module, run per form and per placement, replaces the four copied "sends nothing" tests in the home, start, referral and tool specs

## Comments

**Widened on 13 September 2026** from the architecture review. The three existing forms validated three different ways — none, the browser's own bubbles, and the tool form's rules with Arabic messages — and none had anywhere to submit, so without this each of tickets 27–30 would have rebuilt the same server work. The founder chose wording and alert address editable by Editors, with the field set fixed in code because every field reaches storage, spam protection and the Privacy Policy (spec: Forms).

**Built on 14 September 2026.** Where things are, and what was decided along the way.

- **The pieces.** Definitions, pipeline, mail and the browser's answer-checking are in `src/forms/`: `definition.ts` (the shape and the shared rules), `demo-request.ts`, `tool-download.ts` (was `download-details.ts`), `registry.ts`, `submission.ts` (the pipeline), `actions.ts` (the one server action every form calls), `mail.ts`, `settings.ts` and `use-answers.tsx`. The CMS side is `src/cms/collections/form-submissions.ts` and `src/cms/globals/form-settings.ts`, which builds a form's settings global from its definition.
- **"Nothing sent while no alert address is set" is read literally:** with the address empty, neither the alert nor the applicant's confirmation goes out. The request is still stored, and the record says both emails were not sent. The alert address is per form. If the founder would rather confirmations go out regardless, it is one condition in `sendMail` in `submission.ts`.
- **The Reference site's «وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.»** is the message shown once a request is stored. It comes back from the server, so it is not in any page before a request is sent.
- **Which demo fields are required:** name, email, role and phone. The company and the number of active projects are optional. The Reference form had no messages; the name, email and phone ones are the tool page's, for the same rules.
- **Spam:** a hidden trap textarea, and at most five requests an hour from one network address, counted from the stored records by a one-way hash of the address. A second send of the same request carries the same one-off token and is not stored again.
- **Mail is sent after the visitor is answered** (`after`), and what became of each email is written on the record: sent, not sent, or failed.
- **Microsoft 365 over SMTP with a password**, as the spec says (`MAIL_USER`, `MAIL_PASSWORD`). Microsoft has been retiring password sign-in for SMTP, so the tenant may refuse it; `docs/deployment.md` says what that looks like and where to change it.
- **Tests.** `tests/e2e/form-submission.spec.ts` covers the demo form in its three places, and keeps the "sends nothing" check for the referral, partnership and tool forms until 28–30 wire them. The test server writes mail to an outbox folder instead of sending it. The form suite has two editor accounts of its own. Its read-only lookups, which run side by side, sign in again when Payload's session race refuses them.

**How tickets 28–30 plug in:** for a new form, add its id to `FORM_IDS` in `src/forms/definition.ts` and its definition to `FORMS` (the migration then extends the submissions' `form` list); add the form to `SUBMITTABLE_FORMS` in `src/forms/registry.ts`, create a migration for its settings global (`npm run cms:migration`) plus one that publishes its starting words written out in full, as `20260914_194144_publish_demo_request_wording.ts` does, send the form with `sendForm(definition.id, data)` as `demo-request-form.tsx` does, and move its entry in `form-submission.spec.ts` from the "not sending yet" list into its own placement tests.
