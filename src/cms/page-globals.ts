/**
 * A marketing page as one CMS entry (ticket 53): its sections, and the
 * languages it is published in.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Field, GlobalConfig, Tab } from 'payload';
import { signedIn } from './access';
import { inAdminLanguage, type Words } from './page-fields';
import { refreshSiteWhenPublished } from './revalidation';

/** Where the pages sit in the admin's menu. */
const PAGES_GROUP: Words = { ar: 'الصفحات', en: 'Pages' };

/**
 * The languages a page is published in. Arabic always: it is the site. English
 * once every word of the page is written in English — every English field is
 * required to publish while English is listed (`page-fields.ts`), so a page is
 * published in a language only with all of its words in that language (spec:
 * Content model), and publishing the Arabic never publishes an empty English.
 */
const languagesField: Field = {
  name: 'languages',
  type: 'select',
  hasMany: true,
  required: true,
  defaultValue: ['ar'],
  options: [
    { value: 'ar', label: { ar: 'العربية', en: 'Arabic' } },
    { value: 'en', label: { ar: 'الإنجليزية', en: 'English' } },
  ],
  label: { ar: 'منشورة باللغات', en: 'Published in' },
  admin: {
    position: 'sidebar',
    description: {
      ar: 'العربية دائماً. أضف الإنجليزية حين تُكتب كل نصوص الصفحة بالإنجليزية.',
      en: 'Arabic always. Add English once every word of the page is written in English.',
    },
  },
  validate: (value: unknown, { req }: { req?: Parameters<typeof inAdminLanguage>[0] }) =>
    Array.isArray(value) && value.includes('ar')
      ? true
      : inAdminLanguage(req, {
          ar: 'العربية لغة الموقع، ولا تُنشر صفحة من دونها.',
          en: 'Arabic is the site’s language; a page is not published without it.',
        }),
};

/**
 * A marketing page's CMS entry: its sections as tabs, in the page's order, and
 * the languages it is published in. Like an article, a change is saved as a
 * draft, previewed on the page itself, and reaches visitors when published.
 */
export function pageGlobal(options: {
  readonly slug: string;
  readonly label: Words;
  /** The page's path in the Arabic locale, where Preview opens it. */
  readonly path: string;
  readonly sections: Tab[];
  /**
   * Where the entry sits in the admin's menu. The pages' own group by default;
   * `null` stands it beside site settings, for words that belong to no one
   * page (ticket 59).
   */
  readonly group?: Words | null;
}): GlobalConfig {
  const { slug, label, path, sections, group = PAGES_GROUP } = options;
  return {
    slug,
    label,
    access: {
      read: signedIn,
      readVersions: signedIn,
      update: signedIn,
    },
    versions: {
      drafts: true,
      max: 100,
    },
    admin: {
      group: group ?? undefined,
      // English pages are not switched on yet (ticket 40), so a page is
      // previewed in Arabic.
      preview: () => `/api/preview?path=${encodeURIComponent(path)}`,
    },
    hooks: {
      afterChange: [refreshSiteWhenPublished],
    },
    fields: [languagesField, { type: 'tabs', tabs: sections }],
  };
}
