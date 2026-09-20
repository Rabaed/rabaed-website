# 20: Trust strip in the CMS

**What to build:** Ahmed adds a new client logo, sets its link, reorders it, and it appears in the moving bar on the site without a developer.

**Blocked by:** 19, 06

**Status:** resolved

- [x] Trust strip entries hold image, company name, optional link and order
- [x] Adding, reordering, hiding and removing entries all work from the admin
- [x] The bar still moves continuously and pauses on hover with any number of logos
- [x] Missing image falls back to the company name as text, as on the Reference site
- [x] Logos are served at a consistent height with transparent backgrounds preserved
- [x] The eight existing logos are migrated as the starting content

## Comments

**The founder's answers (20 September 2026).**

- **A client's logo may be an SVG.** The media collection refused one until now, and its own comment left the decision to this ticket. Accepting it means sanitising it, which is ADR-0010: what is stored is what survives `src/cms/svg-sanitiser.ts`, and a file with no drawing left is refused rather than kept empty.
- **The height each mark is drawn at is the Editor's**, between 16 and 44 pixels. A wide wordmark has to stand shorter than a compact monogram to look the same weight, which is why the Reference site wrote eight CSS rules keyed on the logo. Carrying the number with the logo means a new client arrives complete.

**Decided while building (20 September 2026).**

- **The marks are a global, not a page's section.** Three pages carry the strip — home, product and start — and the spec's Content model lists «Trust strip logos» among the globals. Each page keeps the switch it already had for whether the strip shows there; the list itself is one entry, so a client signed today appears on all three at once.
- **A logo's height is checked, not its shape.** `pictureField` holds a picture to one exact ratio, which no list of logos can satisfy: the eight are 94×112 through 499×112. `logoField` asks instead that a mark be 88 pixels tall or more — twice the tallest height the bar draws — so it stays sharp on a high-resolution screen. A vector is exempt, having no pixels to run short of.
- **A mark with no address stays a picture.** The link is the one field a logo may go without; where a company gave one, the mark becomes a link that opens in its own tab and tells the other site nothing (`rel="noopener noreferrer"`), and the copy row's links are out of the tab order.
- **An unticked mark leaves the list the page draws**, rather than being hidden in the page: what the bar travels past is what a visitor sees, and the marquee measures it. The mark keeps its place in the CMS for the day a contract is renewed.
- **The eight files stay in `public/logos/`.** The migration reads them from there and uploads them, which is how every database — the test server's throwaway one, a preview's, production's — gets its own copy. No page reads them any more.
- **An SVG is stored as it arrived**, the one upload not re-encoded to WebP: Payload resizes and converts none of it, which is exactly why sanitising is the whole of the defence. It also carries no pixel size, so the strip draws it at its height and lets the width follow.
- **The suite's fallback tests stop the marks wherever the CMS serves them from.** They aborted `/logos/*.png` before; a mark's address is the CMS's now, so the tests read it off the page and block that.
