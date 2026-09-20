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
 * read, so a new mock is added in one place.
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
};

const STAGE = { width: 1440, height: 900, scale: 2 } as const;

export const SCREEN_MOCKS = [
  { id: 'correspondence', title: 'المراسلات الرسمية', referencePage: 'index.html', ...STAGE },
  { id: 'kanban', title: 'لوحة الاعتمادات والطلبات', referencePage: 'index.html', ...STAGE },
  { id: 'daily-report', title: 'التقرير اليومي للموقع', referencePage: 'index.html', ...STAGE },
  { id: 'documents', title: 'المستندات والإصدارات', referencePage: 'index.html', ...STAGE },
  { id: 'stamped-sheet', title: 'ورقة الاعتماد المختومة', referencePage: 'index.html', ...STAGE },
  { id: 'overview', title: 'لوحة المشروع للمالك', referencePage: 'product.html', ...STAGE },
  { id: 'approvals-table', title: 'جدول الاعتمادات للاستشاري', referencePage: 'product.html', ...STAGE },
  { id: 'submittal', title: 'تفاصيل الطلب للمقاول', referencePage: 'product.html', ...STAGE },
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
 * the environment, and ticket 33 keeps it out of the sitemap by this prefix.
 */
export const STUDIO_PREFIX = '/studio';

export function studioPath(locale: Locale, id: string): string {
  return `${STUDIO_PREFIX}/${locale}/${id}`;
}

/** Where the exported image lives, relative to `public/` and as a URL. */
export function screenMockImagePath(locale: Locale, id: string): string {
  return `/screen-mocks/${locale}/${id}.webp`;
}
