import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArabicDate } from '@/components/arabic-date';
import { PageShell } from '@/components/page-shell';
import { riyadhDay } from '@/lib/dates';
import type { Locale } from '@/lib/locales';
import { baseMetadata } from '@/lib/metadata';
import type { Media } from '@/payload-types';

/**
 * The pieces the blog (ticket 23) and case studies (ticket 24) are built from.
 * The Reference site has neither, so their pages are made of the site's own
 * parts, styled in `src/styles/editorial.css`.
 */

/**
 * The frame an editorial page sits in. An Arabic page has the site's header
 * and footer, with `path` marking its section's link when the header has one.
 * An English page has neither yet: every label in them is Arabic, and the
 * English shell is ticket 40's to build — the reason `/en` has none either
 * (`src/app/(en)/en/page.tsx`).
 */
export function EditorialFrame({
  locale,
  path,
  ownPath,
  locales,
  children,
}: {
  locale: Locale;
  /** The section the header marks — the blog's link above an article, not the article. */
  path: string;
  /** The page's own address, which the language switcher offers in the other language. */
  ownPath: string;
  /** The languages this entry is published in, which is not every locale (ticket 40). */
  locales: readonly Locale[];
  children: ReactNode;
}) {
  if (locale === 'en') return <main>{children}</main>;
  return (
    <PageShell locale="ar" path={path} ownPath={ownPath} locales={locales}>
      {children}
    </PageShell>
  );
}

/**
 * The compact page hero every editorial page opens with. Below a section's
 * index, its eyebrow links back to it; on the index it is only a label.
 */
export function EditorialHero({
  eyebrow,
  indexHref,
  title,
  children,
}: {
  eyebrow: string;
  indexHref?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="phero dark">
      <div className="pglow" />
      <div className="wrap">
        {indexHref ? (
          <a className="eyebrow" href={indexHref}>
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

/**
 * What an entry's address shows in a language it is not written in, when it
 * is published in the other: a notice and a button to that language. Never
 * the other language's text in its place (spec: Routing and localisation).
 */
export function OtherLanguageNotice({
  locale,
  path,
  ownPath,
  eyebrow,
  indexHref,
  notice,
  linkLabel,
  available,
  href,
}: {
  locale: Locale;
  path: string;
  /** The entry's own address, which exists in `available` and not in `locale`. */
  ownPath: string;
  eyebrow: string;
  indexHref?: string;
  notice: string;
  linkLabel: string;
  available: Locale;
  href: string;
}) {
  return (
    // The one language it is published in is the one the switcher offers, and
    // the button below offers it too: this page is the untranslated case, so
    // the switcher must not present the address being read as a translation.
    <EditorialFrame locale={locale} path={path} ownPath={ownPath} locales={[available]}>
      <EditorialHero eyebrow={eyebrow} indexHref={indexHref} title={notice}>
        <div className="ctas">
          <a className="btn p" href={href} hrefLang={available}>
            {linkLabel}
          </a>
        </div>
      </EditorialHero>
    </EditorialFrame>
  );
}

/**
 * The notice above belongs in no search results, before launch or after.
 * Stated in full rather than as `index: false`: a page's `robots` replaces the
 * layout's instead of adding to it (src/lib/metadata.ts), so before launch
 * this keeps the site-wide block exactly as it is.
 */
export function otherLanguageMetadata(title: string): Metadata {
  return { title, robots: baseMetadata().robots ?? { index: false, follow: true } };
}

/** The day an entry was published, as it fell in Riyadh. */
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
 * An image from the CMS, with the narrower copies it made for the browser to
 * choose between (`src/cms/collections/media.ts`). A copy wider than the
 * original is never made, so only the ones that exist are offered.
 *
 * `decorative` for an image beside a link that already names the entry: the
 * picture adds nothing a screen reader should announce twice.
 */
export function MediaImage({
  image,
  sizes,
  className,
  decorative = false,
  lazy = decorative,
}: {
  image: Media;
  sizes: string;
  className?: string;
  decorative?: boolean;
  lazy?: boolean;
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
      loading={lazy ? 'lazy' : undefined}
    />
  );
}
