/**
 * Whether search engines and AI crawlers may index this deployment.
 *
 * Two conditions, both required, because there are two ways to be visible by
 * accident. `VERCEL_ENV` blocks every preview and development deployment
 * automatically and permanently — nobody has to remember. `SITE_INDEXABLE`
 * keeps the production deployment blocked as well until launch is a decision
 * somebody makes: pushing to `main` creates a production deployment long
 * before the site is fit to be found (spec: user stories 62 and 63).
 *
 * Ticket 39 sets `SITE_INDEXABLE=true` on the production environment as its
 * single, deliberate go-live step. Nothing else should ever set it.
 */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV === 'production' && process.env.SITE_INDEXABLE === 'true';
}

/**
 * The origin canonical URLs are built from.
 *
 * A preview points at itself rather than at production, so a canonical tag
 * seen on a preview link never sends anyone to a page that does not exist yet.
 * Locally it follows the port the server was actually started on, because a
 * canonical URL naming a port nothing is listening on is the kind of wrong
 * that only shows up once someone trusts it.
 */
export function siteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === 'production') return 'https://rabaedapp.com';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}

/**
 * A page's absolute address, from the path it has in its locale
 * (`localePath`). The home page is the bare origin, as its canonical URL is —
 * one rule, because the sitemap, the structured data and `llms.txt` all write
 * addresses out and a site whose pages have two spellings has to undo it in
 * canonical tags forever (`src/lib/locales.ts` says the same of `/ar`).
 */
export function absoluteUrl(localePath: string): string {
  return `${siteOrigin()}${localePath === '/' ? '' : localePath}`;
}

/**
 * Whether this build is going to be reachable from the public internet: any
 * Vercel deployment at all — preview, development or production, indexable or
 * not. Local builds and the test suite are not deployments.
 *
 * Wider than `isIndexable`, and on purpose. `noindex` asks search engines not
 * to list a page; it does not stop anyone who has the address from reading it,
 * nor an AI assistant fetching a page a user pastes in. Content that may not be
 * published at all has to stay off every deployment, not only the indexable
 * one (ticket 47).
 */
export function isPubliclyDeployed(): boolean {
  return Boolean(process.env.VERCEL_ENV);
}

/**
 * Whether the Screen mock studio answers here (ADR-0002, ticket 98): on every
 * deployment but production, and locally.
 *
 * It exists to be photographed by `npm run mocks:export` and compared by the
 * suite, which both run locally, and to be looked at by the founder on a
 * preview, which Vercel's sign-in already guards (ticket 78). On the live site
 * it would only be one more address for a scanner to find.
 *
 * Read when the page is asked for, in `src/proxy.ts`, rather than when the
 * site is built, so that one build answers as the deployment it is serving.
 */
export function servesScreenMockStudio(): boolean {
  return process.env.VERCEL_ENV !== 'production';
}

/**
 * Whether this build reports what visitors do to Vercel's Web Analytics and
 * Speed Insights (ticket 34).
 *
 * The production deployment alone. Narrower than `isPubliclyDeployed` on
 * purpose: a preview deployment is looked at by us — the founder reviewing a
 * pull request, a lawyer reading a draft — and a visit of ours counted among
 * the site's visitors is worse than not counting it, because the number it
 * spoils is the one the team is trying to read. Speed Insights is the same
 * story: a preview's page speed is our own browser on our own connection.
 *
 * It is also what keeps the two measurement scripts out of a local build,
 * where nothing serves them: they are fetched from the deployment's own
 * origin, so a local page asking for them would ask for something that is not
 * there (`tests/e2e/analytics.spec.ts`).
 *
 * The events the site raises are not gated on this — they are raised
 * everywhere and go nowhere when no script is listening, which is what lets
 * the suite check that the right ones are raised at all.
 */
export function isMeasured(): boolean {
  return process.env.VERCEL_ENV === 'production';
}
