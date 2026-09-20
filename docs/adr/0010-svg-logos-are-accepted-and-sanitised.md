# A client's logo may be an SVG, and nothing is stored until it is sanitised

The media collection refused SVG until now, and said so in its own comment: an SVG is a document that can carry script, and served from the site's own domain it would run with the site's authority. Ticket 20 puts the Trust strip's logos in the CMS, where Ahmed adds a client the day one signs — and a client's logo arrives as a vector often enough that refusing it would send him to a designer each time. The founder chose on 20 September 2026 to accept SVG.

So SVG is accepted, and what is stored is not what was uploaded: it is what survives `src/cms/svg-sanitiser.ts`. Script, event handlers, `javascript:` links, `foreignObject` and animation elements are taken out, and so is every reference that leaves the file — whether it is carried by `href`, or by a `url(…)` inside `fill`, `filter`, `mask` or `clip-path`, which are not links and so were missed until the review of 20 September 2026 found them. A file carrying a `DOCTYPE` or an `ENTITY` is refused outright, because an entity is resolved by the parser, so by the time anything could strip it a file off the server may already be in the text; and a file with no drawing left is refused rather than stored empty.

**A logo carries no stylesheet**: neither a `<style>` element nor a `style` attribute. CSS is a second language, and it loads another file in ways a regular expression finds — `@import`, `url(…)` — and in ways it does not, the escape `\75 rl(…)` among them. Parsing it properly would be a second sanitiser to get right, and a drawing program writes `fill` and `stroke` on the shapes instead, which is what survives. The strip draws every mark in one colour in any case.

The rule is an allowed list — DOMPurify's SVG profile, narrowed — not a forbidden one, because a forbidden list is a list of the attacks somebody has already thought of. DOMPurify rather than anything written here: sanitising XML by hand is how this goes wrong, and it is the library the people who find these attacks maintain.

The site draws a logo in an `<img>`, where a browser runs none of an SVG's script. That is not the reason this is safe: an uploaded file keeps an address of its own, and following that address is enough. The sanitiser is the defence; the `<img>` is a second one.

## Consequences

- `src/cms/collections/media.ts` accepts `image/svg+xml` and sanitises it in `beforeOperation`, before the file is written anywhere, so a refusal leaves nothing behind. It decides by what the bytes are rather than by the type the upload declares, so a drawing sent as a photograph does not go by untouched. An Editor is told, in their own language, why a file was refused.
- What is stored is serialised as XML with its namespace declared, because that is how the file is served: an HTML serialisation would store `&nbsp;`, which no XML parser knows, and a drawing without its namespace is a broken image.
- An SVG is the one upload stored as it arrived rather than as WebP: Payload resizes and re-encodes none of it (`canResizeImage`), which is what makes sanitising the whole of the defence.
- An SVG carries no width or height for the browser to reserve space with, as a PNG does. The Trust strip gives every mark a fixed height and lets the width follow, so a logo's shape cannot move the bar about as it loads.
- `tests/unit/svg-sanitiser.spec.ts` states case by case what must not survive; `tests/e2e/trust-strip.spec.ts` asks that an upload actually reaches it.
- The dependency is `dompurify` with `jsdom`. jsdom rather than happy-dom, which parses `<svg>` into the HTML namespace, where DOMPurify rightly refuses it and the drawing's own root — its `viewBox` with it — is thrown away.
