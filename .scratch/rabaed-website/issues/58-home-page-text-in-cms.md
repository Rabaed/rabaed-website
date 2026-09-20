# 58: The home page's text in the CMS

**What to build:** Ahmed changes anything the home page says — the hero, the field situations, the four units, the Record, the before-and-after, the calculator's words, the figures — and publishes it himself, and the admin keeps every card inside its frame.

**Blocked by:** 53, 57

**Status:** resolved

- [x] Every section's words and pictures on the home page are read from the CMS, including the hero diagram's party names and statuses, the deck hints, and the calculator's words
- [x] Every list is editable, except where the design is built around an exact count: the hero's buildings (3), the before/after steps (4) and the calculator's sliders (3) stay locked (spec: Content model)
- [x] Two more lists are built around their count in today's code, beyond the spec's list: the hero's four statuses, which follow the document round the three buildings (`src/components/home/hero-stations.ts`), and the Record's four steps (`src/components/home/record.tsx`). Put to the founder before building whether they lock at four or become editable, and record the answer in the spec
- [x] Every grid holding an editable list lays out any number of items neatly, and today's counts still match the baselines
- [x] The four units' screens use ticket 57's replaceable Screen mocks, and the page ends on ticket 57's shared closing section
- [x] The home page's own pictures, such as the hero's three buildings, are replaceable in the way ticket 57 makes pictures replaceable
- [x] Limits where the design cannot carry more: the figure cards (344×296, 268px tall on short screens) and the situation cards (340×348); the before/after cards, which are absolutely positioned with a minimum height; the closing steps' labels, which do not wrap
- [x] Before the calculator's words move, the readings «1 أيام» and «6 شهراً» are put to the founders, as ticket 10 asked: Arabic would say «يوم واحد» and «6 أشهر», but the words are theirs to change
- [x] A figure with no source stays off the live site, as it does today (`isAttributed`, applied when the site is publicly deployed); ticket 47 is where the founders supply the sources
- [x] Every section but the closing section can be hidden
- [x] A migration imports the home page's words verbatim as its first published version, and its static copy and data files go
- [x] The home page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the Trust strip (ticket 20), the FAQ entries (ticket 22), the calculator's formula (`src/lib/delay-cost.ts`, which stays code), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The largest page, taken last, once the shared pieces exist.

**Where the limits bite** is ticket 21's survey of 13 September 2026, re-checked against today's code before setting any limit. The before/after cards' starting state uses `nth-child` for four columns (two on mobile), which is part of why that count stays locked.

**From ticket 57 (15 September 2026).** The home page already reads the closing section and its four units' screens from the CMS: both are entries it shares with the product page, and a shared entry read by one page only would let the two drift apart. `src/content/pages/home.ts` passes the Screen mocks to `unitTabs` in `src/content/four-units.ts` and takes the closing section from `getClosingSection`; the tabs' own words (their titles and tags) are still in code, and are this ticket's. A picture is replaceable through `pictureField` in `src/cms/page-fields.ts`, which holds a replacement to its place's shape; the words a screen reader hears for it are the section's own, in both languages (`src/cms/globals/screen-mocks.ts` is the example).

**The founder's answers (15 September 2026).**

- **The hero's four statuses and the Record's four steps lock at four.** An Editor rewords each one but adds or removes none: the statuses follow the document's fixed route round the three buildings, and the Record's seal says «4 خطوات». Recorded in the spec (Content model).
- **The calculator's readings are corrected to Arabic's counting rule**, for days and months alike: one, two, three to ten, eleven and more («1 يوم», «2 يومان», «3–10 أيام», «11+ يوماً»; «6–10 أشهر», «11+ شهراً»). The page opens at «7 أيام» and «18 شهراً», which read the same under either rule, so the baselines do not move.

**Decided while building (15 September 2026).**

- **The hero cannot be hidden**, though the ticket names only the closing section: it holds the page's only main heading, as on the start and product pages (tickets 53 and 57). Every other section — the Trust strip, the situations, the units, the Record, the before-and-after, the calculator, the figures and the questions — has a switch.
- **Bold and line breaks are marks an Editor types.** The before-and-after sets phrases in bold mid-sentence and breaks its lines, which the tool page's separate bold field cannot say. A phrase between asterisks is bold, as WhatsApp marks it, and a new line is a line break (`src/cms/emphasis.ts`); a mark left open is refused on publishing.
- **The figures deck is one list of two kinds of card**, a before-and-after figure and a commitment (Payload blocks), so an Editor keeps them in one order. A figure's source is a field of its own that visitors never see: while it is empty, the card stays off public deployments, as a `null` source did before. A figure itself is Latin only, since DM Mono draws it.
- **The hero's replaceable pictures are its three buildings and the travelling document**, each held to its drawing's shape; the drawing is decorative to a screen reader, which hears the section's own description instead.
- **The calculator's slider names and the line splitting its cost are named fields**, not lists: each belongs to one slider or one amount. The line is two names, each followed by its amount in code, so an Editor cannot lose an amount from it.
- **The headings the Reference site breaks onto lines are short lists**: up to two lines before the hero's line in colour, up to three in the Record.
- **The limits were measured on the page, not guessed**, with every word at its longest, at nine widths from 360 to 1600. A situation's quote holds 75 characters beside a 50-character cost (a 77-character quote fills the card at 768 and 980); a before-and-after card's words hold 66, marks and line breaks counted (360px holds 68); a figure card's claim 36 and basis 48 leave a line to spare everywhere; a figure itself holds 5 characters, since a sixth, set at 60px in DM Mono beside its two bars, pushes the bars past the card at desktop widths. `tests/e2e/home-text.spec.ts` fills every card to its limits and checks nothing it draws leaves the card or runs into the next part of it.
- **On a phone, a before-and-after card can be filled past its bottom.** Below 700px each column is a fixed minimum height, two columns wide, and at 360px Arabic words stop fitting at 52–59 characters, depending on where the lines break. The founders' own longest step is 65 characters with its marks and line break, and fits only because of where its words fall, so a limit short enough to hold any words on a phone would refuse theirs. The limit holds every width from 700px up; letting the card grow on a phone would change a layout the baselines hold. Worth a design decision if an Editor's words ever spill there.
- **The Reference comparison reads the calculator's readings by their numbers**, since the founders' words after a count differ from the Reference site's (`home-before-after-and-calculator-match-reference.spec.ts`).
- **The home page's migration was generated again on top of tickets 55 and 56's** once they reached `main`, as `docs/agents/parallel-sessions.md` asks. Before that it came out creating ticket 57's tables again — ticket 57's migration sorts before ticket 54's, whose snapshot has none of them — and an empty snapshot migration covered it; the newest snapshot on `main` already carries ticket 57's tables, so that migration went.
- **Uploads in the test suite each get a name of their own** (`tests/e2e/cms.ts`). Run beside this suite, the product page's replaced-screen test once had its upload refused; two uploads arriving under one name is the likely cause, not a proven one, and the helper now says why an upload fails.

**Parallel sessions.** Touches only the home page's module, components and data files, and a migration of its own. Take it after ticket 57 is merged. After updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).
