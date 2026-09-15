import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorialFrame, EditorialHero, MediaImage, PublishedDate } from '@/components/editorial';
import { publishedPosts } from '@/cms/blog';
import { fetchedMedia } from '@/cms/fetched-media';
import { BLOG_COPY } from '@/content/blog';
import { blogIndexPath, blogPostPath } from '@/lib/blog-paths';
import { localePath, type Locale } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';
import type { Post } from '@/payload-types';

/**
 * The page number in a `/blog/page/<number>` address, or `null` when it names
 * no page that address may carry: page 1, whose address is `/blog`, and forms
 * like `02` that would give a page a second address.
 */
export function laterPageNumber(value: string): number | null {
  return /^[1-9]\d*$/.test(value) && value !== '1' ? Number(value) : null;
}

/**
 * A page of the index's title, description and addresses. The first page
 * exists in every locale; a later one only where there are articles enough to
 * fill it, so it names no alternate it cannot vouch for.
 */
export function blogIndexMetadata(locale: Locale, page: number): Metadata {
  const copy = BLOG_COPY[locale];
  return pageMetadata({
    locale,
    locales: page === 1 ? undefined : [locale],
    path: blogIndexPath(page),
    title: page === 1 ? copy.metaTitle : `${copy.metaTitle} — ${copy.page} ${page}`,
    // Numbered like the title, so no two pages of the index share a description.
    description: page === 1 ? copy.lead : `${copy.lead} — ${copy.page} ${page}`,
  });
}

/**
 * The blog index (ticket 23): a language's published articles, newest first,
 * a page at a time, each linking to its own address. Drafts never appear here,
 * not even in preview — an article is previewed at its own address.
 */
export async function BlogIndexPage({ locale, page }: { locale: Locale; page: number }) {
  const copy = BLOG_COPY[locale];
  const listing = await publishedPosts(locale, page);
  if (!listing) notFound();

  const pageHref = (number: number) => localePath(locale, blogIndexPath(number));

  return (
    // The blog is not in the navigation, so no link in the header is marked.
    <EditorialFrame locale={locale} path={blogIndexPath()}>
      <EditorialHero eyebrow={copy.eyebrow} title={copy.title}>
        <p className="lead">{copy.lead}</p>
      </EditorialHero>

      <section className="light entry-list">
        <div className="wrap">
          {listing.posts.length === 0 ? (
            <p className="entry-empty">{copy.empty}</p>
          ) : (
            <div className="entry-grid">
              {listing.posts.map((post) => (
                <PostCard key={post.id} locale={locale} post={post} />
              ))}
            </div>
          )}

          {listing.totalPages > 1 && (
            <nav className="entry-pages" aria-label={copy.pages}>
              {page > 1 ? (
                <a className="tz-more" href={pageHref(page - 1)} rel="prev">
                  {copy.newer}
                </a>
              ) : (
                <span />
              )}
              <span>
                {copy.page} <span className="mono">{page}</span> {copy.of}{' '}
                <span className="mono">{listing.totalPages}</span>
              </span>
              {page < listing.totalPages ? (
                <a className="tz-more" href={pageHref(page + 1)} rel="next">
                  {copy.older}
                </a>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </section>
    </EditorialFrame>
  );
}

function PostCard({ locale, post }: { locale: Locale; post: Post }) {
  const href = localePath(locale, blogPostPath(post.slug));
  const image = fetchedMedia(post.coverImage);

  return (
    <article className="entry-card">
      {image && (
        // The title below links to the same place; this one is for the pointer, not the keyboard.
        <a href={href} tabIndex={-1} aria-hidden="true">
          <MediaImage image={image} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 372px" decorative />
        </a>
      )}
      <div className="entry-card-text">
        <PublishedDate locale={locale} date={post.publishedAt} />
        <h2>
          <a href={href}>{post.title}</a>
        </h2>
        <p>{post.summary}</p>
      </div>
    </article>
  );
}
