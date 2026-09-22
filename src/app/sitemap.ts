import type { MetadataRoute } from 'next';
import { allPublishedPosts } from '@/cms/blog';
import { pageEntry } from '@/cms/pages';
import { allPublishedCaseStudies } from '@/cms/case-studies';
import { getHomePage } from '@/content/pages/home';
import { contentOrNull } from '@/content/pages/page-content';
import { getPartnershipPage } from '@/content/pages/partnership';
import { getProductPage } from '@/content/pages/product';
import { getReferralPage } from '@/content/pages/referral';
import { getStartPage } from '@/content/pages/start';
import { getToolPage } from '@/content/pages/tool';
import { blogPostPath } from '@/lib/blog-paths';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { absoluteUrl } from '@/lib/environment';
import { DEFAULT_LOCALE, localePath } from '@/lib/locales';

/** The Arabic site's pages, as they stand. */
const PAGES = ['/', '/product', '/start', '/tool', '/referral', '/partnership', '/blog', '/terms', '/privacy', '/referral-terms'];

/**
 * The marketing pages, each with what reads it in a language (ticket 42). An
 * English one is listed once it is published in English, and not before:
 * until then its address is a notice (`src/content/arabic-only-pages.ts`),
 * or, for the home page, the English site's word that it is on its way.
 */
const MARKETING_PAGES: readonly { readonly path: string; readonly read: (locale: 'en') => Promise<unknown> }[] = [
  { path: '/', read: getHomePage },
  { path: '/product', read: getProductPage },
  { path: '/start', read: getStartPage },
  { path: '/tool', read: getToolPage },
  { path: '/referral', read: getReferralPage },
  { path: '/partnership', read: getPartnershipPage },
];

/**
 * The floor under `sitemap.xml`: whatever becomes of a publish's mark, it is
 * rebuilt at most ten minutes after it was last built (ticket 66, ADR-0016).
 *
 * Its own, because a discovery file is a route beside the layouts rather than
 * beneath one, so no layout's age reaches it — the same reason
 * `DISCOVERY_FILES` exists in `src/cms/revalidation.ts`. Written out rather
 * than imported because Next reads only a literal; `src/lib/cache-age.ts`
 * holds the number and the reason it is that number.
 */
export const revalidate = 600;

/**
 * `sitemap.xml`: the site's pages and every published article and case study,
 * in whichever language it is published (tickets 23 and 24). A draft is never
 * listed, and an entry leaves when it is unpublished: publishing and
 * unpublishing mark this stale along with the pages (`src/cms/revalidation.ts`).
 *
 * Pages are listed by name, not found by walking the routes, so nothing that
 * is not a page of the site can reach it: not the Screen mock studio, the CMS
 * admin, the English placeholder (ticket 31), or the notice at the English
 * address of a page not yet in English (ticket 42).
 *
 * A page carries the day its search settings were last published (ticket 26).
 * A sitemap has nowhere to put a title or a description — an entry is an
 * address and a date — so the date is what a change to how a page is
 * described can show here, and it is the one thing a crawler reads it for.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, caseStudies, search, english] = await Promise.all([
    allPublishedPosts(),
    allPublishedCaseStudies(),
    pageEntry('search-settings', DEFAULT_LOCALE),
    Promise.all(MARKETING_PAGES.map(async (page) => ((await contentOrNull(page.read('en'))) === null ? [] : [page.path]))),
  ]);
  const described = search.updatedAt ?? undefined;

  return [
    ...PAGES.map((path) => ({ url: absoluteUrl(path), lastModified: described })),
    ...english.flat().map((path) => ({ url: absoluteUrl(localePath('en', path)), lastModified: described })),
    // The case studies index is one of the Arabic site's pages once the section
    // shows there. Like `/en/blog`, the English index waits for English.
    ...(caseStudies.some((caseStudy) => caseStudy.locale === 'ar')
      ? [{ url: absoluteUrl(CASE_STUDIES_PATH), lastModified: described }]
      : []),
    ...posts.map((post) => ({
      url: absoluteUrl(localePath(post.locale, blogPostPath(post.slug))),
      lastModified: post.updatedAt,
    })),
    ...caseStudies.map((caseStudy) => ({
      url: absoluteUrl(localePath(caseStudy.locale, caseStudyPath(caseStudy.slug))),
      lastModified: caseStudy.updatedAt,
    })),
  ];
}
