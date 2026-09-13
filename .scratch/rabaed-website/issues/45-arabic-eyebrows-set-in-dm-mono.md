# 45: Bug — every Arabic eyebrow is set in a font with no Arabic glyphs

**What is wrong:** `.eyebrow` — the small orange label above almost every heading on the site — sets DM Mono. DM Mono has no Arabic glyphs, so what a visitor actually reads is the browser's last-resort monospace: different weight, different shapes, and joined letters pulled apart by the 0.12em letter-spacing that comes with the rule.

The spec forbids exactly this: "DM Mono for Latin numerals only — DM Mono has no Arabic glyphs and must never be applied to Arabic text" (spec: Design system).

**Reported by:** ticket 06, on building the hero. Not fixed there because the rule is site-wide and the fix changes the look of every page.

**Blocked by:** nothing.

**Status:** needs-info

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

- [ ] A decision is recorded — in this ticket or an ADR, since it overrules the Reference site everywhere
- [ ] No Arabic text on the site resolves to a font without Arabic glyphs, on any page, at any width
- [ ] The English locale still gets DM Mono where DM Mono is right for it
- [ ] The comparison tests are updated to record the eyebrow as a deliberate divergence, the way the footer's copyright and the hero's guarantee pill already are

## Comments

**One more instance, found by ticket 11:** the closing section's step labels — «01 · إعداد», «02 · تشغيل», «03 · ضمان» — are `.tail-steps b`, set in DM Mono, so the Arabic word in each falls to a monospace fallback. The rule is shared by every page that ends on that section, so it belongs to the same decision as `.eyebrow` rather than a local patch.

**Four more on the product page, fixed locally by ticket 12:** «المخرَج» on the journey's last panel, «حسب المشروع» on the custom strip, and in the review cycle «دورة داخلية · محجوبة», «ما يعبر رسمياً» and the note's two headings. Each is used on that page only, so each now sets the Arabic face, as the four units' «المخرَج» did in ticket 08 — but each keeps the Reference site's letter-spacing, from .02em to .08em. Whatever is decided here about letter-spacing on Arabic labels should be applied to them too; they are in `src/styles/product.css`, each marked DIVERGENCE.

**Three more on the start page, fixed locally by ticket 13:** the step cards' labels «01 · إعداد», «02 · تشغيل», «03 · ضمان» (`.start .s .k`). Used on that page only, so the label now sets the Arabic face with only the numeral in `.mono`, as the guarantee pill does; it keeps the Reference site's .12em letter-spacing. It is in `src/styles/start.css`, marked DIVERGENCE. The page's four eyebrows — «ابدأ», «كيف نبدأ معك», «الأسئلة الشائعة», and «أداة مجانية» on the tool teaser — are still `.eyebrow`, and wait on this decision with the rest.

**Four more on the partnership page, left for this decision by ticket 16:** the path's stage labels «المرحلة 01» to «المرحلة 04» are `.tail-steps b`, the rule the home and product pages' closing steps share, so they keep DM Mono with them. The page's other Arabic in DM Mono is fixed locally, as on the referral page: the figures «3 أنماط», «4 مراحل» and «بلا رسوم», the modes' labels «01 · التضمين في العرض» and the rest (`StepCards`), and «يوما عمل» in the guarantee pill. Its seven eyebrows are still `.eyebrow`.
