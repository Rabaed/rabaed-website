/**
 * A stand-in for the product app, for the test suite (ADR-0026).
 *
 *   node scripts/fake-product-app.mjs        (port from PORT)
 *
 * The proxy asks the product app whether it has a page before forwarding an
 * address to it. The suite cannot ask the real one: CI must not depend on it
 * being up, and `app.rabaedapp.com` does not answer until the cutover. So it
 * asks this instead, and this answers the way the product app was observed to
 * on 3 October 2026, while it still answered at `rabaedapp.com`:
 *
 * - 200 for a page anyone may open: `signin`, `registration`, `verify`, and
 *   each copy's home page, `version-test` and `version-live`;
 * - 302 for a page that needs a sign-in, which it sends to its home page:
 *   `project`, `submittal`, `projects_list`;
 * - 403 for `fileupload` itself, whose files sit beneath it;
 * - 404 for anything else — `ar`, `nothing-here`, and `admin`, which the
 *   founder is renaming so that it answers 404 (it answered 302 on that day).
 *
 * And two pages no product app has, which exist to be misbehaved with:
 *
 * - `slow` takes longer to answer than the proxy waits;
 * - `flaky-<anything>` fails the first time it is asked about and answers 404
 *   after, so that a test can tell whether a failure was remembered.
 */
import http from 'node:http';

const port = Number(process.env.PORT);
if (!Number.isInteger(port)) throw new Error('PORT is not set.');

const OPEN = new Set(['signin', 'registration', 'verify', 'version-test', 'version-live']);
const SIGNED_IN = new Set(['project', 'submittal', 'projects_list']);
const COPIES = new Set(['version-test', 'version-live']);
const failedOnce = new Set();

/** The product app's answer for a page, before any misbehaviour. */
function statusOf(page) {
  if (OPEN.has(page)) return 200;
  if (SIGNED_IN.has(page)) return 302;
  if (page === 'fileupload') return 403;
  return 404;
}

http
  .createServer((request, response) => {
    const segments = new URL(request.url, 'http://fake').pathname.split('/').filter(Boolean);
    // A copy named in front is part of the page, as in the real thing; the
    // copies are identical here.
    const page = COPIES.has(segments[0]) && segments[1] ? segments[1] : (segments[0] ?? '');

    if (page === 'slow') {
      setTimeout(() => response.writeHead(200).end(), 10_000);
      return;
    }
    if (page.startsWith('flaky-') && !failedOnce.has(page)) {
      failedOnce.add(page);
      response.writeHead(503).end();
      return;
    }

    const status = statusOf(page);
    response.writeHead(status, status === 302 ? { Location: '/' } : {}).end();
  })
  .listen(port, '127.0.0.1', () => console.log(`fake product app on http://127.0.0.1:${port}`));
