import { RULES, type FormDefinition } from './definition';

export type PartnershipApplicationField =
  | 'company'
  | 'commercialRegistration'
  | 'city'
  | 'name'
  | 'jobTitle'
  | 'phone'
  | 'email'
  | 'activity'
  | 'activeProjects'
  | 'clientType'
  | 'projectArea'
  | 'partnershipMode'
  | 'goals';

/** The commercial registration's two refusals: the referral signup's words, for the same rules. */
const TOO_LARGE = 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر';
const WRONG_TYPE = 'ارفع ملف PDF أو صورة PNG أو JPG';

/**
 * The Partnership Program application (`src/components/partnership/application-form.tsx`):
 * the office and its commercial registration, the person applying, five
 * questions about the practice, and what the office wants from the
 * partnership.
 *
 * The fields are the Reference site's, in its order, and so is what it stars:
 * everything but the free text, the commercial registration among them
 * (HANDOFF §4.ج). The five lists are stored by value, not by their Arabic
 * text, which is copy and may change.
 *
 * Every placeholder, the heading and the line under it are verbatim from
 * `reference/site/partnership.html`, and so is what an office is told once its
 * application is stored — the Reference site showed it without storing
 * anything. The Reference site had no messages; the name, phone and email ones
 * are the other forms', for the same rules. Its small print said the form was
 * a prototype that sends nothing; it now says what happens to the registration.
 */
export const PARTNERSHIP_APPLICATION: FormDefinition<PartnershipApplicationField> = {
  id: 'partnership-application',
  title: { ar: 'طلب شراكة', en: 'Partnership application' },
  previewPath: '/partnership',
  fields: {
    company: { required: true, maxLength: 120, accepts: RULES.name },
    commercialRegistration: { kind: 'document', required: true },
    city: { required: true, maxLength: 60, accepts: RULES.name },
    name: { required: true, maxLength: 120, accepts: RULES.name },
    jobTitle: { required: true, maxLength: 80, accepts: RULES.name },
    phone: { required: true, maxLength: 30, accepts: RULES.phone },
    email: { required: true, maxLength: 254, accepts: RULES.email },
    activity: {
      required: true,
      maxLength: 40,
      options: ['consulting-office', 'project-management', 'contracting', 'real-estate-development', 'other'],
    },
    activeProjects: { required: true, maxLength: 10, options: ['1-3', '4-10', '11-25', 'over-25'] },
    clientType: {
      required: true,
      maxLength: 40,
      options: ['individual-developers', 'development-companies', 'government', 'mixed'],
    },
    // In square metres.
    projectArea: { required: true, maxLength: 20, options: ['under-5000', '5000-20000', '20000-50000', 'over-50000'] },
    // The three modes this page offers, or none settled on yet.
    partnershipMode: {
      required: true,
      maxLength: 40,
      options: ['embedded-in-proposal', 'office-licence', 'approved-referral', 'undecided'],
    },
    goals: { required: false, maxLength: 2000 },
  },
  applicant: (answers) => ({ name: answers.name, email: answers.email, phone: answers.phone }),
  wording: {
    heading: 'اطلب اجتماع شراكة',
    lead: 'بيانات المكتب تساعدنا على اقتراح النمط الأنسب قبل الاجتماع.',
    submit: 'اطلب اجتماع شراكة',
    finePrint: 'يُحفظ سجلك التجاري في مساحة خاصة لا يصل إليها إلا فريق ربائد، ولا يُستخدم إلا لدراسة طلب الشراكة.',
    fields: {
      company: { label: 'اسم المكتب أو الشركة', placeholder: 'اسم المكتب / الشركة *', message: 'اكتب اسم المكتب أو الشركة' },
      commercialRegistration: {
        label: 'السجل التجاري',
        placeholder: 'PDF أو صورة',
        message: 'أرفق السجل التجاري',
        tooLarge: TOO_LARGE,
        wrongType: WRONG_TYPE,
      },
      city: { label: 'المدينة', placeholder: 'المدينة *', message: 'اكتب اسم مدينتك' },
      name: { label: 'اسم مقدّم الطلب', placeholder: 'اسم مقدّم الطلب *', message: 'اكتب اسمك الكامل (حرفان على الأقل)' },
      jobTitle: { label: 'المنصب', placeholder: 'المنصب *', message: 'اكتب منصبك في المكتب' },
      phone: { label: 'رقم الجوال', placeholder: 'رقم الجوال *', message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)' },
      email: { label: 'البريد الإلكتروني', placeholder: 'البريد الإلكتروني *', message: 'اكتب بريداً إلكترونياً صحيحاً' },
      activity: {
        label: 'نوع النشاط',
        placeholder: 'نوع النشاط *',
        message: 'اختر نوع نشاط المكتب',
        options: {
          'consulting-office': 'مكتب استشاري',
          'project-management': 'إدارة مشاريع',
          contracting: 'مقاولات',
          'real-estate-development': 'تطوير عقاري',
          other: 'أخرى',
        },
      },
      activeProjects: {
        label: 'عدد المشاريع تحت الإشراف حالياً',
        placeholder: 'عدد المشاريع تحت الإشراف *',
        message: 'اختر عدد المشاريع تحت الإشراف',
        options: { '1-3': '1–3', '4-10': '4–10', '11-25': '11–25', 'over-25': 'أكثر من 25' },
      },
      clientType: {
        label: 'نوع العملاء الغالب',
        placeholder: 'نوع العملاء الغالب *',
        message: 'اختر نوع العملاء الغالب',
        options: {
          'individual-developers': 'مطوّرون أفراد',
          'development-companies': 'شركات تطوير',
          government: 'جهات حكومية',
          mixed: 'مزيج',
        },
      },
      projectArea: {
        label: 'متوسط مساحة المشروع',
        placeholder: 'متوسط مساحة المشروع *',
        message: 'اختر متوسط مساحة المشروع',
        options: {
          'under-5000': 'أقل من 5,000 م²',
          '5000-20000': '5,000–20,000 م²',
          '20000-50000': '20,000–50,000 م²',
          'over-50000': 'أكثر من 50,000 م²',
        },
      },
      partnershipMode: {
        label: 'نمط التعاون المبدئي',
        placeholder: 'نمط التعاون المبدئي *',
        message: 'اختر نمط التعاون المبدئي',
        options: {
          'embedded-in-proposal': 'التضمين في العرض',
          'office-licence': 'رخصة المكتب',
          'approved-referral': 'الترشيح المعتمد',
          undecided: 'غير محدد',
        },
      },
      goals: {
        label: 'ما الذي تريد تحقيقه من الشراكة',
        placeholder: 'ما الذي تريد تحقيقه من الشراكة؟ (اختياري)',
        message: 'ما كتبته أطول من اللازم',
      },
    },
    received: 'وصلنا طلبك. يتواصل معك فريق الشراكات خلال يومي عمل لترتيب اجتماع التعارف.',
    refused: 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
    failed: 'لم يُحفظ طلبك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
    confirmationSubject: 'ربائد — وصلنا طلب الشراكة',
    confirmationBody: [
      'مرحباً {الاسم}،',
      '',
      'وصلنا طلب مكتبكم للانضمام إلى برنامج الشراكات. سيراجع فريق الشراكات بياناتكم وسجلكم التجاري، ويتواصل معكم خلال يومي عمل لترتيب اجتماع التعارف.',
      '',
      'الاجتماع الأول يشمل عرض المنصة، ولا يلزمكم بشيء.',
      '',
      'فريق ربائد',
    ].join('\n'),
  },
};
