# 01: Repository and GitHub

**What to build:** The project exists in version control, privately, owned by the company rather than a person. Every later ticket is reviewable as a pull request with its own preview link.

**Blocked by:** None (can start immediately). Requires two human steps first: the founder runs `gh auth login`, and creates the `rabaed` GitHub organisation (Free plan).

**Status:** ready-for-agent

- [ ] `git init` with `main` as the default branch
- [ ] `.gitignore` covering environment files, dependencies, build output, OS junk and Playwright artefacts
- [ ] Everything currently in the working directory committed, including `reference/` in full (see spec: it is the specification, not a leftover)
- [ ] Private repository `rabaed-website` created under the `rabaed` organisation and pushed
- [ ] No credential, key or password is present in any committed file
- [ ] `CLAUDE.md` added pointing at `AGENTS.md` so future sessions load the project setup
