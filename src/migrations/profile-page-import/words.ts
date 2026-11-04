/**
 * The Company profile's first words (ticket 102), in the shape of its entry:
 * Ahmed's, from his profile (`.scratch/company-profile/source/ar.json` and
 * `en.json`), as they become the entry's first version in the CMS.
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site never
 * reads this file: the profile's words are edited and published in the CMS.
 * Changing anything here changes nothing anyone sees.
 *
 * **Each language from its own file.** Ahmed's English is a rewrite rather
 * than a translation (spec: Further Notes), so it is his English, not the
 * Arabic put into English. Both are written now, and neither is published:
 * the founder publishes the page when he has reviewed it (ticket 110).
 *
 * Where Ahmed's words fit the home page's hero rather than his own:
 *
 * - his three heading lines are two lines and the line in colour;
 * - his two badges are the line under the buttons and the guarantee's pill,
 *   whose period is set in bold before its promise, as the home page's is:
 *   «ضمان استرجاع كامل المبلغ خلال 60 يوماً» reads «**60 يوماً** ضمان
 *   استرجاع كامل المبلغ» there;
 * - the drawing's description and the document's four statuses, which his
 *   profile does not have, are the home page's (`../home-page-import/words.ts`,
 *   `../english-pages/home.ts`), his «اعتُمد · 12:05» among them.
 *
 * The demo button goes to the home page's demo form, since this page has
 * none; the WhatsApp button's link is left empty, which is the site's one
 * WhatsApp address in the site settings (spec: Buttons and links). Ahmed's
 * own number is not used.
 */

const both = (ar: string, en: string) => ({ ar, en });

export const PROFILE_PAGE_WORDS = {
  hero: {
    eyebrow: both('نظام تشغيل مشاريع الإنشاء · المملكة العربية السعودية', 'The construction project OS · Saudi Arabia'),
    titleLines: [{ line: both('ثلاثة أطراف.', 'Three parties.') }, { line: both('سجل واحد.', 'One record.') }],
    titleAccent: both('مسؤولية واضحة.', 'Clear ownership.'),
    lead: both(
      'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الموقع. كل خطوة موثّقة ومؤرخة باسم من قام بها، والتشغيل خلال أيام.',
      'Rabaed puts owner, consultant and contractor on one platform: approved correspondence, approvals and inspections, documents at their latest revision, and daily site reports. Every step is dated, with the name of who took it, and you go live within days.',
    ),
    demoLabel: both('احجز عرضاً حياً', 'Book a live demo'),
    whatsappLabel: both('تواصل واتساب', 'WhatsApp us'),
    demoLink: both('/#demo', '/en#demo'),
    whatsappLink: both('', ''),
    trust: both('عرض حي · 30 دقيقة · بالعربية', 'Live demo · 30 minutes'),
    guaranteePeriod: both('60 يوماً', '60-day'),
    guaranteePromise: both('ضمان استرجاع كامل المبلغ', 'full money-back guarantee'),
    parties: {
      owner: both('المالك', 'Owner'),
      consultant: both('الاستشاري', 'Consultant'),
      contractor: both('المقاول', 'Contractor'),
    },
    diagramDescription: both(
      'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.',
      'The owner, the consultant and the contractor on one record: every transaction that passes between the three parties is documented and dated with the name of whoever took it.',
    ),
    statuses: [
      both('أُرسل · 07:12', 'Sent · 07:12'),
      both('روجع · 09:20', 'Reviewed · 09:20'),
      both('اعتُمد · 12:05', 'Approved · 12:05'),
      both('وصل السجل للأطراف الثلاثة', 'Record reaches all three'),
    ].map((status) => ({ status })),
    statusAtRest: both('موثّق ومؤرخ', 'Documented and dated'),
  },
  trustStrip: { shows: true },
  search: {
    title: both('الملف التعريفي · ربائد', 'Company profile · Rabaed'),
    description: both(
      'ربائد تجمع المالك والاستشاري والمقاول على سجل واحد موثّق: مراسلات، اعتمادات، تقارير يومية، ومستندات. جاهزة خلال أيام.',
      'Rabaed puts owner, consultant and contractor on one documented record: correspondence, approvals, daily site reports and documents. Live within days.',
    ),
  },
} as const;
