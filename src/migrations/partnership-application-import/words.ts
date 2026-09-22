/**
 * The Partnership Program application's words, as the form was built with them
 * (ticket 29): the words
 * `20260920_170917_publish_partnership_application_wording` publishes as the
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

export const PARTNERSHIP_APPLICATION_WORDS = {
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
      tooLarge: 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر',
      wrongType: 'ارفع ملف PDF أو صورة PNG أو JPG',
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
        option_consulting_office: 'مكتب استشاري',
        option_project_management: 'إدارة مشاريع',
        option_contracting: 'مقاولات',
        option_real_estate_development: 'تطوير عقاري',
        option_other: 'أخرى',
      },
    },
    activeProjects: {
      label: 'عدد المشاريع تحت الإشراف حالياً',
      placeholder: 'عدد المشاريع تحت الإشراف *',
      message: 'اختر عدد المشاريع تحت الإشراف',
      options: {
        option_1_3: '1–3',
        option_4_10: '4–10',
        option_11_25: '11–25',
        option_over_25: 'أكثر من 25',
      },
    },
    clientType: {
      label: 'نوع العملاء الغالب',
      placeholder: 'نوع العملاء الغالب *',
      message: 'اختر نوع العملاء الغالب',
      options: {
        option_individual_developers: 'مطوّرون أفراد',
        option_development_companies: 'شركات تطوير',
        option_government: 'جهات حكومية',
        option_mixed: 'مزيج',
      },
    },
    projectArea: {
      label: 'متوسط مساحة المشروع',
      placeholder: 'متوسط مساحة المشروع *',
      message: 'اختر متوسط مساحة المشروع',
      options: {
        option_under_5000: 'أقل من 5,000 م²',
        option_5000_20000: '5,000–20,000 م²',
        option_20000_50000: '20,000–50,000 م²',
        option_over_50000: 'أكثر من 50,000 م²',
      },
    },
    partnershipMode: {
      label: 'نمط التعاون المبدئي',
      placeholder: 'نمط التعاون المبدئي *',
      message: 'اختر نمط التعاون المبدئي',
      // This list's options are named `o_`, not `option_`: with the longer
      // prefix their columns would pass what Postgres allows
      // (`src/cms/globals/form-settings.ts`).
      options: {
        o_embedded_in_proposal: 'التضمين في العرض',
        o_office_licence: 'رخصة المكتب',
        o_approved_referral: 'الترشيح المعتمد',
        o_undecided: 'غير محدد',
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
};
