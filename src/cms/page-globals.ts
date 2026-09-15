/**
 * A marketing page as one CMS entry (ticket 53): its sections, and the
 * languages it is published in.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Field, GlobalAfterChangeHook, GlobalConfig, Tab } from 'payload';
import { signedIn } from './access';
import type { Words } from './page-fields';
import { refreshSite } from './revalidation';

/** Where the pages sit in the admin's menu. */
export const PAGES_GROUP: Words = { ar: 'الصفحات', en: 'Pages' };

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
  validate: (value: unknown) =>
    Array.isArray(value) && value.includes('ar') ? true : 'العربية لغة الموقع، ولا تُنشر صفحة من دونها.',
};

/** A page is on the site, so publishing it rebuilds the site; a saved draft leaves the pages alone. */
const refreshOnPublish: GlobalAfterChangeHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
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
}): GlobalConfig {
  const { slug, label, path, sections } = options;
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
      group: PAGES_GROUP,
      // English pages are not switched on yet (ticket 40), so a page is
      // previewed in Arabic.
      preview: () => `/api/preview?path=${encodeURIComponent(path)}`,
    },
    hooks: {
      afterChange: [refreshOnPublish],
    },
    fields: [languagesField, { type: 'tabs', tabs: sections }],
  };
}
