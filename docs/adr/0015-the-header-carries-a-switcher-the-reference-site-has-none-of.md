# The header carries a language switcher, and gives way to the panel at 1100px

`reference/` is the specification, not legacy code, and its header is one of the things fourteen spec files hold the rebuild to. Ticket 40 puts something in that header the Reference site has none of: a link to the page in the other language. The Reference site is Arabic only and never needed one.

There is no version of this that does not change the header. A switcher that is not in the header is a switcher nobody finds.

**And it did not fit.** `src/cms/globals/site-words.ts` records the measurement behind the CMS's label limits: at 981px — the width at which the menu stopped being a panel and became a row — four links at eleven characters, the Partnerships word, a twelve-character sign-in link and a fifteen-character demo button filled the space between the wordmark and the edge *exactly*. "The header is full at the words it launched with." The switcher wanted 57px that were not there, and `tests/e2e/site-words.spec.ts` said so on the first run.

The limits could not pay for it. «قصص العملاء» is already eleven characters, so lowering the limit would refuse a word the site ships with, and Ahmed would be editing menu labels to make room for a control he did not ask for.

**So the row gives way to the panel earlier: at 1100px rather than 981px.** Above it there is room for everything; below it the panel holds the switcher, with space to say why a page with no translation leads to a home page — which the row never had. The site's own 981px breakpoint is untouched everywhere else; this is the header's alone.

The founder chose this on 22 September 2026, over dropping the switcher out of the header and over a header that overflows on narrow laptops.

## Consequences

- **A band of widths from 981px to 1099px now sees the menu button where it used to see a row of links.** That is a visible change to anyone on a small laptop or a tablet held sideways, and it is the price of the switcher. Nothing is lost at those widths — the panel holds every link the row did, and the switcher besides.
- **`tests/e2e/shell-matches-reference.spec.ts` gives up four measurements and keeps the rest**, which is worth stating exactly, because a comparison against the specification is only worth what it still refuses:
  - The sign-in link, the demo button, the menu button and the group holding them give up `left` and `width`. They sit one control further along, and the group is wider by that control. Their heights, rows, colours, typeface and visibility are all still held.
  - The menu's links are measured from the menu rather than from the header, because widening the controls moves the whole menu — 34.8px at 1280px. Every gap inside it, every width, and the dropdown's placement under its trigger are still held exactly.
  - The panel's content box gives up its height, and only downwards: the switcher is the last thing in it, so nothing above it moves.
  - **The header is not compared at 1024px at all**, the one width of the eight that falls between the two breakpoints, where one document draws a row and the other a button. The footer is still compared there, as at every width.
- **The switcher itself is compared against nothing**, because there is nothing to compare it against. It is held instead by `tests/e2e/localisation.spec.ts`, which asks what it does rather than what it looks like: that it offers what the `hreflang` alternates offer on every route, that it says so where a page has no translation, and that it is in the first response.
- **ADR-0013 is the precedent**, and this follows it: where the rebuild adds something the Reference site has none of, the addition is recorded rather than smuggled past the comparison, and the comparison is narrowed by name rather than loosened.
- **Anything else that wants a place in that row now has to find 62px**, which is what is left at 1100px once the switcher has its 57px. There is no more room after that without moving the breakpoint again or shortening what an Editor may write.
