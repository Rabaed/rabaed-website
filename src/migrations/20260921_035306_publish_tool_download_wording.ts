import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';

/**
 * Publishes the Pour Tracker download form's words as its first version
 * (ticket 30), so the form reads them from the CMS as the other three do.
 *
 * Every word is written out here rather than read from
 * `src/forms/tool-download.ts`, as the demo request's and the partnership
 * application's are: this is what the form was published with, frozen, and
 * the definition's own copy is only what a new database starts from.
 *
 * The country codes are named as the CMS names them: a `+` is not a column
 * name, so `+966` is `option__966` (`optionFieldName`).
 *
 * No alert address: the founders supply one at ticket 39, and until they do
 * neither the team's alert nor the visitor's confirmation is sent
 * (`src/forms/submission.ts`).
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'tool-download-form',
    data: {
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
      _status: 'published',
    },
    // A migration runs outside the site, where there are no pages to refresh.
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_tool_download_form_v";
    DELETE FROM "tool_download_form";
  `);
}
