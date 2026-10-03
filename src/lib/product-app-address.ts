/**
 * Which page of the product app an address on this domain asks for (ADR-0026).
 *
 * Until it moved, the product app answered at `rabaedapp.com`, and its
 * addresses are in invite emails, submittal emails, Excel exports and the QR
 * codes printed on letters. The proxy asks the product app, at its new
 * address, whether it has the page one of those names — so this answers only
 * "which page", never "is it there".
 *
 * Pure: the proxy imports it on every request, and the narrow seam the spec
 * permits for pure calculation tests it directly
 * (`tests/unit/product-app-address.spec.ts`).
 */
import { LOCALES } from './locales';
import { DISCOVERY_FILES, MARKETING_PAGES, NOT_FOUND_ADDRESS, NOT_PAGES, SITE_PAGES } from './page-registry';

/** An address's first segment: `/en/product` → `en`, `/` → `''`. */
const firstSegment = (address: string) => address.split('/').filter(Boolean)[0] ?? '';

/**
 * The first segments of every address this site answers itself. The product
 * app is never asked about them, because the question fails open: were it
 * unreachable, an address asked about would be forwarded — and this site's
 * own pages and images would leave with it.
 *
 * Read from the page registry wherever it can be, so that a page added there
 * is this site's at once. The rest are written out, and
 * `tests/unit/product-app-address.spec.ts` fails when a route or a file in
 * `public/` is missing from them.
 */
export const SITE_SEGMENTS: ReadonlySet<string> = new Set([
  ...Object.values(MARKETING_PAGES).map((page) => firstSegment(page.path)),
  ...Object.values(SITE_PAGES).map((page) => firstSegment(page.path)),
  ...DISCOVERY_FILES.map(firstSegment),
  firstSegment(NOT_FOUND_ADDRESS),
  ...NOT_PAGES.map((route) => firstSegment(route.address)),
  // Every language but the default answers under a prefix of its own.
  ...Object.values(LOCALES).map((locale) => firstSegment(locale.pathPrefix)),
  // Next's own files.
  '_next',
  // `src/app/icon.png` and `src/app/apple-icon.png`, served at their names.
  'icon.png',
  'apple-icon.png',
  // `public/`.
  'brand',
  'downloads',
  'hero',
  'logos',
  'og-rabaed.png',
  'screen-mocks',
]);

/**
 * The product app keeps a test copy and a live copy, and an address names
 * which one in front of the page. A page can exist in one copy and not the
 * other — the test copy has it first — so the copy is part of the question.
 */
const COPIES = new Set(['version-test', 'version-live']);

/**
 * The product app's page an address names: its first segment, with the copy
 * in front of it when one is named. What follows the page is its parameters.
 */
export function productAppPage(pathname: string): string | null {
  const [first = '', second] = pathname.split('/').filter(Boolean);
  if (SITE_SEGMENTS.has(first)) return null;
  return COPIES.has(first) && second !== undefined ? `${first}/${second}` : first;
}
