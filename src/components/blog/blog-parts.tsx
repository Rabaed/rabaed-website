import type { ReactNode } from 'react';
import { ArabicDate } from '@/components/arabic-date';
import { PageShell } from '@/components/page-shell';
import { BLOG_COPY } from '@/content/blog';
import { blogIndexPath } from '@/lib/blog-paths';
import { riyadhDay } from '@/lib/dates';
import { localePath, type Locale } from '@/lib/locales';
import type { Media } from '@/payload-types';

/**
 * The frame a blog page sits in. An Arabic page has the site's header and
 * footer. An English page has neither yet: every label in them is Arabic, and
 * the English shell is ticket 40's to build — the reason `/en` has none either
 * (`src/app/(en)/en/page.tsx`).
 */
export function BlogFrame({ locale, children }: { locale: Locale; children: ReactNode }) {
  if (locale === 'en') return <main>{children}</main>;
  // The blog is not in the navigation, so no link in the header is marked.
  return (
    <PageShell locale="ar" path="/blog">
      {children}
    </PageShell>
  );
}

/**
 * The compact page hero every blog page opens with. Below the index, its
 * eyebrow links back to it; on the index it is only a label.
 */
export function BlogHero({
  locale,
  title,
  linkToIndex = false,
  children,
}: {
  locale: Locale;
  title: string;
  linkToIndex?: boolean;
  children?: ReactNode;
}) {
  const { eyebrow } = BLOG_COPY[locale];

  return (
    <section className="phero dark">
      <div className="pglow" />
      <div className="wrap">
        {linkToIndex ? (
          <a className="eyebrow" href={localePath(locale, blogIndexPath())}>
            {eyebrow}
          </a>
        ) : (
          <div className="eyebrow">{eyebrow}</div>
        )}
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

/** The day an article was published, as it fell in Riyadh. */
export function PublishedDate({ locale, date }: { locale: Locale; date: string }) {
  const day = riyadhDay(date);
  const machineReadable = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;

  if (locale === 'en') {
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' }).format(
      Date.UTC(day.year, day.month - 1, 1),
    );
    return <time dateTime={machineReadable}>{`${day.day} ${month} ${day.year}`}</time>;
  }

  return (
    <time dateTime={machineReadable}>
      <ArabicDate date={day} />
    </time>
  );
}

/**
 * An article's cover image, with the narrower copies the CMS made of it for
 * the browser to choose between (`src/cms/collections/media.ts`). A copy wider
 * than the original is never made, so only the ones that exist are offered.
 *
 * `decorative` for a cover beside a link that already names the article: the
 * picture adds nothing a screen reader should announce twice.
 */
export function CoverImage({
  image,
  sizes,
  className,
  decorative = false,
}: {
  image: Media;
  sizes: string;
  className?: string;
  decorative?: boolean;
}) {
  if (!image.url) return null;

  const copies = [image.sizes?.small, image.sizes?.medium, image.sizes?.large].flatMap((copy) =>
    copy?.url && copy.width ? [`${copy.url} ${copy.width}w`] : [],
  );
  if (image.width) copies.push(`${image.url} ${image.width}w`);

  return (
    <img
      className={className}
      src={image.url}
      srcSet={copies.join(', ') || undefined}
      sizes={sizes}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      alt={decorative ? '' : image.alt}
      loading={decorative ? 'lazy' : undefined}
    />
  );
}
