# 27: Forms that work, delivered through the demo request

**What to build:** A visitor fills in the demo request form and it genuinely arrives: stored in the database, an alert email to the team, and an Arabic confirmation to the visitor. This ticket builds the machinery every other form then reuses.

**Blocked by:** 19, 11

**Status:** ready-for-agent

- [ ] Real form submission handled on the server, not in the browser
- [ ] Arabic validation messages; the submit button gates on validity
- [ ] One submission creates exactly one stored record, visible in the admin
- [ ] Alert email sent through the existing Microsoft 365 no-reply mailbox to a configurable address (left empty until supplied — the site must not break when it is unset)
- [ ] Arabic confirmation email sent to the applicant
- [ ] Honeypot field plus per-address rate limiting; a bot-shaped submission is rejected
- [ ] Credentials are supplied as environment variables and never committed
- [ ] The same form works identically in all three of its placements
- [ ] Each form is a definition — fields, rules, Arabic messages — that the browser and the server both read; the tool download's `download-details.ts` is the first of them, widened
- [ ] One server-side submission pipeline — validate, honeypot and rate limit, store, alert, confirm — that tickets 28–30 reuse by adding a definition rather than rebuilding it
- [ ] Mail sits behind an adapter: Microsoft 365 in production, an outbox the tests can read, and nothing sent while no alert address is set
- [ ] Editors change the form's wording (labels, placeholders, messages, the confirmation email) and the alert address from the CMS; which fields exist stays in code
- [ ] One submission test module, run per form and per placement, replaces the four copied "sends nothing" tests in the home, start, referral and tool specs

## Comments

**Widened on 13 September 2026** from the architecture review. The three existing forms validated three different ways — none, the browser's own bubbles, and the tool form's rules with Arabic messages — and none had anywhere to submit, so without this each of tickets 27–30 would have rebuilt the same server work. The founder chose wording and alert address editable by Editors, with the field set fixed in code because every field reaches storage, spam protection and the Privacy Policy (spec: Forms).
