# 65: Bug — the CMS is down in production, because jsdom loads at CMS boot

**What is wrong:** `rabaedapp.com/maktab` answers "This page couldn't load" and every address under `/api` returns 500. Ahmed cannot sign in, cannot edit anything, and cannot publish. No form on the site can be sent. The marketing pages still work, which is what makes this easy to miss — they are static HTML baked during the build, so they keep serving a copy of themselves long after the live half of the deployment has stopped answering.

**Blocked by:** nothing.

**Status:** resolved — the last box is left unticked, as tickets 03 and 34 left their own; see the Comments

- [x] `/maktab` serves the sign-in page on a Vercel deployment, not a 500
- [x] Every address under `/api` answers on a Vercel deployment: the CMS's own, and the forms'
- [x] An SVG logo still uploads, and is still sanitised exactly as before — no case in `tests/unit/svg-sanitiser.spec.ts` changes its answer
- [x] Loading the CMS does not load jsdom, held by a test that fails without the fix
- [ ] Proved on the pull request's own preview deployment before it is merged, because CI cannot see this failure — **left unticked: proved on production after the merge instead, see the Comments**

## Problem statement

Ahmed opens the admin to publish an article and gets a black page with a warning triangle. Nothing he can do from a browser changes it. From the founder's side the site looks fine — the home page, the blog, the product page all load — so the outage reads as "the admin is broken" rather than "the CMS is down", and the pages that still work are frozen: nothing published since the last build can reach them either, because the only thing that could rebuild them is the half that is down.

The site has been in this state on `rabaed-website.vercel.app` since at least 21 September 2026.

## What is happening

`src/cms/svg-sanitiser.ts` builds a DOM at module scope — `new JSDOM('')` — so that DOMPurify has somewhere to work when an Editor uploads an SVG logo (ticket 20, ADR-0010). That module is imported by the Media collection, which is part of the Payload config, which is imported by the admin, by the CMS's REST API, and by the form submission pipeline.

So **every request to every CMS address loads a whole HTML engine before it does anything else** — to serve a need that only arises when somebody uploads a drawing.

On a Vercel deployment that load throws:

```
Failed to load external module jsdom-4cccfac9827ebcfe:
Error [ERR_REQUIRE_ESM]: require() of ES Module
  /var/task/node_modules/@exodus/bytes/encoding-lite.js
  from /var/task/node_modules/html-encoding-sniffer/lib/html-encoding-sniffer.js
  not supported.
    at Context.externalRequire [as x] ([turbopack]_runtime.js:704:15)
    at module evaluation ([root-of-the-server]__1us7343._.js:1:926)
```

The chain is a dependency's, not ours. `jsdom@27` reaches `@exodus/bytes`, which is an ES module, through `html-encoding-sniffer@6`, which is CommonJS and `require`s it:

| | encoding dependency | module type |
| --- | --- | --- |
| `jsdom@27.4.0` — what is installed | `html-encoding-sniffer@6` → `@exodus/bytes` | **ES module** |
| `jsdom@26.1.0` | `html-encoding-sniffer@4` → `whatwg-encoding@3` | CommonJS |

Nothing else in the lockfile reaches `@exodus/bytes`; it arrives through jsdom alone.

`require()` of an ES module is a thing Node allows from 22.12 onwards, and both this machine and CI run Node 24 (`.nvmrc`), where it works — verified directly against that exact file. The deployment's Node version is reported as 24 as well, and yet the deployed function raises the error Node used to raise before 22.12. **Why the deployed runtime refuses a call that Node 24 accepts here is not explained**, and this ticket deliberately does not try to explain it: the fix below removes the call, so the answer stops mattering.

What makes the deployment different in kind is visible, though, and is worth writing down: `jsdom` is on Next's **default** `serverExternalPackages` list (`node_modules/next/dist/lib/server-external-packages.jsonc`). Turbopack therefore does not bundle it. It is left to be loaded at runtime by a native `require()` — the `externalRequire` in the trace — so the ESM/CommonJS boundary inside jsdom is never resolved at build time. It is crossed fresh, in the deployment, on every cold start.

## Solution

Two changes, each worth making without the other.

**Stop loading jsdom to boot the CMS.** The sanitiser builds its window the first time it sanitises something, not when its module is evaluated. The admin, the CMS API and the forms then have no dependency on jsdom at all. A future break in it costs SVG uploads, not the whole CMS.

**Move to `jsdom@^26.1.0`.** On jsdom 26 the `require()` of an ES module does not exist anywhere in the tree, so it cannot fail — on any Node version, under any bundler, in any runtime. This is what fixes SVG uploads, which the first change alone would leave broken.

## User stories

1. As Ahmed, I want to sign in at `/maktab` on the live site, so that I can edit and publish the site at all.
2. As Ahmed, I want to publish an article and see it on the blog, so that the site can say something new.
3. As Ahmed, I want to upload a client's logo as an SVG, so that I do not have to go back to a designer for a raster copy (ticket 20).
4. As Ahmed, I want an SVG I upload to be stripped of everything that could run, so that a logo cannot carry an attack onto the site's own domain (ADR-0010).
5. As a visitor, I want to send the demo request form, so that I can ask for a demonstration.
6. As a visitor, I want to apply for the partnership programme and sign up for referrals, so that those pages are more than a description.
7. As a visitor, I want to download the Pour Tracker, so that the free tool the site offers is actually obtainable.
8. As a visitor, I want the pages I read to reflect what has been published, so that I am not shown a copy frozen at the last build.
9. As the founder, I want the marketing pages to keep working while the CMS is broken, so that an outage of the admin does not take the site off the internet — this already holds, and must keep holding.
10. As the founder, I want to know that a deployment's admin works before it is merged, so that production is never the place a failure is discovered.
11. As an agent taking a later ticket, I want a test that fails when something heavy is loaded to boot the CMS, so that this outage cannot return quietly.
12. As an agent, I want the reason jsdom is pinned below its latest version written down next to the pin, so that a routine dependency bump does not undo this fix.
13. As the founder, I want the fix to be independent of which Node version Vercel runs, so that a platform default changing underneath us cannot bring the CMS down again.

## Implementation decisions

- **The SVG sanitiser owns the lateness.** Its window and its DOMPurify instance are built on first use and kept for the life of the process, which is what the module already does — only later. The module's exported interface does not change: callers still call one function with the file's bytes and the wording, and get back what survived. Nothing outside it learns that the DOM arrives late.
- **jsdom stays the DOM.** happy-dom was tried and rejected once already (it parses `<svg>` into the HTML namespace, where DOMPurify discards the drawing's root and its `viewBox` with it); that finding stands and is not revisited here. Only the version moves.
- **The pin is `^26.1.0`, with the reason beside it.** A caret, so patches still arrive; a comment in the ticket and in the sanitiser's own preamble saying what going back to 27 would reintroduce.
- **`@types/jsdom` moves with it** if the installed major no longer matches.
- **Nothing is added to `serverExternalPackages`.** The default list is Next's, it changes between versions, and a config that restates it would need editing on every upgrade for no gain. The fix works whether jsdom is bundled or external.
- **No change to what the sanitiser allows.** The allowed list, the refusal of stylesheets, the "an empty picture is a refusal" rule — all unchanged. This ticket moves when a dependency loads and which version it is, and nothing else.

## Testing decisions

A good test here states something a person outside the code would notice: that the admin answers, that a logo carrying script comes back without it, that the CMS starts without dragging an HTML engine in behind it. None of them should know how the sanitiser holds its window.

- **The new seam — one test, in `tests/unit/`.** Loading the sanitiser's module must not load jsdom; calling it must. Run in a process of its own, because what is being asked is what a fresh process loaded, and a Playwright worker that has already run another file cannot answer that honestly. This is the test that fails without the fix, and the one that would have caught the outage.
- **`tests/unit/svg-sanitiser.spec.ts` is the guard on the version change.** It states case by case what must not survive sanitising; every case must give the same answer on jsdom 26 as on 27. It is prior art for the new test and sits beside it.
- **`tests/e2e/trust-strip.spec.ts`** carries the same ground end to end: a logo uploaded through the admin and drawn on the page.
- **`tests/e2e/cms.spec.ts`** proves the admin signs in and publishes against a real production build. It passes today, before the fix — which is the point below.
- **CI cannot see this failure, and the ticket is not closed on CI alone.** The suite builds the site and drives `/maktab` on Node 24, where the underlying `require()` succeeds. Proof is `/maktab` on the pull request's own Vercel preview deployment answering with the sign-in page. That check is part of the work, not a courtesy afterwards.
- **Tested on `TEST_PORT=3165`**, as `docs/agents/parallel-sessions.md` requires.

## Out of scope

- **Why the deployed runtime refuses `require()` of an ES module while Node 24 accepts it here.** Worth knowing, and worth reporting upstream to Next or Vercel if it can be pinned down, but the fix does not wait on it and does not depend on the answer.
- **Moving back to `jsdom@27`** once the upstream `html-encoding-sniffer` chain is CommonJS-safe again, or once the deployed runtime accepts the call. A later ticket, once there is something to point at.
- **Auditing every other module loaded to boot the CMS.** The new test asks about jsdom, not about weight in general. A broader look at what the Payload config drags in belongs with `/improve-codebase-architecture`.
- **Anything about what the sanitiser permits.** ADR-0010 stands untouched.
- **The Vercel Node version setting.** It was checked and reads 24.x. Changing it is not part of this fix.

## Further notes

The shape of this outage is worth remembering more than its cause. Every public page answered `200`, so every check that looks at the site from outside said the site was fine. They answered from `X-Nextjs-Prerender: 1` and `X-Vercel-Cache: HIT` — HTML written during the build, still being served hours later because the thing that would rebuild it was the thing that was down. The first request that actually ran code was the one that told the truth.

## Comments

### Resolved (22 September 2026)

The fix merged as pull request #61 on 21 September 2026 — `93a69fe`, merged at `590acfe`. The Media collection fetches the SVG sanitiser on the upload path instead of importing it at the top, so the Payload config no longer loads jsdom to boot; and jsdom goes back to `^26.1.0`, where the `require()` of an ES module that threw on the deployment does not exist in the tree at all.

**The first two boxes, checked against production on 22 September 2026.** `rabaed-website.vercel.app/maktab` redirects to `/maktab/login` and serves the real sign-in form — `Login — ربائد`, an email field and a password field — rather than "This page couldn't load". Under `/api`, every address answers with code that ran:

| Address | Answer |
| --- | --- |
| `/api/users/me` | `200`, `{"user":null,"message":"Account"}` |
| `/api/access` | `200`, the collections' field permissions |
| `/api/preview` | `401`, "Sign in to the admin to preview." |
| `/api/forms/demo-request` | `405` — the forms route is POST-only, and refused the GET itself |

Not one `500`. The 401 and the 405 matter as much as the 200s: each is this site's own code deciding something, which is exactly what could not happen while the config would not evaluate.

**The third and fourth boxes, on `main`'s own lockfile.** `npm ci` (jsdom 26.1.0 installed), then `TEST_PORT=3165 npm test -- tests/unit/cms-boots-without-jsdom.spec.ts tests/unit/svg-sanitiser.spec.ts --no-deps` — 16 passed. The full suite on the same port: 1078 passed. Every case in `svg-sanitiser.spec.ts` gives the same answer on jsdom 26 as it did on 27, and `cms-boots-without-jsdom.spec.ts` holds both halves of the question: starting the CMS loads no jsdom, and loading the sanitiser does.

`--no-deps` is not optional there. Without it the `runs-last` teardown project runs after any filtered selection (`playwright.config.ts` says so), and `ai-crawlers.spec.ts` then reads a `/case-studies` that no suite in the selection published — a `404` that is the filter's doing and not a failure.

**The fifth box is left unticked rather than claimed**, as ticket 34 left two of its own and ticket 03 left two before that. It asked for proof on the pull request's own preview deployment *before* the merge. What exists is proof on production *after* it — the table above. The preview built and reported Ready (`rabaed-website-git-ticket-65-rabaed.vercel.app`), and the pull request asked the reviewer in as many words to load `/maktab` on it, but nothing on the pull request records that anyone did.

The outage is real and is over, which is why this ticket is `resolved` with a box still open. What is not evidenced is the *check* — the one thing here that was supposed to catch a deployment-only failure before a merge rather than after one. A tick with a footnote would bury that; an open box is what a later reader's eye lands on, which is the point of leaving it.

### Why the fifth box went unrun, which the ticket did not say

It asked for the check as though it were an ordinary review step. It is not: **a preview deployment is SSO-gated, so no agent can run it.** Loading this cleanup's own preview — `rabaed-website-git-resolve-ticket-65-rabaed.vercel.app/maktab`, on pull request #62, 22 September 2026 — redirects to `vercel.com` and a Vercel login. Production is open and answers; every preview is behind the team's sign-in.

So the box asked the one party who could not do it. That is worth more than the box: a criterion only the founder can satisfy has to say so, next to itself, or it waits for a reviewer who was never able to be one.

It now does. The check is **part 5 of `39a-founder-account-actions.md`** — the first part of that ticket that never completes, because it runs on a pull request rather than once — and `docs/deployment.md` carries it at step 4 of *How a change reaches the internet*, which is where the founder reads before approving a merge.

It is also the shape of every deployment-only failure this ticket describes. CI builds on Node 24 and cannot see the fault; an agent can reach production but only after a merge; the one moment that would catch it — a preview, before the merge — is reachable by the founder alone. Any future ticket whose proof lives on a preview inherits this, jsdom or not.

### The claim on this ticket outlived the work

`ticket-65` was released when it merged, but its `Status:` line was not moved off `ready-for-agent` until now — so for a day `main` described finished, deployed work as available to take. The `Status:` line and the branch are two halves of one signal and they drifted apart.

Seven other branches had drifted the other way: `ticket-20`, `ticket-26`, `ticket-30`, `ticket-58`, `ticket-59`, `ticket-62` and `ticket-62-evidence` were all still on the remote with their tickets `resolved` and their pull requests merged, so `git ls-remote --heads origin "ticket-*"` told a fresh session that seven finished tickets were taken. They are deleted in this change.

The cause was in the documentation, and it had two halves. Both `docs/agents/issue-tracker.md` and `docs/agents/parallel-sessions.md` said to release a claim by merging with `--delete-branch` — the one flag that cannot be used here, because it deletes the local branch too and takes another worktree's checkout with it when one is on that branch. Nothing replaced it, so nothing released the claims. And neither doc ever said who moves a ticket's `Status:` line, or when.

Both are fixed in `issue-tracker.md`, which ticket 48's review already made the single home of the claim rule — *"There is one rule now, in `issue-tracker.md`"* — so `parallel-sessions.md` defers to it here as it already does for claiming, rather than keeping a second copy to drift. Releasing is `git push origin --delete ticket-NN`. Resolving happens **on the ticket's own branch, before the pull request opens**, so the `Status:` line merges with the work. That is the half that failed here: done afterwards it needs a branch and a pull request of its own, which is what this one is.

One more thing that helped `ls-remote` lie, and is fixed with them: `ticket-62-evidence` was never a claim, but it matched `ticket-*` and so read as one. The claim rule said the branch is "named exactly `ticket-NN`" without saying what that forbids; it now says a side branch needs a name outside the glob.
