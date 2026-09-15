/**
 * The referral page's words as the site carried them before the CMS (tickets
 * 15 and 52), in the shape of its entry, and the Referral Program values the
 * site launched with, as they become their first published versions in the CMS
 * (ticket 56).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads this file: the referral page's words and the values are edited and
 * published in the CMS. Changing anything here changes nothing anyone sees.
 *
 * **Verbatim from `reference/site/referral.html`**, but for four things the
 * page now does itself: every amount is named, `{payout}` or
 * `{clientDiscount}`, rather than typed (`src/cms/referral-program-values.ts`);
 * each step's and each point's number is its place; the space around a bold
 * phrase, and before the rest of a term after its bold opening unless that
 * rest opens with a comma; and where each button and link leads, which stays
 * in code.
 */

/** A word in Arabic alone: the English is written when the page is translated (ticket 42). */
const ar = (text: string) => ({ ar: text });
/** No words, in either language: a sentence with no bold phrase, or nothing after it. */
const none = { ar: '' };

export const REFERRAL_PROGRAM_AMOUNTS = { payoutRiyals: 2000, clientDiscountPercent: 10 } as const;

export const REFERRAL_PAGE_WORDS = {
  hero: {
    eyebrow: ar('برنامج الإحالة'),
    title: ar('أحِل مشروعاً واحداً. اكسب {payout} ريال.'),
    lead: ar(
      'تعرف مطوّراً يدير مشروعه على الإيميل والواتساب؟ شارك كودك، واحصل على {payout} ريال عن كل مشروع يبدأ معنا — ويحصل هو على خصم على اشتراكه.',
    ),
    primaryLabel: ar('سجّل واحصل على كودك'),
    secondaryLabel: ar('كيف يعمل البرنامج ↓'),
    figures: [
      { figure: ar('{payout} ريال'), label: ar('عن كل مشروع') },
      { figure: ar('{clientDiscount}'), label: ar('خصم لعميلك') },
      { figure: ar('بلا حد'), label: ar('عدد المشاريع') },
    ],
  },
  howItWorks: {
    eyebrow: ar('كيف يعمل'),
    heading: ar('أربع خطوات، وينتهي دورك بعد الثانية'),
    steps: [
      {
        label: ar('سجّل'),
        title: ar('دقيقة واحدة'),
        text: ar('املأ نموذجاً من دقيقة واحدة، ويصلك كودك الخاص فوراً على جوالك وبريدك.'),
        markedOut: false,
      },
      {
        label: ar('شارك الكود'),
        title: ar('مع صاحب القرار'),
        text: ar('الكود يمنحه خصم {clientDiscount} على اشتراك مشروعه — فهو سبب حقيقي ليستخدمه، لا مجرد معرّف لك.'),
        markedOut: false,
      },
      {
        label: ar('نتولّى الباقي'),
        title: ar('لا متابعة ولا بيع'),
        text: ar('يطلب العرض التوضيحي ويُدخل الكود. فريقنا يتواصل معه، ويعرض المنصة، ويتفق على التفاصيل.'),
        markedOut: false,
      },
      {
        label: ar('استلم مستحقاتك'),
        title: ar('خلال 7 أيام عمل'),
        text: ar('عند تحصيل قيمة الاشتراك، تُحوَّل {payout} ريال على حسابك خلال 7 أيام عمل من نهاية ذلك الشهر.'),
        markedOut: true,
      },
    ],
  },
  offer: {
    shows: true,
    eyebrow: ar('المبلغ والخصم'),
    heading: ar('مبلغ ثابت. بلا شرائح، بلا حسابات.'),
    paragraphs: [
      {
        text: ar('اخترنا مبلغاً ثابتاً معلوماً بدل النسب المتغيّرة:'),
        bold: ar('{payout} ريال صافية عن كل مشروع'),
        after: ar(
          'يبدأ اشتراكه بكودك — سواء كان مشروعاً من عشرة آلاف متر أو ثلاثين ألفاً. تعرف ما ستستلمه قبل أن تُحيل، ولا تحتاج أن تسأل عن قيمة الاشتراك.',
        ),
      },
      { text: ar('ولا يوجد حد أقصى لعدد المشاريع التي تُحيلها في السنة.'), bold: none, after: none },
    ],
    sides: [
      { badge: ar('لك'), title: ar('{payout} ريال صافية'), text: ar('عن كل مشروع، تُحوَّل على حسابك البنكي مباشرة.') },
      { badge: ar('لعميلك'), title: ar('خصم {clientDiscount}'), text: ar('على اشتراك المشروع، بمجرّد استخدام كودك.') },
    ],
  },
  audience: {
    shows: true,
    eyebrow: ar('لمن هذا البرنامج'),
    heading: ar('إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا'),
    lead: ar('البرنامج مفتوح لكل من يعمل في محيط مشاريع التطوير العقاري في السعودية:'),
    kinds: [
      { title: ar('مهندسون ومديرو مشاريع'), text: ar('تعرف من قرب كيف تضيع المراسلات والاعتمادات.') },
      { title: ar('استشاريون مستقلون'), text: ar('تنتقل بين مشاريع ومطوّرين مختلفين.') },
      { title: ar('مقاولون ومكاتب تنفيذ'), text: ar('تعمل مع أكثر من مالك في وقت واحد.') },
      { title: ar('مستشارو تطوير عقاري ووسطاء'), text: ar('علاقتك بالمطوّرين هي أصلك الحقيقي.') },
      { title: ar('صنّاع محتوى متخصصون'), text: ar('جمهورك من أهل القطاع.') },
    ],
    partnership: {
      text: ar('إن كنت'),
      bold: ar('مكتباً هندسياً أو شركة إدارة مشاريع'),
      after: ar('وتريد ترتيباً أوسع من الإحالة الفردية، فبرنامج الشراكات هو الأنسب لك.'),
      linkLabel: ar('انتقل إلى برنامج الشراكات ←'),
    },
  },
  whatIsReferred: {
    shows: true,
    eyebrow: ar('ما الذي تُحيله'),
    heading: ar('ما الذي تُحيله بالضبط؟'),
    paragraphs: [
      {
        text: ar(
          'ربائد منصّة تجمع المالك والاستشاري والمقاول على سجل واحد للمشروع: المراسلات الرسمية ومحاضر الاجتماعات وطلبات المعلومات، والاعتمادات وطلبات الفحص والتفتيش، والتقرير اليومي للموقع، ومستودع مستندات بأحدث نسخة معتمدة.',
        ),
      },
      {
        text: ar(
          'كل مستند يحمل معه متى أُرسل، ومن اعتمده، وبأي ملاحظة، ومتى — فيبقى سجل المشروع كاملاً بعد تسليمه، لا مبعثراً بين بريد وواتساب ومجلدات مشتركة انتهت صلاحيتها.',
        ),
      },
    ],
    linkLabel: ar('تعرّف على المنصة'),
  },
  termsSummary: {
    shows: true,
    eyebrow: ar('الشروط باختصار'),
    heading: ar('الشروط في ثماني نقاط'),
    points: [
      { bold: ar('الإحالة بالمشروع لا بالعميل.'), rest: ar('تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.') },
      { bold: ar('يُقدَّم الكود عند طلب العرض التوضيحي'), rest: ar('، أي قبل بدء التفاوض — لا عند التوقيع.') },
      { bold: ar('لا يُقبل الكود لعميل قائم'), rest: ar('أو لمشروع سبق أن تواصلنا بشأنه مع المالك.') },
      { bold: ar('الاشتراك السنوي المدفوع مقدماً'), rest: ar('هو ما يُحتسب عليه المبلغ.') },
      { bold: ar('الاستحقاق عند تحصيل قيمة الاشتراك'), rest: ar('، لا عند التوقيع.') },
      { bold: ar('الصرف خلال 7 أيام عمل'), rest: ar('من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.') },
      { bold: ar('الإلغاء والاسترداد'), rest: ar('خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.') },
      { bold: ar('إقرار عدم التعارض'), rest: ar('يُوقَّع إلكترونياً عند التسجيل.') },
    ],
    linkLabel: ar('الشروط والأحكام الكاملة'),
  },
  questions: {
    shows: true,
    eyebrow: ar('الأسئلة الشائعة'),
    heading: ar('قبل أن تسجّل'),
  },
  signup: {
    eyebrow: ar('التسجيل'),
    heading: ar('كودك جاهز خلال دقيقة'),
    lead: ar('سجّل الآن، وشارك الكود مع أول مطوّر يخطر ببالك.'),
    benefits: [
      { text: ar('يصلك الكود فوراً على جوالك وبريدك') },
      { text: ar('لا رسوم انضمام، ولا التزام بعدد إحالات') },
      { text: ar('دورك ينتهي عند مشاركة الكود') },
      { text: ar('{payout} ريال صافية عن كل مشروع، بلا حد أقصى') },
    ],
    guarantee: { figure: ar('7 أيام عمل'), text: ar('مدة الصرف من نهاية شهر الاستحقاق') },
  },
};
