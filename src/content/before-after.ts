/**
 * The four steps of the home page's before-and-after comparison: four moments
 * in one material approval, each told the usual way and Rabaed's way. Verbatim
 * from `reference/site/index.html`.
 *
 * A face's words are pieces, so the Reference site's emphasis and line breaks
 * are kept without writing markup into the copy.
 *
 * Ticket 21 moves page copy into the CMS.
 */
import type { ComparisonStep } from '@/components/home/before-after';

export const COMPARISON_STEPS: readonly ComparisonStep[] = [
  {
    name: 'الطلب',
    usual: { channel: 'ورق', words: 'يُطبع، يُوقَّع باليد، ويُصوَّر بالجوال.' },
    rabaed: { channel: 'ربائد', words: ['طلب اعتماد ', { strong: 'SUB-031' }, ' برقم مرجعي ومرفقاته.'] },
  },
  {
    name: 'الاستلام',
    usual: { channel: 'واتساب', words: '"أرسله إيميل رسمي" — الطلب يصير محادثة.' },
    rabaed: { channel: 'تلقائي', words: ['إشعار استلام ', { strong: 'بالاسم والوقت' }, ' — لا أحد ينكره.'] },
  },
  {
    name: 'الاعتماد',
    usual: { channel: 'إيميل', words: 'رد بعد أسبوع… في ثريد آخر لا أحد يجده.' },
    rabaed: { channel: 'موثّق', words: ['اعتماد بملاحظات، ', { strong: 'والمالك يرى الحالة لحظياً' }, '.'] },
  },
  {
    name: 'بعد شهرين',
    usual: { channel: 'إكسل', words: ['"ما وصلتني الموافقة."', { lineBreak: true }, 'الدليل: لقطة شاشة واتساب.'] },
    rabaed: {
      channel: 'السجل',
      words: ['يُفتح المستند: أُرسل، استُلم، دُقق، اعتُمد.', { lineBreak: true }, { strong: 'الدليل: السجل نفسه.' }],
    },
  },
];
