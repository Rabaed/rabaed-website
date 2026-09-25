// A relative path with its extension, rather than the `@/` alias used
// everywhere else: `scripts/export-screen-mocks.mjs` imports these two modules
// under plain Node, which resolves neither tsconfig paths nor extensionless
// specifiers.
import type { Locale } from '../lib/locales.ts';

/**
 * The Screen mocks: depictions of Rabaed app screens, shown on the Marketing
 * site (CONTEXT.md). They are not photographs of the real app, which does not
 * exist yet — they are the co-founder's hand-built HTML, kept in the repo and
 * rendered to images by a script rather than rebuilt as components (ADR-0002).
 *
 * This table is what the studio route, the export script and the tests all
 * read, so a new mock is added in one place — with its markup once for each
 * language, in `ar/` and `en/`.
 *
 * **The English set is the Arabic one, translated and mirrored** (ticket 41),
 * not a second design: element for element the same markup, with the words in
 * English, `dir="ltr"`, and every physical side swapped — `left` for `right`,
 * a four-value padding's two sides, the icon rail's shadow, `text-align`, a
 * tilt's sign — and the chevrons that point onward turned to point right.
 * Charts, signatures and stamps are pictures of things, not of the interface,
 * and keep their direction. `tests/e2e/screen-mocks.spec.ts` holds the two
 * sets to the same elements in the same order, and the cards on the stage to
 * mirrored positions — so an element added to or dropped from one language's
 * screen fails until the other has it too. A change of style or colour is not
 * caught, and is made in both by hand.
 *
 * **No `alt` text here, deliberately.** What a mock shows, in words, is copy —
 * the picture's description and the visible caption ADR-0002 requires — and it
 * lives with the copy, in the CMS's Screen mocks entry (ticket 57). This table
 * says how a mock is drawn, and the export script imports it under plain Node.
 */
export type ScreenMock = {
  readonly id: string;
  /** What it depicts, for the studio's own index. Not the `alt` text. */
  readonly title: string;
  /** The Reference page the markup was taken from, and which the tests compare against. */
  readonly referencePage: string;
  /** The stage the markup draws on, fixed by the markup itself. */
  readonly width: number;
  readonly height: number;
  /** Exported at this multiple of the stage, so it stays sharp on a dense screen. */
  readonly scale: number;
  /**
   * Where this mock's Phone crop is cut from its Arabic screen: the top-left
   * corner of a `PHONE_CROP`-sized box, in stage pixels from the stage's left
   * and top (ticket 78). The English crop is this box mirrored — see
   * `phoneCropBox`.
   */
  readonly phoneCrop: { readonly x: number; readonly y: number };
};

const STAGE = { width: 1440, height: 900, scale: 2 } as const;

/**
 * The one shape every Phone crop shares (CONTEXT.md, ADR-0022): portrait, four
 * wide by five tall, in stage pixels.
 *
 * Sized for a phone's column rather than for the screen. At 390px wide the
 * column is 350px, and 520 stage pixels drawn in it are at two-thirds of their
 * size — against about a quarter for the whole 1440px screen — which is what
 * brings a table's 13px text up to something a phone can read. Narrower would
 * be larger still, but would no longer hold one of the floating cards whole
 * beside a slice of the screen it is about.
 *
 * The founder approved the shape and all eight positions below on 24 September
 * 2026, crop by crop, beside their whole screens. Moving one is a change to
 * what visitors see on a phone, and goes back to them.
 */
export const PHONE_CROP = { width: 520, height: 650 } as const;

export const SCREEN_MOCKS = [
  // The «مدة الانتظار تُحتسب تلقائيًا» card, beside the status and wait columns it is about.
  { id: 'correspondence', title: 'المراسلات الرسمية', referencePage: 'index.html', ...STAGE, phoneCrop: { x: 100, y: 230 } },
  // «الدورة الداخلية — المقاول» and the stamped code-B reply, over the board's edge.
  { id: 'kanban', title: 'لوحة الاعتمادات والطلبات', referencePage: 'index.html', ...STAGE, phoneCrop: { x: 45, y: 250 } },
  // «العمالة اليوم» and the weather card: the hours, photos and weather story.
  { id: 'daily-report', title: 'التقرير اليومي للموقع', referencePage: 'index.html', ...STAGE, phoneCrop: { x: 47, y: 250 } },
  // «سجل الإصدارات» and «لا ملف بلا مصدر», beside the file list.
  { id: 'documents', title: 'المستندات والإصدارات', referencePage: 'index.html', ...STAGE, phoneCrop: { x: 43, y: 230 } },
  // «أربع توقيعات على ورقة واحدة» whole. The stamp and the signers' names are
  // further apart than any crop of this shape reaches; the founder chose the card.
  { id: 'stamped-sheet', title: 'ورقة الاعتماد المختومة', referencePage: 'index.html', ...STAGE, phoneCrop: { x: 12, y: 240 } },
  // The project card and its three companies, under the headline figures: one board for every party.
  { id: 'overview', title: 'لوحة المشروع للمالك', referencePage: 'product.html', ...STAGE, phoneCrop: { x: 665, y: 230 } },
  // «بانتظار إجرائي» and the A / B / C reply card, over the table.
  { id: 'approvals-table', title: 'جدول الاعتمادات للاستشاري', referencePage: 'product.html', ...STAGE, phoneCrop: { x: 45, y: 250 } },
  // «أثر زمني لا يُعدَّل» and the request with the consultant.
  { id: 'submittal', title: 'تفاصيل الطلب للمقاول', referencePage: 'product.html', ...STAGE, phoneCrop: { x: 47, y: 250 } },
] as const satisfies readonly ScreenMock[];

/**
 * A mock's id as a type rather than any string, so that naming one that does
 * not exist fails the typecheck instead of exporting a blank. `as const
 * satisfies` above is what keeps the ids literal while the table is still held
 * to `ScreenMock`.
 */
export type ScreenMockId = (typeof SCREEN_MOCKS)[number]['id'];

export function findScreenMock(id: string): ScreenMock | undefined {
  return SCREEN_MOCKS.find((mock) => mock.id === id);
}

/**
 * The studio route for one mock. Private: it is blocked from indexing whatever
 * the environment, ticket 33 keeps it out of the sitemap by this prefix, and
 * `src/proxy.ts` answers not found for it on the production deployment
 * (ticket 98), with this prefix written out in its matcher.
 */
export const STUDIO_PREFIX = '/studio';

export function studioPath(locale: Locale, id: string): string {
  return `${STUDIO_PREFIX}/${locale}/${id}`;
}

/** Where the exported image lives, relative to `public/` and as a URL. */
export function screenMockImagePath(locale: Locale, id: string): string {
  return `/screen-mocks/${locale}/${id}.webp`;
}

/**
 * Where a mock's exported Phone crop lives. In a folder of its own, so that the
 * folder above still holds exactly one whole screen per mock.
 */
export function phoneCropImagePath(locale: Locale, id: string): string {
  return `/screen-mocks/${locale}/phone/${id}.webp`;
}

/**
 * The size the export makes a mock's Phone crop at, in pixels: the crop's box
 * at the mock's scale. A crop an Editor uploads in the CMS is held to this or
 * larger, in the same shape (ticket 79), as sharp on a dense screen as the
 * export's.
 */
export function phoneCropExportSize(mock: ScreenMock) {
  return { width: PHONE_CROP.width * mock.scale, height: PHONE_CROP.height * mock.scale };
}

/**
 * The box a mock's Phone crop is cut from, in one language's screen, in stage
 * pixels.
 *
 * The English box is the Arabic one reflected across the stage's middle,
 * because the English screen is the Arabic one mirrored (ticket 41): the same
 * cards, on the other side. Its height and top are the Arabic one's.
 */
export function phoneCropBox(locale: Locale, mock: ScreenMock) {
  const x = locale === 'ar' ? mock.phoneCrop.x : mock.width - mock.phoneCrop.x - PHONE_CROP.width;
  return { x, y: mock.phoneCrop.y, ...PHONE_CROP };
}
