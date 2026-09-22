import type { MetadataRoute } from 'next';
import { trainingCrawlersAllowed } from '@/cms/crawler-policy';
import { siteOrigin } from '@/lib/environment';

/**
 * `robots.txt`: every crawler may reach every page, and is told where the
 * sitemap is — with the one distinction that decides whether Rabaed is quoted
 * in AI answers (ticket 33; HANDOFF §6.2).
 *
 * **Retrieval and citation crawlers** fetch a page at the moment somebody asks
 * a question, and name the source in the answer. They are how Rabaed gets
 * quoted *now*, so they are allowed here by name and no switch can refuse
 * them. **Training crawlers** copy the site to train a model, which is how
 * Rabaed is known from inside a model in a year or two — with no citation,
 * visit or link. That is a business decision, not a technical one, so it is a
 * switch in the CMS (`src/cms/globals/ai-crawlers.ts`), defaulting to
 * allowed, with the trade-off written beside it in Arabic where Ahmed flips
 * it.
 *
 * Nothing is disallowed for anything else, before launch or after. Before
 * launch the site is kept out of search results by `noindex`
 * (`src/lib/metadata.ts`, `next.config.ts`), and a crawler refused a page here
 * never reads its `noindex` — it can still list the bare address from a link
 * elsewhere. The CMS admin is not named either: it carries its own `noindex`,
 * and a line here would publish its non-obvious address to anyone who reads
 * the file.
 *
 * `Google-Extended` and `Applebot-Extended` are deliberately absent: they opt
 * out of training alone and do nothing for AI Overviews, and naming
 * `Googlebot` in a refusal would hide the whole site from Google.
 */

/**
 * Crawlers that fetch a page to answer a question being asked, and cite it.
 * Both halves of each assistant: the one that crawls ahead of time for its
 * search index, and the one that fetches a page a person named.
 */
const RETRIEVAL_CRAWLERS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'Amazonbot',
];

/** Crawlers that collect pages to train a model. The switch above governs these and only these. */
const TRAINING_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Meta-ExternalAgent', 'CCBot'];

/**
 * The floor under `robots.txt`: whatever becomes of a publish's mark, it is
 * rebuilt at most ten minutes after it was last built (ticket 66, ADR-0016).
 *
 * Its own, because a discovery file is a route beside the layouts rather than
 * beneath one, so no layout's age reaches it — the same reason
 * `DISCOVERY_FILES` exists in `src/cms/revalidation.ts`. Written out rather
 * than imported because Next reads only a literal; `src/lib/cache-age.ts`
 * holds the number and the reason it is that number.
 */
export const revalidate = 600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const training = await trainingCrawlersAllowed();

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: RETRIEVAL_CRAWLERS, allow: '/' },
      { userAgent: TRAINING_CRAWLERS, ...(training ? { allow: '/' } : { disallow: '/' }) },
    ],
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
