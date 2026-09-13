import type { ProductInnerCycleContent } from '@/components/product/inner-cycle';

/**
 * The product page's «داخل كل جهة» section: each party's internal review and
 * approval cycle, which the other two never see, and what crosses to them once
 * it is done.
 *
 * All copy is verbatim from `reference/site/product.html`. Ticket 21 moves it
 * into the CMS.
 */
export const INNER_CYCLE: { readonly ar: ProductInnerCycleContent } = {
  ar: {
    eyebrow: 'داخل كل جهة',
    heading: 'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟',
    lead: 'لكل جهة دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً. هذه الدورة لا يراها الطرفان الآخران إطلاقاً — لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر هو المعاملة الرسمية وحدها.',
    cycles: [
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
    ],
    privateTag: 'دورة داخلية · محجوبة',
    reviewAgain: 'إعادة ومراجعة داخلية — بلا حد، وبلا أثر خارج الجهة',
    crossesLabel: 'ما يعبر رسمياً',
    staysInside: {
      label: 'ما يبقى داخل جهتك',
      // The space is a part of its own, not the end of the sentence, only so
      // the page's markup stays exactly what it was.
      text: [
        'المسودات، الملاحظات الداخلية، الاعتراضات، وعدد دورات المراجعة.',
        ' ',
        { strong: 'تعمل بحرية داخل حدودك — ولا يُحسب عليك ما لم تُرسله.' },
      ],
    },
    crossesOut: {
      label: 'ما يعبر إلى الآخرين',
      text: [
        'المعاملة الرسمية فقط، بلحظة إرسالها واسم من أرسلها. ',
        { strong: 'ومن تلك اللحظة تصبح جزءاً من السجل الموثّق.' },
      ],
    },
  },
};
