/**
 * The machine-readable description of Rabaed that lets Google and AI
 * assistants quote the site accurately instead of guessing (ticket 32; spec:
 * SEO and GEO).
 *
 * Read out of each page's first response, as a crawler reads it. What each
 * kind of thing must carry to validate is checked by `structured-data.ts`;
 * article data on blog posts is checked by `blog.spec.ts`, which publishes one.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { ROUTES } from './routes';
import { nodesOf, structuredData, trail, type Node } from './structured-data';

/** The home page's absolute address is the bare origin, as its canonical URL is. */
const absolute = (baseURL: string, path: string) => `${baseURL}${path === '/' ? '' : path}`;

/**
 * The company as CONTEXT.md and the approved legal documents name it, and the
 * contact points published with the site (restated for the reason `routes.ts`
 * gives). `cms.spec.ts` changes only the WhatsApp number and the social
 * accounts, so these stay put while it runs.
 */
const COMPANY = {
  name: 'ربائد',
  alternateName: 'Rabaed',
  legalName: 'شركة ربائد البناء',
  unifiedNumber: '7050078786',
  locality: 'الرياض',
  country: 'SA',
  email: 'ahmed.s@rabaedapp.com',
  telephone: '+966576767900',
};

/** The footer's social icons, in the footer's order. */
const SOCIAL_LABELS = ['لينكدإن', 'إكس', 'فيسبوك', 'إنستجرام'];

/** The pages that describe the product itself, and the one that describes the site. */
const SOFTWARE_PAGES = ['/', '/product'];
const WEBSITE_PAGES = ['/'];

/** Each inner page's trail from the home page, as its names and paths. */
const BREADCRUMBS: Record<string, [string, string][]> = {
  '/product': [['الرئيسية', '/'], ['المنتج', '/product']],
  '/start': [['الرئيسية', '/'], ['ابدأ', '/start']],
  '/tool': [['الرئيسية', '/'], ['متتبّع الصبّات', '/tool']],
  '/referral': [['الرئيسية', '/'], ['برنامج الإحالة', '/referral']],
  '/partnership': [['الرئيسية', '/'], ['برنامج الشراكات', '/partnership']],
  '/blog': [['الرئيسية', '/'], ['المدونة', '/blog']],
  '/en/blog': [['Home', '/en'], ['Blog', '/en/blog']],
  '/terms': [['الرئيسية', '/'], ['شروط الخدمة', '/terms']],
  '/privacy': [['الرئيسية', '/'], ['سياسة الخصوصية', '/privacy']],
  '/referral-terms': [['الرئيسية', '/'], ['شروط برنامج الإحالة', '/referral-terms']],
};

/** Properties that would claim ratings, reviews or prices, none of which exist. */
const INVENTED = ['aggregateRating', 'review', 'reviewRating', 'offers'];

async function html(request: APIRequestContext, path: string): Promise<string> {
  const response = await request.get(path);
  expect(response.status(), path).toBe(200);
  return response.text();
}

/** Where a footer icon points, read from the same HTML as the structured data. */
function footerHref(page: string, label: string): string | null {
  const footer = page.slice(page.indexOf('<footer'));
  const link = footer.match(/<a\b[^>]*>/g)?.find((tag) => tag.includes(`aria-label="${label}"`));
  return link?.match(/\bhref="([^"]*)"/)?.[1] ?? null;
}

/** Every key anywhere inside a value. */
function keysWithin(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(keysWithin);
  if (value === null || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, inner]) => [key, ...keysWithin(inner)]);
}

for (const route of ROUTES) {
  test(`${route.path} describes the company, and claims no rating or offer`, async ({ request, baseURL }) => {
    const page = await html(request, route.path);
    const nodes = structuredData(page);

    const organisations = nodesOf(nodes, 'Organization');
    expect(organisations).toHaveLength(1);
    const [organisation] = organisations;
    expect(organisation).toMatchObject({
      name: COMPANY.name,
      alternateName: COMPANY.alternateName,
      legalName: COMPANY.legalName,
      url: `${baseURL}/`,
      email: COMPANY.email,
      telephone: COMPANY.telephone,
      address: { '@type': 'PostalAddress', addressLocality: COMPANY.locality, addressCountry: COMPANY.country },
    });
    expect(JSON.stringify(organisation.identifier)).toContain(COMPANY.unifiedNumber);

    // The real accounts only: the ones the footer links to. One nobody has
    // supplied is `#` there, and absent here.
    const accounts = SOCIAL_LABELS.map((label) => footerHref(page, label)).filter(
      (href): href is string => href !== null && href !== '#',
    );
    expect(organisation.sameAs ?? []).toEqual(accounts);

    const logo = organisation.logo as string | Node;
    const logoUrl = typeof logo === 'string' ? logo : (logo.url as string);
    const logoResponse = await request.get(logoUrl);
    expect(logoResponse.status(), logoUrl).toBe(200);
    expect(logoResponse.headers()['content-type']).toMatch(/^image\//);

    expect(keysWithin(nodes).filter((key) => INVENTED.includes(key))).toEqual([]);

    expect(nodesOf(nodes, 'SoftwareApplication'), 'software application data').toHaveLength(
      SOFTWARE_PAGES.includes(route.path) ? 1 : 0,
    );
    expect(nodesOf(nodes, 'WebSite'), 'website data').toHaveLength(WEBSITE_PAGES.includes(route.path) ? 1 : 0);
  });
}

for (const route of ROUTES) {
  test(`${route.path} names its place in the site in breadcrumb data`, async ({ request, baseURL }) => {
    const breadcrumbs = nodesOf(structuredData(await html(request, route.path)), 'BreadcrumbList');
    const expected = BREADCRUMBS[route.path];

    if (!expected) {
      expect(breadcrumbs, 'a home page has no trail').toHaveLength(0);
      return;
    }
    expect(breadcrumbs).toHaveLength(1);
    expect(trail(breadcrumbs[0])).toEqual(expected.map(([name, path]) => [name, absolute(baseURL!, path)]));
  });
}

test('the software is described as what it is, with no invented facts', async ({ request, baseURL }) => {
  for (const path of SOFTWARE_PAGES) {
    const [software] = nodesOf(structuredData(await html(request, path)), 'SoftwareApplication');
    expect(software, path).toMatchObject({
      name: COMPANY.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${baseURL}/`,
    });
    expect(software.description, path).toBeTruthy();
  }
});

test('the home page describes the site', async ({ request, baseURL }) => {
  const [website] = nodesOf(structuredData(await html(request, '/')), 'WebSite');
  expect(website).toMatchObject({ name: COMPANY.name, alternateName: COMPANY.alternateName, url: `${baseURL}/`, inLanguage: 'ar' });
});

/** The pages with questions, and where their questions stand. */
const FAQ_PAGES = { '/': '#fq', '/start': '#faq', '/tool': '#faq', '/referral': '#faq', '/partnership': '#faq' };

for (const [path, section] of Object.entries(FAQ_PAGES)) {
  test(`${path}'s FAQ data is its visible questions and answers, word for word`, async ({ page, request }) => {
    await page.goto(path);
    const visible = await page.locator(`${section} details`).evaluateAll((entries) =>
      entries.map((entry) => ({
        question: entry.querySelector('summary')!.textContent,
        answer: entry.querySelector('p')!.textContent,
      })),
    );
    expect(visible.length, 'questions on the page').toBeGreaterThan(0);

    const faqs = nodesOf(structuredData(await html(request, path)), 'FAQPage');
    expect(faqs).toHaveLength(1);
    const declared = (faqs[0].mainEntity as Node[]).map((question) => ({
      question: question.name,
      answer: (question.acceptedAnswer as Node).text,
    }));
    expect(declared).toEqual(visible);
  });
}

test('a page with no questions declares none', async ({ request }) => {
  const withoutQuestions = ROUTES.map((route) => route.path).filter((path) => !(path in FAQ_PAGES));
  for (const path of withoutQuestions) {
    expect(nodesOf(structuredData(await html(request, path)), 'FAQPage'), path).toHaveLength(0);
  }
});
