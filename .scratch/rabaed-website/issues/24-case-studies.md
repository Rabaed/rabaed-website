# 24: Case studies

**What to build:** The place Rabaed's first real client story will live. Built now so publishing it later is an afternoon's writing, not a development job. Hidden until there is something to show.

**Blocked by:** 23

**Status:** resolved

- [x] Case studies hold client, sector, challenge, what changed, outcome, quote, images and an answer-first summary
- [x] The section and its navigation link stay hidden while no case study is published
- [x] Publishing the first entry reveals the section automatically
- [x] No placeholder or sample client appears anywhere in the live site
- [x] Numbers are optional fields: a case study can be published without any, and none are invented

## Comments

**Before merging — nothing new for the founder,** beyond ticket 19's setup. This adds a migration; production applies it on its own build. A separate preview database needs `npm run cms:migrate` against it, as `docs/deployment.md` says, before this pull request's preview can build.

**What was built.**

- **Case studies in the CMS** (`src/cms/collections/case-studies.ts`), under **قصص العملاء / Case studies** in the admin. Title, the answer-first opening paragraph (30 to 60 words, as an article's), client and sector, and the story in three parts — التحدي، ما الذي تغيّر، النتيجة — each required to publish. Then, all optional: a cover image, up to four figures, the client's quote with who said it and their role, and up to six further images. In the sidebar the slug, language, author and published date. Drafts, preview and publish work as the blog's do.
- **Hidden until published.** While no case study is published, `/case-studies` is a 404, no page's header links to it, and the sitemap does not mention it — a saved draft changes none of that. Publishing the first rebuilds every page, so the header gains «قصص العملاء» (between المنتج and ابدأ, in the desktop row and the mobile menu) and the index appears, with nobody touching code. Unpublishing the last hides both again. Each language is its own: the English index stays hidden until a case study is published in English.
- **Nothing is seeded.** The migration creates tables and nothing else; no sample client exists anywhere.
- **Numbers and quotes nobody stands behind cannot be published.** A case study publishes without figures. A figure that is given must say how it was measured, and the page shows that under it. A quote must name who said it, and a name must come with a quote. A case study without figures or a quote shows no heading or empty box where they would be.
- **Pages.** `/case-studies` (every published case study, newest first, on one page — paging can wait for more than a handful) and `/case-studies/<slug>`; the same under `/en`, without a header or footer, as the English blog is. A missing translation offers the other language, as an article does. Built from the blog's pieces; checked by eye at 1440 and 390 wide.
- **The blog's pieces now serve both sections.** `src/cms/editorial-fields.ts` holds what the two collections share (access, drafts, the rebuild hooks, the answer and slug rules, the sidebar fields, the rich text editor); `src/components/editorial.tsx` the frame, hero, other-language notice, date and image; `src/styles/editorial.css` the styles, with the `blog-*` and `post-*` classes renamed `entry-*`. The blog's schema is unchanged: the migration touches case studies only.

**Decisions a reader might "fix" back.**

- **Three story parts instead of one `body`.** The spec lists `body` among the fields; the ticket asks for the challenge, what changed and the outcome. Those three are the body, each under its own heading and each required.
- **The cover image is optional,** unlike an article's: a client's story may have no photograph cleared for use, and it should still be publishable.
- **The case studies suite runs after every other suite** (`playwright.config.ts`). A published case study adds a link to every page's header, and the suites holding the header to the Reference site would see it. It is a teardown project: it starts once the main project has finished, whether or not that passed, and each CI machine runs all of it — about 40 seconds each. Running one spec file from the main project runs it afterwards too; `--no-deps` leaves it out.
- **The mobile menu's height cap rose from 440px to 520px** (`src/styles/shell.css`). With the extra link the menu is 454px tall, and the cap is what `page-shell.spec.ts` warns will need raising the first time a link is added. The case studies suite checks the menu with the link in it, and checks that the desktop row still fits at 981px.
- **English case studies are in the sitemap,** as English articles are; the English index is not, as `/en/blog` is not.
- **«قصص العملاء», not «دراسات الحالة».** `CONTEXT.md` now records the term.

**Verified.** Written test-first. The first runs caught the mobile menu clipping its last 14px with the new link, which is what raised the cap. Full suite on port 3124: 751 passed before the review changes, and 751 after them; 757 after merging `main`, ticket 22's FAQ tests included.

**A clash the full suite ran into.** One run failed before any test started: `FATAL: pre-existing shared memory block is still in use`. A Postgres worker from the previous run on the same port had outlived its server and still held the database's shared memory. Stopping that one process — this checkout's, its parent gone — cleared it. Nothing in the code caused it; the next session to see it can do the same.

**What the review changed.**

- Publishing no longer requires a cover image (above), and a quote's name without the quote itself is refused instead of silently left off the page.
- An odd number of further images leaves no hole in the grid: the last takes the whole row.
- The index's metadata called the cached "is the section showing" check with extra arguments, so it missed the header's cached answer and asked the database again.
- The slug rule's message says «مقالة أخرى» or «قصة أخرى» again, instead of a vaguer word the refactor had put in both.
- Smaller: a clearer name for the published-languages lookup, the sitemap written one kind of entry at a time, test data using the glossary's term.

**Merged with ticket 22.** Ticket 22's FAQ migration reached `main` first, timestamped after this ticket's, so this migration was regenerated on top of it as `20260914_212631_case_studies`, as `docs/agents/parallel-sessions.md` asks. The SQL is unchanged; only the name moved. A database that recorded the first name (`20260914_192933_case_studies`) needs that row renamed, not the tables created again.

**For the founder.**

- **The index's one line of copy is new, and it makes a claim:** «مشاريع إنشاء حقيقية انتقلت فيها الطلبات والاعتمادات إلى سجل واحد بين المالك والاستشاري والمقاول — ما كان التحدي، وما الذي تغيّر، وما النتيجة.» Ahmed should approve or reword it (`src/content/case-studies.ts`) before the first case study is published.
- **The header label «قصص العملاء» and its place** after المنتج are a choice made here; say if another suits better.
- **A case study needs the client's agreement** to be named, and to any quote and photograph used. The admin's field descriptions say so; the CMS cannot check it.

**Not there yet.** Structured data for case studies (ticket 32), their search titles and sharing images (ticket 26), the English shell (ticket 40), and an admin view of what lacks a translation (ticket 43). The Arabic eyebrow above the title is set in DM Mono here as on the blog's pages — ticket 45.
