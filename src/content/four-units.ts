/**
 * The home page's «أربع وحدات» section: a tab for each of Rabaed's four units,
 * and a fifth for the Record they produce, each with the Screen mock that shows
 * it.
 *
 * `description` says what the screen shows. It is the image's `alt` and the
 * visible caption under it, both at once, because ADR-0002 asks for exactly
 * that: a mock's text is invisible to search engines, AI crawlers and screen
 * readers, so the claim it makes has to be made again in real text.
 *
 * **The descriptions come from the Reference site's product page, verbatim.**
 * The home page's own Reference markup only names each screen — «شاشة المراسلات
 * الرسمية في ربائد» — which says which screen it is and nothing about what it
 * shows. The product page describes the same five screens, which are
 * byte-identical images (ticket 05), in full: what is on them. Using those
 * makes a real claim without inventing one, and both pages read them from
 * `src/content/screen-mock-descriptions.ts` (ticket 12).
 *
 * `mock` names an entry in `src/screen-mocks/registry.ts`, whose exported image
 * is what the tab shows.
 *
 * Ticket 21 moves page copy into the CMS.
 */

import { SCREEN_MOCK_DESCRIPTIONS } from '@/content/screen-mock-descriptions';

export type UnitTab = {
  /** The small line above the title: a unit's number, or the name of what the units produce. */
  readonly tag: { readonly kind: 'unit'; readonly number: string } | { readonly kind: 'output'; readonly name: string };
  readonly title: string;
  /** The Screen mock's id in the registry. */
  readonly mock: string;
  /** What the screen shows: the image's `alt`, and its caption. */
  readonly description: string;
};

export const FOUR_UNITS_HEADING = 'أربع وحدات. سجل واحد يجمعها.';

export const UNIT_TABS: readonly UnitTab[] = [
  {
    tag: { kind: 'unit', number: '01' },
    title: 'المراسلات الرسمية',
    mock: 'correspondence',
    description: SCREEN_MOCK_DESCRIPTIONS.correspondence,
  },
  {
    tag: { kind: 'unit', number: '02' },
    title: 'الاعتمادات والطلبات',
    mock: 'kanban',
    description: SCREEN_MOCK_DESCRIPTIONS.kanban,
  },
  {
    tag: { kind: 'unit', number: '03' },
    title: 'التقرير اليومي للموقع',
    mock: 'daily-report',
    description: SCREEN_MOCK_DESCRIPTIONS['daily-report'],
  },
  {
    tag: { kind: 'unit', number: '04' },
    title: 'المستندات والإصدارات',
    mock: 'documents',
    description: SCREEN_MOCK_DESCRIPTIONS.documents,
  },
  {
    tag: { kind: 'output', name: 'المخرَج' },
    title: 'السجل الموثّق',
    mock: 'stamped-sheet',
    description: SCREEN_MOCK_DESCRIPTIONS['stamped-sheet'],
  },
];
