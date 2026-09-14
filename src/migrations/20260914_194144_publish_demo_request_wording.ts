import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';

/**
 * Publishes the demo request form's words — the Reference site's, and the
 * messages ticket 27 added — so that every database, production's included,
 * starts with the form as built, and Editors change it from there.
 *
 * Written out here rather than read from `src/forms/demo-request.ts`, so that
 * a later change to the form cannot change what this migration did, nor make
 * it write fields the tables do not have yet.
 *
 * No alert address: none has been supplied (spec: Further Notes), and until
 * one is set the form sends no email at all.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'demo-request-form',
    data: {
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
    DELETE FROM "_demo_request_form_v";
    DELETE FROM "demo_request_form";
  `);
}
