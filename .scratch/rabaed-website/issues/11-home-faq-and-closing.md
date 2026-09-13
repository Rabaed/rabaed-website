# 11: Home — FAQ and closing section

**What to build:** The end of the homepage: the expandable FAQ entries and the closing three-step section with the demo request form laid out. The form is presentation only in this ticket; it starts working in ticket 27.

**Blocked by:** 04

**Status:** resolved

- [x] FAQ entries expand and collapse, using native disclosure elements so search engines and AI can read the answers
- [x] Closing section and its steps match baselines — measured against the Reference site itself, at all sixteen baseline viewports. The text-wrapping exception does not apply to the home page; see below
- [x] The demo request form is marked up as a real form with named fields, ready to be wired
- [x] No fake success message anywhere; the Reference site's `data-fake-send` behaviour is not carried over
- [ ] Homepage as a whole now matches baselines at all eight widths — **not possible yet, and handed on to ticket 10**: this ticket was taken before 09 and 10, so the middle of the page is still missing
- [x] Zero console errors and zero failed requests across the full page — held by `tests/e2e/health.spec.ts`, which already covers `/`

**Note:** ticket 04 built this section's left column already, from the same Reference markup, so this ticket adds the form beside it rather than starting from nothing. Filling that second column also closes bug 44 — check whether it is still open when this is done.

## Comments

**What was built.** The last two sections of the home page, after the figures deck: «قبل أن تسأل», three questions that open to their answers, with a link to all of them on the start page; and «كيف نبدأ معك», the three steps to going live beside the demo request form. All copy is verbatim from `reference/site/index.html`.

Four pieces, all server components, because four other pages reuse them:

- **`src/components/faq.tsx`** — a row of questions, each a native `<details>`. The answers are in the page whether a question is open or closed, which is what a crawler reads, and opening one needs no script. Referral, partnership and tool pages use the same `.fq-row` markup (tickets 14–16); the start page lays its questions out differently (ticket 13).
- **`src/content/faq.ts`** — the questions, grouped by page. Ticket 22 moves them into the CMS.
- **`src/components/demo-request-form.tsx`** — the one demo request form, placed on the home, product and start pages.
- **`src/components/closing-section.tsx`** — «كيف نبدأ معك», which the home and product pages end on. Ticket 04's steps moved here from the home page.

The shared `.qa`, `.fq-row` and disabled-button rules sit in `tokens.css` beside the teaser head and foot, for the same reason: they are pieces pages are built from. `.form` sits in `shell.css` beside the closing section; its phone rule is in `responsive.css`, where the Reference site's late responsive block lives.

### The form is real, and says so by not pretending

A `<form method="post">` with six named fields — `name`, `email`, `role` (`owner` / `consultant` / `contractor`), `phone`, `company`, `activeProjects` — so ticket 27 only has to give it somewhere to send.

**The submit button is disabled until then.** The Reference site's form "sends" by revealing a hidden «وصلنا طلبك» under the button, without sending anything; that is not carried over, and neither is its script. A form that looked usable and did nothing would be the same lie told more quietly, so the button is greyed out, in the Reference site's own disabled style from its tool page. With the only submit button disabled, pressing Enter in a field sends nothing either — that is how browsers treat implicit submission.

**Worth knowing before anyone looks at a preview:** the header's and the hero's «احجز عرضاً حياً» now land on a form whose button cannot be pressed, with nothing telling the visitor why. That is the honest state until ticket 27. No field is marked `required` yet; validation belongs to ticket 27 too.

### Deliberate differences from the Reference site

- **No fake confirmation**, above.
- **The disabled button.** Grey, with a 1px border the enabled button has not, so everything below the button sits 2px lower than on the Reference site.
- **«60 يوماً» in the guarantee pill** sets only the numeral in DM Mono, as the hero's pill already does. The Reference site sets the Arabic word in DM Mono too, which has no Arabic glyphs.
- **The jump to the form.** The Reference site scrolls there by script, stopping 78px short so the fixed header does not cover the form. Here `scroll-margin-top: 78px` stops in the same place with no script; the move is instant rather than smooth.

### The text-wrapping exception belongs to tickets 15 and 16

The handoff's exception — `.tail-steps .ph { white-space: normal; min-width: 0 }` — exists only on the referral and partnership Reference pages, whose step labels are longer. The home page has no `.ph`. A note is on tickets 15 and 16.

### Tests

`tests/e2e/home-faq-and-closing.spec.ts`: both sections in the first response, every answer included, with no fake confirmation; an answer opening and closing with JavaScript off, and from the keyboard; the form's fields and their names and values; nothing pretending to send — no request goes out, the address does not change, the button stays disabled and what was typed stays put, whether Enter is pressed or the button is forced; the hero's call to action landing on the form clear of the header on a short window; and the form beside the steps at 1280px, below them at 980px.

`tests/e2e/home-faq-and-closing-match-reference.spec.ts` compares the questions and the closing section, part by part, against the Reference page at all sixteen baseline viewports. The questions are measured closed. Left out, and only where they reach: the guarantee line's width and face, the button's colours and height, and the 2px that border adds below it.

**Verified by falsification.** Changing the question cards' padding by one pixel failed all sixteen viewports. Removing the phone rule that stacks the form's paired fields failed exactly 360px and 390px. Removing the scroll margin failed exactly the call-to-action test. Enabling the submit button failed exactly the test that nothing pretends to send.

### What the review changed

Two reviews. The spec review checked every text node, placeholder and label character for character against the Reference site and found them verbatim, and confirmed the `.ph` exception does not apply here. The standards review checked every CSS value against the Reference site and found them exact. What they did find:

- **This ticket and bug 44 were not written up.** They are now; bug 44 is resolved, and the whole-homepage criterion is on ticket 10, so someone owns it.
- **Comments said the start page ends on the closing section.** It does not — its form stands beside its questions. They say home and product now.
- **The form's phone rule was in `shell.css`** and read as a finding of ours. It is the Reference site's own rule, in `responsive.css` with its reason.
- **Stale comments** in the hero, the header and the home comparison spec still said `#demo` had nowhere to go, or that tickets 07–11 were missing.
- **The "no fake send" check looked for an attribute the home page never had.** It now also checks that `#sent` is absent.

### Not covered

**The disabled button cannot be focused**, so a keyboard or screen-reader visitor finds nothing to tell them the form is not ready. It lasts until ticket 27, and is the kind of thing ticket 36's accessibility pass should check has gone.

**Other in-page anchors** — `#journey` among them — will want the same 78px scroll margin when the sections they point at are built; the Reference site's script applies it to all of them.
