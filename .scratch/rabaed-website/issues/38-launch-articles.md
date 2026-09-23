# 38: Launch articles

**What to build:** Four to six Arabic articles published at launch, each answering a question Rabaed's buyers actually ask, so the site has something to be found for on day one.

**Blocked by:** 23

**Status:** ready-for-human — the six articles are written and waiting in the CMS as drafts, covers and all; publishing them needs the founder's name on them, see below

- [x] Articles cover the question types the handoff identifies: definition, comparison, how-to, use case, objection and entity expansion
- [x] Comparison content included — Rabaed against WhatsApp, email and spreadsheets — as the biggest gap and the most-demanded in AI answers
- [x] Each article opens with a standalone answer of 30–60 words
- [ ] Drafted from Ahmed's knowledge and **approved by him before publishing**; the expertise is his
- [ ] Author attribution is a real person, not the company
- [x] No invented statistics or claims
- [ ] Each article appears in the sitemap and carries article structured data

## Comments

**Built on 21 September 2026.** Six articles, one for each kind of question HANDOFF §6.5 names, are in the CMS's **Blog** as unpublished drafts, imported by `20260921_101500_import_launch_articles` from the frozen `src/migrations/launch-articles/articles.ts`. The three boxes left unticked are the three that are the founder's, and all three close in the same sitting; `docs/deployment.md` has the five steps in plain language under «The blog, and the six articles waiting in it».

- **Drafts, because the ticket asks for approval before publishing.** The author is left empty, and Payload requires it to publish — so the CMS itself refuses to put any of this in front of a visitor until Ahmed has read it, corrected it and put his own name on it. That is what makes the approval a gate rather than a note: `tests/e2e/launch-articles.spec.ts` asserts that publishing one as imported is refused, and refused again with the company's name in the byline.
- **The byline is blank on purpose, and could not have been filled.** Nothing in the repo, the handoff or the legal source gives the founder's full name — only `ahmed.s@rabaedapp.com` — and a byline is exactly the thing not to guess at. An empty required field asks for it at the one moment somebody is looking. The other half of that box is now enforced rather than written down: `authorField` refuses «ربائد», «Rabaed» and «شركة ربائد البناء», read from `src/content/company.ts` so a second copy of the names cannot drift from it. No validator can prove a name is a person's, but the company is the one wrong answer worth refusing outright — and the rule is as right for a case study as for an article, so it sits on the field both share.
- **The sitemap and article-data box is conditional, not missing.** An article reaches `/blog`, its own address, `sitemap.xml`, `llms.txt` and its `BlogPosting` data the moment it is published, by ticket 23's and ticket 32's machinery and nothing of this ticket's. The suite proves it on one of the six: it fills in a name and a cover, publishes, checks all five, then puts the article back as it arrived.
- **Nothing here is new knowledge.** Every claim is one the site already makes — the pages as the CMS now holds them, the 31 FAQ answers, and `src/content/company.ts`. No figure, percentage, client count or testimonial appears, and the suite asserts that none of the four unsourced proof figures (ticket 47) is anywhere in the six. That is also what rules out the seventh question kind, «رقم» — how much does it cost, how many projects — which has no cleared answer; the cleared numbers that do exist (the sixty-day guarantee, activation in under a day, fifteen minutes a team) are stated inside the six instead.
- **The use-case article opens by saying it is a worked example, not a client.** Ticket 24 keeps real clients' stories behind their written agreement, and an article describing «a consulting office with five projects» is close enough to a case study to be mistaken for one.
- **Runs last in the suite** (playwright.config.ts). The publishing test puts an article on the blog index, in the sitemap and in `llms.txt`, which other suites read.
- **Nothing for the founder before merging** beyond the usual: a separate preview database needs `npm run cms:migrate` against it, as `docs/deployment.md` says, before this pull request's preview can build.

**Cover images: imported, on the founder's instruction (21 September 2026).** Each article opens on the Screen mock of the screen it is about — the stamped sheet on the definition, the correspondence screen on the comparison, the Kanban board on the how-to, the consultant's table on the use case, the contractor's submittal on the objections, the owner's dashboard on the entity. They are uploaded from `public/screen-mocks/ar/` by the same migration, and each one's `alt` is the description the product page already gives that picture (ticket 57) rather than a second one written here.

This was first left out, on the reasoning that a picture is an editorial choice and that uploading during the production build is a new way for a deploy to fail. The first half was the founder's call to make, and he made it. The second half was already answered before this ticket was written: **ticket 20's `20260920_204226_import_trust_strip` uploads the Trust strip's eight marks from `public/logos/` the same way**, so the pattern is proven rather than new, and this migration follows it closely.

**What the reviews changed (21 September 2026).** A standards pass and a spec pass ran over the branch. Both confirmed the six answers are 30–60 words, that all 31 section openers are too, and that none of ticket 47's figures appears. What they found worth fixing:

- **Two claims the site does not make.** «الشرط الوحيد أن تُشغَّل على مشروع حقيقي» asserted an exclusivity the site never states about the refund — the start page words it as an instruction, and the Terms add conditions — so the paragraph now points at the Terms. And «لا شرائح عرض» was framing of the demo nothing on the site carries; it now uses the partnership page's own «الاجتماع الأول يشمل عرض المنصة».
- **One form per fact.** Figures the site prints as digits were spelled out in the articles. «60 يوماً», «15 دقيقة», «30 دقيقة», «4 صور», «الدور 3» now match every other surface, because a fact written two ways is two facts to an answer engine (HANDOFF §6.7).
- **One article per question kind, held by the compiler.** The `kind` field was data nothing read. The articles are keyed by it now, so a kind answered twice or left out fails the typecheck.
- **The unsourced-figure check scanned only the body**, missing the title, summary and answer — the parts an engine lifts first. It reads all four now.

Left as they are, with reasons: the sitemap and article-data check publishes one of the six rather than all six, because the machinery is ticket 23's and ticket 32's and is already tested in general; and `launch-articles/body.ts` writes Lexical of its own rather than sharing `legal-import/approved-text.ts`'s, because that file is frozen data for a migration that has already run everywhere and the two need different nodes.

**One published as a trial, 23 September 2026.** The founder published «ما هي
منصة ربائد؟» on production to see a launch article live, with his own name as
its author for now — his words: a trial for the company's team to look over,
who will unpublish it and put up the real articles, and check these, once they
have. Checked from outside the same day: it is at `/blog/what-is-rabaed` with
its cover, and its article data names a person, `Mohamed Alhalees`. Its date is
still the one it was drafted on, 21 September. Its English follows from ticket
43 once that is deployed.

The three open boxes stay open: they are about the real articles, whose
approval and byline are Ahmed's, not about the trial.
