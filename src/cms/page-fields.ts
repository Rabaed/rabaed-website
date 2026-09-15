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
import type { Field, PayloadRequest, Tab, TextareaFieldValidation, TextFieldSingleValidation } from 'payload';
import { text, textarea } from 'payload/shared';

export type Words = { readonly ar: string; readonly en: string };

/** A message in the language the Editor has the admin in. */
export function inAdminLanguage(req: PayloadRequest | undefined, message: Words): string {
  return req?.i18n?.language === 'en' ? message.en : message.ar;
}

function isEmpty(value: unknown): boolean {
  return typeof value !== 'string' || value.trim() === '';
}

/** Whether the entry being saved lists English among the languages it is published in. */
function publishedInEnglish(data: unknown): boolean {
  const languages = (data as { languages?: unknown } | undefined)?.languages;
  return Array.isArray(languages) && languages.includes('en');
}

const ARABIC_NEEDED: Words = {
  ar: 'اكتب هذا النص بالعربية: لا تُنشر صفحة بنص فارغ.',
  en: 'Write this in Arabic: a page is not published with an empty text.',
};

const ENGLISH_NEEDED: Words = {
  ar: 'الصفحة منشورة بالإنجليزية، فهذا النص مطلوب بالإنجليزية. اكتبه، أو احذف الإنجليزية من «منشورة باللغات».',
  en: 'The page is published in English, so this needs its English. Write it, or remove English from Published in.',
};

type WordsValidation = TextFieldSingleValidation | TextareaFieldValidation;
type ValidateOptions = Parameters<TextFieldSingleValidation>[1];

/**
 * Payload's own check for the field — required, and its length above all —
 * then `needed`, which says when an empty word is not allowed.
 */
function wordsValidation<Validation extends WordsValidation>(
  base: Validation,
  needed: (options: ValidateOptions) => Words | null,
): Validation {
  const validate = async (value: null | string | undefined, options: ValidateOptions) => {
    const checked = await (base as (value: unknown, options: unknown) => Promise<string | true>)(value, options);
    if (checked !== true) return checked;
    const message = isEmpty(value) ? needed(options) : null;
    return message ? inAdminLanguage(options.req, message) : true;
  };
  return validate as unknown as Validation;
}

// Payload's `required` lets a word of spaces through; the Arabic may never be
// empty, and the English only while the page is not published in English.
const arabicRequired = () => ARABIC_NEEDED;
const englishRequired = (options: ValidateOptions) => (publishedInEnglish(options.data) ? ENGLISH_NEEDED : null);

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
  const arabicLabel = { ar: 'بالعربية', en: 'Arabic' };
  const englishLabel = { ar: 'بالإنجليزية', en: 'English' };
  const arabic: Field = multiline
    ? { name: 'ar', type: 'textarea', required: true, maxLength, label: arabicLabel, admin: { rows: 3, rtl: true }, validate: wordsValidation<TextareaFieldValidation>(textarea, arabicRequired) }
    : { name: 'ar', type: 'text', required: true, maxLength, label: arabicLabel, admin: { rtl: true }, validate: wordsValidation<TextFieldSingleValidation>(text, arabicRequired) };
  const english: Field = multiline
    ? { name: 'en', type: 'textarea', maxLength, label: englishLabel, admin: { rows: 3, rtl: false }, validate: wordsValidation<TextareaFieldValidation>(textarea, englishRequired) }
    : { name: 'en', type: 'text', maxLength, label: englishLabel, admin: { rtl: false }, validate: wordsValidation<TextFieldSingleValidation>(text, englishRequired) };

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
 * in each (spec: Content model). A page is published only with between `min`
 * and `max` rows. A list the design is built around an exact count sets `min`
 * equal to `max`: the admin then offers no Add, and refuses to publish any
 * other count.
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
