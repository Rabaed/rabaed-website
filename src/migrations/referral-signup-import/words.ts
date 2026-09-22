/**
 * The Referral Program signup form's words, as the form was built with them
 * (ticket 28): the words `20260914_222809_publish_referral_signup_wording`
 * publishes as the form's first version.
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site does not
 * read this file: it reads the CMS, where Editors change them from here on.
 * Changing a word here changes nothing anyone sees.
 *
 * Lifted out of the migration verbatim by ticket 68, so that the words stay
 * readable beside the SQL that now writes them (`seed.ts`), and so that the
 * data-migrations test can hold the one to the other.
 */

const TOO_LARGE = 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر';
const WRONG_TYPE = 'ارفع ملف PDF أو صورة PNG أو JPG';

export const REFERRAL_SIGNUP_WORDS = {
  heading: 'سجّل في برنامج الإحالة',
  lead: 'البيانات والمستندات تُستخدم لإصدار كودك وتحويل مستحقاتك فقط.',
  submit: 'سجّل في برنامج الإحالة',
  finePrint: 'تُحفظ مستنداتك في مساحة خاصة لا يصل إليها إلا فريق ربائد، ولا تُستخدم إلا لإصدار كودك وتحويل مستحقاتك.',
  fields: {
    name: { label: 'الاسم الكامل', placeholder: 'الاسم الكامل *', message: 'اكتب اسمك الكامل (حرفان على الأقل)' },
    phone: { label: 'رقم الجوال', placeholder: 'رقم الجوال *', message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)' },
    email: { label: 'البريد الإلكتروني', placeholder: 'البريد الإلكتروني *', message: 'اكتب بريداً إلكترونياً صحيحاً' },
    city: { label: 'المدينة', placeholder: 'المدينة *', message: 'اكتب اسم مدينتك' },
    profession: {
      label: 'الصفة المهنية',
      placeholder: 'الصفة المهنية *',
      message: 'اختر صفتك المهنية',
      options: {
        option_engineer: 'مهندس',
        option_project_manager: 'مدير مشروع',
        option_independent_consultant: 'استشاري مستقل',
        option_contractor: 'مقاول',
        option_real_estate_advisor: 'مستشار تطوير عقاري',
        option_content_creator: 'صانع محتوى',
        option_other: 'أخرى',
      },
    },
    employer: { label: 'جهة العمل', placeholder: 'جهة العمل (اختياري)', message: 'اسم جهة العمل أطول من اللازم' },
    ibanCertificate: {
      label: 'شهادة الآيبان',
      placeholder: 'PDF أو صورة',
      message: 'أرفق شهادة الآيبان',
      tooLarge: TOO_LARGE,
      wrongType: WRONG_TYPE,
    },
    accountHolder: {
      label: 'اسم صاحب الحساب البنكي',
      placeholder: 'اسم صاحب الحساب البنكي *',
      message: 'اكتب اسم صاحب الحساب كما في شهادة الآيبان',
    },
    commercialRegistration: {
      label: 'السجل التجاري',
      placeholder: 'اختياري · PDF أو صورة',
      message: 'أرفق السجل التجاري',
      tooLarge: TOO_LARGE,
      wrongType: WRONG_TYPE,
    },
    taxRegistrationCertificate: {
      label: 'شهادة التسجيل الضريبي',
      placeholder: 'اختياري · PDF أو صورة',
      message: 'أرفق شهادة التسجيل الضريبي',
      tooLarge: TOO_LARGE,
      wrongType: WRONG_TYPE,
    },
    acceptTerms: { label: 'الموافقة على الشروط والأحكام', message: 'يلزم الموافقة على الشروط والأحكام وسياسة الخصوصية' },
    declareNoConflict: { label: 'إقرار عدم التعارض', message: 'يلزم الإقرار بعدم التعارض' },
  },
  received: 'وصلنا تسجيلك — سنراجع بياناتك ومستنداتك ونتواصل معك لإصدار كودك.',
  refused: 'تعذّر استلام تسجيلك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
  failed: 'لم يُحفظ تسجيلك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
  confirmationSubject: 'ربائد — وصلنا تسجيلك في برنامج الإحالة',
  confirmationBody: [
    'مرحباً {الاسم}،',
    '',
    'وصلنا تسجيلك في برنامج الإحالة. سيراجع فريقنا بياناتك ومستنداتك، ونتواصل معك لإصدار كودك.',
    '',
    'فريق ربائد',
  ].join('\n'),
};
