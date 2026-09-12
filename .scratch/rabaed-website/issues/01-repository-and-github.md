# 01: Repository and GitHub

**What to build:** The project exists in version control, privately, owned by the company rather than a person. Every later ticket is reviewable as a pull request with its own preview link.

**Blocked by:** None (can start immediately). Requires two human steps first: the founder runs `gh auth login`, and creates the `rabaed` GitHub organisation (Free plan).

**Status:** resolved — commit `ab14016` pushed to https://github.com/Rabaed/rabaed-website (private, default branch `main`)

- [x] `git init` with `main` as the default branch
- [x] `.gitignore` covering environment files, dependencies, build output, OS junk and Playwright artefacts
- [x] Everything currently in the working directory committed, including `reference/` in full (see spec: it is the specification, not a leftover)
- [x] Private repository `rabaed-website` created under the `Rabaed` organisation and pushed
- [x] No credential, key or password is present in any committed file
- [x] `CLAUDE.md` added pointing at `AGENTS.md` so future sessions load the project setup
- [x] `.gitattributes` keeps `reference/` byte-identical and out of diffs
