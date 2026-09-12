# Next.js rather than Astro or Eleventy

`reference/HANDOFF.md` recommends Astro or Eleventy and rules out React, on the grounds that a React site hides its content behind JavaScript and destroys GEO. That reasoning applies to a client-rendered SPA, not to Next.js App Router with server components, which emits the complete document in the first server response — satisfying the handoff's own governing rule.

We chose Next.js because the site needs a CMS whose admin, localisation and (later) block-based page building live in the same application, and because a future product app at `app.rabaedapp.com` may share this stack. Astro would have been lighter for a purely static site but pushes the CMS into a third-party service.

## Consequences

- The "complete HTML in the first response" rule is now a **test**, not an assumption: the e2e suite asserts that page text is present in the server-rendered HTML for every route.
- Client-side rendering for primary content is prohibited. Interactivity is added to server-rendered markup, never used to produce it.
