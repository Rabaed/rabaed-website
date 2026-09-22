import { allPublishedPosts } from '@/cms/blog';
import { allPublishedCaseStudies } from '@/cms/case-studies';
import { getLegalDocument } from '@/cms/legal-documents';
import { LEGAL_PAGES, LEGAL_SLUGS } from '@/cms/legal-pages';
import { BLOG_COPY } from '@/content/blog';
import { CASE_STUDIES_COPY } from '@/content/case-studies';
import { COMPANY } from '@/content/company';
import { getIndexLead } from '@/content/index-leads';
import type { PageMeta } from '@/content/pages/page-content';
import { getPartnershipPage } from '@/content/pages/partnership';
import { getProductPage } from '@/content/pages/product';
import { getReferralPage } from '@/content/pages/referral';
import { getStartPage } from '@/content/pages/start';
import { getToolPage } from '@/content/pages/tool';
import { blogIndexPath, blogPostPath } from '@/lib/blog-paths';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { absoluteUrl } from '@/lib/environment';
import { localePath } from '@/lib/locales';
import type { CaseStudy } from '@/payload-types';

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
 * Arabic alone, as the site is until English is switched on (ticket 40).
 *
 * The home page is the site, and the heading and summary at the top of the
 * file describe it; it is not listed again among the pages. Nor is the Screen
 * mock studio, the CMS admin or anything else that is not a page of the site —
 * the list is written out, as the sitemap's is, so nothing can wander in.
 */

/** Built ahead of time and rebuilt when content is published (`src/cms/revalidation.ts`). */
export const dynamic = 'force-static';

/**
 * The floor under `llms.txt`: whatever becomes of a publish's mark, it is
 * rebuilt at most ten minutes after it was last built (ticket 66, ADR-0014).
 *
 * Its own, because a discovery file is a route beside the layouts rather than
 * beneath one, so no layout's age reaches it — the same reason
 * `DISCOVERY_FILES` exists in `src/cms/revalidation.ts`. Written out rather
 * than imported because Next reads only a literal; `src/lib/cache-age.ts`
 * holds the number and the reason it is that number.
 */
export const revalidate = 600;

const LOCALE = 'ar';

/** One line of the file: a link, and what the page it points at says about itself. */
type Entry = { readonly label: string; readonly path: string; readonly description: string };

/**
 * A description as one line. A summary written in the CMS may hold line
 * breaks; a Markdown list item that breaks in the middle stops being one
 * entry.
 */
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

/** One entry as the file writes it: a Markdown link at the address the page answers on. */
function bullet(entry: Entry): string {
  return `- [${oneLine(entry.label)}](${absoluteUrl(localePath(LOCALE, entry.path))}): ${oneLine(entry.description)}`;
}

/** A heading and its entries, or nothing at all when there are none to list. */
function section(heading: string, entries: readonly Entry[]): string[] {
  if (entries.length === 0) return [];
  return [`## ${heading}`, '', ...entries.map(bullet), ''];
}

/**
 * The site's own pages, each described as its `<meta name="description">`
 * describes it: one module per page hands over both (`src/content/pages/`).
 * The case studies are passed in for the sitemap's rule — the section has no
 * page of its own until a story is published (ticket 24).
 */
async function pageEntries(caseStudies: readonly CaseStudy[]): Promise<Entry[]> {
  const [product, start, tool, referral, partnership, blogLead, caseStudiesLead] = await Promise.all([
    getProductPage(LOCALE),
    getStartPage(LOCALE),
    getToolPage(LOCALE),
    getReferralPage(LOCALE),
    getPartnershipPage(LOCALE),
    // The line under each index's heading, which is also its search
    // description — in the CMS since ticket 59.
    getIndexLead(LOCALE, 'blog'),
    getIndexLead(LOCALE, 'caseStudies'),
  ]);
  const page = ({ name, description }: PageMeta, path: string): Entry => ({ label: name, description, path });

  return [
    page(product.meta, '/product'),
    page(start.meta, '/start'),
    page(tool.meta, '/tool'),
    page(referral.meta, '/referral'),
    page(partnership.meta, '/partnership'),
    { label: BLOG_COPY[LOCALE].title, path: blogIndexPath(), description: blogLead },
    ...(caseStudies.length > 0
      ? [{ label: CASE_STUDIES_COPY[LOCALE].title, path: CASE_STUDIES_PATH, description: caseStudiesLead }]
      : []),
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
  const [posts, caseStudies, legal] = await Promise.all([
    allPublishedPosts(LOCALE),
    allPublishedCaseStudies(LOCALE),
    legalEntries(),
  ]);
  const pages = await pageEntries(caseStudies);

  const lines = [
    `# ${COMPANY.name.ar} (${COMPANY.name.en})`,
    '',
    `> ${COMPANY.productDescription} ${COMPANY.legalName} — ${COMPANY.locality}، السعودية.`,
    '',
    ...section('الصفحات', pages),
    ...section('المقالات', posts.map((post) => ({ label: post.title, path: blogPostPath(post.slug), description: post.summary }))),
    ...section(
      'قصص العملاء',
      caseStudies.map((study) => ({ label: study.title, path: caseStudyPath(study.slug), description: study.summary })),
    ),
    ...section('نظامي', legal),
  ];

  return new Response(`${lines.join('\n').trimEnd()}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
