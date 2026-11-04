# Spec: Company profile

**Main:** written by the Orchestrator at the founder's request on 4 November 2026; built by Main 1 (lanes 1a, 1b) and Main 2 (lanes 2a, 2b)

Status: ready-for-agent

## Problem Statement

Ahmed has built a standalone Company profile of Rabaed: one long page in Arabic and English, with four Profile PDFs made from it. He wants to send its link to prospects, in WhatsApp campaigns among other places. It lives outside the Marketing site, in `D:\Rabaed Work\Rabaed-Profile-V4\Rabaed-Profile-V4\`, as its own HTML, CSS and JavaScript. Its type and sizes are its own as well (Plex Mono rather than DM Mono, no Thmanyah labels, 17px body text, headings up to 52px). Its header and footer are not the site's, and its text can be changed only by editing JSON and running a Python build.

The founder wants it as a page of the Marketing site at `rabaedapp.com/profile`:
- the site's own header and footer;
- the site's own look, from type and sizes to phone layout;
- the site's own sections where the site already has them;
- every word and every link editable in the CMS.

The founder also adopts Ahmed's method for the Delay-cost calculator, on the home page as well (ADR-0029).

## Solution

A new Marketing site page, the **Company profile**, at `/profile` and `/en/profile`. It is built from Ahmed's content and section order, with the site's components and styles.
- **Hero:** the home page's hero, with "Book a live demo" and "WhatsApp us" where the home page has "Explore the platform".
- **Trust strip:** the shared one.
- **Ahmed's fourteen sections**, in his order and drawn in the site's style. Section 05 is the shared Delay-cost calculator. Section 07 shows the site's own Screen mocks.
- **Ahmed's closing contact section**, then the site's footer.

The header gains a **Download PDF** button on this page only. It gives the Profile PDF for the page's language and the visitor's screen.

The page is open to search engines and listed in `sitemap.xml`. Neither the header menu nor the Footer directory links to it. It is reached by its link.

## User Stories

1. As a prospect who received the link in a WhatsApp message, I want it to open straight onto Rabaed's story in my language, so that I can read it on my phone without hunting through a site.
2. As Ahmed, I want to send Arabic speakers `rabaedapp.com/profile` and English speakers `rabaedapp.com/en/profile` from my campaign, so that each lands in their own language with nothing guessed.
3. As a prospect on a phone, I want Download PDF to give me the phone version in my language, so that it reads well where I opened it.
4. As a prospect on a desktop, I want Download PDF to give me the desktop version in my language, so that I can share or print it.
5. As a prospect, I want a "WhatsApp us" button near the top and again near the end, plus a floating one, so that I can reply in the app the link came from.
6. As a prospect, I want "Book a live demo" to take me to the demo form, so that I can ask for a demo without searching for it.
7. As a prospect, I want the Delay-cost calculator to show what a week's delay costs on a project like mine, so that I see what is at stake.
8. As a visitor to the home page, I want the same calculator, giving the same answer as the Company profile, so that Rabaed tells one story.
9. As a prospect, I want the before-and-after videos to play when I reach them, muted, so that I see the difference without pressing anything. On a slow connection or with reduced motion I want them to wait for me.
10. As the founder, I want the Company profile to look like the rest of rabaedapp.com, with the same header, footer, type, sizes and phone layout, so that it reads as part of the site.
11. As the founder, I want the page kept out of the header menu and the Footer directory but findable by Google, so that it is reached by its link without hiding it from search.
12. As the founder, I want to review the whole page on a preview link with the preview database before rabaedapp.com shows it, so that nothing half-built goes live.
13. As an Editor, I want every heading, sentence, figure, button label and button link on the page to be editable in the CMS, so that tomorrow's change needs no developer.
14. As an Editor, I want to replace each Profile PDF and each video in the CMS, so that a new version of the profile reaches visitors without a code change.
15. As an Editor, I want one WhatsApp number for the whole site, so that changing it in site settings changes every WhatsApp button, here included.

## Implementation Decisions

### The page

- **Two addresses, one per language**, like every page: `/profile` (Arabic) and `/en/profile` (English). The address decides the language (ADR-0014). Nothing reads the phone's language or redirects. Ahmed's campaign sends each customer the address in their language.
- **A Marketing page in the Page registry**, so it is in `sitemap.xml` and `llms.txt`, with its own search title and description (ADR-0023), sharing image and hreflang pair. **It is not added to the header menu or the Footer directory.** Both are an Editor's data, so this means no seed adds it there. Register `profile` as one of the site's own first segments (`SITE_SEGMENTS` and the literal matcher in `src/proxy.ts`). Until it is registered, `/profile` is asked of the Product app and may be forwarded there (ADR-0026).
- **It is not live until it is published.** The page answers 404 on `/profile`, and stays out of the sitemap, while its Arabic is unpublished in the CMS. Its English follows the rule every page follows: a notice until published. The seed leaves both unpublished. So each ticket can merge to `main` without rabaedapp.com showing a half-built page, and the founder reviews it by publishing in the **preview** CMS first, then in production when it is approved (ticket 110).
- Built the way pages are built today (`docs/deployment.md`, "Adding a page"): a `profile-page` CMS entry with a tab per section, a loader in `src/content/pages/`, a page component, and the two route files. Ticket 93, which would change that shape, is paused.

### Header and footer

- **The site's header, unchanged, plus a Download PDF button on the Company profile only**, beside Sign in, on the desktop bar and in the phone panel. Its label is the CMS's (seed «تنزيل PDF» / "Download PDF"). No other page shows it. On this page the header's "Book a live demo" goes to the home page's demo form (`/#demo`, `/en#demo`), since this page has no form.
- **The site's footer, unchanged.** Ahmed's footer becomes the page's last section (his tagline, Ahmed's name, mobile and email, the company WhatsApp and the social links), above the site's footer.

### Profile PDFs

- **Four files: Arabic, Arabic phone, English, English phone.** The page's language picks the pair. The screen picks within it: a screen 980px wide or less gets the phone version, which is the site's own phone line, not Ahmed's 760px. The button follows the screen as it changes. Without JavaScript it gives the desktop version.
- **Each is a file an Editor can replace in the CMS.** The four files Ahmed delivered (`PDF/` in his folder) are the defaults, kept in `public/profile/pdf/`, as `public/hero/` keeps the hero's default drawings. The download is the file itself, saved under its own name.

### Buttons and links

- **Every button on the page has an editable label and an editable link.** This departs from the home page's rule that "an Editor changes what a button says, never where it goes" (`src/content/pages/home.ts`). The founder chose it for this page on 4 November 2026, so that a campaign's link can change tomorrow. The defaults: "Book a live demo" → `/#demo` (English `/en#demo`); "WhatsApp us" → the site's WhatsApp address.
- **One WhatsApp number**, the one in site settings (`whatsappNumber`, today 966576767900, which the founder confirmed). An empty WhatsApp link on this page means that address. Ahmed's 966579012646 is not used.
- **A floating WhatsApp button on the Company profile only**, as in Ahmed's design, at the bottom corner on the reading end.

### Sections, in order

Ahmed's content is in `source/ar.json`, `source/en.json` and `source/site.json` beside this spec, copied from his folder. His media are in `media/` and `dist/profile/assets/` there.

| # | Section | Built from |
|---|---|---|
| — | Hero: «ثلاثة أطراف. سجل واحد. مسؤولية واضحة.» | The home page's hero component, with Ahmed's eyebrow, lead and badges as its words. Buttons: "Book a live demo" and "WhatsApp us", in place of "Explore the platform". "Interactive version" exists only in the PDFs. |
| — | Trust strip | The shared Trust strip and its logos, with this page's own show switch. |
| 01 | Here's the truth (`#truth`) | Ahmed's, in the site's style. Includes the redacted paper photo with its three notes. |
| 02 | The real site (`#numbers`) | Ahmed's three figures, with a source line under them. |
| 03 | The trap (`#trap`) | Ahmed's four tool cards. |
| 04 | Who we are (`#about`) | Ahmed's, with its quote. |
| 05 | The hidden cost (`#cost`) | **The shared Delay-cost calculator** (ADR-0029). |
| 06 | Our solution (`#parties`) | Ahmed's three parties and the documented Record. |
| 07 | The platform (`#platform`) | Ahmed's four tabs, showing **the site's Screen mocks** (correspondence, kanban, daily-report, documents), with their Phone crops. These are 2880×1800 with phone versions, against Ahmed's 1440 wide. |
| 08 | The documented Record (`#record`) | Ahmed's illustrative timeline card. |
| 09 | Before and after (`#compare`) | Ahmed's five tabs and five videos. The PDFs link to this anchor. |
| 10 | Pre-made templates (`#templates`) | Ahmed's nine flip cards. |
| 11 | Why Rabaed (`#why`) | Ahmed's three cards. |
| 12 | The impact (`#impact`) | Ahmed's six figures, with a source line. |
| 13 | Plans (`#plans`) | Ahmed's three plans, without prices. |
| 14 | How we start (`#start`) | Ahmed's three steps and his closing card with the demo and WhatsApp buttons. |
| — | Ahmed's contact section (`#contact`) | His footer, as a section. |
| — | The site's footer | Unchanged. |

- **Look:** everything in the site's own tokens, type and spacing (`src/styles/tokens.css`, `shell.css`), at the site's breakpoints. That means IBM Plex Sans Arabic for text, DM Mono for numerals, codes and section numbers, and Thmanyah Sans for Arabic labels (ADR-0018). Ahmed's `styles.css` and `app.js` are a picture of the intent, not code to copy. His layout, his dark and light rhythm and his interactions (tabs, flip cards, count-up figures) are rebuilt in the site's components and styles. Primary content is server-rendered and JavaScript only enhances it (ADR-0001). Reduced motion is honoured everywhere.
- **The figures are Rabaed's own data.** The founder confirmed them. Sections 02 and 12 each carry one source line, editable, seeded «المصدر: بيانات مشاريع ربائد» / "Source: Rabaed project data".
- **The videos are Rabaed's own mock-ups**, consented, and published as they are. They are the site's first videos. Each plays muted and looping while on screen and pauses off it. Under reduced motion, Save-Data or a slow connection it waits behind its poster and play button. Each video and poster is a file an Editor can replace in the CMS, with Ahmed's as the defaults in `public/profile/clips/`. The `media` collection turns uploads into WebP, so videos need a collection or field that keeps an MP4 as it is.
- **What an Editor can change** is what the spec already allows on every page: words, images, list items, and whether a section shows. Here that also covers files (the PDFs, the videos) and button links. Section order is fixed. The hero and `#compare` (which the PDFs link to) cannot be hidden.

### The Delay-cost calculator (ADR-0029)

- **Ahmed's method on both pages:** cost = value × progress% × 8% a year ÷ 365 × days of delay. Sliders: value 1M–300M SAR in steps of 1M (default 60M); days 1–60 (default 7); progress 5–100% in steps of 5 (default 50). The method and ranges stay in code. Its words are the CMS's.
- **The home page's look is kept.** The result shows the total and one line, "on X SAR spent so far" («على X ر.س مصروفة حتى الآن»), in place of the financing and overhead lines. Ahmed's progress bar is not added unless it fits the existing result card without changing its size.
- **One set of words, in one shared CMS entry** like the Trust strip. Seeded with Ahmed's words (eyebrow, heading, lead, slider labels, result label, the "spent so far" line, the assumptions note, the button), replacing the home page's calculator words, which leave the home page's entry. Each page keeps its own switch to show the calculator.

### Files the tickets share

Every profile ticket adds to the same few files: the `profile-page` CMS entry, its loader, the page component, its stylesheet, and a schema migration. Expect small merge conflicts there. Settle them by merging `origin/main` and running `npm run cms:rebase-migrations` (`docs/agents/parallel-sessions.md`). The home page files (`src/app/(ar)/page.tsx`, `src/styles/home.css`) and the header (`src/components/site-nav.tsx`, `page-shell.tsx`) are touched only by Main 1's tickets. Claim them in `claims.md` as usual.

## Testing Decisions

- **One seam: the running application, driven by Playwright**, as the rest of the suite. What a test asserts is what a visitor, a crawler or an Editor can observe.
- **The page:**
  - `/profile` answers 404 and is absent from `sitemap.xml` while unpublished.
  - Once published it answers 200, and it is in `sitemap.xml`.
  - It is in neither the header menu nor the Footer directory.
  - `/en/profile` shows the English notice until its English is published.
  - It is in `tests/e2e/routes.ts` and in the hand-kept lists the other page suites read (performance, search foundations, AI crawlers, structured data, cached page age).
- **Download PDF:**
  - The button appears only on the Company profile.
  - It points at the right one of four files for each of Arabic or English × a 1280px or a 390px viewport, and it changes when the viewport crosses 981px.
  - The file it points at downloads.
  - An Editor's replacement is what downloads next.
- **The calculator:** `tests/unit/delay-cost.spec.ts` holds Ahmed's three acceptance cases (ADR-0029). The browser tests check that the sliders on both pages redraw the same total for the same inputs.
- **Videos:** a video starts only once on screen, and stays still under reduced motion.
- **The look:** the page is swept at the phone widths ticket 86 sweeps, with no sideways overflow. Its header and footer are pixel-identical to the home page's (Download PDF aside).
- **Prior art:** `tests/e2e/home-calculator.spec.ts`, the Trust strip's tests, the Pour Tracker download's tests (a file served as an attachment), `tests/e2e/screen-mocks.spec.ts`.

## Out of Scope

- Detecting a visitor's language, or redirecting between `/profile` and `/en/profile` (ADR-0014 stands).
- Generating the Profile PDFs from the page. Ahmed makes them and an Editor uploads them.
- A demo form on the Company profile. "Book a live demo" goes to the home page's.
- Ticket 93's one-module page shape, and tickets 94–97. Paused by the founder on 4 November 2026.
- Prices in the Plans section.

## Further Notes

- **Ahmed's folder:** `D:\Rabaed Work\Rabaed-Profile-V4\Rabaed-Profile-V4\`. It holds:
  - `content/`: the text, copied to `source/` here;
  - `media/`: the originals, including `media/clips/` (five MP4s, 13 MB, no audio) and `media/screens/`;
  - `dist/profile/assets/`: built images, posters, node pictures, the paper photo and icons;
  - `PDF/`: the four Profile PDFs, 16 pages each, about 1.7–2.0 MB each;
  - `README.md`: his decision notes, in Arabic, copied to `source/README.ar.md`.
  
  It is on this machine only, outside the repository. Copy what a ticket needs into `public/profile/`.
- **Ahmed's calculator** is in `src/app.js:107-128` and `build.py:284-287` of his folder. His acceptance cases are in `tools/smoke.mjs:41`.
- **Ahmed's PDF choice** is in `src/app.js:76-83`. Each page names its own pair (`pdf_desktop`, `pdf_mobile` in `source/*.json`).
- Ahmed's English is a rewrite, not a translation. Seed each language from its own file.
- The page shows Ahmed's own name, mobile and email in its contact section, at the founder's decision.
