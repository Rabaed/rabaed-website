# 41: English Screen mocks — Stage 2

**What to build:** A second set of Screen mock images with English interface labels, so the English pages show screens an English reader can follow.

**Blocked by:** 05, 40

**Status:** ready-for-agent

- [ ] English text supplied for every mock and translated in the studio source, not painted onto the images
- [ ] Mocks laid out left-to-right where the interface direction matters
- [ ] English set exported by the same script that produces the Arabic set
- [ ] English pages serve the English mocks; Arabic pages are unaffected
- [ ] Descriptions and captions translated too — a mock with an Arabic description on an English page helps nobody

## Comments

**The descriptions and captions are written (ticket 42, 23 September 2026).** Ticket 42 proposed the English of every Screen mock's description as a draft of «شاشات المنصة», with the rest of the English pages' words, since an English page is published only once everything it reads is — so the last criterion's words exist, waiting for the founder. What is left here is the pictures: `ScreenMockImage` still draws `screenMockImagePath('ar', …)` on every page.
