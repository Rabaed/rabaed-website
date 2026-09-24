/**
 * The referral page's text in the CMS (ticket 56): Ahmed rewords a section,
 * adds a step, a side to the offer and a point to the terms, hides sections,
 * previews the page and publishes it — and the CMS refuses what the design
 * cannot carry, and a value the site does not hold.
 *
 * How page text works is `page-text.spec.ts`'s, on the start page. This holds
 * the referral page's entry to it, and nothing here publishes a change the
 * referral page's other suites, running beside it, could notice: rewording,
 * adding and hiding are drafts checked in the editor's preview, and the two
 * changes published are a space at the end of the signup's paragraph, which no
 * screenshot shows and no suite reads, and English listed with words of its
 * own, which the Arabic page does not show. Changing the Referral Program values
 * themselves is `referral-program-values.spec.ts`'s, which runs against a
 * server of its own (`playwright.config.ts`).
 *
 * The tests sign in as an editor of their own and run one at a time, and what
 * they change is put back when each ends (`entries.ts`).
 */
import type { APIRequestContext, Page } from '@playwright/test';
import { reachesVisitors, outsideTheHeader } from './cms';
import { test, expect, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

type Referral = Entry<'referral-page'>;
/** A word as the CMS holds it: its Arabic and its English. */
type Words = Referral['hero']['title'];
type Step = Referral['howItWorks']['steps'][number];

const arabic = (words: string): Words => ({ ar: words, en: null });

async function visitorHtml(request: APIRequestContext): Promise<string> {
  return (await request.get('/referral')).text();
}

/** Where each of a row of cards sits. */
function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
}

test('the referral page shows the words the CMS has published, every section of it, in Arabic only', async ({
  page,
  request,
  cms,
}) => {
  const referral = cms.entry('referral-page');
  const entry = await referral.published();
  const html = await visitorHtml(request);

  expect(entry.languages).toEqual(['ar']);
  for (const words of [
    entry.hero.eyebrow,
    entry.hero.primaryLabel,
    entry.hero.figures[2].label,
    entry.howItWorks.heading,
    entry.howItWorks.steps[0].title,
    entry.offer.heading,
    entry.offer.sides[0].text,
    entry.audience.heading,
    entry.audience.kinds[4].title,
    // Optional in the CMS; these two have their bold words.
    entry.audience.partnership.bold!,
    entry.audience.partnership.linkLabel,
    entry.whatIsReferred.paragraphs[1].text,
    entry.whatIsReferred.linkLabel,
    entry.termsSummary.points[7].bold!,
    entry.termsSummary.linkLabel,
    entry.questions.heading,
    entry.signup.heading,
    entry.signup.benefits[0].text,
    entry.signup.guarantee.text,
  ]) {
    expect(html).toContain(words.ar);
  }
});

test('the words quote the Referral Program values by name, never as typed amounts', async ({ page, cms }) => {
  const referral = cms.entry('referral-page');
  // Without the rows' ids and the dates, whose digits could hold «2000» by chance.
  const stored = JSON.stringify(await referral.published());

  expect(stored).toContain('{payout}');
  expect(stored).toContain('{clientDiscount}');
  for (const amount of ['2,000', '2000', '10%']) expect(stored).not.toContain(amount);
});

test('a reworded heading, a fifth step, a third side, a ninth point and hidden sections are previewed, and never reach a visitor', async ({
  page,
  request,
  cms,
}) => {
  const referral = cms.entry('referral-page');
  const entry = await referral.published();
  const heading = `${entry.offer.heading.ar} — مسودة`;
  const step: Step = {
    label: arabic('تابع'),
    title: arabic('كل شهر'),
    text: arabic('يصلك كشف بإحالاتك ومستحقاتك في بداية كل شهر.'),
    markedOut: false,
  };
  const side = { badge: arabic('للمطوّر'), title: arabic('تجربة على مشروعه'), text: arabic('يرى المنصة على مشروعه قبل أن يقرر.') };
  const point = { bold: arabic('لا رسوم'), rest: arabic('على التسجيل أو الصرف.') };
  const draft = entry;

  await referral.draft({
    ...draft,
    howItWorks: { ...draft.howItWorks, steps: [...draft.howItWorks.steps, step] },
    offer: { ...draft.offer, heading: { ...draft.offer.heading, ar: heading }, sides: [...draft.offer.sides, side] },
    termsSummary: { ...draft.termsSummary, points: [...draft.termsSummary.points, point] },
    audience: { ...draft.audience, shows: false },
    whatIsReferred: { ...draft.whatIsReferred, shows: false },
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/referral');
  await expect(page.locator('#offer h2')).toHaveText(heading);

  const steps = page.locator('#how .s');
  await expect(steps.locator('h3')).toHaveText([...entry.howItWorks.steps.map((each) => each.title.ar!), step.title.ar!]);
  await expect(steps.last().locator('.k')).toHaveText(`05 · ${step.label.ar}`);
  await expect(page.locator('#offer .strip .c h3').last()).toHaveText(side.title.ar!);
  await expect(page.locator('#terms li')).toHaveCount(9);
  await expect(page.locator('#terms li').last()).toHaveText(`9${point.bold.ar} ${point.rest.ar}`);
  await expect(page.locator('#who')).toHaveCount(0);
  await expect(page.locator('#what')).toHaveCount(0);

  // Five steps sit in a row of three and a row of two, all one width, not
  // four and one alone.
  const five = await boxes(page, '#how .s');
  expect(five[0].y).toBe(five[2].y);
  expect(five[3].y).toBe(five[4].y);
  expect(five[3].y).toBeGreaterThan(five[0].y);
  expect(five[0].width).toBeCloseTo(five[4].width, 0);

  // Three sides: two in a row, and the third across the whole row under them.
  const sides = await boxes(page, '#offer .strip .c');
  expect(sides[0].y).toBe(sides[1].y);
  expect(sides[2].y).toBeGreaterThan(sides[0].y);
  expect(sides[2].width).toBeGreaterThan(sides[0].width * 2);

  const html = await visitorHtml(request);
  expect(html).not.toContain(heading);
  expect(html).not.toContain(step.title.ar);
  expect(html).not.toContain(side.title.ar);
  expect(html).toContain(entry.audience.heading.ar);
  expect(html).toContain(entry.whatIsReferred.heading.ar);
});

test('the sections the hero lands on have no switch to hide them; a section that can hide has one', async ({ page, cms }) => {
  const admin = await cms.openInAdmin('referral-page');

  await admin.openSection('Offer');
  await expect(page.getByLabel('Shows on the page')).toBeVisible();

  for (const linked of ['How it works', 'Signup']) {
    await admin.openSection(linked);
    await expect(page.getByText(/Always shows/), linked).toBeVisible();
    await expect(page.getByLabel('Shows on the page'), linked).toHaveCount(0);
  }
});

test('words too long for their card, a list too long or empty, and a value the site does not hold are refused', async ({
  page,
  cms,
}) => {
  const referral = cms.entry('referral-page');
  const entry = await referral.published();
  const { hero, howItWorks, offer, signup } = entry;
  const step: Step = { label: arabic('خطوة'), title: arabic('خطوة إضافية'), text: arabic('نص خطوة إضافية.'), markedOut: false };
  const withBenefit = (text: string) => ({ ...entry, signup: { ...signup, benefits: [...signup.benefits.slice(1), { text: arabic(text) }] } });

  const refused: Record<string, Entry<'referral-page'>> = {
    'a figure longer than its box': { ...entry, hero: { ...hero, figures: [{ ...hero.figures[0], figure: arabic('ع'.repeat(25)) }, ...hero.figures.slice(1)] } },
    'a fifth figure': { ...entry, hero: { ...hero, figures: [...hero.figures, hero.figures[2], hero.figures[2]] } },
    'nine steps': { ...entry, howItWorks: { ...howItWorks, steps: Array.from({ length: 9 }, () => step) } },
    'a badge longer than its corner': { ...entry, offer: { ...offer, sides: [{ ...offer.sides[0], badge: arabic('ل'.repeat(13)) }, ...offer.sides.slice(1)] } },
    'no benefits': { ...entry, signup: { ...signup, benefits: [] } },
    'a value the site does not hold': withBenefit('{bonus} ريال لكل مشروع'),
    'published in English with no English words': { ...entry, languages: ['ar', 'en'] },
  };
  for (const [what, data] of Object.entries(refused)) {
    const response = await referral.attempt(data, 'published');
    expect(response.status(), what).toBe(400);
  }

  // Nothing refused was kept.
  expect(await referral.published()).toEqual(entry);
});

/** Every word of an entry that has Arabic given English of its own; a word left empty stays empty. */
function withEnglish<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withEnglish) as T;
  if (value && typeof value === 'object') {
    if ('ar' in value) return value.ar ? { ...value, en: 'English' } : value;
    return Object.fromEntries(Object.entries(value).map(([key, each]) => [key, withEnglish(each)])) as T;
  }
  return value;
}

test('the referral page is published in English once every word it has is written in English', async ({ page, request, cms }) => {
  const referral = cms.entry('referral-page');
  const entry = await referral.published();

  // Paragraphs with no bold phrase have none in either language, and that is
  // no reason to refuse the English.
  // A visitor's Arabic page is meant to come back exactly as it was, which
  // leaves nothing in it to wait for — and a publish is in nobody's page the
  // moment it is saved (`cms.ts`). So the English is published together with a
  // space at the end of the signup's paragraph, which is in the HTML and drawn
  // nowhere, and the page waited for is the one that space arrives in: built
  // from this publish, not from before it.
  const english = withEnglish(entry);
  const lead = `${entry.signup.lead.ar} `;
  await referral.publish({ ...english, signup: { ...english.signup, lead: { ...english.signup.lead, ar: lead } }, languages: ['ar', 'en'] });
  expect((await referral.published()).languages).toEqual(['ar', 'en']);

  const html = await reachesVisitors(request, '/referral', `${lead}</p>`, 'the referral page published in English');
  expect(html).toContain(entry.signup.heading.ar);
  expect(outsideTheHeader(html)).not.toContain('>English<');
});

test('a change published reaches visitors', async ({ page, request, cms }) => {
  const referral = cms.entry('referral-page');
  const entry = await referral.published();
  // A space at the end of the paragraph: in the HTML, but drawn nowhere.
  const lead = `${entry.signup.lead.ar} `;

  await referral.publish({ ...entry, signup: { ...entry.signup, lead: arabic(lead) } });
  await reachesVisitors(request, '/referral', `${lead}</p>`, "the referral page's reworded paragraph");
});
