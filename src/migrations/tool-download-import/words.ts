/**
 * The Pour Tracker download form's words, as the form was built with them
 * (ticket 30): the words `20260921_035306_publish_tool_download_wording`
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

export const TOOL_DOWNLOAD_WORDS = {
  heading: 'بيانات التحميل',
  lead: 'حقل الشركة اختياري. البقية مطلوبة لتفعيل زر التحميل.',
  submit: 'حمّل الأداة الآن',
  finePrint:
    'بالضغط على زر التحميل توافق على أن نتواصل معك بخصوص الأداة وتحديثاتها. لن نشارك بياناتك مع أي جهة أخرى.',
  fields: {
    firstName: { label: 'الاسم الأول', placeholder: 'الاسم الأول *', message: 'اكتب الاسم الأول (حرفان على الأقل)' },
    lastName: { label: 'اسم العائلة', placeholder: 'اسم العائلة *', message: 'اكتب اسم العائلة (حرفان على الأقل)' },
    countryCode: {
      label: 'مفتاح الدولة',
      placeholder: 'مفتاح الدولة',
      message: 'اختر مفتاح الدولة',
      options: {
        option__966: '‎+966 السعودية',
        option__971: '‎+971 الإمارات',
        option__965: '‎+965 الكويت',
        option__974: '‎+974 قطر',
        option__973: '‎+973 البحرين',
        option__968: '‎+968 عُمان',
        option__962: '‎+962 الأردن',
        option__20: '‎+20 مصر',
        option__90: '‎+90 تركيا',
        option_other: 'أخرى',
      },
    },
    phone: { label: 'رقم الجوال', placeholder: '5X XXX XXXX *', message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)' },
    email: { label: 'البريد الإلكتروني', placeholder: 'البريد الإلكتروني *', message: 'اكتب بريداً إلكترونياً صحيحاً' },
    company: { label: 'اسم الشركة', placeholder: 'اسم الشركة (اختياري)', message: 'اسم الشركة أطول من اللازم' },
  },
  received: 'تم — التحميل بدأ',
  refused: 'تعذّر التحميل الآن. حاول مرة أخرى بعد قليل.',
  failed: 'تعذّر التحميل بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل.',
  confirmationSubject: 'ربائد — متتبّع الصبّات',
  confirmationBody:
    'مرحباً {الاسم}،\n\n' +
    'شكراً لتحميلك متتبّع الصبّات. الملف اسمه Rabaed-Pour-Tracker.html، وهو صفحة واحدة تفتح بنقرتين في Chrome أو Edge.\n\n' +
    'ثلاث خطوات حتى أول صبّة:\n' +
    '١. احفظ الملف في مكان ثابت — سطح المكتب أو مجلد المشروع، لا مجلد التنزيلات.\n' +
    '٢. افتحه بنقرتين.\n' +
    '٣. اختر مجلداً للمشروع عند أول تشغيل.\n\n' +
    'بياناتك تبقى على جهازك: الأداة لا ترسل شيئاً إلى أي خادم.\n\n' +
    'إن لم يصلك الملف، أعد التحميل من الصفحة نفسها.\n\n' +
    'فريق ربائد',
};
