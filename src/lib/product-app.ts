/**
 * Asking the product app whether it has a page, and where to send a visitor
 * when it does (ADR-0026).
 *
 * Asked by the proxy, on the address of a request this site has no page for,
 * so it stays small: a `HEAD` request, answers remembered in memory, and a
 * time limit after which the question is given up and the visitor forwarded.
 * Tested through the running site (`tests/e2e/product-app-forwarding.spec.ts`)
 * against a stand-in for the product app (`scripts/fake-product-app.mjs`).
 */

/**
 * Where the product app answers. Only the test suite sets it, to the
 * stand-in; a deployment never does.
 */
function origin(): string {
  return process.env.PRODUCT_APP_ORIGIN || 'https://app.rabaedapp.com';
}

/** The same address on the product app, query and all. */
export function productAppUrl(pathname: string, search: string): string {
  return `${origin()}${pathname}${search}`;
}

/**
 * How long the question waits. The product app answered in 0.4 to 1.3 seconds
 * when it was measured; a visitor kept waiting longer than this is forwarded
 * anyway, which is the safe way to be wrong.
 */
const PATIENCE_MS = 1_500;

/**
 * How long an answer is remembered. "It has the page" for a day: its pages do
 * not come and go. "It does not" for an hour: short, so a page the product app
 * gains is reached within the hour. A question that got no answer is not
 * remembered at all — an hour of 404s for a printed letter because the
 * product app was restarting once would be the worst way to be wrong.
 */
const HAS_FOR_MS = 24 * 60 * 60 * 1_000;
const LACKS_FOR_MS = 60 * 60 * 1_000;

/**
 * Answers remembered, by page. Bounded, because a scanner asks for thousands
 * of addresses no site has, and each is a page asked about once: past the
 * bound, the oldest answer is forgotten first.
 */
const MOST_REMEMBERED = 1_000;
const answers = new Map<string, { has: boolean; until: number }>();

function remember(page: string, has: boolean, now: number) {
  answers.delete(page);
  answers.set(page, { has, until: now + (has ? HAS_FOR_MS : LACKS_FOR_MS) });
  if (answers.size > MOST_REMEMBERED) answers.delete(answers.keys().next().value!);
}

/**
 * Whether the product app has the page: `true`, `false`, or `null` when it
 * gave no answer in time or answered with an error of its own — which the
 * proxy reads as "forward anyway".
 *
 * Anything but a 404 means it has the page: a page that needs a sign-in
 * answers 302, a folder of files 403, and both are pages a link was given out
 * for.
 */
export async function productAppHas(page: string): Promise<boolean | null> {
  const now = Date.now();
  const known = answers.get(page);
  if (known && known.until > now) return known.has;

  let status: number;
  try {
    const response = await fetch(`${origin()}/${page}`, {
      method: 'HEAD',
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(PATIENCE_MS),
    });
    status = response.status;
  } catch {
    return null;
  }
  if (status >= 500) return null;

  const has = status !== 404;
  remember(page, has, now);
  return has;
}
