import { SCREEN_MOCKS } from '../../screen-mocks/registry';
import { pictureField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { screenMockFieldName } from '../screen-mock-fields';

/**
 * Each mock's name in an admin opened in English; the registry names them in
 * Arabic, for the studio. A mock added to the registry without one here stops
 * the CMS from starting, rather than showing an Editor its id.
 */
const ENGLISH_TITLES: Readonly<Record<string, string>> = {
  correspondence: 'Correspondence',
  kanban: 'Approvals board',
  'daily-report': 'Daily site report',
  documents: 'Documents',
  'stamped-sheet': 'Stamped approval sheet',
  overview: 'Owner’s overview',
  'approvals-table': 'Consultant’s approvals table',
  submittal: 'Contractor’s submittal',
};

function englishTitle(mockId: string): string {
  const title = ENGLISH_TITLES[mockId];
  if (!title) throw new Error(`No English name for the Screen mock "${mockId}" in src/cms/globals/screen-mocks.ts`);
  return title;
}

/**
 * The Screen mocks as the site shows them (ticket 57): for each, a picture that
 * replaces its exported image, and what it shows in words — the picture's
 * description for screen readers and the caption under it, both at once
 * (ADR-0002). One entry for every page, so a mock the home and product pages
 * both show is replaced once for both.
 *
 * With no picture chosen, the page shows the image exported from the studio.
 * What a mock depicts is still a developer's to change, through the studio and
 * `npm run mocks:export`; a replacement keeps the studio's 1440×900 shape
 * (spec: Screen mocks).
 */
export const ScreenMocks = pageGlobal({
  slug: 'screen-mocks',
  label: { ar: 'شاشات المنصة', en: 'Screen mocks' },
  path: '/product',
  sections: SCREEN_MOCKS.map((mock) =>
    sectionTab({
      name: screenMockFieldName(mock.id),
      label: { ar: mock.title, en: englishTitle(mock.id) },
      hideable: false,
      description: {
        ar: 'تظهر هذه الشاشة حيث تختارها أقسام الصفحات. بلا صورة مختارة تظهر الصورة المصدَّرة من الاستوديو.',
        en: 'This screen shows wherever a page’s section chooses it. With no picture chosen, the image exported from the studio shows.',
      },
      fields: [
        pictureField({
          name: 'picture',
          label: { ar: 'صورة بديلة', en: 'Replacement picture' },
          size: { width: mock.width, height: mock.height },
          required: false,
          description: {
            ar: `بمقاس ${mock.width}×${mock.height} أو أكبر بالنسبة نفسها. احذفها لتعود الصورة المصدَّرة.`,
            en: `${mock.width}×${mock.height}, or larger in the same proportions. Remove it to bring back the exported image.`,
          },
        }),
        wordsField('description', { ar: 'ما تُظهره الشاشة', en: 'What the screen shows' }, 150, {
          multiline: true,
          description: {
            ar: 'يُقرأ لقارئات الشاشة ويُكتب تحت الصورة. إن استبدلت الصورة فصِف الجديدة.',
            en: 'Read out by screen readers, and written under the picture. If you replace the picture, describe the new one.',
          },
        }),
      ],
    }),
  ),
});
