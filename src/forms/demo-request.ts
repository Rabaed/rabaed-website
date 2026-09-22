import { RULES, type FormDefinition } from './definition';

export type DemoRequestField = 'name' | 'email' | 'role' | 'phone' | 'company' | 'activeProjects';

/**
 * The demo request form: one form, at the end of the home and product pages
 * and beside the start page's questions (`src/components/demo-request-form.tsx`).
 *
 * The four details needed to book a call are required; the company and the
 * number of active projects help prepare it, and may be left out. The roles
 * are the three parties, stored by value rather than by their Arabic text,
 * which is copy and may change.
 *
 * The heading, the line under it, the button, the small print and every
 * placeholder are verbatim from `reference/site/index.html`, and so is the
 * message for a request received — the Reference site showed it without
 * sending anything; here it is shown once the request is stored. The Reference
 * form had no validation messages; the ones for the name, phone and email are
 * the tool page's, for the same rules.
 */
export const DEMO_REQUEST: FormDefinition<DemoRequestField> = {
  id: 'demo-request',
  title: { ar: 'طلب عرض حي', en: 'Demo request' },
  previewPath: '/start',
  fields: {
    name: { required: true, maxLength: 120, accepts: RULES.name },
    email: { required: true, maxLength: 254, accepts: RULES.email },
    role: { required: true, maxLength: 20, options: ['owner', 'consultant', 'contractor'] },
    phone: { required: true, maxLength: 30, accepts: RULES.phone },
    company: { required: false, maxLength: 120 },
    activeProjects: { required: false, maxLength: 4, accepts: (answer) => /^\d{1,4}$/.test(answer) },
  },
  applicant: (answers) => ({ name: answers.name, email: answers.email, phone: answers.phone }),
  wording: {
    ar: {
      heading: 'احجز عرضاً حياً على مشروعك',
      lead: '30 دقيقة · بالعربية · على مشروع من مشاريعك',
      submit: 'احجز عرضاً حياً',
      finePrint: 'نستخدم بياناتك لتحديد موعد العرض فقط، ولا نشاركها مع أي طرف ثالث.',
      fields: {
        name: {
          label: 'الاسم الكامل',
          placeholder: 'الاسم الكامل',
          message: 'اكتب اسمك الكامل (حرفان على الأقل)',
        },
        email: {
          label: 'البريد الإلكتروني',
          placeholder: 'البريد الإلكتروني',
          message: 'اكتب بريداً إلكترونياً صحيحاً',
        },
        role: {
          label: 'دورك في المشروع',
          placeholder: 'دورك في المشروع',
          message: 'اختر دورك في المشروع',
          options: { owner: 'مالك / مطوّر', consultant: 'استشاري', contractor: 'مقاول' },
        },
        phone: {
          label: 'رقم الجوال',
          placeholder: 'رقم الجوال',
          message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)',
        },
        company: {
          label: 'اسم الشركة',
          placeholder: 'اسم الشركة',
          message: 'اسم الشركة أطول من اللازم',
        },
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
    },
    // The English: ticket 42's, proposed to the founder with the English site.
    // The Arabic says the demo is given in Arabic; the English leaves the
    // language out, since whether one is given in English is his to say.
    en: {
      heading: 'Book a live demo on your project',
      lead: '30 minutes · on one of your own projects',
      submit: 'Book a live demo',
      finePrint: 'We use your details only to arrange the demo, and never share them with any third party.',
      fields: {
        name: { label: 'Full name', placeholder: 'Full name', message: 'Enter your full name (at least two letters)' },
        email: { label: 'Email', placeholder: 'Email', message: 'Enter a valid email address' },
        role: {
          label: 'Your role on the project',
          placeholder: 'Your role on the project',
          message: 'Choose your role on the project',
          options: { owner: 'Owner / developer', consultant: 'Consultant', contractor: 'Contractor' },
        },
        phone: { label: 'Mobile number', placeholder: 'Mobile number', message: 'Enter a valid mobile number (6 to 15 digits)' },
        company: { label: 'Company name', placeholder: 'Company name', message: 'The company name is too long' },
        activeProjects: {
          label: 'Number of active projects',
          placeholder: 'Number of active projects',
          message: 'Enter the number of projects in figures only',
        },
      },
      received: 'We have your request — we will contact you within one working day to arrange a time.',
      refused: 'We could not take your request just now. Please try again shortly, or message us on WhatsApp.',
      failed: 'Your request was not saved because of an error on our side. Please try again shortly, or message us on WhatsApp.',
      confirmationSubject: 'Rabaed — we have your demo request',
      confirmationBody: [
        'Hello {name},',
        '',
        'We have your request for a live demo of Rabaed on one of your projects. Our team will contact you within one working day to arrange a time.',
        '',
        'The demo takes 30 minutes.',
        '',
        'The Rabaed team',
      ].join('\n'),
    },
  },
};
