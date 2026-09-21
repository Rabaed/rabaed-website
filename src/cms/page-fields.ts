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
import {
  validations,
  type Field,
  type PayloadRequest,
  type Tab,
  type TextareaFieldValidation,
  type TextFieldSingleValidation,
  type UploadFieldSingleValidation,
} from 'payload';
import { text, textarea } from 'payload/shared';
import { ANSWER_LENGTH, answerLengthProblem } from './answer-first';
import { emphasisProblem } from './emphasis';
import { ARABIC, latinNameProblem } from './latin-names';
import { valueNameProblem } from './referral-program-values';

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
 * Payload's own validator for a field, run before anything of ours: it is what
 * enforces `required` and `maxLength`. It is typed for the admin rather than
 * for a caller here, hence the cast, in one place rather than at each field
 * that needs it.
 */
function checkedByPayload(base: WordsValidation, value: unknown, options: ValidateOptions): Promise<string | true> {
  return (base as (value: unknown, options: unknown) => Promise<string | true>)(value, options);
}

/**
 * Payload's own check for the field — required, and its length above all —
 * then `needed`, which says when an empty word is not allowed, and `marks`,
 * which says what is wrong with the marks written in words that may carry
 * them: a Latin name's backticks, a value's braces, bold's asterisks.
 */
function wordsValidation<Validation extends WordsValidation>(
  base: Validation,
  needed: (options: ValidateOptions) => Words | null,
  marks: (text: string) => Words | null,
): Validation {
  const validate = async (value: null | string | undefined, options: ValidateOptions) => {
    const checked = await checkedByPayload(base, value, options);
    if (checked !== true) return checked;
    const message = isEmpty(value) ? needed(options) : marks(value as string);
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
 * words may mark a Latin name between backticks (`latin-names.ts`). `values`
 * words may name a Referral Program value in braces, `{payout}`, which the
 * page inserts; a name the site does not hold is refused
 * (`referral-program-values.ts`). `emphasis` words may mark a phrase in bold
 * between asterisks, and break a line where a new one starts (`emphasis.ts`).
 * `answerFirst` words are a section's opening paragraph, held to a standalone
 * answer of 30 to 60 words whenever one is written (`answer-first.ts`); an
 * optional one left empty is not an answer at all, and passes.
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
    readonly values?: boolean;
    readonly emphasis?: boolean;
    readonly answerFirst?: boolean;
  } = {},
): Field {
  const {
    multiline = false,
    description,
    optional = false,
    latinNames = false,
    values = false,
    emphasis = false,
    answerFirst = false,
  } = options;
  const marks = (written: string) =>
    (latinNames ? latinNameProblem(written) : null) ??
    (values ? valueNameProblem(written) : null) ??
    (emphasis ? emphasisProblem(written) : null) ??
    (answerFirst ? answerLengthProblem(written) : null);
  const box = (language: keyof Words, needed: (options: ValidateOptions) => Words | null): Field => {
    const rtl = language === 'ar';
    const common = {
      name: language,
      required: rtl && !optional,
      maxLength,
      label: rtl ? { ar: 'بالعربية', en: 'Arabic' } : { ar: 'بالإنجليزية', en: 'English' },
    };
    return multiline
      ? { ...common, type: 'textarea', admin: { rows: 3, rtl }, validate: wordsValidation<TextareaFieldValidation>(textarea, needed, marks) }
      : { ...common, type: 'text', admin: { rtl }, validate: wordsValidation<TextFieldSingleValidation>(text, needed, marks) };
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

/** What every opening answer's field says it is for, in the same words each time. */
const OPENING_ANSWER: Words = { ar: 'الفقرة تحت العنوان', en: 'Paragraph under the heading' };

/**
 * The paragraph a section opens with, held to the answer-first rule: a
 * standalone answer of 30 to 60 words, understood without reading a word above
 * it (`answer-first.ts`, ticket 35). This is the paragraph an answer engine
 * lifts and quotes, so it is the one place on the page where length is a rule
 * rather than a limit.
 *
 * `optional` is for a section the Reference site gave no paragraph at all —
 * the home page's units and the product page's parties. Their field stands
 * empty, and the section is drawn exactly as it is today until somebody writes
 * one; written, it is held to the same rule as the rest.
 */
export function openingAnswerField(maxLength: number, options: { readonly optional?: boolean } = {}): Field {
  return wordsField('lead', OPENING_ANSWER, maxLength, {
    multiline: true,
    optional: options.optional,
    answerFirst: true,
    description: {
      ar: `جواب مستقل من ${ANSWER_LENGTH.fewest} إلى ${ANSWER_LENGTH.most} كلمة عن سؤال العنوان، يُفهم دون قراءة ما فوقه. هذه الفقرة هي ما تقتبسه المساعدات الذكية.${
        options.optional ? ' اتركها فارغة ولن تظهر فقرة تحت العنوان، كما هي الصفحة اليوم.' : ''
      }`,
      en: `A standalone answer of ${ANSWER_LENGTH.fewest} to ${ANSWER_LENGTH.most} words to the question the heading asks, understood without reading what is above it. This paragraph is what AI assistants quote.${
        options.optional ? ' Left empty, no paragraph is drawn under the heading, as the page stands today.' : ''
      }`,
    },
  });
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
    const checked = await checkedByPayload(text, value, options);
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

const ADDRESS_NEEDED: Words = {
  ar: 'اكتب وجهة هذا الرابط: مساراً في الموقع يبدأ بشرطة مائلة مثل ‎/product، أو رابطاً كاملاً يبدأ بـ https://',
  en: 'Write where this link goes: a path on the site beginning with a slash, such as /product, or a full address beginning with https://',
};

/**
 * A path on the site, in the Arabic locale — `/`, `/product`, `/blog` — which
 * `localePath` prefixes for another language. Latin letters, figures, hyphens
 * and slashes, since that is what the site's routes are made of.
 */
const SITE_PATH = /^\/[a-z0-9\-/]*$/;

/**
 * Where a link goes (ticket 59). An Editor sets this as well as the words on
 * the link, so a page added later can be linked to without a developer.
 *
 * The shape is checked, not the destination: a path that matches no page
 * reaches the site's own not-found page, which is the ordinary state of a link
 * written before the page it names. Checking it against the site's routes
 * would refuse exactly the link this field exists to allow.
 */
export function addressField(
  name: string,
  label: Words,
  options: { readonly description?: Words; readonly optional?: boolean } = {},
): Field {
  const optional = options.optional ?? false;
  const validate = async (value: null | string | undefined, validateOptions: ValidateOptions) => {
    const checked = await checkedByPayload(text, value, validateOptions);
    if (checked !== true) return checked;
    const written = typeof value === 'string' ? value.trim() : '';
    // An empty box where a link is one thing a place may go without: a mark
    // with nowhere to lead is drawn as a picture rather than as a link.
    if (written === '') return optional ? true : inAdminLanguage(validateOptions.req, ADDRESS_NEEDED);
    const shaped = SITE_PATH.test(written) || /^https:\/\/[^\s]+$/.test(written);
    return shaped ? true : inAdminLanguage(validateOptions.req, ADDRESS_NEEDED);
  };
  return {
    name,
    type: 'text',
    required: !optional,
    // Longer than any address the site has — the longest is the product app's
    // sign-in, at 44 — and short of the point where a pasted address is a
    // mistake rather than a link.
    maxLength: 200,
    label,
    admin: { rtl: false, description: options.description },
    validate: validate as unknown as TextFieldSingleValidation,
  };
}

/**
 * Whether no image has been chosen at all — which a field that does not
 * require one is allowed. Payload hands the value as an id or as the document
 * itself, depending on where the check runs from.
 */
function chosenNothing(value: unknown): boolean {
  const id = value && typeof value === 'object' ? (value as { id?: unknown }).id : value;
  return id === null || id === undefined || id === '';
}

/**
 * The image a picture or logo field has been given, read back from the CMS to
 * be measured, or nothing where it cannot be read. Only ever called once
 * `chosenNothing` says there is one.
 */
async function chosenImage(value: unknown, options: Parameters<UploadFieldSingleValidation>[1]) {
  const id = value && typeof value === 'object' ? (value as { id?: unknown }).id : value;
  return options.req.payload.findByID({ collection: 'media', id: id as number, depth: 0, req: options.req }).catch(() => null);
}

const SHARING_IMAGE_DESCRIPTION: Words = {
  ar: 'اختياري: تظهر حين يُشارك الرابط على واتساب أو لينكدإن. ١٢٠٠×٦٣٠ بكسل بصيغة PNG. من دونها تُستخدم صورة الموقع العامة.',
  en: 'Optional: shown when the link is shared on WhatsApp or LinkedIn. 1200×630 pixels, PNG. Without one, the site’s own image is used.',
};

/**
 * The picture a page's link unfurls as, where it has one of its own
 * (ticket 26). Its size and its kind are held by the collection it points at,
 * which takes nothing but a 1200×630 PNG and stores it as it arrived — see
 * `src/cms/collections/sharing-images.ts` for why that is a collection of its
 * own rather than a picture in `media`.
 */
export function sharingImageField(): Field {
  return {
    name: 'sharingImage',
    type: 'upload',
    relationTo: 'sharing-images',
    required: false,
    label: { ar: 'صورة المشاركة', en: 'Sharing image' },
    admin: { description: SHARING_IMAGE_DESCRIPTION },
  };
}

/**
 * A company's mark for the Trust strip (ticket 20). Unlike a picture on a
 * page, a logo has no shape of its own to hold to: a wordmark is wide, a
 * monogram square, and the strip draws each at its own height. What is asked
 * of it is that it be tall enough to stay sharp — twice the tallest height the
 * bar draws, so a high-resolution screen has pixels to spare.
 *
 * A vector is exempt: it carries no pixel height, and has none to run short
 * of. What it must not carry is checked when it is uploaded (ADR-0010).
 */
export function logoField(name: string, options: { readonly description?: Words } = {}): Field {
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    required: true,
    label: { ar: 'الشعار', en: 'Mark' },
    admin: {
      description: options.description ?? {
        ar: 'صورة PNG بخلفية شفافة، ارتفاعها ٨٨ بكسل فأكثر، أو ملف SVG. الشريط يرسم الشعار باللون الأبيض.',
        en: 'A PNG with a transparent background, 88 pixels tall or more, or an SVG. The strip draws every mark in white.',
      },
    },
    validate: async (value: unknown, options: Parameters<UploadFieldSingleValidation>[1]) => {
      const checked = await validations.upload(value, options);
      if (checked !== true) return checked;
      if (chosenNothing(value)) return true;
      const image = await chosenImage(value, options);
      if (!image) return true;
      // A vector: no height to measure, and none needed.
      if (image.mimeType === 'image/svg+xml') return true;
      if ((image.height ?? 0) >= LOGO_HEIGHT) return true;
      return inAdminLanguage(options.req, {
        ar: `الشعار يجب أن يكون بارتفاع ${LOGO_HEIGHT} بكسل فأكثر ليبقى واضحاً على الشاشات عالية الدقة، أو ملف SVG.`,
        en: `A mark must be ${LOGO_HEIGHT} pixels tall or more to stay sharp on a high-resolution screen, or an SVG.`,
      });
    },
  } as Field;
}

/**
 * The height of the bar a mark sits in (`.logos .slot` in
 * `src/styles/home.css`), which is the tallest a mark is ever drawn, and the
 * height a file must have: twice that, so a high-resolution screen has pixels
 * to spare. `src/cms/globals/trust-strip.ts` holds an Editor's chosen height
 * to the same bar.
 */
export const BAR_HEIGHT = 44;
const LOGO_HEIGHT = BAR_HEIGHT * 2;

/** Whether an image is `size`, or larger in the same proportions. */
function isSizeOrLargerInProportion(image: { width?: number | null; height?: number | null }, size: { width: number; height: number }) {
  const { width, height } = image;
  return !!width && !!height && width * size.height === height * size.width && width >= size.width;
}

/**
 * A picture on the page, chosen from the CMS's images (ticket 57). Every image
 * there was given its description for screen readers when it was uploaded
 * (`collections/media.ts`). A picture keeps the shape its place needs: one of a
 * different shape, or smaller, is refused on publishing, so a replacement never
 * leaves its box stretched, cropped or blurred.
 *
 * `required: false` is a picture with a stand-in of its own, drawn when none is
 * chosen: a Screen mock's exported image.
 */
export function pictureField(options: {
  readonly name: string;
  readonly label: Words;
  /** The picture's shape, and the smallest it may be. */
  readonly size: { readonly width: number; readonly height: number };
  readonly required: boolean;
  readonly description?: Words;
}): Field {
  const { name, label, size, required, description } = options;
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    required,
    label,
    admin: { description },
    validate: async (value: unknown, options: Parameters<UploadFieldSingleValidation>[1]) => {
      // Payload's own check first: required, and an image that exists.
      const checked = await validations.upload(value, options);
      if (checked !== true) return checked;
      // A place a picture is optional in, left empty, is not a wrong shape.
      if (chosenNothing(value)) return true;
      const image = await chosenImage(value, options);
      if (image && isSizeOrLargerInProportion(image, size)) return true;
      return inAdminLanguage(options.req, {
        ar: `الصورة يجب أن تكون بمقاس ${size.width}×${size.height}، أو أكبر بالنسبة نفسها، ليبقى مكانها في الصفحة بشكله.`,
        en: `The picture must be ${size.width}×${size.height}, or larger in the same proportions, so its place on the page keeps its shape.`,
      });
    },
  } as Field;
}

/**
 * A list on the page: one list for both languages, each item holding its words
 * in each (spec: Content model). A page is published only with between `min`
 * and `max` rows. A list the design is built around an exact count sets `min`
 * equal to `max`: the admin then offers no Add, and refuses to publish any
 * other count. A `min` of 0 is a list that may be left empty.
 */
export function listField(options: {
  readonly name: string;
  readonly labels: { readonly singular: Words; readonly plural: Words };
  readonly rows: { readonly min: number; readonly max: number };
  readonly fields: Field[];
  readonly description?: Words;
  /**
   * The list's own table name, for a list nested so deep that the one Payload
   * makes of the names above it would be longer than Postgres allows.
   */
  readonly dbName?: string;
}): Field {
  const { name, labels, rows, fields, description, dbName } = options;
  return {
    name,
    dbName,
    type: 'array',
    labels,
    // `minRows` alone lets an empty list through; `required` is what stops it.
    required: rows.min > 0,
    minRows: rows.min > 0 ? rows.min : undefined,
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
