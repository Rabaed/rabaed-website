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
};
