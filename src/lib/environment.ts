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
