/**
 * Ahmed publishes a Pour Tracker **Release** (CONTEXT.md) from the CMS
 * (ticket 100, ADR-0024): its HTML file and its checksum file, refused unless
 * the two match, kept waiting until Publish, and then the very file visitors
 * download — byte for byte, at the same address, under the same name.
 *
 * Runs on the publishing server (`playwright.config.ts`), and holds it from
 * its first test to its last (`one-suite-at-a-time.ts`): a release published
 * here is what every suite downloads until it is taken down again, so it is
 * kept away from `tests/e2e/pour-tracker-download.spec.ts`, which holds the
 * download to the copy in the code. Each test sets the entry up as it needs
 * it, and the suite leaves it with nothing published.
 *
 * The release used is the test release (`tests/pour-tracker-test-release/`),
 * never a real one, so these tests outlive any release Ahmed ships.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test, expect, type APIRequestContext } from '@playwright/test';
import { ADMIN_PATH, logIn } from './cms';
import { signedIn, type SignedIn } from './editors';
import { oneSuiteAtATime } from './one-suite-at-a-time';
import { POUR_TRACKER, checksumOf } from './pour-tracker';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const TEST_RELEASE = path.join(repoRoot, 'tests', 'pour-tracker-test-release');

const CODE_COPY = path.join(repoRoot, 'src', 'pour-tracker', 'fallback');

/** A release as delivered: its file, and its checksum file. The test release by default, 2099-01-01.1. */
async function release(directory = TEST_RELEASE) {
  return {
    html: await readFile(path.join(directory, 'index.html')),
    checksum: await readFile(path.join(directory, 'index.html.sha256')),
  };
}
const testRelease = () => release();

/** The SHA-256 a checksum file names, read off its first line as its builder wrote it. */
const namedIn = (checksum: Buffer) => /^[0-9a-f]{64}/m.exec(checksum.toString('utf8'))![0];

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

  await save(editor, NOTHING, 'published');

  const response = await upload(editor, changed, checksum);

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
  await save(editor, NOTHING, 'published');

  await save(editor, named, 'draft');

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});

test('a release waiting as a draft leaves the published one where it is', async ({ request }) => {
  // The test release published, then the code copy's own release uploaded and
  // saved as a draft over it: visitors keep the test release.
  const editor = signedIn(request);
  const published = await testRelease();
  const waiting = await release(CODE_COPY);
  await save(editor, await (await upload(editor, published.html, published.checksum)).json(), 'published');

  await save(editor, await (await upload(editor, waiting.html, waiting.checksum)).json(), 'draft');

  expect((await download(request)).bytes.equals(published.html)).toBe(true);
});

test('after Publish, the very next download is the release, byte for byte, and otherwise unchanged', async ({ request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  const named: Named = await (await upload(editor, html, checksum)).json();

  await save(editor, named, 'published');
  const { bytes, headers } = await download(request);

  // Byte for byte: the file uploaded, and the checksum its checksum file names.
  expect(bytes.equals(html)).toBe(true);
  expect(checksumOf(bytes)).toBe(namedIn(checksum));
  expect(headers['content-type']).toContain('text/html');
  expect(headers['content-disposition']).toBe(`attachment; filename="${POUR_TRACKER.name}"`);
  expect(headers['x-robots-tag']).toContain('noindex');
  expect(headers['cache-control']).toContain('no-store');
});

test('Ahmed’s way: in the admin, both files picked, checked, and published reach the download', async ({ page, request }) => {
  await save(signedIn(request), NOTHING, 'published');
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

test('in the admin in Arabic, a pair that does not match is refused in Arabic', async ({ page, baseURL }, testInfo) => {
  const { html } = await testRelease();
  const changed = Buffer.from(html);
  changed[changed.length - 3] ^= 1;
  const changedFile = testInfo.outputPath('index.html');
  await writeFile(changedFile, changed);

  await logIn(page);
  // The admin's language, as the language switch in an Editor's account sets it.
  await page.context().addCookies([{ name: 'payload-lng', value: 'ar', url: baseURL! }]);
  await page.goto(`${ADMIN_PATH}/globals/pour-tracker`);

  await page.getByLabel(/ملف الإصدار/).setInputFiles(changedFile);
  await page.getByLabel(/ملف التحقق/).setInputFiles(path.join(TEST_RELEASE, 'index.html.sha256'));
  await page.getByRole('button', { name: 'تحقّق وارفع' }).click();

  // Payload keeps an alert region of its own on the page; the refusal is the one that says it.
  await expect(page.getByRole('alert').filter({ hasText: 'لا يطابق ملف التحقق' })).toBeVisible();
});

test('with no release published, the download is the copy kept with the code', async ({ request }) => {
  await save(signedIn(request), NOTHING, 'published');

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});
