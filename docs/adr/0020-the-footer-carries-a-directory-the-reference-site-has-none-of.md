# The footer carries a directory the Reference site has none of

`reference/` is the specification, and its footer is the same on all nine pages: the wordmark, the tagline and five social icons, then a bar holding a row of two links — Terms and Privacy — and the rights line. It has no columns.

That footer left pages reachable from nowhere. The blog was linked from no page of the site: ticket 23 left it out of the header until the founder chose where to link it from. The Pour Tracker page was reached only from a teaser on the start page, and the Referral Terms only from the referral page. The header cannot take them: it is full at the words it launched with (ADR-0015, `src/cms/globals/site-words.ts`), with 62px left at its narrowest row.

**So the footer carries a Footer directory** (CONTEXT.md): four columns of links through which every page of the Marketing site can be reached, between the social icons and the bar.

| Column | Links, in order |
|---|---|
| ربائد · Rabaed | Home, Product, Get started, Pour Tracker |
| البرامج · Programs | Referral Program, Partnership Program |
| المصادر · Resources | Blog, Customer stories |
| قانوني · Legal | Terms and conditions, Privacy policy, Referral Terms |

The founder chose this on 23 September 2026 (ticket 75), asking for "the sitemap at the end of the website". It is not the sitemap: that is `/sitemap.xml`, the file search engines read, and the two are kept apart in code, CMS labels and tests.

- **The directory lists pages, not their contents.** The Blog and Customer stories index pages are in it; individual articles and case studies are not.
- **It is an Editor's.** The columns and their links are CMS content, in the Site-wide words entry's Footer tab: up to 4 columns, each a heading and up to 6 links, each link a label and a path — so a page added later can be linked without a developer, which is what the founder asked of every menu and footer link. The CMS refuses a fifth column and a seventh link. Four is what the widest footer lays out side by side, and six is two more than the fullest column the site launched with.
- **Customer stories hides itself.** A link whose path is the Customer stories index is not drawn while its language has no published case study, by the same check the header's link uses, so an Editor never has to remember the rule. A column left with no links is not drawn at all.
- **English Legal links go straight to the Arabic.** Terms, Privacy and the Referral Terms are Arabic only and never translated. On an English page their links lead to the Arabic document, are marked `hreflang="ar"`, and say so in their words: "Terms and conditions (Arabic)". The founder chose that over leading to the English address that only says the page is Arabic: one tap fewer, and the label is honest. Which pages this applies to is the code's list of Arabic-only pages (`src/content/arabic-only-pages.ts`), not an Editor's setting.
- **The Reference site's two legal links are the Legal column now**, and the bar under the directory holds the rights line alone. The migration that made the directory moved the two rows an Editor may already have edited into that column as they were, so nothing written was lost.
- **Two columns by two below 981px** — Rabaed and Programmes on top, Resources and Legal below — and four side by side above.

## Consequences

- **Everything the Reference site's footer had above the directory is unchanged**, and still held to it: `tests/e2e/shell-matches-reference.spec.ts` measures the wordmark, the tagline and the icons from the footer's top at every width, exactly as before.
- **The comparisons give up what the directory is bound to change, by name, and nothing else**, following ADR-0013 and ADR-0015:
  - `shell-matches-reference.spec.ts` gives up the footer's height; the bar's top and height, since it no longer holds the link row; and the rights line's row, which was the link row's — centred beside it on a wide screen, wrapped under it on a phone. The bar's width, rule and colours and the rights line's height are still held. The link row itself is no longer measured: it is the Legal column.
  - `home-whole-page-matches-reference.spec.ts` holds the footer to exactly the height it should have: the Reference site's, plus the directory, less the row it replaced.
  - The directory is compared against nothing, having nothing to compare against. `tests/e2e/site-words.spec.ts` holds it instead: its columns and links in both languages, the CMS's limits, and the two-by-two phone layout.
- **The rights line keeps its place at the end of the bar** on a wide screen, where it sat after the link row, rather than moving to the start once it is alone there.
- **Every page is taller** by the directory: 169px on a wide screen, and 270px on a phone, where the columns stack two by two.
- **The English directory waits for the founder** with the rest of the English site words (ticket 40): an English page draws no footer until those are published in English. The migration writes the English into every version of the entry, the published one included, because it cannot know whether the founder has published the English already. If they have not, which was so when this was written, the words are read by nobody until they do. If they have, the directory's English reaches English pages as soon as the migration runs, since the only alternative is columns of blank links. That is why the founder reads both languages in the pull request's preview before it merges.
