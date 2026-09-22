/**
 * The company, as the site describes it to search engines and AI assistants
 * (ticket 32): its names, its registration and where it is, written once so
 * that every page names it the same way. An entity named two ways is read as
 * two entities (HANDOFF §6.7).
 *
 * The names and the unified number are CONTEXT.md's; the product line is the
 * co-founder's own (HANDOFF §6.3). How to reach the company — email, phone,
 * social accounts — is Ahmed's to change, and lives in the CMS's site settings.
 */
export const COMPANY = {
  name: { ar: 'ربائد', en: 'Rabaed' },
  legalName: 'شركة ربائد البناء',
  /** The Saudi unified national number of the establishment — not a tax number. */
  unifiedNumber: { label: 'الرقم الموحد', value: '7050078786' },
  locality: { ar: 'الرياض', en: 'Riyadh' },
  country: 'SA',
  /** The wordmark in its colours, on a transparent ground. */
  logo: '/brand/rabaed-wordmark-on-light.webp',
  /**
   * The co-founder's line, and its English (ticket 42), which says the same
   * in the words `CONTEXT.md` gives the three parties and the Record.
   */
  productDescription: {
    ar: 'نظام تشغيل مشاريع الإنشاء: يجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
    en: 'The operating system for construction projects: it brings the owner, the consultant and the contractor onto one documented, timestamped record of every request and approval.',
  },
} as const;
