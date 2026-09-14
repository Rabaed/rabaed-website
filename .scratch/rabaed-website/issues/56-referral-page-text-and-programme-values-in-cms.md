# 56: The referral page's text, and the Referral Program values, in the CMS

**What to build:** Ahmed changes anything the Referral Program page says, and once a year changes the payout or the client discount in one place — every mention on the site follows, and the CMS warns him until the Referral Terms say the same.

**Blocked by:** 53, 25

**Status:** ready-for-agent

- [ ] Every section's words are read from the CMS, including the hero's three figures and the signup section's own heading, lead, benefits and guarantee
- [ ] Every list is editable: the hero figures, the how-it-works steps, the offer's sides, the audience, the terms summary, the signup benefits
- [ ] The how-it-works steps lay out any number neatly (the Reference site's grid only looked right in fours), and so do the offer's sides and the terms summary (twos); today's counts still match the baselines
- [ ] The signup (`#signup`) and how-it-works (`#how`) cannot be hidden: the hero's buttons land on them. Every other section can be
- [ ] The Referral Program values — the payout and the client discount — are one CMS setting. Page text that quotes them inserts the value rather than typing the number, and changing a value changes every mention: this page, and the FAQ answers that name `{payout}` or `{clientDiscount}` (`src/cms/faq-answer.ts`)
- [ ] While the published Referral Terms do not state the current values, the admin warns on the values, on the Referral Terms and on the dashboard. Publishing is not blocked, and the terms are never rewritten (ADR-0008)
- [ ] Wherever a card or a line has a fixed size, the admin enforces its limit
- [ ] A migration imports the referral page's words and today's values verbatim, and the static copy and `src/content/referral-program.ts` go
- [ ] The referral page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the signup form's fields and wording (tickets 27 and 28), the Referral Terms' own text (ticket 25), the FAQ entries (ticket 22), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The values and their warning were ticket 21's criteria; they sit here because the referral page is where the values are quoted.

**Blocked by 25**, as ticket 21 was: the warning compares the values with the published Referral Terms, which ticket 25 moved into the CMS.

**The search title quotes the payout.** Ticket 26 makes search titles editable. Whichever of the two lands second keeps the payout inserted there rather than typed.

**Parallel sessions.** Touches the referral page's module and components, the FAQ answer reader and a migration of its own, so it can run beside tickets 54, 55, 57 and 59 once ticket 53 is merged.
