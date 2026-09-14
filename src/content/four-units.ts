import type { UnitTab } from '@/components/home/four-units';
import { SCREEN_MOCK_DESCRIPTIONS, type DescribedScreenMock } from '@/content/screen-mock-descriptions';

/**
 * The tabs of the home page's «أربع وحدات» section: one for each of Rabaed's
 * four units, and a fifth for the Record they produce, each with the Screen
 * mock that shows it.
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

/** A tab showing `mock`, with that mock's description. */
function tab(tag: UnitTab['tag'], title: string, mock: DescribedScreenMock): UnitTab {
  return { tag, title, mock, description: SCREEN_MOCK_DESCRIPTIONS[mock] };
}

export const UNIT_TABS: readonly UnitTab[] = [
  tab({ kind: 'unit', number: '01' }, 'المراسلات الرسمية', 'correspondence'),
  tab({ kind: 'unit', number: '02' }, 'الاعتمادات والطلبات', 'kanban'),
  tab({ kind: 'unit', number: '03' }, 'التقرير اليومي للموقع', 'daily-report'),
  tab({ kind: 'unit', number: '04' }, 'المستندات والإصدارات', 'documents'),
  tab({ kind: 'output', name: 'المخرَج' }, 'السجل الموثّق', 'stamped-sheet'),
];
