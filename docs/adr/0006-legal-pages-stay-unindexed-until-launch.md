# The legal pages stay out of search results until launch, like the rest of the site

Ticket 17 asks that the Terms, Privacy Policy and Referral Terms "remain indexable while the rest of the site is blocked during development". It is carried over from the Reference site, whose three legal pages alone say `index,follow` while six of its other pages say `noindex`. We are not building it: the legal pages are blocked exactly as every other page is, and become indexable at launch with the rest of the site.

The spec's own rules point the other way. The whole site is "invisible to search engines until we launch" (user story 62), removing that block is "a deliberate launch step" (story 63, ticket 39), and preview deployments are blocked forever. An exception for three pages would put the Terms in search results at a temporary `vercel.app` address long before `rabaedapp.com` exists, where they would stay as duplicates of the real pages. The founder chose this on 13 September 2026, when ticket 17 was built.

## Consequences

- The legal pages are listed in `tests/e2e/routes.ts` like every other page, so `indexing.spec.ts` holds them to the same block.
- `noindex` hides a page from search results; it does not hide the page. Anyone with the link can read the Terms and the Privacy Policy on any deployment — which is what an app store, a payment provider or a sign-in provider needs when it asks for a policy's address.
- Nothing about the legal pages needs to change at launch: ticket 39's single step unblocks them with everything else.
