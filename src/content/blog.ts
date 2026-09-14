/**
 * The words the blog's own pages carry around the articles, per locale. The
 * articles themselves are written in the CMS (ticket 23).
 *
 * The Reference site has no blog, so none of this is its copy. The index's
 * lead is for Ahmed to approve or reword; ticket 21 moves page text into the
 * CMS, where he can.
 */
export const BLOG_COPY = {
  ar: {
    eyebrow: 'المدونة',
    title: 'مدونة ربائد',
    lead: 'مقالات عن إدارة مشاريع الإنشاء في السعودية: المراسلات والطلبات والاعتمادات، وكيف يبقى سجل المشروع واحداً بين المالك والاستشاري والمقاول.',
    metaTitle: 'ربائد · المدونة',
    siteName: 'ربائد',
    empty: 'لم تُنشر مقالات بعد.',
    pages: 'صفحات المدونة',
    newer: 'المقالات الأحدث',
    older: 'المقالات الأقدم',
    page: 'الصفحة',
    of: 'من',
    by: 'بقلم',
    untranslated: 'هذه المقالة غير متاحة بالعربية بعد.',
    otherLanguage: 'اقرأها بالإنجليزية',
  },
  en: {
    eyebrow: 'Blog',
    title: 'The Rabaed blog',
    lead: 'Articles on running construction projects in Saudi Arabia: correspondence, requests and approvals, and keeping one project record between owner, consultant and contractor.',
    metaTitle: 'Rabaed · Blog',
    siteName: 'Rabaed',
    empty: 'No articles have been published yet.',
    pages: 'Blog pages',
    newer: 'Newer articles',
    older: 'Older articles',
    page: 'Page',
    of: 'of',
    by: 'By',
    untranslated: 'This article is not available in English yet.',
    otherLanguage: 'Read it in Arabic',
  },
} as const;
