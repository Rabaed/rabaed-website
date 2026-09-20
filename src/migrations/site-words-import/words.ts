/**
 * The words every page shared in code until ticket 59, and the two index
 * leads, as the site said them: the header's menu from
 * `src/content/navigation.ts`, the footer's lines from `site-footer.tsx`, the
 * not-found page from `app/not-found.tsx`, and the leads from
 * `src/content/blog.ts` and `src/content/case-studies.ts`.
 *
 * **Frozen.** This is the first published version of each entry, and the site
 * does not read it: it reads the CMS, which an Editor has changed since. A
 * word here is changed only to correct what this migration imported, never to
 * change what the site says.
 */

const arabic = (text: string) => ({ ar: text });

export const SITE_WORDS = {
  header: {
    links: [
      { label: arabic('الرئيسية'), path: '/' },
      { label: arabic('المنتج'), path: '/product' },
      { label: arabic('قصص العملاء'), path: '/case-studies' },
      { label: arabic('ابدأ'), path: '/start' },
    ],
    partnershipsLabel: arabic('الشراكات'),
    partnerships: [
      {
        label: arabic('برنامج الإحالة'),
        summary: arabic('شارك كودك مع مطوّر تعرفه'),
        path: '/referral',
      },
      {
        label: arabic('برنامج الشراكات'),
        summary: arabic('للمكاتب الهندسية وشركات إدارة المشاريع'),
        path: '/partnership',
      },
    ],
    signInLabel: arabic('تسجيل الدخول'),
    signInUrl: 'https://rabaedapp.com/signin?lang=ar_ar',
    demoLabel: arabic('احجز عرضاً حياً'),
  },
  footer: {
    tagline: arabic('نظام تشغيل مشاريع الإنشاء · الرياض · rabaedapp.com'),
    legalLinks: [
      { label: arabic('الشروط والأحكام'), path: '/terms' },
      { label: arabic('سياسة الخصوصية'), path: '/privacy' },
    ],
    rights: arabic('ربائد · جميع الحقوق محفوظة'),
  },
  notFound: {
    heading: arabic('الصفحة غير موجودة'),
    lead: arabic('الرابط الذي طلبته غير متاح.'),
    homeLabel: arabic('العودة إلى الصفحة الرئيسية'),
  },
};

/** Both indexes are published in English as well as Arabic (tickets 23 and 24). */
export const INDEX_LEADS = {
  blog: {
    lead: {
      ar: 'مقالات عن إدارة مشاريع الإنشاء في السعودية: المراسلات والطلبات والاعتمادات، وكيف يبقى سجل المشروع واحداً بين المالك والاستشاري والمقاول.',
      en: 'Articles on running construction projects in Saudi Arabia: correspondence, requests and approvals, and keeping one project record between owner, consultant and contractor.',
    },
  },
  caseStudies: {
    lead: {
      ar: 'مشاريع إنشاء حقيقية انتقلت فيها الطلبات والاعتمادات إلى سجل واحد بين المالك والاستشاري والمقاول — ما كان التحدي، وما الذي تغيّر، وما النتيجة.',
      en: 'Real construction projects that moved their requests and approvals onto one record between owner, consultant and contractor — the challenge, what changed, and the outcome.',
    },
  },
};
