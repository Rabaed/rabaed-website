# 36: Accessibility and performance pass

**What to build:** The site works for people using screen readers and keyboards, and loads fast on a mobile connection in Saudi Arabia.

**Blocked by:** 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17

**Status:** ready-for-agent

- [ ] Automated accessibility checks pass on every page
- [ ] Every Screen mock has a meaningful description; every image has `alt` text
- [ ] Every interactive element is reachable and operable by keyboard, with a visible focus state
- [ ] Colour contrast meets the standard, including the muted greys on dark sections
- [ ] No layout shift as images and fonts load
- [ ] Page-speed targets met on a simulated mobile connection
- [ ] No page ships the animation library or code it does not use
- [ ] With reduced motion enabled, every page remains complete and readable

## Comments

**GSAP on pages that move nothing but the header (ticket 14, 13 September 2026).** The header's colour toggle (`src/components/nav-behaviour.tsx`) is built on GSAP's ScrollTrigger, so every page loads GSAP and ScrollTrigger. On the tool page that toggle is the only thing that uses them. The Reference tool page does the same toggle with a plain scroll listener and loads no GSAP at all. The start page loads it for the Trust strip as well, so there it is used twice. Whether the toggle should be rebuilt without GSAP, so that pages like these load none, is this ticket's call: it changes the header on every page, and the spec keeps GSAP as the site's one animation library.
