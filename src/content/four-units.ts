import type { UnitTab } from '@/components/home/four-units';
import type { ScreenMockPictureContent } from '@/components/screen-mock-picture';

/**
 * The tabs of the home page's «أربع وحدات» section: one for each of Rabaed's
 * four units, and a fifth for the Record they produce, each with the Screen
 * mock that shows it.
 *
 * What each screen looks like and shows in words — the picture's `alt` and the
 * visible caption under it, both at once, as ADR-0002 asks — is the CMS's
 * Screen mocks entry (ticket 57), which the product page reads too, so a mock
 * replaced there is replaced on both pages.
 *
 * **Those descriptions came from the Reference site's product page, verbatim.**
 * The home page's own Reference markup only names each screen — «شاشة المراسلات
 * الرسمية في ربائد» — which says which screen it is and nothing about what it
 * shows. The product page describes the same five screens, which are
 * byte-identical images (ticket 05), in full: what is on them. Using those
 * makes a real claim without inventing one.
 *
 * The tabs' own words move into the CMS with the rest of the home page (ticket 58).
 */
export function unitTabs(screenOf: (mock: string) => ScreenMockPictureContent): readonly UnitTab[] {
  const tab = (tag: UnitTab['tag'], title: string, mock: string): UnitTab => ({ tag, title, screen: screenOf(mock) });

  return [
    tab({ kind: 'unit', number: '01' }, 'المراسلات الرسمية', 'correspondence'),
    tab({ kind: 'unit', number: '02' }, 'الاعتمادات والطلبات', 'kanban'),
    tab({ kind: 'unit', number: '03' }, 'التقرير اليومي للموقع', 'daily-report'),
    tab({ kind: 'unit', number: '04' }, 'المستندات والإصدارات', 'documents'),
    tab({ kind: 'output', name: 'المخرَج' }, 'السجل الموثّق', 'stamped-sheet'),
  ];
}
