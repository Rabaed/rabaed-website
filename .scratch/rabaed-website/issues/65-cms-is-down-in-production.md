# 65: Bug — the CMS is down in production, because jsdom loads at CMS boot

**What is wrong:** `rabaedapp.com/maktab` answers "This page couldn't load" and every address under `/api` returns 500. Ahmed cannot sign in, cannot edit anything, and cannot publish. No form on the site can be sent. The marketing pages still work, which is what makes this easy to miss — they are static HTML baked during the build, so they keep serving a copy of themselves long after the live half of the deployment has stopped answering.

**Blocked by:** nothing.

**Status:** ready-for-agent

- [ ] `/maktab` serves the sign-in page on a Vercel deployment, not a 500
- [ ] Every address under `/api` answers on a Vercel deployment: the CMS's own, and the forms'
- [ ] An SVG logo still uploads, and is still sanitised exactly as before — no case in `tests/unit/svg-sanitiser.spec.ts` changes its answer
- [ ] Loading the CMS does not load jsdom, held by a test that fails without the fix
- [ ] Proved on the pull request's own preview deployment before it is merged, because CI cannot see this failure

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
