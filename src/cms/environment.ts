/**
 * What the CMS needs from its environment, and the errors that say what to do
 * when it is missing. Every value here is a secret or names a system outside
 * the repository, so none has a default a deployment could silently run on.
 *
 * Locally none of this has to be set by hand: `npm run dev` and `npm test`
 * start a Postgres of their own and fill it in (`scripts/with-database.mjs`,
 * `scripts/test-server.mjs`). On Vercel every value is set per environment —
 * see "The CMS" in `docs/deployment.md`.
 */
import path from 'node:path';
import { isPubliclyDeployed } from '../lib/environment';

function required(name: string, what: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. ${what} See "The CMS" in docs/deployment.md.`);
  return value;
}

/** The Supabase Postgres connection string (ADR-0004). */
export function databaseUrl(): string {
  return required('DATABASE_URL', 'It is the connection string of the Postgres database the CMS stores content in.');
}

/**
 * The pool the Postgres adapter opens its connections with (ticket 83).
 *
 * `pg`'s defaults allow ten connections and no end to a wait for a free one.
 * Every server Vercel runs the site on opens a pool of its own, so under a
 * spike those ten each are what Supabase is asked for, and a request that
 * finds its server's all busy hangs until Vercel's function limit ends it
 * minutes later.
 *
 * On a deployment, then, five, and ten seconds. Five is room for one server's
 * work: the adapter keeps one of them checked out for as long as the server
 * lives, to hear a dropped connection, which leaves four for page builds, the
 * admin and the forms, and a page build asks for several at once. Against the
 * 200 clients Supabase's pooler takes on its smaller plans, it is forty
 * servers where the default was twenty — `docs/deployment.md` says why the
 * pooler address matters. Ten seconds is far longer than any query here takes
 * and far shorter than a visitor waits: past it the request fails, and a page
 * that already has a built copy goes on serving it.
 *
 * Locally, `pg`'s own. The test server's suites ask for many pages at once and
 * lean on its ten connections (ticket 70); a ceiling meant for a fleet of
 * servers would only starve the one.
 */
export function databasePool(): { connectionString: string; max?: number; connectionTimeoutMillis?: number } {
  const connectionString = databaseUrl();
  if (!isPubliclyDeployed()) return { connectionString };
  return { connectionString, max: 5, connectionTimeoutMillis: 10_000 };
}

/** Signs editors' login sessions. One long random value per environment. */
export function payloadSecret(): string {
  return required('PAYLOAD_SECRET', 'It signs editors’ login sessions.');
}

const BUCKET_VARIABLES = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
] as const;

/**
 * On a Vercel deployment, every CMS variable that is missing, named in one
 * error. Checked one at a time, a deployment missing all seven would fail
 * seven builds in a row, each naming the next — and each fix is a trip to
 * Vercel's settings and a redeploy for somebody who is not a developer.
 */
export function requireDeploymentVariables(): void {
  if (!isPubliclyDeployed()) return;
  const missing = ['DATABASE_URL', 'PAYLOAD_SECRET', ...BUCKET_VARIABLES].filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `This deployment is missing ${missing.join(', ')}. Add ${missing.length === 1 ? 'it' : 'them'} in Vercel under Settings → Environment Variables, ticked for the "${process.env.VERCEL_ENV}" environment, then redeploy. See "The CMS" in docs/deployment.md.`,
    );
  }
}

export type MediaBucket = {
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/**
 * The Supabase Storage bucket uploaded images go to, reached through its S3
 * interface — or `null` on a machine that keeps them on its own disk.
 *
 * A deployment may not keep them on disk: a Vercel function's filesystem is
 * thrown away between requests, so an image uploaded there would vanish
 * minutes later with nothing to say why. That is refused here, at start-up,
 * rather than discovered by Ahmed.
 */
export function mediaBucket(): MediaBucket | null {
  const present = BUCKET_VARIABLES.filter((name) => process.env[name]);

  if (present.length === 0) {
    if (isPubliclyDeployed()) {
      throw new Error(
        `Media storage is not configured. A deployment cannot keep uploaded images on its own disk; set ${BUCKET_VARIABLES.join(', ')}. See "The CMS" in docs/deployment.md.`,
      );
    }
    return null;
  }

  if (present.length < BUCKET_VARIABLES.length) {
    const missing = BUCKET_VARIABLES.filter((name) => !process.env[name]);
    throw new Error(`Media storage is half configured: ${missing.join(', ')} missing. Set all five, or none.`);
  }

  return {
    bucket: process.env.S3_BUCKET!,
    endpoint: process.env.S3_ENDPOINT!,
    region: process.env.S3_REGION!,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  };
}

/** Where uploads go when there is no bucket: a local machine only. */
export function localMediaDirectory(): string {
  return process.env.MEDIA_DIR ?? path.resolve(process.cwd(), '.data', 'media');
}

/** The same, for the sharing images a page's link unfurls as (ticket 26). */
export function localSharingImageDirectory(): string {
  return process.env.SHARING_IMAGE_DIR ?? path.resolve(process.cwd(), '.data', 'sharing-images');
}

/**
 * The private Supabase Storage bucket applicant documents go to (ticket 28),
 * reached through the same S3 connection and keys as the media bucket — or
 * `null` where `S3_DOCUMENTS_BUCKET` is not set.
 *
 * It may not be the media bucket, which is public: no public bucket may ever
 * hold applicant documents (ADR-0004).
 */
export function documentsBucket(): MediaBucket | null {
  const name = process.env.S3_DOCUMENTS_BUCKET;
  if (!name) return null;
  const media = mediaBucket();
  if (!media) {
    throw new Error(
      `S3_DOCUMENTS_BUCKET is set, but the S3 connection is not: set ${BUCKET_VARIABLES.join(', ')} too. See "The CMS" in docs/deployment.md.`,
    );
  }
  if (name === media.bucket) {
    throw new Error(
      'S3_DOCUMENTS_BUCKET names the media bucket, which is public. Applicant documents need a private bucket of their own. See "The CMS" in docs/deployment.md.',
    );
  }
  return { ...media, bucket: name };
}

/** Where applicant documents go when there is no bucket: a local machine only. */
export function localDocumentsDirectory(): string {
  return process.env.DOCUMENTS_DIR || path.resolve(process.cwd(), '.data', 'documents');
}
