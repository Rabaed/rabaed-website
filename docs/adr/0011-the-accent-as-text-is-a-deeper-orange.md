# The accent as text is a deeper orange, and white on the accent is the one exception

Ticket 36 put an automated accessibility check on every page and it found one thing, on all twelve of them: colour contrast, and almost every instance was the brand orange. `#F95738` is the Reference site's accent and it is everywhere — the eyebrow above every section, the numbered key on every card, the "read more" link at the foot of every teaser, the primary button on every page.

Against a pale ground it is 3.3:1 on white, 3.1:1 on `--paper`, 2.9:1 on `--soft` and 2.7:1 on its own tint. AA asks 4.5:1 for text that size. There is no way past that other than changing the orange or setting every one of those labels at 18.66px bold, and the second is a redesign. The founder chose on 21 September 2026 to split the colour rather than move it: **the accent keeps its value everywhere it is a fill, a rule, a ring or a piece of artwork, and a deeper orange is used where the accent is the colour of text.**

So `tokens.css` carries `--acc-ink`. It is `var(--acc)` at the root, because on the dark grounds the accent is already readable — 5.6:1 on `--dark` — and every pale surface redefines it to `--acc-deep`, `#B23A1B`, which reaches 4.95:1 on the tightest ground the site has, the guarantee pill's tint over white. A dark island inside a light section — the start page's free-tool block, the calculator's answer, the tool page's drawing — sets it back. Accent text that is already large enough to pass at 3:1, which is 24px, or 18.66px bold, keeps `--acc`: the hero's coloured phrase and the case study figures are unchanged.

**White lettering on the accent fill is the exception, and it is listed rather than waived.** It is 3.25:1, and closing it means darkening the brand orange on every primary button on the site. `tests/e2e/accessibility.spec.ts` names that one pair and no other, so a new colour that falls short — or one of these two on a ground they have not been on — still fails the build.

Two colours that were nothing to do with the accent were simply wrong and are fixed rather than excepted: the Record section's unchosen chips, dimmed to `.32` by the Reference site, which made their words #595B61 on the dark ground at 2.7:1 and are dimmed to `.5` here; and the tool page's state pills, where the words sit on a wash of their own colour and five of the ten combinations fell short.

## Consequences

- This is a **deliberate divergence from the Reference site**, and the Reference comparisons are told so: the parts whose colour changed carry `omit: ['color']` with a note naming this ADR, and everything else about them — where they are, how big they are, what they are set in — is still compared. The comparisons remain the oracle for the design; they are no longer the oracle for the colour of small accent text.
- `--gold-ink` is not a new colour. It is `#836921`, the dark gold the badge on `.strip .c` already used, put to a second use on the tool page's warning pill.
- A page that adds accent-coloured text on a ground nobody has used yet will fail the accessibility check rather than ship unreadable. That is the intended way to find the next one.
- The founder's other option — darkening the brand orange everywhere, buttons included — stays available. It is one token, `--acc-deep` already being the value it would take, and it would let the exception above be deleted.
