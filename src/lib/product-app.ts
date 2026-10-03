/**
 * Asking the product app whether it has a page, and sending a visitor there
 * when it has (ADR-0026).
 *
 * Asked by the proxy, on the address of a request this site has no page for,
 * so it stays small: a `HEAD` request, answers remembered in memory, and a
 * time limit after which the question is given up and the visitor forwarded.
 * Tested through the running site (`tests/e2e/product-app-forwarding.spec.ts`)
 * against a stand-in for the product app (`scripts/fake-product-app.mjs`).
 */
import { productAppOrigin } from './environment';

/**
 * What the product app said about a page. `unknown` — it gave no answer in
 * time, failed, or turned the question away — is read as "forward anyway": a
 * printed link must not break because the product app was slow once.
 */
export type ProductAppAnswer = 'has' | 'lacks' | 'unknown';

/**
 * The status every visitor is sent on with: 307 until the cutover has been
 * watched for a week, then 308. Both the proxy and the API's route handler
 * send it, so changing it here changes both.
 *
 * 308 is the honest answer — the product app has moved for good — but a
 * browser keeps it indefinitely, and a wrong one cannot be taken back from the
 * machines that stored it. 307 says the same to a visitor and costs only the
 * search signal, which a week does not spend. Both keep the method and the
 * body, which 301 and 302 do not: a form posted to an old address still
 * arrives as a post.
 */
export const FORWARD_STATUS = 307;

/** The same address on the product app, query and all. */
export function productAppUrl(pathname: string, search: string): string {
  return `${productAppOrigin()}${pathname}${search}`;
}

/** Sends a visitor to the same address on the product app. */
export function forwardToProductApp(pathname: string, search: string): Response {
  return new Response(null, {
    status: FORWARD_STATUS,
    // Not cached: the answer it rests on can change, and a wrong forward
    // should stop the moment it is fixed.
    headers: { Location: productAppUrl(pathname, search), 'Cache-Control': 'no-store' },
  });
}

/**
 * How long the question waits. The product app answered in 0.4 to 1.3 seconds
 * when it was measured; a visitor kept waiting longer than this is forwarded
 * anyway, which is the safe way to be wrong.
 */
const PATIENCE_MS = 1_500;

/**
 * How long an answer is remembered. "Has" for a day: its pages do not come
 * and go. "Lacks" for an hour: short, so a page the product app gains is
 * reached within the hour. `unknown` not at all — an hour of 404s for a
 * printed letter because the product app was restarting once would be the
 * worst way to be wrong.
 */
const HAS_FOR_MS = 24 * 60 * 60 * 1_000;
const LACKS_FOR_MS = 60 * 60 * 1_000;

/**
 * Statuses that describe the question rather than the page: timed out (408),
 * too many questions (429), or `HEAD` not allowed (405). None says whether the
 * page exists, so each is `unknown` — and a rate limit is just what a scanner
 * asking for thousands of addresses would bring on.
 */
const REFUSALS = new Set([405, 408, 429]);

/**
 * Answers remembered, by page, most recently used last. Bounded, because a
 * scanner asks for thousands of addresses no site has, each a page asked
 * about once: past the bound, the answer used least recently is forgotten, so
 * a burst of a scanner's addresses pushes out its own before a real page's.
 */
const MOST_REMEMBERED = 1_000;
const answers = new Map<string, { answer: 'has' | 'lacks'; until: number }>();

function remember(page: string, answer: 'has' | 'lacks', until: number) {
  answers.delete(page);
  answers.set(page, { answer, until });
  if (answers.size > MOST_REMEMBERED) answers.delete(answers.keys().next().value!);
}

/**
 * Whether the product app has the page. Anything but a 404 means it has: a
 * page that needs a sign-in answers 302, a folder of files 403, and both are
 * pages a link was given out for.
 */
export async function productAppHas(page: string): Promise<ProductAppAnswer> {
  const now = Date.now();
  const known = answers.get(page);
  if (known && known.until > now) {
    remember(page, known.answer, known.until);
    return known.answer;
  }

  let status: number;
  try {
    const response = await fetch(`${productAppOrigin()}/${page}`, {
      method: 'HEAD',
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(PATIENCE_MS),
    });
    status = response.status;
  } catch {
    return 'unknown';
  }
  if (status >= 500 || REFUSALS.has(status)) return 'unknown';

  const answer = status === 404 ? 'lacks' : 'has';
  remember(page, answer, now + (answer === 'has' ? HAS_FOR_MS : LACKS_FOR_MS));
  return answer;
}
