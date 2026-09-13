# 15: Referral page

**What to build:** The Referral Program page: how it works, the offer, who qualifies, what is required, the summarised terms, the FAQ, and the signup form with its document uploads.

**Blocked by:** 04, 11

**Status:** ready-for-agent

- [ ] All sections match baselines at all eight widths
- [ ] The SAR 2,000 per project and 10% client discount appear as on the Reference site, and are not repeated in the header menu
- [ ] The signup form is marked up as a real form, including both consent checkboxes and the upload fields
- [ ] Upload fields keep the Reference site's label structure and selected-state styling; wiring happens in ticket 28
- [ ] The hardcoded fake referral code and fake success message are **not** carried over
- [ ] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**The closing steps' wrapping exception is this page's (noted by ticket 11).** The handoff lists `.tail-steps .ph { white-space: normal; min-width: 0 }` among the CSS exceptions that must survive. It exists only on the referral and partnership pages, where each step carries a small `.ph` heading — the home page's closing steps have none, so ticket 11 had nothing to apply it to. Carry the rule over with this page's steps, and comment it in place as a deliberate exception.
