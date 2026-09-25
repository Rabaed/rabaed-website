import type { MetadataRoute } from 'next';
import { allPublishedPosts } from '@/cms/blog';
import { pageEntry } from '@/cms/pages';
import { allPublishedCaseStudies } from '@/cms/case-studies';
import { isPublishedIn } from '@/content/pages/languages';
import { blogPostPath } from '@/lib/blog-paths';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { absoluteUrl } from '@/lib/environment';
import { DEFAULT_LOCALE, localePath } from '@/lib/locales';
import { MARKETING_PAGES, MARKETING_PAGE_KEYS, SITE_PAGES } from '@/lib/page-registry';

/**
 * The Arabic site's pages other than the marketing pages: the blog's index
 * and the legal documents. The case studies' index is listed below, once it
 * has something to list.
 */
const PAGES = [SITE_PAGES.blog, SITE_PAGES.terms, SITE_PAGES.privacy, SITE_PAGES['referral-terms']].map((page) => page.path);

/**
 * The floor under `sitemap.xml`: whatever becomes of a publish's mark, it is
 * rebuilt at most ten minutes after it was last built (ticket 66, ADR-0016).
 *
 * Its own, because a discovery file is a route beside the layouts rather than
 * beneath one, so no layout's age reaches it — the same reason
 * `DISCOVERY_FILES` exists in `src/lib/page-registry.ts`. Written out rather
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
 * Pages are listed by name — the page registry's, `src/lib/page-registry.ts` —
 * not found by walking the routes, so nothing that is not a page of the site
 * can reach it: not the Screen mock studio, the CMS
 * admin, the English placeholder (ticket 31), or the notice at the English
 * address of a page not yet in English (ticket 42).
 *
 * A marketing page carries the day its entry was last published, in either
 * language — its words, and since ticket 91 its search title and description
 * (ticket 26). A sitemap has nowhere to put a title or a description — an
 * entry is an address and a date — so the date is what a change to a page or
 * to how it is described can show here, and it is the one thing a crawler
 * reads it for. The other pages carry no date: the day an entry that
 * describes none of them was published would say nothing about them.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, caseStudies, marketing] = await Promise.all([
    allPublishedPosts(),
    allPublishedCaseStudies(),
    Promise.all(
      MARKETING_PAGE_KEYS.map(async (page) => {
        const { path, entry: own } = MARKETING_PAGES[page];
        const [entry, inEnglish] = await Promise.all([
          pageEntry(own.slug, DEFAULT_LOCALE),
          isPublishedIn(page, 'en'),
        ]);
        return { path, inEnglish, lastModified: entry.updatedAt ?? undefined };
      }),
    ),
  ]);

  return [
    ...marketing.map(({ path, lastModified }) => ({ url: absoluteUrl(path), lastModified })),
    ...PAGES.map((path) => ({ url: absoluteUrl(path) })),
    ...marketing
      .filter((page) => page.inEnglish)
      .map(({ path, lastModified }) => ({ url: absoluteUrl(localePath('en', path)), lastModified })),
    // The case studies index is one of the Arabic site's pages once the section
    // shows there. The English blog and case studies indexes are the English
    // site's pages once each has something published in English to list — until
    // then one is empty and the other is not there (ticket 43).
    ...(caseStudies.some((caseStudy) => caseStudy.locale === 'ar')
      ? [{ url: absoluteUrl(CASE_STUDIES_PATH) }]
      : []),
    ...(posts.some((post) => post.locale === 'en') ? [{ url: absoluteUrl(localePath('en', '/blog')) }] : []),
    ...(caseStudies.some((caseStudy) => caseStudy.locale === 'en')
      ? [{ url: absoluteUrl(localePath('en', CASE_STUDIES_PATH)) }]
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
