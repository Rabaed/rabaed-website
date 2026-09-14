import type { MetadataRoute } from 'next';
import { allPublishedPosts } from '@/cms/blog';
import { blogPostPath } from '@/lib/blog-paths';
import { siteOrigin } from '@/lib/environment';
import { localePath } from '@/lib/locales';

/**
 * The Arabic site's pages, as they stand. The English site's pages join it
 * when ticket 40 switches English on; until then `/en` is a placeholder.
 */
const PAGES = ['/', '/product', '/start', '/tool', '/referral', '/partnership', '/blog', '/terms', '/privacy', '/referral-terms'];

/**
 * `sitemap.xml`: the site's pages and every published article, in whichever
 * language it is published (ticket 23). A draft is never listed, and an
 * article leaves when it is unpublished: publishing and unpublishing mark this
 * stale along with the pages (`src/cms/revalidation.ts`).
 *
 * Ticket 31 owns the sitemap as a whole, and decides what else it carries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  // The home page is the bare origin, as its canonical URL is.
  const url = (path: string) => `${origin}${path === '/' ? '' : path}`;

  const posts = await allPublishedPosts();

  return [
    ...PAGES.map((path) => ({ url: url(path) })),
    ...posts.map((post) => ({
      url: url(localePath(post.locale, blogPostPath(post.slug))),
      lastModified: post.updatedAt,
    })),
  ];
}
