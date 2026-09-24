# 87: Bug — the case studies link shows before the first story if an Editor ends its path with «/»

**What is wrong:** the header and the Footer directory hide the case studies link until the first story is published in that language (`shownWith`, `src/content/site-words.ts:79-82`). It recognises the link by comparing its path exactly with `CASE_STUDIES_PATH`. The link's path is an Editor's to type, and `site-words.ts:140` shows paths may end in a slash — so `/case-studies/` slips past the filter, and the menu leads to a page that is not there yet.

Found by the architecture review of 24 September 2026 (L7).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] The link is recognised however its path is written: with or without a trailing slash, and in English at `/en/case-studies` as well
- [x] A test publishes the header's link as `/case-studies/` with no story published and finds no case studies link, then publishes a story and finds it
- [x] Either the CMS normalises the paths Editors type in the menu and footer, or the comparison does; the ticket says which, and why

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The comparison normalises, not the CMS.** `pageOf` in `src/content/site-words.ts` reads a typed path for the page it leads to. It takes off:
>   - the spaces around it, which the CMS checks without but saves;
>   - a run of slashes, which the CMS accepts (`SITE_PATH`);
>   - a slash at the end;
>   - a language written in front, which is the one each link is given anyway, since the menu's paths are shared by both languages.
>
>   Why the comparison rather than the CMS: what an Editor typed stays what they see, the paths already saved need no migration, and one function covers the header, the Footer directory and anything added later.
> - **Where `pageOf` is used:**
>   - `shownWith`, the case studies filter, in the header and the Footer directory alike;
>   - `href`, where a link leads, so `/en/case-studies` on an English page is `/en/case-studies`, not `/en/en/case-studies`;
>   - `directoryLink`'s check for the Arabic-only legal pages, which had its own trailing-slash rule;
>   - the `path` the header and footer hand on, so the menu marks the current page whichever way its path was typed.
>
>   One behaviour goes with it: a path written `/en/…` no longer sends the Arabic menu to an English page. The menu's paths are shared by both languages, and the language switcher is what changes language.
> - **The test** is in `case-studies.spec.ts`, on the second test server (ticket 89). It publishes every case studies link, in the header and the Footer directory, four ways: `/en/case-studies`, `/en//case-studies`, ` /case-studies` and `/case-studies/`. With nothing published, the home page leads nowhere near the section. After the first case study, it leads to `/case-studies` all four ways.
>   - Since the link is hidden either way, each publish carries a footer tagline of its own, and the test waits for that to reach the page.
>   - It was red before the fix, with the link showing as `/en/case-studies` with nothing published.
>   - It was red again with the doubled-slash handling taken out, which the code review found would otherwise have led `/en//case-studies` off the site to `//case-studies`.
> - **Code review** (standards and spec, 24 September 2026):
>   - Taken:
>     - a doubled slash, a space and a repeated language are read too;
>     - the header and the Footer directory hand on the same kind of path;
>     - the test rewrites the Footer directory's link as well as the header's, so its last step cannot pass on a link it never changed;
>     - it ends on `/case-studies/`, the spelling the ticket names.
>   - Left: the test's `sendable` is the helper five other suites call `fields`; this suite already has a `fields` of its own.
