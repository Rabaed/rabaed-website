# 23: Blog

**What to build:** Ahmed writes an article, previews it, publishes it, and it appears on the blog index and at its own address, ready to be found in search and quoted by AI assistants.

**Blocked by:** 19, 04

**Status:** resolved

- [x] Blog posts hold title, slug, locale, summary, body, author, published date, cover image and an explicit answer-first opening paragraph
- [x] Blog index lists published posts newest first, with paging
- [x] Post pages match the site's design system and shell — the Arabic pages; English pages have no shell until ticket 40 (see below)
- [x] Draft posts are not publicly reachable; preview works before publishing
- [x] Post text is present in the server response with JavaScript disabled
- [x] Posts appear in the sitemap once published
- [x] A post exists per locale; a missing translation offers the available language rather than a blank page

## Comments

**Before merging — nothing new for the founder,** beyond ticket 19's setup. This adds a migration; production applies it on its own build. A separate preview database needs `npm run cms:migrate` against it, as `docs/deployment.md` says, before this pull request's preview can build.

**What was built.**

- **Articles in the CMS** (`src/cms/collections/posts.ts`), under **المدونة / Blog** in the admin. Title, the answer-first opening paragraph, cover image, body, summary, and in the sidebar the slug, language, author and published date. Every one is required to publish; a draft may be unfinished. Drafts, preview and publish work as ticket 19's site settings do.
- **One entry per language.** A translation is its own entry in the other language with the same slug, so `/blog/x` and `/en/blog/x` are the one article, each language drafted and published on its own, and neither ever filled in from the other. Payload's per-field localisation was not used: it shares one draft/publish state across both languages, so publishing the Arabic would publish an empty English.
- **Publishing rules the admin enforces.** The opening answer must be 30 to 60 words (spec: SEO and GEO), counted and reported in Arabic. The slug is lowercase Latin letters, digits and hyphens — an address that survives WhatsApp — unique within a language, and not `page`, which the index's paging uses.
- **The body editor** offers paragraphs, two heading levels (the title is the page's first), bold, italic, both lists, quotes and links to web addresses. No images inside the body and no links to other CMS entries: nothing asked for them, and each needs the page to know how to render it. `@payloadcms/richtext-lexical` is pinned to 3.89.0 with the rest of Payload.
- **Pages.** `/blog` and `/blog/page/2` onwards (nine to a page, newest first); `/blog/<slug>`; the same under `/en`. Built from the site's own pieces — the compact hero, the legal pages' pale ground and reading measure, white cards, the `.tz-more` pill — since the Reference site has no blog. Checked by eye at 1440 and 390 wide: the header turns light over the pale sections, and nothing scrolls sideways.
- **A missing translation** shows a notice with a button to the language that exists, marked `noindex` in production too. An article in neither language is a 404, and so are drafts, `/blog/page/1` (the first page's address is `/blog`) and any page past the last.
- **Publishing rebuilds the site.** Publishing, unpublishing or deleting an article — or saving a draft of a published one — marks every page and the sitemap stale, rebuilt on their next visit. Site settings now share that hook (`src/cms/revalidation.ts`), migration-safe guard included.
- **`sitemap.xml`** lists the Arabic site's pages and every published article in either language.

**Decisions a reader might "fix" back.**

- **English blog pages have no header or footer.** Every label in the shell is Arabic; the English shell is ticket 40's, the same reason `/en` has none.
- **The sitemap's page list is written out.** The blog needed a sitemap to appear in, and one with articles alone would be odd. Ticket 31 owns the sitemap as a whole and may change what it carries — the English index and `/en` are left out until English is switched on.
- **The blog is not in the navigation or footer.** Adding a link changes the shell on every page and so every visual baseline, and the Reference site has none. Where the blog is linked from is the founder's call — see "For the founder".

**Verified by falsification.** The blog's guards were broken on purpose, in two builds, and the tests watched go red:

1. Pages reading drafts, the 30–60 word rule loosened to any length, and the other-language notice removed: the draft test and the unpublish test failed (a draft answering 200), the language test failed (404 where the notice should be), and the publishing-rules test failed (201 for a three-word answer).
2. Publishing no longer rebuilding pages, the sitemap still refreshed: exactly the four tests that wait for a page to change failed; the sitemap test still passed, proving the sitemap is refreshed on its own.

After the review, a test was added for a draft saved over a published article — the case ticket 19 found the first draft test cannot see — with the preview checked to show the draft's text. Full suite on port 3123: 744 passed before the review changes; 745 passed after them and the fix below.

**What the review changed.**

- The article hooks called `revalidatePath` without site settings' guard for writes from outside a request, so a migration publishing an article — ticket 38 may want one — would have thrown. Both now share one hook, guard included.
- The missing-translation notice set `robots` to `noindex, follow`, which replaces the layout's pre-launch `noindex, nofollow, nocache` rather than adding to it (`src/lib/metadata.ts` warns of exactly that). It now keeps the site-wide block.
- A comment claimed the site reads articles through the collection's access rules. The local API skips them; the explicit published filter in `src/cms/blog.ts` is what hides drafts, and the comment now says so.
- An article's address was built by hand in four places; `src/lib/blog-paths.ts` holds it once. The Arabic date markup shared with the legal pages is one component (`src/components/arabic-date.tsx`), and the blog's three heroes one.
- Tests added: an article page loads with no errors and no sideways scroll at 360px; publishing without a cover image or an author is refused.

**A clash the full suite ran into.** After the review changes, one run failed ticket 19's "an editor can invite another editor" with a 403 on its second request. Its trace showed the session lost between two requests: the race `cms.spec.ts` already describes, where two logins to one account in the same instant erase each other's session — now between two suites, since the blog suite signed in as the same test editor from another worker. The first full run had simply not collided. The blog suite now signs in as an editor of its own (`BLOG_EDITOR` in `tests/e2e/cms.ts`), which the test server creates beside the first. A later suite that edits CMS content alongside these should do the same.

**`npm audit`** reports 7 advisories (dompurify, and esbuild through Payload's database adapter). They are the same 7 `main` already has; this ticket adds none.

**For the founder.**

- **The index's one line of copy is new**, since the Reference site has no blog: «مقالات عن إدارة مشاريع الإنشاء في السعودية: المراسلات والطلبات والاعتمادات، وكيف يبقى سجل المشروع واحداً بين المالك والاستشاري والمقاول.» Ahmed should approve or reword it (`src/content/blog.ts`; ticket 21 makes it editable).
- **Where should visitors find the blog?** Nothing links to it yet. A header or footer link is a small change, but it touches every page.

**Not there yet.** Article structured data (ticket 32), Open Graph images (ticket 31), the English shell and switcher (ticket 40), an admin view of which articles lack a translation (ticket 43), and the launch articles themselves (ticket 38).
