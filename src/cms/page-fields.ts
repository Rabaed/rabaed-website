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
import { ARABIC, latinNameProblem } from './latin-names';

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
 * then `needed`, which says when an empty word is not allowed, and, for words
 * that may name a Latin name, whether its marks are whole (`latin-names.ts`).
 */
function wordsValidation<Validation extends WordsValidation>(
  base: Validation,
  needed: (options: ValidateOptions) => Words | null,
  latinNames: boolean,
): Validation {
  const validate = async (value: null | string | undefined, options: ValidateOptions) => {
    const checked = await (base as (value: unknown, options: unknown) => Promise<string | true>)(value, options);
    if (checked !== true) return checked;
    const message = isEmpty(value) ? needed(options) : latinNames ? latinNameProblem(value as string) : null;
    return message ? inAdminLanguage(options.req, message) : true;
  };
  return validate as unknown as Validation;
}

// Payload's `required` lets a word of spaces through; the Arabic may never be
// empty, and the English only while the page is not published in English.
const arabicRequired = () => ARABIC_NEEDED;
const englishRequired = (options: ValidateOptions) => (publishedInEnglish(options.data) ? ENGLISH_NEEDED : null);
// Words a place may go without need their English only where they have Arabic.
const arabicOptional = () => null;
const englishWhereArabic = (options: ValidateOptions) =>
  isEmpty((options.siblingData as { ar?: unknown } | undefined)?.ar) ? null : englishRequired(options);

/**
 * Words on the page, in Arabic and in English. The Arabic is required, because
 * a heading or a label left empty is a broken page; the English is required
 * only once the page is published in English (`page-globals.ts`), so
 * publishing the Arabic can never publish an empty English page. Both are held
 * to what their place in the design carries — the visitor's page never breaks
 * (spec: Content model).
 *
 * `optional` words are for a place drawn without them when empty — a file in
 * the tool page's folder tree with no description beside it. `latinNames`
 * words may mark a Latin name between backticks (`latin-names.ts`).
 *
 * Payload checks all of this only when a page is published: a draft may be
 * unfinished.
 */
export function wordsField(
  name: string,
  label: Words,
  maxLength: number,
  options: {
    readonly multiline?: boolean;
    readonly description?: Words;
    readonly optional?: boolean;
    readonly latinNames?: boolean;
  } = {},
): Field {
  const { multiline = false, description, optional = false, latinNames = false } = options;
  const box = (language: keyof Words, needed: (options: ValidateOptions) => Words | null): Field => {
    const rtl = language === 'ar';
    const common = {
      name: language,
      required: rtl && !optional,
      maxLength,
      label: rtl ? { ar: 'بالعربية', en: 'Arabic' } : { ar: 'بالإنجليزية', en: 'English' },
    };
    return multiline
      ? { ...common, type: 'textarea', admin: { rows: 3, rtl }, validate: wordsValidation<TextareaFieldValidation>(textarea, needed, latinNames) }
      : { ...common, type: 'text', admin: { rtl }, validate: wordsValidation<TextFieldSingleValidation>(text, needed, latinNames) };
  };

  return {
    name,
    type: 'group',
    label,
    admin: { description },
    fields: [
      {
        type: 'row',
        fields: [
          box('ar', optional ? arabicOptional : arabicRequired),
          box('en', optional ? englishWhereArabic : englishRequired),
        ],
      },
    ],
  };
}

const TEXT_NEEDED: Words = {
  ar: 'اكتب هذا النص: لا تُنشر صفحة بنص فارغ.',
  en: 'Write this: a page is not published with an empty text.',
};

const LATIN_ONLY: Words = {
  ar: 'يُكتب هذا بحروف إنجليزية وأرقام، بلا حروف عربية: خطه لا حروف عربية فيه.',
  en: 'Write this in Latin letters and figures, with no Arabic: its typeface has none.',
};

/**
 * Latin text that is the same in every language — a file name, a reference
 * like ANT-014, a figure — so one field rather than one per language. Required,
 * held to what its place carries, and refused with Arabic letters in it: the
 * page sets it in DM Mono, which has none (spec: Design system).
 */
export function latinField(name: string, label: Words, maxLength: number): Field {
  const validate = async (value: null | string | undefined, options: ValidateOptions) => {
    const checked = await (text as (value: unknown, options: unknown) => Promise<string | true>)(value, options);
    if (checked !== true) return checked;
    const message = isEmpty(value) ? TEXT_NEEDED : ARABIC.test(value as string) ? LATIN_ONLY : null;
    return message ? inAdminLanguage(options.req, message) : true;
  };
  return {
    name,
    type: 'text',
    required: true,
    maxLength,
    label,
    admin: { rtl: false },
    validate: validate as unknown as TextFieldSingleValidation,
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
