/**
 * The maximum age as a visitor's browser — and Vercel's edge — actually
 * receives it (ticket 66, ADR-0016).
 *
 * A page is rebuilt when a publish marks it stale and at no other time, so
 * anything that loses a mark leaves that page wrong until somebody publishes
 * again. Ten minutes is the floor under that, set on the two site layouts and
 * on each of the three discovery files.
 *
 * **Why this is asked of the running application rather than of the build.**
 * The whole point of setting the age on two layouts instead of twenty pages is
 * that a route takes the lowest age in its chain; a spec that read the
 * `export const revalidate` lines would assume that inheritance rather than
 * show it. The build's manifest does record what Next resolved, but it records
 * it only for routes prerendered at build time — the blog posts and the case
 * studies, which are rendered on demand and are exactly the CMS-driven pages a
 * lost mark hurts most, are absent from it. What every route has in common is
 * the response, so the response is what this reads: Next sets
 * `s-maxage={revalidate}` on a route with an age and `s-maxage=31536000` on one
 * without (`node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md`).
 *
 * It is also the seam the spec asks for — the running application, the highest
 * point (spec: Testing Decisions). `tests/unit/cached-page-age.spec.ts` holds
 * the literals to `MAX_PAGE_AGE_SECONDS`, which is the repository's own
 * consistency and the one thing no running application can observe.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { MAX_PAGE_AGE_SECONDS } from '../../src/lib/cache-age';

/** What Next sends for a route that has an age. */
const CARRIES_THE_AGE = `s-maxage=${MAX_PAGE_AGE_SECONDS}`;

/** What Next sends for a static route that has none: a year, which is what every page of this site had before ticket 66. */
const CARRIES_A_YEAR = 's-maxage=31536000';

/** Every page of the site, Arabic and English, as `src/app/sitemap.ts` and the English placeholder list them. */
const PAGES = [
  '/',
  '/product',
  '/start',
  '/tool',
  '/referral',
  '/partnership',
  '/blog',
  '/case-studies',
  '/terms',
  '/privacy',
  '/referral-terms',
  '/en',
  '/en/blog',
  '/en/case-studies',
];

/**
 * The routes rendered on demand rather than at build time: an article, a case
 * study, a page of the blog index. Asked for with a name nothing answers to,
 * because what is being read is the header the segment chain gives the
 * response — which a 404 from that chain carries exactly as a published
 * article does, and which needs no content seeded to be true.
 */
const RENDERED_ON_DEMAND = [
  '/blog/nothing-is-published-here',
  '/case-studies/nothing-is-published-here',
  '/blog/page/2',
  '/en/blog/nothing-is-published-here',
  '/en/case-studies/nothing-is-published-here',
];

const cacheControl = async (request: APIRequestContext, path: string): Promise<string> =>
  (await request.get(path)).headers()['cache-control'] ?? 'nothing';

test.describe('every page a visitor can reach has a maximum age', () => {
  for (const path of PAGES) {
    test(`${path} is rebuilt at most ten minutes after it was last built`, async ({ request }) => {
      expect(
        await cacheControl(request, path),
        `${path} was served without the maximum age, so a publish whose mark went astray leaves it wrong until the next publish (ticket 66).`,
      ).toContain(CARRIES_THE_AGE);
    });
  }

  for (const path of RENDERED_ON_DEMAND) {
    test(`${path} inherits it, being rendered on demand`, async ({ request }) => {
      expect(
        await cacheControl(request, path),
        `${path} did not inherit the age from its layout. These are the CMS-driven routes — an article, a case study — and the ones a lost mark hurts most.`,
      ).toContain(CARRIES_THE_AGE);
    });
  }

  test('`llms.txt` carries its own, having no layout above it', async ({ request }) => {
    expect(await cacheControl(request, '/llms.txt')).toContain(CARRIES_THE_AGE);
  });

  /**
   * `sitemap.xml` and `robots.txt` are the metadata-file convention rather than
   * route handlers, and Next serves them `must-revalidate` instead of an
   * `s-maxage`: a cache must ask the origin every time, and the origin answers
   * from its own store, where the age they set does apply. So they are no
   * staler than the pages — the number simply is not visible here, and
   * asserting it were would be asserting a thing that is not true.
   */
  for (const path of ['/sitemap.xml', '/robots.txt']) {
    test(`${path} is revalidated against the origin every time`, async ({ request }) => {
      expect(await cacheControl(request, path)).toContain('must-revalidate');
    });
  }

  /**
   * The Screen mock studio is built from HTML on disk (ADR-0002) and changes
   * only when a deploy changes it, so no publish can make it stale and a floor
   * would buy nothing. Asserted rather than assumed, because the exclusion is a
   * decision and this is the only place it can be seen to still hold.
   */
  test('the Screen mock studio is deliberately left without one', async ({ request }) => {
    const header = await cacheControl(request, '/studio/ar/overview');

    expect(header, 'the studio was given a maximum age; nothing a publish does can make it stale.').toContain(
      CARRIES_A_YEAR,
    );
    expect(header).not.toContain(CARRIES_THE_AGE);
  });
});
