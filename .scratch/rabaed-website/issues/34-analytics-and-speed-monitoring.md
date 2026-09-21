# 34: Analytics and speed monitoring

**What to build:** The team can see how many people visit, what they read, where they came from — and specifically when an AI assistant sent someone — without a cookie banner.

**Blocked by:** 03

**Status:** resolved

- [x] Cookie-free analytics installed; no consent banner is required
- [x] Page views, referrers and top pages visible to the team
- [x] Referrals from `chatgpt.com`, `perplexity.ai` and `claude.ai` are identifiable — the only direct evidence that the GEO work is paying off
- [x] Real-user page-speed measurement reported alongside it
- [x] Form submissions and tool downloads are countable as events
- [x] What analytics collects is written down in plain language for ticket 37, because the Privacy Policy must describe it

## Comments

**Built on 21 September 2026.**

**Vercel's Web Analytics and Speed Insights**, because the site is already on Vercel (ADR-0004) and these two report in one place, which is what the spec asks for — "real-user page-speed measurement reported in the same place". Nothing about a visitor reaches a third company, the scripts are served from the site's own origin rather than someone else's, and both are MIT-licensed packages in our own `package.json` rather than a snippet pasted from a dashboard.

**No cookie banner, because there is nothing to consent to.** Neither writes a cookie, and neither writes anything else to the visitor's device: Vercel counts a visitor as a hash it makes of the request itself and throws that hash away after 24 hours, so no one — Vercel included — can join yesterday's visit to today's, or this site's visit to any other site's. That is also why the site's own event for AI referrals stores nothing to fire once per visit: it uses the fact that a page load happens once instead.

**What it records is written out in [`docs/analytics.md`](../../../docs/analytics.md)**, in the words the Privacy Policy can use — the table of what a page view carries, the three events the site raises, what is deliberately not sent, and where the team reads it. Ticket 37 folds it into the inventory; the file says of itself that the two change together.

### The three events, and where they are raised

- **`ai-referral`**, when a visit arrives from ChatGPT, Perplexity or Claude, saying which. Vercel already records a referrer and the address's `utm` tags, so the three would show in its referrer list — but an assistant often passes no referrer at all and instead marks the address it hands over (`?utm_source=chatgpt.com` is ChatGPT's). Reading both signals counts a visit that either alone would miss, and turns "did the GEO work pay off" into one number rather than a hunt through a list. It is 30 lines and pure (`src/lib/ai-referrals.ts`), fired from a component that renders nothing.
- **The form's own id**, once the server has stored a submission — `demo-request`, `referral-signup`, `partnership-application`. Raised in `useSubmission`, which is the one place every form is sent from, so no form had to be edited and none can be forgotten. What is counted is what the server kept, not a press of a button: a refused submission raises nothing, and the suite holds it to that.
- **`tool-download`** comes free: the Pour Tracker's form counts itself the moment ticket 30 sends it through the same pipeline. Nothing here has to change then, which is why that ticket's "Downloads are countable" box is already wired rather than waiting.

Nothing about who submitted goes with an event. The name, email and phone number are in the Submission, which is the CMS's.

### Production only, and why the suite can still see it

`isMeasured()` in `src/lib/environment.ts` loads the two scripts on the production deployment alone. A preview is looked at by us — the founder approving a pull request, a lawyer reading a draft — and our own visits counted among the site's are worse than not counting them, because the number they spoil is the one the team is trying to read; a preview's page speed is likewise our own machine on our own connection.

It has a second job. The scripts are fetched from the deployment's own origin, so a local build that loaded them would ask for something that is not there. With the gate forced open, `tests/e2e/analytics.spec.ts` fails as intended **and so does `health.spec.ts`, on eleven of the site’s pages** in that run, each with a 404 for `/_vercel/insights/script.js`. That is what the gate is holding back.

The events are deliberately *not* gated: they are raised everywhere and go nowhere when no script is listening, because `track()` hands them to `window.va`, which only the script defines. So the suite can stand where the script would and read what the site raises — which is our behaviour, not Vercel's, and the only part of this that is ours to test.

### Verified

All on `TEST_PORT=3134`.

- **Each guard was checked by breaking what it watches**, as ticket 03 did. With `aiAssistantFrom` returning `null` and the count in `useSubmission` deleted, exactly four tests failed — the three assistants and the stored submission — and the three that assert nothing is raised or loaded stayed green. With `isMeasured()` forced to `true`, the absence test failed and so did eleven pages' health tests.
- **A first attempt at those breaks proved nothing**, and is worth recording: they were put behind `process.env.BREAK_…`, and Next inlines only `NEXT_PUBLIC_` variables into the browser bundle, so in the browser the condition was `undefined` and the code ran unchanged. Everything passed. A break in client code has to be a real edit.
- **The full suite:** 937 passed at eight workers.

### What is left for the founder, and what it cannot prove from here

Both features are turned on with two toggles in the Vercel dashboard — ticket 39a part 4, with the steps in [`docs/deployment.md`](../../../docs/deployment.md). Until then the site behaves exactly as it does now and reports nothing.

So this ticket proves the switched-off half and the events, and leaves the switched-on half to the deployment, which is the division ticket 03 made for indexing: the suite proves the blocked state; the first production visit proves the other one. Custom events need the paid Vercel team that part 1 already established the project needs.
