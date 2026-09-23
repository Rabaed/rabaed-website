# 93: A marketing page is one module in both languages, and its route files are one line

**What to build:** marketing pages shaped the way the blog and case study routes already are. One module decides, for a page and a locale, its metadata, what it renders, and "the English page, or the notice that it is not in English yet". Each route file under `src/app/(ar)` and `src/app/(en)/en` becomes a one-line call to it.

**Why:** the route files differ only in the page's name (`src/app/(ar)/{,product,start,tool,referral,partnership}/page.tsx` and the five under `(en)/en`), and each changed 12–17 times in six weeks, because every change that crosses pages is made in each of them: ticket 42 edited all 13 (ed29b95), and tickets 22, 32 and 59 went through every one. They have already drifted. The Arabic home page always offers both languages (`LOCALE_CODES`), while the other Arabic pages offer English only once it is published (`publishedLocales`). The blog and case study routes avoid all this: their route files are 11 lines, and their component module owns the rest.

Found by the architecture review of 24 September 2026 (A3).

**Blocked by:** 92 (this reads the registry).

**Status:** ready-for-agent

- [ ] One module per marketing page, or one for all of them, takes a locale and gives the metadata, the page and the English-or-notice decision
- [ ] Every marketing route file, in both languages, is a one-line call to it
- [ ] The Arabic and English pages cannot choose their languages differently: the home page's `LOCALE_CODES` and the others' `publishedLocales` become one rule, or the one exception is stated in the module with its reason (see `src/app/(ar)/page.tsx`'s comment)
- [ ] Nothing a visitor sees or a search engine reads changes: the full suite is green, and the Reference comparisons unchanged
