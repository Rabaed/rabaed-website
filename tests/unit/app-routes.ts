/**
 * Every route file under `src/app`, with the address Next serves it at — for
 * the specs that hold the page registry and the maximum age to the routes the
 * site really has (tickets 66 and 92).
 *
 * The address is worked out the way Next works it out: a route group, `(ar)`,
 * and a parallel route's slot, `@modal`, add nothing; a dynamic segment stays
 * as it is written, `[slug]`; a metadata file is served at its own name,
 * `sitemap.ts` at `/sitemap.xml`; and the root not-found page is built as a
 * page of its own, `/_not-found`. A layout, or a not-found page further down,
 * answers the address of the folder it is in.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const appDirectory = path.join(repoRoot, 'src', 'app');

/** The metadata files, and the name each is served at. */
const METADATA: Readonly<Record<string, string>> = {
  sitemap: 'sitemap.xml',
  robots: 'robots.txt',
  manifest: 'manifest.webmanifest',
  icon: 'icon',
  'apple-icon': 'apple-icon',
  'opengraph-image': 'opengraph-image',
  'twitter-image': 'twitter-image',
};

/** A file Next answers an address with, or a layout above such files. */
const ROUTE_FILE = new RegExp(`^(page|route|layout|not-found|${Object.keys(METADATA).join('|')})\\.tsx?$`);

export type AppRoute = {
  /** The file, from the repository's root, with forward slashes. */
  readonly file: string;
  /** The address it answers: `/en/blog/[slug]`, `/sitemap.xml`. */
  readonly address: string;
  /** A layout, which is not a route of its own but sets things for those beneath it: their maximum age among them. */
  readonly layout: boolean;
};

export async function appRoutes(): Promise<AppRoute[]> {
  const entries = await readdir(appDirectory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && ROUTE_FILE.test(entry.name))
    .map((entry) => {
      const file = path.relative(repoRoot, path.join(entry.parentPath, entry.name)).split(path.sep).join('/');
      const segments = path
        .relative(appDirectory, entry.parentPath)
        .split(path.sep)
        .filter((segment) => segment !== '' && !/^\(.*\)$/.test(segment) && !segment.startsWith('@'));
      const name = entry.name.replace(/\.tsx?$/, '');
      if (name === 'not-found' && segments.length === 0) segments.push('_not-found');
      else if (METADATA[name]) segments.push(METADATA[name]);
      return { file, address: `/${segments.join('/')}`, layout: name === 'layout' };
    })
    .sort((one, other) => one.file.localeCompare(other.file));
}

/** An address, and every address beneath it. */
export const under = (address: string, prefix: string) => address === prefix || address.startsWith(`${prefix}/`);
