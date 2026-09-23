/**
 * The referral page's English (ticket 42), in the shape of its Arabic as it
 * was imported (`../referral-page-import/words.ts`), word for word in the same
 * places. Every amount stays named, `{payout}` or `{clientDiscount}`, so that
 * changing a value in the CMS changes the English page too.
 */
export const ENGLISH_REFERRAL_PAGE = {
  hero: {
    eyebrow: 'Referral Program',
    title: 'Refer one project. Earn SAR {payout}.',
    lead: 'Know a developer running their project on email and WhatsApp? Share your code, and get SAR {payout} for every project that starts with us — while they get a discount on their subscription.',
    primaryLabel: 'Sign up and get your code',
    secondaryLabel: 'How the program works ↓',
    figures: [
      { figure: 'SAR {payout}', label: 'Per project' },
      { figure: '{clientDiscount}', label: 'Discount for your client' },
      { figure: 'No limit', label: 'Number of projects' },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    heading: 'Four steps, and your part ends after the second',
    steps: [
      {
        label: 'Sign up',
        title: 'One minute',
        text: 'Fill in a one-minute form, and your own code reaches your phone and email straight away.',
      },
      {
        label: 'Share the code',
        title: 'With the decision maker',
        text: 'The code gives them {clientDiscount} off their project’s subscription — a real reason for them to use it, not just an ID for you.',
      },
      {
        label: 'We do the rest',
        title: 'No follow-up, no selling',
        text: 'They request a demo and enter the code. Our team contacts them, demonstrates the platform, and agrees the details.',
      },
      {
        label: 'Get paid',
        title: 'Within 7 working days',
        text: 'Once the subscription is paid, SAR {payout} is transferred to your account within 7 working days of the end of that month.',
      },
    ],
  },
  offer: {
    eyebrow: 'The payout and the discount',
    heading: 'A fixed amount. No tiers, no calculations.',
    paragraphs: [
      {
        text: 'We chose a fixed, known amount instead of shifting percentages:',
        bold: 'SAR {payout} net for every project',
        after: 'whose subscription starts with your code — whether it is ten thousand square metres or thirty. You know what you will receive before you refer, and you never need to ask what the subscription costs.',
      },
      { text: 'And there is no cap on the number of projects you refer in a year.' },
    ],
    sides: [
      { badge: 'For you', title: 'SAR {payout} net', text: 'For every project, transferred straight to your bank account.' },
      { badge: 'Your client', title: '{clientDiscount} off', text: 'Their project’s subscription, as soon as they use your code.' },
    ],
  },
  audience: {
    eyebrow: 'Who this program is for',
    heading: 'If you work in construction, you probably know a developer who needs us',
    lead: 'The program is open to anyone who works around property development projects in Saudi Arabia:',
    kinds: [
      { title: 'Engineers and project managers', text: 'You know first-hand how correspondence and approvals get lost.' },
      { title: 'Independent consultants', text: 'You move between different projects and developers.' },
      { title: 'Contractors and delivery firms', text: 'You work with more than one owner at a time.' },
      { title: 'Development advisers and brokers', text: 'Your relationships with developers are your real asset.' },
      { title: 'Specialist content creators', text: 'Your audience is people in the industry.' },
    ],
    partnership: {
      text: 'If you are',
      bold: 'an engineering office or a project management company',
      after: 'and want a broader arrangement than an individual referral, the Partnership Program suits you better.',
      linkLabel: 'Go to the Partnership Program →',
    },
  },
  whatIsReferred: {
    eyebrow: 'What you refer',
    heading: 'What exactly are you referring?',
    paragraphs: [
      {
        text: 'Rabaed is a platform that brings the owner, the consultant and the contractor onto one record for the project: official correspondence, meeting minutes and requests for information; approvals and inspection requests; the daily site report; and a document repository at the latest approved revision.',
      },
      {
        text: 'Every document carries with it when it was sent, who approved it, with what note, and when — so the project’s record stays complete after handover, not scattered across email, WhatsApp and shared folders whose access has expired.',
      },
    ],
    linkLabel: 'Discover the platform',
  },
  termsSummary: {
    eyebrow: 'The terms in brief',
    heading: 'The terms in eight points',
    points: [
      { bold: 'Referrals count by project, not by client.', rest: 'Each new project whose subscription starts with your code counts.' },
      { bold: 'The code is given when the demo is requested', rest: ', that is, before negotiation begins — not at signing.' },
      { bold: 'The code is not accepted for an existing client', rest: 'or for a project we have already discussed with the owner.' },
      { bold: 'The annual subscription paid in advance', rest: 'is what the payout is counted on.' },
      { bold: 'It is due once the subscription is paid', rest: ', not at signing.' },
      { bold: 'Payment within 7 working days', rest: 'of the end of the month in which it fell due, to the IBAN on file.' },
      { bold: 'Cancellation and refunds', rest: 'within the statutory refund period cancel the payout, or it is deducted from later payouts.' },
      { bold: 'No-conflict declaration', rest: 'signed electronically when you sign up.' },
    ],
    linkLabel: 'The full terms and conditions',
  },
  questions: {
    eyebrow: 'FAQ',
    heading: 'Before you sign up',
  },
  signup: {
    eyebrow: 'Sign up',
    heading: 'Your code, ready in a minute',
    lead: 'Sign up now, and share the code with the first developer who comes to mind.',
    benefits: [
      { text: 'Your code reaches your phone and email straight away' },
      { text: 'No joining fee, and no minimum number of referrals' },
      { text: 'Your part ends when you share the code' },
      { text: 'SAR {payout} net for every project, with no cap' },
    ],
    guarantee: { figure: '7 working days', text: 'to pay out from the end of the month it falls due' },
  },
};
