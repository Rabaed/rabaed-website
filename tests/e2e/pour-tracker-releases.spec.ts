/**
 * Ahmed publishes a Pour Tracker **Release** (CONTEXT.md) from the CMS
 * (ticket 100, ADR-0024): its HTML file and its checksum file, refused unless
 * the two match, kept waiting until Publish, and then the very file visitors
 * download — byte for byte, at the same address, under the same name.
 *
 * Runs on the publishing server (`playwright.config.ts`): a release published
 * here is what every suite downloads until it is taken down again, so it is
 * kept away from `tests/e2e/pour-tracker-download.spec.ts`, which holds the
 * download to the copy in the code. The tests share one entry, so they run
 * one after another, and the entry is left as it was found.
 *
 * The release used is the test release (`tests/pour-tracker-test-release/`),
 * never a real one, so these tests outlive any release Ahmed ships.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN_PATH, logIn } from './cms';
import { signedIn, type SignedIn } from './editors';
import { POUR_TRACKER, checksumOf } from './pour-tracker';

test.describe.configure({ mode: 'serial' });

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const TEST_RELEASE = path.join(repoRoot, 'tests', 'pour-tracker-test-release');

/** The test release: 2099-01-01.1, its file and its checksum file as delivered. */
async function testRelease() {
  return {
    html: await readFile(path.join(TEST_RELEASE, 'index.html')),
    checksum: await readFile(path.join(TEST_RELEASE, 'index.html.sha256')),
  };
}

/** Where an Editor uploads a release: the Pour Tracker entry's own endpoint. */
const UPLOAD = '/api/globals/pour-tracker/release';
const ENTRY = '/api/globals/pour-tracker';

/** What the entry names once a release is uploaded: the upload's own answer. */
type Named = { sha256: string | null; releaseNumber: string | null; size: number | null; fileName: string | null };
const NOTHING: Named = { sha256: null, releaseNumber: null, size: null, fileName: null };

async function upload(editor: SignedIn, html: Buffer, checksum: Buffer) {
  return editor.post(UPLOAD, {
    multipart: {
      html: { name: 'index.html', mimeType: 'text/html', buffer: html },
      checksum: { name: 'index.html.sha256', mimeType: 'text/plain', buffer: checksum },
    },
  });
}

/** Saves the entry naming `named`, as a draft or published, as the admin's two buttons do. */
async function save(editor: SignedIn, named: Named, status: 'draft' | 'published') {
  const response = await editor.post(`${ENTRY}${status === 'draft' ? '?draft=true' : ''}`, {
    data: { ...named, _status: status },
  });
  expect(response.ok(), `saving the entry as ${status}: ${await response.text()}`).toBe(true);
}

/** What a visitor downloads now: its bytes and the headers they came with. */
async function download(request: APIRequestContext) {
  const response = await request.get(POUR_TRACKER.path);
  expect(response.status()).toBe(200);
  return { bytes: await response.body(), headers: response.headers() };
}

test.afterAll(async ({ request }) => {
  // Leave the entry as it was found: nothing published, the code copy served.
  await save(signedIn(request), NOTHING, 'published');
});

test('a release whose file matches its checksum file is kept, under its release number', async ({ request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();

  const response = await upload(editor, html, checksum);

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    sha256: checksumOf(html),
    releaseNumber: '2099-01-01.1',
    size: html.byteLength,
  });
});

test('a pair whose file does not match its checksum is refused, saying so, and nothing is kept', async ({ request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  const changed = Buffer.from(html);
  changed[changed.length - 3] ^= 1;

  const response = await editor.post(UPLOAD, {
    multipart: {
      html: { name: 'index.html', mimeType: 'text/html', buffer: changed },
      checksum: { name: 'index.html.sha256', mimeType: 'text/plain', buffer: checksum },
    },
  });

  expect(response.status()).toBe(400);
  const { problem } = await response.json();
  expect(problem.en).toMatch(/does not match its checksum/);
  expect(problem.ar).toMatch(/لا يطابق/);

  // Nothing kept: the entry cannot be published naming the refused file, since
  // there is no such file to send.
  const naming = await editor.post(ENTRY, {
    data: { sha256: checksumOf(changed), releaseNumber: '2099-01-01.1', size: changed.byteLength, fileName: 'index.html', _status: 'published' },
  });
  expect(naming.status()).toBe(400);
  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});

test('an uploaded release waits for Publish: a draft naming it changes nothing visitors download', async ({ request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  const named: Named = await (await upload(editor, html, checksum)).json();

  await save(editor, named, 'draft');

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});

test('after Publish, the very next download is the release, byte for byte, and otherwise unchanged', async ({ request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  const named: Named = await (await upload(editor, html, checksum)).json();

  await save(editor, named, 'published');
  const { bytes, headers } = await download(request);

  // Byte for byte: its checksum is the one its checksum file names.
  expect(checksumOf(bytes)).toBe(checksumOf(html));
  expect(bytes.equals(html)).toBe(true);
  expect(headers['content-type']).toContain('text/html');
  expect(headers['content-disposition']).toBe(`attachment; filename="${POUR_TRACKER.name}"`);
  expect(headers['x-robots-tag']).toContain('noindex');
  expect(headers['cache-control']).toContain('no-store');
});

test('Ahmed’s way: in the admin, both files picked, checked, and published reach the download', async ({ page, request }) => {
  await logIn(page);
  await page.goto(`${ADMIN_PATH}/globals/pour-tracker`);

  await page.getByLabel('Release HTML file').setInputFiles(path.join(TEST_RELEASE, 'index.html'));
  await page.getByLabel('Checksum file (.sha256)').setInputFiles(path.join(TEST_RELEASE, 'index.html.sha256'));
  await page.getByRole('button', { name: 'Check and upload' }).click();
  await expect(page.getByText('Release 2099-01-01.1 checked and kept')).toBeVisible();

  await page.getByRole('button', { name: 'Publish changes' }).click();
  await expect(page.getByText(/updated successfully|published successfully/i).first()).toBeVisible();

  const { html } = await testRelease();
  expect((await download(request)).bytes.equals(html)).toBe(true);
});

test('with no release published, the download is the copy kept with the code', async ({ request }) => {
  await save(signedIn(request), NOTHING, 'published');

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});
