/**
 * The words the case studies' own pages carry around the stories, per locale.
 * The stories themselves are written in the CMS (ticket 24).
 *
 * The Reference site has no case studies, so none of this is its copy. The
 * index's lead is for Ahmed to approve or reword; ticket 21 moves page text
 * into the CMS, where he can.
 */
export const CASE_STUDIES_COPY = {
  ar: {
    eyebrow: 'قصص العملاء',
    title: 'قصص عملاء ربائد',
    lead: 'مشاريع إنشاء حقيقية انتقلت فيها الطلبات والاعتمادات إلى سجل واحد بين المالك والاستشاري والمقاول — ما كان التحدي، وما الذي تغيّر، وما النتيجة.',
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
    lead: 'Real construction projects that moved their requests and approvals onto one record between owner, consultant and contractor — the challenge, what changed, and the outcome.',
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
