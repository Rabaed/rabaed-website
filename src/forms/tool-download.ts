import { RULES, type FormDefinition } from './definition';

export type ToolDownloadField = 'firstName' | 'lastName' | 'countryCode' | 'phone' | 'email' | 'company';

/**
 * The Pour Tracker download form (`src/components/tool/download-form.tsx`).
 *
 * The rules are the Reference site's own (`reference/site/tool.html`), which
 * ticket 14 takes as the model: two letters for each name, six to fifteen
 * digits for the phone, and an address with a dot and at least two letters
 * after the @. The company is optional; the country code is a list, whose
 * «أخرى» is sent as `other`.
 *
 * **Nothing submits it yet.** Ticket 30 runs it through the submission
 * pipeline, delivers the file once the details are recorded, and puts its
 * wording in the CMS. Until then its page reads the words below directly, and
 * the replies and the confirmation email are placeholders nobody receives.
 */
export const TOOL_DOWNLOAD: FormDefinition<ToolDownloadField> = {
  id: 'tool-download',
  title: { ar: 'تحميل متتبّع الصبّات', en: 'Pour Tracker download' },
  previewPath: '/tool',
  fields: {
    firstName: { required: true, maxLength: 60, accepts: RULES.name },
    lastName: { required: true, maxLength: 60, accepts: RULES.name },
    countryCode: {
      required: false,
      maxLength: 5,
      options: ['+966', '+971', '+965', '+974', '+973', '+968', '+962', '+20', '+90', 'other'],
    },
    phone: { required: true, maxLength: 30, accepts: RULES.phone },
    email: { required: true, maxLength: 254, accepts: RULES.email },
    company: { required: false, maxLength: 120 },
  },
  applicant: (answers) => ({
    name: `${answers.firstName} ${answers.lastName}`,
    email: answers.email,
    phone: answers.countryCode === 'other' ? answers.phone : `${answers.countryCode} ${answers.phone}`,
  }),
  // Verbatim from the Reference site, but for the replies (see above).
  wording: {
    heading: 'بيانات التحميل',
    lead: 'حقل الشركة اختياري. البقية مطلوبة لتفعيل زر التحميل.',
    submit: 'حمّل الأداة الآن',
    finePrint: 'بالضغط على زر التحميل توافق على أن نتواصل معك بخصوص الأداة وتحديثاتها. لن نشارك بياناتك مع أي جهة أخرى.',
    fields: {
      firstName: { label: 'الاسم الأول', placeholder: 'الاسم الأول *', message: 'اكتب الاسم الأول (حرفان على الأقل)' },
      lastName: { label: 'اسم العائلة', placeholder: 'اسم العائلة *', message: 'اكتب اسم العائلة (حرفان على الأقل)' },
      countryCode: {
        label: 'مفتاح الدولة',
        placeholder: 'مفتاح الدولة',
        message: 'اختر مفتاح الدولة',
        // Each label opens with a left-to-right mark, so the + stays before the digits.
        options: {
          '+966': '‎+966 السعودية',
          '+971': '‎+971 الإمارات',
          '+965': '‎+965 الكويت',
          '+974': '‎+974 قطر',
          '+973': '‎+973 البحرين',
          '+968': '‎+968 عُمان',
          '+962': '‎+962 الأردن',
          '+20': '‎+20 مصر',
          '+90': '‎+90 تركيا',
          other: 'أخرى',
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
    confirmationBody: 'مرحباً {الاسم}،\n\nشكراً لتحميلك متتبّع الصبّات.\n\nفريق ربائد',
  },
};
