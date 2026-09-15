/**
 * Where applicant documents are kept — IBAN certificates, commercial
 * registrations — behind one small interface, as mail is (spec: Forms).
 *
 * - **A private Supabase Storage bucket** on a deployment, reached through its
 *   S3 interface with the media bucket's keys (`S3_DOCUMENTS_BUCKET`). Nothing
 *   in it has a public address: a document is read here, on the server, for a
 *   signed-in editor holding a link that expires (ADR-0004,
 *   `src/app/(forms)/api/form-documents/`).
 * - **A folder** on a machine that is not a deployment — the test suite's, or a
 *   developer's `.data/documents` — outside anything the site serves.
 * - **Nowhere**, on a deployment whose bucket is not configured: a form with a
 *   document then fails to send, and says so, rather than keeping the document
 *   on a server that forgets it.
 *
 * Server-only: it reads secrets. Imports are relative: the CMS loads it too.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { documentsBucket, localDocumentsDirectory, type MediaBucket } from '../cms/environment';
import { isPubliclyDeployed } from '../lib/environment';

export type DocumentStore = {
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  /** The document's bytes, or `null` when there is none under `key`. */
  get(key: string): Promise<Uint8Array | null>;
  remove(keys: readonly string[]): Promise<void>;
};

/** Where documents are kept here, or `null` where there is nowhere safe to keep them. */
export function documentStore(): DocumentStore | null {
  const bucket = documentsBucket();
  if (bucket) return bucketStore(bucket);
  if (isPubliclyDeployed()) return null;
  return directoryStore(localDocumentsDirectory());
}

/** The types a document may be, and the extension each is stored under. */
export const DOCUMENT_EXTENSIONS: Readonly<Record<string, string>> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

/**
 * What a document is, by its first bytes rather than its name or what the
 * browser says: a PDF, a PNG or a JPEG — or `null`, for anything else however
 * it is named.
 */
export function documentContentType(bytes: Uint8Array): string | null {
  const starts = (signature: readonly number[]) => signature.every((byte, index) => bytes[index] === byte);
  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (starts([0xff, 0xd8, 0xff])) return 'image/jpeg';
  return null;
}

function directoryStore(directory: string): DocumentStore {
  const within = (key: string) => {
    const file = path.resolve(directory, key);
    if (!file.startsWith(path.resolve(directory) + path.sep)) throw new Error(`Refusing a document key outside the store: ${key}`);
    return file;
  };
  return {
    async put(key, bytes) {
      const file = within(key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, bytes);
    },
    async get(key) {
      try {
        return new Uint8Array(await readFile(within(key)));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw error;
      }
    },
    async remove(keys) {
      await Promise.all(keys.map((key) => rm(within(key), { force: true })));
    },
  };
}

function bucketStore(bucket: MediaBucket): DocumentStore {
  const client = new S3Client({
    endpoint: bucket.endpoint,
    region: bucket.region,
    // Supabase Storage answers S3 requests by path, not by subdomain.
    forcePathStyle: true,
    credentials: { accessKeyId: bucket.accessKeyId, secretAccessKey: bucket.secretAccessKey },
  });
  return {
    async put(key, bytes, contentType) {
      await client.send(new PutObjectCommand({ Bucket: bucket.bucket, Key: key, Body: bytes, ContentType: contentType }));
    },
    async get(key) {
      try {
        const object = await client.send(new GetObjectCommand({ Bucket: bucket.bucket, Key: key }));
        return object.Body ? await object.Body.transformToByteArray() : null;
      } catch (error) {
        const { name, $metadata } = error as { name?: string; $metadata?: { httpStatusCode?: number } };
        if (name === 'NoSuchKey' || $metadata?.httpStatusCode === 404) return null;
        throw error;
      }
    },
    async remove(keys) {
      await Promise.all(keys.map((key) => client.send(new DeleteObjectCommand({ Bucket: bucket.bucket, Key: key }))));
    },
  };
}
