import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import { isIndexable } from './src/lib/environment';
import { STUDIO_PREFIX } from './src/screen-mocks/registry';

/**
 * `X-Robots-Tag` alongside the `<meta name="robots">` the layouts emit. The
 * meta tag only exists inside an HTML body a crawler chose to parse; the
 * header covers everything else it may fetch, and is what it sees on a HEAD
 * request. Both are cheap and the failure they guard against is not
 * recoverable once a page has been crawled.
 */
const nextConfig: NextConfig = {
  // Off: since 16.3, `next dev` writes a managed block of Next.js guidance into
  // AGENTS.md and CLAUDE.md whenever it detects an AI agent, so every session
  // that started the dev server left the repo's own agent instructions edited
  // behind it (ticket 46). The one instruction in that block this repo wants —
  // read the version-matched docs in `node_modules/next/dist/docs/` — is written
  // into AGENTS.md by hand instead.
  agentRules: false,

  // The dev server refuses its own resources to any origin but `localhost`, so
  // a page opened at http://127.0.0.1:<port> loads but never hydrates, and every
  // client behaviour silently does nothing — an easy address to reach for, and
  // an hour lost in ticket 06 before it was spotted (ticket 46). Affects the dev
  // server only.
  allowedDevOrigins: ['127.0.0.1'],

  // Where the build is served from. Only the test suite's second server sets
  // it: it serves a copy of the first server's build, because a server keeps
  // the pages it rebuilds on disk inside this folder, and two servers sharing
  // one would each serve pages built from the other's database (ticket 89).
  // A build and a deployment never set it.
  distDir: process.env.TEST_BUILD_DIR || '.next',

  // The Screen mock studio reads its markup off disk rather than importing it,
  // so that 260 KB of hand-built HTML never lands in a bundle (ADR-0002).
  // Nothing statically references those files, so tracing cannot find them.
  outputFileTracingIncludes: {
    '/studio/**': ['./src/screen-mocks/**/*.html'],
    // The Pour Tracker's code copy, read off disk by its download route.
    '/downloads/**': ['./src/pour-tracker/fallback/index.html'],
  },

  /**
   * The product app's API, which its pages called at this domain before it
   * moved (ADR-0026). Everything else the product app used to answer here is
   * the proxy's to forward (`src/proxy.ts`), because only the proxy can ask
   * the product app first and still leave this site's not-found page to
   * answer what neither has. This is the one address it cannot leave to the
   * proxy: a call to an API is not a link anyone follows, so there is nothing
   * to ask — it is the product app's, and it goes there.
   *
   * `beforeFiles`, because Payload's catch-all
   * (`src/app/(payload)/api/[...slug]/route.ts`) answers everything under
   * `/api/`, so nothing there ever reaches a later phase. `/api/1.1/` is the
   * product app's prefix, and Payload does not use it.
   */
  async rewrites() {
    return {
      beforeFiles: [{ source: '/api/1.1/:path*', destination: '/portal-redirect/api/1.1/:path*' }],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    // The Screen mock studio is private for good, not just before launch: it
    // shows the same screens as the pages that are meant to rank
    // (ADR-0002). This rule therefore sits outside the environment check.
    const studio = {
      source: `${STUDIO_PREFIX}/:path*`,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    };

    // The Pour Tracker download sets its own headers — saved, never indexed —
    // in its route (`src/app/(pour-tracker)/downloads/…/route.ts`): a second
    // `Content-Disposition` from here would arrive beside its own.

    // The CMS admin and its API (ticket 19) are for editors, never for search.
    const cms = ['/maktab/:path*', '/api/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));

    if (isIndexable()) return [studio, ...cms];

    return [
      studio,
      ...cms,
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

// Payload's own additions: which of its packages stay out of the server
// bundle, and the aliases its admin needs.
export default withPayload(nextConfig);
