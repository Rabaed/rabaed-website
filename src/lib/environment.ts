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
