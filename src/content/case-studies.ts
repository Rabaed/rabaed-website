/**
 * The words the case studies' own pages carry around the stories, per locale.
 * The stories themselves are written in the CMS (ticket 24).
 *
 * The Reference site has no case studies, so none of this is its copy. The
 * line under the index's heading is in the CMS (ticket 59,
 * `src/content/index-leads.ts`); what is left here labels the page's parts
 * rather than speaking to a reader, and moves with the English site
 * (ticket 42).
 */
export const CASE_STUDIES_COPY = {
  ar: {
    eyebrow: 'قصص العملاء',
    title: 'قصص عملاء ربائد',
    metaTitle: 'ربائد · قصص العملاء',
    siteName: 'ربائد',
    client: 'العميل',
    sector: 'القطاع',
    by: 'بقلم',
    figures: 'بالأرقام',
    challenge: 'التحدي',
    whatChanged: 'ما الذي تغيّر',
    outcome: 'النتيجة',
    images: 'من المشروع',
    untranslated: 'هذه القصة غير متاحة بالعربية بعد.',
    otherLanguage: 'اقرأها بالإنجليزية',
  },
  en: {
    eyebrow: 'Case studies',
    title: 'Rabaed case studies',
    metaTitle: 'Rabaed · Case studies',
    siteName: 'Rabaed',
    client: 'Client',
    sector: 'Sector',
    by: 'By',
    figures: 'In figures',
    challenge: 'The challenge',
    whatChanged: 'What changed',
    outcome: 'The outcome',
    images: 'From the project',
    untranslated: 'This case study is not available in English yet.',
    otherLanguage: 'Read it in Arabic',
  },
} as const;
