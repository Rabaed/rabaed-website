/**
 * The home page's English (ticket 42), in the shape of its Arabic as it was
 * imported (`../home-page-import/words.ts`), word for word in the same places
 * — so that each Arabic word's English is found beside it. Only the words are
 * here: a number, a time, a reference like SUB-031, a screen or an icon is the
 * same in both languages, and is the Arabic entry's own.
 *
 * Translated for meaning and for the room each place has, not word for word:
 * the situations are what a contractor, a consultant or an owner actually says
 * on site, and read as such in English.
 */

const DECK_HINT = 'Swipe the card left or right · or use the arrows';

/** The receipt every transaction but the schedule update records the same way. */
const received = { action: 'Received', by: 'Automatic receipt' };

export const ENGLISH_HOME_PAGE = {
  hero: {
    eyebrow: 'The construction project OS · Rabaed',
    titleLines: [{ line: 'Three parties.' }, { line: 'One record.' }],
    titleAccent: 'Clear ownership.',
    lead: 'Rabaed puts owner, consultant and contractor on one platform: approved correspondence, approvals and inspections, documents at their latest revision, daily site reports — every step dated, with the name of who took it.',
    primaryLabel: 'Book a live demo',
    secondaryLabel: 'Explore the platform ↓',
    trust: 'A demo on a real project · 30 minutes',
    guaranteePeriod: '60 days',
    guaranteePromise: 'Full money-back guarantee',
    parties: { owner: 'Owner', consultant: 'Consultant', contractor: 'Contractor' },
    diagramDescription:
      'The owner, the consultant and the contractor on one record: every transaction that passes between the three parties is documented and dated with the name of whoever took it.',
    statuses: [
      { status: 'Sent · 07:12' },
      { status: 'Reviewed · 09:20' },
      { status: 'Approved · 12:05' },
      { status: 'Record reaches all three' },
    ],
    statusAtRest: 'Documented and dated',
  },
  situations: {
    eyebrow: 'Situations from site',
    heading: 'Sound familiar?',
    close: {
      first: 'The problem isn’t email, and it isn’t Excel.',
      second: 'It’s that the process beneath them is',
      accent: 'manual, scattered.',
    },
    situations: [
      {
        quote: 'The contractor blames the consultant… the consultant says nothing arrived.',
        cost: 'A dispute with no reference, and rival copies.',
      },
      {
        quote: 'The dashboard runs off Excel… the engineer hasn’t had time to update it.',
        cost: 'A decision built on an old number.',
      },
      {
        quote: 'Two Excel files, two dates for one document… so back to the paper copy.',
        cost: 'Hours lost on one question: where is it now?',
      },
      {
        quote: 'The approval came by email months ago… and nobody can find it.',
        cost: 'An approval that exists and can’t be proved.',
      },
      {
        quote: 'The schedule changed… and the developer can’t see what it does to handover.',
        cost: 'Found out at handover, not in a progress meeting.',
      },
      {
        quote: 'After handover we needed an old approval… and the shared folder’s locked.',
        cost: 'The record is lost when the project ends.',
      },
    ],
    costLabel: 'The cost',
    deck: {
      label: 'Situations from site — swipe the card or use the arrows',
      previousLabel: 'Previous situation',
      nextLabel: 'Next situation',
      hint: DECK_HINT,
    },
  },
  fourUnits: {
    eyebrow: 'The platform',
    heading: 'Four units. One record gathers them.',
    tabsLabel: 'Rabaed’s units',
    outputLabel: 'The output',
    tabs: [
      { title: 'Official correspondence' },
      { title: 'Approvals and requests' },
      { title: 'Daily site report' },
      { title: 'Documents and revisions' },
      { title: 'The documented Record' },
    ],
    moreLabel: 'See the units in full detail',
  },
  record: {
    eyebrow: 'The documented Record',
    headingLines: [{ line: 'Don’t ask “who approved?”' }, { line: 'Open the transaction.' }],
    questions: [{ question: 'Who asked?' }, { question: 'Who received?' }, { question: 'Who approved?' }, { question: 'And when?' }],
    lead: 'It isn’t a feature you switch on — it’s the result of every step. Any transaction that passes through Rabaed carries its full record: an official letter, a material approval, a work inspection request, a schedule update or a payment application. A year on, or after the project ends, the record itself is still there.',
    types: [
      {
        label: 'Official letter',
        title: 'LTR-088 · Letter — extension of time request',
        steps: [
          { action: 'Sent', by: 'Eng. Fahd — Contractor' },
          received,
          { action: 'Checked', by: 'Eng. Sara — Consultant' },
          { action: 'Answered', by: '“14 days granted” — Owner' },
        ],
      },
      {
        label: 'Material approval (MIR)',
        title: 'SUB-031 · Material approval — façade tiles',
        steps: [
          { action: 'Sent', by: 'Eng. Fahd — Contractor' },
          received,
          { action: 'Checked', by: 'Eng. Sara — Consultant' },
          { action: 'Noted and approved', by: '“Extra colour sample” — Khalid' },
        ],
      },
      {
        label: 'Work inspection (WIR)',
        title: 'WIR-0142 · Work inspection — level 3 slab rebar',
        steps: [
          { action: 'Sent', by: 'Eng. Fahd — Contractor' },
          received,
          { action: 'Inspected on site', by: 'Eng. Sara · 4 photos' },
          { action: 'Approved', by: '“Compliant — cleared to pour”' },
        ],
      },
      {
        label: 'Schedule update',
        title: 'SCH-04 · Schedule update — August',
        steps: [
          { action: 'Update uploaded', by: 'Contractor’s planner' },
          { action: 'Received', by: 'Consultant and owner' },
          { action: 'Impact reviewed', by: '6-day delay to handover' },
          { action: 'Update approved', by: 'With a note on the critical path' },
        ],
      },
      {
        label: 'Interim payment (IPC)',
        title: 'IPC-06 · Interim payment — sixth instalment',
        steps: [
          { action: 'Submitted', by: 'Contractor — quantities done' },
          received,
          { action: 'Checked', by: 'Against approved requests' },
          { action: 'Approved to pay', by: 'Less one non-compliant item' },
        ],
      },
    ],
    stamp: '✓ Full record · 4 steps · 3 parties',
  },
  beforeAfter: {
    eyebrow: 'Before and after Rabaed',
    heading: 'The same approval… two ways.',
    lead: 'Four moments in a single material approval. *Drag the handle* across the steps — each one turns before your eyes from the usual way into Rabaed.',
    usualTag: 'The usual way',
    rabaedTag: 'With Rabaed',
    handleLabel: 'Drag to compare the two ways',
    verdicts: {
      usual: 'The result: a dispute with no reference, and rival copies.',
      rabaed: 'The result: no asking “who approved?” — the answer is in the document.',
      between: 'Drag the handle all the way to see the four steps in Rabaed.',
    },
    steps: [
      {
        name: 'The request',
        usual: { channel: 'Paper', words: 'Printed, signed by hand, and photographed on a phone.' },
        rabaed: { channel: 'Rabaed', words: 'Approval request *SUB-031* with a reference and attachments.' },
      },
      {
        name: 'Receipt',
        usual: { channel: 'WhatsApp', words: '“Send it by official email” — the request becomes a chat.' },
        rabaed: { channel: 'Automatic', words: 'A receipt *by name and time* — nobody can deny it.' },
      },
      {
        name: 'The approval',
        usual: { channel: 'Email', words: 'A reply a week later… in another thread nobody finds.' },
        rabaed: { channel: 'Recorded', words: 'Approved with notes, *and the owner sees it live*.' },
      },
      {
        name: '2 months on',
        usual: { channel: 'Excel', words: '“I never got the approval.”\nProof: a WhatsApp screenshot.' },
        rabaed: { channel: 'The Record', words: 'Open it: sent, received, checked, approved.\n*Proof: the record.*' },
      },
    ],
  },
  calculator: {
    eyebrow: 'Delay cost calculator',
    heading: 'What does a week’s delay on one approval cost you?',
    lead: 'A conservative estimate covering only financing costs and site overheads — before any claim from the contractor.',
    sliderLabels: { projectValue: 'Project value', delayDays: 'Days of delay', durationMonths: 'Project length' },
    resultLabel: 'Estimated cost of the delay',
    breakdown: { financing: 'Financing', siteOverhead: 'Site overheads' },
    assumptions:
      'Assumptions: financing at 8% a year · site overheads at 10% of the project value, spread over its length. Contractor claims and penalties are not included.',
    callToActionLabel: 'Book a demo to see how we prevent it',
    currency: 'SAR',
    days: { one: 'day', two: 'days', few: 'days', many: 'days' },
    months: { few: 'months', many: 'months' },
  },
  figures: {
    eyebrow: 'The impact',
    heading: 'What changes once you are live?',
    lead: 'The difference between a scattered manual process and a single documented one — on a project where the owner, the consultant and the contractor all work on the same platform.',
    figures: [
      {
        topic: 'Approval cycle',
        claim: 'Faster approvals and handovers',
        before: { label: 'Manual' },
        after: { label: 'Rabaed' },
        basis: 'Against the paper cycle on the same project',
      },
      {
        topic: 'Document retrieval',
        claim: 'Faster document retrieval',
        before: { label: 'Manual' },
        after: { label: 'Rabaed' },
        basis: 'Time to reach the latest approved copy',
      },
      {
        topic: 'Admin time',
        claim: 'Time saved on admin tasks',
        before: { label: 'Before' },
        after: { label: 'After' },
        basis: 'Of the project team’s weekly hours',
      },
      {
        topic: 'Document control',
        claim: 'Better document control',
        before: { label: 'Before' },
        after: { label: 'After' },
        basis: 'Full trail: who sent, who approved, and when',
      },
      {
        topic: 'Going live',
        claim: 'Fully live on site, with no stoppage',
        value: 'Under a day',
        basis: 'From first meeting to the first recorded item',
      },
      {
        topic: 'Onboarding',
        claim: 'One introductory session per team',
        value: '15 minutes',
        basis: 'One session per team, then real work',
      },
    ],
    deck: {
      label: 'Impact figures — swipe the card or use the arrows',
      previousLabel: 'Previous figure',
      nextLabel: 'Next figure',
      hint: DECK_HINT,
    },
  },
  questions: {
    eyebrow: 'FAQ',
    heading: 'Before you ask',
    moreLabel: 'All questions',
  },
};
