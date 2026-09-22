# 43: English blog and case studies — Stage 2

**What to build:** The published articles and any case studies available in English, with the admin making it obvious what still needs translating.

**Blocked by:** 23, 40 — and 41 for the English launch articles alone, whose covers are ticket 41's English Screen mocks (the founder's call, 22 September 2026)

**Status:** ready-for-agent — part 1 done (the admin view, and the English data and sitemap held by tests); the English launch articles wait for ticket 41

- [ ] Launch articles translated and published in English
- [x] Case studies translated where any are published
- [x] The admin shows at a glance which entries are missing a translation, so the English section cannot silently fall behind
- [x] The blog index per locale lists only entries available in that locale
- [x] English entries carry their own structured data and sitemap entries
- [ ] Translations are reviewed by Ahmed before publishing

## Comments

**Part 1, 22 September 2026, branch `ticket-43`.** Four of the six boxes.

- **The admin shows what is missing.** A Translation column on the Blog and
  Case studies lists, and the same in each entry's sidebar: *Missing*, *Draft
  only* or *Published*, for the entry at the same slug in the other language.
  Worked out on each read and never stored — a translation is only the entry
  sharing the slug, so there is nothing to keep in step and no migration — and
  only for a signed-in reader. `translationField` in
  `src/cms/editorial-fields.ts`; held by a test in each suite.
- **Each language's index lists its own** was already true (ticket 23), and
  already held, in both directions, by «an article exists per language».
- **English entries' own data and sitemap entries** were already built by
  tickets 23 and 24 and are now held: an English article's `BlogPosting` says
  `inLanguage: en` at its English address, an English case study's breadcrumb
  runs through `/en`, and both are in the sitemap beside the Arabic. The English
  *indexes* are still left out of the sitemap on purpose — «the English index
  waits for English» (`src/app/sitemap.ts`) — which is the English site's
  launch, not this ticket.
- **Case studies:** none is published, and none is seeded — the first is a real
  one — so there is nothing to translate yet. When Ahmed publishes the first,
  the Translation column is what shows its English is missing.

**Part 2, the six launch articles in English, is written and waiting** on
branch `ticket-43-articles`: `src/migrations/english-launch-articles/articles.ts`,
translated from the Arabic as drafted on 21 September, every answer 55 to 59
words. It is not imported yet. The founder chose English covers — ticket 41's
English Screen mocks, with English descriptions — over reusing the Arabic
ones, so the migration that loads the six as drafts is written once ticket 41
is on `main`. Then, as for the Arabic: drafts with the author empty, for Ahmed
to review and sign (the sixth box), each linking to the English address of the
page it names.

Two things for whoever takes part 2:

- **Frozen SQL from the start**: `docs/deployment.md`, «What a data migration
  may and may not do» — write it through the local API, add it to `IMPORTS`,
  freeze, swap; the covers stay `payload.create` and are found by file name.
- **An Arabic article Ahmed corrects while reviewing wants the same correction
  in its English.** The Translation column says an English one exists, not that
  the two still agree.
