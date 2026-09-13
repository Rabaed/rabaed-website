/**
 * The product page's «داخل كل جهة» section: each party's internal review and
 * approval cycle, which the other two never see, and what crosses to them once
 * it is done.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */

export type Organisation = {
  readonly party: string;
  /** What the party does before anything leaves it. */
  readonly note: string;
  /** Who reviews inside the party, in order; the last one decides. */
  readonly reviewers: readonly string[];
  /** What crosses to the other parties, officially. */
  readonly crosses: string;
};

export const INNER_EYEBROW = 'داخل كل جهة';
export const INNER_HEADING = 'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟';
export const INNER_LEAD =
  'لكل جهة دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً. هذه الدورة لا يراها الطرفان الآخران إطلاقاً — لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر هو المعاملة الرسمية وحدها.';

/** In the order the Record travels: from the Contractor, through the Consultant, to the Owner. */
export const ORGANISATIONS: readonly Organisation[] = [
  {
    party: 'المقاول',
    note: 'يجهّز الطلب قبل أن يرسله.',
    reviewers: ['مهندس الموقع', 'المكتب الفني', 'مدير المشروع'],
    crosses: 'طلب تسليم أعمال · اعتماد مادة · خطاب — بتاريخه ومن أرسله.',
  },
  {
    party: 'الاستشاري',
    note: 'يراجع ويقرر قبل أن يرد.',
    reviewers: ['مهندس التخصص', 'مدير المراقبة', 'مدير المشروع'],
    crosses: 'اعتماد أو رفض بملاحظات · عدم مطابقة · تعليمات موقع.',
  },
  {
    party: 'المالك / المطوّر',
    note: 'يدرس أثر القرار قبل أن يعتمد.',
    reviewers: ['مدير المشروع', 'إدارة العقود', 'صاحب القرار'],
    crosses: 'موافقة · رد على خطاب · اعتماد مستخلص.',
  },
];
