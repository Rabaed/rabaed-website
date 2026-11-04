import { open } from 'node:fs/promises';

/**
 * An uploaded file's first `length` bytes and its size, wherever Payload
 * holds it: in memory when it came up through the site, or in a temporary
 * file Payload fetched back from the bucket when the Editor's browser sent it
 * there directly (`clientUploads`), which leaves the bytes in memory empty.
 */
export async function uploadedFile(
  file: { data: Buffer; tempFilePath?: string },
  length: number,
): Promise<{ start: Buffer; size: number }> {
  if (file.data.length > 0 || !file.tempFilePath) {
    return { start: file.data.subarray(0, length), size: file.data.length };
  }
  const handle = await open(file.tempFilePath, 'r');
  try {
    const start = Buffer.alloc(length);
    const { bytesRead } = await handle.read(start, 0, length, 0);
    return { start: start.subarray(0, bytesRead), size: (await handle.stat()).size };
  } finally {
    await handle.close();
  }
}
