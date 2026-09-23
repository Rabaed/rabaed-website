import { hasPublishedCaseStudies } from '@/cms/case-studies';
import { pageEntry, wordsIn } from '@/cms/pages';
import { ARABIC_ONLY_PAGES } from '@/content/arabic-only-pages';
import { ContentNotInLocale } from '@/content/pages/page-content';
import { CASE_STUDIES_PATH } from '@/lib/case-study-paths';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/locales';

/**
 * The words every page shares, in `locale`: the header's menu, the footer's
 * lines and the not-found page (ticket 59). One entry in the CMS, read here
 * once per request.
 *
 * On the Reference site this table existed nine times over, as markup, so a
 * new link meant editing nine files and a missed one meant a page whose menu
 * disagreed with the rest of the site. It is one entry now, and an Editor sets
 * both the words on a link and where it goes.
 */

/** A link in the menu or the footer: where it goes, and the words on it. */
export type NavLink = {
  /**
   * Where the CMS says it goes: a path on the site in the Arabic locale, which
   * is what marks the page a visitor is on — or an address of its own, for the
   * product app, which is not a page of this site.
   */
  readonly path: string;
  /** Where it actually leads: the path in this locale, or an address as written. */
  readonly href: string;
  readonly label: string;
};

/** A link in the Partnerships dropdown, which shows a line under each. */
export type NavGroup = NavLink & { readonly summary: string };

export type HeaderContent = {
  readonly links: readonly NavLink[];
  readonly partnershipsLabel: string;
  readonly partnerships: readonly NavGroup[];
  readonly signIn: { readonly label: string; readonly href: string };
  readonly demoLabel: string;
};

/**
 * A link in the Footer directory. `hrefLang` names the language of the page it
 * leads to where that is not the language being read: an English page's link
 * to a legal document, which is in Arabic alone.
 */
export type DirectoryLink = NavLink & { readonly hrefLang?: Locale };

/** A column of the Footer directory: its heading, and its links in order. */
export type DirectoryColumn = { readonly heading: string; readonly links: readonly DirectoryLink[] };

export type FooterContent = {
  readonly tagline: string;
  readonly directory: readonly DirectoryColumn[];
  readonly rights: string;
};

export type NotFoundContent = {
  readonly heading: string;
  readonly lead: string;
  readonly homeLabel: string;
};

/**
 * Where a link leads. A path on the site is prefixed for the language being
 * read; an address of its own — the product app, which this site links to and
 * does not contain — is left as it was written.
 */
function href(locale: Locale, destination: string): string {
  return destination.startsWith('/') ? localePath(locale, destination) : destination;
}

/**
 * Whether a link is drawn yet: the case studies link waits for its language's
 * first published story, in the header and the Footer directory alike, so an
 * Editor never has to remember to add it.
 */
const shownWith =
  (caseStudies: boolean) =>
  (link: { readonly path: string }): boolean =>
    caseStudies || link.path !== CASE_STUDIES_PATH;

/**
 * Whether the header and footer can be drawn in `locale`: whether the words
 * every page shares are published in it. Arabic always is — the CMS publishes
 * nothing without it. English is once the founder publishes the English words
 * ticket 40 proposed; until then an English page has neither, rather than the
 * Arabic in their place.
 */
export async function siteWordsIn(locale: Locale): Promise<boolean> {
  try {
    await pageEntry('site-words', locale);
    return true;
  } catch (error) {
    if (error instanceof ContentNotInLocale) return false;
    throw error;
  }
}

/**
 * The header's menu in `locale`. The case studies link waits for its first
 * published story: until then the section it names is not there, and the
 * header is the Reference site's. An Editor still sees the link in the CMS,
 * where it keeps its place in the order.
 */
export async function getHeader(locale: Locale): Promise<HeaderContent> {
  const [{ header }, caseStudies] = await Promise.all([
    pageEntry('site-words', locale),
    hasPublishedCaseStudies(locale),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return {
    links: header.links
      .filter(shownWith(caseStudies))
      .map((link) => ({ path: link.path, href: href(locale, link.path), label: words(link.label) })),
    partnershipsLabel: words(header.partnershipsLabel),
    partnerships: header.partnerships.map((link) => ({
      path: link.path,
      href: href(locale, link.path),
      label: words(link.label),
      summary: words(link.summary),
    })),
    signIn: { label: words(header.signInLabel), href: header.signInUrl },
    demoLabel: words(header.demoLabel),
  };
}

/** The pages in Arabic alone: the legal documents, which are never translated. */
const ARABIC_ONLY_PATHS = new Set(Object.values(ARABIC_ONLY_PAGES).map((page) => page.path));

/**
 * Where a Footer directory link leads. A legal document is in Arabic alone, so
 * an English page's link to it goes straight to the Arabic rather than to the
 * English address that only says so — the founder's choice (ADR-0020), and the
 * link's English label says the page is in Arabic.
 */
function directoryLink(locale: Locale, path: string, label: string): DirectoryLink {
  // `/terms/` is `/terms`: the CMS lets an Editor end a path with a slash.
  if (locale !== DEFAULT_LOCALE && ARABIC_ONLY_PATHS.has(path.replace(/(.)\/+$/, '$1'))) {
    return { path, href: localePath(DEFAULT_LOCALE, path), label, hrefLang: DEFAULT_LOCALE };
  }
  return { path, href: href(locale, path), label };
}

/**
 * The footer's words in `locale`, and its Footer directory (ticket 75). Its
 * contact points are site settings (ticket 19).
 *
 * The case studies link waits for its first published story in `locale`, as
 * the header's does, so an Editor never has to remember to add it; a column
 * that loses every link that way is not drawn at all, rather than drawn as a
 * heading over nothing.
 */
export async function getFooter(locale: Locale): Promise<FooterContent> {
  const [{ footer }, caseStudies] = await Promise.all([
    pageEntry('site-words', locale),
    hasPublishedCaseStudies(locale),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return {
    tagline: words(footer.tagline),
    directory: footer.columns
      .map((column) => ({
        heading: words(column.heading),
        links: column.links
          .filter(shownWith(caseStudies))
          .map((link) => directoryLink(locale, link.path, words(link.label))),
      }))
      .filter((column) => column.links.length > 0),
    rights: words(footer.rights),
  };
}

/**
 * The not-found page's words. Arabic alone: the page is reached by an address
 * that matched nothing, which names no language for it to answer in
 * (`src/app/not-found.tsx`).
 */
export async function getNotFound(locale: Locale): Promise<NotFoundContent> {
  const { notFound } = await pageEntry('site-words', locale);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return { heading: words(notFound.heading), lead: words(notFound.lead), homeLabel: words(notFound.homeLabel) };
}

/**
 * The words the menu gives a page, for the trail search results show
 * (`structured-data.tsx`). A page the menu names is named the same way in the
 * trail, so renaming it in the menu renames it in both; a page the menu does
 * not name — the tool page, an article — keeps the name its own words give it.
 */
export async function menuName(locale: Locale, path: string): Promise<string | null> {
  try {
    const { links, partnerships } = await getHeader(locale);
    return [...links, ...partnerships].find((link) => link.path === path)?.label ?? null;
  } catch (error) {
    // The menu is Arabic until its English is published (ticket 40), and an
    // English page carries no Arabic in place of it — here, no name from the
    // menu, and the page's own English name stands.
    if (error instanceof ContentNotInLocale) return null;
    throw error;
  }
}
