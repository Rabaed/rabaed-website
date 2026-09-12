# 40: English site switched on — Stage 2

**What to build:** The English version becomes reachable at `/en`, laid out left-to-right, with a switcher that takes a visitor to the same page in the other language and remembers the choice.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] `/en` serves left-to-right layout with `lang` and `dir` set correctly
- [ ] The same stylesheet serves both directions through logical properties; nothing is flipped twice
- [ ] The switcher preserves the current page where a translation exists
- [ ] Where no translation exists, the visitor is told and offered the Arabic version rather than shown a blank page
- [ ] Choice persists between visits but never overrides an explicit URL
- [ ] `hreflang` alternates and per-locale canonical URLs correct
- [ ] Legal pages stay Arabic-only, with the Arabic marked as the binding version
