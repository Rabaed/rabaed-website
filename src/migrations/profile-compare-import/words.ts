/**
 * The Company profile's before-and-after section, as its first words
 * (ticket 108): Ahmed's, from his profile (`.scratch/company-profile/source/
 * ar.json` and `en.json`, `compare` and `ui`), in the shape of the entry's
 * `compare` tab.
 *
 * **Frozen.** This is data for the migration that writes it, and a migration
 * must do the same thing on every database it ever runs on. The site never
 * reads this file: the words are edited and published in the CMS.
 *
 * Each language from its own file, for the reason the profile's first words
 * give (`../profile-page-import/words.ts`). The Arabic dashboard's negative
 * number keeps the left-to-right mark Ahmed put before it, which keeps its
 * minus sign in front of it in an Arabic line.
 *
 * His «شغّل المقارنة» is the play button's; his «قبل» and «بعد ربائد» head
 * the table's two columns.
 */

const both = (ar: string, en: string) => ({ ar, en });

const row = (label: [string, string], before: [string, string], after: [string, string]) => ({
  label: both(...label),
  before: both(...before),
  after: both(...after),
});

export const PROFILE_COMPARE_WORDS = {
  eyebrow: both('قبل وبعد', 'Before and after'),
  title: both('خمسة أسئلة يومية. إجابتان.', 'Five everyday questions. Two answers.'),
  lead: both(
    'كل مقارنة موقف من مشروع حقيقي: الطريقة المعتادة، ثم نفس الموقف على ربائد.',
    'Each comparison is a moment from a real project: the usual way, then the same moment on Rabaed.',
  ),
  beforeLabel: both('قبل', 'Before'),
  afterLabel: both('بعد ربائد', 'With Rabaed'),
  playLabel: both('شغّل المقارنة', 'Play the comparison'),
  approvals: {
    module: both('الاعتمادات', 'Approvals'),
    question: both('إيش الملاحظات؟ أي نسخة؟ وعند مين الحين؟', 'What are the comments? Which revision? And who has it now?'),
    firstRow: row(
      ['الملاحظات', 'Comments'],
      ['بخط اليد، فوق الحقول وعلى الهامش', 'Handwritten, over the fields and in the margins'],
      ['6 بنود مرقّمة في رد الاستشاري', "6 numbered items in the consultant's reply"],
    ),
    secondRow: row(
      ['النسخة', 'Revision'],
      ['REV 00… ولا أحد يضمن أنها الأخيرة', "REV 00… and nobody can say it's the latest"],
      ['رقم مرجعي ورمز تحقق لكل إصدار', 'A reference number and a check code for every revision'],
    ),
    thirdRow: row(
      ['عند من الآن', 'Who has it now'],
      ['لا تعرف إلا بمكالمة', 'Only a phone call will tell you'],
      ['الخطوة التالية ظاهرة، وكل خطوة قبلها باسمها وتاريخها', 'The next step is visible, and every step before it has a name and a date'],
    ),
    note: both('الورقة من طلب اعتماد حقيقي. ورقة ربائد رسم توضيحي.', 'The paper is from a real submittal. The Rabaed sheet is an illustration.'),
  },
  documents: {
    module: both('المستندات', 'Documents'),
    question: both('كم دقيقة حتى تصل إلى الملف؟', 'How many minutes until you reach the file?'),
    firstRow: row(
      ['الجهد', 'Effort'],
      ['دقيقة و8 ثوانٍ، و19 نقرة', '1 minute 8 seconds, and 19 clicks'],
      ['8 نقرات، وكل نقرة تضيّق النتائج', '8 clicks, and each one narrows the results'],
    ),
    secondRow: row(
      ['الطريق', 'Path'],
      ['7 مجلدات متداخلة، ورجوع 5 مرات', '7 nested folders, and 5 wrong turns'],
      ['التخصص، ثم نوع المستند وكوده، بدون رجوع', 'Discipline, then document type and code, no going back'],
    ),
    thirdRow: row(
      ['ما تجده', 'What you find'],
      ['صورة سكان لآخر نسخة', 'A scan of the last copy'],
      ['الطلب بكل إصداراته، وملاحظات الاستشاري على كل إصدار', "The request with every revision, and the consultant's comments on each"],
    ),
    note: both('قياس من تسجيل حقيقي على OneDrive. شاشة ربائد رسم توضيحي.', 'Timed from a real OneDrive recording. The Rabaed screen is an illustration.'),
  },
  correspondence: {
    module: both('المراسلات', 'Correspondence'),
    question: both(
      'لو ترك مدير المشروع العمل… أين يجد من بعده الخطابات؟',
      'If the project manager leaves… where does the next one find the letters?',
    ),
    firstRow: row(
      ['أين الخطابات', 'Where the letters are'],
      ['في إيميل مدير المشروع', "In the project manager's mailbox"],
      ['في سجل المشروع على ربائد', 'In the project record on Rabaed'],
    ),
    secondRow: row(
      ['لو ترك العمل', 'If they leave'],
      ['يُقفل حسابه، وتذهب معه', 'The account is closed, and the letters go with it'],
      ['تبقى، ومن بعده يدخل ويجدها', 'They stay, and the successor logs in and finds them'],
    ),
    thirdRow: row(
      ['ما ينتظر رداً', 'What awaits a reply'],
      ['لا أحد يدري', 'Nobody knows'],
      ['فلتر «تتطلب ردّي» بأيام الانتظار', 'A "needs my reply" filter with days waiting'],
    ),
    note: both('شاشة ربائد رسم توضيحي.', 'The Rabaed screen is an illustration.'),
  },
  dashboard: {
    module: both('لوحة المتابعة', 'Dashboard'),
    question: both(
      'والمهندس لم يجد وقتاً لتحديث الإكسل… هل الأرقام صحيحة؟',
      'The engineer had no time to update the Excel… are the numbers right?',
    ),
    firstRow: row(
      ['حجم السجل', 'Log size'],
      ['28,936 طلباً في ملف واحد', '28,936 requests in one file'],
      ['كل طلب سجل مستقل، واللوحة تجمعها', 'Every request is its own record, and the dashboard adds them up'],
    ),
    secondRow: row(
      ['آخر تحديث', 'Last update'],
      ['يدوي، وتوقف عند 27/03/2023', 'Manual, and stopped at 27/03/2023'],
      ['مع كل طلب وكل اعتماد', 'With every request and every approval'],
    ),
    thirdRow: row(
      ['الأرقام', 'The numbers'],
      ['82 معلّقاً، وأيام إغلاق ‎-45,012', '82 pending, and closing days of -45,012'],
      ['أيام انتظار حقيقية من توقيت النظام', 'Real waiting days from system time'],
    ),
    note: both(
      'سجل إكسل حقيقي من مشروع سابق، والأسماء مخفية. شاشة ربائد رسم توضيحي.',
      'A real Excel log from a past project, names hidden. The Rabaed screen is an illustration.',
    ),
  },
  dailyReport: {
    module: both('التقرير اليومي', 'Daily report'),
    question: both('«ماذا حدث اليوم في الموقع؟»', '"What happened on site today?"'),
    firstRow: row(
      ['كيف يعرف المالك', 'How the owner finds out'],
      ['يسأل الاستشاري على الواتساب', 'Asks the consultant on WhatsApp'],
      ['إشعار تلقائي فور اعتماد التقرير', 'An automatic notification once the report is approved'],
    ),
    secondRow: row(
      ['متى', 'When'],
      ['صباح اليوم التالي… إن وصل', 'Next morning… if it arrives'],
      ['في نفس اليوم، الساعة 17:53', 'The same day, at 17:53'],
    ),
    thirdRow: row(
      ['ما يصله', 'What reaches them'],
      ['«لم يصل التقرير من المقاول بعد»', '"The contractor\'s report hasn\'t come in yet"'],
      ['ملخص اليوم: 7 أعمال، توريد، و10 صور', "The day's summary: 7 activities, a delivery, and 10 photos"],
    ),
    note: both('المحادثة تمثيل، والتقرير من مشروع حقيقي.', 'The chat is a re-enactment. The report is from a real project.'),
  },
} as const;
