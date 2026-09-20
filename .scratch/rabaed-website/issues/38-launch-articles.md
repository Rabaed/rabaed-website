# 38: Launch articles

**What to build:** Four to six Arabic articles published at launch, each answering a question Rabaed's buyers actually ask, so the site has something to be found for on day one.

**Blocked by:** 23

**Status:** ready-for-human — the six articles are written and waiting in the CMS as drafts; publishing them needs the founder, see below

- [x] Articles cover the question types the handoff identifies: definition, comparison, how-to, use case, objection and entity expansion
- [x] Comparison content included — Rabaed against WhatsApp, email and spreadsheets — as the biggest gap and the most-demanded in AI answers
- [x] Each article opens with a standalone answer of 30–60 words
- [ ] Drafted from Ahmed's knowledge and **approved by him before publishing**; the expertise is his
- [ ] Author attribution is a real person, not the company
- [x] No invented statistics or claims
- [ ] Each article appears in the sitemap and carries article structured data

## Comments

**Built on 21 September 2026.** Six articles, one for each kind of question HANDOFF §6.5 names, are in the CMS's **Blog** as unpublished drafts, imported by `20260921_101500_import_launch_articles` from the frozen `src/migrations/launch-articles/articles.ts`. The three boxes left unticked are the three that are the founder's, and all three close in the same sitting; `docs/deployment.md` has the five steps in plain language under «The blog, and the six articles waiting in it».

- **Drafts, because the ticket asks for approval before publishing.** The author and the cover image are left empty, and Payload requires both to publish — so the CMS itself refuses to put any of this in front of a visitor until Ahmed has read it, corrected it and put his own name on it. That is what makes the approval a gate rather than a note: `tests/e2e/launch-articles.spec.ts` asserts that publishing one as imported is refused, and that it is refused again with a name but no cover.
- **The byline is blank on purpose, and could not have been filled.** Nothing in the repo, the handoff or the legal source gives the founder's full name — only `ahmed.s@rabaedapp.com` — and a byline is exactly the thing not to guess at. An empty required field asks for it at the one moment somebody is looking.
- **The sitemap and article-data box is conditional, not missing.** An article reaches `/blog`, its own address, `sitemap.xml`, `llms.txt` and its `BlogPosting` data the moment it is published, by ticket 23's and ticket 32's machinery and nothing of this ticket's. The suite proves it on one of the six: it fills in a name and a cover, publishes, checks all five, then puts the article back as it arrived.
- **Nothing here is new knowledge.** Every claim is one the site already makes — the pages as the CMS now holds them, the 31 FAQ answers, and `src/content/company.ts`. No figure, percentage, client count or testimonial appears, and the suite asserts that none of the four unsourced proof figures (ticket 47) is anywhere in the six. That is also what rules out the seventh question kind, «رقم» — how much does it cost, how many projects — which has no cleared answer; the cleared numbers that do exist (the sixty-day guarantee, activation in under a day, fifteen minutes a team) are stated inside the six instead.
- **The use-case article opens by saying it is a worked example, not a client.** Ticket 24 keeps real clients' stories behind their written agreement, and an article describing «a consulting office with five projects» is close enough to a case study to be mistaken for one.
- **Runs last in the suite** (playwright.config.ts). The publishing test puts an article on the blog index, in the sitemap and in `llms.txt`, which other suites read.
- **Nothing for the founder before merging** beyond the usual: a separate preview database needs `npm run cms:migrate` against it, as `docs/deployment.md` says, before this pull request's preview can build.

**What this ticket did not do: cover images.** Six were not imported, though `public/screen-mocks/ar/` holds eight pictures that would serve. Two reasons: a picture is an editorial choice, and a migration that uploads one has to write to Supabase Storage during the production build — a new way for a deploy to fail, for something no visitor sees until Ahmed publishes anyway. If picking six turns out to be the slow step at launch, importing them is a small change and the mocks are the obvious source.
