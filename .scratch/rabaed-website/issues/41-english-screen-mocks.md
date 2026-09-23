# 41: English Screen mocks — Stage 2

**What to build:** A second set of Screen mock images with English interface labels, so the English pages show screens an English reader can follow.

**Blocked by:** 05, 40

**Status:** resolved — the English descriptions wait in the CMS as a draft for the founder to publish; see below

- [x] English text supplied for every mock and translated in the studio source, not painted onto the images
- [x] Mocks laid out left-to-right where the interface direction matters
- [x] English set exported by the same script that produces the Arabic set
- [x] English pages serve the English mocks; Arabic pages are unaffected
- [x] Descriptions and captions translated too — a mock with an Arabic description on an English page helps nobody

## Comments

**Found in review and fixed.** Saad Al-Qahtani's avatar on the English submittal read *SO*, Sara Al-Otaibi's initials — «سع» is hers everywhere else. The project storage read *4.2 GB / 20*, without its unit. The kanban named the contractor's project manager two ways. The page-language test passed silently over a picture whose address it could not read, and the mirror test did not check the Arabic card was anchored the same way up.

**What was built.** An English set of all eight Screen mocks: `src/screen-mocks/en/`, exported by the same `npm run mocks:export` into `public/screen-mocks/en/` and recorded in `exported.json` beside the Arabic. No code change was needed to export them — ticket 05 made the studio and the script loop over whichever languages have markup on disk. The Arabic images came out of the new run byte-identical.

**Translated in the markup, and mirrored.** Each English file is its Arabic one element for element, with the words in English and the layout turned around: `dir="ltr"`, every `left` and `right` offset swapped, a four-value padding's two sides swapped, the icon rail's shadow thrown to its other side, `text-align` swapped, a tilt's sign reversed, and the left-pointing chevrons pointing right. Charts, signatures and stamps are pictures of things rather than of the interface, and keep their direction. Numbers are Western digits; dates stay day first (`23/08/2026`), as the Arabic has them. The stamped sheet already carried its disclaimer in English under the Arabic one, so the English sheet carries that one alone. The rules are written in `src/screen-mocks/registry.ts`.

**Checked by eye, and shortened where English ran long.** Each English mock was photographed and read against its Arabic one. Where the English wrapped or covered something the Arabic did not, the words were shortened rather than the layout changed — the disciplines read *Civil*, *Electrical*, *Architectural* in the breakdown cards; the stamped sheet's badge says *A stamped sheet as proof*; *In review* rather than *Under review*. Names are transliterated (*Eng. Sara Al-Otaibi*, *Al-Yasmin Towers*), avatars carry Latin initials, and the English job titles are the ones the Arabic mocks already printed in English (*Consultant Project Manager*).

**Tested.** `screen-mocks.spec.ts` now holds every language to the registry, checks each English export against its markup (hash in CI, pixels locally, as the Arabic is), and for each English mock: `lang="en"` and `dir="ltr"`, no Arabic letter anywhere in it, the same elements in the same order as the Arabic, and each card on the stage at the Arabic card's mirrored position — by the edges it is anchored by, since English words change a card's size. A last test holds every exported picture on every page to its page's language; English pages show no mock until ticket 42, and are checked from the moment they do.

**English pages serve the English mocks.** A page's Screen mock content now carries its language, and the picture is that language's export (`src/components/screen-mock-picture.tsx`). The Arabic pages are unchanged.

**A replacement picture per language — a decision beyond the ticket's words.** An Editor could replace a mock's picture with one of his own (ticket 57), one picture for both languages. With an English set, that would put his Arabic screenshot on the English pages under an English caption — the same failure as an Arabic description on an English page, which the ticket rules out. So each mock now has **Replacement picture, Arabic pages** (the existing one) and **Replacement picture, English pages** (new, empty), and each language falls back to its own export. `20260923_100000_english_screen_mock_pictures` adds the columns; nothing a visitor sees changes.

**The descriptions and captions in English wait as a draft.** They are an Editor's words, so, as ticket 40 did with the header, `20260923_100100_propose_english_screen_mock_words` writes the English of all eight into a **draft** of «شاشات المنصة» with English added to its languages, and publishes nothing. `product-text.spec.ts` finds the proposal, checks every word and the untouched Arabic, and publishes it once and puts the published entry straight back — proving the CMS accepts it as it stands. No visitor sees it before ticket 42 in any case, since no English page shows a screen yet. `docs/deployment.md` tells the founder what to do, under «The English screen descriptions, waiting for a decision». Resolved rather than left `ready-for-human`, as ticket 40 was, because what remains is one press of Publish on words only the founder can approve. Ticket 42 can be built meanwhile, but its English home and product pages cannot be published before this is — see below.

**What is not yet seen working.** No English page shows a screen until ticket 42, so the English half of «English pages serve the English mocks» is built and tested at the level of the code and the studio, not yet on a page: the test holding every page's pictures to its language reads `/en` and `/en/product` and finds none there today. Likewise an Editor's English replacement is tested only for leaving the Arabic pages alone. Ticket 42 should add the positive checks — an English page showing the English export, and the English replacement where one is chosen.

**For ticket 42.** Its English home and product pages get the English mocks by calling `getScreenMocks('en')`, as the Arabic ones call it with `'ar'`. Until the founder publishes the English descriptions it refuses, as every entry not published in a language does (`src/cms/pages.ts`) — so those pages wait on that Publish as on their own words. `screen-mocks.spec.ts` already reads `/en` and `/en/product` for mocks.
