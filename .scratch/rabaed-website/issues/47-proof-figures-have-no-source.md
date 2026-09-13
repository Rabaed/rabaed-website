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

**Status:** needs-info

## They cannot reach a visitor in the meantime

Ticket 07 built the deck with all six cards, verbatim, because that is the only way to test it and hold it to the Reference site. Each figure carries a `source` in `src/content/proof-figures.ts`, and the four above are `null`.

**A card whose source is `null` is left off every public deployment** — preview, development and production, indexable or not. Local builds and the test suite still draw all six. The check is `isPubliclyDeployed()` in `src/lib/environment.ts`, which is true for any Vercel deployment.

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

- [ ] Every figure on the proof deck has a recorded `source`, has been replaced by something attributable, or has been removed
- [ ] The decision is written into `src/content/proof-figures.ts` (or the CMS entry, if ticket 21 has landed), so the next person to edit a card sees it
- [ ] `tests/e2e/home-card-decks.spec.ts` and `tests/e2e/home-decks-match-reference.spec.ts` updated if the deck's cards change
