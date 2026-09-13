# 17: Legal pages

**What to build:** Terms and Conditions, Privacy Policy and Referral Program Terms, each with its contents list, numbered clauses, last-updated date and contact box.

**Blocked by:** 04

**Status:** resolved

- [x] Text imported **verbatim** from `reference/legal-source/*.docx`, including the three known typos — they are deliberate and are not corrected (ADR-0003) — for the Terms and the Privacy Policy; there is no Word document for the Referral Program Terms, whose source is the Reference page (see below)
- [x] Contents list anchors jump to the right clause
- [ ] These pages remain indexable while the rest of the site is blocked during development — **not built, by the founder's decision: they are blocked until launch like every other page (ADR-0006)**
- [x] Cross-links between the three pages work
- [x] Matches baselines at all eight widths — measured against the Reference pages themselves, at all sixteen baseline viewports
- [x] The header colour behaviour on these pages matches the animated pages exactly

## Comments

**What was built.** Three pages: `/terms` «شروط الخدمة», `/privacy` «سياسة الخصوصية» and `/referral-terms` «الشروط والأحكام — برنامج الإحالة». Each has the compact hero, then the document on the pale ground: the last-updated date, the introduction, a contents list, the numbered clauses, a contact box, and a line pointing on to the other documents. Every word is in the first response.

One component draws all three — `src/components/legal-document.tsx` — from a document held as data in `src/content/legal/`: title, date, introduction, clauses of paragraphs, lists and contact lines, and the see-also line. The three page files are a few lines each. Data rather than markup because ticket 25 moves these documents into the CMS, where every published version is kept with its date and author (ADR-0003): the shape here is already the record the CMS will hold.

### The words, verbatim

The two Word documents in `reference/legal-source/` and the Reference pages were compared paragraph by paragraph before anything was built. They agree word for word. The only differences are what a page adds around a document:

- the Word title «شروط الخدمة لمنصة "ربائد"», which the page states as its heading;
- the placeholder «آخر تحديث: [تاريخ النشر]», which the page fills in as 1 September 2026;
- Word's automatic heading numbers, which the page prints;
- the contact box and the see-also line, which the Word documents do not have.

So the text was imported from the Reference pages by a one-off script — not retyped — into `src/content/legal/{terms,privacy,referral-terms}.ts`, and the tests hold it to both sources:

- **every block of text** on each page against the Reference page, block for block, with JavaScript off;
- **every paragraph of each Word document**, in order, headings with their numbers.

**The Referral Program Terms have no Word document.** Only the Terms and the Privacy Policy are in `reference/legal-source/`, so the Reference page is the Referral Terms' only source, and the only thing they are compared against.

**The three misspellings stay.** «لبرائد» for «لربائد», in clauses 2, 5 and 9 of the Terms, as `reference/HANDOFF.md` records and both sources carry. A test fails if any of them is corrected — by clause or by count. A correction is a change to the approved text, which from ticket 25 is made and versioned in the CMS.

Invisible characters the approved text carries — a left-to-right mark before a phone number, five non-breaking spaces in the Terms — are kept, and written as escapes so the source shows they are there.

### Indexable? No — ADR-0006

The ticket asks for these pages to "remain indexable while the rest of the site is blocked during development", as the Reference site's legal pages are. That contradicts the spec's user stories 62 and 63 — the whole site invisible to search engines until launch, and preview deployments forever — and would put the Terms in search results at a temporary `vercel.app` address before `rabaedapp.com` exists. The founder chose to keep them blocked like every other page, on 13 September 2026. Recorded as **ADR-0006**, overruling the criterion.

They are still readable by anyone with the link on any deployment, which is what an app store or a sign-in provider needs when it asks for a policy's address. They are in `tests/e2e/routes.ts`, so `indexing.spec.ts` holds them to the block, and ticket 39 unblocks them with everything else.

**And they name no English version.** The Arabic is binding and the legal documents are never translated (spec: Out of Scope), so each page's `hreflang` alternates name Arabic alone — `pageMetadata` now takes the locales a page exists in. `localisation.spec.ts` now also fails any page that names an alternate for a locale it does not exist in.

### Deliberate differences from the Reference site

- **The header colour follows the animated pages' rule**, as the ticket asks: light from the moment the document passes under the header until the footer reaches the top. The Reference legal pages ran a listener of their own that turned dark again as soon as the footer passed 78px. The site-wide toggle in `nav-behaviour.tsx` now counts a legal document's ground as a light section; nothing new runs on these pages.
- **A clause jumped to from the contents list stops below the fixed header**, not under it (`scroll-margin-top: 78px`). The Reference legal pages have no script to stop short, so there the heading chosen is hidden behind the header it was chosen from.
- **«آخر تحديث» is set in the Arabic face**, with DM Mono on the numerals alone — the Reference site sets the whole line in DM Mono, which has no Arabic glyphs. The same fix the footer, the guarantee pill and the product page's labels carry.

### Tests

- **`tests/e2e/legal-pages.spec.ts`**:
  - the text against the Reference page, with JavaScript off, and against the Word documents;
  - the three misspellings;
  - the date;
  - every contents entry jumping to its clause and landing clear of the header;
  - the contact details;
  - the cross-links between the three pages, and the Referral Terms' links back to the programme;
  - the header colour at each edge of the rule, on a window short enough for the footer to reach the top, where the animated pages' rule and the Reference legal pages' listener differ;
  - no sideways scrolling at the eight baseline widths.
- **`tests/e2e/legal-matches-reference.spec.ts`** — the hero and every part of the document against the Reference pages at all sixteen baseline viewports. Left out: the date pill's typeface, width and left edge.
- **`tests/e2e/word-document.ts`** reads a `.docx` with Node's own zlib, so the comparison is against the lawyer's file itself, not a copy of its text.
- The three routes are in `tests/e2e/routes.ts`, so the server-rendering, health, fonts, indexing and localisation suites cover them.

**Verified by falsification**, with four deliberate breaks in one build, which failed exactly the tests they should and nothing else (45 of 95):

- Correcting one misspelling failed the three Terms word checks.
- Removing `scroll-margin-top` failed the three contents tests.
- Taking `section.legal` out of the header toggle failed the three header tests.
- Widening the document's column by 1px failed the comparison at the twelve viewports 1024px and wider, on all three pages.

### What the review changed

Two reviews, standards and spec. Both found the same real defect:

- **The pages told search engines an English version exists** — `hreflang="en"` alternates at `/en/terms` and the rest, which will never exist — and `routes.ts` asserted them. Now Arabic alone, as above, with a check that would have caught it.
- **Duplicated test code.** The header's two background colours were written in three specs; they are `tests/e2e/header-colours.ts`. The three legal pages were listed in two specs; they are `tests/e2e/legal-documents.ts`. Reading a page's blocks of text was written three ways in one spec; it is one helper.
- **A name that said little.** The component drawing a line's words, bold phrases and links is `Runs`, not `Text`.

Checked and left:

- **Take the header colour off GSAP on these pages**, with a plain scroll listener. It would not stop the animation library shipping: the header and the page shell that every page shares import it regardless. Not shipping it where it is unused is a change to that shared shell, which is ticket 36's criterion.
- **Move the date's formatting next to the document type.** Ticket 25 decides where a published version's date comes from; the month names can move with it then.
- **`dir?: 'ltr'` on a link** allows one value, and is used: the Referral Terms' phone number is set left to right, as on the Reference page.

### Not covered

- **The animation library still ships on these pages**, through the header's colour toggle and the site-wide `.reveal` entrances — ticket 36, as above.
- **The Referral Program amounts** — 2,000 SAR and 10% — are written into the Referral Terms' text, as the approved text has them. The spec wants the amounts in one place so the page and its terms never disagree; that is the CMS work of tickets 20–25.
- **The last-updated date** is the Reference pages' 1 September 2026, written into each document. Ticket 25 takes it from the published version.
- **The Referral Terms link to `/referral`**, ticket 15's page, which does not exist yet.
