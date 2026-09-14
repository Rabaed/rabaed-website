/**
 * The blog's articles as the site reads them: what is published, and — while
 * an editor is previewing — the latest saved draft instead.
 *
 * An article is written once per language, each an entry of its own with its
 * own draft and publish (spec: Routing and localisation). A translation shares
 * its article's slug, so an article's address in each language is the one
 * `localePath` derives from `/blog/<slug>`, as for every other page.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type Where } from 'payload';
import { cache } from 'react';
import type { Locale } from '@/lib/locales';
import type { Post } from '@/payload-types';

/** Three rows of the index's three columns. */
export const POSTS_PER_PAGE = 9;

const PUBLISHED: Where = { _status: { equals: 'published' } };

export type PostsPage = { posts: Post[]; totalPages: number };

/**
 * One page of a language's published articles, newest first — or `null` for
 * a page past the last. A blog with no articles yet still has its first page.
 */
export async function publishedPosts(locale: Locale, page: number): Promise<PostsPage | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'posts',
    where: { and: [PUBLISHED, { locale: { equals: locale } }] },
    // Two articles dated the same day: the one written later first.
    sort: ['-publishedAt', '-createdAt'],
    limit: POSTS_PER_PAGE,
    page,
    depth: 1,
  });
  const totalPages = Math.max(result.totalPages, 1);
  return page > totalPages ? null : { posts: result.docs, totalPages };
}

/**
 * The article at this address in this language, as a visitor may see it.
 * Cached per request, because the page and its metadata both ask.
 */
export const findPost = cache(async (locale: Locale, slug: string): Promise<Post | null> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { locale: { equals: locale } }, ...(previewing ? [] : [PUBLISHED])],
    },
    draft: previewing,
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});

/** The languages the article at this address is published in. */
export const publishedLocales = cache(async (slug: string): Promise<Locale[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    depth: 0,
    pagination: false,
  });
  return docs.map((post) => post.locale);
});

/** Every published article, in one language or all of them. */
export async function allPublishedPosts(locale?: Locale): Promise<Post[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'posts',
    where: locale ? { and: [PUBLISHED, { locale: { equals: locale } }] } : PUBLISHED,
    depth: 0,
    pagination: false,
  });
  return docs;
}
