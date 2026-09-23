# 45: Bug — every Arabic eyebrow is set in a font with no Arabic glyphs

**What is wrong:** `.eyebrow` — the small orange label above almost every heading on the site — sets DM Mono. DM Mono has no Arabic glyphs, so what a visitor actually reads is the browser's last-resort monospace: different weight, different shapes, and joined letters pulled apart by the 0.12em letter-spacing that comes with the rule.

The spec forbids exactly this: "DM Mono for Latin numerals only — DM Mono has no Arabic glyphs and must never be applied to Arabic text" (spec: Design system).

**Reported by:** ticket 06, on building the hero. Not fixed there because the rule is site-wide and the fix changes the look of every page.

**Blocked by:** nothing.

**Status:** resolved

## Where it is

`src/styles/tokens.css`:

```css
.eyebrow { font-family: "DM Mono", monospace; font-size: 12px; letter-spacing: .12em; color: var(--acc); margin-bottom: 14px }
```

It is the Reference site's own rule, carried over verbatim by ticket 04, and the Reference site has the same defect on all nine of its pages. So the visual baselines record the broken rendering, and a fix will make the rebuild differ from them everywhere an eyebrow appears.

Two other places had the same problem and are already fixed, both as deliberate divergences commented in place: the footer's copyright line (ticket 04) and the hero's 60-day guarantee pill (ticket 06). In both, the fix was to put `.mono` on the Latin numerals alone and leave the Arabic in IBM Plex Sans Arabic. The eyebrow has no Latin in it at all, so there is nothing to keep in DM Mono — the question is what it should look like instead.

## Why this is not a decision an agent should make alone

It is not a bug fix with one right answer. `.eyebrow` appears on every section of every page, and changing it changes the site's typographic voice. The founder should see it.

Options, in rough order of how much they change:

1. **Drop the font-family and keep everything else.** The label stays small, orange and letter-spaced, in the site's Arabic face. Least disruptive; the letter-spacing still pulls Arabic letters apart, which is its own small defect.
2. **Drop the font-family and the letter-spacing**, and lean on size, colour and weight instead. Correct Arabic typography; the labels will read noticeably softer.
3. **Keep DM Mono for eyebrows that are Latin or numeric**, and use the Arabic face for the rest. Two looks on one site, which is probably worse than either.

The English site (tickets 40-42) reaches the same rule from the other side: in English, DM Mono is the right face and this is not a bug at all. Whatever is decided has to hold for both locales, which argues for scoping the fix to Arabic rather than replacing the rule.

## Done when

- [x] A decision is recorded — in this ticket or an ADR, since it overrules the Reference site everywhere
- [x] No Arabic text on the site resolves to a font without Arabic glyphs, on any page, at any width
- [x] The English locale still gets DM Mono where DM Mono is right for it
- [x] The comparison tests are updated to record the eyebrow as a deliberate divergence, the way the footer's copyright and the hero's guarantee pill already are

## Comments

**One more instance, found by ticket 11:** the closing section's step labels — «01 · إعداد», «02 · تشغيل», «03 · ضمان» — are `.tail-steps b`, set in DM Mono, so the Arabic word in each falls to a monospace fallback. The rule is shared by every page that ends on that section, so it belongs to the same decision as `.eyebrow` rather than a local patch.

**Four more on the product page, fixed locally by ticket 12:** «المخرَج» on the journey's last panel, «حسب المشروع» on the custom strip, and in the review cycle «دورة داخلية · محجوبة», «ما يعبر رسمياً» and the note's two headings. Each is used on that page only, so each now sets the Arabic face, as the four units' «المخرَج» did in ticket 08 — but each keeps the Reference site's letter-spacing, from .02em to .08em. Whatever is decided here about letter-spacing on Arabic labels should be applied to them too; they are in `src/styles/product.css`, each marked DIVERGENCE.

**Three more on the start page, fixed locally by ticket 13:** the step cards' labels «01 · إعداد», «02 · تشغيل», «03 · ضمان» (`.start .s .k`). Used on that page only, so the label now sets the Arabic face with only the numeral in `.mono`, as the guarantee pill does; it keeps the Reference site's .12em letter-spacing. It is in `src/styles/start.css`, marked DIVERGENCE. The page's four eyebrows — «ابدأ», «كيف نبدأ معك», «الأسئلة الشائعة», and «أداة مجانية» on the tool teaser — are still `.eyebrow`, and wait on this decision with the rest.

**Four more on the partnership page, left for this decision by ticket 16:** the path's stage labels «المرحلة 01» to «المرحلة 04» are `.tail-steps b`, the rule the home and product pages' closing steps share, so they keep DM Mono with them. The page's other Arabic in DM Mono is fixed locally, as on the referral page: the figures «3 أنماط», «4 مراحل» and «بلا رسوم», the modes' labels «01 · التضمين في العرض» and the rest (`StepCards`), and «يوما عمل» in the guarantee pill. Its seven eyebrows are still `.eyebrow`.

**Decided by the founder, 23 September 2026, and done: Thmanyah Sans, untracked.** None of the three options above: the founder chose a face instead, thmanyah's Thmanyah Sans, for every Arabic label, the eyebrow and every label in its voice. Recorded in ADR-0018, with the licence it comes under and the one condition on it: the repository goes private by 23 December 2026.

- **Every Arabic label** is in Thmanyah Sans with no tracking: the eyebrow on every page, `.tail-steps b`, the phone menu's «الشراكات», the step cards' `.k`, the four units' and the journey's «المخرَج», the product page's review-cycle labels, and the tool page's requirement cards. Each rule has an Arabic-only override beside it, so English pages keep DM Mono and its tracking.
- **One weight, Regular, the founder's choice.** Each of thmanyah's files is a whole 76 KB, since the licence forbids subsetting it. A bold for the step and stage labels would have cost a second 76 KB on the home, product and partnership pages, so those labels are Regular where the Reference site's are bold. Every Arabic page's weight budget rises by 80 KB.
- **Numerals stay in DM Mono.** The closing section's and the partnership path's labels now wrap their numeral in `.mono`, as the step cards already did.
- **Lined up as IBM Plex Sans Arabic is.** Thmanyah's own ascent and descent made each line that mixes it with DM Mono 1px to 4px taller than the Reference site's. `ascent-override` and `descent-override` give it IBM Plex's line box, and every comparison matches again.
- **Tests.** `fonts.spec.ts` walks every Arabic page at 390px and 1440px and fails on Arabic set in a face without Arabic glyphs, or tracked as a label is, and checks that Thmanyah loads. `geometry.ts` reads the label face as the DM Mono it replaced, as it reads ADR-0011's colours. `english-pages.spec.ts` holds every English eyebrow to DM Mono.
- **Left as the design has it:** the headings drawn in by .01em to .02em, and the few phrases let out by as much. The same walk found them. They are too slight to part a join, and they are not labels.