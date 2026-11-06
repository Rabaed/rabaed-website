/**
 * The discovery files reach the host as functions it can rebuild, never as
 * files fixed at the deploy (ticket 111).
 *
 * When the build hands its outputs to the host, Next makes any route built
 * ahead of time whose address is a metadata file's (`/sitemap.xml`,
 * `/robots.txt`) a static file. The route's function is left out, and with it
 * its age and the marks a publish sends
 * (`node_modules/next/dist/build/adapter/build-complete.js`, Next 16.3.5).
 * `next start` serves the same build from its own store, rebuilding as told,
 * so no test against the test server can see it. On `rabaedapp.com` the
 * sitemap stayed as the deploy wrote it, without the Company profile
 * published after.
 *
 * So this asks the build what Next's own hand-over asks: is the file's address
 * a metadata file's, and was it built ahead of time? It reads the build the
 * test servers serve, made for this run (`scripts/test-server.mjs`).
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { DISCOVERY_FILES } from '../../src/lib/page-registry';
import { repoRoot } from './app-routes';

const require = createRequire(import.meta.url);
const { isStaticMetadataFile } = require('next/dist/lib/metadata/is-metadata-route') as {
  isStaticMetadataFile: (address: string) => boolean;
};

/** The addresses the build made ahead of time, as the hand-over reads them. */
async function builtAheadOfTime(): Promise<ReadonlySet<string>> {
  const manifest = JSON.parse(await readFile(path.join(repoRoot, '.next', 'prerender-manifest.json'), 'utf8')) as {
    routes: Record<string, unknown>;
  };
  return new Set(Object.keys(manifest.routes));
}

for (const file of DISCOVERY_FILES) {
  test(`${file} reaches the host as a function, not a file fixed at the deploy`, async () => {
    const prerendered = (await builtAheadOfTime()).has(file);
    expect(
      isStaticMetadataFile(file) && prerendered,
      `${file} is built ahead of time at a metadata file's address, so the host is given it as a static file: no publish and no age reaches it.`,
    ).toBe(false);
  });
}
