# 56: The referral page's text, and the Referral Program values, in the CMS

**What to build:** Ahmed changes anything the Referral Program page says, and once a year changes the payout or the client discount in one place — every mention on the site follows, and the CMS warns him until the Referral Terms say the same.

**Blocked by:** 53, 25

**Status:** resolved

- [x] Every section's words are read from the CMS, including the hero's three figures and the signup section's own heading, lead, benefits and guarantee
- [x] Every list is editable: the hero figures, the how-it-works steps, the offer's sides, the audience, the terms summary, the signup benefits
- [x] The how-it-works steps lay out any number neatly (the Reference site's grid only looked right in fours), and so do the offer's sides and the terms summary (twos); today's counts still match the baselines
- [x] The signup (`#signup`) and how-it-works (`#how`) cannot be hidden: the hero's buttons land on them. Every other section can be
- [x] The Referral Program values — the payout and the client discount — are one CMS setting. Page text that quotes them inserts the value rather than typing the number, and changing a value changes every mention: this page, and the FAQ answers that name `{payout}` or `{clientDiscount}` (`src/cms/faq-answer.ts`)
- [x] While the published Referral Terms do not state the current values, the admin warns on the values, on the Referral Terms and on the dashboard. Publishing is not blocked, and the terms are never rewritten (ADR-0008)
- [x] Wherever a card or a line has a fixed size, the admin enforces its limit
- [x] A migration imports the referral page's words and today's values verbatim, and the static copy and `src/content/referral-program.ts` go
- [x] The referral page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the signup form's fields and wording (tickets 27 and 28), the Referral Terms' own text (ticket 25), the FAQ entries (ticket 22), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The values and their warning were ticket 21's criteria; they sit here because the referral page is where the values are quoted.

**Blocked by 25**, as ticket 21 was: the warning compares the values with the published Referral Terms, which ticket 25 moved into the CMS.

**The search title quotes the payout.** Ticket 26 makes search titles editable. Whichever of the two lands second keeps the payout inserted there rather than typed.

**Decided while building (15 September 2026).**

- **Every word on the referral page may name a value**, not only the ones that quote one today, and a name in braces the site does not hold is refused anywhere on the page, as in an FAQ answer. `src/cms/referral-program-values.ts` holds the names, the formatting and the check against the terms; `src/cms/referral-program.ts` reads the values for the site, the draft ones in a preview.
- **The warning compares the published values with the published Referral Terms.** A draft of the values neither warns nor clears a warning. The terms are read for the figures — Latin or Arabic-Indic digits, with or without thousands separators, and the discount followed by «%» or «٪» — so an amount written out only in words is not recognised, and any matching percentage counts as the discount; `docs/deployment.md` tells Editors both.
- **A figure's numerals are set in DM Mono by the page**, not marked by the Editor: «{payout} ريال» draws as the Reference site's `<span class="mono">2,000</span> ريال`, and so does the signup's «7 أيام عمل» (`numeralsInMono` in `src/components/inline-text.tsx`).
- **A bold phrase inside a sentence is three fields** — the text, then the bold, then the rest — for the offer's paragraphs and the audience's note on the Partnership Program; the page puts a space either side of the bold. A term's rest follows its bold opening after a space unless it begins with a comma, a full stop, a colon or a semicolon.
- **The hero has no switch either**, though no link lands on it: it holds the page's only heading, as on the start and tool pages (`src/content/pages/page-content.ts`).
- **The test that changes a value publishes it**, since the warning and every mention only follow a published value. It runs in the Playwright project that runs after everything else, beside the case studies suite, renamed from `case-studies` to `runs-last` (`playwright.config.ts`).
- **The terms summary lays out any number in its two columns** as a list does, the last of an odd number beside an empty half; the offer's sides take the product page's strip layout, the last of an odd number across the whole row.
- **The schema migration was trimmed by hand.** The newest schema snapshot on `main` was the tool page's, generated before ticket 57 merged, so `cms:migration` also wrote the product page's, the closing section's and the Screen mocks' tables again. Those statements were removed from `20260915_200327_referral_page_and_program_values.ts`; its snapshot is the whole schema, so the next ticket's migration starts from a complete one.

**Parallel sessions.** Touches the referral page's module and components, the FAQ answer reader and a migration of its own, so it can run beside tickets 54, 55, 57 and 59 once ticket 53 is merged. Every one of tickets 53–59 adds a CMS migration, and two branches' migrations collide: after updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).

**Marked resolved on 20 September 2026, after the fact.** The work merged in pull request #38 on 15 September, but this file was never updated: the branch carried the code and not the bookkeeping, and the tracker went on saying `ready-for-agent` for five days. Ticket 35 is blocked by this one, so on paper it could not start.

Checked against `main` before ticking, one box at a time: `src/cms/globals/referral-page.ts` and `referral-program.ts`, the content module `src/content/pages/referral.ts`, the values inserted into FAQ answers through `src/cms/faq-answer.ts`, the admin's warning in `src/cms/components/referral-terms-warning.tsx`, the migrations `20260915_200327` and `20260915_200328`, and the two suites `referral-page-text.spec.ts` and `referral-program-values.spec.ts`. `src/content/referral-program.ts` is gone, as the last box asked.

**Worth doing differently:** a ticket's boxes are ticked in the branch that does the work, as tickets 20, 58 and 59 did, rather than in a pull request of their own afterwards.
