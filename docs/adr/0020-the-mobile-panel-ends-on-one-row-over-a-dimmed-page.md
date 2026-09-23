# The mobile panel ends on one row, over a dimmed page

`reference/` is the specification, and its mobile panel is one of the things `tests/e2e/shell-matches-reference.spec.ts` holds the rebuild to. It ends with the sign-in link as a full-width outlined pill on a line of its own, and it hangs over the page at full strength: the page shows through below it, scrolls under it, and does nothing when tapped.

ADR-0015 then put the language switcher in the panel, after the sign-in pill, where it inherited every menu link's padding and the line above it. On a phone the founder found the two stacked, a full-width pill and then «English» alone on a row dressed as one more menu link, and circled it as looking wrong. Under the panel, the hero's line and the «60 يوماً» badge showed through at full strength, which read as unfinished.

**So the panel ends on one row, and the page behind it is dimmed.** The founder chose this on 23 September 2026 (ticket 76):

- **Sign-in and the language share one row**, on opposite sides and mirrored between the languages as the rest of the site is: sign-in at the start (right in Arabic, left in English), the language at the end. Sign-in is an outlined pill sized to its words, as the desktop header draws it, not the full width of the panel. The language link carries a small globe and loses the line above it, so it stops reading as a menu link. It keeps the dot ADR-0014 gives a remembered language.
- **The note stays, under the row.** Where a page has no translation, the sentence saying the link opens the other language's home page runs across the panel on a line of its own. ADR-0015 chose the panel partly because it has room for that sentence, and this keeps it.
- **The panel stays a panel.** The founder chose it over a full-screen menu. The page below it is dimmed and held still while it is open, a tap on the dimmed page closes it, and closing it leaves the page where it was.

Nothing changes at 1100px and up, where there is no panel. The links, the Partnerships group, the 1100px breakpoint and every way the panel already closed (the menu button, Escape, following a link, widening past 1099px) are as they were.

## Consequences

- **`tests/e2e/shell-matches-reference.spec.ts` gives up the panel's sign-in link's placement by name**: where it sits, its width and height, and the kind of box it is drawn as, since a flex item in a row is not the block the Reference site draws. Its ink, its border's colour, its typeface and size, and whether it shows at all are still held to the Reference site's. The panel's content box already gave up its height to ADR-0015's switcher, and that now covers the row and the note as well.
- **The dimming and the held page are compared against nothing**, because the Reference site has neither. `tests/e2e/page-shell.spec.ts` holds them instead, by what a visitor sees: what lies under a point below the open panel, a wheel over it that scrolls nothing, the scroll position unchanged by closing, and a tap on the dimmed page that closes the panel and reaches nothing under it.
- **The row has to fit the longest sign-in label the CMS allows at 320px.** `tests/e2e/site-words.spec.ts` fills the label to its twelve characters and checks the row, and checks the English panel's mirrored order from the proposed English words.
- **The page is held still by hiding the document's overflow**, which leaves the scroll position alone and needs no script. No gutter is reserved for the scrollbar that hides. A phone's scrollbar takes no room, so nothing moves there. Where a desktop browser between 981px and 1099px wide draws a scrollbar that does take room, the header widens by that much while the panel is open. Reserving the gutter would have stopped that, but it would also have narrowed the open header wherever scrollbars are hidden rather than overlaid, and the Reference comparison would then have had to give up the whole header's width.
- **ADR-0013 and ADR-0015 are the precedent**, and this follows them: an addition the Reference site has none of is written down, and the comparison is narrowed by name, not loosened.
