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
  },

  /**
   * The portal's old addresses on this domain, forwarded to `app.rabaedapp.com`
   * (ADR-0025). Named, not "everything left over": a rule that forwarded
   * whatever this site does not serve would take the site's own not-found page
   * with it, and `/ar`, `/admin` and every mistyped address would leave for the
   * portal instead of being refused here (`tests/e2e/localisation.spec.ts`,
   * `tests/e2e/cms.spec.ts`).
   *
   * `beforeFiles`, so these addresses belong to the portal whatever this site
   * later adds. Two of them have to be: Payload's catch-all
   * (`src/app/(payload)/api/[...slug]/route.ts`) answers everything under
   * `/api/`, and `/maktab` is the CMS, so neither would ever reach a later
   * phase.
   */
  async rewrites() {
    const portal = [
      // Bubble names a version in the address, and every page below has a copy
      // under each — so these two cover the test and live copies of all of them.
      '/version-test/:path*',
      '/version-live/:path*',

      '/api/1.1/:path*', // Bubble's API, which Payload's own `/api` does not use
      '/fileupload/:path*', // a stored private file, addressed in emails
      '/signin/:path*',
      '/signup/:path*',
      '/registration/:path*', // an invite email's link, with its token in the query
      '/verify/:path*', // the QR code printed on a letter
      '/submittal/:path*', // submittal emails and the links inside Excel exports
      '/project/:path*',
      '/projects_list/:path*',
    ];

    return {
      // `:path*` matches no segments as well as some, so `/signin` and
      // `/signin/anything` both forward.
      beforeFiles: portal.map((source) => ({ source, destination: `/portal-redirect${source}` })),
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

    // The Pour Tracker file (ticket 18) is saved, not opened as a page on the
    // site, and takes its name from the URL. It is never indexed either, so a
    // search result cannot hand it out past the form ticket 30 puts in front
    // of it — though anyone given the link can still fetch it.
    const downloads = {
      source: '/downloads/:file*',
      headers: [
        { key: 'Content-Disposition', value: 'attachment' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    };

    // The CMS admin and its API (ticket 19) are for editors, never for search.
    const cms = ['/maktab/:path*', '/api/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));

    if (isIndexable()) return [studio, downloads, ...cms];

    return [
      studio,
      downloads,
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
