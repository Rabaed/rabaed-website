/**
 * The English questions (ticket 42): one English entry for each Arabic
 * question on the six pages, found by its page and its Arabic question — the
 * 31 ticket 22 imported and the four comparison questions ticket 35 proposed.
 *
 * A question is an entry of its own in each language (spec: Content model),
 * so these are new entries rather than words written beside the Arabic, and
 * each waits as a draft of its own. Each answer is written to stand alone, as
 * ticket 35 rewrote the Arabic ones: it names its own subject in its first
 * clause, so that it still says something when an assistant quotes it without
 * its question. It says what the Arabic says, and nothing more — no figure,
 * percentage or client count the Arabic does not give.
 *
 * Amounts stay named, `{payout}`, and a file's name stays between backticks,
 * as an Editor writes them (`src/cms/faq-answer.ts`).
 */
import type { FaqPageKey } from '../../cms/faq-pages';

export type EnglishQuestion = {
  readonly page: FaqPageKey;
  /** The Arabic question it translates, which is how the migration finds its place. */
  readonly arabic: string;
  readonly question: string;
  readonly answer: string;
};

/** A question the home page and the start page both ask. */
const SHARED = ['home', 'start'] as const;

type Written = readonly [pages: readonly FaqPageKey[], arabic: string, question: string, answer: string];

const WRITTEN: readonly Written[] = [
  // «قبل أن تسأل»: the home page's three, which are the start page's first three.
  [
    SHARED,
    'كيف يعمل الاشتراك؟',
    'How does the subscription work?',
    'A Rabaed subscription is annual and per project, and covers all of the project’s parties and users at no extra cost to them. If you have more than one active project, there is a multi-project discount that grows with the number of projects.',
  ],
  [
    SHARED,
    'وإن لم يناسبنا بعد التشغيل؟',
    'And if it doesn’t suit us once we are live?',
    'Rabaed’s guarantee runs for 60 days from activation: if you decide to stop within them, we refund the full amount paid and hand you a complete copy of your project’s record. The record is yours whatever happens.',
  ],
  [
    SHARED,
    'كم يحتاج التشغيل؟',
    'How long does it take to go live?',
    'Going live on Rabaed takes days, not months: our team comes to your site, sets up the project, its forms and its parties, and everyone starts from where the project has got to.',
  ],
  [
    SHARED,
    'ما الفرق بين ربائد وواتساب والبريد الإلكتروني والإكسل؟',
    'What is the difference between Rabaed and WhatsApp, email and Excel?',
    'WhatsApp, email and Excel carry messages but build no record: the request becomes a chat, the approval is buried in a thread nobody finds, and the file is copied until one document has two dates. In Rabaed a request has a reference number and a receipt with a name and a time, the approval and its notes sit inside the document itself, and there is one approved version.',
  ],
  // The start page's own.
  [
    ['start'],
    'هل النماذج سعودية؟',
    'Are the forms Saudi?',
    'Yes, Rabaed’s forms are Saudi: work inspection requests (WIR), material inspections (MIR), non-conformance reports (NCR), approvals and letters — in Arabic and in the formats our projects use, tailored to each project.',
  ],
  [
    ['start'],
    'مشروعنا قائم منذ سنة — ينفع؟',
    'Our project has been running for a year — does it still work?',
    'Yes, Rabaed can go live on a project that has been running for a year: we start from where you have got to — your current approved documents are uploaded, and new requests start on the platform from day one.',
  ],
  [
    ['start'],
    'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟',
    'What happens to the record after the project or the subscription ends?',
    'Your project’s record in Rabaed is yours after the project or the subscription ends. You choose either to keep access to it with a nominal annual subscription, priced by the size of the data at the end of the project, or to receive a complete copy of it on an external drive.',
  ],
  [
    ['start'],
    'هل يدعم الإنجليزية للفرق غير العربية؟',
    'Does it support English for non-Arabic teams?',
    'Yes, Rabaed supports English for non-Arabic teams: the interface is Arabic first, and is available in English for engineers on the same project who do not speak Arabic.',
  ],
  [
    ['start'],
    'عندنا مجموعة واتساب للمشروع — لماذا ننتقل إلى ربائد؟',
    'We have a WhatsApp group for the project — why move to Rabaed?',
    'A WhatsApp group delivers the message and proves nothing: no reference number for the request, no receipt with a name and a time, and no limits to stop one party reading another’s correspondence. Rabaed keeps the request and the approval in one record that the owner, the consultant and the contractor each see, within their own permissions.',
  ],
  [
    ['start'],
    'نتبادل الاعتمادات بالبريد الإلكتروني — ما الذي يضيفه ربائد؟',
    'We exchange approvals by email — what does Rabaed add?',
    'Email delivers the message and keeps no record of the process: the approval arrives in another thread nobody can find months later, and there is no receipt with a name and a time to prove the request arrived at all. In Rabaed the approval and its notes sit inside the document itself, and the record outlasts the project — so an approval that exists can be proved.',
  ],
  [
    ['start'],
    'ندير المشروع بملفات إكسل ومجلد مشترك — ما الذي يتغيّر؟',
    'We run the project on Excel files and a shared folder — what changes?',
    'An Excel file and a shared folder keep copies, not the process: two dates for the same document, an old number on the dashboard because nobody had time to update it, and access locked once the project ends. In Rabaed a document has one approved revision, every request and approval is documented and dated with the name of whoever made it, and the record outlasts the project.',
  ],
  // The tool page's «قبل أن تحمّل».
  [
    ['tool'],
    'هل هي مجانية فعلاً؟',
    'Is it really free?',
    'Yes, the Pour Tracker is really free: a full version that works for one project, with no time limit, no trial and no watermark on printouts. We make a paid cloud version for teams running several projects, and this tool is its single-user half — it works completely on its own.',
  ],
  [
    ['tool'],
    'أين تُحفظ بياناتي بالضبط؟',
    'Where exactly is my data kept?',
    'The Pour Tracker keeps your data in the folder you choose on your computer: a `concrete_db.json` file holding every pour, test, status and date, and an `attachments` folder holding copies of the reports and photos. Nothing is uploaded to any server — there is no server at all.',
  ],
  [
    ['tool'],
    'هل تعمل بدون إنترنت؟',
    'Does it work offline?',
    'Yes, the Pour Tracker works entirely offline. The only thing fetched from the internet is the two font files, the first time it opens. Without the internet the browser uses the system font, and everything — saving, attachments, printing — works just the same.',
  ],
  [
    ['tool'],
    'كم مشروعاً تدعم؟',
    'How many projects does it support?',
    'The Pour Tracker supports one project per folder: one folder = one project. You can open another folder for another project, but each folder stands on its own. If you need all your projects on one dashboard, compared side by side, that is what the cloud version does.',
  ],
  [
    ['tool'],
    'هل أقدر أشاركها مع فريقي؟',
    'Can I share it with my team?',
    'You can share the Pour Tracker file itself as you like — send it to anyone; there is no licence and no activation key. But note: each copy works on its own folder, so there is no shared log between two people and no electronic approval from the consultant. Real sharing is what the cloud version adds.',
  ],
  [
    ['tool'],
    'ما الفرق بينها وبين النسخة السحابية؟',
    'What is the difference between it and the cloud version?',
    'The free Pour Tracker solves the individual engineer’s problem on one project. The cloud version solves the company’s: all projects on one dashboard, instant electronic approval from the consultant, an account for the lab to upload its own report, links to the rest of the Rabaed platform (documents, daily reports and correspondence), and a documented audit trail.',
  ],
  // The referral page's «قبل أن تسجّل».
  [
    ['referral'],
    'هل أحتاج سجلاً تجارياً؟',
    'Do I need a commercial registration?',
    'Rabaed’s Referral Program doesn’t require a commercial registration: the program is open to individuals, and it is enough to register your details and upload your IBAN certificate. If you have a commercial registration and a tax registration certificate, you can attach them as well if you wish.',
  ],
  [
    ['referral'],
    'متى بالضبط أستلم المبلغ؟',
    'When exactly do I get paid?',
    'The referral payout is paid once the client’s subscription has been collected, within 7 working days of the end of that month.',
  ],
  [
    ['referral'],
    'هل أحتاج أن أبيع أو أتابع العميل؟',
    'Do I need to sell to the client, or follow them up?',
    'The Referral Program asks no selling or follow-up of you: your part ends when you share the code, and the Rabaed team handles the demo, the negotiation, the contract and the activation.',
  ],
  [
    ['referral'],
    'عميلي عنده أكثر من مشروع — كيف تُحتسب؟',
    'My client has more than one project — how is that counted?',
    'Referrals are counted by project, not by client: if your code is used when a second project starts, it counts as a new referral, for another SAR {payout}.',
  ],
  [
    ['referral'],
    'ماذا لو استخدم شخصان كودين مختلفين لنفس المشروع؟',
    'What if two people use different codes for the same project?',
    'If two different codes arrive for one project, the Rabaed team accepts the referral code that arrived first with the demo request.',
  ],
  [
    ['referral'],
    'هل هناك حد أقصى للمبالغ؟',
    'Is there a cap on the payouts?',
    'There is no cap on payouts in Rabaed’s Referral Program: not on the number of projects you refer, and not on the total you receive.',
  ],
  [
    ['referral'],
    'هل أستطيع نشر كودي على حساباتي؟',
    'Can I post my code on my social accounts?',
    'A referral code is personal, and meant to be shared directly with people you know, so posting it on your accounts as a public discount offer is not allowed, and we may suspend the code if it is.',
  ],
  [
    ['referral'],
    'كم يستغرق الأمر من مشاركة الكود حتى الاستحقاق؟',
    'How long is it from sharing the code to getting paid?',
    'From sharing a referral code to the payout falling due takes between three and eight weeks from the first demo on average, depending on the developer and how they make decisions.',
  ],
  [
    ['referral'],
    'أعمل لدى جهة قد يُعدّ هذا تعارضاً معها — ماذا أفعل؟',
    'My employer might see this as a conflict of interest — what should I do?',
    'It is your responsibility to make sure nothing on your employer’s side prevents you from accepting a referral payout, and that is what the declaration you sign when you join the Referral Program covers.',
  ],
  // The partnership page's «قبل الاجتماع الأول».
  [
    ['partnership'],
    'كم تكلفة الشراكة؟',
    'What does a partnership cost?',
    'There is no fee to join Rabaed’s Partnership Program. The platform’s price for a partner is set in the meeting where we design the model, because it varies with the model and the size of the portfolio.',
  ],
  [
    ['partnership'],
    'هل تتعاملون مباشرة مع عملائي؟',
    'Do you deal with my clients directly?',
    'Whether Rabaed deals with your clients depends on the partnership model: when the platform is built into your proposal, the contract stays entirely with you, and we work with the project team on technical matters only.',
  ],
  [
    ['partnership'],
    'ماذا يحدث للمشروع إذا انتهت علاقتي بالعميل في منتصفه؟',
    'What happens to the project if my relationship with the client ends halfway through?',
    'Your relationship with a client ending partway through a project is one of the points the partnership agreement deals with explicitly, so that the project carries on without interruption and both sides’ rights are protected.',
  ],
  [
    ['partnership'],
    'هل هناك حد أدنى من المشاريع للانضمام؟',
    'Is there a minimum number of projects to join?',
    'There is no published minimum number of projects to join the Partnership Program. The models do differ with the size of the portfolio, and we will suggest the one that suits you best after the first meeting.',
  ],
  [
    ['partnership'],
    'هل يمكن الجمع بين أكثر من نمط؟',
    'Can we combine more than one model?',
    'Yes, you can combine more than one partnership model: some partners start with the approved referral and move to building the platform into their proposals after their first two projects.',
  ],
  [
    ['partnership'],
    'نحن مكتب صغير — هل البرنامج لنا؟',
    'We are a small office — is the program for us?',
    'Yes, the Partnership Program is open to small offices: mid-sized projects are Rabaed’s focus, and mid-sized and small offices are our core segment.',
  ],
];

/** One English entry for each Arabic one: a question two pages ask is an entry on each. */
export const ENGLISH_QUESTIONS: readonly EnglishQuestion[] = WRITTEN.flatMap(([pages, arabic, question, answer]) =>
  pages.map((page): EnglishQuestion => ({ page, arabic, question, answer })),
);
