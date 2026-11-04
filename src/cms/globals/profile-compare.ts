import type { Field, Tab } from 'payload';
import { VIDEO_RULE } from '../collections/profile-files';
import { sectionTab, wordsField, type Words } from '../page-fields';

/**
 * The five comparisons of the Company profile's before-and-after section, in
 * the order of their tabs, which is fixed: each is one of Ahmed's videos
 * (ticket 108). The names are the entry's, and the page's
 * (`src/content/pages/profile-compare.ts`).
 */
export const COMPARISONS = ['approvals', 'documents', 'correspondence', 'dashboard', 'dailyReport'] as const;

export type Comparison = (typeof COMPARISONS)[number];

const LABELS: Readonly<Record<Comparison, Words>> = {
  approvals: { ar: 'المقارنة الأولى: الاعتمادات', en: 'First comparison: Approvals' },
  documents: { ar: 'المقارنة الثانية: المستندات', en: 'Second comparison: Documents' },
  correspondence: { ar: 'المقارنة الثالثة: المراسلات', en: 'Third comparison: Correspondence' },
  dashboard: { ar: 'المقارنة الرابعة: لوحة المتابعة', en: 'Fourth comparison: Dashboard' },
  dailyReport: { ar: 'المقارنة الخامسة: التقرير اليومي', en: 'Fifth comparison: Daily report' },
};

/** One line of a comparison's table: what is compared, then before, then with Rabaed. */
function tableRow(name: string, label: Words): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      wordsField('label', { ar: 'ما يُقارن', en: 'What is compared' }, 50),
      wordsField('before', { ar: 'قبل', en: 'Before' }, 150, { multiline: true }),
      wordsField('after', { ar: 'بعد ربائد', en: 'With Rabaed' }, 150, { multiline: true }),
    ],
  };
}

/** One comparison: its tab, its question, its three-line table, its video and the note under it. */
function comparison(name: Comparison): Field {
  return {
    name,
    type: 'group',
    label: LABELS[name],
    fields: [
      wordsField('module', { ar: 'اسم التبويب', en: 'Tab name' }, 30, {
        description: { ar: 'يظهر على التبويب وفوق السؤال.', en: 'Shown on the tab and above the question.' },
      }),
      wordsField('question', { ar: 'السؤال', en: 'Question' }, 150, { multiline: true }),
      tableRow('firstRow', { ar: 'السطر الأول من الجدول', en: 'Table, first line' }),
      tableRow('secondRow', { ar: 'السطر الثاني من الجدول', en: 'Table, second line' }),
      tableRow('thirdRow', { ar: 'السطر الثالث من الجدول', en: 'Table, third line' }),
      wordsField('note', { ar: 'الملاحظة تحت الفيديو', en: 'Note under the video' }, 180, { multiline: true }),
      {
        name: 'video',
        type: 'upload',
        relationTo: 'profile-files',
        required: false,
        label: { ar: 'الفيديو', en: 'Video' },
        admin: {
          description: {
            ar: `${VIDEO_RULE.ar} اتركه فارغاً ليُعرض فيديو أحمد.`,
            en: `${VIDEO_RULE.en} Leave it empty for Ahmed’s.`,
          },
        },
      },
      {
        name: 'poster',
        type: 'upload',
        relationTo: 'media',
        required: false,
        label: { ar: 'صورة الفيديو قبل تشغيله', en: 'Picture before the video plays' },
        admin: {
          description: {
            ar: 'أول لقطة من الفيديو، بشكله نفسه: تُعرض مكانه حتى يبدأ، ويأخذ الإطار شكلها. ارفعها مع كل فيديو جديد. اتركها فارغة لصورة أحمد.',
            en: 'The video’s first frame, in the same shape: shown in its place until it starts, and the frame takes its shape. Upload one with every new video. Leave it empty for Ahmed’s.',
          },
        },
      },
    ],
  };
}

/**
 * Section 09, «قبل وبعد» (ticket 108): five tabs, each a question, a table of
 * the usual way against Rabaed's, a video and a note. Always shown, because
 * the four Profile PDFs link to `#compare`.
 */
export function compareTab(): Tab {
  return sectionTab({
    name: 'compare',
    label: { ar: 'قبل وبعد', en: 'Before and after' },
    hideable: false,
    description: {
      ar: 'خمس مقارنات، لكل منها تبويب وسؤال وجدول وفيديو. يظهر دائماً: ملفات الـPDF الأربعة تنتقل إلى هذا القسم.',
      en: 'Five comparisons, each with a tab, a question, a table and a video. Always shows: the four Profile PDFs link to this section.',
    },
    fields: [
      wordsField('eyebrow', { ar: 'السطر الصغير فوق العنوان', en: 'Line above the heading' }, 40),
      wordsField('title', { ar: 'العنوان', en: 'Heading' }, 80),
      wordsField('lead', { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' }, 200, { multiline: true }),
      {
        type: 'row',
        fields: [
          wordsField('beforeLabel', { ar: 'عنوان عمود «قبل»', en: '“Before” column' }, 24),
          wordsField('afterLabel', { ar: 'عنوان عمود «بعد»', en: '“After” column' }, 24),
          wordsField('playLabel', { ar: 'زر التشغيل', en: 'Play button' }, 40, {
            description: {
              ar: 'على الفيديو حين لا يبدأ وحده: مع تقليل الحركة أو توفير البيانات أو اتصال بطيء.',
              en: 'On a video that does not start by itself: with reduced motion, Save-Data or a slow connection.',
            },
          }),
        ],
      },
      ...COMPARISONS.map(comparison),
    ],
  });
}
