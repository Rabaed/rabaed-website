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
 * Built on each request, not ahead of time (ticket 111). When the build hands
 * the host its outputs, Next makes a route built ahead of time at a metadata
 * file's address a static file, and leaves out its function
 * (`node_modules/next/dist/build/adapter/build-complete.js`, Next 16.3.5). So
 * on `rabaedapp.com` this stayed as the last deploy wrote it: neither a
 * publish's mark nor a ten-minute age (ADR-0016) could reach it. Built on
 * each request, it is a function the host keeps, and a publish is in it at
 * once. It costs a few reads of the CMS per crawler's visit.
 * `tests/unit/discovery-files-on-the-host.spec.ts` holds it.
 */
export const dynamic = 'force-dynamic';

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
