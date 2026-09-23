# A tall screen is not given more empty space: the hero leaves room for the Trust strip and stops at 860px, and section spacing stops at 72px

Two of the Reference site's vertical measures grow with the height of the window, and the founder found both on a 1920×1080 screen on 23 September 2026:

- **The home hero is the window's height**, never less than 760px, with its content centred in it. The content does not grow with the window, so the empty space above and below it does, with no ceiling: about 200px each side at 1080px tall, and more on anything taller.
- **Every section is padded by 8% of the window's height**, between 56px and 96px, above and below. Where two sections meet that is up to 192px of nothing. It is capped, but a 1080px screen is already near the cap.

The founder chose to keep the space but stop it growing, rather than take it out. Both are `reference/HANDOFF.md`'s values, carried over exactly until now, and this overrules them:

**The hero is the window's height less the Trust strip's, between 760px and 860px.** The strip of client marks under it is then on the first screen wherever the window is tall enough for both: along the bottom edge at about 900px tall, with room to spare at 1080px, where the hero is 860px. The 860px was the founder's figure, chosen because at their 1080px it leaves the companies in view. Where an Editor has switched the strip off, there is nothing to leave room for and the hero is the window's height, up to 860px. Below 981px wide, and on a desktop window 700px tall or less, the hero keeps the rules it had.

**Section spacing stops at 72px**, so 144px at most between two sections. The floor and the 8% rate are unchanged, the value is one token, and every page follows it, including those that pad by a multiple of it.

**The Record section is left alone.** It also fills the window with its content centred, but it is pinned while the visitor scrolls through its change from dark to light, and the full window is how that effect works.

## Consequences

- **The Reference comparisons barely notice the spacing.** They are all taken at 900px tall or less, where 8% of the window is already 72px or less, so no section moves. `tests/e2e/section-spacing.spec.ts` asserts that too, so a change to the rate or the floor cannot hide behind the new ceiling.
- **They do notice the hero**, at desktop widths 840px and 900px tall. The whole-page comparison lists it as deliberately shorter, by exactly the amount the rule above gives, measured from the strip as it renders. The hero's own comparison gives the Reference site's hero the rebuilt height before measuring, so every part inside it is still compared.
- **The strip's height is written into the hero's rule**, from the same custom properties the strip is sized by, not measured by a script: a script would move the hero after the page had drawn. With motion on, the strip is one row of fixed height at every desktop width (ticket 06), so the figure is exact. With reduced motion the marks wrap instead of travelling, and a list long enough to need a second row at a desktop width would put that row under the fold. The hero is never taller than it was before this change, so that is the worst it does. The home hero test holds the strip's bottom edge to the bottom of a 900px window, so a change to the strip's padding or row height that is not made through those properties fails it.
- 860px, 72px, and "less the strip" are each one value in the stylesheets, so the founder can change any of them later without revisiting the others.
