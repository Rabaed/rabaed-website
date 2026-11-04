# 104: Download PDF in the header gives the Profile PDF for the visitor's language and screen

**What to build:** the header's extra button on the Company profile, and the four Profile PDFs (spec: Header and footer; Profile PDFs). It also makes the header's "Book a live demo" go to the home page's form on this page.

**Blocked by:** 102 (the page has to exist).

**Lane:** 1b

**Status:** ready-for-agent

- [ ] The site header (`src/components/site-nav.tsx`, through `page-shell.tsx`) can carry a page's own extra button. Only the Company profile uses it. Every other page's header is unchanged to the pixel
- [ ] On the Company profile, a «تنزيل PDF» / "Download PDF" button sits beside Sign in, on the desktop bar and in the phone panel. Its label is an Editor's
- [ ] It gives one of four Profile PDFs: the page's language decides the pair. A screen 980px wide or less gets the phone version, and the choice follows the screen as it changes. Without JavaScript it gives the desktop version
- [ ] The four files are Ahmed's (`PDF/` in his folder), kept in `public/profile/pdf/` as defaults. An Editor can replace each in the CMS, and the replacement is what downloads next. The file downloads under its own name
- [ ] On the Company profile the header's "Book a live demo" goes to `/#demo` (`/en#demo`). Elsewhere it is unchanged
- [ ] On the Company profile the header follows the section beneath it: dark over a dark section, light over a light one, all the way down (`src/components/nav-behaviour.tsx`, `useHeaderColourToggle`). Every other page keeps today's rule, light from the first light section until the footer, and a test shows it unchanged on the home page. The founder's decision, 4 November 2026
- [ ] Tests cover Arabic and English × 1280px and 390px, the change at 981px, the download itself, a replacement, and that no other page shows the button
- [ ] Claims `src/components/site-nav.tsx` and `src/components/page-shell.tsx` in `claims.md` before changing them
