# The Arabic webfont still swaps, and a metric-matched stand-in holds its place

Ticket 36 asks that nothing move as a page loads. Measured on a phone-width window, every page moved: between 0.003 and 0.12, where the Core Web Vitals stop calling layout shift "good" at 0.1. The cause was the same everywhere and had nothing to do with pictures. The system Arabic face a reader sees for the first few hundred milliseconds is about 9% wider than IBM Plex Sans Arabic, so a hero's lead takes a line — on the partnership page, two lines — more than it is about to take, and when the webfont lands the whole page jumps up behind it.

Two ways out were tried and measured, and both were rejected.

**`font-display: optional`** removes the shift completely, because it never swaps: the browser gives the face 100ms and then keeps the fallback for the rest of that page view. It was tried, and the cost turned out to be far larger than it reads. Chromium will not hold up the first paint for a face it has not already cached, so at full speed on a local machine the Arabic still rendered in the system face — which means **the brand typeface is missing from the first page view of every new visitor**, not only a slow one. It also stopped the rebuild matching the Reference site, which fourteen spec files compare against, and the eight Screen mock exports with it.

**`font-display: block`** was measured too, and it does not do what it sounds like it does: only the letters are hidden during the block period, the layout is still laid out in the fallback's metrics, so the reflow happens exactly as before. Every page's shift was unchanged, and the largest contentful paint went from under 2.5s to 3.3s.

So the site keeps **`font-display: swap`** — every visitor sees the brand face on every page view — and the reflow is taken out at its source instead. `tokens.css` declares two stand-in families ahead of the system stack, each pinned with `local()` to faces whose width was measured against IBM Plex Sans Arabic over twelve lines of the site's own Arabic, and narrowed or widened with `size-adjust` to match: 92% for the desktop faces, 113% for Noto. The stand-in wraps where the real face wraps, so the swap moves nothing.

This was the founder's decision on 21 September 2026, after the `optional` measurement corrected what they had first been told it cost.

## Consequences

- Every page now measures between 0.001 and 0.053, most under 0.005, against 0.003 to 0.12 before. `tests/e2e/performance.spec.ts` holds the site to 0.06.
- **The match is an estimate, not an identity.** Across twelve real lines the ratio ranged from 0.88 to 0.94; 92% is its median. A paragraph whose width falls near a wrapping point can still change line, which is what the pages still measuring 0.03 to 0.05 are.
- **A system with none of the named faces falls through unadjusted**, to the stack that was there before, and is no worse off than it was. That also means the number this measures depends on which Arabic face the machine running it has, which is why the budget is one figure for the whole site rather than a ratchet per page.
- `fonts.css` — the sheet that answers the Reference site's Google Fonts requests during the baseline capture (ticket 02) — is untouched and keeps `swap`, because that is what Google serves. Only `site-fonts.css` is the site's own.
- No `<link rel=preload>` for the faces. The build gives each file a content-hashed address that nothing can name ahead of time, and moving them somewhere with a stable address would cost them their immutable caching and break the baseline capture, which reads them from `assets/fonts/`. It remains the obvious next improvement if the swap window ever needs shortening.
