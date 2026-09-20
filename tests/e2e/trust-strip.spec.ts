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
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { TRUST_STRIP_EDITOR, logInByApi, transparentMark, uploadFile } from './cms';

test.describe.configure({ mode: 'default' });

const GLOBAL = '/api/globals/trust-strip';

type Words = { ar: string; en?: string | null };
type Logo = { shows: boolean; name: Words; mark: number; height: number; link?: string | null };
type TrustStrip = { languages: string[]; strip: { caption: Words; sectionName: Words; logos: Logo[] } };

async function published(editor: APIRequestContext): Promise<TrustStrip> {
  const response = await editor.get(`${GLOBAL}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

/** The entry's fields alone, ready to be sent back: no ids, no dates. */
function fields(entry: TrustStrip) {
  const logos = entry.strip.logos.map(({ shows, name, mark, height, link }) => ({ shows, name, mark, height, link }));
  return { languages: entry.languages, strip: { ...entry.strip, logos } };
}

function save(editor: APIRequestContext, data: object, status: 'draft' | 'published') {
  return editor.post(`${GLOBAL}${status === 'draft' ? '?draft=true' : ''}`, { data: { ...data, _status: status } });
}

async function discardDraft(editor: APIRequestContext): Promise<void> {
  const response = await editor.get(`${GLOBAL}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1&depth=0`);
  expect(response.ok()).toBe(true);
  const [latest] = (await response.json()).docs;
  const restored = await editor.post(`${GLOBAL}/versions/${latest.id}?draft=true`);
  expect(restored.ok(), await restored.text()).toBe(true);
}

/** Opens the site in preview at the home page, as the admin's Preview button does. */
async function preview(page: Page): Promise<void> {
  await page.goto(`/api/preview?path=${encodeURIComponent('/')}`);
  await expect(page.getByRole('status')).toContainText('معاينة');
}

const marks = (page: Page) => page.locator('.logos-row:not(.copy) .slot');

test.afterEach(async ({ page }) => {
  await page.request.get('/api/preview/exit');
});

test('every page that carries the strip shows the marks the CMS has published', async ({ page, request }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
  const entry = await published(page.request);

  expect(entry.strip.logos.length).toBeGreaterThan(0);
  for (const path of ['/', '/product', '/start']) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain(entry.strip.caption.ar);
    for (const logo of entry.strip.logos) expect(html, `${path} ${logo.name.ar}`).toContain(logo.name.ar);
  }
});

test('a client signed today joins the bar, in the place Ahmed puts it, and the bar still travels', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
  const entry = fields(await published(page.request));
  const mark = await uploadFile(
    page.request,
    { name: 'newest-client.png', mimeType: 'image/png', buffer: await transparentMark({ width: 200, height: 112 }) },
    'شركة العميل الجديد',
  );
  const joined = { shows: true, name: { ar: 'شركة العميل الجديد', en: null }, mark: mark.id, height: 30, link: null };

  try {
    const saved = await save(
      page.request,
      { ...entry, strip: { ...entry.strip, logos: [joined, ...entry.strip.logos] } },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);

    // First in the list is first in the bar.
    await expect(marks(page).first().locator('b')).toHaveText(joined.name.ar);
    await expect(marks(page)).toHaveCount(entry.strip.logos.length + 1);

    // And the bar carries the longer list without standing still.
    const offset = () =>
      page.locator('.logos-track').evaluate((track) => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
    const started = await offset();
    await expect.poll(offset, { message: 'the strip never moved' }).not.toBe(started);
  } finally {
    await discardDraft(page.request);
    await page.request.delete(`/api/media/${mark.id}`);
  }
});

test('a client whose contract has ended is hidden without losing its place in the list', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
  const entry = fields(await published(page.request));
  const [first, ...rest] = entry.strip.logos;

  try {
    const saved = await save(
      page.request,
      { ...entry, strip: { ...entry.strip, logos: [{ ...first, shows: false }, ...rest] } },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);

    await expect(marks(page)).toHaveCount(entry.strip.logos.length - 1);
    await expect(page.locator('.logos').getByText(first.name.ar, { exact: true })).toHaveCount(0);

    // It is still in the CMS, in its own place, for the day the contract is renewed.
    const saved_ = await published(page.request);
    expect(saved_.strip.logos[0].name.ar).toBe(first.name.ar);
  } finally {
    await discardDraft(page.request);
  }
});

test('a mark given an address leads there, and one without stays a picture', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
  const entry = fields(await published(page.request));
  const [first, second, ...rest] = entry.strip.logos;

  try {
    const saved = await save(
      page.request,
      {
        ...entry,
        strip: { ...entry.strip, logos: [{ ...first, link: 'https://example.test/client' }, { ...second, link: null }, ...rest] },
      },
      'draft',
    );
    expect(saved.ok(), await saved.text()).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await preview(page);

    const linked = marks(page).first().locator('a');
    await expect(linked).toHaveAttribute('href', 'https://example.test/client');
    // A link off this site opens in its own tab and tells the other site nothing.
    await expect(linked).toHaveAttribute('rel', /noopener/);
    await expect(marks(page).nth(1).locator('a')).toHaveCount(0);
  } finally {
    await discardDraft(page.request);
  }
});

test('a vector logo is accepted, kept a vector, and stripped of what it may not carry', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
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

test('a vector with nothing left after sanitising is refused, with the reason', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
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
}) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
  const entry = fields(await published(page.request));
  const [first, ...rest] = entry.strip.logos;
  const short = await uploadFile(
    page.request,
    { name: 'too-short.png', mimeType: 'image/png', buffer: await transparentMark({ width: 120, height: 40 }) },
    'شعار قصير',
  );

  const withFirst = (changed: Partial<Logo>) => ({ ...entry, strip: { ...entry.strip, logos: [{ ...first, ...changed }, ...rest] } });
  const refused = {
    'a mark 40 pixels tall': withFirst({ mark: short.id }),
    'a mark taller than the bar': withFirst({ height: 45 }),
    'a mark too small to see': withFirst({ height: 15 }),
    'an address that is not one': withFirst({ link: 'example.test' }),
    'an empty company name': withFirst({ name: { ar: '', en: null } }),
    'no marks at all': { ...entry, strip: { ...entry.strip, logos: [] } },
  };

  try {
    for (const [what, data] of Object.entries(refused)) {
      const response = await save(page.request, data, 'published');
      expect(response.status(), what).toBe(400);
    }
    expect(fields(await published(page.request))).toEqual(entry);
  } finally {
    await page.request.delete(`/api/media/${short.id}`);
  }
});

test('a mark keeps its see-through background, so the bar draws it in white', async ({ page }) => {
  await logInByApi(page.request, TRUST_STRIP_EDITOR);
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
