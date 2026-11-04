# 105: The Company profile's first four sections: the truth, the real site, the trap, who we are

**What to build:** Ahmed's sections 01–04 in the site's style, every word an Editor's (spec: Sections, in order).

**Blocked by:** 102 (the page has to exist).

**Lane:** 2a

**Status:** resolved

- [x] 01 Here's the truth (`#truth`): the eyebrow, heading and body, and the redacted paper photo (Ahmed's `paper-800/480`, an Editor may replace it) with its three red notes and caption
- [x] 02 The real site (`#numbers`): the three figures (35%, 30%, 95%) with their labels, counting up as they come into view (still under reduced motion), and the source line «المصدر: بيانات مشاريع ربائد» / "Source: Rabaed project data"
- [x] 03 The trap (`#trap`): body, kicker and the four tool cards (WhatsApp, Email, Excel, SharePoint) with Ahmed's icons
- [x] 04 Who we are (`#about`): the two-line heading, body and quote
- [x] Each section has a show switch, and the words are seeded from `../source/*.json`, each language from its own file
- [x] Every size, font and colour is from the site's tokens and type (spec: Look). No sideways overflow at ticket 86's phone widths
- [x] Tests cover each section's words reaching the page from the CMS, and hiding one
