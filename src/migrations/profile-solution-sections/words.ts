/**
 * The words of the Company profile's sections 06 to 08 (ticket 107), in the
 * shape of its entry: Ahmed's, from his profile
 * (`.scratch/company-profile/source/ar.json` and `en.json`), each language from
 * its own file, since his English is a rewrite rather than a translation.
 *
 * **Frozen.** This is data for the migration that writes it, and a migration
 * must do the same thing on every database it ever runs on. The site never
 * reads this file: the profile's words are edited and published in the CMS.
 *
 * Where they differ from his:
 *
 * - his section numbers, «06» to «08», are not words: a section's number is its
 *   place in his order, which is fixed (`src/cms/globals/profile-page.ts`);
 * - his platform units' ids are not words either: each tab's screen is fixed
 *   by its place, as the Screen mock of the unit it names;
 * - the Record card's code, «LTR-088», and its steps' times are Latin, one for
 *   both languages, as the site's codes and times are;
 * - his English apostrophes and quotation marks are the curly ones the site's
 *   English is written with.
 */

const both = (ar: string, en: string) => ({ ar, en });

export const PROFILE_SOLUTION_WORDS = {
  parties: {
    eyebrow: both('حلّنا', 'Our solution'),
    title: both('نغلق الفجوة بين أطراف المشروع.', 'Bridging the gap between the stakeholders.'),
    lead: both(
      'معظم البرمجيات تخدم طرفاً واحداً. ربائد تجمع المالك والاستشاري والمقاول على سجل واحد، ولكل طرف مراجعته الداخلية التي لا تراها الأطراف الأخرى.',
      'Most software serves one party. Rabaed puts owner, consultant and contractor on one record, and each party keeps an internal review the others never see.',
    ),
    cards: [
      { name: both('مالك المشروع', 'Project owner'), want: both('يريد التسليم في موعده', 'Wants delivery on time') },
      { name: both('الاستشاري الهندسي', 'Engineering consultant'), want: both('يريد ضمان الجودة', 'Wants quality assurance') },
      { name: both('المقاول الرئيسي', 'Main contractor'), want: both('يريد ضبط التكلفة', 'Wants cost control') },
    ],
    record: both('السجل الموثّق', 'The documented Record'),
    footer: both('معادلة رابحة للأطراف الثلاثة.', 'A win for all three parties.'),
  },
  platform: {
    eyebrow: both('المنصة', 'The platform'),
    title: both('أربع وحدات. سجل واحد يجمعها.', 'Four units. One record gathers them.'),
    lead: both(
      'كل وحدة تخدم المالك والاستشاري والمقاول في موضعه، ومخرجها واحد: السجل الموثّق.',
      'Each unit serves the owner’s, the consultant’s and the contractor’s work where it happens, and they share one output: the documented Record.',
    ),
    units: [
      {
        name: both('المراسلات الرسمية', 'Official correspondence'),
        text: both(
          'خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف. وإذا ترك مدير المشروع العمل، تبقى الخطابات في سجل المشروع.',
          'Letters with reference numbers, reply status and how long each party has waited. If the project manager leaves, the letters stay with the project.',
        ),
      },
      {
        name: both('الاعتمادات والطلبات', 'Approvals and requests'),
        text: both(
          'مسودة، ثم مراجعة داخلية، ثم اعتماد. التصعيد والتنبيهات تلقائية، وكل خطوة باسم صاحبها ووقتها. ويُصدَّر كل اعتماد PDF برقم مرجعي ورمز تحقق.',
          'Draft, internal review, then approval. Escalations and reminders fire automatically, and every step carries a name and a time. Every approval exports to PDF with a reference number and a check code.',
        ),
      },
      {
        name: both('التقرير اليومي للموقع', 'Daily site report'),
        text: both(
          'العمالة والمعدات والأنشطة والمواد والصور، وتقارير أسبوعية وشهرية تُنشأ تلقائياً.',
          'Labor, equipment, activities, materials and photos, with weekly and monthly reports generated automatically.',
        ),
      },
      {
        name: both('المستندات والإصدارات', 'Documents and revisions'),
        text: both(
          'أحدث إصدار دائماً، مع كل الإصدارات السابقة ومن رفعها، ومتاحة فوراً عند أي مطالبة أو نزاع.',
          'Always the latest revision, with every earlier one and who uploaded it, ready the moment a claim or dispute arises.',
        ),
      },
    ],
    output: both(
      'المخرَج: السجل الموثّق. كل طلب واعتماد مؤرخ باسم من قام به.',
      'The output: the documented Record. Every request and approval dated with the name of whoever made it.',
    ),
  },
  record: {
    eyebrow: both('السجل الموثّق', 'The documented Record'),
    title: both('لا نسأل «من اعتمد؟». نفتح المعاملة.', 'Don’t ask “who approved?” Open the transaction.'),
    body: both(
      'السجل في ربائد ليس ميزة تُفعَّل، بل نتيجة كل خطوة. أي معاملة تمر في المنصة تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب استلام أعمال، أو تحديث على الجدول الزمني. وبعد نهاية المشروع، السجل نفسه ما زال هناك.',
      'The Record in Rabaed isn’t a feature you switch on. It’s the result of every step. Any transaction that passes through the platform carries its full record: an official letter, a material approval, a work inspection request or a schedule update. After the project ends, the record itself is still there.',
    ),
    code: 'LTR-088',
    document: both('خطاب: طلب تمديد مدة', 'Letter: extension of time request'),
    example: both('مثال توضيحي', 'Illustrative example'),
    steps: [
      { verb: both('أُرسل', 'Sent'), who: both('م. فهد · المقاول', 'Eng. Fahd · Contractor'), time: '08:15' },
      { verb: both('استُلم', 'Received'), who: both('إشعار استلام تلقائي', 'Automatic receipt'), time: '08:15' },
      { verb: both('دُقّق', 'Checked'), who: both('م. سارة · الاستشاري', 'Eng. Sara · Consultant'), time: '13:40' },
      { verb: both('رُدّ عليه', 'Answered'), who: both('«يُمنح 14 يوماً» · المالك', '“14 days granted” · Owner'), time: '11:05' },
    ],
    summary: both('سجل كامل · 4 خطوات · 3 أطراف', 'Full record · 4 steps · 3 parties'),
  },
} as const;
