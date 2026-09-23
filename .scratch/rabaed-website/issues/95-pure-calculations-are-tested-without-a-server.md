# 95: Pure calculations are tested directly, without starting the site

**What to build:**
- A test configuration for `tests/unit` that starts no server.
- A wider rule in the spec's Testing Decisions, so that more pure calculations can be tested directly.
- The four forms' shared pipeline checks written once, as a table.

**Why:** the pure modules already exist. Examples:
- `recordAt`, `turnedOver` and `verdictFor` in `src/components/home/*-state.ts`;
- `before-after-seam.ts` and `card-deck-stack.ts`;
- the calculator's Arabic count words (`wordAfter`, `calculatorDisplay`);
- the form rules (`isAcceptable`, `unacceptableFields`, `documentProblem`).

But the spec permits direct tests of only two, the delay-cost formula and the SVG sanitiser. Everything else is reached through a built site. `recordAt` is checked by scrolling the page to a position and reading classes back (`tests/e2e/record-section.ts:24-58`, `home-record.spec.ts` at 498 lines). And `tests/unit` itself runs under `playwright.config.ts`, so even a pure test starts Postgres, runs every migration and builds Next.

`tests/e2e/form-submission.spec.ts` (1,100 lines) also repeats the same pipeline checks for each form: the trap field, refusal, the alert address, stored once, the signed link.

Found by the architecture review of 24 September 2026 (A9, with A11).

**Blocked by:** None.

**Status:** needs-triage — the spec's Testing Decisions are the founder's to change

- [ ] **The founder agrees** to widening "a second, narrow seam … for pure calculation with no I/O" from the two it names to every `*-state` module, the geometry modules and the form definitions' rules. `spec.md` is updated to say so
- [ ] `tests/unit` has its own Playwright configuration with no `webServer`, and `npm test` runs both. A unit run takes seconds
- [ ] The state modules and the form rules are tested directly. Browser tests that existed only to reach them keep one check each that the page is wired to them
- [ ] The four forms' shared pipeline checks run from one table over `FORMS` (`src/forms/registry.ts`), with one browser test per form for its own fields
- [ ] (A11, and can be done alone at any time) `SUBMITTABLE_FORMS` and the separate `FORM_IDS` list are derived from `FORMS`, so a form is listed once
