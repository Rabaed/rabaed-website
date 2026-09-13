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

  // The Screen mock studio reads its markup off disk rather than importing it,
  // so that 260 KB of hand-built HTML never lands in a bundle (ADR-0002).
  // Nothing statically references those files, so tracing cannot find them.
  outputFileTracingIncludes: {
    '/studio/**': ['./src/screen-mocks/**/*.html'],
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
