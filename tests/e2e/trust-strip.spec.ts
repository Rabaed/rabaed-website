/**
 * The Trust strip in the CMS (ticket 20): Ahmed adds a client the day one
 * signs, points its mark at the company's site, reorders the bar, hides a
 * client whose contract has ended — and the bar still travels, still pauses
 * under the pointer, and still says the company's name where a mark will not
 * load.
 *
 * Three pages carry this one strip, and every other suite reads it, so nothing
 * here is published: each change is saved as a draft and checked in the
 * editor's preview, which visitors never see. What is published — an uploaded
 * file — is a mark nothing else points at, deleted at the end.
 *
 * The SVG cases are the other half of ADR-0010: `tests/unit/svg-sanitiser.spec.ts`
 * states what the sanitiser must strip, and these ask that an upload actually
 * reaches it.
 */
import type { Page } from '@playwright/test';
import { transparentMark, uploadFile } from './cms';
import { test, expect, type Entry } from './entries';

test.describe.configure({ mode: 'default' });

type TrustStrip = Entry<'trust-strip'>;
type Logo = TrustStrip['strip']['logos'][number];

const marks = (page: Page) => page.locator('.logos-row:not(.copy) .slot');

test('every page that carries the strip shows the marks the CMS has published', async ({ page, request, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();

  expect(entry.strip.logos.length).toBeGreaterThan(0);
  for (const path of ['/', '/product', '/start']) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain(entry.strip.caption.ar);
    for (const logo of entry.strip.logos) expect(html, `${path} ${logo.name.ar}`).toContain(logo.name.ar);
  }
});

test('a client signed today joins the bar, in the place Ahmed puts it, and the bar still travels', async ({ page, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();
  const mark = await uploadFile(
    page.request,
    { name: 'newest-client.png', mimeType: 'image/png', buffer: await transparentMark({ width: 200, height: 112 }) },
    'شركة العميل الجديد',
  );
  const joined = { shows: true, name: { ar: 'شركة العميل الجديد', en: null }, mark: mark.id, height: 30, link: null };

  try {
    await strip.draft({ ...entry, strip: { ...entry.strip, logos: [joined, ...entry.strip.logos] } });

    await page.setViewportSize({ width: 1280, height: 900 });
    await cms.preview('/');

    // First in the list is first in the bar.
    await expect(marks(page).first().locator('b')).toHaveText(joined.name.ar);
    await expect(marks(page)).toHaveCount(entry.strip.logos.length + 1);

    // And the bar carries the longer list without standing still.
    const offset = () =>
      page.locator('.logos-track').evaluate((track) => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
    const started = await offset();
    await expect.poll(offset, { message: 'the strip never moved' }).not.toBe(started);
  } finally {
    // The draft put back before the mark it points at goes.
    await strip.restore();
    await page.request.delete(`/api/media/${mark.id}`);
  }
});

test('a strip of two marks fills the bar, rather than dragging a band of empty bar behind it', async ({ page, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();

  await strip.draft({ ...entry, strip: { ...entry.strip, logos: entry.strip.logos.slice(0, 2) } });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');
  await expect(marks(page)).toHaveCount(2);

  // Two marks are a row far narrower than the rail, so the rail is covered
  // by copies of it — enough to reach across and one more to follow the
  // last off the end.
  const covered = await page.locator('.logos-rail').evaluate((rail) => {
    const track = rail.querySelector('.logos-track') as HTMLElement;
    const row = track.querySelector('.logos-row') as HTMLElement;
    return {
      rail: rail.getBoundingClientRect().width,
      row: row.getBoundingClientRect().width,
      rows: track.querySelectorAll('.logos-row').length,
    };
  });
  expect(covered.row).toBeLessThan(covered.rail);
  expect(covered.rows * covered.row, 'the copies do not reach across the bar').toBeGreaterThan(covered.rail + covered.row);

  // And it still travels.
  const offset = () =>
    page.locator('.logos-track').evaluate((track) => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
  const started = await offset();
  await expect.poll(offset, { message: 'a short strip never moved' }).not.toBe(started);
});

test('a mark whose file has gone leaves the company standing in the bar as text', async ({ page, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();
  const mark = await uploadFile(
    page.request,
    { name: 'about-to-go.png', mimeType: 'image/png', buffer: await transparentMark({ width: 200, height: 112 }) },
    'شركة يختفي شعارها',
  );
  const vanishing = { shows: true, name: { ar: 'شركة يختفي شعارها', en: null }, mark: mark.id, height: 30, link: null };

  await strip.draft({ ...entry, strip: { ...entry.strip, logos: [vanishing, ...entry.strip.logos] } });

  // The file goes from under the entry, as it does when an Editor deletes an
  // image the strip still points at.
  const deleted = await page.request.delete(`/api/media/${mark.id}`);
  expect(deleted.ok(), await deleted.text()).toBe(true);

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');

  const first = marks(page).first();
  await expect(first.locator('b')).toHaveText(vanishing.name.ar);
  await expect(first.locator('b')).toBeVisible();
  await expect(first.locator('img')).toHaveCount(0);
  // Every other mark still draws, and the company is still in the bar.
  await expect(marks(page)).toHaveCount(entry.strip.logos.length + 1);
});

test('a client whose contract has ended is hidden without losing its place in the list', async ({ page, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();
  const [first, ...rest] = entry.strip.logos;

  await strip.draft({ ...entry, strip: { ...entry.strip, logos: [{ ...first, shows: false }, ...rest] } });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');

  await expect(marks(page)).toHaveCount(entry.strip.logos.length - 1);
  await expect(page.locator('.logos').getByText(first.name.ar, { exact: true })).toHaveCount(0);

  // It is still in the CMS, in its own place, for the day the contract is renewed.
  const saved_ = await strip.published();
  expect(saved_.strip.logos[0].name.ar).toBe(first.name.ar);
});

test('a mark given an address leads there, and one without stays a picture', async ({ page, cms }) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();
  const [first, second, ...rest] = entry.strip.logos;

  await strip.draft({
    ...entry,
    strip: { ...entry.strip, logos: [{ ...first, link: 'https://example.test/client' }, { ...second, link: null }, ...rest] },
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');

  const linked = marks(page).first().locator('a');
  await expect(linked).toHaveAttribute('href', 'https://example.test/client');
  // A link off this site opens in its own tab and tells the other site nothing.
  await expect(linked).toHaveAttribute('rel', /noopener/);
  await expect(marks(page).nth(1).locator('a')).toHaveCount(0);
});

test('a vector logo is accepted, kept a vector, and stripped of what it may not carry', async ({ page, cms }) => {
  const carrying =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" onload="alert(1)">' +
    '<script>fetch("/maktab")</script>' +
    '<path d="M0 0h120v40H0z" fill="#FFFFFF"/></svg>';

  const mark = await uploadFile(
    page.request,
    { name: 'vector-client.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(carrying, 'utf8') },
    'شركة برسمة متجهة',
  );

  try {
    // Kept a vector: not re-encoded to WebP as a photograph would be.
    expect(mark.mimeType).toBe('image/svg+xml');

    const stored = await (await page.request.get(mark.url)).text();
    expect(stored).toContain('<path');
    expect(stored).toContain('viewBox="0 0 120 40"');
    expect(stored).not.toContain('<script');
    expect(stored.toLowerCase()).not.toContain('onload');
    expect(stored).not.toContain('alert(1)');
  } finally {
    await page.request.delete(`/api/media/${mark.id}`);
  }
});

test('a vector with nothing left after sanitising is refused, with the reason', async ({ page, cms }) => {
  const nothingButScript = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';

  const response = await page.request.post('/api/media', {
    multipart: {
      file: { name: `empty-${Date.now()}.svg`, mimeType: 'image/svg+xml', buffer: Buffer.from(nothingButScript, 'utf8') },
      _payload: JSON.stringify({ alt: 'رسمة فارغة' }),
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('رسمة');
});

test('a mark too short to stay sharp, a height outside the bar, and an address that is not one are refused', async ({
  page,
  cms,
}) => {
  const strip = cms.entry('trust-strip');
  const entry = await strip.published();
  const [first, ...rest] = entry.strip.logos;
  const short = await uploadFile(
    page.request,
    { name: 'too-short.png', mimeType: 'image/png', buffer: await transparentMark({ width: 120, height: 40 }) },
    'شعار قصير',
  );

  const withFirst = (changed: Partial<Logo>) => ({ ...entry, strip: { ...entry.strip, logos: [{ ...first, ...changed }, ...rest] } });
  const refused: Record<string, TrustStrip> = {
    'a mark 40 pixels tall': withFirst({ mark: short.id }),
    'a mark taller than the bar': withFirst({ height: 45 }),
    'a mark too small to see': withFirst({ height: 15 }),
    'an address that is not one': withFirst({ link: 'example.test' }),
    'an empty company name': withFirst({ name: { ar: '', en: null } }),
    'no marks at all': { ...entry, strip: { ...entry.strip, logos: [] } },
  };

  try {
    for (const [what, data] of Object.entries(refused)) {
      const response = await strip.attempt(data, 'published');
      expect(response.status(), what).toBe(400);
    }
    expect(await strip.published()).toEqual(entry);
  } finally {
    await page.request.delete(`/api/media/${short.id}`);
  }
});

test('a mark keeps its see-through background, so the bar draws it in white', async ({ page, cms }) => {
  const mark = await uploadFile(
    page.request,
    { name: 'see-through.png', mimeType: 'image/png', buffer: await transparentMark({ width: 200, height: 112 }) },
    'شعار بخلفية شفافة',
  );

  try {
    // The strip draws every mark white on a dark bar (`brightness(0) invert(1)`),
    // which turns a mark stored on a white background into a solid block.
    const stored = await (await page.request.get(mark.url)).body();
    const clear = await page.evaluate(async (bytes) => {
      const blob = new Blob([new Uint8Array(bytes)]);
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext('2d')!;
      context.drawImage(bitmap, 0, 0);
      // The bottom-right quarter is background in `transparentMark`.
      const pixel = context.getImageData(bitmap.width - 2, bitmap.height - 2, 1, 1).data;
      return pixel[3];
    }, Array.from(stored));

    expect(clear, 'the background arrived opaque').toBe(0);
  } finally {
    await page.request.delete(`/api/media/${mark.id}`);
  }
});
