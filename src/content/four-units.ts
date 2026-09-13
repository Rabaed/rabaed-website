import type { DescribedScreenMock } from '@/content/screen-mock-descriptions';

/**
 * The home page's «أربع وحدات» section: a tab for each of Rabaed's four units,
 * and a fifth for the Record they produce, each with the Screen mock that shows
 * it.
 *
 * What each screen shows, in words — the picture's `alt` and the visible
 * caption under it, both at once, as ADR-0002 asks — is looked up by the mock
 * in `src/content/screen-mock-descriptions.ts`, which the product page reads
 * too.
 *
 * **Those descriptions come from the Reference site's product page, verbatim.**
 * The home page's own Reference markup only names each screen — «شاشة المراسلات
 * الرسمية في ربائد» — which says which screen it is and nothing about what it
 * shows. The product page describes the same five screens, which are
 * byte-identical images (ticket 05), in full: what is on them. Using those
 * makes a real claim without inventing one.
 *
 * `mock` names an entry in `src/screen-mocks/registry.ts`, whose exported image
 * is what the tab shows.
 *
 * Ticket 21 moves page copy into the CMS.
 */

export type UnitTab = {
  /** The small line above the title: a unit's number, or the name of what the units produce. */
  readonly tag: { readonly kind: 'unit'; readonly number: string } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /** The Screen mock's id in the registry, which is also what its description is looked up by. */
  readonly mock: DescribedScreenMock;
};

export const FOUR_UNITS_HEADING = 'أربع وحدات. سجل واحد يجمعها.';

export const UNIT_TABS: readonly UnitTab[] = [
  { tag: { kind: 'unit', number: '01' }, title: 'المراسلات الرسمية', mock: 'correspondence' },
  { tag: { kind: 'unit', number: '02' }, title: 'الاعتمادات والطلبات', mock: 'kanban' },
  { tag: { kind: 'unit', number: '03' }, title: 'التقرير اليومي للموقع', mock: 'daily-report' },
  { tag: { kind: 'unit', number: '04' }, title: 'المستندات والإصدارات', mock: 'documents' },
  { tag: { kind: 'output', name: 'المخرَج' }, title: 'السجل الموثّق', mock: 'stamped-sheet' },
];
