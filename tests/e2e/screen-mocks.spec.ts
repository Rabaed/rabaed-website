/**
 * Screen mocks: the studio that renders them and the images exported from it
 * (ticket 05, ADR-0002).
 *
 * Three things have to stay true, and each fails in a different way:
 *
 *  1. The studio renders a mock exactly as the Reference site does. The markup
 *     was lifted out of `reference/site/` by hand, and a mock is 15–50 KB of
 *     absolutely positioned inline styles — a truncation would not look like
 *     an error, it would look like a slightly different screen.
 *  2. The committed image belongs to the markup as it currently stands.
 *     Otherwise a label gets edited, nobody re-runs the export, and the site
 *     keeps serving last month's picture with this month's markup in the repo
 *     to prove it was fixed.
 *
 *     Checked two ways, because neither does the whole job on every machine.
 *     The export records the SHA-256 of the markup each image was made from,
 *     and comparing that runs anywhere. Comparing the *pixels* of a committed
 *     image against a fresh render is stronger — it catches a change in the
 *     renderer or the fonts as well — but it can only pass on the machine that
 *     produced the image: text rasterises differently on a hosted Linux
 *     runner, which CI demonstrated by failing all eight of them at once.
 *     Those are tagged `@pixel`; CI skips them and `npm test` runs them.
 *
 *     Both skip a mock an Editor has replaced in the admin (ticket 57): the
 *     pages show the replacement, so a stale export harms nothing (spec:
 *     Screen mocks).
 *  3. The studio is not indexable. It is a private route that exists to be
 *     photographed, and its contents duplicate pages that are meant to rank.
 *  4. The English set is the Arabic one translated and mirrored, and nothing
 *     else (ticket 41): every word English, laid out left to right, and the
 *     same screen underneath — so the two languages cannot come to show two
 *     different products.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import { openReferencePage, startReferenceSite, type ReferenceSite } from './reference-site';
import { SCREEN_MOCKS, screenMockImagePath, studioPath } from '../../src/screen-mocks/registry';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

/**
 * Every language a set of mocks is exported in, and the pages of that language
 * that show them. Restated rather than read from `src/lib/locales.ts`, for the
 * reason `routes.ts` gives. The English addresses are notices until ticket 42
 * writes those pages, and show no mock; the moment they do, they are checked.
 */
const MOCK_LOCALES = ['ar', 'en'] as const;
type MockLocale = (typeof MOCK_LOCALES)[number];
const PAGES_SHOWING_MOCKS: Record<MockLocale, readonly string[]> = {
  ar: ['/product', '/'],
  en: ['/en/product', '/en'],
};

/** A letter of the Arabic script, in any of its blocks. */
const ARABIC_LETTER = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Whether an Editor has replaced this mock in the admin (ticket 57), for the
 * pages of one language — each has a replacement of its own (ticket 41): a
 * page shows it, and shows a picture other than its export. A mock no page shows
 * just now — its section hidden — is not replaced, and is still checked.
 *
 * Read from the pages, as a visitor with no session receives them, rather than
 * from the CMS: these checks run side by side, and side by side sign-ins to one
 * account erase each other's sessions (`cms.ts`). Every mock's picture names
 * its mock (`src/components/screen-mock-picture.tsx`).
 */
async function replacedInTheAdmin(request: APIRequestContext, locale: MockLocale, mockId: string): Promise<boolean> {
  const exported = screenMockImagePath(locale, mockId);
  for (const page of PAGES_SHOWING_MOCKS[locale]) {
    const response = await request.get(page);
    expect(response.ok(), page).toBe(true);
    const pictures = (await response.text()).match(new RegExp(`<img[^>]*data-screen-mock="${mockId}"[^>]*>`, 'g')) ?? [];
    // `next/image` names the file inside its own address, encoded.
    if (pictures.some((tag) => !tag.includes(exported) && !tag.includes(encodeURIComponent(exported)))) return true;
  }
  return false;
}

/** One line of `src/screen-mocks/exported.json`, written by the export script. */
type ExportRecord = {
  locale: string;
  id: string;
  width: number;
  height: number;
  /** SHA-256 of the markup this image was rendered from. */
  source: string;
};

/**
 * Lays an image on an opaque backdrop before it is compared, and returns its
 * pixels.
 *
 * Every comparison here is held to zero differing pixels, and this is what
 * makes that possible. A mock draws on transparency, and its card shadows are
 * enormous and very soft: at the outer edge they trail off into alpha 1 out of
 * 255, and whether a given pixel lands on 0 or 1 depends on where the mock
 * sits — centred in a column on a Reference page, hard left in the studio.
 * Composited, that difference becomes one step of colour out of 255, which is
 * far below what pixelmatch counts, while anything a person could see stays
 * exactly as visible as before.
 *
 * The backdrop is magenta rather than white because white is a colour the
 * mocks are full of: on white, "drew a white card here" and "drew nothing
 * here" would compare equal.
 */
const BACKDROP = [255, 0, 255] as const;

function onBackdrop(image: PNG): Buffer {
  const flat = Buffer.from(image.data);
  for (let i = 0; i < flat.length; i += 4) {
    const alpha = flat[i + 3] / 255;
    for (let channel = 0; channel < 3; channel++) {
      flat[i + channel] = Math.round(flat[i + channel] * alpha + BACKDROP[channel] * (1 - alpha));
    }
    flat[i + 3] = 255;
  }
  return flat;
}

/**
 * Big enough to hold a mock at its full 1440×900 with room around it, so that
 * nothing is clipped by the viewport in either document.
 */
const VIEWPORT = { width: 1600, height: 1000 };

/**
 * Lifts one mock out of whatever document it is in and photographs it alone.
 *
 * Four things have to be true before two screenshots of a mock can be
 * compared, and each was found the hard way:
 *
 *  - **Nothing behind it.** A mock draws on a transparent background, so on a
 *    Reference page the header, the hero and the section colour show straight
 *    through it. The mock is moved to be the only thing in the document.
 *  - **Nothing beside it.** A Reference page carries five mocks, and a
 *    screenshot of one region catches whichever of them paints there.
 *  - **Unscaled.** On a Reference page `--vs-s` shrinks the stage to fit its
 *    column; the studio renders it at 1:1 and so must the thing it is compared
 *    against.
 *  - **On whole pixels.** Left where it sits on a page, the stage starts at a
 *    fractional offset and the screenshot rounds out to 1441×901 against the
 *    studio's 1440×900. As the document's only child it lands on whole
 *    coordinates in both.
 *
 * What it deliberately does *not* do is override the mock's own size, position
 * or overflow. Doing so moved two pixels, which was enough to put the exported
 * image and a fresh render of it permanently at odds.
 *
 * Both documents get the same treatment, so neither is measured on terms the
 * other did not get.
 */
const STAGE_ALONE = `
  html, body { margin: 0 !important; padding: 0 !important; background: transparent !important }
  /* Not centred. The mock centres itself with margin-inline:auto, and half of
     the space left over lands on a half-pixel whenever a scrollbar makes the
     viewport an odd width — which shifts a gradient by one pixel against the
     studio, where the mock starts at the left edge. */
  [data-vs-shot] { margin-inline: 0 !important }
  .vs-shot__stage { --vs-s: 1 !important; transform: none !important }
  *, *::before, *::after { transition: none !important; animation: none !important }
`;

async function stageOf(page: import('@playwright/test').Page, mockId: string) {
  await page.evaluate((id) => {
    const mock = document.querySelector(`[data-vs-shot="${id}"]`);
    if (!mock) throw new Error(`no mock "${id}" in this document`);
    document.body.replaceChildren(mock);
  }, mockId);
  await page.addStyleTag({ content: STAGE_ALONE });

  const stage = page.locator(`[data-vs-shot="${mockId}"] .vs-shot__stage`);
  return PNG.sync.read(await stage.screenshot({ omitBackground: true, animations: 'disabled' }));
}

/**
 * What of a mock's layout two languages must share: its elements in document
 * order, by tag, and where each card laid directly on its stage sits.
 *
 * A card is held by the edges it is anchored by, not by its size, because its
 * words size it: a card's height grows with them, so one anchored by its
 * bottom is held by its bottom edge; and a card with no width of its own —
 * the dark badges — is as wide as its words, so only its anchored side is held.
 */
async function layoutOf(page: import('@playwright/test').Page, mockId: string) {
  return page.evaluate((id) => {
    const mock = document.querySelector(`[data-vs-shot="${id}"]`);
    if (!mock) throw new Error(`no mock "${id}" in this document`);
    const screen = mock.querySelector('.vs-shot__stage > [dir]');
    if (!screen) throw new Error(`mock "${id}" declares no direction`);
    const origin = screen.getBoundingClientRect();
    const cards = [...screen.children]
      .filter((child) => getComputedStyle(child).position === 'absolute')
      .map((child) => {
        const box = child.getBoundingClientRect();
        return {
          left: Math.round(box.left - origin.left),
          right: Math.round(origin.right - box.right),
          top: Math.round(box.top - origin.top),
          bottom: Math.round(origin.bottom - box.bottom),
          width: Math.round(box.width),
          // Anchored by the side its style names, and sized by its words
          // unless its style names a width.
          anchoredLeft: (child as HTMLElement).style.left !== '',
          anchoredBottom: (child as HTMLElement).style.bottom !== '',
          fixedWidth: (child as HTMLElement).style.width !== '',
        };
      });
    return { tags: [...mock.querySelectorAll('*')].map((element) => element.tagName), cards };
  }, mockId);
}

test.describe('screen mocks', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const mock of SCREEN_MOCKS) {
    test(`${mock.id} renders in the studio exactly as it does on the Reference site`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({ viewport: VIEWPORT });
      try {
        const reference = await context.newPage();
        await openReferencePage(reference, site, mock.referencePage);
        const expected = await stageOf(reference, mock.id);

        const studio = await context.newPage();
        await studio.goto(`${baseURL}${studioPath('ar', mock.id)}`);
        await studio.evaluate(() => document.fonts.ready);
        const actual = await stageOf(studio, mock.id);

        expect({ width: actual.width, height: actual.height }).toEqual({
          width: expected.width,
          height: expected.height,
        });

        const differing = pixelmatch(
          onBackdrop(expected),
          onBackdrop(actual),
          undefined,
          expected.width,
          expected.height,
          { threshold: 0.1 },
        );
        expect(differing, `${mock.id} differs from the Reference site`).toBe(0);
      } finally {
        await context.close();
      }
    });

    for (const locale of MOCK_LOCALES) {
      test(`${locale}/${mock.id}'s exported image was made from the markup as it stands`, async ({ request }) => {
        test.skip(await replacedInTheAdmin(request, locale, mock.id), 'replaced in the admin: the site shows the replacement');
        const manifest = JSON.parse(
          await readFile(path.join(repoRoot, 'src', 'screen-mocks', 'exported.json'), 'utf8'),
        ) as { images: ExportRecord[] };

        const record = manifest.images.find((image) => image.locale === locale && image.id === mock.id);
        expect(record, `${locale}/${mock.id} has no export on record`).toBeDefined();

        const markup = await readFile(
          path.join(repoRoot, 'src', 'screen-mocks', locale, `${mock.id}.html`),
        );
        expect(
          createHash('sha256').update(markup).digest('hex'),
          `${locale}/${mock.id}.html has changed since its image was exported — run "npm run mocks:export"`,
        ).toBe(record!.source);

        expect({ width: record!.width, height: record!.height }).toEqual({
          width: mock.width * mock.scale,
          height: mock.height * mock.scale,
        });
      });

      test(`@pixel ${locale}/${mock.id}'s exported image is what the studio renders today`, async ({
        browser,
        baseURL,
        request,
      }) => {
        test.skip(await replacedInTheAdmin(request, locale, mock.id), 'replaced in the admin: the site shows the replacement');
        const file = path.join(repoRoot, 'public', screenMockImagePath(locale, mock.id));
        const exported = await sharp(await readFile(file))
          .flatten({ background: { r: BACKDROP[0], g: BACKDROP[1], b: BACKDROP[2] } })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        expect(
          { width: exported.info.width, height: exported.info.height },
          'exported at the recorded size',
        ).toEqual({ width: mock.width * mock.scale, height: mock.height * mock.scale });

        const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: mock.scale });
        try {
          const studio = await context.newPage();
          await studio.goto(`${baseURL}${studioPath(locale, mock.id)}`);
          await studio.evaluate(() => document.fonts.ready);
          const fresh = await stageOf(studio, mock.id);

          const differing = pixelmatch(
            exported.data,
            onBackdrop(fresh),
            undefined,
            exported.info.width,
            exported.info.height,
            { threshold: 0.1 },
          );
          expect(
            differing,
            `${locale}/${mock.id}.webp is out of date — run \`npm run mocks:export\``,
          ).toBe(0);
        } finally {
          await context.close();
        }
      });
    }

    test(`${mock.id} in English is in English, left to right`, async ({ page }) => {
      await page.goto(studioPath('en', mock.id));

      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      // The mock declares its own direction, as the Arabic one does.
      await expect(page.locator(`[data-vs-shot="${mock.id}"] .vs-shot__stage > [dir]`)).toHaveAttribute('dir', 'ltr');

      // Every word translated in the markup, not painted over afterwards: an
      // Arabic letter anywhere in it would be in the picture.
      const words = await page.locator(`[data-vs-shot="${mock.id}"]`).evaluate((mockElement) => mockElement.textContent ?? '');
      const arabic = [...new Set(words.match(new RegExp(ARABIC_LETTER.source + '[^<>]{0,30}', 'g')) ?? [])];
      expect(arabic, 'Arabic left in the English mock').toEqual([]);
    });

    test(`${mock.id} in English is the Arabic one, translated and mirrored`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ viewport: VIEWPORT });
      try {
        const [arabic, english] = await Promise.all(
          (['ar', 'en'] as const).map(async (locale) => {
            const studio = await context.newPage();
            await studio.goto(`${baseURL}${studioPath(locale, mock.id)}`);
            await studio.evaluate(() => document.fonts.ready);
            return layoutOf(studio, mock.id);
          }),
        );

        // The same screen underneath: element for element, the English is the
        // Arabic with other words in it — not a second design to keep in step.
        expect(english.tags, 'the same elements, in the same order').toEqual(arabic.tags);

        // And turned around: each card laid on the stage sits where the
        // Arabic one does, reflected across the stage's middle — its left
        // edge where the Arabic one's right edge was, or the other way round.
        expect(english.cards.length).toBe(arabic.cards.length);
        english.cards.forEach((card, index) => {
          const original = arabic.cards[index]!;
          const where = `card ${index + 1} on the stage`;
          expect(card.anchoredLeft, `${where} is anchored by the other side`).toBe(!original.anchoredLeft);
          if (card.anchoredBottom) expect(card.bottom, where).toBe(original.bottom);
          else expect(card.top, where).toBe(original.top);
          if (card.anchoredLeft) expect(card.left, where).toBe(original.right);
          else expect(card.right, where).toBe(original.left);
          if (card.fixedWidth) expect(card.width, where).toBe(original.width);
        });
      } finally {
        await context.close();
      }
    });
  }

  test("every picture of a Screen mock on a page is its own language's", async ({ request }) => {
    // English pages show the English export and Arabic pages the Arabic one.
    // A replacement an Editor chose is not an export, and not checked here.
    for (const locale of MOCK_LOCALES) {
      for (const page of PAGES_SHOWING_MOCKS[locale]) {
        const response = await request.get(page);
        expect(response.ok(), page).toBe(true);
        const html = await response.text();
        for (const [tag] of html.matchAll(/<img[^>]*data-screen-mock="[^"]*"[^>]*>/g)) {
          const exported = decodeURIComponent(tag).match(/\/screen-mocks\/(\w+)\//);
          if (exported) expect(exported[1], `${page}: ${tag}`).toBe(locale);
        }
      }
    }
  });

  test('the studio is blocked from indexing, and not only before launch', async ({ page }) => {
    const response = await page.goto(studioPath('ar', SCREEN_MOCKS[0].id));

    // Both of these are written unconditionally — the layout's metadata and a
    // header rule that sits outside the environment check — so unlike the rest
    // of the site the studio stays blocked after launch. The test environment
    // cannot tell the two apart on its own, which is why the rules that
    // produce them are the thing to read: `next.config.ts` and the studio
    // layout.
    expect(response?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('every mock on disk is in the registry, and every mock in it is on disk', async () => {
    // The comparisons above all iterate the registry, so a mock quietly
    // dropped from it would take its own coverage with it — and a set of
    // markup added without an export would go unnoticed until a page came
    // looking for the picture.
    // Every language has the whole set: a language with half of one would
    // show some of its screens and not others.
    const registered = SCREEN_MOCKS.map((mock) => mock.id).sort();
    const locales = (await readdir(path.join(repoRoot, 'src', 'screen-mocks'), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(locales, 'a set of markup for each language').toEqual([...MOCK_LOCALES].sort());

    for (const locale of MOCK_LOCALES) {
      const onDisk = (await readdir(path.join(repoRoot, 'src', 'screen-mocks', locale)))
        .filter((file) => file.endsWith('.html'))
        .map((file) => file.replace(/.html$/, ''))
        .sort();
      const exportedImages = (await readdir(path.join(repoRoot, 'public', 'screen-mocks', locale)))
        .filter((file) => file.endsWith('.webp'))
        .map((file) => file.replace(/.webp$/, ''))
        .sort();

      expect(onDisk, `${locale} markup on disk against the registry`).toEqual(registered);
      expect(exportedImages, `${locale} exported images against the registry`).toEqual(registered);
    }
  });

  test('every mock is one the Home or Product page actually uses', async () => {
    // The ticket asks for the set used on those two pages — no more, and no
    // less. Read from the Reference site rather than restated here.
    const used = new Set<string>();
    for (const file of ['index.html', 'product.html']) {
      const html = await readFile(path.join(repoRoot, 'reference', 'site', file), 'utf8');
      for (const match of html.matchAll(/data-vs-shot="([^"]+)"/g)) used.add(match[1]);
    }

    expect([...used].sort()).toEqual(SCREEN_MOCKS.map((mock) => mock.id).sort());
  });
});
