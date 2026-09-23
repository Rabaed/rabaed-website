# 81: Bug — the forms can make Rabaed's mailbox send mail to strangers

**What is wrong:** Every form sends its confirmation email to whatever address the visitor types, and greets them by whatever name they typed — up to 120 characters, links and all. The only brakes are the hidden trap field, the form's one-off token (which any script can make up too), and five requests an hour from one network address. So once an alert address is set, a script with a few network addresses can have Rabaed's mailbox send "مرحباً <their advert and link>،" to as many strangers as it likes. Mail providers judge a domain by what it sends: enough of that and the team's real mail goes to spam.

And the five-an-hour limit leaks: it counts the recent requests and *then* stores, so requests sent at the same moment all count the same number and all get through.

Found by the architecture review of 24 September 2026 (L1).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent — the founder chose to cap the confirmation, 24 September 2026

The spec keeps its rule, "a honeypot field plus rate limiting per address, with a challenge added only if abuse appears" (spec: Forms): no challenge is added. What changes is what a confirmation is worth to somebody abusing it.

- [ ] One email address is sent at most **three confirmations in 24 hours**, whatever form, language or network address they come from, and however its letters are cased
- [ ] The whole site sends at most **30 confirmations an hour**
- [ ] A request over either limit is still stored and the team still alerted; only the visitor's confirmation is not sent, and the record says so in the admin
- [ ] The visitor's name goes into the greeting only when it reads as a name: no link, no web or email address, no digits, 60 characters at most. Otherwise the greeting leaves it out and still reads right («مرحباً،», "Hello,")
- [ ] Requests sent at the same moment from one network address: exactly five in the hour are stored
- [ ] Confirmations sent at the same moment to one address: exactly three are sent
- [ ] An ADR records the limits and why no challenge was added

## Comments

> *The founder chose, 24 September 2026:* cap the confirmation — per address, sitewide, a name that is not a name left out, and the same-moment gap closed — rather than adding Cloudflare Turnstile now, which would have overruled the spec's rule and needed an outside service before launch.
