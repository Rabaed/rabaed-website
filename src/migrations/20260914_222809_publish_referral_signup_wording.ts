import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';

const TOO_LARGE = 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر';
const WRONG_TYPE = 'ارفع ملف PDF أو صورة PNG أو JPG';

/**
 * Publishes the Referral Program signup form's words — the Reference site's,
 * and the messages ticket 28 added — so that every database, production's
 * included, starts with the form as built, and Editors change it from there.
 *
 * Written out here rather than read from `src/forms/referral-signup.ts`, so
 * that a later change to the form cannot change what this migration did, nor
 * make it write fields the tables do not have yet.
 *
 * No alert address: none has been supplied, and until one is set the form
 * sends no email at all.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'referral-signup-form',
    data: {
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
    DELETE FROM "_referral_signup_form_v";
    DELETE FROM "referral_signup_form";
  `);
}
