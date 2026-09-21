# 34: Analytics and speed monitoring

**What to build:** The team can see how many people visit, what they read, where they came from — and specifically when an AI assistant sent someone — without a cookie banner.

**Blocked by:** 03

**Status:** resolved — the site measures; switching the measurement on is ticket 39a part 4, as ticket 03 left its two account steps

- [x] Cookie-free analytics installed; no consent banner is required
- [ ] Page views, referrers and top pages visible to the team — **waiting on ticket 39a part 4**, the two toggles in the Vercel dashboard. The site carries both scripts and reports the moment they are on; nothing here can prove a dashboard nobody in this repository can reach.
- [x] Referrals from `chatgpt.com`, `perplexity.ai` and `claude.ai` are identifiable — the only direct evidence that the GEO work is paying off
- [ ] Real-user page-speed measurement reported alongside it — **waiting on ticket 39a part 4**, for the same reason, and in the same dashboard as the line above it
- [x] Form submissions and tool downloads are countable as events — the three forms that send count themselves now; the Pour Tracker's counts itself the moment ticket 30 sends its form through the same pipeline, with nothing to add here
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
- **The full suite:** 938 passed at eight workers, after the reviews below as well as before them.

### What is left for the founder, and what it cannot prove from here

Both features are turned on with two toggles in the Vercel dashboard — ticket 39a part 4, with the steps in [`docs/deployment.md`](../../../docs/deployment.md). Until then the site behaves exactly as it does now and reports nothing.

So this ticket proves the switched-off half and the events, and leaves the switched-on half to the deployment, which is the division ticket 03 made for indexing: the suite proves the blocked state; the first production visit proves the other one. Custom events need the paid Vercel team that part 1 already established the project needs.

Two of the boxes above are therefore left unticked rather than claimed, as ticket 03 left its own two: what they ask for is that the team can *see* the figures, and nobody can see anything until the toggles are on.

### What the reviews changed

- **The switched-on half cannot be told from a missing half.** The absence test passes whether the two scripts are correctly withheld or have been deleted from the page altogether; only a visit landing in the dashboard distinguishes them, which `docs/deployment.md` now says at the point where the founder would look. The events do guard the rest of it: `<AiReferral>` hangs off the same component, so removing it turns four tests red.
- **A mark on an address is not proof.** `utm_source` is set by whoever links to the site, so the AI referral count is a signal, not an audit. Said in the module, since the number is going to be read as evidence.
- **Only ChatGPT was caught by its mark.** The matcher tested a `utm_source` against the assistants' *domains* alone, so an assistant marking a link with its bare name — `utm_source=perplexity` — was missed, and the suite agreed because each assistant was tested through the one signal the code happened to handle. It now matches the name as well as the domain, and the suite sends a bare mark too.
- **The demo request form was described twice.** Its wording and the filling-in of it are now in `tests/e2e/forms.ts`, which `form-submission.spec.ts` and this ticket's suite both read; before, the copy here quietly left two fields empty under the same name.
- **`docs/analytics.md` claimed a count that cannot happen.** It listed the Pour Tracker download among what is collected. It is a file the Privacy Policy will be written from, so it now says plainly that nothing is counted there until ticket 30 builds that form.
- **Vercel's word is Vercel's.** The no-cookie, no-IP, discarded-after-a-day account comes from Vercel's own privacy pages, which are now linked and dated in that file, because it is heading for a legal document as if it were ours.
- **A Submission, never a Request** (`CONTEXT.md`): the tests and the doc were saying "request" for what the server stores.
- **The suite walks every route**, as `routes.ts` asks, rather than the two pages the first version named.
- **A carriage return in `docs/deployment.md`**, found by wrecking it: an earlier edit of that file rewrote it in text mode and turned a stray `\r` inside `Get-Content ~\rabaed-production.env` into a line break, splitting the command in two. The file was rebuilt from `main` byte for byte and the addition re-applied — and the command itself, which has been unrunnable since it was written, now says `~/rabaed-production.env`, as the bash line above it does — a forward slash, which PowerShell takes and no editor can eat.
