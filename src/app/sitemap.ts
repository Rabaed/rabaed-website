import type { MetadataRoute } from 'next';
import { allPublishedPosts } from '@/cms/blog';
import { allPublishedCaseStudies } from '@/cms/case-studies';
import { blogPostPath } from '@/lib/blog-paths';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { siteOrigin } from '@/lib/environment';
import { localePath } from '@/lib/locales';

/**
 * The Arabic site's pages, as they stand. The English site's pages join it
 * when ticket 40 switches English on; until then `/en` is a placeholder.
 */
const PAGES = ['/', '/product', '/start', '/tool', '/referral', '/partnership', '/blog', '/terms', '/privacy', '/referral-terms'];

/**
 * `sitemap.xml`: the site's pages and every published article and case study,
 * in whichever language it is published (tickets 23 and 24). A draft is never
 * listed, and an entry leaves when it is unpublished: publishing and
 * unpublishing mark this stale along with the pages (`src/cms/revalidation.ts`).
 *
 * Pages are listed by name, not found by walking the routes, so nothing that
 * is not a page of the site can reach it: not the Screen mock studio, the CMS
 * admin, or the English placeholder (ticket 31).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  // The home page is the bare origin, as its canonical URL is.
  const url = (path: string) => `${origin}${path === '/' ? '' : path}`;

  const [posts, caseStudies] = await Promise.all([allPublishedPosts(), allPublishedCaseStudies()]);

  return [
    ...PAGES.map((path) => ({ url: url(path) })),
    // The case studies index is one of the Arabic site's pages once the section
    // shows there. Like `/en/blog`, the English index waits for English.
    ...(caseStudies.some((caseStudy) => caseStudy.locale === 'ar') ? [{ url: url(CASE_STUDIES_PATH) }] : []),
    ...posts.map((post) => ({
      url: url(localePath(post.locale, blogPostPath(post.slug))),
      lastModified: post.updatedAt,
    })),
    ...caseStudies.map((caseStudy) => ({
      url: url(localePath(caseStudy.locale, caseStudyPath(caseStudy.slug))),
      lastModified: caseStudy.updatedAt,
    })),
  ];
}
