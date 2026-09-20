import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';

/**
 * Publishes the Partnership Program application's words — the Reference site's,
 * and the messages ticket 29 added — so that every database, production's
 * included, starts with the form as built, and Editors change it from there.
 *
 * Written out here rather than read from `src/forms/partnership-application.ts`,
 * so that a later change to the form cannot change what this migration did, nor
 * make it write fields the tables do not have yet.
 *
 * No alert address: none has been supplied, and until one is set the form
 * sends no email at all.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'partnership-application-form',
    data: {
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
      _status: 'published',
    },
    // A migration runs outside the site, where there are no pages to
    // refresh (`src/cms/revalidation.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_partnership_application_form_v";
    DELETE FROM "partnership_application_form";
  `);
}
