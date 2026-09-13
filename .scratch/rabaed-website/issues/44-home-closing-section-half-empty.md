# 44: Bug — the home page's closing section is half empty

**What is wrong:** On the home page at 981px and above, the closing section (`#tail`, «كيف نبدأ معك») shows its three steps in the right-hand column and nothing at all in the left. Half the section is blank. On a phone it is fine — the grid is a single column below 981px — so this is a desktop-only defect.

**Reported by:** the founder, 12 September 2026, on reviewing ticket 04. Agreed to be fixed later rather than to hold ticket 04.

**Blocked by:** nothing.

**Status:** resolved

## Why it happens

`.tail-grid` is `grid-template-columns: 1fr 1fr` — the Reference site's own rule. On the Reference site the second column holds the demo request form. Ticket 04 built the section without the form, because forms are ticket 27 and the home page's closing block is ticket 11, so the second column is empty.

`src/app/(ar)/page.tsx` renders the section; `.tail-grid` is in `src/styles/shell.css`.

## Two ways to fix it, and they are not equivalent

1. **Let the column collapse until there is something to put in it.** Render the closing section as a single column while it holds one child, and restore the two-column grid when the form arrives. Small, and it makes the page look finished at every point in the build.
2. **Do nothing, and let ticket 11 close this.** Ticket 11 puts the demo form in that column, which fixes the appearance as a side effect.

Prefer (1) if the site is being shown to anyone before ticket 11 lands, which is likely now that Vercel previews exist. Prefer (2) if ticket 11 is imminent, since (1) is then work that is immediately undone.

**Close this as already-fixed if ticket 11 lands first.** Check before starting.

## Done when

- [x] No empty column in the home page's closing section at 981px and above
- [x] The section still matches the Reference site once its second column has content
- [x] Nothing changes below 981px, where the grid is already a single column

## Comments

**Closed by ticket 11, which landed first — fix (2).** The demo request form now fills the second column. `tests/e2e/home-faq-and-closing.spec.ts` holds it: the form sits beside the steps at 1280px, and below them at 980px. `home-faq-and-closing-match-reference.spec.ts` compares the whole section with the Reference site at all sixteen baseline viewports, 1024px and wider among them.
