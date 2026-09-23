import { allPublishedPosts } from '@/cms/blog';
import { allPublishedCaseStudies } from '@/cms/case-studies';
import { getLegalDocument } from '@/cms/legal-documents';
import { LEGAL_PAGES, LEGAL_SLUGS } from '@/cms/legal-pages';
import { BLOG_COPY } from '@/content/blog';
import { CASE_STUDIES_COPY } from '@/content/case-studies';
import { COMPANY } from '@/content/company';
import { getIndexLead } from '@/content/index-leads';
import { getHomePage } from '@/content/pages/home';
import { contentOrNull, inEnglish, type PageMeta } from '@/content/pages/page-content';
import { getPartnershipPage } from '@/content/pages/partnership';
import { getProductPage } from '@/content/pages/product';
import { getReferralPage } from '@/content/pages/referral';
import { getStartPage } from '@/content/pages/start';
import { getToolPage } from '@/content/pages/tool';
import { blogIndexPath, blogPostPath } from '@/lib/blog-paths';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { absoluteUrl } from '@/lib/environment';
import { localePath, type Locale } from '@/lib/locales';
import type { CaseStudy, Post } from '@/payload-types';

/**
 * `llms.txt`: what Rabaed is and where its pages are, in one short Markdown
 * file an AI assistant can read instead of crawling the site (ticket 33;
 * HANDOFF §6.8, whose draft this follows). An emerging convention rather than
 * a standard — no engine promises to read it — but it costs a request and
 * spends far less of an assistant's attention than nine pages do.
 *
 * **Generated, never written.** Every line below is the words the site itself
 * is already showing: a page's own search description, an article's summary,
 * a legal document's. Nothing here is a second copy of the site's words that
 * somebody would have to remember to update, which is the way a file like this
 * goes quietly stale. Ticket 26 moves the pages' descriptions into the CMS,
 * and this file follows them there without being touched.
 *
 * **Arabic first, then English** (ticket 82). The English half lists what is
 * published in English by the sitemap's rule (`src/app/sitemap.ts`): a
 * marketing page once it is, the English blog and case studies indexes once
 * each has something to list, and nothing before — so the file never points
 * an assistant at a notice or a placeholder. The legal documents are Arabic
 * alone, their Arabic being binding (spec: Out of Scope).
 *
 * The Arabic home page is the site, and the heading and summary at the top of
 * the file describe it; it is not listed again among the pages. The English
 * home page is listed, first among the English pages, since the heading is not
 * its. Nor is the Screen mock studio, the CMS admin or anything else that is
 * not a page of the site — the list is written out, as the sitemap's is, so
 * nothing can wander in.
 */

/** Built ahead of time and rebuilt when content is published (`src/cms/revalidation.ts`). */
export const dynamic = 'force-static';

/**
 * The floor under `llms.txt`: whatever becomes of a publish's mark, it is
 * rebuilt at most ten minutes after it was last built (ticket 66, ADR-0016).
 *
 * Its own, because a discovery file is a route beside the layouts rather than
 * beneath one, so no layout's age reaches it — the same reason
 * `DISCOVERY_FILES` exists in `src/cms/revalidation.ts`. Written out rather
 * than imported because Next reads only a literal; `src/lib/cache-age.ts`
 * holds the number and the reason it is that number.
 */
export const revalidate = 600;

/** One line of the file: a link, and what the page it points at says about itself. */
type Entry = { readonly label: string; readonly path: string; readonly description: string };

/** The headings each language's entries stand under. The legal documents are Arabic alone. */
const HEADINGS = {
  ar: { pages: 'الصفحات', posts: 'المقالات', caseStudies: 'قصص العملاء', legal: 'نظامي' },
  en: { pages: 'Pages in English', posts: 'Articles in English', caseStudies: 'Case studies in English' },
} as const satisfies Record<Locale, unknown>;

/**
 * The marketing pages, each with what reads it in a language — the sitemap's
 * list. The home page leads the English pages and is left out of the Arabic,
 * whose home page the file's heading describes.
 */
const MARKETING_PAGES: readonly { readonly path: string; readonly read: (locale: Locale) => Promise<{ readonly meta: PageMeta }> }[] = [
  { path: '/', read: getHomePage },
  { path: '/product', read: getProductPage },
  { path: '/start', read: getStartPage },
  { path: '/tool', read: getToolPage },
  { path: '/referral', read: getReferralPage },
  { path: '/partnership', read: getPartnershipPage },
];

/**
 * A description as one line. A summary written in the CMS may hold line
 * breaks; a Markdown list item that breaks in the middle stops being one
 * entry.
 */
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

/** One entry as the file writes it: a Markdown link at the address the page answers on in `locale`. */
function bullet(locale: Locale, entry: Entry): string {
  return `- [${oneLine(entry.label)}](${absoluteUrl(localePath(locale, entry.path))}): ${oneLine(entry.description)}`;
}

/** A heading and its entries, or nothing at all when there are none to list. */
function section(locale: Locale, heading: string, entries: readonly Entry[]): string[] {
  if (entries.length === 0) return [];
  return [`## ${heading}`, '', ...entries.map((entry) => bullet(locale, entry)), ''];
}

/**
 * The site's own pages in `locale`, each described as its `<meta
 * name="description">` describes it: one module per page hands over both
 * (`src/content/pages/`).
 *
 * Arabic, every page is; English, a page is once `inEnglish` says it is
 * published in English. An index is listed where it has something to list —
 * the Arabic blog index always, as it always has been — which is the
 * sitemap's rule, and the case studies section has no page at all until a
 * story is published (ticket 24).
 */
async function pageEntries(
  locale: Locale,
  posts: readonly Post[],
  caseStudies: readonly CaseStudy[],
): Promise<Entry[]> {
  const read = (page: (typeof MARKETING_PAGES)[number]) => (locale === 'en' ? inEnglish(page.read) : page.read(locale));
  const marketing = MARKETING_PAGES.filter((page) => locale === 'en' || page.path !== '/');
  // The line under an index's heading, which is also its search description —
  // in the CMS since ticket 59. Read only for an index with something to list,
  // and `null` where its entry is not published in this language, when the
  // index is left out rather than the file failing.
  const lead = (index: 'blog' | 'caseStudies', listed: boolean) =>
    listed ? contentOrNull(getIndexLead(locale, index)) : Promise.resolve(null);
  const [contents, blogLead, caseStudiesLead] = await Promise.all([
    Promise.all(marketing.map(read)),
    lead('blog', locale === 'ar' || posts.length > 0),
    lead('caseStudies', caseStudies.length > 0),
  ]);

  const pages = marketing.flatMap((page, index): Entry[] => {
    const content = contents[index];
    if (!content) return [];
    // The English home page by the company's name: its short name is «Home»,
    // which tells an assistant nothing.
    const label = page.path === '/' ? COMPANY.name[locale] : content.meta.name;
    return [{ label, path: page.path, description: content.meta.description }];
  });

  return [
    ...pages,
    ...(blogLead === null ? [] : [{ label: BLOG_COPY[locale].title, path: blogIndexPath(), description: blogLead }]),
    ...(caseStudiesLead === null
      ? []
      : [{ label: CASE_STUDIES_COPY[locale].title, path: CASE_STUDIES_PATH, description: caseStudiesLead }]),
  ];
}

/** A language's pages, articles and case studies, each under its heading. */
async function sections(locale: Locale): Promise<string[]> {
  const [posts, caseStudies] = await Promise.all([allPublishedPosts(locale), allPublishedCaseStudies(locale)]);
  const headings = HEADINGS[locale];
  return [
    ...section(locale, headings.pages, await pageEntries(locale, posts, caseStudies)),
    ...section(locale, headings.posts, posts.map((post) => ({ label: post.title, path: blogPostPath(post.slug), description: post.summary }))),
    ...section(
      locale,
      headings.caseStudies,
      caseStudies.map((study) => ({ label: study.title, path: caseStudyPath(study.slug), description: study.summary })),
    ),
  ];
}

/** The three legal documents, as published in the CMS (ticket 25). */
async function legalEntries(): Promise<Entry[]> {
  const documents = await Promise.all(LEGAL_SLUGS.map((slug) => getLegalDocument(slug)));
  return documents.map((document) => ({
    label: document.title,
    path: LEGAL_PAGES[document.slug].path,
    description: document.description,
  }));
}

export async function GET(): Promise<Response> {
  const [arabic, english, legal] = await Promise.all([sections('ar'), sections('en'), legalEntries()]);

  const lines = [
    `# ${COMPANY.name.ar} (${COMPANY.name.en})`,
    '',
    `> ${COMPANY.productDescription.ar} ${COMPANY.legalName} — ${COMPANY.locality.ar}، السعودية.`,
    // The company in English too, once there is English to point at, for an
    // assistant answering in English.
    ...(english.length > 0
      ? ['>', `> ${COMPANY.productDescription.en} ${COMPANY.name.en} — ${COMPANY.locality.en}, Saudi Arabia.`]
      : []),
    '',
    ...arabic,
    ...section('ar', HEADINGS.ar.legal, legal),
    ...english,
  ];

  return new Response(`${lines.join('\n').trimEnd()}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
