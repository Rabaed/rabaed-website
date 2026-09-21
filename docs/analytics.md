# What the site measures

The site counts visits and measures its own speed with **Vercel Web Analytics**
and **Vercel Speed Insights** (ticket 34). Both come from the company that
already hosts the site (ADR-0004), so nothing about a visitor is handed to a
third company, and neither one puts a cookie or anything else on a visitor's
device.

That last point is the reason there is no "we use cookies" banner to accept.
The banner exists to ask permission to store something on the visitor's device
or to follow them between sites; this does neither.

**This file is the plain-language inventory the Privacy Policy has to describe
(ticket 37).** What is written here is what the site actually does; if one of
them changes, both change together.

## What is recorded about a visit

Vercel records a row per page view, and that row holds:

| What | An example |
| --- | --- |
| When | 2026-09-21 09:06 |
| The page | `/product` |
| The page's shape, where pages share one | `/blog/[slug]` |
| Where the visitor came from | `https://chatgpt.com/` |
| The tags on the address, filtered | `?utm_source=chatgpt.com` |
| Roughly where in the world | Saudi Arabia, Riyadh |
| The device and browser | Android 14, Chrome 141, mobile |

There is no name, no email address, no IP address kept, no cookie, and no
identifier that survives the day: a visitor is counted as a number Vercel makes
out of the request itself, and that number is thrown away after 24 hours.
Nobody — us or Vercel — can join yesterday's visit to today's, or a visit here
to a visit on any other website.

Speed Insights records how fast pages actually were for real visitors: how long
until the page was readable, how quickly it responded to the first tap, how
much the layout moved while loading. It holds the page's address and the
measurements, and nothing about who was reading it.

## The three things we count ourselves

Beyond page views, the site raises three kinds of event. None of them carries
anything a person typed.

**An AI assistant sent someone.** When a visit arrives from ChatGPT, Perplexity
or Claude, the site counts it as `ai-referral`, saying which of the three
(`src/lib/ai-referrals.ts`). This is the one direct sign that the writing done
for AI assistants — the answer-first pages, the crawler rules, `llms.txt` — is
being read by them. It is counted separately from Vercel's own list of
referrers because an assistant often does not pass one on, and instead marks
the address it hands over with `utm_source`; reading both catches visits that
either alone would miss.

**A form was submitted.** When the server has stored a submission, the site
counts it under the form's own name — `demo-request`, `referral-signup`,
`partnership-application` — and nothing else. Not the name, not the email
address, not the phone number: those are in the submission itself, which lives
in the CMS and never goes to analytics. A request that was refused, or that
never reached the server, is not counted: what is counted is what was kept.

**The Pour Tracker was downloaded**, as `tool-download`, on the same footing —
the form and the file are one act (`src/forms/use-submission.ts`). That form is
not sent to the server yet; it counts itself the moment ticket 30 sends it.

## Where the team reads it

In the Vercel dashboard, under the project: **Analytics** for visits, pages,
referrers and the events above, and **Speed Insights** for real-world page
speed. To see the AI assistants, open the `ai-referral` event; the referrer
list beside it shows `chatgpt.com`, `perplexity.ai` and `claude.ai` by name as
well, for the visits that arrive with a referrer.

## Where it is switched on

The measurement scripts load on the **production deployment only**
(`isMeasured` in `src/lib/environment.ts`). Preview deployments are looked at
by us, and our own reading would be counted as visits and would drag the speed
figures towards our own machines. Locally, and in the test suite, nothing is
loaded and nothing is sent.

Turning the two features on in the Vercel dashboard is a one-time job for
whoever holds the account — `docs/deployment.md` has the steps. Until it is
done the site behaves exactly as it does now and simply reports nothing.
