/**
 * The Company profile's close (ticket 109): Ahmed's sections 10 to 14 — the
 * pre-made templates' flip cards, why Rabaed, the impact's six figures, the
 * plans and how we start — his footer as the page's last section, `#contact`,
 * above the site's own footer, and the WhatsApp button that floats over this
 * page alone. Every word is an Editor's, every button's link too, and each
 * section has its own switch. The WhatsApp buttons left without a link, and
 * the company WhatsApp, are the site's one number, from the site settings.
 *
 * The profile is unpublished on this server (`profile-page.spec.ts` publishes
 * it on the second), so everything here is seen as an Editor previews it, and
 * nothing is published: each change is a draft, which the entries fixture
 * puts back when the test ends.
 *
 * Ahmed's words are restated from his profile (`.scratch/company-profile/source/`)
 * rather than imported from the migration, for the reason `routes.ts` gives.
 */
import type { Page } from '@playwright/test';
import { test, expect, type Cms } from './entries';
import { sidewaysOverflow, whatOverflows } from './geometry';
import { HEADER_BACKGROUND_OVER_DARK, HEADER_BACKGROUND_OVER_LIGHT } from './header-colours';
import { ROUTES } from './routes';
import { oneSuiteAtATime } from './one-suite-at-a-time';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

const TEMPLATES = {
  eyebrow: 'نماذج جاهزة',
  title: 'نماذج جاهزة للاستخدام مباشرة.',
  hint: 'اضغط على أي نموذج لترى استخدامه',
  codes: ['SAR', 'MAR', 'DAR', 'MIR', 'WIR', 'RFI', 'DAS', 'NPD', 'NPV'],
  firstName: 'طلب اعتماد مورّد',
  firstBack: 'اعتماد المورّد أو المصنّع قبل التوريد، مع وثائق التأهيل.',
};

const WHY = {
  eyebrow: 'لماذا ربائد',
  title: 'ثلاث ميزات لا يجمعها منافس في آن واحد.',
  names: ['واجهة عربية سهلة الاستخدام', 'دعم ميداني في موقعك', 'مبني ومسعّر للشركات الصغيرة والمتوسطة'],
};

const IMPACT = {
  eyebrow: 'الأثر',
  title: 'تأثير موثّق بالأرقام.',
  figures: ['3.6×', '7×', '31%', '22%', '+1,900', '15'],
  /** What each figure counts up from while it waits below the window. */
  waiting: ['0.0×', '0×', '0%', '0%', '+0', '0'],
  labels: [
    'أسرع في الاعتمادات والاستلامات',
    'أسرع في استرجاع الوثائق',
    'توفير في وقت المهام الإدارية',
    'تحسّن في حوكمة الوثائق',
    'معاملة اعتماد موثّقة على المنصة',
    'جلسة تعريفية واحدة لكل فريق',
  ],
  activation: 'تفعيل ميداني كامل خلال أيام، دون توقف العمل.',
  source: 'المصدر: بيانات مشاريع ربائد',
};

const PLANS = {
  eyebrow: 'الباقات',
  names: ['الأساسية', 'النمو', 'الاحترافية'],
  kickers: ['البداية', 'الأكثر اختياراً', 'رسوم سنوية ثابتة'],
  features: [3, 4, 5],
  badge: 'الأكثر طلباً',
};

const START = {
  eyebrow: 'كيف نبدأ',
  title: 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
  steps: ['إعداد', 'تشغيل', 'ضمان 60 يوماً'],
  cardTitle: 'احجز عرضاً حياً بأمثلة من مشروعك',
  demo: 'احجز عرضاً حياً',
  whatsapp: 'تواصل واتساب',
};

const CONTACT = {
  tagline: 'نسعى لتشكيل مستقبل تكنولوجيا الإنشاءات.',
  name: 'أحمد السوسي',
  phone: '+966 59 600 6615',
  email: 'Ahmed.s@rabaedapp.com',
  location: 'الرياض، المملكة العربية السعودية',
};

/** The site's one WhatsApp number, as the founder confirmed it (spec: Buttons and links), and as the contact section writes it. */
const SITE_WHATSAPP = { number: '966576767900', written: '+966 57 676 7900' };

const section = (page: Page, id: string) => page.locator(`section#${id}`);
const cards = (page: Page) => section(page, 'templates').locator('button.pf-card');
const figures = (page: Page) => section(page, 'impact').locator('[data-count-up]');
const floating = (page: Page) => page.locator('a.pf-wa');

/** The site settings as published, which the test server's database is seeded with. */
async function siteWhatsapp(cms: Cms) {
  const settings = await cms.entry('site-settings').published();
  expect(settings.whatsappNumber, 'the site’s WhatsApp number').toBe(SITE_WHATSAPP.number);
  return `https://wa.me/${SITE_WHATSAPP.number}`;
}

test('10, the templates: nine flip cards, each turned by a click or a key and back again', async ({ page, cms }) => {
  await cms.preview('/profile');
  const templates = section(page, 'templates');
  await expect(templates.locator('.eyebrow')).toContainText('10');
  await expect(templates.locator('.eyebrow')).toContainText(TEMPLATES.eyebrow);
  await expect(templates.locator('h2')).toHaveText(TEMPLATES.title);
  await expect(templates.locator('.pf-hint')).toHaveText(TEMPLATES.hint);
  await expect(templates).not.toHaveClass(/\blight\b/);

  await expect(cards(page)).toHaveCount(9);
  await expect(cards(page).locator('.pf-front b')).toHaveText(TEMPLATES.codes);
  const first = cards(page).first();
  await expect(first.locator('.pf-front')).toContainText(TEMPLATES.firstName);
  // Both faces are in the first response, the back read out with the front.
  await expect(first.locator('.pf-back')).toContainText(TEMPLATES.firstBack);
  for (const card of await cards(page).all()) await expect(card).toHaveAttribute('aria-pressed', 'false');

  // A click turns it over, and another turns it back.
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(cards(page).nth(1)).toHaveAttribute('aria-pressed', 'false');
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'false');

  // From the keyboard: Enter and Space each turn the focused card.
  const second = cards(page).nth(1);
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(second).toHaveAttribute('aria-pressed', 'false');

  // The cards are the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [card, ...rest] = saved.templates.cards;
  await profile.draft({
    ...saved,
    templates: {
      ...saved.templates,
      cards: [{ ...card!, code: 'ITP', name: { ...card!.name, ar: 'خطة الفحص' } }, ...rest],
    },
  });
  await cms.preview('/profile');
  await expect(cards(page).first().locator('.pf-front b')).toHaveText('ITP');
  await expect(cards(page).first().locator('.pf-front')).toContainText('خطة الفحص');
});

/**
 * Which face of `card` a visitor sees once it has settled: the back faces
 * them when it is turned to them, its transform's first column pointing the
 * same way as the page's.
 */
const faceShowing = (card: ReturnType<typeof cards>) =>
  card.evaluate((element) => {
    const back = new DOMMatrixReadOnly(getComputedStyle(element.querySelector('.pf-back')!).transform);
    return back.m11 > 0.99 ? 'back' : back.m11 < -0.99 ? 'front' : 'turning';
  });

test('10, on a mouse a card turns only when pressed, and shows the face aria-pressed says', async ({ page, cms }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/profile');
  const first = cards(page).first();
  await first.scrollIntoViewIfNeeded();

  // Resting under the pointer is not pressing it.
  await first.hover();
  await page.waitForTimeout(800);
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  expect(await faceShowing(first), 'hovered, not pressed').toBe('front');

  // Pressed, it turns, and stays turned with the pointer still on it or gone.
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => faceShowing(first), { message: 'pressed, under the pointer' }).toBe('back');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);
  expect(await faceShowing(first), 'pressed, the pointer gone').toBe('back');

  // Pressed again, it turns back, under the pointer as well.
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => faceShowing(first), { message: 'pressed again' }).toBe('front');
});

test('every Arabic label on the profile asks Thmanyah Sans for its one weight, Regular', async ({ page, cms }) => {
  // The site serves Thmanyah Regular alone (ADR-0018): a label asking for
  // another weight gets one the browser fakes. `fonts.spec.ts` holds every
  // page in `routes.ts` to this, which the unpublished profile is not in.
  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/profile');
  const bolder = await page.evaluate(() =>
    [...document.querySelectorAll('body *')].flatMap((element) => {
      const style = getComputedStyle(element);
      const own = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim());
      if (!own || !style.fontFamily.startsWith('"Thmanyah Sans"') || style.fontWeight === '400') return [];
      return [`${element.tagName.toLowerCase()}.${[...element.classList].join('.')} at ${style.fontWeight}`];
    }),
  );
  expect(bolder).toEqual([]);
});

test('11, why Rabaed: three cards on a light ground', async ({ page, cms }) => {
  await cms.preview('/profile');
  const why = section(page, 'why');
  await expect(why.locator('.eyebrow')).toContainText('11');
  await expect(why.locator('.eyebrow')).toContainText(WHY.eyebrow);
  await expect(why.locator('h2')).toHaveText(WHY.title);
  await expect(why.locator('li h3')).toHaveText(WHY.names);
  await expect(why.locator('li p')).toHaveCount(3);
  await expect(why).toHaveClass(/\blight\b/);
});

test('12, the impact: six figures, whole in the first response, counting up as they are reached', async ({ page, cms }) => {
  await cms.preview('/profile');
  // What the server sends, before any script runs: every figure at its value.
  const html = await (await page.reload())!.text();
  for (const figure of IMPACT.figures) expect(html).toContain(`>${figure}<`);

  const impact = section(page, 'impact');
  await expect(impact.locator('.eyebrow')).toContainText('12');
  await expect(impact.locator('.eyebrow')).toContainText(IMPACT.eyebrow);
  await expect(impact.locator('h2')).toHaveText(IMPACT.title);
  await expect(impact.locator('li p')).toHaveText(IMPACT.labels);
  // The last figure is fifteen minutes: the word after it is the CMS's.
  await expect(impact.locator('li').last().locator('.pf-unit')).toHaveText('دقيقة');
  await expect(impact.locator('.pf-activation')).toHaveText(IMPACT.activation);
  await expect(impact.locator('.pf-impact-source')).toHaveText(IMPACT.source);
  await expect(impact).not.toHaveClass(/\blight\b/);

  // Below the fold they wait at nothing, and count up to their value once reached.
  await expect(figures(page)).toHaveText(IMPACT.waiting);
  await impact.locator('ul').scrollIntoViewIfNeeded();
  await expect(figures(page)).toHaveText(IMPACT.figures);

  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [first, ...rest] = saved.impact.figures;
  await profile.draft({
    ...saved,
    impact: {
      ...saved.impact,
      figures: [{ ...first!, figure: '4.2×', label: { ...first!.label, ar: 'أسرع في الاستلامات' } }, ...rest],
      source: { ...saved.impact.source, ar: 'المصدر: دراسة' },
    },
  });
  await cms.preview('/profile');
  await impact.locator('ul').scrollIntoViewIfNeeded();
  await expect(figures(page).first()).toHaveText('4.2×');
  await expect(impact.locator('li p').first()).toHaveText('أسرع في الاستلامات');
  await expect(impact.locator('.pf-impact-source')).toHaveText('المصدر: دراسة');
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('12’s figures stand at their values and never count', async ({ page, cms }) => {
    await cms.preview('/profile');
    await expect(figures(page)).toHaveText(IMPACT.figures);
    await section(page, 'impact').scrollIntoViewIfNeeded();
    // Long enough for a count-up to have begun, had one been started.
    await page.waitForTimeout(400);
    await expect(figures(page)).toHaveText(IMPACT.figures);
  });
});

test('without JavaScript, 12’s figures are at their values and every card’s back is there to read', async ({ browser, page, cms }) => {
  await cms.preview('/profile');
  const context = await browser.newContext({ javaScriptEnabled: false, storageState: await page.context().storageState() });
  const still = await context.newPage();
  await still.goto('/profile');
  await section(still, 'impact').scrollIntoViewIfNeeded();
  await expect(figures(still)).toHaveText(IMPACT.figures);
  await expect(cards(still).first().locator('.pf-back')).toContainText(TEMPLATES.firstBack);
  await context.close();
});

test('13, the plans: three, with their features, the badge on the middle one, and no prices', async ({ page, cms }) => {
  await cms.preview('/profile');
  const plans = section(page, 'plans');
  await expect(plans.locator('.eyebrow')).toContainText('13');
  await expect(plans.locator('.eyebrow')).toContainText(PLANS.eyebrow);
  await expect(plans.locator('.pf-plan h3')).toHaveText(PLANS.names);
  await expect(plans.locator('.pf-plan .pf-kicker-line')).toHaveText(PLANS.kickers);
  for (const [index, count] of PLANS.features.entries()) {
    await expect(plans.locator('.pf-plan').nth(index).locator('ul li')).toHaveCount(count);
  }
  await expect(plans.locator('.pf-badge')).toHaveCount(1);
  await expect(plans.locator('.pf-plan').nth(1).locator('.pf-badge')).toHaveText(PLANS.badge);
  await expect(plans).toHaveClass(/\blight\b/);
  // Without prices (spec: Out of Scope).
  expect(await plans.textContent()).not.toMatch(/ر\.س|SAR|ريال/);

  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const [basic, ...rest] = saved.plans.tiers;
  await profile.draft({
    ...saved,
    plans: {
      ...saved.plans,
      tiers: [{ ...basic!, features: [...basic!.features, { feature: { ar: 'تقارير شهرية', en: 'Monthly reports' } }] }, ...rest],
    },
  });
  await cms.preview('/profile');
  await expect(plans.locator('.pf-plan').first().locator('ul li')).toHaveCount(4);
  await expect(plans.locator('.pf-plan').first().locator('ul li').last()).toHaveText('تقارير شهرية');
});

test('14, how we start: three steps, then the closing card’s two buttons, each with its own words and link', async ({ page, cms }) => {
  const whatsapp = await siteWhatsapp(cms);
  await cms.preview('/profile');
  const start = section(page, 'start');
  await expect(start.locator('.eyebrow')).toContainText('14');
  await expect(start.locator('.eyebrow')).toContainText(START.eyebrow);
  await expect(start.locator('h2')).toHaveText(START.title);
  await expect(start.locator('ol li h3')).toHaveText(START.steps);
  await expect(start.locator('.pf-cta h3')).toHaveText(START.cardTitle);
  await expect(start).toHaveClass(/\blight\b/);

  const demo = start.locator('.pf-cta a.btn.p');
  const chat = start.locator('.pf-cta a.btn.g');
  await expect(demo).toHaveText(START.demo);
  // To the home page's demo form, since this page has none.
  await expect(demo).toHaveAttribute('href', '/#demo');
  await expect(demo).not.toHaveAttribute('target', /./);
  await expect(chat).toHaveText(START.whatsapp);
  // Left without a link: the site's WhatsApp, in a new tab.
  await expect(chat).toHaveAttribute('href', whatsapp);
  await expect(chat).toHaveAttribute('target', '_blank');

  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({
    ...saved,
    start: {
      ...saved.start,
      demoLabel: { ...saved.start.demoLabel, ar: 'اطلب عرض الحملة' },
      demoLink: { ...saved.start.demoLink, ar: 'https://example.com/campaign' },
      whatsappLabel: { ...saved.start.whatsappLabel, ar: 'راسلنا' },
      whatsappLink: { ar: 'https://wa.me/966500000000?text=start', en: '' },
    },
  });
  await cms.preview('/profile');
  await expect(demo).toHaveText('اطلب عرض الحملة');
  await expect(demo).toHaveAttribute('href', 'https://example.com/campaign');
  await expect(demo).toHaveAttribute('target', '_blank');
  await expect(chat).toHaveText('راسلنا');
  await expect(chat).toHaveAttribute('href', 'https://wa.me/966500000000?text=start');
});

test('the contact section: Ahmed’s tagline, name, mobile and email, the company WhatsApp and the social links from the site settings, then the site’s footer', async ({
  page,
  cms,
}) => {
  const whatsapp = await siteWhatsapp(cms);
  await cms.preview('/profile');
  const contact = section(page, 'contact');
  await expect(contact.locator('.pf-tagline')).toHaveText(CONTACT.tagline);
  await expect(contact.locator('.pf-person')).toHaveText(CONTACT.name);
  await expect(contact.locator(`a[href="tel:+966596006615"]`)).toContainText(CONTACT.phone);
  await expect(contact.locator(`a[href="mailto:${CONTACT.email}"]`)).toContainText(CONTACT.email);
  const company = contact.locator(`a[href="${whatsapp}"]`);
  await expect(company).toContainText('واتساب الشركة');
  await expect(company).toContainText(SITE_WHATSAPP.written);
  await expect(contact.locator('.pf-location')).toHaveText(CONTACT.location);
  await expect(contact).not.toHaveClass(/\blight\b/);
  // The page's last section, with the site's own footer under it.
  expect(
    await page.evaluate(() => {
      const parts = [...document.querySelectorAll('section, footer')];
      return parts[parts.indexOf(document.getElementById('contact')!) + 1]?.tagName;
    }),
  ).toBe('FOOTER');

  // No social account is supplied on this server, so none is linked.
  await expect(contact.locator('.pf-social a')).toHaveCount(0);

  // The accounts and the number are the site settings', changed there.
  const settings = cms.entry('site-settings');
  const published = await settings.published();
  await settings.draft({
    ...published,
    whatsappNumber: '966511122233',
    social: { ...published.social, linkedin: 'https://www.linkedin.com/company/rabaed', x: 'https://x.com/Rabaedsa' },
  });
  await cms.preview('/profile');
  await expect(contact.locator('.pf-social a')).toHaveText(['LinkedIn', 'X']);
  await expect(contact.locator('.pf-social a').first()).toHaveAttribute('href', 'https://www.linkedin.com/company/rabaed');
  await expect(contact.locator('a[href="https://wa.me/966511122233"]')).toContainText('+966 51 112 2233');
  await expect(section(page, 'start').locator('.pf-cta a.btn.g')).toHaveAttribute('href', 'https://wa.me/966511122233');
  await expect(floating(page)).toHaveAttribute('href', 'https://wa.me/966511122233');

  // Ahmed's words are the Editor's.
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({ ...saved, contact: { ...saved.contact, phone: '+966 50 000 0000', tagline: { ...saved.contact.tagline, ar: 'سطر المحرر.' } } });
  await cms.preview('/profile');
  await expect(contact.locator('.pf-tagline')).toHaveText('سطر المحرر.');
  await expect(contact.locator('a[href="tel:+966500000000"]')).toContainText('+966 50 000 0000');
});

test('the floating WhatsApp button: on the profile, at the bottom corner on the reading end, to the site’s WhatsApp', async ({ page, cms }) => {
  const whatsapp = await siteWhatsapp(cms);
  await page.setViewportSize({ width: 1280, height: 800 });
  await cms.preview('/profile');
  const button = floating(page);
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('href', whatsapp);
  await expect(button).toHaveAttribute('aria-label', START.whatsapp);
  await expect(button).toHaveAttribute('target', '_blank');
  // It stays put as the page scrolls, at the bottom, on the left of an Arabic page.
  await section(page, 'impact').scrollIntoViewIfNeeded();
  const box = (await button.boundingBox())!;
  expect(box.y + box.height).toBeGreaterThan(800 - 40);
  expect(box.x).toBeLessThan(40);

  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({
    ...saved,
    whatsappButton: { label: { ...saved.whatsappButton.label, ar: 'محادثة' }, link: { ar: 'https://wa.me/966500000000', en: '' } },
  });
  await cms.preview('/profile');
  await expect(button).toHaveAttribute('aria-label', 'محادثة');
  await expect(button).toHaveAttribute('href', 'https://wa.me/966500000000');
});

test('no other page has the floating WhatsApp button', async ({ page, request }) => {
  for (const route of ROUTES) {
    const html = await (await request.get(route.path)).text();
    expect(html, route.path).not.toContain('pf-wa');
  }
  await page.goto('/');
  await expect(floating(page)).toHaveCount(0);
});

test('the header turns light over 11, 13 and 14, and dark again over 12 and the contact section', async ({ page, cms }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await cms.preview('/profile');
  const background = () => page.locator('.nav').evaluate((nav) => getComputedStyle(nav).backgroundColor);
  for (const [id, colour] of [
    ['templates', HEADER_BACKGROUND_OVER_DARK],
    ['why', HEADER_BACKGROUND_OVER_LIGHT],
    ['impact', HEADER_BACKGROUND_OVER_DARK],
    ['plans', HEADER_BACKGROUND_OVER_LIGHT],
    ['start', HEADER_BACKGROUND_OVER_LIGHT],
    ['contact', HEADER_BACKGROUND_OVER_DARK],
  ] as const) {
    // The section's top just under the header's lower edge.
    await page.evaluate((target) => {
      const element = document.getElementById(target)!;
      window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 40);
    }, id);
    await expect.poll(background, { message: `over #${id}` }).toBe(colour);
  }
});

test('each section hides with its own switch, keeping its words, and the others keep their numbers', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const numbered = { templates: '10', why: '11', impact: '12', plans: '13', start: '14' } as const;
  const ids = [...Object.keys(numbered), 'contact'] as (keyof typeof numbered | 'contact')[];

  for (const hidden of ids) {
    await profile.draft({ ...saved, [hidden]: { ...saved[hidden], shows: false } });
    await cms.preview('/profile');
    await expect(section(page, hidden), hidden).toHaveCount(0);
    for (const [shown, number] of Object.entries(numbered)) {
      if (shown === hidden) continue;
      await expect(section(page, shown).locator('.pf-num').first(), `${shown} with ${hidden} hidden`).toHaveText(number);
    }
  }

  await profile.draft({ ...saved, plans: { ...saved.plans, shows: true } });
  await cms.preview('/profile');
  await expect(section(page, 'plans').locator('.pf-plan h3')).toHaveText(PLANS.names);
});

test('in English: Ahmed’s English words, and the demo button to the English form', async ({ page, cms }) => {
  // The Screen mocks too, which section 07 shows: whether English is waiting
  // as their newest draft depends on what the suite before put back.
  for (const slug of ['site-words', 'trust-strip', 'screen-mocks', 'profile-page'] as const) {
    const entry = cms.entry(slug);
    await entry.draft({ ...(await entry.published()), languages: ['ar', 'en'] });
  }
  await cms.preview('/en/profile');
  await expect(section(page, 'templates').locator('h2')).toHaveText('Forms, ready out of the box.');
  await expect(section(page, 'why').locator('li h3').first()).toHaveText('User-friendly Arabic interface');
  await expect(section(page, 'impact').locator('li').last().locator('.pf-unit')).toHaveText('min');
  await expect(section(page, 'impact').locator('.pf-impact-source')).toHaveText('Source: Rabaed project data');
  await expect(section(page, 'plans').locator('.pf-badge')).toHaveText('Most requested');
  await expect(section(page, 'start').locator('.pf-cta a.btn.p')).toHaveAttribute('href', '/en#demo');
  await expect(section(page, 'contact').locator('.pf-person')).toHaveText('Ahmed Alsosi');
  await expect(floating(page)).toHaveAttribute('aria-label', 'WhatsApp us');
  // On the right of an English page.
  const box = (await floating(page).boundingBox())!;
  expect(box.x + box.width).toBeGreaterThan((page.viewportSize()?.width ?? 1280) - 40);
});

for (const phone of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`at ${phone.width}px, nothing in the close reaches past the screen`, async ({ page, cms }) => {
    await page.setViewportSize(phone);
    await cms.preview('/profile');
    for (const id of ['templates', 'why', 'impact', 'plans', 'start', 'contact']) {
      await section(page, id).scrollIntoViewIfNeeded();
      const past = (await whatOverflows(page)).filter((culprit) => culprit.startsWith(`#${id} `));
      expect(past, `#${id}`).toEqual([]);
      expect(await sidewaysOverflow(page), `#${id}`).toBeLessThanOrEqual(0);
    }
    // A card turned over stays inside the screen too.
    await cards(page).first().click();
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}
