/**
 * The home page's before-and-after comparison: four moments in one material
 * approval, each told the usual way and Rabaed's way. All copy verbatim from
 * `reference/site/index.html`.
 *
 * A face's words are pieces, so the Reference site's emphasis and line breaks
 * are kept without writing markup into the copy.
 *
 * Ticket 21 moves page copy into the CMS.
 */

/** A run of words, a phrase in bold, or a line break. */
export type Words = readonly (string | { readonly bold: string } | 'line-break')[];

export type Face = {
  /** The small label in the card's corner: where this step happens. */
  readonly channel: string;
  readonly words: Words;
};

export type ComparisonStep = {
  readonly name: string;
  readonly usual: Face;
  readonly rabaed: Face;
};

export const BEFORE_AFTER_COPY = {
  eyebrow: 'قبل وبعد ربائد',
  heading: 'نفس الاعتماد… بطريقتين.',
  lead: ['أربع لحظات في اعتماد مادة واحد. ', { bold: 'اسحب المقبض' }, ' ليمرّ على الخطوات — كل خطوة تتحول أمامك من الطريقة المعتادة إلى ربائد.'] satisfies Words,
  usualTag: 'الطريقة المعتادة',
  rabaedTag: 'مع ربائد',
  handleLabel: 'اسحب للمقارنة بين الطريقتين',
  verdicts: {
    usual: 'النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.',
    rabaed: 'النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.',
    between: 'اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.',
  },
} as const;

export const COMPARISON_STEPS: readonly ComparisonStep[] = [
  {
    name: 'الطلب',
    usual: { channel: 'ورق', words: ['يُطبع، يُوقَّع باليد، ويُصوَّر بالجوال.'] },
    rabaed: { channel: 'ربائد', words: ['طلب اعتماد ', { bold: 'SUB-031' }, ' برقم مرجعي ومرفقاته.'] },
  },
  {
    name: 'الاستلام',
    usual: { channel: 'واتساب', words: ['"أرسله إيميل رسمي" — الطلب يصير محادثة.'] },
    rabaed: { channel: 'تلقائي', words: ['إشعار استلام ', { bold: 'بالاسم والوقت' }, ' — لا أحد ينكره.'] },
  },
  {
    name: 'الاعتماد',
    usual: { channel: 'إيميل', words: ['رد بعد أسبوع… في ثريد آخر لا أحد يجده.'] },
    rabaed: { channel: 'موثّق', words: ['اعتماد بملاحظات، ', { bold: 'والمالك يرى الحالة لحظياً' }, '.'] },
  },
  {
    name: 'بعد شهرين',
    usual: { channel: 'إكسل', words: ['"ما وصلتني الموافقة."', 'line-break', 'الدليل: لقطة شاشة واتساب.'] },
    rabaed: { channel: 'السجل', words: ['يُفتح المستند: أُرسل، استُلم، دُقق، اعتُمد.', 'line-break', { bold: 'الدليل: السجل نفسه.' }] },
  },
];
