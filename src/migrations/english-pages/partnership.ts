/**
 * The partnership page's English (ticket 42), in the shape of its Arabic as it
 * was imported (`../partnership-page-import/words.ts`), word for word in the
 * same places. The three ways of working together are named as the
 * partnership application's English options name them
 * (`src/forms/partnership-application.ts`).
 */

const lines = (texts: string[]) => texts.map((text) => ({ text }));

export const ENGLISH_PARTNERSHIP_PAGE = {
  hero: {
    eyebrow: 'Partnership Program',
    title: 'A project management platform… inside your own proposal',
    lead: 'Rabaed’s partnership for engineering offices, project management companies and contracting groups — a way of working together designed with you, not a ready-made package offered to you.',
    primaryLabel: 'Request a partnership meeting',
    secondaryLabel: 'How we build the partnership ↓',
    figures: [
      { figure: '3 models', label: 'Of working together — we choose with you' },
      { figure: '4 stages', label: 'From first meeting to first project' },
      { figure: 'No fee', label: 'To join the program' },
    ],
  },
  idea: {
    eyebrow: 'The idea',
    heading: 'Why a partnership, not a commission?',
    paragraphs: lines([
      'An office supervising ten projects at once is not a “referrer”. It is the party that lives on the platform every day, entering approvals, notes and site reports — and the one that persuades the owner to work a better way.',
      'That is why we don’t offer offices a commission for a referral. We sit down with you, understand how you sell your services today and how you bill your client, then build a way of working together to fit — partner pricing, an office-wide licence, or the platform built into your proposal to the owner.',
    ]),
    referralNote: {
      text: 'Looking for a simpler individual arrangement — a code you share, for a fixed payout?',
      linkLabel: 'Go to the Referral Program →',
    },
  },
  audience: {
    eyebrow: 'Who this program is for',
    heading: 'Who this program is for',
    kinds: [
      { title: 'Consulting engineering offices', text: 'Supervising projects for private-sector developers.' },
      { title: 'Project management companies (PMC)', text: 'Managing portfolios of projects for several clients.' },
      { title: 'Contracting groups', text: 'Running several projects in parallel, and needing one shared record with the consultant.' },
      { title: 'Multi-project developers', text: 'Wanting an arrangement across the portfolio, not project by project.' },
    ],
  },
  modes: {
    eyebrow: 'Ways of working together',
    heading: 'Three models — and we choose with you what suits how you work',
    modes: [
      {
        label: 'Built into your proposal',
        title: 'The platform in your scope',
        text: 'You include the platform in the scope of services in your proposal to the owner, and bill it within your fees. The office gets partner pricing, and the contract with the client stays yours.',
        fit: 'Suits: offices that want to set their technical proposal apart and add income within their fees.',
      },
      {
        label: 'Office licence',
        title: 'An office-wide subscription',
        text: 'Covering the office’s current and new projects under one umbrella, with one supervision dashboard across every project.',
        fit: 'Suits: offices running a steady number of projects that want one way of working across them all.',
      },
      {
        label: 'Approved referral',
        title: 'We contract with the owner',
        text: 'You recommend the platform to the owner and we contract with them directly, with an agreed arrangement for the office and priority support on its projects.',
        fit: 'Suits: offices that would rather keep the platform out of their billing with the client.',
      },
    ],
    note: {
      before: 'The terms of each model — pricing, exclusivity, limits by region or type of client — are set in the partnership agreement, after the meeting where we design the model.',
      bold: 'We don’t set one price for all',
      after: 'because offices differ in size and in the kind of clients they serve.',
    },
  },
  benefits: {
    eyebrow: 'What a partner gets',
    heading: 'Eight commitments from us, written into the agreement',
    benefits: [
      { bold: 'Partner pricing', text: 'agreed in the agreement' },
      { bold: 'A dedicated account manager', text: 'and a single point of contact' },
      { bold: 'Onboarding for your team', text: 'on the platform, and again when new staff join' },
      { bold: 'Priority technical support', text: 'for your projects and your clients' },
      { bold: 'Project setup done for you', text: 'at launch: document structure, permissions, reference numbers' },
      { bold: 'A partner dashboard', text: 'showing your active projects and the status of each' },
      { bold: 'Joint marketing', text: '— workshops, content, and joint presence at industry events' },
      { bold: 'Priority on the roadmap', text: 'for development requests that recur across your projects' },
    ],
  },
  path: {
    eyebrow: 'The partnership path',
    heading: 'From first meeting to first project',
    lead: 'Four clear stages, and none of them asks for a final decision from you before you have seen the platform as a consultant actually uses it.',
    linkLabel: 'Request a partnership meeting',
    stageLabel: 'Stage',
    stages: [
      {
        title: 'An introductory meeting',
        text: 'A session where we learn the size of your office, the kind of clients you serve, and how your proposals are put together today — and show you the platform as a consultant actually uses it.',
      },
      {
        title: 'Designing the model',
        text: 'We agree the model, how pricing works, what each side commits to, and how success is measured.',
      },
      {
        title: 'Agreement and onboarding',
        text: 'Signing the partnership agreement, onboarding your team, and preparing the material you need to present the platform to your clients.',
      },
      {
        title: 'Launch on a first project',
        text: 'We launch with you on one project as a model, and follow it with you step by step until the work settles.',
      },
    ],
  },
  questions: {
    eyebrow: 'FAQ',
    heading: 'Before the first meeting',
  },
  apply: {
    eyebrow: 'Partnership application',
    heading: 'Let’s sit down and design the right model for your office',
    lead: 'Fill in the form, and the partnerships team will contact you within two working days.',
    reassurances: lines([
      'No joining fee, and no commitment before the introductory meeting',
      'The first meeting includes a demo of the platform',
      'The way we work together is written into an agreement, not a verbal promise',
    ]),
    responseTime: { bold: 'Two working days', text: 'to reply to your application' },
  },
};
