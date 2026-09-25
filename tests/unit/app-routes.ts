/**
 * Every route file under `src/app`, with the address Next serves it at — for
 * the specs that hold the page registry and the maximum age to the routes the
 * site really has (tickets 66 and 92).
 *
 * The address is worked out the way Next works it out: a route group, `(ar)`,
 * adds nothing; a dynamic segment stays as it is written, `[slug]`; and a
 * metadata file is served at its own name, `sitemap.ts` at `/sitemap.xml`.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const appDirectory = path.join(repoRoot, 'src', 'app');

/** A page, a route handler, a metadata file or the not-found page: a file Next answers an address with. */
const ROUTE_FILE = /^(page|route)\.tsx?$|^(sitemap|robots|not-found)\.tsx?$/;

/** The metadata files, and the address each is served at. */
const METADATA: Readonly<Record<string, string>> = { sitemap: 'sitemap.xml', robots: 'robots.txt' };

export type AppRoute = {
  /** The file, from the repository's root, with forward slashes. */
  readonly file: string;
  /** The address it answers: `/en/blog/[slug]`, `/sitemap.xml`. The not-found page is `/_not-found`, as Next builds it. */
  readonly address: string;
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
        .filter((segment) => segment !== '' && !/^\(.*\)$/.test(segment));
      const name = entry.name.replace(/\.tsx?$/, '');
      if (name === 'not-found') segments.push('_not-found');
      else if (METADATA[name]) segments.push(METADATA[name]);
      return { file, address: `/${segments.join('/')}` };
    })
    .sort((one, other) => one.file.localeCompare(other.file));
}
