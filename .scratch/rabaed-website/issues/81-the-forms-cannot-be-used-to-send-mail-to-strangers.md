# 81: Bug — the forms can make Rabaed's mailbox send mail to strangers

**What is wrong:** Every form sends its confirmation email to whatever address the visitor types, and greets them by whatever name they typed — up to 120 characters, links and all. The only brakes are the hidden trap field, the form's one-off token (which any script can make up too), and five requests an hour from one network address. So once an alert address is set, a script with a few network addresses can have Rabaed's mailbox send "مرحباً <their advert and link>،" to as many strangers as it likes. Mail providers judge a domain by what it sends: enough of that and the team's real mail goes to spam.

And the five-an-hour limit leaks: it counts the recent requests and *then* stores, so requests sent at the same moment all count the same number and all get through.

Found by the architecture review of 24 September 2026 (L1).

**Blocked by:** None (can start immediately).

**Status:** resolved — the founder chose to cap the confirmation, 24 September 2026

The spec keeps its rule, "a honeypot field plus rate limiting per address, with a challenge added only if abuse appears" (spec: Forms): no challenge is added. What changes is what a confirmation is worth to somebody abusing it.

- [x] One email address is sent at most **three confirmations in 24 hours**, whatever form, language or network address they come from, and however its letters are cased
- [x] The whole site sends at most **30 confirmations an hour**
- [x] A request over either limit is still stored and the team still alerted; only the visitor's confirmation is not sent, and the record says so in the admin
- [x] The visitor's name goes into the greeting only when it reads as a name: no link, no web or email address, no digits, 60 characters at most. Otherwise the greeting leaves it out and still reads right («مرحباً،», "Hello,")
- [x] Requests sent at the same moment from one network address: exactly five in the hour are stored
- [x] Confirmations sent at the same moment to one address: exactly three are sent
- [x] An ADR records the limits and why no challenge was added

## Comments

> *The founder chose, 24 September 2026:* cap the confirmation — per address, sitewide, a name that is not a name left out, and the same-moment gap closed — rather than adding Cloudflare Turnstile now, which would have overruled the spec's rule and needed an outside service before launch.

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The fix** is in `src/forms/submission.ts`. `CONFIRMATION_LIMIT` holds the two limits. `mayConfirm` counts the confirmations already sent or tried — to this address, without case, in 24 hours, and from the whole site in the hour — and claims this one before it is sent, all under one site-wide advisory lock. `oneAtATime` is that lock: a transaction holding `pg_advisory_xact_lock`, which gives up after five seconds. The five-an-hour limit is counted again under a lock for its network address, just before storing. A request refused there has its documents removed. `greeted` leaves out a name that does not read as one.
> - **Withheld** is a new confirmation outcome on the submission, labelled in the admin: `src/cms/collections/form-submissions.ts`, with migration `20260923_222518_form_confirmation_withheld` and `payload-types.ts` regenerated.
> - **The tests** are three new ones in `tests/e2e/form-submission.spec.ts`, each run red against the code before the fix:
>   - Eight requests sent at once from one network address: seven were stored before the fix, and five after.
>   - Five sent at once to one address, two of them upper-cased, with an alert address set: five confirmations before, and after it three sent, two `withheld`, and all five stored and alerted.
>   - An advert as the name, in Arabic and in English, and «م. سارة القحطاني»: the advert went into the greeting word for word before. After it the greetings read «مرحباً،» and "Hello,", the engineer's name is kept, and the team's alert still shows what was typed.
>   - The forms suite passes whole, 34 tests.
> - **The site-wide thirty is not driven by a test.** Filling it would withhold the confirmations the suites beside it expect, since all of them share one test server (ADR-0022, Consequences). It is the same query, lock and claim as the per-address limit, which is tested.
