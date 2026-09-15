/**
 * The pieces every marketing page's CMS entry is made of (ticket 53): words in
 * each language, held to what their place in the design carries; lists an
 * Editor adds to, removes from and reorders; and sections that show or hide in
 * a fixed order (spec: Content model).
 *
 * **Each word holds its Arabic and its English side by side, in fields of its
 * own — not Payload's per-field localisation.** Turning localisation on adds
 * columns to the version history of every collection and global with drafts,
 * and the migrations already written for tickets 19–27 save content through
 * Payload with the configuration of the day they run: on a new database (the
 * test server's, the preview database) they would run against tables that do
 * not have those columns yet, and fail. Localisation also shares one publish
 * state across both languages (ticket 23) unless an experimental switch is on,
 * and by default fills a missing language from the other. Two fields per word
 * need none of that: a list is one list whose items hold both (spec: Content
 * model), and nothing is ever filled in from the other language.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Field, Tab, TextareaFieldValidation, TextFieldSingleValidation } from 'payload';
import { text, textarea } from 'payload/shared';

export type Words = { readonly ar: string; readonly en: string };

function isEmpty(value: unknown): boolean {
  return typeof value !== 'string' || value.trim() === '';
}

/** Whether the entry being saved lists English among the languages it is published in. */
function publishedInEnglish(data: unknown): boolean {
  const languages = (data as { languages?: unknown } | undefined)?.languages;
  return Array.isArray(languages) && languages.includes('en');
}

const ENGLISH_NEEDED = 'الصفحة منشورة بالإنجليزية، فهذا النص مطلوب بالإنجليزية. اكتبه، أو احذف الإنجليزية من «منشورة باللغات».';

const englishText: TextFieldSingleValidation = async (value, options) => {
  const base = await text(value, options);
  if (base !== true) return base;
  return publishedInEnglish(options.data) && isEmpty(value) ? ENGLISH_NEEDED : true;
};

const englishTextarea: TextareaFieldValidation = async (value, options) => {
  const base = await textarea(value, options);
  if (base !== true) return base;
  return publishedInEnglish(options.data) && isEmpty(value) ? ENGLISH_NEEDED : true;
};

/**
 * Words on the page, in Arabic and in English. The Arabic is required, because
 * a heading or a label left empty is a broken page; the English is required
 * only once the page is published in English (`page-globals.ts`), so
 * publishing the Arabic can never publish an empty English page. Both are held
 * to what their place in the design carries — the visitor's page never breaks
 * (spec: Content model).
 *
 * Payload checks all of this only when a page is published: a draft may be
 * unfinished.
 */
export function wordsField(
  name: string,
  label: Words,
  maxLength: number,
  options: { readonly multiline?: boolean; readonly description?: Words } = {},
): Field {
  const { multiline = false, description } = options;
  const arabic: Field = multiline
    ? { name: 'ar', type: 'textarea', required: true, maxLength, label: { ar: 'بالعربية', en: 'Arabic' }, admin: { rows: 3, rtl: true } }
    : { name: 'ar', type: 'text', required: true, maxLength, label: { ar: 'بالعربية', en: 'Arabic' }, admin: { rtl: true } };
  const english: Field = multiline
    ? { name: 'en', type: 'textarea', maxLength, label: { ar: 'بالإنجليزية', en: 'English' }, admin: { rows: 3, rtl: false }, validate: englishTextarea }
    : { name: 'en', type: 'text', maxLength, label: { ar: 'بالإنجليزية', en: 'English' }, admin: { rtl: false }, validate: englishText };

  return {
    name,
    type: 'group',
    label,
    admin: { description },
    fields: [{ type: 'row', fields: [arabic, english] }],
  };
}

/**
 * A list on the page: one list for both languages, each item holding its words
 * in each (spec: Content model). Its rows are held between `min` and `max`; a
 * list the design is built around an exact count has `min` equal to `max`, and
 * cannot be added to or taken from.
 */
export function listField(options: {
  readonly name: string;
  readonly labels: { readonly singular: Words; readonly plural: Words };
  readonly rows: { readonly min: number; readonly max: number };
  readonly fields: Field[];
  readonly description?: Words;
}): Field {
  const { name, labels, rows, fields, description } = options;
  return {
    name,
    type: 'array',
    labels,
    // `minRows` alone lets an empty list through; `required` is what stops it.
    required: true,
    minRows: rows.min,
    maxRows: rows.max,
    fields,
    admin: description ? { description } : undefined,
  };
}

/** The switch that hides a section without losing its words. */
const showsField: Field = {
  name: 'shows',
  type: 'checkbox',
  defaultValue: true,
  label: { ar: 'يظهر في الصفحة', en: 'Shows on the page' },
  admin: {
    description: {
      ar: 'ألغِ التحديد لإخفاء هذا القسم مع بقاء نصوصه.',
      en: 'Untick to hide this section, keeping its words.',
    },
  },
};

const LINKED_DESCRIPTION: Words = {
  ar: 'روابط في الموقع تنتقل إلى هذا القسم، فهو يظهر دائماً.',
  en: 'Links on the site land on this section, so it always shows.',
};

/**
 * One section of a page, as a tab of its entry. Tabs stay in the page's order
 * and cannot be moved, added or removed: the section order is fixed (spec:
 * Content model).
 *
 * A section something links to is not `hideable`, and has no switch: hiding it
 * would leave the link leading nowhere.
 */
export function sectionTab(options: {
  readonly name: string;
  readonly label: Words;
  readonly hideable: boolean;
  readonly description?: Words;
  readonly fields: Field[];
}): Tab {
  const { name, label, hideable, description, fields } = options;
  return {
    name,
    label,
    description: hideable ? description : description ?? LINKED_DESCRIPTION,
    fields: hideable ? [showsField, ...fields] : fields,
  };
}
