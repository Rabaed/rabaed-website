/**
 * Ahmed publishes a Pour Tracker **Release** (CONTEXT.md) from the CMS
 * (ticket 100, ADR-0024): its HTML file and its checksum file, refused unless
 * the two match, kept waiting until Publish, and then the very file visitors
 * download — byte for byte, at the same address, under the same name. And
 * safely over time (ticket 101): a release number names one file for good,
 * the screen says what visitors get, and he can go back without a developer.
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
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
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

/** A file one byte away from `html`, with a checksum file of its own that names `releaseNumber`. */
function anotherFileCalled(html: Buffer, releaseNumber: string) {
  const other = Buffer.from(html);
  // Not the byte the mismatch test changes, so the two files never meet in the store.
  other[other.length - 5] ^= 1;
  return { html: other, checksum: Buffer.from(`${checksumOf(other)}  index.html\nbuild ${releaseNumber}\n`) };
}

test('a checksum file that names no release number is refused, saying so (ticket 101)', async ({ request }) => {
  const { html } = await testRelease();

  const response = await upload(signedIn(request), html, Buffer.from(`${checksumOf(html)}  index.html\n`));

  expect(response.status()).toBe(400);
  const { problem } = await response.json();
  expect(problem.en).toMatch(/names no release number/);
  expect(problem.ar).toMatch(/رقم الإصدار/);
});

test('a release number already used for a different file is refused; the same file again is not a clash (ticket 101)', async ({
  request,
}) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  expect((await upload(editor, html, checksum)).status()).toBe(200);

  // The same file under the same number, uploaded again, is the same release.
  expect((await upload(editor, html, checksum)).status()).toBe(200);

  const impostor = anotherFileCalled(html, '2099-01-01.1');
  const response = await upload(editor, impostor.html, impostor.checksum);
  expect(response.status()).toBe(409);
  const { problem } = await response.json();
  expect(problem.en).toMatch(/2099-01-01\.1 already names a different file/);
  expect(problem.ar).toMatch(/2099-01-01\.1/);
});

test('the code copy’s release number is taken too: another file under it is refused (ticket 101)', async ({ request }) => {
  const editor = signedIn(request);
  const codeCopy = await release(CODE_COPY);
  // Its own pair is the same release, and is accepted.
  expect((await upload(editor, codeCopy.html, codeCopy.checksum)).status()).toBe(200);

  const impostor = anotherFileCalled(codeCopy.html, POUR_TRACKER.build);
  expect((await upload(editor, impostor.html, impostor.checksum)).status()).toBe(409);
});

test('a release older than the live one is accepted, and said to be older (ticket 101)', async ({ request }) => {
  const editor = signedIn(request);
  const newer = await testRelease(); // 2099-01-01.1
  const older = await release(CODE_COPY); // 2026-09-23.3
  await save(editor, await (await upload(editor, newer.html, newer.checksum)).json(), 'published');

  const olderAnswer = await (await upload(editor, older.html, older.checksum)).json();
  expect(olderAnswer).toMatchObject({ releaseNumber: POUR_TRACKER.build, olderThanLive: true });

  await save(editor, olderAnswer, 'published');
  expect(await (await upload(editor, newer.html, newer.checksum)).json()).toMatchObject({ olderThanLive: false });
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

/** The Pour Tracker screen's account of its releases, as an Editor sees it on opening the entry. */
async function releasesShown(page: Page) {
  await page.goto(`${ADMIN_PATH}/globals/pour-tracker`);
  const panel = page.getByRole('region', { name: 'Releases' });
  await expect(panel).toBeVisible();
  return panel;
}

test('the screen shows the live release and when it went out, the one waiting, and the code copy (ticket 101)', async ({
  page,
  request,
}) => {
  const editor = signedIn(request);
  const live = await testRelease(); // 2099-01-01.1
  const waiting = await release(CODE_COPY); // 2026-09-23.3, older
  await save(editor, await (await upload(editor, live.html, live.checksum)).json(), 'published');
  await save(editor, await (await upload(editor, waiting.html, waiting.checksum)).json(), 'draft');

  await logIn(page);
  const panel = await releasesShown(page);

  await expect(panel).toContainText(/Visitors download release 2099-01-01\.1, published \d/);
  await expect(panel).toContainText(`Waiting for Publish: release ${POUR_TRACKER.build}`);
  await expect(panel).toContainText('older than the release visitors download now');
  await expect(panel).toContainText(`Kept with the site’s code: release ${POUR_TRACKER.build}`);
});

test('removing the published release in the admin sends visitors the code copy again, and the screen says so (ticket 101)', async ({
  page,
  request,
}) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  await save(editor, await (await upload(editor, html, checksum)).json(), 'published');

  await logIn(page);
  await releasesShown(page);
  await page.getByRole('button', { name: 'Remove release' }).click();
  await page.getByRole('button', { name: 'Publish changes' }).click();
  await expect(page.getByText(/updated successfully|published successfully/i).first()).toBeVisible();

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
  await expect(await releasesShown(page)).toContainText(
    `No release is published: visitors download the copy kept with the code, release ${POUR_TRACKER.build}`,
  );
});

test('an earlier release restored from the history is live at once, and the screen says so (ticket 101)', async ({
  page,
  request,
}) => {
  const editor = signedIn(request);
  const earlier = await testRelease();
  const later = await release(CODE_COPY);
  await save(editor, await (await upload(editor, earlier.html, earlier.checksum)).json(), 'published');
  await save(editor, await (await upload(editor, later.html, later.checksum)).json(), 'published');

  // What the admin's Versions → Restore sends for a global: `?draft=false`
  // (`@payloadcms/next`'s Restore view offers restoring as a draft to
  // collections only). The version is live as soon as it is restored.
  const versions = await editor.get(`${ENTRY}/versions?where[version.releaseNumber][equals]=2099-01-01.1&sort=-updatedAt&limit=1&depth=0`);
  const [kept] = ((await versions.json()) as { docs: { id: string }[] }).docs;
  const restored = await editor.post(`${ENTRY}/versions/${kept!.id}?draft=false`);
  expect(restored.ok(), await restored.text()).toBe(true);

  expect((await download(request)).bytes.equals(earlier.html)).toBe(true);
  await logIn(page);
  await expect(await releasesShown(page)).toContainText('Visitors download release 2099-01-01.1');
});

test('no save names a release under another release’s number, or a checksum nobody uploaded — drafts included (ticket 101)', async ({
  request,
}) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease();
  const kept: Named = await (await upload(editor, html, checksum)).json();

  // The API skips the admin's read-only fields: the check is the server's.
  const misnumbered = await editor.post(ENTRY, { data: { ...kept, releaseNumber: '2099-12-31.9', _status: 'published' } });
  expect(misnumbered.status()).toBe(400);
  // Every draft is checked too: Restore would put it back live unchecked.
  const unknown = await editor.post(`${ENTRY}?draft=true`, {
    data: { ...kept, sha256: '0'.repeat(64), _status: 'draft' },
  });
  expect(unknown.status()).toBe(400);
});

test('two uploads claiming one new release number at once: one is kept, the other told it clashes (ticket 101)', async ({
  request,
}) => {
  const editor = signedIn(request);
  const { html } = await testRelease();
  const number = `2099-02-${String(Date.now() % 28 + 1).padStart(2, '0')}.${Date.now() % 1000}`;
  const one = anotherFileCalled(html, number);
  const other = { html: Buffer.concat([one.html, Buffer.from(' ')]), checksum: Buffer.alloc(0) };
  other.checksum = Buffer.from(`${checksumOf(other.html)}  index.html\nbuild ${number}\n`);

  const statuses = (await Promise.all([upload(editor, one.html, one.checksum), upload(editor, other.html, other.checksum)])).map(
    (response) => response.status(),
  );

  expect(statuses.sort()).toEqual([200, 409]);
});

test('uploading an older release in the admin says so before it is published (ticket 101)', async ({ page, request }) => {
  const editor = signedIn(request);
  const { html, checksum } = await testRelease(); // 2099-01-01.1, live
  await save(editor, await (await upload(editor, html, checksum)).json(), 'published');

  await logIn(page);
  await page.goto(`${ADMIN_PATH}/globals/pour-tracker`);
  await page.getByLabel('Release HTML file').setInputFiles(path.join(CODE_COPY, 'index.html'));
  await page.getByLabel('Checksum file (.sha256)').setInputFiles(path.join(CODE_COPY, 'index.html.sha256'));
  await page.getByRole('button', { name: 'Check and upload' }).click();

  // Payload keeps a status region of its own on the page; the upload's is the one that names the release.
  await expect(page.getByRole('status').filter({ hasText: `Release ${POUR_TRACKER.build} checked and kept` })).toBeVisible();
  // Said apart from the rest, as a warning, before it is published.
  await expect(page.getByRole('note')).toHaveText(`⚠ Release ${POUR_TRACKER.build} is older than the release visitors download now.`);
});

test('with no release published, the download is the copy kept with the code', async ({ request }) => {
  await save(signedIn(request), NOTHING, 'published');

  expect(checksumOf((await download(request)).bytes)).toBe(POUR_TRACKER.sha256);
});
