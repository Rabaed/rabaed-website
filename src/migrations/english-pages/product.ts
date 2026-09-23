/**
 * The product page's English (ticket 42), with the closing section it shares
 * with the home page, in the shape of their
 * Arabic as it was imported (`../product-page-import/words.ts`), word for
 * word in the same places. Only the words are here: a screen, a unit's being
 * the last, the arrow between two parties is the Arabic entry's own.
 */

export const ENGLISH_PRODUCT_PAGE = {
  hero: {
    eyebrow: 'Product',
    title: 'Rabaed’s units — and what each party sees of them.',
    lead: 'Four units that cover everything passing between the parties, then what each party sees when it opens the platform, then what stays inside its own side and never crosses to the others.',
    primaryLabel: 'Book a live demo',
    secondaryLabel: 'Start with the units ↓',
  },
  journey: {
    eyebrow: 'The platform',
    heading: 'Four units. One record gathers them.',
    outputLabel: 'The output',
    panels: [
      {
        title: 'Official correspondence',
        tagline: 'A letter with a reference number, and a receipt nobody can deny.',
        body: 'Letters, meeting minutes, RFIs — numbered automatically, with an automatic receipt that records who received what, and when.',
        flow: [{ party: 'Any party' }, { party: 'Any party' }],
      },
      {
        title: 'Approvals and requests',
        tagline: 'From material approval to inspection: one path, contractor to consultant.',
        body: 'Supplier, material, drawing and document approvals · inspection requests (WIR), material inspections (MIR) and permits to work · and the other way: NCRs, site instructions and final snag lists.',
        flow: [{ party: 'Contractor' }, { party: 'Consultant' }, { party: 'Consultant' }, { party: 'Contractor' }],
      },
      {
        title: 'Daily site report',
        tagline: 'What happened on site today, with the owner before the day is out.',
        body: 'Labour, equipment, weather, the day’s output, photos — sent from a phone on site, and on the owner’s dashboard at once.',
        flow: [{ party: 'Site' }, { party: 'Consultant' }, { party: 'Owner' }],
      },
      {
        title: 'Documents and revisions',
        tagline: 'Everyone on the latest approved revision — and nobody sees more than is theirs.',
        body: 'One repository for the project: drawings and documents with their revisions, only the approved revision visible on site, and set permissions for each party.',
        flow: [{ party: 'Owner' }, { party: 'Consultant' }, { party: 'Contractor' }],
      },
      {
        title: 'The documented Record',
        tagline: 'Three parties. One record.',
        body: 'Every document in Rabaed carries its full history: when it was sent, who received, checked and approved it — with what notes, and when. Not a feature you switch on, but the result of every step.',
      },
    ],
  },
  customStrip: {
    eyebrow: 'Tailored to the project',
    heading: 'Does your project need more?',
    badge: 'Per project',
    features: [
      {
        title: 'Schedules and progress',
        body: 'Import Primavera P6 and MS Project schedules, the critical path, and the effect of every schedule update on the handover date.',
      },
      {
        title: 'Bills of quantities and payments',
        body: 'An interactive bill of quantities, and payment applications built on the requests actually approved — not on what gets written at month end.',
      },
    ],
    askLabel: 'Ask about them in the demo →',
  },
  roles: {
    eyebrow: 'For each party',
    heading: 'What does each party see when it opens the platform?',
    roles: [
      {
        party: 'Owner / developer',
        promise: 'One dashboard for all your projects.',
        body: 'What is waiting for your approval, what is past its deadline, and what happened on site today — without a progress meeting, and without an Excel file that needs someone to update it.',
        objection: '“I don’t have time to keep up with a new system.”',
        answer: 'You don’t go in to keep up; you go in to approve. Everything else reaches you, ready to read, on one dashboard.',
      },
      {
        party: 'Consultant',
        promise: 'The contractor’s requests in one list.',
        body: 'Every inspection and approval request in front of you with its status. Approve with your notes from the office or on site, and issue NCRs and site instructions from your phone — all recorded with your name and time.',
        objection: '“It will make us answer for delays.”',
        answer: 'The opposite: it records that you answered on time, and records a request that reached you incomplete just as it arrived.',
      },
      {
        party: 'Contractor',
        promise: 'One request instead of five messages.',
        body: 'Submit the request, know who received it and when, and know its status without a phone call. And if the approval is late, your record is ready to show when you sent it and when it arrived.',
        objection: '“It will be used against us.”',
        answer: 'The record is the same for everyone: it records your submission on time just as it records a late reply to it.',
      },
    ],
    sharedPromises: [
      'Arabic forms to Saudi standards',
      'One approved revision',
      'Permissions for each party',
      'Works from your phone',
      'In English for non-Arabic teams',
    ],
  },
  innerCycle: {
    eyebrow: 'Inside each party',
    heading: 'What stays with you, and what crosses to the other side?',
    lead: 'Each party has a full internal review and approval cycle before it sends anything. The other two parties never see this cycle — not its drafts, not its notes, not how many times it went round. What crosses is the official transaction alone.',
    cycles: [
      {
        party: 'Contractor',
        note: 'Prepares the request before sending it.',
        reviewers: ['Site engineer', 'Technical office', 'Project manager'],
        crosses: 'Work inspection request · material approval · letter — dated, with who sent it.',
      },
      {
        party: 'Consultant',
        note: 'Reviews and decides before replying.',
        reviewers: ['Discipline engineer', 'Supervision manager', 'Project manager'],
        crosses: 'Approval or rejection with notes · non-conformance · site instruction.',
      },
      {
        party: 'Owner / developer',
        note: 'Weighs the decision before approving.',
        reviewers: ['Project manager', 'Contracts', 'Decision maker'],
        crosses: 'Consent · reply to a letter · payment approval.',
      },
    ],
    privateTag: 'Internal cycle · private',
    reviewAgain: 'Revise and review inside — no limit, no trace outside',
    crossesLabel: 'Crosses officially',
    staysInside: {
      label: 'What stays inside your side',
      text: 'Drafts, internal notes, objections, and how many review rounds it took.',
      emphasis: 'Work freely inside your own walls — nothing counts against you until you send it.',
    },
    crossesOut: {
      label: 'What crosses to the others',
      text: 'Only the official transaction, at the moment it was sent and with the name of who sent it.',
      emphasis: 'From that moment it becomes part of the documented Record.',
    },
  },
};

/** «كيف نبدأ معك», which the home and product pages both end on. */
export const ENGLISH_CLOSING_SECTION = {
  eyebrow: 'How we start with you',
  heading: 'Our team on your site. All three parties on the platform within days.',
  steps: [
    { label: 'Set up', text: 'We set up the project and its forms, invite the owner, the consultant and the contractor — and spend 15 minutes with each team.' },
    { label: 'Go live', text: 'In under a day, with no stoppage. Everyone starts from where the project has got to.' },
    { label: 'Guarantee', text: '60 days from activation — or we refund the full amount, and hand you a complete copy of the record.' },
  ],
  moreLabel: 'Details and FAQs →',
};
