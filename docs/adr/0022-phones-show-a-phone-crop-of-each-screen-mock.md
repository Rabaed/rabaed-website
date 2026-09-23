# Phones show a Phone crop of each Screen mock

ADR-0002 made Screen mocks exported pictures of a fixed 1440×900 screen, and accepted that a picture cannot reflow. On a phone that meant a screen nobody could read: at 700px wide and narrower the site draws each one 1040px wide in a box that pans sideways, so a visitor sees a third of it at a time, and each third still at about a quarter of its size.

On 23 September 2026 the founder chose a **Phone crop** (CONTEXT.md) for phones: a second picture of each Screen mock, cut from the same screen, zoomed in on the part that tells its story. Tapping it opens the whole screen. Two alternatives were turned down:

- **The swipe alone, with a hint** (ticket 77). It says the screen can be moved, but still shows a third of it at a time, at the same unreadable size. It stays as the fallback wherever there is no crop to show, which is the case for a picture an Editor has replaced until ticket 79.
- **Each screen redrawn as a phone app.** Eight screens of new design in two languages, depicting a phone app that does not exist. The crop is a cut of the real screen, so it cannot show anything the whole screen does not.

**One shape for all eight: portrait, 520×650 of the 1440×900 screen** (`PHONE_CROP` in `src/screen-mocks/registry.ts`). In a 390px phone's 350px column that draws the screen at two-thirds of its size, where a table's 13px text can be read. A narrower cut would be larger still, but could no longer hold one of the floating cards whole beside the slice of screen it is about. Each crop's position is set in the registry, next to its Screen mock. The founder approved the shape and all eight positions on 24 September 2026, one by one, next to the whole screens. The stamped sheet's crop keeps the «أربع توقيعات على ورقة واحدة» card and loses the stamp: the stamp and the signers' names are further apart than any cut of this shape reaches, and the founder chose the card.

**The English crop is the Arabic one mirrored.** Its box is reflected across the stage's middle, because the English screen is the Arabic one mirrored (ticket 41). So English crops are never positioned separately.

## Consequences

- **The export script cuts each crop from the same render as the whole screen**, so re-running `npm run mocks:export` remakes both, and a crop cannot show a screen that its whole picture no longer shows. `tests/e2e/screen-mocks.spec.ts` checks that every Screen mock has a crop on record in each language, and that each crop is exactly its box's pixels in the committed whole picture.
- **Moving a crop is a change to what phone visitors see**, and goes back to the founder like any other change they approved.
- **Phones download the crop instead of the whole screen**, until the visitor taps. That is about 45–105 KB for each crop, where the whole screen is 130–260 KB.
- **A replaced picture has no crop.** Until ticket 79 lets an Editor upload one, phones show a replaced Screen mock whole, with ticket 77's hint, and never the exported crop of the screen it replaced. Ticket 77's tests of the pan now run against a replaced screen in a preview (`product-text.spec.ts`), because every screen visitors are sent has a crop.
- **The words on the crop and on the opened screen are site-wide words in the CMS**, as ticket 77's hint is: «اضغط لرؤية الشاشة كاملة», «تكبير» and «إغلاق», with their English. A language whose site-wide words are not published yet shows the whole screen to swipe instead, so a crop is never shown without its button.
- **Opening the whole screen adds a step to the browser's history**, so the phone's back gesture closes it rather than leaving the page. Closing it any other way takes that step off again.
