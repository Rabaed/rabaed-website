/**
 * The Company profile (ticket 102): Ahmed's profile of Rabaed as a page of the
 * site, at `/profile` and `/en/profile`. It is nowhere — not found, in neither
 * the sitemap nor `llms.txt`, linked from no header or footer — until the
 * founder publishes it, and published it is a page of the site: the site's
 * header and footer, the home page's hero with Ahmed's words and its own two
 * buttons, the shared Trust strip, and its own title, description and
 * sharing picture.
 *
 * **Runs against the second test server** (`playwright.config.ts`, ticket
 * 89), one suite at a time, and in this order: it publishes the profile,
 * which puts a page in the sitemap and in `llms.txt` that the other suites on
 * this server read. Publishing cannot be taken back — what visitors see is the
 * newest published version (`src/cms/pages.ts`), and unpublishing leaves that
 * in the entry's history — so the page stays published on this server, as the
 * English pages' suite leaves its page, and `ai-crawlers.spec.ts` leaves it out
 * of the list it holds `llms.txt` to. The first server's database is as the
 * migrations leave it, the profile unpublished, which is why
 * `tests/e2e/routes.ts` cannot list it (`tests/unit/page-registry.spec.ts`).
 *
 * Ahmed's words are restated from his profile (`.scratch/company-profile/source/`)
 * rather than imported from the migration, for the reason `routes.ts` gives.
 */
import type { APIRequestContext, Page } from '@playwright/test';
import { reachesVisitors, reaching } from './cms';
import { test, expect } from './entries';
import { oneSuiteAtATime } from './one-suite-at-a-time';
import { nodesOf, structuredData, trail } from './structured-data';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

const HERO = {
  eyebrow: 'نظام تشغيل مشاريع الإنشاء · المملكة العربية السعودية',
  heading: ['ثلاثة أطراف.', 'سجل واحد.', 'مسؤولية واضحة.'],
  lead: 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الموقع. كل خطوة موثّقة ومؤرخة باسم من قام بها، والتشغيل خلال أيام.',
  // His second badge, «ضمان استرجاع كامل المبلغ خلال 60 يوماً», set as the
  // home page's guarantee is: the period in bold, then the promise.
  badges: ['عرض حي · 30 دقيقة · بالعربية', '60 يوماً ضمان استرجاع كامل المبلغ'],
};

const SEARCH = {
  title: 'الملف التعريفي · ربائد',
  description:
    'ربائد تجمع المالك والاستشاري والمقاول على سجل واحد موثّق: مراسلات، اعتمادات، تقارير يومية، ومستندات. جاهزة خلال أيام.',
};

/** The site's one WhatsApp address, as the site settings were seeded (ticket 102 spec: Buttons and links). */
const SITE_WHATSAPP = 'https://wa.me/966576767900';

/** What an English address says while its page is not in English (`src/content/arabic-only-pages.ts`). */
const NOT_IN_ENGLISH = 'This page is not available in English yet.';

/**
 * Every link on the page that leads to the profile, in either language: the
 * header's menu and the Footer directory among them. The page itself, that
 * is, with or without a place on it — not the files kept beside it under
 * `/profile/`, such as the PDFs its own Download PDF gives (ticket 104).
 */
const linksToProfile = (page: Page) =>
  page.locator('a[href$="/profile"], a[href$="/profile/"], a[href*="/profile#"], a[href*="/profile?"]');

const listed = async (request: APIRequestContext, file: '/sitemap.xml' | '/llms.txt') => (await request.get(file)).text();

/** The hero's two buttons, as a visitor reaches them. */
const demoButton = (page: Page) => page.locator('#hero .ctas .btn.p');
const whatsappButton = (page: Page) => page.locator('#hero .ctas .btn.g');

test('until the founder publishes it, the Company profile is nowhere a visitor or a crawler can reach', async ({
  page,
  request,
  baseURL,
}) => {
  // Not found, and this site's own not-found: never sent on to the product
  // app, whose addresses are asked about when this site has no page (ADR-0026).
  const arabic = await request.get('/profile', { maxRedirects: 0 });
  expect(arabic.status()).toBe(404);
  expect(await arabic.text()).not.toContain(HERO.lead);

  // The English address says what every English page not yet in English says.
  const english = await request.get('/en/profile');
  expect(english.status()).toBe(200);
  expect(await english.text()).toContain(NOT_IN_ENGLISH);

  expect(await listed(request, '/sitemap.xml')).not.toContain(`${baseURL}/profile`);
  expect(await listed(request, '/sitemap.xml')).not.toContain(`${baseURL}/en/profile`);
  expect(await listed(request, '/llms.txt')).not.toContain('/profile');

  for (const path of ['/', '/en', '/product']) {
    await page.goto(path);
    await expect(linksToProfile(page), path).toHaveCount(0);
  }
});

test('previewed, it opens on the home page’s hero in Ahmed’s words, its buttons and the Trust strip an Editor sets', async ({
  page,
  cms,
}) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();

  await cms.preview('/profile');
  const hero = page.locator('section#hero');
  await expect(hero.locator('.eyebrow')).toHaveText(HERO.eyebrow);
  // Three lines: two, each ending in a break, and the third in colour.
  expect(await hero.locator('h1').evaluate((heading: HTMLElement) => heading.innerText.split('\n').map((line) => line.trim()))).toEqual(
    HERO.heading,
  );
  await expect(hero.locator('h1 span')).toHaveText(HERO.heading[2]);
  await expect(hero.locator('.lead')).toHaveText(HERO.lead);
  await expect(hero.locator('.trust')).toHaveText(HERO.badges[0]);
  await expect(hero.locator('.guar')).toHaveText(HERO.badges[1]);
  // The home page's drawing of the three parties, and its loop.
  await expect(hero.locator('.hero-art img.bld')).toHaveCount(3);
  await expect(hero.locator('#h-status')).not.toBeEmpty();

  // «احجز عرضاً حياً» to the home page's demo form; «تواصل واتساب», with no
  // link of its own, to the site's WhatsApp, in a new tab.
  await expect(demoButton(page)).toHaveText('احجز عرضاً حياً');
  await expect(demoButton(page)).toHaveAttribute('href', '/#demo');
  await expect(demoButton(page)).not.toHaveAttribute('target', /./);
  await expect(whatsappButton(page)).toHaveText('تواصل واتساب');
  await expect(whatsappButton(page)).toHaveAttribute('href', SITE_WHATSAPP);
  await expect(whatsappButton(page)).toHaveAttribute('target', '_blank');

  // The shared strip, with its marks.
  await expect(page.locator('section.logos .logos-row:not(.copy) .slot').first()).toBeVisible();

  // Every button's words and link are the Editor's, and so is the strip's switch.
  await profile.draft({
    ...saved,
    hero: {
      ...saved.hero,
      demoLabel: { ...saved.hero.demoLabel, ar: 'اطلب عرضاً' },
      demoLink: { ...saved.hero.demoLink, ar: '/start' },
      whatsappLabel: { ...saved.hero.whatsappLabel, ar: 'راسلنا' },
      whatsappLink: { ...saved.hero.whatsappLink, ar: 'https://wa.me/966500000000?text=profile' },
    },
    trustStrip: { shows: false },
  });
  await cms.preview('/profile');
  await expect(demoButton(page)).toHaveText('اطلب عرضاً');
  await expect(demoButton(page)).toHaveAttribute('href', '/start');
  await expect(whatsappButton(page)).toHaveText('راسلنا');
  await expect(whatsappButton(page)).toHaveAttribute('href', 'https://wa.me/966500000000?text=profile');
  await expect(page.locator('section.logos')).toHaveCount(0);
});

test('a link that is not an address is refused, and an empty demo link is too', async ({ cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();

  for (const demoLink of [
    { ...saved.hero.demoLink, ar: 'احجز' },
    { ...saved.hero.demoLink, ar: '' },
    // Begins like a path, and is another site.
    { ...saved.hero.demoLink, ar: '//another.example/demo' },
  ]) {
    const response = await profile.attempt({ ...saved, hero: { ...saved.hero, demoLink } }, 'published');
    expect(response.status(), JSON.stringify(demoLink)).toBe(400);
  }
});

test('published, it is a page of the site, in the sitemap and llms.txt, linked from no header or footer', async ({
  page,
  request,
  baseURL,
  cms,
}) => {
  const profile = cms.entry('profile-page');
  await profile.publish(await profile.published());

  const html = await reachesVisitors(request, '/profile', HERO.lead, 'the published Company profile');
  expect((await request.get('/profile')).status()).toBe(200);

  await page.goto('/profile');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  // The site's own header and footer, and nothing in them leads here.
  await expect(page.locator('nav.nav')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(linksToProfile(page)).toHaveCount(0);
  await expect(page.locator('section#hero h1')).toContainText(HERO.heading[0]);
  await expect(whatsappButton(page)).toHaveAttribute('href', SITE_WHATSAPP);
  await expect(page.locator('section.logos')).toHaveCount(1);

  // Its own title, description and sharing picture: Ahmed's.
  await expect(page).toHaveTitle(SEARCH.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', SEARCH.description);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/profile`);
  const picture = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(picture).toBe(`${baseURL}/profile/og-ar.png`);
  const file = await request.get(picture!);
  expect(file.status()).toBe(200);
  expect(file.headers()['content-type']).toBe('image/png');
  // No English alternate while there is no English page.
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0);

  // Its place in the site, for a search engine.
  const [breadcrumbs] = nodesOf(structuredData(html), 'BreadcrumbList');
  expect(trail(breadcrumbs!)).toEqual([
    ['الرئيسية', baseURL!],
    ['الملف التعريفي', `${baseURL}/profile`],
  ]);

  // Found by search engines and assistants, though no menu leads to it.
  await reaching('the profile in the sitemap', async () => (await listed(request, '/sitemap.xml')).includes(`<loc>${baseURL}/profile</loc>`)).toBe(true);
  expect(await listed(request, '/sitemap.xml')).not.toContain(`${baseURL}/en/profile`);
  await reaching('the profile in llms.txt', async () => listed(request, '/llms.txt')).toContain(
    `- [الملف التعريفي](${baseURL}/profile): ${SEARCH.description}`,
  );
  for (const path of ['/', '/product']) {
    await page.goto(path);
    await expect(linksToProfile(page), path).toHaveCount(0);
  }

  // Its English waits for its own publishing.
  expect(await (await request.get('/en/profile')).text()).toContain(NOT_IN_ENGLISH);
});
