# 47: The proof deck's four figures have no source

**What is wrong:** The home page's «ماذا يتغيّر بعد التشغيل؟» section is a deck of six cards, and four of them state figures:

| Card | Figure | What it says it is measured against |
| --- | --- | --- |
| دورة الاعتماد | **3.6×** faster approvals and handovers | the paper cycle on the same project |
| استرجاع الوثائق | **7×** faster document retrieval | time to reach the latest approved version |
| الوقت الإداري | **31%** saved on administrative work | the project team's weekly hours |
| حوكمة الوثائق | **22%** better document governance | completeness of each transaction's trail |

Nothing in the spec, the handoff, the ADRs or the issue tracker says where these numbers come from, and the spec rules them out until someone can say — twice:

> No invented figures, percentages or testimonials. Statistics appear only when supplied and attributable. (Spec: SEO and GEO)

> Invented statistics, testimonials, ratings or client counts. (Spec: Out of Scope)

The founders' list of cleared commitments covers the Trust strip logos, the 60-day guarantee and the Referral Program amounts. It does not cover these.

**Reported by:** ticket 07, on building the deck. The founder was asked and expressed no preference.

**Blocked by:** nothing. Needs the founders.

**Blocks:** 39 (go live) — as a decision, not as a safety net. See below.

**Status:** resolved — the source is written and published by migration, on the founder's instruction of 23 September 2026; the four cards reach production with the deploy that follows the merge

## They cannot reach a visitor in the meantime

Ticket 07 built the deck with all six cards, verbatim, because that is the only way to test it and hold it to the Reference site. Each figure carries a source — since ticket 58, the **Where the figure comes from** field of each before-and-after figure in the CMS's Home page entry — and the four above have none.

**A card with no source is left off every public deployment** — preview, development and production, indexable or not. Local builds and the test suite still draw all six. The check is `isPubliclyDeployed()` in `src/lib/environment.ts`, which is true for any Vercel deployment.

It is deliberately wider than the launch switch. `noindex` asks search engines not to list a page; it does not stop anyone with a preview address from reading it, nor an AI assistant fetching a page a user pastes in. Ticket 39a puts the site on public Vercel addresses before ticket 39 launches it, so a guard tied to launch would have been too late.

Checked by hand in ticket 07: a build made as a Vercel preview makes it served none of the four figures or their claims, still served both commitment cards, and its figures deck counted "/ 2". To repeat the check:

```bash
VERCEL_ENV=preview npx next build
```

then serve it and look at the home page. The automated suite builds as a local build on purpose, so that it tests the whole deck; it does not exercise this guard.

## Why it still blocks launch

With the guard in place, launching today would publish a two-card deck: the two service commitments, «أقل من يوم» and «15 دقيقة». That is safe, but it is probably not the section the founders want — a short deck, and the section's heading promises figures. So ticket 39 waits for a decision rather than launching into it by default.

## Why it matters more than a typo would

These are the claims an AI assistant is most likely to lift and repeat — "Rabaed makes approvals 3.6× faster" — because they are specific, quotable and sit under a heading that asks a question. Being cited is the point of the GEO work (tickets 31-35). A number that is cited and cannot be backed is worse than no number, and it cannot be recalled once it is in somebody's answer.

## What would close it

For each of the four figures, one of:

1. **A source, recorded.** Which project, measured how, by whom, over what period — written into the figure's `source`, and fit to be shown or linked. Setting it is what puts the card on the site; nothing else needs to change. If the figure comes from a single project, the card should say so.
2. **A replacement claim that is attributable.** Probably qualitative, or a figure the founders can stand behind.
3. **Removal.** The deck works with any number of cards. With only the two commitments left, it may read better to fold them into the copy beside the heading instead.

## Also left out, for the same reason

The Reference site's section carries a testimonial slot under the lead: a play button that plays nothing, beside a line reading, in effect, "placeholder — waiting for the recorded testimonial", attributed to a project manager at a Riyadh developer. Ticket 07 did not carry it over. It comes back when a real testimonial has been recorded, with the person's permission to use it.

## Done when

- [x] Every figure on the proof deck has a recorded `source`, has been replaced by something attributable, or has been removed
- [x] The decision is written into each figure's **Where the figure comes from** field in the CMS's Home page entry (ticket 58), so the next person to edit a card sees it
- [x] `tests/e2e/home-card-decks.spec.ts` and `tests/e2e/home-decks-match-reference.spec.ts` updated if the deck's cards change

## Comments

**Decided by the founder, 23 September 2026: the first way out, a source, for all four figures.**

All four come from one case study with one customer, a real estate developer whose logo is on the Trust strip. The customer asked not to be named, so no card, no source and no case study may name them. The comparison is between two of that customer's projects over about nine months: one run on Rabaed, and one the customer still runs by hand, with its logs kept in Excel. Rabaed and the customer measured it together. The customer has already consented to the figures being published. A written case study is being prepared for the site's case studies (ticket 24), and is waiting on the customer's review and consent before it can be published.

**What is left is the founder's, in the CMS**, because it is the CMS entry that decides: ticket 58 made the source field the only thing that puts a figure on the site. No code changes.

1. **Write the source into each of the four figures**, in the Home page entry's figures section, on the live CMS and on the preview's, which is a separate database. The same text serves all four, since they share a source:

   > دراسة حالة مع عميل من المطوّرين العقاريين (أحد شعارات شريط الثقة، ولا يُذكر اسمه بطلب منه). قورن مشروع له يعمل على ربائد بمشروع آخر له ما زال يُدار يدوياً بسجلات إكسل، على مدى تسعة أشهر تقريباً. قاسه فريق ربائد والعميل معاً، ووافق العميل على نشر الأرقام.

   About 230 characters, inside the field's 300. Visitors never see it. The start and end months, if they can be found, make it stronger than "about nine months".

2. **Correct the first card's basis.** «مقارنةً بالدورة الورقية على المشروع نفسه» says the figure compares the same project before and after. It compares two projects. Proposed, inside the field's 48 characters:

   > مقارنةً بمشروع آخر للعميل يُدار يدوياً

   The other three bases — «زمن الوصول إلى آخر نسخة معتمدة», «من ساعات فريق المشروع الأسبوعية», «اكتمال أثر كل معاملة: من أرسل، من اعتمد، ومتى» — say what was measured, and stay true.

3. **Say it is one project**, as this ticket asks of a single-project figure. The cards have no room for it, so the section's lead carries it. Proposed, inside the lead's 250 characters:

   > الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — أرقام من مشروع أحد عملائنا من المطوّرين العقاريين على مدى تسعة أشهر، مقارنةً بمشروع آخر له يُدار يدوياً.

Then publish, and check the preview's home page: the deck should count "/ 6".

So the ticket moves from `needs-info` to `ready-for-human`: the question is answered, and the two boxes left are CMS edits only the founder can sign in to make. It is resolved once they are published. The third box needs nothing: the deck keeps its six cards.

**Published by migration, on the founder's instruction (23 September 2026).** His words: write the source as a really small, very short comment, put it in the CMS, and release it. So `20260923_150000_publish_proof_figure_sources` writes one line into all four figures' **Where the figure comes from** field:

> دراسة حالة لعميل مطوّر عقاري لا يُذكر اسمه بطلبه: مشروعه على ربائد مقابل مشروع آخر له يُدار يدوياً بإكسل، نحو تسعة أشهر، قاسه الطرفان ووافق العميل على نشر الأرقام.

- **A migration, because nobody here can sign in to the live CMS.** It runs when production builds, before the pages are made, so the deploy that follows the merge is the one that shows the four cards. The preview database is migrated by hand, as `docs/deployment.md` says, before a preview shows them.
- **A card is found by the figure it states, and given the source only while it has none.** A figure an Editor has changed since is a different claim, and a source written in the meantime is his.
- **Written into what is published, and into the newest version and the newest published one.** The home page has drafts waiting (ticket 35's openers, ticket 42's English), and the newest of them keeps its place with the source in it, rather than being pushed aside by a version of the migration's. Otherwise publishing that draft later would take the cards off again. Older versions are history and are left alone. `tests/e2e/proof-figure-sources.spec.ts` reads both, and fails on the draft if the second half of the migration is removed — checked by removing it.
- **Only the source.** Steps 2 and 3 above — the first card's basis, which says the figures compare the same project before and after when they compare two projects, and a line in the section's lead saying they come from one customer's project — were not asked for this time and are not done. **So the first card goes live saying «مقارنةً بالدورة الورقية على المشروع نفسه», which is not what was measured**; until now the missing source kept it off. Changing what visitors read is the founder's to approve, and he was told before merging; each is a small edit in the same entry.
- **The preview's database is not written by this merge.** It is migrated by hand (`npm run cms:migrate` against it, `docs/deployment.md`), and a preview shows the cards only after that.
- **Two suites still hold the figures out of other copy.** `answer-first-copy.spec.ts` and `launch-articles.spec.ts` call them `UNSOURCED_FIGURES` and assert that no rewritten answer and no launch article states them. The name is now out of date, but the rule may still be right — a figure from one customer's project is a card's claim with its basis under it, not a sentence to repeat elsewhere — and that is the founder's to decide, so both are left as they are.
