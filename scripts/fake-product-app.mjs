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
 * A page added to the test copy exists there before it exists live, so the
 * two copies differ by one page here: `only-in-test` answers 200 under
 * `version-test` and 404 everywhere else.
 *
 * And pages no product app has, which exist to be misbehaved with:
 *
 * - `slow` takes longer to answer than the proxy waits;
 * - `flaky-<anything>` fails the first time it is asked about, with a 503,
 *   and answers 404 after, so that a test can tell whether a failure was
 *   remembered;
 * - `limited-<anything>` the same, but with a 429: the product app turning a
 *   question away is no more an answer than its failing.
 */
import http from 'node:http';

const port = Number(process.env.PORT);
if (!Number.isInteger(port)) throw new Error('PORT is not set.');

const OPEN = new Set(['signin', 'registration', 'verify', 'version-test', 'version-live']);
const SIGNED_IN = new Set(['project', 'submittal', 'projects_list']);
const COPIES = new Set(['version-test', 'version-live']);
const ONLY_IN_TEST = new Set(['only-in-test']);
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
    const copy = COPIES.has(segments[0]) && segments[1] ? segments[0] : 'version-live';
    const page = COPIES.has(segments[0]) && segments[1] ? segments[1] : (segments[0] ?? '');

    if (page === 'slow') {
      setTimeout(() => response.writeHead(200).end(), 10_000);
      return;
    }
    for (const [prefix, refusal] of [['flaky-', 503], ['limited-', 429]]) {
      if (page.startsWith(prefix) && !failedOnce.has(page)) {
        failedOnce.add(page);
        response.writeHead(refusal).end();
        return;
      }
    }

    const status = ONLY_IN_TEST.has(page) ? (copy === 'version-test' ? 200 : 404) : statusOf(page);
    response.writeHead(status, status === 302 ? { Location: '/' } : {}).end();
  })
  .listen(port, '127.0.0.1', () => console.log(`fake product app on http://127.0.0.1:${port}`));
