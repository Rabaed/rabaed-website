# 19: CMS foundation

**What to build:** Ahmed logs into an admin area on Rabaed's own domain, changes the contact details and social links, and sees them change on the live site.

**Blocked by:** 03

**Status:** resolved — the pull request must not be merged until the founder's Supabase setup is done (see "Before merging" below)

- [x] Payload CMS mounted inside the same Next.js application, at a non-obvious admin path — `/maktab`
- [ ] Content stored in Supabase Postgres; media in Supabase Storage (ADR-0004) — **wired, not yet exercised**: no Supabase project exists yet. Content is Postgres everywhere; locally and in tests it is a real Postgres the scripts start themselves. Storage goes to a Supabase bucket whenever the five `S3_*` variables are set, and to local disk otherwise
- [x] Access is invitation-only; no public sign-up
- [x] Admin interface available in Arabic
- [x] Site settings global: contact details, WhatsApp number, social links — driving the footer and contact points on every page
- [x] Uploaded images are converted to modern formats and multiple sizes automatically
- [x] Draft and publish states work, with preview before publishing
- [x] An edit made in the admin appears on the page; an unpublished draft does not

## Comments

**Before merging — founder action.** Every Vercel build now reads the database, so a deployment without the CMS credentials fails to build and says which variable is missing. Merging before the setup therefore stops production deployments for every ticket. The steps, in plain language, are in `docs/deployment.md` under "The CMS": create a Supabase project, a public `media` bucket and an S3 access key; put `DATABASE_URL`, `PAYLOAD_SECRET` and the five `S3_*` values into Vercel; run the migrations and create Ahmed's account from the command line. A second Supabase project for previews is recommended, so trying out a pull request can never change the live site's content.

A silent fallback — building without a database and showing the old hard-coded footer — was rejected: a site that deploys "successfully" with none of its content editable is the failure nobody notices.

**What was built.**

- **Payload 3.89 inside the site.** Its own route group `src/app/(payload)/` with its own root layout, next to `(ar)` and `(en)`, so the admin's document and styles never meet the site's. The admin is at `/maktab`; `/admin` is a 404. The REST API is at `/api`; GraphQL is switched off because nothing uses it. Both paths always carry `X-Robots-Tag: noindex`, before and after launch.
- **Site settings** (`src/cms/globals/site-settings.ts`): WhatsApp number, contact email and phone, and the four social accounts, labelled in Arabic and English, validated (international number, `https://` links), with drafts. Every page's footer reads them through `src/cms/contact-points.ts`. An account nobody has supplied keeps the Reference site's `#`. The email and phone render nowhere yet — the Reference site's shell shows neither; they are there for the forms in ticket 27. The legal pages' own `mailto:`/`tel:` links are untouched: that text is verbatim and belongs to ticket 25.
- **Publishing.** Pages stay prerendered (the build table still shows every page as static). Publishing site settings marks every page stale and each is rebuilt on its next visit; saving a draft changes nothing visitors see. The first data migration publishes the Reference site's number, so every new database starts with the footer the site already had.
- **Preview.** The Preview button opens `/api/preview`, which checks the editor's own login — no shared secret to leak, since the CMS is the site — turns on Next's draft mode and redirects to a path resolved the way a browser would, refused unless it stays on this site. Pages then show saved drafts, with a banner and a button to leave.
- **Accounts.** No self sign-up. While the users table is empty, Payload offers "create first user" to whoever finds the admin, and that operation skips access rules by design — on a fresh production database the first stranger to arrive would own the site. A hook refuses any account creation with nobody signed in unless it comes from `npm run cms:create-editor`. Editors invite each other from the admin. Five wrong passwords lock an account for 15 minutes.
- **Images** (`src/cms/collections/media.ts`): stored as WebP, with 480, 960 and 1600-wide copies, never enlarged; a description for screen readers is required. SVG is not accepted — served from the site's domain it could run script; ticket 20 decides that with a sanitiser if logos need it.
- **Databases without Docker.** `embedded-postgres` runs a real Postgres from an npm package. `npm test` gets a throwaway one per run (`scripts/test-server.mjs`: migrate, create the test editor, build, start); `npm run dev` gets a persistent one in `.data/postgres` (`scripts/with-database.mjs`), unless `DATABASE_URL` is set. Ports are derived from `TEST_PORT` and from the checkout's path, so parallel worktrees never share one. The package only publishes `-beta` versions; it is pinned exactly.
- **Migrations everywhere**, development included, so the schema developers build against is the schema production gets. Production's build applies them itself (`scripts/migrate-production.mjs`); preview builds never do.

**Verified by falsification.** Every CMS guard was broken on purpose and its test watched go red, in two builds:

1. Pages reading drafts, WebP conversion removed, Arabic removed from the admin: exactly the two draft tests, the image test and the language test failed, each on the broken behaviour (the draft number on the page, `image/png`, `lang="en"`).
2. Publishing no longer refreshing pages: exactly the four tests that publish failed.

The first draft test on its own could not catch pages reading drafts — nothing rebuilds a page after a draft alone is saved — so a second one publishes a value, saves a different draft straight after, and checks what the rebuilt page shows. That is the test that caught it.

The sign-up hook matters only on an empty users table, which the test database never has. It was checked by hand against the built site on a freshly migrated, account-less database: "create first user" answered 403, account creation 403, and the stranger's login 401.

**A Payload behaviour the tests ran into.** Payload records a login by reading the editor's session list, adding to it and writing it back, so two logins to one account in the same instant can erase each other's session. Run in parallel, the CMS tests did exactly that, and uploads were refused as if nobody were signed in. `cms.spec.ts` now runs one test at a time. Two people signing in to one account within milliseconds is not a real risk for the site.

**What the review changed.**

- The preview redirect refused `//host` and backslashes by listing them; `/%09/host` — a tab, which browsers drop — got through. It now resolves the path and compares origins, and the test tries all four tricks.
- `docs/deployment.md` told the founder to put production's database address in `.env.local`, which `npm run dev` also reads — a local development session would have edited the live site. The values now go in the terminal, for the two commands only.
- Migrations were to be run by hand after each merge; a forgotten one would fail every production build. Production now migrates itself.
- The docs claimed a password-reset email lands in the server log; Payload logs only its subject, so a reset cannot be finished. Corrected.
- The tests no longer depend on the admin's element ids, Next's cookie name or the order of attributes in the HTML.
- `engines.node` rises to 22.18: the test server imports a TypeScript file under plain Node.

**Kept, against the review.**

- **No test storage bucket.** The spec asks for one; a Supabase bucket needs the credentials nobody has yet, and an S3 emulator needs Docker. Uploads are tested against local disk, and the S3 wiring is unexercised until the founder's setup is done — hence the unticked box above.
- **Vercel's request size.** Uploads are capped at 10 MB. Vercel functions now accept bodies up to 100 MB, so direct-to-bucket uploads are not needed.
- **`/api/media` lists every image.** The files have to be public to appear on the site, and Payload checks the same rule for the list and the files.

**Not there yet.** No email: "forgot password" cannot work until the Microsoft 365 credentials arrive; another editor sets a new password meanwhile. Payload writes each generated migration's type imports as value imports, which this project's compiler refuses; they are marked `type` by hand (noted in `docs/deployment.md`).
