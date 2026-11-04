import { sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The Delay-cost calculator's words (ticket 103, ADR-0029): one set, kept
 * here once, for every page that shows the calculator — the home page and the
 * Company profile (ticket 106) — so the two cannot disagree. Each of
 * those pages keeps its own switch for whether the calculator shows there.
 *
 * The method and what each slider allows stay in code (`src/lib/delay-cost.ts`).
 * Where the button leads is the home page's code, and the Company profile's
 * entry, which may give the button words of its own too, as every button on
 * that page may be given. Here an Editor changes the words alone.
 *
 * Limits are what the calculator's card carries with every word at its
 * longest, as the home page's calculator words were before they moved here.
 */
export const DelayCalculator = pageGlobal({
  slug: 'delay-calculator',
  label: { ar: 'حاسبة تكلفة التأخير', en: 'Delay-cost calculator' },
  path: '/',
  group: null,
  sections: [
    sectionTab({
      name: 'calculator',
      label: { ar: 'الحاسبة', en: 'Calculator' },
      hideable: false,
      description: {
        ar: 'تظهر في الصفحة الرئيسية وفي الملف التعريفي بهذه الكلمات. إظهار الحاسبة في صفحة بعينها يُختار في تلك الصفحة، وكذلك زرّها في الملف التعريفي. طريقة الحساب وما يسمح به كل مؤشر في الكود.',
        en: 'Shown on the home page and the Company profile in these words. Whether the calculator shows on a given page is chosen on that page, and so is its button on the Company profile. The method, and what each slider allows, are in code.',
      },
      fields: [
        wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40),
        wordsField('heading', { ar: 'العنوان', en: 'Heading' }, 60),
        wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 200, { multiline: true }),
        {
          name: 'sliderLabels',
          type: 'group',
          label: { ar: 'أسماء المؤشرات الثلاثة', en: 'The three sliders’ names' },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('projectValue', { ar: 'قيمة المشروع', en: 'Project value' }, 20),
                wordsField('delayDays', { ar: 'أيام التأخير', en: 'Days of delay' }, 20),
                wordsField('progress', { ar: 'نسبة الإنجاز', en: 'Progress' }, 20, {
                  description: { ar: 'تُكتب النسبة بعده: «50%».', en: 'The percentage is written after it: “50%”.' },
                }),
              ],
            },
          ],
        },
        wordsField('resultLabel', { ar: 'العنوان فوق التكلفة', en: 'Label over the cost' }, 40),
        wordsField('spent', { ar: 'السطر تحت التكلفة', en: 'Line under the cost' }, 50, {
          description: {
            ar: 'ما صُرف حتى الآن. اكتب {amount} حيث يُكتب المبلغ: «على {amount} ر.س مصروفة حتى الآن».',
            en: 'What has been spent so far. Write {amount} where the amount goes: “on {amount} SAR spent so far”.',
          },
        }),
        wordsField('assumptions', { ar: 'الافتراضات تحت التكلفة', en: 'Assumptions under the cost' }, 240, { multiline: true }),
        wordsField('callToActionLabel', { ar: 'الزر', en: 'Button' }, 40, {
          description: {
            ar: 'ينقل إلى نموذج طلب العرض. في الملف التعريفي تختار صفحته وجهته، ولها أن تعطيه كلمات غير هذه.',
            en: 'Leads to the demo request form. On the Company profile its page says where it goes, and may give it words other than these.',
          },
        }),
        wordsField('currency', { ar: 'العملة بعد المبلغ', en: 'Currency after an amount' }, 8),
        {
          name: 'days',
          type: 'group',
          label: { ar: 'الكلمة بعد عدد الأيام', en: 'Word after a number of days' },
          admin: {
            description: {
              ar: 'كما يعدّ العربي: بعد 1، وبعد 2، ومن 3 إلى 10، ومن 11 فأكثر.',
              en: 'As Arabic counts: after 1, after 2, from 3 to 10, and from 11 on.',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                wordsField('one', { ar: 'بعد 1', en: 'After 1' }, 10),
                wordsField('two', { ar: 'بعد 2', en: 'After 2' }, 10),
                wordsField('few', { ar: 'من 3 إلى 10', en: '3 to 10' }, 10),
                wordsField('many', { ar: 'من 11 فأكثر', en: '11 or more' }, 10),
              ],
            },
          ],
        },
      ],
    }),
  ],
});
