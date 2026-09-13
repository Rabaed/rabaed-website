# 16: Partnership page

**What to build:** The Partnership Program page for engineering offices and project management companies: the idea, who it is for, the partnership modes, benefits, the path to joining, the FAQ, and the application form.

**Blocked by:** 04, 11

**Status:** ready-for-agent

- [ ] All sections match baselines at all eight widths
- [ ] The application form is marked up as a real form with all its fields, including the commercial registration upload
- [ ] No fake success behaviour is carried over
- [ ] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**The closing steps' wrapping exception is this page's (noted by ticket 11).** The handoff lists `.tail-steps .ph { white-space: normal; min-width: 0 }` among the CSS exceptions that must survive. It exists only on the referral and partnership pages, where each step carries a small `.ph` heading — the home page's closing steps have none, so ticket 11 had nothing to apply it to. Carry the rule over with this page's steps, and comment it in place as a deliberate exception.
