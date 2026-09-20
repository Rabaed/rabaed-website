import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  EditorialFrame,
  EditorialHero,
  MediaImage,
  OtherLanguageNotice,
  otherLanguageMetadata,
  PublishedDate,
} from '@/components/editorial';
import { allPublishedPosts, findPost, publishedLocales } from '@/cms/blog';
import { fetchedMedia } from '@/cms/fetched-media';
import { blogPostingData, breadcrumbData, StructuredData } from '@/components/structured-data';
import { BLOG_COPY } from '@/content/blog';
import { blogIndexPath, blogPostPath } from '@/lib/blog-paths';
import { localePath, type Locale } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

/**
 * The articles published in a language when the site is built. One published
 * later is built on its first visit, and publishing marks the pages stale
 * (`src/cms/editorial-fields.ts`).
 */
export async function blogPostParams(locale: Locale): Promise<{ slug: string }[]> {
  return (await allPublishedPosts(locale)).map((post) => ({ slug: post.slug }));
}

/**
 * An article's title, its summary as the description, and an alternate for
 * each language it is published in — never one it is not, which would send a
 * search engine to the notice below.
 */
export async function blogPostMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const copy = BLOG_COPY[locale];
  const post = await findPost(locale, slug);
  if (!post) return otherLanguageMetadata(copy.metaTitle);

  return pageMetadata({
    locale,
    locales: await publishedLocales(slug),
    path: blogPostPath(slug),
    title: `${post.title} · ${copy.siteName}`,
    description: post.summary,
  });
}

/**
 * An article (ticket 23): the compact page hero with its title, author and
 * date, then on the pale ground its cover, the answer-first opening paragraph
 * — the first paragraph under the title, which the spec asks to answer the
 * reader's question on its own — and the body as Ahmed wrote it.
 *
 * A server component: every word is in the first response (ADR-0001).
 *
 * An article with no entry in this language is not replaced with another
 * language's text (spec: Routing and localisation). Where one exists in the
 * other language, the page says so and links to it; where none does, 404.
 */
export async function BlogPostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const copy = BLOG_COPY[locale];
  const post = await findPost(locale, slug);
  const indexHref = localePath(locale, blogIndexPath());

  if (!post) {
    const available = (await publishedLocales(slug)).find((code) => code !== locale);
    if (!available) notFound();

    return (
      <OtherLanguageNotice
        locale={locale}
        path={blogIndexPath()}
        eyebrow={copy.eyebrow}
        indexHref={indexHref}
        notice={copy.untranslated}
        linkLabel={copy.otherLanguage}
        available={available}
        href={localePath(available, blogPostPath(slug))}
      />
    );
  }

  // A draft being previewed may not have everything yet; a published article does.
  const image = fetchedMedia(post.coverImage);

  return (
    <EditorialFrame locale={locale} path={blogIndexPath()}>
      <EditorialHero eyebrow={copy.eyebrow} indexHref={indexHref} title={post.title}>
        <div className="entry-meta">
          {post.author && <span>{`${copy.by} ${post.author}`}</span>}
          {post.publishedAt && <PublishedDate locale={locale} date={post.publishedAt} />}
        </div>
      </EditorialHero>

      <section className="light entry">
        <article className="wrap">
          {image && <MediaImage className="cover" image={image} sizes="(max-width: 884px) 100vw, 820px" />}
          {post.answer && <p className="answer">{post.answer}</p>}
          {post.body && <RichText className="entry-body" data={post.body} />}
        </article>
      </section>
      <StructuredData
        data={await breadcrumbData(locale, [
          { name: copy.eyebrow, path: blogIndexPath() },
          { name: post.title, path: blogPostPath(slug) },
        ])}
      />
      <StructuredData data={blogPostingData(locale, post)} />
    </EditorialFrame>
  );
}
