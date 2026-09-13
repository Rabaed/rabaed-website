# 14: Tool page

**What to build:** The landing page for the free Pour Tracker: why it exists, what it does, how it works, what it requires, the download section and the FAQ, ending with the upsell to Rabaed.

**Blocked by:** 04, 11

**Status:** ready-for-agent

- [ ] All sections match baselines at all eight widths
- [ ] The download form is marked up as a real form with named fields; it starts working in ticket 30
- [ ] The Reference site's validation behaviour is the model: the submit button stays disabled until the form is valid
- [ ] Arabic-Indic numerals render as on the Reference site
- [ ] Phone and email fields keep their left-to-right override inside the right-to-left layout
- [ ] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.
