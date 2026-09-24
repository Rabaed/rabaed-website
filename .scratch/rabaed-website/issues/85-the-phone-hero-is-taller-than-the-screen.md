# 85: The home hero is taller than a phone's visible screen

**What is wrong:** below 981px the home hero is `100vh` (`src/styles/home.css:708-709`, `--hero-h: 100vh` and `.hero-grid { height: calc(100vh - 94px) }`). On a phone `100vh` is the screen with the browser's bars hidden, so while they show — which is when a visitor first arrives — the hero's foot is under the address bar, and what the hero was sized to show at once is not all seen. The Record section already avoids this on purpose with `svh` (ADR-0021).

This follows the Reference site exactly, so changing it is a deviation from `reference/` and needs the founder's yes and an ADR, as ADR-0019 and ADR-0021 were.

Found by the architecture review of 24 September 2026 (L5). **Due before launch**, if the founder wants it.

**Blocked by:** None.

**Status:** wontfix — below 981px the hero is sized by its content, not by the screen, so the browser's bars cannot hide its foot (checked 24 September 2026, below)

- [ ] The founder has seen the hero on their own phone (an iPhone with Safari's bars, a Galaxy with Chrome's) and chosen: keep `100vh` as the Reference site has it, or size it with `svh`
- [ ] If changed: the hero fits the screen with the bars showing at 360×640 and 390×664 (the sizes ADR-0021 holds to), and nothing jumps when the bars hide
- [ ] If changed: an ADR records it, and the Reference comparisons below 981px give up the hero's height by name
- [ ] Related: ticket 96 proposes one screen-height unit for the whole site; if the founder wants that, this ticket can fold into it

## Comments

> *Closed 24 September 2026, before anything was built.* The founder asked for a preview to compare on their phone. Reading the rules first showed there was nothing to compare:
>
> - **The lines the review quoted are not the phone's.** `home.css`'s `#hero { --hero-h: 100vh }` and `.hero-grid { height: calc(100vh - 94px) }` sit in `@media (min-width: 981px) and (max-height: 700px)`: a desktop window that is wide but short. A desktop browser's bars do not hide and show as a phone's do, so there `100vh` is the window the visitor sees.
> - **Below 981px the hero is as tall as what is in it**: `#hero { height: auto; min-height: 0 }` and `.hero-grid { height: auto; min-height: 0 }` in `@media (max-width: 980px)`. Nothing in it is sized to the screen.
> - **Measured, on the test server**, the hero's height against the screen's:
>
>   | Screen | Hero |
>   | --- | --- |
>   | 360×640, 360×780 | 1032px, 1032px |
>   | 390×664, 390×844 | 951px, 951px |
>   | 768×700, 768×1024 | 1008px, 1008px |
>   | 1280×650, 1280×900 | 650px, 799px |
>
>   On a phone and a tablet it does not move with the screen's height. It is one and a half screens tall and scrolls like any other section, so no part of it is meant to be seen at once, and a bar showing or hiding changes nothing in it. Only the desktop rows follow the window, as the Reference site has them.
> - **For ticket 96** (one screen-height unit): the home hero is not a phone case for it. What sizes to the screen below 981px is the Record section (ADR-0021, already `svh`) and the phone menu (`dvh`).

