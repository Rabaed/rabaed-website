# 43: English blog and case studies — Stage 2

**What to build:** The published articles and any case studies available in English, with the admin making it obvious what still needs translating.

**Blocked by:** 23, 40, 41

**Status:** ready-for-human — the six English launch articles wait in the CMS as drafts, covers and all; publishing them is the founder's, see below

- [ ] Launch articles translated and published in English
- [ ] Case studies translated where any are published
- [x] The admin shows at a glance which entries are missing a translation, so the English section cannot silently fall behind
- [x] The blog index per locale lists only entries available in that locale
- [x] English entries carry their own structured data and sitemap entries
- [ ] Translations are reviewed by Ahmed before publishing

## Comments

**Why 41 is on the Blocked-by line.** Only the English launch articles need it:
their covers are ticket 41's English Screen mocks, the founder's call on 22
September 2026 over reusing the Arabic ones. Everything else here is done
(below), so what is left is exactly what 41 blocks.

**Part 1, 22 September 2026, branch `ticket-43`.** Three of the six boxes.

- **The admin shows what is missing.** A Translation column on the Blog and
  Case studies lists, and the same in each entry's sidebar: *Missing*, *Draft
  only* or *Published*, for the entry at the same slug in the other language.
  Worked out on each read and never stored — a translation is only the entry
  sharing the slug, so there is nothing to keep in step and no migration — and
  only for a signed-in reader. `translationField` in
  `src/cms/editorial-fields.ts`; held by a test in each suite. Two limits: a
  field worked out on read cannot be sorted or filtered by, so "everything
  missing" is read down the column, not asked for; and it is a default column,
  so an Editor who has already chosen their own columns adds it from the
  Columns menu once.
- **Each language's index lists its own** was already true (ticket 23), and
  already held, in both directions, by «an article exists per language».
- **English entries' own data and sitemap entries** were already built by
  tickets 23 and 24 and are now held: an English article's `BlogPosting` says
  `inLanguage: en` at its English address, an English case study's breadcrumb
  runs through `/en`, and both are in the sitemap beside the Arabic.
- **The English indexes join the sitemap** once each has something published in
  English — `/en/blog` with the first English article, `/en/case-studies` with
  the first English case study — as the Arabic case studies index does. Until
  this ticket they waited «for English», and no ticket held the day English
  arrived.
- **Case studies: the box stays open.** None is published and none is seeded —
  the first is a real one — so there is nothing to translate yet, and ticking
  it would be true only for want of anything to check. When Ahmed publishes the
  first, the Translation column shows its English missing.

**Part 2, the six launch articles in English, is written and waiting** on
branch `t43-english-articles`: `src/migrations/english-launch-articles/articles.ts`,
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

**Part 2, 23 September 2026: the six in English, loaded as drafts.** Ticket 41's
English Screen mocks merged, so `20260923_130000_import_english_launch_articles`
puts each article into the CMS in English at its Arabic's slug — a draft with
the author empty, dated the day it was translated, its cover the English
Screen mock of the same screen, uploaded as `<screen>-en.webp` and described in
ticket 41's English words.

- **Written to the data-migration rule, but not by the freezer.** The Arabic
  articles already fill the posts tables, which `cms:freeze-seed` refuses, and
  the ids it would freeze could already belong to an Editor's own posts on
  production. So `english-launch-articles/seed.ts` builds the statements from
  the words, as tickets 35, 40 and 41 built theirs: every post takes the next id
  there is, its version is copied from it, its cover is found by name, and an
  article already written in English at its slug is left alone — no draft, no
  cover.
- **Held by** `launch-articles.spec.ts` (each English draft: its gate, its own
  cover, its opening answer, its words, every link to an English page or the
  Terms, and no visitor reaching it) and `data-migrations.spec.ts` (the seed
  writes every word of `articles.ts`; the only Payload call is the uploads).
  `npm run cms:migrate-fresh` runs the chain from nothing.

**What is left is the founder's**, the three open boxes: publishing the English
articles (the founder published one of the Arabic as a trial on 23 September,
and its English follows once this is deployed), Ahmed's review, and case studies
once one is published.
