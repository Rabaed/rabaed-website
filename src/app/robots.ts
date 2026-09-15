import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/environment';

/**
 * `robots.txt`: every crawler may reach every page, and is told where the
 * sitemap is (ticket 31).
 *
 * Nothing is disallowed, before launch or after. Before launch the site is
 * kept out of search results by `noindex` (`src/lib/metadata.ts`,
 * `next.config.ts`), and a crawler refused a page here never reads its
 * `noindex` — it can still list the bare address from a link elsewhere. The
 * CMS admin is not named either: it carries its own `noindex`, and a line here
 * would publish its non-obvious address to anyone who reads the file.
 *
 * Ticket 33 splits this rule into retrieval crawlers and training crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
