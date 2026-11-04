/**
 * How the Company profile's files are read before they are kept
 * (`src/cms/uploaded-file.ts`). One the Editor's browser sent straight to the
 * bucket reaches the CMS as a temporary file Payload fetched back, with no
 * bytes in memory; no bucket runs in the tests, so that case is asked here.
 * One sent up through the site is held in `tests/e2e/profile-compare.spec.ts`.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { uploadedFile } from '../../src/cms/uploaded-file';

const PDF = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(3000, 0x20)]);

test('a file in memory is read from memory', async () => {
  const { start, size } = await uploadedFile({ data: PDF }, 12);
  expect(start.toString('latin1')).toBe('%PDF-1.7\n   ');
  expect(size).toBe(PDF.length);
});

test('a file the browser sent to the bucket is read from the copy Payload fetched back', async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'uploaded-file-'));
  try {
    const tempFilePath = path.join(folder, 'payload-client-upload');
    await writeFile(tempFilePath, PDF);
    const { start, size } = await uploadedFile({ data: Buffer.alloc(0), tempFilePath }, 12);
    expect(start.toString('latin1')).toBe('%PDF-1.7\n   ');
    expect(size).toBe(PDF.length);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('a file shorter than what is asked for gives what it has', async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'uploaded-file-'));
  try {
    const tempFilePath = path.join(folder, 'payload-client-upload');
    await writeFile(tempFilePath, '%PD');
    const { start, size } = await uploadedFile({ data: Buffer.alloc(0), tempFilePath }, 12);
    expect(start.toString('latin1')).toBe('%PD');
    expect(size).toBe(3);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
