# 42: English page content — Stage 2

**What to build:** All six marketing pages available in English, translated properly rather than mechanically, and reviewed by Ahmed before publishing.

**Blocked by:** 53, 54, 55, 56, 57, 58, 59, 40

**Status:** ready-for-human — every page's English waits in the CMS as drafts; publishing it is the founder's, see below

- [x] Every page's copy translated and entered as English content in the CMS
- [ ] Drafted for Ahmed, published only after his approval
- [x] Form labels, validation messages and confirmation emails translated too
- [x] English pages match the Arabic in structure and meaning, with layout mirrored correctly
- [x] English pages carry their own titles, descriptions and structured data
- [x] No machine-translated filler is published; an untranslated page stays untranslated rather than published badly

## Comments

**Lists are shared across locales (decided 13 September 2026).** Each page list is one list whose items hold text per locale, so English means adding English text to every existing item, not building English lists. A page publishes in English only once every item has English text. FAQs, blog posts and case studies stay per-locale entries (spec: Content model).

**Built on 23 September 2026.** The one box left unticked is the founder's, as ticket 35's was: every word is in the CMS as an **unpublished draft**, and each English address goes on saying the page is not in English yet until he publishes what that page reads. `docs/deployment.md` has what he does, in plain language, under «The English pages, waiting for a decision» — with the handful of places where the English asked for a choice only he can make (whether demos are given in English; «Clear ownership.» for «مسؤولية واضحة», which is all the heading has room for; the Trust strip's four Arabic company names in English).

**One page for both languages.** Each marketing page is one component (`src/components/pages/`), handed its content in one language by its module; the Arabic route and the English route both draw it. An English route draws the page once everything the page reads is published in English (`inEnglish`) — its own entry and the shared ones, the closing section, the Screen mocks, the Trust strip, the search settings, and the header and footer ticket 40 proposed, since a page with no menu or footer is half a page — and the notice ticket 40 built until then (`src/content/arabic-only-pages.ts`), which is what makes «an untranslated page stays untranslated» true by construction rather than by care. The Arabic page names English to the switcher and in its `hreflang` alternates, and the sitemap lists the English page, on the same condition. `/en` keeps saying the English site is on its way until the home page's English is published.

**The English is found by the Arabic it translates.** The words are written in modules shaped exactly like each import's Arabic (`src/migrations/english-pages/`), and walked side by side into one dictionary, Arabic to English. The migration copies each entry's newest version into a draft and gives every English box the English of the Arabic beside it — wherever it is, so a reordered list loses nothing — and a word whose Arabic the founder has rewritten since it was imported gets none, so the CMS names it when he presses Publish. Nobody here knows the English of his wording, and nothing is guessed.

- **English is not ticked.** Each draft is published in Arabic alone, as it was copied; ticking **الإنجليزية** is the founder's approval. Were it ticked, publishing an Arabic edit made on top of the draft would put the page's English live with it, unread — which the spec review caught.
- **The newest version, draft or published, is what is copied.** The home and product pages' newest versions are ticket 35's waiting openers; carrying them rather than burying them means publishing the English there publishes those paragraphs too, which `docs/deployment.md` says.
- **Every English word passes the field that will hold it**, run through the CMS's own validation — lengths above all, since English runs longer than Arabic and every field is held to what its place in the design carries. Thirty-three first drafts were too long and were rewritten to fit (`tests/unit/english-words.spec.ts`, with `english-fields.probe.ts`). Published once in a local database through Payload itself, all ten entries, 36 questions and four forms: the CMS accepts every word.
- **A question is an entry of its own in each language**, so each Arabic one gets an English draft entry, placed after it in the same order.

**Forms in English.** Each form has an English settings entry of its own, «نموذج … — بالإنجليزية» (`src/cms/globals/form-settings.ts` says why not a group inside the Arabic one: the longest option columns would pass what Postgres allows, and a separate entry drafts and publishes without touching the Arabic or its alert address). The definitions carry English beside the Arabic, which an English page shows until the entry is published — never the Arabic. A form names the language it was filled in (`?locale=en`), is answered and confirmed in it, and the email is laid out left to right; the team's record and alert stay in Arabic and say the applicant wrote in English (**لغة النموذج**, a new column). The words the forms keep in code — the guarantee, the file picker, the Pour Tracker's three steps, the referral consents — are in both languages; the English consent links to the Arabic terms and says they are the binding text. The privacy inventory says the confirmation is sent in the applicant's language, and that the language is kept.

**Mirrored where the design has a direction.** The home page's before-and-after is a picture with a left and a right; in English it turns round, Rabaed's way on the left where its steps begin, the seam turning them over as it moves right. The arrows the code draws point →, the card numbers and the units' numbers sit at the left, and the words the stylesheet had forced right to left read left to right — every place a comment had left for this ticket. Checked by eye at 1440 and 390 on all six pages: no page wider than the window, no console error, and no Arabic but the switcher's «العربية».

**Structured data in the page's language.** The company is named Rabaed with ربائد as its alternate on an English page, one entity by one `@id`; the site and the product are described in English; the trail and the questions are the English page's own.

**Tested where the entries live.** `english-pages.spec.ts` runs last, because it restores the proposals and publishes: it checks every entry's draft holds every word in English and nothing is published in English; previews all six pages; drives the English comparison; then publishes the start page's English and holds it to what any page is held to — its title, canonical and alternates, its trail and questions in structured data, the Arabic page and the sitemap naming it — and sends its form, answered, confirmed and recorded in English.

**One cost while a page waits.** Each English route draws both the page and the notice that stands for it, and a route carries the scripts of everything it can draw — so until the founder publishes a page's English, its English address loads that page's scripts to show a notice. On `/en` that is the home page's animations and GSAP, which `tests/e2e/animation-code.ts` now expects of it (`CARRIES_THE_SCRIPTS_OF`); importing the page only when it is drawn does not change what Next bundles for the route, which was tried. It ends with the publish, when the page needs every one of them.

**Left for later.** The English pages draw the Arabic Screen mock images until ticket 41 exports English ones — the descriptions and captions are English already, in «شاشات المنصة»'s draft — so the home and product pages are best published in English after it. `llms.txt` stays Arabic, as its own comment says the site is: an English one is a question for when the English pages are published.
