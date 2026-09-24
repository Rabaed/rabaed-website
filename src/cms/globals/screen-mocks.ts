import type { Field } from 'payload';
import { phoneCropExportSize, SCREEN_MOCKS, type ScreenMock } from '../../screen-mocks/registry';
import { pictureField, sectionTab, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';
import { screenMockFieldName } from '../screen-mock-fields';

/**
 * Which Screen mock a page's panel, party or tab shows — its picture and words
 * are in this entry, once for every page. The product and home pages both
 * choose screens with it.
 */
export const screenField: Field = {
  name: 'screen',
  type: 'select',
  required: true,
  options: SCREEN_MOCKS.map((mock) => ({ value: mock.id, label: mock.title })),
  label: { ar: 'الشاشة', en: 'Screen' },
  admin: {
    description: {
      ar: 'صورتها ووصفها في «شاشات المنصة».',
      en: 'Its picture and description are under Screen mocks.',
    },
  },
};

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
 * A Phone crop an Editor uploads beside a replacement picture, for the same
 * language's pages (ticket 79): the crop's shape, at the size the export makes
 * one or larger, so it is as sharp as the crop it stands in for. Its help says
 * what a Phone crop is, for an Editor who has never heard the name.
 */
function phoneCropField(mock: ScreenMock, name: string, label: Words): Field {
  const size = phoneCropExportSize(mock);
  return pictureField({
    name,
    label,
    size,
    required: false,
    description: {
      ar: `على الهاتف تصغر الشاشة كاملة فلا تُقرأ، فتظهر مكانها صورة مقرّبة لجزء منها، ومن يضغط عليها يرى الشاشة كاملة. إن استبدلت صورة الشاشة فارفع هنا صورة مقرّبة من الصورة الجديدة، بمقاس ${size.width}×${size.height} أو أكبر بالنسبة نفسها. بلا صورة مقرّبة تظهر الصورة البديلة كاملة على الهاتف، ويسحبها الزائر بإصبعه ليرى بقيتها. وإن غيّرت صورة الشاشة أو حذفتها فغيّر صورتها المقرّبة أو احذفها معها.`,
      en: `On a phone the whole screen is too small to read, so a close-up of part of it shows in its place, and tapping it shows the whole screen. If you replace the screen's picture, upload a close-up of the new one here, ${size.width}×${size.height} or larger in the same proportions. Without one, phones show the replacement picture whole, for visitors to swipe across. If you change or remove the screen's picture, change or remove its close-up with it.`,
    },
  });
}

/**
 * The Screen mocks as the site shows them (ticket 57): for each, a picture that
 * replaces its exported image, and what it shows in words — the picture's
 * description for screen readers and the caption under it, both at once
 * (ADR-0002). One entry for every page, so a mock the home and product pages
 * both show is replaced once for both.
 *
 * **A replacement per language (ticket 41).** A screen's words are in its
 * picture, so a picture belongs to one language as its description does: the
 * Arabic pages show one replacement and the English pages another, and each
 * language falls back to its own export. A single shared one would put an
 * Arabic screenshot on the English pages under an English caption.
 *
 * With no picture chosen, the page shows the image exported from the studio.
 * What a mock depicts is still a developer's to change, through the studio and
 * `npm run mocks:export`; a replacement keeps the studio's 1440×900 shape
 * (spec: Screen mocks).
 *
 * **A Phone crop beside each replacement (ticket 79).** On a phone a Screen
 * mock is its Phone crop (ADR-0022), which the export cuts from the screen it
 * exports. A replaced screen needs a crop of its own, and the Editor who
 * replaces it can upload one beside it, per language as the picture is. With
 * none, a phone shows the replacement whole, to swipe, and never the exported
 * crop of the screen it replaced (`screen-mock-picture.tsx`).
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
          label: { ar: 'صورة بديلة للصفحات العربية', en: 'Replacement picture, Arabic pages' },
          size: { width: mock.width, height: mock.height },
          required: false,
          description: {
            ar: `بمقاس ${mock.width}×${mock.height} أو أكبر بالنسبة نفسها. احذفها لتعود الصورة المصدَّرة.`,
            en: `${mock.width}×${mock.height}, or larger in the same proportions. Remove it to bring back the exported image.`,
          },
        }),
        phoneCropField(mock, 'phoneCrop', {
          ar: 'الصورة المقرّبة للهاتف، للصفحات العربية',
          en: 'Phone crop, Arabic pages',
        }),
        pictureField({
          name: 'englishPicture',
          label: { ar: 'صورة بديلة للصفحات الإنجليزية', en: 'Replacement picture, English pages' },
          size: { width: mock.width, height: mock.height },
          required: false,
          description: {
            ar: `بواجهة إنجليزية، بمقاس ${mock.width}×${mock.height} أو أكبر بالنسبة نفسها. احذفها لتعود الصورة المصدَّرة بالإنجليزية.`,
            en: `With an English interface, ${mock.width}×${mock.height} or larger in the same proportions. Remove it to bring back the English exported image.`,
          },
        }),
        phoneCropField(mock, 'englishPhoneCrop', {
          ar: 'الصورة المقرّبة للهاتف، للصفحات الإنجليزية',
          en: 'Phone crop, English pages',
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
