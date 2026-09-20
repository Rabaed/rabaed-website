/**
 * The words the blog's own pages carry around the articles, per locale. The
 * articles themselves are written in the CMS (ticket 23).
 *
 * The Reference site has no blog, so none of this is its copy. The line under
 * the index's heading is in the CMS (ticket 59, `src/content/index-leads.ts`);
 * what is left here labels the page's parts rather than speaking to a reader,
 * and moves with the English site (ticket 42).
 */
export const BLOG_COPY = {
  ar: {
    eyebrow: 'المدونة',
    title: 'مدونة ربائد',
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
