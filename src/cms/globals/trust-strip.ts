import { addressField, listField, logoField, sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The marks of the companies already working on Rabaed (ticket 20), one list
 * for the three pages that carry the strip — home, product and start — as the
 * spec's Content model has it. Each of those pages keeps its own switch for
 * whether the strip shows there; the marks themselves are here.
 *
 * Permission to show them is cleared by the founders, covered by the existing
 * contracts (spec: Further Notes).
 *
 * A mark sits in a rail of fixed height, so the list may be any length: the
 * bar travels rather than wrapping onto another line, which is why a client
 * signed next year costs nothing but this entry.
 */
export const TrustStripLogos = pageGlobal({
  slug: 'trust-strip',
  label: { ar: 'شريط الثقة', en: 'Trust strip' },
  path: '/',
  group: null,
  sections: [
    sectionTab({
      name: 'strip',
      label: { ar: 'الشعارات', en: 'Logos' },
      hideable: false,
      description: {
        ar: 'تظهر في الصفحة الرئيسية وصفحة المنتج وصفحة ابدأ. إظهار الشريط في صفحة بعينها يُختار في تلك الصفحة.',
        en: 'Shown on the home, product and start pages. Whether the strip shows on a given page is chosen on that page.',
      },
      fields: [
        wordsField('caption', { ar: 'السطر بجانب الشعارات', en: 'Line beside the marks' }, 40),
        wordsField('sectionName', { ar: 'اسم القسم لقارئات الشاشة', en: 'Section name for screen readers' }, 40, {
          description: {
            ar: 'لا يظهر على الشاشة؛ تقرأه برامج قراءة الشاشة لتسمية هذا القسم.',
            en: 'Not drawn on the page; a screen reader announces it to name this section.',
          },
        }),
        listField({
          name: 'logos',
          labels: {
            singular: { ar: 'شعار', en: 'Logo' },
            plural: { ar: 'الشعارات', en: 'Logos' },
          },
          // At least one: a strip of no marks is a bar with a caption and
          // nothing beside it. No upper limit — the bar travels, and the
          // whole point of this entry is that the list grows.
          rows: { min: 1, max: 40 },
          description: {
            ar: 'بالترتيب الذي تمر به. اسحبها لإعادة الترتيب.',
            en: 'In the order they travel past. Drag them to reorder.',
          },
          fields: [
            {
              name: 'shows',
              type: 'checkbox',
              defaultValue: true,
              label: { ar: 'يظهر في الشريط', en: 'Shows in the strip' },
              admin: {
                description: {
                  ar: 'ألغِ التحديد لإخفاء هذا الشعار مع بقائه في القائمة — لعميل انتهى عقده مثلاً.',
                  en: 'Untick to hide this mark while keeping it in the list — for a client whose contract has ended.',
                },
              },
            },
            wordsField('name', { ar: 'اسم الجهة', en: 'Company name' }, 40, {
              description: {
                ar: 'يقرأه من لا تظهر له الصورة، وتقرأه برامج قراءة الشاشة. يظهر مكان الشعار إذا تعذّر تحميله.',
                en: 'Read by anyone the image does not reach, and by a screen reader. It stands in the mark’s place if the file fails to load.',
              },
            }),
            logoField('mark'),
            {
              name: 'height',
              type: 'number',
              required: true,
              min: 16,
              max: 44,
              defaultValue: 32,
              label: { ar: 'ارتفاع الشعار (بكسل)', en: 'Drawn height (pixels)' },
              admin: {
                description: {
                  ar: 'بين ١٦ و٤٤. الشعار العريض يحتاج ارتفاعاً أقل ليبدو بوزن جيرانه؛ الشعار المربّع يحتاج أكثر. ٤٤ هو ارتفاع الشريط. الشعار الذي يزيد عرضه على نحو أربعة أضعاف ارتفاعه يُضبط على عرض ١١٨ بكسل، فيُرسم أقصر من الرقم المكتوب هنا.',
                  en: 'Between 16 and 44. A wide wordmark needs a smaller height to look the same weight as its neighbours; a compact mark needs more. 44 is the height of the bar itself. A mark more than about four times as wide as it is tall is held to 118 pixels wide, and so draws shorter than the number written here.',
                },
              },
            },
            addressField('link', { ar: 'وجهة الرابط', en: 'Goes to' }, {
              optional: true,
              description: {
                ar: 'اتركه فارغاً ليكون الشعار صورة لا رابطاً. موقع الجهة عادةً.',
                en: 'Leave empty for a mark that is a picture rather than a link. The company’s own site, usually.',
              },
            }),
          ],
        }),
      ],
    }),
  ],
});
