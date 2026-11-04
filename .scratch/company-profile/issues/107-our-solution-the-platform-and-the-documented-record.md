# 107: Our solution, the platform and the documented Record on the Company profile

**What to build:** Ahmed's sections 06–08 in the site's style (spec: Sections, in order).

**Blocked by:** 102 (the page has to exist).

**Lane:** 2a

**Status:** ready-for-agent

- [ ] 06 Our solution (`#parties`): the lead, the three party cards (Owner, Consultant, Contractor, with what each wants) and the documented Record at their centre
- [ ] 07 The platform (`#platform`): four tabs (correspondence, approvals = kanban, daily site report, documents), keyboard-operable with RTL-aware arrows. Each shows **the site's Screen mock** of that screen through `ScreenMockPicture`, with its Phone crop at phone widths. Each tab's name and text are an Editor's. The output line sits beneath
- [ ] 08 The documented Record (`#record`): Ahmed's illustrative timeline card (LTR-088, four steps with names and times, «مثال توضيحي»), with every step's words an Editor's
- [ ] Each section has a show switch, and the words are seeded from `../source/*.json`
- [ ] Every size, font and colour is from the site's tokens and type. No sideways overflow at ticket 86's phone widths
- [ ] Tests cover the tabs switching, by click and by keyboard, the Screen mocks with their Phone crops, and words reaching the page from the CMS
