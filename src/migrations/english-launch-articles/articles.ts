/**
 * The launch articles in English (ticket 43): the six of ticket 38, each
 * translated from its Arabic as drafted on 21 September 2026, to wait in the
 * CMS beside it as the English entry at the same slug.
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site does not
 * read this file: once imported, an article is read, edited and published in
 * the CMS. Changing a word here changes nothing anyone sees.
 *
 * **Drafts, reviewed by Ahmed before anything is published** — the ticket's
 * own requirement, held the way the Arabic ones are held: every article arrives
 * unpublished with its author left empty, and the CMS refuses to publish one
 * until a person's name is on it (`authorField`). An Arabic article Ahmed
 * corrects while reviewing wants the same correction here; the admin's
 * Translation column says which entries have an English one, not whether the
 * two still say the same thing.
 *
 * **A translation, not new writing.** Every claim is the Arabic article's, and
 * so the site's (see `launch-articles/articles.ts` for where each comes from);
 * a figure is written as the English site writes it, «60 days», «15 minutes»,
 * «30 minutes»; the product's words are `CONTEXT.md`'s — the Owner, the
 * Consultant and the Contractor, the Record, the Referral Program and the
 * Partnership Program. A link goes to the English address of the page, which
 * answers with an offer of the Arabic until ticket 42 writes it — except the
 * Terms, which are Arabic-only and binding in Arabic.
 *
 * The company's registered name is given as it is registered, in Arabic: it
 * has no English form in `src/content/company.ts`, and inventing one would be
 * a second name for one entity (HANDOFF §6.7).
 */
import type { Block, Inline } from '../launch-articles/body';
import type { LaunchArticle, QuestionKind } from '../launch-articles/articles';

const h2 = (text: string): Block => ({ kind: 'heading', text: [text] });
const p = (...text: Inline[]): Block => ({ kind: 'paragraph', text });
const ul = (...items: readonly Inline[][]): Block => ({ kind: 'list', items });
const quote = (text: string): Block => ({ kind: 'quote', text: [text] });

/** The one transaction the home page follows end to end, as the Arabic tells it. */
const WORK_INSPECTION_REQUEST: readonly Inline[][] = [
  ['Sent — Eng. Fahad, Contractor · 07:50'],
  ['Received — automatic receipt · 07:50'],
  ['Inspected on site — Eng. Sara, Consultant · 4 photos · 11:20'],
  ['Approved — compliant, cleared to pour · 12:05'],
];

/** Keyed as the Arabic is, so that every one of the six has its English and none is left out. */
export const ENGLISH_ARTICLE_PER_QUESTION_KIND: Record<QuestionKind, LaunchArticle> = {
  definition: {
    cover: 'stamped-sheet',
    title: 'What is Rabaed?',
    slug: 'what-is-rabaed',
    summary:
      'Rabaed is an operating system for construction projects: one documented Record of every request and approval, shared by Owner, Consultant and Contractor. What it covers, and why it is more than a place to keep files.',
    answer:
      'Rabaed is a Saudi platform that brings the Owner, the Consultant and the Contractor on a construction project onto one documented, dated Record of every request and approval. It covers official correspondence, approvals and inspection requests, the daily site report, and versioned documents — every step recorded with who took it and when, kept after the project ends.',
    body: [
      h2('What problem does Rabaed solve?'),
      p(
        'The problem Rabaed solves is not email or Excel. It is that the process underneath them is manual and scattered: the request on WhatsApp, the approval in an old email thread, the status in a spreadsheet someone has to keep up to date. Rabaed makes the process itself one documented thing, instead of spreading it across tools.',
      ),
      p('These situations come up on almost every project, and each has a cost:'),
      ul(
        [
          'The Contractor says the Consultant is holding up the work; the Consultant says nothing ever arrived — a dispute with no reference, and each side holding its own copy.',
        ],
        ['Two Excel files, and two dates for the same document — hours lost to one question: where did this get to?'],
        ['The approval came by email months ago and nobody can find it — an approval that exists and cannot be proven.'],
        [
          'After the project ended we needed an old approval, and access to the shared folder was locked — the project’s record lost when the project ends.',
        ],
      ),
      h2('Four units, and one Record that joins them'),
      p(
        'Rabaed covers the four units every transaction on a project passes through: official correspondence, approvals and inspection requests, the daily site report, and versioned documents. The four do not work each on its own: they all feed one Record, which is what sets the platform apart from four separate programs.',
      ),
      ul(
        [
          { strong: 'Official correspondence' },
          ': letters, minutes of meetings and RFIs with automatic reference numbers, and an automatic receipt that records who received what, and when.',
        ],
        [
          { strong: 'Approvals and requests' },
          ': approvals of suppliers, materials and drawings, and work inspection requests (WIR), material inspection requests (MIR) and permits to work — and in the other direction, non-conformance reports (NCR) and site instructions.',
        ],
        [
          { strong: 'Daily site report' },
          ': manpower, equipment, weather, the day’s progress and photos, sent from a phone on site and on the Owner’s dashboard at once.',
        ],
        [
          { strong: 'Documents and versions' },
          ': one repository for the project, only the approved version visible to the site, and defined permissions for each party.',
        ],
      ),
      h2('What is the documented Record?'),
      p(
        'The documented Record is not a feature you switch on. It is what every step leaves behind. Any transaction that passes through Rabaed carries its whole history: when it was sent, who received it, who reviewed it, who approved it, with what comments, and when. That is why nobody on the project asks who approved something — they open the transaction.',
      ),
      p('An example from one work inspection request, begun and finished on the same day:'),
      ul(...WORK_INSPECTION_REQUEST),
      p(
        'The four steps are not messages scattered across four places: they are the document itself. A year later, or after the project has ended, the same Record is still there.',
      ),
      h2('Who is it for?'),
      p(
        'Rabaed is built for all three parties on a construction project together, not for one of them: the Owner or developer, the Consultant, and the Contractor. Each sees what concerns them when they open the platform, and each party has a full internal review cycle the other two never see — only the official transaction crosses over.',
      ),
      ul(
        [
          { strong: 'The Owner or developer' },
          ': one dashboard for all your projects — what is waiting for your approval, what is past its deadline, and what happened on site today.',
        ],
        [
          { strong: 'The Consultant' },
          ': the Contractor’s requests in one list with their status, and approval with your comments from the office or from site.',
        ],
        [
          { strong: 'The Contractor' },
          ': one request instead of five messages — you know who received it and when, and its status without a phone call.',
        ],
      ),
      h2('How do you get started?'),
      p(
        'Going live takes days, not months. The Rabaed team comes to the site, sets up the project, its forms and its parties, spends 15 minutes with each team, and everyone starts from where the project already is. Activation itself takes less than a day, with no pause in the work and no transition period.',
      ),
      p(
        'And there is a 60-day guarantee from the date of activation: if you decide to stop within it, we refund the full amount paid and hand you a complete copy of your project’s Record. The details, and the common questions, are on the ',
        { link: 'Get started page', href: '/en/start' },
        '.',
      ),
    ],
  },
  comparison: {
    cover: 'correspondence',
    title: 'Rabaed vs WhatsApp, email and Excel',
    slug: 'rabaed-vs-whatsapp-email-excel',
    summary:
      'The difference is not whether a message arrives, but what is left once it has. A plain comparison of running a project’s requests and approvals on WhatsApp, email and Excel, and running them on one Record.',
    answer:
      'WhatsApp, email and Excel carry the message, but they do not create a record: no reference number, no receipt nobody can deny, and no single status all three parties see. Rabaed keeps all of it in one documented, dated place, so two months later you do not need a screenshot to prove you sent it.',
    body: [
      h2('The same approval… two ways'),
      p(
        'Take one material approval and go through it twice: once the usual way, and once on Rabaed. The four steps are the same — the request, the receipt, the approval, and the question two months later — but what is left at the end is entirely different, and that difference shows on the day of a dispute, not the day it was sent.',
      ),
      ul(
        [
          { strong: 'The request' },
          ' — the usual way: printed, signed by hand, photographed on a phone. On Rabaed: an approval request with a reference number and its attachments.',
        ],
        [
          { strong: 'The receipt' },
          ' — the usual way: “send it as a formal email”, and the request turns into a conversation. On Rabaed: an automatic receipt with a name and a time, which nobody can deny.',
        ],
        [
          { strong: 'The approval' },
          ' — the usual way: a reply a week later, in another thread nobody can find. On Rabaed: an approval with comments, and the Owner sees the status as it happens.',
        ],
        [
          { strong: 'Two months later' },
          ' — the usual way: “I never got the approval”, and the proof is a screenshot. On Rabaed: open the document — sent, received, reviewed, approved.',
        ],
      ),
      h2('WhatsApp: quick to send, powerless to prove'),
      p(
        'WhatsApp is the quickest way to alert a colleague, and the worst way to keep an approval. The message disappears into a conversation that runs for months; no reference number ties it to the document, and nothing in it tells a draft or a personal view from a formal decision. When there is a dispute the proof becomes a screenshot, and a screenshot is not proof.',
      ),
      p(
        'And there is more to it: a conversation belongs to the phones it is on. An engineer leaves the company, and half the project’s history leaves with him.',
      ),
      h2('Email: keeps everything, finds nothing'),
      p(
        'Email does keep the messages, and that is its problem: it keeps them all alike. The approval that came months ago is in there somewhere, but finding it takes someone who remembers the subject line and who was copied in. And nothing in email says that this particular message is the final decision.',
      ),
      p(
        'Because each party has its own inbox, there is no single version of the truth: the Contractor has one thread, the Consultant another, the Owner a third — and all three are incomplete.',
      ),
      h2('Excel: a picture of a day gone by'),
      p(
        'A spreadsheet describes the status; it does not make it. Someone opens it and writes in what they understood from a message they received, and the file becomes an opinion rather than a record. As soon as the engineer is busy for a week the number on the dashboard is out of date, and a decision that was meant to rest on reality rests on it.',
      ),
      p('Then come the copies: two files, two dates for the same document, and back to paper to be sure.'),
      h2('What exactly does Rabaed add?'),
      p(
        'Rabaed does not add a fifth channel to the four; it replaces the process itself. The request is raised once with a reference number, received automatically with a name and a time, approved with comments visible to all three parties, and kept with every one of its steps inside the document — not in four places, each needing someone to remember it.',
      ),
      ul(
        ['An automatic reference number for every transaction, and an automatic receipt with who received it and when.'],
        ['One status for each request, seen by the Owner, the Consultant and the Contractor at the same moment.'],
        ['One approved version visible to the site, and defined permissions for each party.'],
        ['A full internal review cycle within each party, which the other two never see.'],
        ['A Record that stays after the project ends, and belongs to the project’s Owner in every case.'],
      ),
      h2('So when is WhatsApp enough?'),
      p(
        'It is enough when a message has no contractual weight: a note that the concrete has arrived, or a question about when a meeting is. The trouble starts when something that costs time or money goes through it — a work inspection request, a material approval, an extension of time. Then what is needed is not a message that arrives, but a transaction that can be proven.',
      ),
      p('The four units, and what each party sees in them, are on the ', { link: 'Product page', href: '/en/product' }, '.'),
    ],
  },
  how: {
    cover: 'kanban',
    title: 'How does a transaction go from request to approval?',
    slug: 'from-request-to-approval',
    summary:
      'Step by step: what happens to a work inspection request from the moment the Contractor prepares it until it is a documented approval in the project’s Record — and what stays inside each party and never crosses over.',
    answer:
      'A transaction goes through five steps: preparation inside the party sending it, then sending with a reference number, then an automatic receipt with a name and a time, then review by the other party, then a decision to approve or reject, with comments. All five are recorded inside the transaction itself, not in scattered messages.',
    body: [
      h2('Before it is sent: the internal cycle'),
      p(
        'Each party has a full internal review and approval cycle before it sends anything, and the other two parties never see that cycle at all: not its drafts, not its comments, not how many times it went round. At the Contractor it passes the site engineer, then the technical office, then the project manager, and then one transaction goes out.',
      ),
      quote('Work freely within your own walls — nothing counts against you until you send it.'),
      h2('Step one: sending, with a reference number'),
      p(
        'When the transaction goes out it takes an automatic reference number and a type: a letter, a material approval, a work inspection request, a schedule update, or a payment certificate. The number is not a formality: it is what makes it possible to talk about the transaction six months later without searching an inbox.',
      ),
      h2('Step two: the receipt'),
      p(
        'The system records the receipt automatically at that same moment, with the name of who received it and when. This is the step that does away with the sentence heard most often on construction projects: nothing ever reached me. It is no longer one party’s word against another’s, but a line inside the transaction that everyone can see.',
      ),
      h2('Step three: the review'),
      p(
        'The other party opens the transaction and reviews it, and the review is recorded with their name and the time, as the receipt was. The Consultant can review from the office or from site, on a phone, and can inspect on site and attach the photos — so the site inspection becomes part of the transaction rather than a separate message sent after it.',
      ),
      h2('Step four: the decision'),
      p(
        'The path ends with a documented decision: approved, approved with comments, rejected with comments, a non-conformance report (NCR), or a site instruction. The decision carries the name of whoever made it, the time and the comment, and reaches all three parties at the same moment — so the Owner sees the status without waiting for the progress meeting.',
      ),
      h2('What is left afterwards?'),
      p(
        'What is left is the transaction itself, carrying its four steps with their names, times and comments, so nobody on the project asks who approved it — they open the transaction. A year later, or after the project and the subscription have ended, the same Record is still there — and it belongs to the project’s Owner in every case.',
      ),
      p('An example of a work inspection request for the rebar of the third-floor slab, begun and finished on the same day:'),
      ul(...WORK_INSPECTION_REQUEST),
      p('The unit this path runs through is described on the ', { link: 'Product page', href: '/en/product' }, '.'),
    ],
  },
  useCase: {
    cover: 'approvals-table',
    title: 'An engineering office supervising five projects: what does the week look like on Rabaed?',
    slug: 'engineering-office-five-projects',
    summary:
      'A representative case of a consultancy supervising five projects at once: where its team’s time goes today, and what changes when requests and approvals move onto one Record.',
    answer:
      'An office supervising five projects deals with five ways of working and five places for files. On Rabaed, the Contractors’ requests sit in one list with their status, approval happens from the office or from site, and each project keeps its own Record — so less time goes on tracking what arrived and who replied.',
    body: [
      quote(
        'This is a representative case written for illustration, not a customer story. Rabaed’s customer stories are published with the customer’s consent, each on a page of its own.',
      ),
      h2('Where does the time go today?'),
      p(
        'The time does not go on engineering; it goes on keeping track of it. The discipline engineer opens their inbox to find out which requests have arrived, the supervision manager asks after a request sent last week, and the project manager pieces together from the two a picture to show the Owner — all before a single drawing has been reviewed.',
      ),
      p(
        'With five projects that happens five times over, and in five ways: one project on WhatsApp, one on email, one with a spreadsheet someone updates when they find the time.',
      ),
      h2('What changes in the first week?'),
      p(
        'The first thing to change is the question itself. Instead of asking where a request has got to, you open one list with every inspection, test and approval request, with its status, its discipline and its type. Approval happens with your comments from the office or from site, and non-conformance reports and site instructions are issued from a phone — all of it documented with your name and the time.',
      ),
      h2('And our internal reviews?'),
      p(
        'They stay inside the office, as they are. Each party has a full internal review and approval cycle before it sends anything: the discipline engineer, then the supervision manager, then the project manager — with no limit on the number of rounds, and nothing showing outside the office. What crosses over to the Contractor and the Owner is the official decision alone.',
      ),
      h2('Will it make us answerable for delays?'),
      p(
        'This objection comes up often, and the answer is that the Record works both ways. It documents that you replied on time, just as it documents a request that reached you incomplete, as it reached you. An office that replies within its deadline has nothing to lose from a dated Record — and something to gain when it is asked why there was a delay.',
      ),
      h2('And if the office wants an arrangement across its portfolio?'),
      p(
        'There is a Partnership Program for engineering offices and project management companies, with three modes chosen with the office: including the platform in your proposal to the Owner, an office-wide licence covering its current and new projects, or an approved referral where we contract with the Owner ourselves. There is no fee to join the program.',
      ),
      p(
        'The three modes, and how a partnership proceeds, are on the ',
        { link: 'Partnership Program page', href: '/en/partnership' },
        '.',
      ),
    ],
  },
  objection: {
    cover: 'submittal',
    title: 'What if the Contractor refuses to use the platform? And what about our data?',
    slug: 'what-if-the-contractor-refuses',
    summary:
      'Four objections that come up before going live — that the Record will be used against us, our internal drafts, one party refusing, and who owns the data — and a plain answer to each.',
    answer:
      'The most common objection is not technical; it is about accountability: each party fears the Record will be used against it. The answer is that there is one Record for everyone — it documents the Contractor submitting on time as it documents a late reply, and the Consultant replying on time as it documents a request that arrived incomplete.',
    body: [
      h2('It will be used against us'),
      p(
        'That is what the Contractor says, and the Consultant says the same of its own side: it will make us answerable for the delays. The answer is the same because the Record is the same: it takes no side, it records what happened, with names and times. The Contractor who submitted on time holds the proof, and so does the Consultant who replied within the deadline.',
      ),
      p('The only party that loses from a dated Record is the one that relied on there being no reference.'),
      h2('What about our drafts and internal comments?'),
      p(
        'They do not cross over. Each party has a full internal review cycle that the other two never see at all: the drafts, the internal comments, the objections, and the number of review rounds. What crosses over is the official transaction alone, with the moment it was sent and the name of whoever sent it — and only from that moment does it become part of the documented Record.',
      ),
      h2('And if one of the parties refuses?'),
      p(
        'The subscription is annual, per project, and covers all of the project’s parties and users at no extra cost to them, so a refusal is rarely about cost. When it happens, the reason is time: a busy team wary of a new system. That is why activation takes less than a day with no pause in the work, and one introductory session of 15 minutes for each team.',
      ),
      p(
        'Nor does the team start from nothing: everyone starts from where the project already is, the current approved documents are uploaded, and new requests start from day one — so a project that has been running for a year works just as well as one starting tomorrow.',
      ),
      h2('And who owns the data?'),
      p(
        'The Record belongs to the project’s Owner, not to the platform. After the project or the subscription ends, one of two things is chosen: continued access to it for a nominal annual subscription set by the size of the data, or a complete copy of it on an external drive. And within the project itself each party has defined permissions, and nobody sees more than concerns them.',
      ),
      h2('And if it does not suit us after going live?'),
      p(
        'There is a 60-day guarantee from the date of activation: if you decide to stop within it, we refund the full amount paid and hand you a complete copy of your project’s Record. And we ask you to run it on a real project rather than a side trial, because what is being tested here is a way of working between three parties, not a piece of software’s interface.',
      ),
      p(
        'The rest of the questions before going live are on the ',
        { link: 'Get started page', href: '/en/start' },
        ', and the terms of the guarantee itself are in the ',
        { link: 'Terms and conditions', href: '/terms' },
        ', published in Arabic, which is the binding text.',
      ),
    ],
  },
  entity: {
    cover: 'overview',
    title: 'Who is behind Rabaed? And where does it work from?',
    slug: 'who-is-behind-rabaed',
    summary:
      'The company behind the Rabaed platform, where it is based, and what it offers besides the platform — from the free tool for the engineer on site to the Referral Program and the Partnership Program.',
    answer:
      'Rabaed is a product of شركة ربائد البناء, based in Riyadh, Saudi Arabia, with unified national number 7050078786. The company works on a single platform for construction projects that brings the Owner, the Consultant and the Contractor onto one documented Record, and offers beside it a free tool for the engineer on site and two programs: referrals and partnerships.',
    body: [
      h2('The company'),
      p(
        'The company is registered as شركة ربائد البناء, with unified national number 7050078786, and is based in Riyadh, Saudi Arabia. The product’s name is written ربائد in Arabic and Rabaed in English, and its official website is rabaedapp.com. Any other spelling of the name is not ours, and any other platform is not Rabaed.',
      ),
      h2('Why was Rabaed built in Saudi Arabia?'),
      p(
        'Because the forms a Saudi project runs on are not a translation: work inspection requests (WIR), material inspection requests (MIR), non-conformance reports (NCR), approvals and letters — in Arabic, in the formats used on our projects, and tailored to each project. The interface is Arabic first, and available in English for the engineers on the same project who do not speak Arabic.',
      ),
      h2('What does Rabaed offer besides the platform?'),
      p(
        'Three things, each with a page of its own. A free tool for the engineer on site that records concrete pours and cube test results, and works with no account and no internet connection. A Referral Program for individuals who introduce a developer to the platform. And a Partnership Program for engineering offices, project management companies and contracting groups.',
      ),
      ul(
        [
          { strong: 'Pour Tracker' },
          ': a single file that runs on your computer, with no server and no data uploaded — ',
          { link: 'the tool’s page', href: '/en/tool' },
        ],
        [
          { strong: 'Referral Program' },
          ': a code you share with a developer you know, and your part ends when you share it — ',
          { link: 'about the program', href: '/en/referral' },
        ],
        [
          { strong: 'Partnership Program' },
          ': a way of working together designed with the office, with no fee to join — ',
          { link: 'about the program', href: '/en/partnership' },
        ],
      ),
      h2('How do you get in touch?'),
      p(
        'The clearest way is to book a live demo on a real project: 30 minutes, in Arabic, in which the team shows the platform as the Consultant and the Contractor actually use it. For offices that want an arrangement across their portfolio, there is a partnership meeting request, which the partnerships team answers within two working days; the first meeting includes a demo of the platform.',
      ),
      p('Start from the ', { link: 'Get started page', href: '/en/start' }, '.'),
    ],
  },
};
