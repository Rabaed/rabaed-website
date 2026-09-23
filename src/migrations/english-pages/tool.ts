/**
 * The tool page's English (ticket 42), in the shape of its Arabic as it was
 * imported (`../tool-page-import/words.ts`), word for word in the same places.
 * Only the words are here: a figure, a pour's reference, a file's name or a
 * test's colour is the Arabic entry's own.
 *
 * The Arabic sells an Arabic tool to Arabic readers: a full right-to-left
 * interface, not a half-finished translation. The Pour Tracker is bilingual,
 * so the English says what it is to an English reader — both languages, each
 * the right way round — and no more than the Arabic claims.
 */

const lines = (texts: string[]) => texts.map((text) => ({ text }));

export const ENGLISH_TOOL_PAGE = {
  hero: {
    eyebrow: 'Free tool · no account · no subscription',
    title: 'Log today’s pour, and know when the cube test is due —',
    titleAccent: 'before it’s late',
    lead: 'A single HTML file that opens with a double-click on your computer. Choose a folder for it, and from then on every pour you log is written there: the countdown to 7 and 28 days, lab reports, consultant approvals, and an A4 approval sheet ready to print.',
    primaryLabel: 'Download the tool free',
    secondaryLabel: 'How does it work? ↓',
    promises: lines(['Completely free', 'Works offline', 'Your data stays with you', 'English / Arabic']),
    mock: {
      project: 'Palm Tower — Phase Two',
      tiles: [{ label: 'Pours logged' }, { label: 'Tests due soon' }, { label: 'Test overdue' }],
      pours: [
        {
          name: 'Foundations — footing F12, level −3.5',
          tests: [
            { label: '7-day break', state: 'In two days' },
            { label: '28-day break', state: 'Not due yet' },
          ],
        },
        {
          name: 'Columns — ground floor, C1 to C6',
          tests: [
            { label: '7-day break', state: 'Approved' },
            { label: '28-day break', state: '3 days overdue' },
          ],
        },
      ],
    },
  },
  why: {
    eyebrow: 'Why this tool',
    heading: 'A pour takes an hour. Following it up takes a month.',
    lead: 'Three things make a concrete file run late — and none of them has anything to do with the quality of the concrete itself.',
    cards: [
      {
        title: '7 and 28 days pass in silence',
        text: 'The only date you remember is the pour date. The cube test dates slip by inside the weekly programme with no warning, and you find out they are late the moment the consultant asks.',
      },
      {
        title: 'The report exists… somewhere',
        text: 'The lab report is on WhatsApp, the consultant’s approval is in email, and the photo of the pour is on the inspector’s phone. When you put the handover file together, you search three different places.',
      },
      {
        title: 'The spreadsheet doesn’t chase you',
        text: 'Excel is excellent at storing, and poor at reminding. It doesn’t know today’s test is overdue, and it can’t tell a test with the lab from a test with the consultant.',
      },
    ],
  },
  features: {
    eyebrow: 'What it does',
    heading: 'Six things that save you a whole month of follow-up',
    lead: 'Everything you need for a clean concrete file — in one file on your computer.',
    countdown: {
      title: 'A countdown that runs itself',
      text: 'Enter only the pour date. The tool works out the 7- and 28-day dates and gives each test a colour that tells its state from a metre away.',
      legend: {
        idle: 'Not yet',
        warn: '3 days or less',
        bad: 'Overdue',
        info: 'With the consultant',
        ok: 'Approved',
      },
    },
    cards: [
      {
        title: 'The attachment moves the status',
        text: 'Attach the lab report and the status becomes “received from lab”, and the lab reminder button disappears. Attach the consultant’s approval and the test closes green. It only moves forward — a rejected test never quietly turns approved because someone dropped in a file.',
      },
      {
        title: 'Remind the lab in one click',
        text: 'One button opens your own email with the subject and text ready, addressed to the lab email in the project details. The message comes from your address — which is what makes the chase actually land. Every reminder is logged in the test’s history.',
      },
      {
        title: 'Delivery notes as they arrive',
        text: 'Delivery notes arrive all morning, long after the pour is logged. Add a row whenever you like, or paste a whole batch from your sheet: note number, quantity, truck number, time. It saves at once and updates the total quantity.',
      },
      {
        title: 'An A4 approval sheet, ready',
        text: 'All of the pour’s data, elements, tests and photos, laid out on one sheet with the three signature boxes. Press print and hand it over as it is, or save it as a PDF.',
      },
      {
        title: 'Fully English and Arabic',
        text: 'An English interface left to right, and an Arabic one right to left — no half-finished translation, no fields the wrong way round. The chosen language is kept for everyone who opens the file.',
      },
    ],
    also: lines([
      'Several elements in one pour, tagged by building and floor',
      'Site photos are shrunk before saving so the folder doesn’t bloat',
      'Export the whole log to CSV in one click',
      'Search and filter by status, element, supplier and date',
    ]),
  },
  how: {
    eyebrow: 'Three steps',
    heading: 'From download to your first logged pour — two minutes',
    lead: 'No installation, no account, no local server, no Node, no build step.',
    steps: [
      {
        label: 'Download the file',
        title: 'One file',
        text: 'Fill in your details below and the download starts straight away. A single HTML file — save it anywhere on your computer.',
      },
      {
        label: 'Double-click to open',
        title: 'No server at all',
        text: 'In Chrome or Edge. It runs straight from the file, with no server at all. Move it to another computer and it runs there too.',
      },
      {
        label: 'Choose the project folder',
        title: 'Just once',
        text: 'The tool asks you for a folder once. From then on everything you log is written inside it, and next time you open it with one click.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Privacy',
    heading: 'Your files never leave your computer — there is nowhere for them to go',
    points: [
      {
        bold: 'There is no server we upload anything to.',
        text: 'No account, no sign-in, no database of ours. The tool knows nothing about you.',
      },
      {
        bold: 'One folder, owned by the project.',
        text: 'You choose it, and it holds the log file and the attachments folder. Copy it, put it on the internal network, or take it with you — it works as it is.',
      },
      {
        bold: 'An open text file, not a locked box.',
        text: '`concrete_db.json` — you can read it, back it up, and open it with any tool. Nothing is locked away in browser storage you can’t reach.',
      },
      {
        bold: 'It works with the internet down.',
        text: 'In a basement, on a remote site, or on a plane. (Only the fonts are fetched from the internet the first time it opens — without them the typeface changes and everything still works.)',
      },
    ],
    tree: {
      project: 'Palm Tower — Phase 2',
      entries: [
        { description: 'Every pour, test and status' },
        { description: 'Reports, approvals and photos' },
        {},
        {},
      ],
      caption: 'This is everything the tool makes on your computer. Nothing else, and nothing anywhere else.',
    },
  },
  requirements: {
    eyebrow: 'Requirements',
    heading: 'What you need to run it',
    cards: [
      { label: 'System', title: 'A desktop computer', text: 'Windows, Mac or Linux.' },
      { label: 'The full experience', title: 'Chrome or Edge', text: 'With attachments saved inside the project folder.' },
      { label: 'Simplified mode', title: 'Firefox and Safari', text: 'Logs kept inside the browser, with attachments switched off.' },
    ],
  },
  download: {
    eyebrow: 'Download',
    heading: 'Download the tool now',
    lead: 'Fill in your details and the download starts straight away. We use them to send updates and improvements to the tool — nothing more.',
    ticks: lines([
      'A full version for one project, with no time limit and no watermark',
      'One file — no installation, no account, no subscription',
      'Works offline, and your data stays in your folder',
      'Full English and Arabic interfaces, each the right way round',
    ]),
    promise: { bold: 'Two minutes', text: 'from download to your first logged pour' },
  },
  questions: {
    eyebrow: 'FAQ',
    heading: 'Before you download',
  },
  upsell: {
    eyebrow: 'The next step',
    heading: 'Need more than one project?',
    lead: 'The free tool reaches its natural limit when a second person needs the log. That is where the cloud version begins.',
    primaryLabel: 'Ask for the cloud version',
    secondaryLabel: 'Discover the platform',
    adds: lines([
      'All your projects on one dashboard, compared side by side',
      'Instant electronic approval from the consultant — no email',
      'An account for the lab to upload its report directly',
      'Linked to the Rabaed platform: documents, daily reports, correspondence',
      'A documented audit trail of every change and who made it',
    ]),
    signOff: 'Made at Rabaed for site engineers. The tool is free — use it as you wish.',
  },
};
