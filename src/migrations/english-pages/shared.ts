/**
 * The English of what the six pages share beyond their own entries (ticket
 * 42): how each appears in a search result, the Trust strip, and the four
 * opening answers ticket 35 proposed — each in the shape of its Arabic as it
 * was imported or proposed, word for word in the same places.
 */

/** `../search-settings-import/words.ts`: each page's title and description in a search result. */
export const ENGLISH_SEARCH_SETTINGS = {
  home: {
    title: 'Rabaed · Three parties. One record.',
    description: 'A Saudi platform that brings the owner, the consultant and the contractor onto one documented, dated record of every request and approval.',
  },
  product: {
    title: 'Rabaed · Product — from request to approval',
    description: 'How a single transaction travels from request to approval, and what each party sees when it opens the platform.',
  },
  start: {
    title: 'Rabaed · Get started — how we start, and FAQs',
    description: 'Three steps to going live, the guarantee, the subscription, and frequently asked questions.',
  },
  tool: {
    title: 'Rabaed · Pour Tracker and cube tests — a free tool',
    description: 'One HTML file that opens with a double-click. Log the pour; know when the 7- and 28-day cube tests fall due, before they’re late. No account, no server, your data stays with you.',
  },
  referral: {
    title: 'Rabaed · Referral Program — SAR {payout} per project',
    description: 'Refer one project and earn SAR {payout} net, while your client gets {clientDiscount} off their project’s subscription.',
  },
  partnership: {
    title: 'Rabaed · Partnership Program for engineering offices',
    description: 'A partnership designed with you: partner pricing, an office-wide licence, or the platform built into your proposal to the owner.',
  },
};

/**
 * `../trust-strip-import/logos.ts`: the strip's two lines, and each company's
 * name as the strip gives it to someone who cannot see its mark. A name
 * already in Latin letters is the same in English, and needs nothing here;
 * the four in Arabic are written as the companies' names read in English, for
 * the founder to put right where a company writes its own otherwise.
 */
export const ENGLISH_TRUST_STRIP = {
  strip: {
    caption: 'Parties using Rabaed right now',
    sectionName: 'Companies working on Rabaed',
    logos: [
      { name: 'Nawah Real Estate Investment' },
      {},
      { name: 'Alsharq Engineering Consultants' },
      { name: 'Shaheen Engineering Consultants' },
      {},
      { name: 'Amak Build' },
      {},
      {},
    ],
  },
};

/** `../answer-first-proposal/words.ts`: the four opening answers, each 30 to 60 words. */
export const ENGLISH_SECTION_OPENERS = {
  homeFourUnits:
    'Rabaed is four units working on one record: official correspondence, approvals and requests, the daily site report, and documents and revisions. Each unit serves the owner’s, the consultant’s and the contractor’s work where it happens, and they share one output: the documented Record — every request and approval dated with the name of whoever made it.',
  homeRecord:
    'The documented Record in Rabaed isn’t a feature you switch on — it’s the result of every step. Any transaction that passes through the platform carries its full record: an official letter, a material approval, a work inspection request, a schedule update or a payment application. A year on, or after the project ends, the record itself is still there.',
  productRoles:
    'In Rabaed each party opens its own part of one record: the owner, a dashboard of every project and what awaits approval; the consultant, one list of the contractor’s requests and their status; the contractor, one request, knowing who got it and when. Each side has its permissions, and Arabic forms to Saudi standards.',
  productInnerCycle:
    'Each party in Rabaed — contractor, consultant and owner — has a full internal review and approval cycle before it sends anything, which the other two never see: not its drafts, not its notes, not how many times it went round. What crosses officially is the transaction alone, dated, with the name of who sent it.',
};
