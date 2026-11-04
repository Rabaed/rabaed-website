/**
 * The words of the Company profile's sections 01 to 04 (ticket 105), in the
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
 * - his section numbers, «01» to «04», are not words: a section's number is its
 *   place in his order, which is fixed (`src/cms/globals/profile-page.ts`);
 * - each figure is its number and its sign together, «35%», as the home page's
 *   figures are written;
 * - the source line under the figures is not in his files: the spec gives it,
 *   «المصدر: بيانات مشاريع ربائد» / "Source: Rabaed project data";
 * - his two-line heading for 04 is the heading and the line in colour under it,
 *   as he draws it;
 * - his English apostrophes are the curly ones the site's English is written
 *   with.
 */

const both = (ar: string, en: string) => ({ ar, en });

export const PROFILE_OPENING_WORDS = {
  truth: {
    eyebrow: both('الحقيقة كما هي', 'Here’s the truth'),
    title: both('اعتماداتكم مبعثرة في قصاصات ورق.', 'Your approvals live on scraps of paper.'),
    body: both(
      'كل طلب اعتماد وكل خطاب رسمي: ملاحظات بخط اليد، أختام، صورة بالجوال، ثم ملف ضائع بين الإيميل والواتساب وSharePoint. حتى يأتي اليوم الذي تحتاجون فيه إثبات ما حدث في الموقع.',
      'Every submittal and every official letter: handwritten comments, stamps, a phone photo, then a file lost between email, WhatsApp and SharePoint. Until the day you need to prove what happened on site.',
    ),
    caption: both(
      'طلب اعتماد مواد حقيقي من مشروع سكني، أبريل 2023. الأسماء والأختام مخفية.',
      'A real material submittal from a housing project, April 2023. Names and stamps hidden.',
    ),
    noteRevision: both('REV 00… هل هي الأخيرة؟', 'REV 00… is it the latest?'),
    noteComments: both('ملاحظات فوق الحقول… من يقرأها؟', 'Comments over the fields… who reads them?'),
    noteWho: both('وعند من الآن؟', 'And who has it now?'),
  },
  numbers: {
    eyebrow: both('الموقع الحقيقي', 'The real site'),
    title: both('الأرقام التي تكشف الفوضى.', 'The numbers behind the mess.'),
    figures: [
      {
        figure: '35%',
        label: both(
          'من وقت فريق المشروع يذهب في الأعمال الورقية وجمع البيانات',
          'of a project team’s time goes on paperwork and data collection',
        ),
      },
      {
        figure: '30%',
        label: both('من تأخيرات مشاريع البناء سببها الأعمال الورقية', 'of construction project delays are related to paperwork'),
      },
      {
        figure: '95%',
        label: both('من بيانات البناء تذهب دون استخدام', 'of all construction data goes completely unused'),
      },
    ],
    source: both('المصدر: بيانات مشاريع ربائد', 'Source: Rabaed project data'),
  },
  trap: {
    eyebrow: both('الفخ', 'The trap'),
    title: both('نعم، المهندس المحترف قادر على ترتيب الفوضى.', 'Yes, a skilled engineer can organize the mess.'),
    body: both(
      'لكن ذلك يستهلك ضعف الجهد والوقت. تدفعون رواتب كوادر محترفة لتنظيم الأوراق، لا للتفرغ لأعمال الموقع.',
      'But it takes twice the effort and time, just to stay afloat. You’re paying senior salaries to fight tools, not to build.',
    ),
    kicker: both(
      'المشكلة ليست البريد الإلكتروني ولا الإكسل. المشكلة أن الإجراء تحتها يدوي ومشتّت.',
      'The problem isn’t email or Excel. It’s the manual, scattered process underneath them.',
    ),
    // In the order their icons are drawn: WhatsApp, email, Excel, a SharePoint folder.
    tools: [
      { name: both('WhatsApp', 'WhatsApp'), text: both('قرارات المشروع مدفونة في محادثات لا يمكن تتبّعها أو تدقيقها', 'Critical project decisions buried in group chats') },
      { name: both('البريد الإلكتروني', 'Email'), text: both('معلومات مجزأة تضيع فيها القرارات والمسؤوليات', 'Fragmented data and siloed communication') },
      { name: both('Excel', 'Excel'), text: both('غير متزامن، ويحتاج تحديثاً يدوياً بعد كل اعتماد', 'Out of sync, and needs a manual update after every approval') },
      { name: both('SharePoint', 'SharePoint'), text: both('جهد يدوي ثقيل لتخزين بيانات لا يمكن الاستفادة منها', 'Heavy manual rework to store dead, unusable data') },
    ],
  },
  about: {
    eyebrow: both('من نحن', 'Who we are'),
    title: both('لم نسمع بهذه المشاكل فقط.', 'We didn’t study this problem.'),
    titleAccent: both('عشناها.', 'We lived it.'),
    body: both(
      'نحن مهندسون ومديرو مشاريع أمضينا سنوات في الميدان، نواجه نفس التأخيرات والاتصالات الضائعة والأعمال الورقية التي لا تنتهي، والتي تواجهونها كل يوم.',
      'We’re engineers and project managers who spent years in the field, facing the same delays, lost communications and endless paperwork you face every day.',
    ),
    quote: both('لذلك قررنا أن نبني المنصة التي طالما تمنّينا وجودها.', 'So we decided to build the platform we always wished existed.'),
  },
} as const;
