# 40: English site switched on — Stage 2

**What to build:** The English version becomes reachable at `/en`, laid out left-to-right, with a switcher that takes a visitor to the same page in the other language and remembers the choice.

**Blocked by:** 04

**Status:** resolved — the English header and footer wait in the CMS as a draft for the founder to publish; see below

- [x] `/en` serves left-to-right layout with `lang` and `dir` set correctly
- [x] The same stylesheet serves both directions through logical properties; nothing is flipped twice
- [x] The switcher preserves the current page where a translation exists
- [x] Where no translation exists, the visitor is told and offered the Arabic version rather than shown a blank page
- [x] Choice persists between visits but never overrides an explicit URL
- [x] `hreflang` alternates and per-locale canonical URLs correct
- [x] Legal pages stay Arabic-only, with the Arabic marked as the binding version

## Comments

**Built in two pull requests.** #63 added the switcher to the Arabic pages and the remembered choice (ADR-0014), and left the ticket open because English pages had no header to put a switcher in. This one builds that English header and footer and finishes the ticket.

**The English header and footer are drawn from the CMS, and their English waits as a draft.** Every word in them is an Editor's (ticket 59), and an English page never shows Arabic in place of English it has not got. So `20260923_090000_propose_english_site_words` writes the English of all of them into a **draft** of «كلمات الموقع المشتركة», with English added to the languages it is published in, and publishes nothing — the founder agreed to this on 22 September 2026, as ticket 35's copy was done. Until he presses Publish, English pages are their content alone, as they were before. The moment he does, every English page has the full header and footer. `docs/deployment.md` has what he does, under «The English header and footer, waiting for a decision». Published once in a local database through Payload itself: the CMS accepts every word as written.

- Three words are not the obvious English because the obvious one does not fit the room the header has: **Customers** (not «Case studies», 12 characters against the menu's 11), **Partners**, and **Book a demo** (not «Book a live demo», 16 against 15).
- The seed follows ticket 35's rules: SQL, frozen words, nothing found by an id, the entry copied rather than its columns listed, and nothing proposed where the founder has a draft waiting or English already published.

**What is live before the founder publishes, and what waits for him.** The boxes are ticked for what the code does. Two of them hold on the English side only once the English words are published: until then an English page has no header, so no switcher to take a reader to the Arabic (criterion 3) and none to record the choice with (criterion 5). The English placeholder and every notice below still link to the Arabic in their own words, so no English reader is stranded meanwhile. Resolved rather than left `ready-for-human`, as ticket 35 was, because what remains is one press of Publish on words nobody but the founder can approve, and tickets 41–43 need none of it to start. The founder confirmed this on 23 September 2026.

**An English address of an Arabic-only page says so and offers the Arabic** (criterion 4, spec story 18). The English menu links to every page the Arabic one does, so `/en/product` and its four siblings, and the three legal documents, now answer with a notice instead of «not found»: `src/app/(en)/en/[page]/page.tsx`, from the table in `src/content/arabic-only-pages.ts`. Each is noindexed and kept out of the sitemap, and carries no canonical URL or `hreflang` alternates — an exception to the spec's «Every locale has `hreflang` alternates and a self-referencing canonical URL», made on purpose: a notice is not a page of the site, and naming it as an alternate would send a crawler to a page that says the page is elsewhere. The article notices of tickets 23 and 24 make the same exception. Ticket 42 takes each marketing page out of that table as it writes the page.

**Legal pages stay Arabic-only, with the Arabic marked as binding** (criterion 7). Their English address says «This document is published in Arabic only, and the Arabic text is the binding version» and offers the Arabic. The English footer links there.

**Tested where the entry lives.** `site-words.spec.ts` restores the proposal as a draft and previews every kind of English page from it: the menu's English labels and where they lead, the marked link, the switcher leading to the same page in Arabic, the footer. It also measures the English header on one line at 1100px and wider. It publishes nothing, for the reason the suite gives: every other suite reads this entry. `localisation.spec.ts` covers the notices, which need no CMS words.

**Also:** the footer's icons and wordmark had Arabic accessible names on every page; English pages now name them in English.

**Left for later:** the sign-in link has one address for both languages (`?lang=ar_ar`), and nobody has said what the English one is — `docs/deployment.md` tells the founder. And the preview banner is Arabic on English pages, which only an Editor ever sees.
