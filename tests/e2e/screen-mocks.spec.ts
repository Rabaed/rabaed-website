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
 *  2. The committed image is what the studio currently renders. Otherwise a
 *     label gets edited, nobody re-runs the export, and the site keeps serving
 *     last month's picture with this month's markup in the repo to prove it
 *     was fixed.
 *  3. The studio is not indexable. It is a private route that exists to be
 *     photographed, and its contents duplicate pages that are meant to rank.
 */
import { test, expect } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import { openReferencePage, startReferenceSite, type ReferenceSite } from './reference-site';
import { SCREEN_MOCKS, screenMockImagePath, studioPath } from '../../src/screen-mocks/registry';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

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

    test(`${mock.id}'s exported image is what the studio renders today`, async ({
      browser,
      baseURL,
    }) => {
      const file = path.join(repoRoot, 'public', screenMockImagePath('ar', mock.id));
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
        await studio.goto(`${baseURL}${studioPath('ar', mock.id)}`);
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
          `${mock.id}.webp is out of date — run \`npm run mocks:export\``,
        ).toBe(0);
      } finally {
        await context.close();
      }
    });
  }

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
    const onDisk = (await readdir(path.join(repoRoot, 'src', 'screen-mocks', 'ar')))
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace(/.html$/, ''))
      .sort();
    const exportedImages = (await readdir(path.join(repoRoot, 'public', 'screen-mocks', 'ar')))
      .filter((file) => file.endsWith('.webp'))
      .map((file) => file.replace(/.webp$/, ''))
      .sort();
    const registered = SCREEN_MOCKS.map((mock) => mock.id).sort();

    expect(onDisk, 'markup on disk against the registry').toEqual(registered);
    expect(exportedImages, 'exported images against the registry').toEqual(registered);
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
