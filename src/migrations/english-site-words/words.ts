/**
 * The English of the words every page shares (ticket 40): the header's menu,
 * the footer's lines and the not-found page, as proposed to the founder for
 * his approval. Written as a draft and published by nobody but him — the
 * words are his, as ticket 35's were.
 *
 * **Frozen.** This is what the migration proposed on the day it ran, and the
 * site does not read it: it reads the CMS, where the founder may have changed
 * any of it before publishing. A word here is changed only to correct what
 * this migration wrote, never to change what the site says.
 *
 * Each word is the Arabic one's meaning within the room its place in the
 * design has (`src/cms/globals/site-words.ts`), which is why three are not the
 * obvious English: «قصص العملاء» is «Customers» because «Case studies» is a
 * character over the menu's eleven, «الشراكات» is «Partners» for the same
 * reason, and «احجز عرضاً حياً» drops «live» to fit the button's fifteen.
 *
 * A link is found by where it goes, not by its place in the list, since an
 * Editor may have reordered the menu before this runs. The Referral Program
 * and the Partnership Program keep the names `CONTEXT.md` gives them.
 */
export const ENGLISH_SITE_WORDS = {
  header: {
    links: {
      '/': 'Home',
      '/product': 'Product',
      '/case-studies': 'Customers',
      '/start': 'Get started',
    },
    partnershipsLabel: 'Partners',
    partnerships: {
      '/referral': { label: 'Referral Program', summary: 'Share your code with a property developer you know' },
      '/partnership': {
        label: 'Partnership Program',
        summary: 'For engineering offices and project management companies',
      },
    },
    signInLabel: 'Sign in',
    demoLabel: 'Book a demo',
  },
  footer: {
    tagline: 'Operating system for construction projects · Riyadh · rabaedapp.com',
    legalLinks: {
      '/terms': 'Terms and conditions',
      '/privacy': 'Privacy policy',
    },
    rights: 'Rabaed · All rights reserved',
  },
  /**
   * Never shown: the not-found page answers in Arabic alone, since an address
   * that matched nothing names no language (`src/app/not-found.tsx`). Written
   * because the CMS publishes the entry in English only with every word of it
   * in English, and a proposal that could not be published is no proposal.
   */
  notFound: {
    heading: 'Page not found',
    lead: 'The link you asked for is not available.',
    homeLabel: 'Back to the home page',
  },
};
