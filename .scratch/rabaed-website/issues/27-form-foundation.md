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
