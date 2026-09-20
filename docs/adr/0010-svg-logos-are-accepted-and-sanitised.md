# A client's logo may be an SVG, and nothing is stored until it is sanitised

The media collection refused SVG until now, and said so in its own comment: an SVG is a document that can carry script, and served from the site's own domain it would run with the site's authority. Ticket 20 puts the Trust strip's logos in the CMS, where Ahmed adds a client the day one signs — and a client's logo arrives as a vector often enough that refusing it would send him to a designer each time. The founder chose on 20 September 2026 to accept SVG.

So SVG is accepted, and what is stored is not what was uploaded: it is what survives `src/cms/svg-sanitiser.ts`. Script, event handlers, `javascript:` links, `foreignObject`, animation elements and every reference to another file are taken out; a file carrying a `DOCTYPE` or an `ENTITY` is refused outright, because an entity is resolved by the parser, so by the time anything could strip it a file off the server may already be in the text; and a file with no drawing left is refused rather than stored empty.

The rule is an allowed list — DOMPurify's SVG profile, narrowed — not a forbidden one, because a forbidden list is a list of the attacks somebody has already thought of. DOMPurify rather than anything written here: sanitising XML by hand is how this goes wrong, and it is the library the people who find these attacks maintain.

The site draws a logo in an `<img>`, where a browser runs none of an SVG's script. That is not the reason this is safe: an uploaded file keeps an address of its own, and following that address is enough. The sanitiser is the defence; the `<img>` is a second one.

## Consequences

- `src/cms/collections/media.ts` accepts `image/svg+xml` and sanitises it in `beforeOperation`, before the file is written anywhere. An Editor is told, in their own language, why a file was refused.
- An SVG is the one upload stored as it arrived rather than as WebP: Payload resizes and re-encodes none of it (`canResizeImage`), which is what makes sanitising the whole of the defence.
- An SVG carries no width or height for the browser to reserve space with, as a PNG does. The Trust strip gives every mark a fixed height and lets the width follow, so a logo's shape cannot move the bar about as it loads.
- `tests/unit/svg-sanitiser.spec.ts` states case by case what must not survive; `tests/e2e/trust-strip.spec.ts` asks that an upload actually reaches it.
- The dependency is `dompurify` with `jsdom`. jsdom rather than happy-dom, which parses `<svg>` into the HTML namespace, where DOMPurify rightly refuses it and the drawing's own root — its `viewBox` with it — is thrown away.
