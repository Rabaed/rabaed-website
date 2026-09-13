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
