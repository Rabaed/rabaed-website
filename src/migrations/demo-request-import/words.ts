/**
 * The demo request form's words, as the form was built with them (ticket 27):
 * the words `20260914_194144_publish_demo_request_wording` publishes as the
 * form's first version.
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

export const DEMO_REQUEST_WORDS = {
  heading: 'احجز عرضاً حياً على مشروعك',
  lead: '30 دقيقة · بالعربية · على مشروع من مشاريعك',
  submit: 'احجز عرضاً حياً',
  finePrint: 'نستخدم بياناتك لتحديد موعد العرض فقط، ولا نشاركها مع أي طرف ثالث.',
  fields: {
    name: { label: 'الاسم الكامل', placeholder: 'الاسم الكامل', message: 'اكتب اسمك الكامل (حرفان على الأقل)' },
    email: { label: 'البريد الإلكتروني', placeholder: 'البريد الإلكتروني', message: 'اكتب بريداً إلكترونياً صحيحاً' },
    role: {
      label: 'دورك في المشروع',
      placeholder: 'دورك في المشروع',
      message: 'اختر دورك في المشروع',
      options: { option_owner: 'مالك / مطوّر', option_consultant: 'استشاري', option_contractor: 'مقاول' },
    },
    phone: { label: 'رقم الجوال', placeholder: 'رقم الجوال', message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)' },
    company: { label: 'اسم الشركة', placeholder: 'اسم الشركة', message: 'اسم الشركة أطول من اللازم' },
    activeProjects: {
      label: 'عدد المشاريع النشطة',
      placeholder: 'عدد المشاريع النشطة',
      message: 'اكتب عدد المشاريع أرقاماً فقط',
    },
  },
  received: 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.',
  refused: 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
  failed: 'لم يُحفظ طلبك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
  confirmationSubject: 'ربائد — وصلنا طلبك للعرض الحي',
  confirmationBody: [
    'مرحباً {الاسم}،',
    '',
    'وصلنا طلبك لعرض حي لمنصة ربائد على مشروع من مشاريعك. سيتواصل معك فريقنا خلال يوم عمل لتحديد الموعد.',
    '',
    'العرض 30 دقيقة، بالعربية.',
    '',
    'فريق ربائد',
  ].join('\n'),
};
