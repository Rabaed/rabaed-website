/**
 * The check a Pour Tracker **Release** passes before the CMS keeps it
 * (ticket 100, ADR-0024): its HTML file against the checksum file its builder
 * delivers with it.
 *
 * Tested directly, as the SVG sanitiser is: it is a pure function of two
 * files' bytes. That an upload actually reaches it, and that a refused pair
 * leaves nothing behind, is asked of the running CMS in
 * `tests/e2e/pour-tracker-releases.spec.ts`.
 *
 * The test release is a small file of its own, with CRLF line endings and
 * Arabic in it, so that a check which read the file as text would be caught
 * changing it.
 */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { checkedRelease, isOlderRelease } from '../../src/pour-tracker/release';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const TEST_RELEASE = path.join(repoRoot, 'tests', 'pour-tracker-test-release');
const CODE_COPY = path.join(repoRoot, 'src', 'pour-tracker', 'fallback');

async function pair(directory: string) {
  return {
    html: new Uint8Array(await readFile(path.join(directory, 'index.html'))),
    checksum: new Uint8Array(await readFile(path.join(directory, 'index.html.sha256'))),
  };
}

test('a release whose file matches its checksum file is accepted, under its release number', async () => {
  const { html, checksum } = await pair(TEST_RELEASE);

  const result = checkedRelease(html, checksum);

  expect(result).toEqual({
    ok: true,
    sha256: '55236cb8e8f98d2ffe9946a9a4d4cfcdb9c5b5d99550ed3d7dd40f53d200caf8',
    releaseNumber: '2099-01-01.1',
  });
});

test('a file that differs from its checksum by one byte is refused, saying so in both languages', async () => {
  const { html, checksum } = await pair(TEST_RELEASE);
  const changed = Uint8Array.from(html);
  changed[changed.length - 1] ^= 1;

  const result = checkedRelease(changed, checksum);

  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.problem.en).toMatch(/does not match its checksum/);
  expect(result.problem.ar).toMatch(/لا يطابق/);
});

test('the same file with its line endings changed is refused: a release is never re-saved', async () => {
  const { html, checksum } = await pair(TEST_RELEASE);
  const unixEndings = new TextEncoder().encode(new TextDecoder().decode(html).replaceAll('\r\n', '\n'));

  expect(checkedRelease(unixEndings, checksum).ok).toBe(false);
});

test('a release delivered with another release’s checksum file is refused', async () => {
  const testRelease = await pair(TEST_RELEASE);
  const codeCopy = await pair(CODE_COPY);

  expect(checkedRelease(testRelease.html, codeCopy.checksum).ok).toBe(false);
  expect(checkedRelease(codeCopy.html, testRelease.checksum).ok).toBe(false);
});

test('a checksum file with no SHA-256 in it is refused, saying it is not a checksum file', () => {
  const html = new TextEncoder().encode('<!doctype html>');

  for (const checksum of ['', 'build 2099-01-01.1\n', 'not a checksum  index.html\n', `${'0'.repeat(63)}  index.html\n`]) {
    const result = checkedRelease(html, new TextEncoder().encode(checksum));
    expect(result.ok, JSON.stringify(checksum)).toBe(false);
    if (!result.ok) expect(result.problem.en, JSON.stringify(checksum)).toMatch(/no SHA-256/);
  }
});

test('the checksum is read however its tool wrote it: capitals, a binary marker, Windows line endings', async () => {
  const { html } = await pair(TEST_RELEASE);
  const sha256 = '55236cb8e8f98d2ffe9946a9a4d4cfcdb9c5b5d99550ed3d7dd40f53d200caf8';

  for (const checksum of [`${sha256.toUpperCase()}  index.html\nbuild 2099-01-01.1\n`, `${sha256} *index.html\r\nbuild 2099-01-01.1\r\n`]) {
    expect(checkedRelease(html, new TextEncoder().encode(checksum)), JSON.stringify(checksum)).toEqual({
      ok: true,
      sha256,
      releaseNumber: '2099-01-01.1',
    });
  }
});

test('the copy kept with the site’s code matches the checksum file it was delivered with: release 2026-09-23.3', async () => {
  const { html, checksum } = await pair(CODE_COPY);

  expect(checkedRelease(html, checksum)).toEqual({
    ok: true,
    sha256: '925a4ed9d38bc22f8f8c6fc44f606f3c8adbfb3f1011753c645bd4e9c4616eaf',
    releaseNumber: '2026-09-23.3',
  });
});

test('a checksum file that names no release number is refused, saying so in both languages (ticket 101)', async () => {
  const { html } = await pair(TEST_RELEASE);
  // The right checksum, and no `build` line to say which release it is.
  const unnamed = new TextEncoder().encode('55236cb8e8f98d2ffe9946a9a4d4cfcdb9c5b5d99550ed3d7dd40f53d200caf8  index.html\n');

  const result = checkedRelease(html, unnamed);

  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.problem.en).toMatch(/names no release number/);
  expect(result.problem.ar).toMatch(/رقم الإصدار/);
});

test('release numbers are ordered by their date, then by the build of that day, as numbers', () => {
  // Worked out by hand: a later date is newer whatever its build number, and
  // on one day build 10 follows build 3 — which comparing as text gets wrong.
  expect(isOlderRelease('2026-08-25.7', '2026-09-23.3')).toBe(true);
  expect(isOlderRelease('2026-09-23.3', '2099-01-01.1')).toBe(true);
  expect(isOlderRelease('2026-09-23.3', '2026-09-23.10')).toBe(true);
  expect(isOlderRelease('2026-09-23.10', '2026-09-23.3')).toBe(false);
  expect(isOlderRelease('2099-01-01.1', '2026-09-23.3')).toBe(false);
  expect(isOlderRelease('2026-09-23.3', '2026-09-23.3')).toBe(false);
});
