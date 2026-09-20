import type {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  Organization,
  SoftwareApplication,
  Thing,
  WebSite,
  WithContext,
} from 'schema-dts';
import type { PublishedContact } from '@/cms/contact-points';
import { fetchedMedia } from '@/cms/fetched-media';
import type { FaqEntry } from '@/components/faq';
import { plainText } from '@/components/inline-text';
import { COMPANY } from '@/content/company';
import { blogPostPath } from '@/lib/blog-paths';
import { absoluteUrl, siteOrigin } from '@/lib/environment';
import { localePath, type Locale } from '@/lib/locales';
import type { Post } from '@/payload-types';

/**
 * Structured data: the machine-readable description of Rabaed and each page
 * that lets Google and AI assistants quote the site accurately instead of
 * guessing (ticket 32; spec: SEO and GEO).
 *
 * Every builder here states only what is true and on the page. No ratings, no
 * reviews and no offers are emitted, because no genuine ones exist, and
 * invented ones are the kind of structured data search engines penalise
 * (spec: SEO and GEO; HANDOFF §6.3).
 *
 * Typed against schema.org by `schema-dts`, so a property schema.org does not
 * define for a type fails the typecheck. `tests/e2e/structured-data.spec.ts`
 * holds what reaches the page.
 */

/**
 * A block of structured data, in the body where the page renders it — the
 * placement the Next.js guide recommends. `<` is escaped, so no text from the
 * CMS can close the script tag and open markup of its own.
 */
export function StructuredData({ data }: { data: WithContext<Thing> | null }) {
  if (data === null) return null;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
  );
}

/** A page's absolute address, as its canonical URL gives it. */
const pageUrl = (locale: Locale, path: string) => absoluteUrl(localePath(locale, path));

/** The company's home, as schema.org conventionally writes a site's root. */
const homeUrl = () => `${siteOrigin()}/`;

/** One identifier for the company, so every other node can point at the same one. */
const organisationId = () => `${siteOrigin()}/#organisation`;

const publisher = (): Organization => ({ '@type': 'Organization', '@id': organisationId(), name: COMPANY.name.ar });

/** What the site and the product have in common: Rabaed's two names, its home, its language and its publisher. */
const identity = () => ({
  name: COMPANY.name.ar,
  alternateName: COMPANY.name.en,
  url: homeUrl(),
  inLanguage: 'ar',
  publisher: publisher(),
});

/**
 * The company, on every page. Its email, phone and social accounts are those
 * published in the CMS; an account nobody has supplied is left out, where the
 * footer shows `#` (ticket 39 decides what goes public).
 */
export function organisationData(contact: PublishedContact): WithContext<Organization> {
  const sameAs = Object.values(contact.social).filter((account): account is string => account !== null);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organisationId(),
    name: COMPANY.name.ar,
    alternateName: COMPANY.name.en,
    legalName: COMPANY.legalName,
    url: homeUrl(),
    logo: new URL(COMPANY.logo, siteOrigin()).href,
    identifier: { '@type': 'PropertyValue', propertyID: COMPANY.unifiedNumber.label, value: COMPANY.unifiedNumber.value },
    address: { '@type': 'PostalAddress', addressLocality: COMPANY.locality, addressCountry: COMPANY.country },
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** The site itself, on the home page. */
export function websiteData(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...identity(),
  };
}

/** The product, on the home and product pages. */
export function softwareData(): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    ...identity(),
    description: COMPANY.productDescription,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Construction Management',
    operatingSystem: 'Web',
  };
}

/**
 * A page's questions, word for word as the page shows them: built from the
 * entries its Questions section is handed, as `plainText` of what the page
 * draws — never from the answers as the CMS stores them, whose backticks and
 * `{payout}` a visitor never reads (ticket 22). Rewording would make the
 * declared text disagree with the visible text, which search engines treat as
 * a violation.
 *
 * Handed the whole Questions section, so that the one rule lives here: `null`
 * when the section is hidden or has no questions, because a page declares no
 * question it does not show.
 */
export function faqData(questions: {
  readonly shows: boolean;
  readonly entries: readonly FaqEntry[];
}): WithContext<FAQPage> | null {
  if (!questions.shows || questions.entries.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(entry.answer) },
    })),
  };
}

/** The home page's name at the head of every trail. */
const HOME_NAME: Record<Locale, string> = { ar: 'الرئيسية', en: 'Home' };

/** A step in a trail: its name, and its locale-independent path. */
export type BreadcrumbStep = { readonly name: string; readonly path: string };

/** An inner page's place in the site, from the home page down to the page itself. */
export function breadcrumbData(locale: Locale, steps: readonly BreadcrumbStep[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: HOME_NAME[locale], path: '/' }, ...steps].map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: pageUrl(locale, step.path),
    })),
  };
}

/**
 * An article: its title, the answer-first opening paragraph — the one field
 * the spec asks to serve both the page and its structured data — its author,
 * its dates and its cover.
 */
export function blogPostingData(locale: Locale, post: Post): WithContext<BlogPosting> {
  const url = pageUrl(locale, blogPostPath(post.slug));
  const cover = fetchedMedia(post.coverImage)?.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.answer,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    ...(cover ? { image: new URL(cover, siteOrigin()).href } : {}),
    publisher: publisher(),
  };
}
