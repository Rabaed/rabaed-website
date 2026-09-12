# Spec: Rabaed Marketing Site

Status: ready-for-agent

## Problem Statement

Rabaed has no official website. What exists is a Reference site: nine hand-built, self-contained HTML pages in `reference/site/`, written by a non-technical co-founder with an AI chat assistant. The design and animation work in it is strong and the company wants to keep it. Everything around that design is unfit to publish:

- **Nobody can find it.** Six of the nine pages carry `noindex`, which instructs every search engine and AI crawler to ignore them. There is no sitemap, no `robots.txt`, no canonical URLs, no favicon, no structured data, and the social sharing image referenced by every page does not exist.
- **Nothing it collects is kept.** Every form is a decoration. The Referral Program form displays a fabricated approval code and stores nothing. Demo requests, partnership applications and tool downloads all vanish. There is no backend at all.
- **Only a developer can change a word.** The header exists nine times, the CSS nine times, the logos as base64 nine times. Changing one navigation link means editing nine files. The co-founder — the person who owns the content — cannot publish a blog post, swap a photograph, or add a client logo without help.
- **It cannot grow.** The company wants a blog and case studies, wants to be cited by AI assistants when Saudi construction professionals ask about project correspondence, submittals and construction technology, and wants an English version for partners. None of that is reachable from a 2.6 MB pile of duplicated HTML.
- **It carries legal exposure.** The Referral Program form collects IBAN certificates and commercial registrations, while the Privacy Policy describes a site that collects nothing.

## Solution

Rebuild the Reference site as the official Marketing site at `rabaedapp.com`: same design, same animations, on a foundation that can be found, edited and extended.

- **Next.js on Vercel, Payload CMS in the same application, Supabase for data and files.** Pages arrive as complete HTML on first request, which is what makes the GEO work possible (see ADR-0001).
- **Ahmed edits the site himself.** All page copy, images, Trust strip logos, social links, FAQs, Referral Program amounts, blog posts, case studies and legal pages, from an admin area in Arabic and English.
- **The design survives intact.** Every animation the co-founder built is kept. The Screen mocks become exported images generated from his own markup, per locale, so they stay pixel-exact without carrying thousands of lines of imitation HTML into production (ADR-0002).
- **Forms become real.** Submissions land in Supabase, applicant documents in private storage, an alert reaches the team, and the applicant receives an Arabic confirmation.
- **The site is built to be cited.** Indexable, structured, fast, with a launch-day set of Arabic articles answering the questions Rabaed's buyers actually ask.
- **Two stages.** Stage 1 is the complete Arabic site including CMS, forms, analytics and blog. Stage 2 adds English.

## User Stories

**Visitors — Arabic**

1. As a Saudi contractor visiting `rabaedapp.com`, I want the site in Arabic and laid out right-to-left, so that it reads naturally to me.
2. As a project owner on a 1440px desktop, I want the hero animation showing a document travelling between the three parties, so that I understand what Rabaed does before reading a word.
3. As a consultant on a 13-inch laptop with a short viewport, I want the pinned sections to fit my screen height, so that I am not trapped scrolling through a broken layout.
4. As a visitor on a 360px phone, I want every section to work vertically with no sideways scrolling, so that the site does not feel broken.
5. As a visitor on a phone, I want to pan across Screen mocks rather than see them shrunk to illegibility, so that I can actually see the product.
6. As a visitor, I want the page to keep its meaning if animations are disabled in my system settings, so that motion sensitivity does not exclude me.
7. As a visitor, I want the delay-cost calculator to respond as I move the sliders, so that I can see what delays cost on a project my size.
8. As a visitor, I want the before/after slider to work by drag, click and keyboard, so that I can use it however I navigate.
9. As a visitor, I want the Trust strip to move continuously and pause when I hover, so that I can read the logos of companies that work with Rabaed.
10. As a visitor, I want the navigation to stay readable as it crosses dark and light sections, so that I never lose the menu.
11. As a visitor on a phone, I want the menu panel to open fully and show every link, so that I can reach any page.
12. As a keyboard user, I want the Partnerships dropdown to open, close on Escape, and close when I click away, so that I can navigate without a mouse.
13. As a visitor with a screen reader, I want each Screen mock to be described in words, so that I know what the picture claims.
14. As a visitor on a slow mobile connection, I want the page to become usable quickly, so that I do not abandon it.

**Visitors — English (Stage 2)**

15. As an international supplier, I want an English version at `/en`, so that I can evaluate Rabaed without reading Arabic.
16. As an English reader, I want the layout to flip to left-to-right, so that the design reads correctly in my language.
17. As a bilingual visitor, I want a visible language switcher that remembers my choice, so that I am not asked again on every page.
18. As an English reader landing on a page with no translation, I want to be told and offered the Arabic version, so that I am not shown an empty page.
19. As an English reader, I want to see the same Screen mocks with English labels, so that the product looks like something I could use.

**Prospects and applicants**

20. As a prospect, I want to request a demo from the homepage, product page or start page, so that I can talk to someone.
21. As an applicant filling a form in Arabic, I want validation messages in Arabic, so that I understand what is wrong.
22. As an applicant, I want the submit button to stay disabled until the form is valid, so that I am not guessing.
23. As a referrer, I want to upload my IBAN certificate as a file rather than typing my bank details, so that my details are not exposed as plain text.
24. As an applicant uploading a document, I want to see the filename and upload progress, so that I know it worked.
25. As an applicant uploading a large or wrong-format file, I want a clear Arabic error, so that I can correct it.
26. As an applicant, I want an immediate Arabic confirmation email, so that I know my application arrived.
27. As an engineering office, I want to apply to the Partnership Program with my commercial registration attached, so that I can be assessed.
28. As a site engineer, I want to download the Pour Tracker after giving my details, so that I get a tool I can use offline.
29. As an applicant, I want my uploaded bank documents to be unreachable by anyone guessing a URL, so that my financial identity is safe.
30. As a visitor, I want to reach Rabaed on WhatsApp, so that I can ask a quick question.

**Ahmed — content management**

31. As Ahmed, I want to log into an admin area on our own domain, so that I do not depend on a third-party service.
32. As Ahmed, I want to edit any headline or paragraph on any page, so that I can fix wording without a developer.
33. As Ahmed, I want to replace any image, so that I can refresh the site visually.
34. As Ahmed, I want to add, reorder and remove Trust strip logos with their links, so that new clients appear as we sign them.
35. As Ahmed, I want to set the social account links, so that the footer icons point somewhere real.
36. As Ahmed, I want to add and edit FAQ entries, so that the answers stay current and keep feeding structured data.
37. As Ahmed, I want to change the Referral Program amounts in one place, so that the page and its terms never disagree.
38. As Ahmed, I want to write blog posts in Arabic and English, so that we answer the questions our buyers search for.
39. As Ahmed, I want to write case studies, so that real client stories can be published when they are approved.
40. As Ahmed, I want case studies hidden until I publish one, so that the site never shows an empty section.
41. As Ahmed, I want to save a draft and preview it before publishing, so that I do not publish half-finished work.
42. As Ahmed, I want the admin interface itself in Arabic, so that I can work in my own language.
43. As Ahmed, I want to see which entries are missing a translation, so that the English site does not silently fall behind.
44. As Ahmed, I want to edit the legal pages with our lawyer, so that corrections reach the site without waiting for a developer.
45. As Ahmed, I want every legal edit recorded with a date and an author, so that we can prove what our terms said on any given day.
46. As Ahmed, I want to set each page's title and description for search, so that I control how we appear in results.
47. As Ahmed, I want uploaded images automatically resized and converted, so that adding a photograph does not slow the site down.

**The team — operations**

48. As the team, I want an alert email the moment a form is submitted, so that nothing waits for someone to check an admin screen.
49. As the team, I want every submission stored and searchable, so that we can follow up weeks later.
50. As the team, I want uploaded documents reachable from the submission record through a link that expires, so that access is controlled.
51. As the team, I want bots blocked from our forms, so that the inbox stays useful.
52. As the team, I want to see how many people visit, which pages they read and where they came from, without a cookie banner.
53. As the team, I want to see specifically when ChatGPT, Perplexity or Claude sends us a visitor, so that we know the GEO work is paying off.
54. As the team, I want page-speed measured on real visits, so that we notice if the site gets slower.

**Being found**

55. As a Saudi professional searching Google in Arabic for construction correspondence management, I want Rabaed to appear, so that I can find it.
56. As someone asking an AI assistant about construction project management platforms in Saudi Arabia, I want Rabaed quoted with a link, so that the answer points to us.
57. As a search engine, I want the complete page text in the first response, so that I can index it without executing JavaScript.
58. As a search engine, I want a sitemap, canonical URLs and `robots.txt`, so that I crawl the right pages once each.
59. As an AI crawler, I want `llms.txt` and structured data describing the organisation, the product and the FAQs, so that I can cite Rabaed accurately.
60. As someone sharing a Rabaed link on WhatsApp or LinkedIn, I want a proper preview image and title, so that the link looks credible.
61. As a visitor arriving from an AI answer, I want the first paragraph under each heading to answer the question directly, so that I get what I came for.
62. As the team, I want the site invisible to search engines until we launch, so that an unfinished site is never indexed.
63. As the team, I want removing that block to be a deliberate launch step, so that we never launch invisible by accident.

**Developers**

64. As a developer, I want the header, footer and forms to exist once, so that a change is made in one place.
65. As a developer, I want to regenerate a Screen mock by running a script, so that changing a label is not a redesign.
66. As a developer, I want automated screenshots compared against the Reference site at eight widths, so that I can prove the rebuild matches.
67. As a developer, I want the design tokens defined once, so that colour and spacing stay consistent.
68. As a developer, I want deliberate CSS exceptions documented where they live, so that nobody "fixes" them.
69. As a developer, I want animations torn down correctly on navigation, so that pinned sections do not break as visitors move between pages.

## Implementation Decisions

### Stack and hosting

- **Next.js (App Router) on Vercel**, server-rendered. Primary content is never client-rendered (ADR-0001).
- **Payload CMS** mounted inside the same Next.js application, admin at a non-obvious path, restricted to invited accounts.
- **Supabase Postgres** for CMS content and form submissions; **Supabase Storage** for media and a separate **private** bucket for applicant documents (ADR-0004).
- **Microsoft 365** no-reply mailbox sends transactional email via SMTP with a dedicated service account. No third-party email service.
- Secrets are supplied through environment variables, never committed. Credential collection is a human-in-the-loop step.

### Routing and localisation

- Arabic is the default locale at `/`; English at `/en`. No automatic language detection.
- `<html lang dir>` is set per locale: `ar`/`rtl` and `en`/`ltr`. Layout uses CSS logical properties so a single stylesheet serves both directions.
- Every locale has `hreflang` alternates and a self-referencing canonical URL.
- The language switcher preserves the current page where a translation exists, and offers the Arabic equivalent where it does not.
- Locale preference persists client-side but never overrides an explicit URL.
- Pages, blog posts and case studies are localised per-entry. An entry with no translation in the requested locale is not silently substituted.

### Content model (CMS)

- **Globals**: site settings (contact details, WhatsApp number, social links), navigation, footer, Trust strip logos (image, name, link, order), Referral Program values (amount, client discount).
- **Collections**: pages (with localised section content), FAQ entries (grouped by page), blog posts, case studies, legal documents, form submissions, media.
- **Legal documents** carry versioning with retained history, an explicit publish action, and edit rights restricted to the owner account (ADR-0003). The `.docx` files are imported verbatim once, typos included, and kept as the pre-launch archive.
- **Case studies** ship with the section hidden until the first entry is published.
- Media uploads are converted to modern formats and multiple sizes on upload.
- Blog posts and case studies require: title, slug, locale, summary, body, author, published date, and an explicit answer-first opening paragraph field used for both the page and its structured data.

### Design system

- Tokens taken verbatim from the Reference site: `--acc: #F95738`, `--ink: #222222`, `--paper: #FAFAF8`, `--muted: #6B6A66`, `--line: #E3E1DC`, `--soft: #F3F2EF`, `--dark: #14161C`, `--dark2: #1B1E27`, `--dark-text: #EDEEF3`, `--dark-muted: #9AA0B4`, `--green: #1D9E75`, `--gold: #CCA840`, and the vertical rhythm token `--sp: clamp(56px, 8vh, 96px)`.
- Typography: IBM Plex Sans Arabic for all text, DM Mono for Latin numerals only — DM Mono has no Arabic glyphs and must never be applied to Arabic text. Fonts are self-hosted as `woff2`, not fetched from Google Fonts.
- Dark and light are **alternating section treatments**, not a user theme. No `prefers-color-scheme` handling.
- Plain CSS with the Reference site's class names preserved. No Tailwind rewrite, no CSS Modules on cross-cutting selectors — scoping breaks selectors like `.nav.on-light .brand .lg.l`, and class names are load-bearing for behaviour.
- The breakpoint contract is fixed: **≥981px** desktop, **≤980px** mobile, with secondary breakpoints at 700, 680, 640, 620, 560 and 400px, plus the Reference site's height-based queries. These are requirements, not suggestions; the pinned sections depend on them.
- Documented exceptions that must survive refactoring: `.nav .mnav .wrap{height:auto}`, `.nav > .wrap` at 700px, `.nav.open` background override, and the intentional off-canvas bleed of `.pcard`. Each is commented in place with the reason.

### Animation

- GSAP and ScrollTrigger as proper dependencies, not inlined. Not replaced with another animation library.
- Every animation is scoped and cleaned up on unmount; ScrollTrigger is refreshed after navigation; double-invocation in development must not produce duplicates.
- Preserved: hero document loop, `.reveal` on-scroll entrance, pain card deck with drag physics, the pinned horizontal journey (gated to `min-width: 981px and min-height: 551px`), the record section's scrubbed dark-to-light transition with cycling transaction types, the navigation colour toggle, the before/after seam with its column flip band, and the delay-cost calculator.
- `prefers-reduced-motion` is honoured: the hero loop and auto-sweep hints are skipped, and content remains complete and legible.

### Screen mocks

- The co-founder's mock markup is kept in the repo behind a studio route that is excluded from the production sitemap and blocked from indexing.
- A script renders each mock per locale at high resolution and exports optimised images with dimensions recorded to prevent layout shift.
- Each mock carries a descriptive `alt` and a visible caption stating the same claim in real text (ADR-0002).
- Below 700px, mocks render at their intrinsic width inside a horizontally scrollable container, matching the Reference site's panning behaviour.

### Forms

- Four flows: demo request, Referral Program signup, Partnership Program application, Pour Tracker download.
- Real semantic `<form>` elements with named fields, required attributes, Arabic validation messages, and submission handled server-side. The Reference site's `data-fake-send` behaviour and its hardcoded fake referral code are removed entirely.
- Uploads keep the Reference site's `.upl` label structure and its selected-state styling. File type and size are validated **on the server**, not only in the browser; the size cap is 10 MB with an Arabic error message.
- Applicant documents are written to the private bucket and surfaced only through short-lived signed URLs from the submission record.
- Spam protection: a honeypot field plus rate limiting per address, with a challenge added only if abuse appears.
- On success: the submission is persisted, an alert email is sent to a configurable address (left empty until supplied), and an Arabic confirmation is sent to the applicant. The Pour Tracker download is delivered only after the submission is recorded.
- The Reference site's unconfigured Google Sheet endpoint is not carried over.

### Analytics and performance

- Cookie-free analytics with page views, referrers and outbound sources, configured to surface referrals from `chatgpt.com`, `perplexity.ai` and `claude.ai`.
- Real-user page-speed measurement reported in the same place.
- Performance budgets: no page ships duplicated CSS or the animation library where it is unused. The Reference site's start, referral, partnership and legal pages currently ship the full animation bundle for elements they do not contain; the rebuild must not.

### SEO and GEO

- `noindex` is applied to all non-production environments by default and removed at launch as an explicit checklist step.
- Per page: unique title and description, canonical URL, `hreflang` alternates, Open Graph and Twitter tags with a real 1200×630 image, and a favicon.
- `sitemap.xml` generated from published content; `robots.txt` distinguishing retrieval and citation crawlers (allowed) from training crawlers (owner's decision, defaulting to allowed); `llms.txt` following the co-founder's draft.
- Structured data: organisation on every page including the unified number, software application on home and product, FAQ data generated **verbatim** from on-page FAQ text, breadcrumbs on inner pages, website on the homepage, and article data on blog posts. No ratings or offers are emitted, because no real ones exist.
- Content structure: the first sentence under each major heading is a standalone 30–60 word answer.
- Launch content: 4–6 Arabic articles covering category, how-to and comparison questions — including Rabaed versus WhatsApp, email and spreadsheets, which is the biggest current gap.
- **No invented figures, percentages or testimonials.** Statistics appear only when supplied and attributable.

### Brand and legal correctness

- The brand is written ربائد / Rabaed everywhere. The Pour Tracker's misspelling is corrected.
- Legal page text is imported verbatim, including the three known typos, and thereafter edited only through the CMS.
- A plain-language inventory of everything the site collects, where it is stored and for how long is produced for the lawyer, so the Arabic Privacy Policy can be updated before launch.

## Testing Decisions

**What makes a good test here:** it asserts what a visitor or editor can observe — text on the page, a file downloaded, a row stored, a layout that does not overflow. It never asserts component internals, class names as such, or CMS implementation details. The Reference site is the oracle for appearance; the spec is the oracle for behaviour.

**One seam, at the highest point: the running application, driven by Playwright.** Everything below it — components, CMS queries, form handlers, image pipeline — is exercised through that seam rather than tested directly. A second, narrow seam is permitted only for pure calculation with no I/O, currently the delay-cost formula, where a direct unit test is cheaper and sharper than driving three sliders.

Tests run against the built application with a seeded test database and test storage bucket, so CMS-driven content is real content, not fixtures injected at render time.

**Coverage at that seam:**

- **Visual regression.** Full-page screenshots at 360, 390, 768, 820, 1024, 1280, 1440 and 1600px, compared against baselines captured from the Reference site before any rebuilding begins. Baselines are captured with the same self-hosted fonts the rebuild uses, because a missing Arabic font invalidates every comparison. Height is tested at short viewports too, since the pinned sections are tuned for them.
- **Server-rendered content.** For every route, assert that the page's text is present in the server response, with JavaScript disabled. This is the executable form of ADR-0001.
- **Layout integrity.** Zero horizontal overflow, measured against `clientWidth` — `scrollWidth` is useless here because the Reference site clips overflow deliberately.
- **Zero console errors and zero failed requests** on every page.
- **Interaction.** Navigation colour toggle across section boundaries; the Partnerships dropdown by hover, click, keyboard and Escape; the mobile panel at ≤980px; journey pinning at ≥981px and at short heights; the tab strips; the before/after slider by pointer and keyboard; the card decks.
- **Reduced motion.** With the preference set, animations are skipped and all content remains present and readable.
- **Localisation.** Arabic renders RTL and English LTR; the switcher preserves the page; a missing translation offers the alternative rather than a blank page; `hreflang` and canonical tags are correct per locale.
- **Forms.** Validation messages appear in the right language; the submit button gates on validity; a valid submission creates exactly one row; an uploaded document lands in the private bucket and is **not** retrievable without a signed URL; oversized and wrong-type files are rejected server-side; the honeypot blocks a bot-shaped submission; the Pour Tracker downloads with the correct filename only after the submission is recorded.
- **CMS.** An edit made through the admin appears on the page; an unpublished draft does not; a hidden case-study section stays hidden until an entry is published; a legal edit produces a new retained version.
- **Discovery.** Sitemap lists exactly the published pages; `robots.txt` and `llms.txt` are served; structured data validates and its FAQ content matches the visible text verbatim; every page has a canonical URL, a title, a description and an Open Graph image that resolves.
- **Accessibility.** Automated checks per page, plus assertions that every Screen mock has a non-empty description and every image an `alt`.

**Prior art:** none in this repo — it is empty. `reference/HANDOFF.md` section 7.7 defines a "definition of done" checklist that this suite implements, and its Playwright-screenshots-at-eight-widths method is adopted directly.

## Out of Scope

- The Rabaed product app at `app.rabaedapp.com`, including sign-in, accounts and any product functionality. The site links to it and contains none of it.
- End-user accounts on the marketing site. The only logins are CMS editors.
- **Stage 2 items**, tracked separately: the English site, English Screen mock exports, and English blog and case study translations.
- **Later phase**: building whole new pages from blocks in the CMS. Stage 1 lets Ahmed edit every existing page, not invent new page types.
- English translations of the Terms, Privacy Policy and Referral Terms. Arabic is binding; translating them is a lawyer's job, not this build's.
- Redesigning the Pour Tracker. It ships as-is with only the brand spelling corrected, keeping its own claymorphic look and its existing bilingual switcher. Restyling it to match the site is a later, separate piece of work.
- Migrating existing search rankings. Nothing is published today, so there is nothing to redirect and no ranking to preserve.
- Invented statistics, testimonials, ratings or client counts.
- Native mobile applications.
- Paid advertising, email marketing campaigns and CRM integration.

## Further Notes

**Stage split.** Stage 1 (Arabic) includes the full site, CMS, forms, email, analytics, SEO and GEO foundations, and 4–6 launch articles. Stage 2 (English) adds the `/en` locale, English mock exports and translated content. The build order is deliberate: capture visual baselines first, then extract shared assets and structure, then rebuild page by page against those baselines, then layer CMS, forms and discovery. Most rebuilds of this kind fail because they start at the framework and never establish what "identical" means.

**Known fragility.** The pinned horizontal journey is the most delicate thing in the Reference site: it depends on pinning, scrubbing, right-to-left direction, a width **and height** gate, and refreshing after layout changes. It needs explicit attention at ≥981px and at short viewport heights, and it will break first whenever navigation or layout changes.

**Two design systems exist.** The site uses the dark-and-orange system; the Pour Tracker uses a separate claymorphic peach system. They are not unified in this spec, and the Pour Tracker's is kept intact.

**Awaiting from the founders, none of it blocking the start:** the lead alert address, the real social account links, Microsoft 365 credentials, GoDaddy DNS access at launch, and the lawyer's updated Privacy Policy text. Each is wired as configuration so it can be supplied late.

**Cleared by the founders:** Trust strip logo permissions (covered by existing contracts), the 60-day guarantee, and the SAR 2,000 referral amount with its 10% client discount — all approved as binding commitments.
