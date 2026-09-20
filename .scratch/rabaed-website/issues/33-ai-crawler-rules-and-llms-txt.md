# 33: AI crawler rules and llms.txt

**What to build:** The GEO layer: telling AI systems which crawlers may read the site, and giving them a clean summary of what Rabaed is and where its pages are.

**Blocked by:** 31

**Status:** resolved

- [x] `robots.txt` distinguishes retrieval and citation crawlers from training crawlers, following the handoff's draft
- [x] Retrieval and citation crawlers are allowed: they are how Rabaed gets quoted in AI answers
- [x] Training crawler policy is a single switch the founders can flip, defaulting to allowed, with the trade-off written down
- [x] `llms.txt` served, based on the handoff's draft, listing the pages and describing the product in Rabaed's own words
- [x] `llms.txt` is regenerated from CMS content rather than hand-maintained, so it cannot go stale
- [x] Both files are reachable and correctly typed

**Note from ticket 05:** the Screen mock studio must be excluded from the sitemap. It is already `noindex` unconditionally, but it should not be listed. `STUDIO_PREFIX` in `src/screen-mocks/registry.ts` is the prefix to filter on, and ticket 05's checklist leaves that box open until this ticket ticks it.

**From ticket 31:** done there — the sitemap never lists the studio, and `search-foundations.spec.ts` checks it. Ticket 31's `src/app/robots.ts` is a single rule for every crawler plus the sitemap line; this ticket replaces the rule with the retrieval/training split. Keep `search-foundations.spec.ts`'s robots test green: nothing may be disallowed that must see a page's `noindex`, and do not name the CMS admin path in the file, which would publish it.

## Comments

### What was built

**`robots.txt` (`src/app/robots.ts`).** Three groups and the sitemap line, in the handoff's own shape: everything is allowed; the eight retrieval and citation crawlers are allowed again by name, so the promise is written down rather than inherited from the `*` rule; and the four training crawlers are allowed or refused by the switch. `Google-Extended` and `Applebot-Extended` are deliberately absent — they opt out of training alone and do nothing for AI Overviews, and the file must never name `Googlebot` in a refusal.

**The switch.** A CMS global of its own, «زواحف الذكاء الاصطناعي» (`src/cms/globals/ai-crawlers.ts`), holding one checkbox that defaults to allowed. The trade-off is written in Arabic in the field's own help text, where Ahmed reads it at the moment he decides: allowing training crawlers is how a model knows Rabaed from the inside in a year or two, with no citation, visit or link; refusing them costs nothing today, because the retrieval crawlers the switch cannot touch are what decides whether Rabaed is quoted now.

**`llms.txt` (`src/app/llms.txt/route.ts`).** The handoff's draft, generated. The heading and summary are the company as `CONTEXT.md` writes it and the product line in the co-founder's own words; the pages are listed with the descriptions the pages themselves declare; published articles and case studies are listed with their CMS summaries; the three legal documents with theirs. `force-static`, so it is prerendered like the sitemap and marked stale by the same hook when anything is published.

**Ticket 05's sitemap box** was already ticked by ticket 31, which built the sitemap from a written-out list of pages rather than by walking the routes — so the note above, and its suggestion of filtering on `STUDIO_PREFIX`, are answered by a better mechanism than the one they name: nothing that is not a page of the site can reach the list in the first place, so there is nothing to filter out. `llms.txt` is built the same way, and `ai-crawlers.spec.ts` holds the studio out of it as `search-foundations.spec.ts` does for the sitemap.

### Decisions

**The switch is a global of its own, not a field on the site settings.** It was a field on `site-settings` first, which is where a one-off site-wide setting belongs. That broke every fresh database: `20260913_191346_publish_contact_points` publishes the contact points through Payload's local API, and the local API selects *every* column the current schema declares — including one added by a migration that has not run yet. The error is `column "version_allow_training_crawlers" does not exist`, raised by a migration written a week before the column existed.

A global of its own has no earlier migration touching it, so the problem does not arise, and it reads better in the admin: a founder looking for the AI crawler decision finds an entry named after it rather than a checkbox under a WhatsApp number.

**It keeps no drafts.** Every other global does, because a draft is words a page will show, previewed before visitors see them. This is a policy with no page to preview, so ticking the box and saving is the whole act — which is what "a single switch" has to mean.

**`llms.txt` is generated, and half of it is CMS-sourced today.** Worth stating exactly, because the checklist line reads "regenerated from CMS content rather than hand-maintained, so it cannot go stale" and those are two requirements, met to different degrees.

*Cannot go stale* is fully met, and is the one that matters. Nothing in the file is a second copy of the site's words: a file that restates what a page says drifts the first time somebody edits the page and not the file. `ai-crawlers.spec.ts` holds it to that directly — it fetches every address the file lists and asserts the description beside it is that page's own `<meta name="description">`, so a line written out by hand fails.

*From CMS content* is met for everything the CMS holds today: the articles, the case studies and the three legal documents, each with the summary an Editor wrote. The nine page descriptions and the summary line at the top are **not** in the CMS yet — they are `src/content/pages/*.ts` and `src/content/company.ts`, hand-maintained in code behind a deploy. What this ticket did was wire the file to the single place those descriptions already live, so that **ticket 26 moves them into the CMS and this file follows them there untouched**, with the test above proving it never lagged in between. Ticket 26 carries the note.

### What was learned

**A data migration that uses Payload's local API is pinned to the schema of the day it was written.** Any later migration that adds a column to a table an earlier data migration writes through `payload.updateGlobal` or `payload.create` breaks that migration on a database built from scratch — production never notices, because it already ran it. This ticket went around the problem; **ticket 26 cannot**, because it adds fields to the page globals that `20260915_*_import_*` seed. A comment on ticket 26 records it.

**The suite needed a stage of its own, and Playwright has room for exactly one trailing stage.** `ai-crawlers.spec.ts` reads a file that lists every page with its description, so a case study published beside it adds a page and a Referral Program value published beside it changes one — and it publishes in its turn, a robots rule every other robots test would see. It went in as a second teardown project chained after `runs-last`, which silently ran **nothing**: a teardown project waits for everything that depends on the project it belongs to, so two chained teardowns each wait for the other. Playwright reports that as tests that "did not run" and no error — the whole `runs-last` stage stopped running too, and a passing run still said `15 did not run`.

It is a `reads-the-whole-site` project depending on `chromium` instead, which runs between the main project and `runs-last`. The price is that it is skipped when the main project fails, and that running its file alone runs the main project first unless `--no-deps` is passed.

### From the code review

Two findings worth recording, both acted on.

**`search-foundations.spec.ts`'s robots test was a landmine, not a passing test.** Ticket 31's note said to keep it green, and it was — but only by accident of ordering. It asserted that no line anywhere in the file reads `Disallow: /`, and with the training crawlers refused, one legitimately does. It stayed green because `ai-crawlers.spec.ts` restores the switch in a `finally` and runs in a later stage; a crash between the two, or a production deployment where Ahmed has genuinely refused them, would have turned it red for the wrong reason — and the reason would have looked like a real regression. It now asserts what it always meant: the rule every crawler *not named in the file* follows allows the site whole. What the named groups say is this ticket's suite.

**`robots.txt` now needs the database to build, where it was a pure function before.** Left as it is, and said so in `src/cms/crawler-policy.ts`: the permissive default covers a row nobody has written, never a database nobody can reach. A build without its database already fails on every page that reads the CMS, and swallowing the error here would publish a permission the founders may have refused, into a file crawlers act on and nobody rereads.

Also folded in: the write-up moved under the one `## Comments` heading the tracker's conventions ask for; `refreshSiteWhenSaved` named beside `refreshSiteWhenPublished` rather than inlined, as every other global does it; and `absoluteUrl` in `src/lib/environment.ts`, because "the home page is the bare origin" was written out three times — in the sitemap, in the structured data, and here.

Run on `TEST_PORT=3133`.

### The preview deployment's red check

PR #42's Vercel check failed, and the cause is this ticket's first build-time CMS read that no earlier deployment has a table for.

Reproduced locally by dropping `ai_crawlers` and its `payload_migrations` row and building against that database, which is what a preview build sees: Postgres `42P01` at `src/cms/crawler-policy.ts`, and `Export encountered an error on /robots.txt/route: /robots.txt, exiting the build`.

It is the documented situation rather than a defect — preview builds never migrate, on purpose, so that trying out a pull request cannot alter the tables the live site reads. The preview database needs `npm run cms:migrate` run against it and the deployment redeploying; no commit changes it. `docs/deployment.md` now says that the red check is expected and what clears it, because a red cross that means "nobody has migrated the preview yet" reads exactly like a red cross that means "this change is broken".

`robots.txt` was deliberately not made to tolerate the missing table. The permissive default covers a row nobody has written; a table nobody has created means the deployment was never migrated, and on production that cannot coexist with a build at all, since `scripts/migrate-production.mjs` runs first. Special-casing it here would only move the same failure onto whichever page a future migration touches.
