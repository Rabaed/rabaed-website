/**
 * A form, described once: which fields it has, what counts as an acceptable
 * answer to each, and the words it starts with. The browser reads it to say
 * what is wrong as the visitor types; the server reads the same one to refuse
 * what the browser was talked out of (spec: Forms).
 *
 * Kept free of anything that only runs on a server, because the form in the
 * browser imports it.
 *
 * **Which fields exist is fixed here, in code.** Every field reaches storage,
 * spam protection and the Privacy Policy, so adding one is a developer's
 * change. What the fields *say* is an Editor's: the words here are only what a
 * database starts with, published by a migration, and changed from the CMS
 * after that (`src/cms/globals/form-settings.ts`).
 */

/** Every form the site has a definition for. */
export const FORM_IDS = ['demo-request', 'referral-signup', 'tool-download', 'partnership-application'] as const;

export type FormId = (typeof FORM_IDS)[number];

/** Typed text, or a choice from a list. */
export type TextFieldDefinition = {
  readonly kind?: 'text';
  readonly required: boolean;
  /** The longest answer taken. A longer one is refused, not cut short. */
  readonly maxLength: number;
  /** For a list: the values it offers. Any other is refused. */
  readonly options?: readonly string[];
  /** For typed text: whether an answer, trimmed and not empty, is acceptable. */
  readonly accepts?: (answer: string) => boolean;
};

/** A document the applicant attaches: a PDF or an image, of at most `DOCUMENTS.maxBytes`. */
export type DocumentFieldDefinition = {
  readonly kind: 'document';
  readonly required: boolean;
};

/** A box the applicant has to tick. Always required: a consent that may be left out is not one. */
export type ConsentFieldDefinition = {
  readonly kind: 'consent';
};

export type FieldDefinition = TextFieldDefinition | DocumentFieldDefinition | ConsentFieldDefinition;

export type FieldWording = {
  /** What the field is called, to a screen reader and in the admin. */
  readonly label: string;
  /** For a document: the note under its name. For a consent: unused. */
  readonly placeholder: string;
  /** Shown under the field while its answer is not acceptable — for a document, while it is missing. */
  readonly message: string;
  /** For a list: the text of each option, by its value. */
  readonly options?: Readonly<Record<string, string>>;
  /** For a document: shown when the file is over the size limit. */
  readonly tooLarge?: string;
  /** For a document: shown when the file is not a PDF or an image. */
  readonly wrongType?: string;
};

/** The words the page shows with the form. */
export type FormPageWording<Field extends string = string> = {
  readonly heading: string;
  readonly lead: string;
  readonly submit: string;
  readonly finePrint: string;
  readonly fields: Readonly<Record<Field, FieldWording>>;
};

/**
 * The words only the server says: back to the visitor once a request is sent,
 * and in the confirmation email. Never handed to the page before then, so
 * nothing on a page claims a request arrived before one has.
 */
export type FormReplyWording = {
  readonly received: string;
  readonly refused: string;
  readonly failed: string;
  readonly confirmationSubject: string;
  /** `{الاسم}` is replaced with the applicant's name. */
  readonly confirmationBody: string;
};

export type FormWording<Field extends string = string> = FormPageWording<Field> & FormReplyWording;

/**
 * Every answer as text: typed text as typed, a consent as `on` when ticked,
 * and a document as the chosen file's name — its contents travel beside.
 */
export type Answers<Field extends string = string> = Readonly<Record<Field, string>>;

/** Who is asking, as the submissions list shows it. */
export type Applicant = { readonly name: string; readonly email: string; readonly phone: string };

export type FormDefinition<Field extends string = string> = {
  readonly id: FormId;
  /** How the admin names the form, and its submissions. */
  readonly title: { readonly ar: string; readonly en: string };
  /** A page the form is on, where an editor previews its wording. */
  readonly previewPath: string;
  readonly fields: Readonly<Record<Field, FieldDefinition>>;
  applicant(answers: Answers<Field>): Applicant;
  /** What a database starts with (see above). */
  readonly wording: FormWording<Field>;
};

/** What is wrong with an attached document. A missing one is the field's own message. */
export type DocumentProblem = 'tooLarge' | 'wrongType';

/** What a form is told back once it has been sent. */
export type SubmissionOutcome =
  | { readonly outcome: 'idle' }
  /** Stored. */
  | { readonly outcome: 'received'; readonly message: string }
  /** Answers the server would not take, by field, and what was wrong with each document among them. */
  | {
      readonly outcome: 'invalid';
      readonly fields: readonly string[];
      readonly problems?: Readonly<Record<string, DocumentProblem>>;
    }
  /** Turned away: a bot-shaped request, or too many from one address. */
  | { readonly outcome: 'refused'; readonly message: string }
  /** Something broke on our side, and nothing was stored. */
  | { readonly outcome: 'failed'; readonly message: string };

export const NOT_SENT: SubmissionOutcome = { outcome: 'idle' };

/**
 * The trap: a field no person sees or reaches from the keyboard, which a bot
 * filling in every field fills in too. A request with anything in it is refused.
 */
export const TRAP_FIELD = 'website';

/**
 * A value the form makes up once and sends with every attempt, so that a
 * request sent twice — a double click, a retry after a dropped connection — is
 * stored once.
 */
export const TOKEN_FIELD = 'submissionToken';

/** The placeholder in a confirmation email that stands for the applicant's name. */
export const NAME_PLACEHOLDER = '{الاسم}';

/** What a ticked consent sends. */
export const CONSENT_GIVEN = 'on';

/**
 * What an attached document may be (spec: Forms): a PDF or an image, of at
 * most 10 MB. The browser judges a file by its name and size as it is chosen;
 * the server judges it again by its contents (`documents.ts`).
 */
export const DOCUMENTS = {
  maxBytes: 10 * 1024 * 1024,
  /** What the file picker offers. */
  accept: '.pdf,.png,.jpg,.jpeg',
  extensions: ['pdf', 'png', 'jpg', 'jpeg'],
} as const;

/** What is wrong with a file, by its name and size. */
export function documentProblem(file: { readonly name: string; readonly size: number }): DocumentProblem | null {
  const extension = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '';
  if (!(DOCUMENTS.extensions as readonly string[]).includes(extension)) return 'wrongType';
  if (file.size > DOCUMENTS.maxBytes) return 'tooLarge';
  return null;
}

export function fieldNames<Field extends string>(definition: FormDefinition<Field>): Field[] {
  return Object.keys(definition.fields) as Field[];
}

/** The values a list offers, in order; none for any other field. */
export function fieldOptions(field: FieldDefinition): readonly string[] {
  return field.kind === undefined || field.kind === 'text' ? (field.options ?? []) : [];
}

export function isRequired(field: FieldDefinition): boolean {
  return field.kind === 'consent' ? true : field.required;
}

export function isAcceptable(field: FieldDefinition, value: string): boolean {
  if (field.kind === 'consent') return value === CONSENT_GIVEN;
  if (field.kind === 'document') return !field.required || value !== '';
  const answer = value.trim();
  if (answer === '') return !field.required;
  if (answer.length > field.maxLength) return false;
  if (field.options) return field.options.includes(answer);
  return field.accepts ? field.accepts(answer) : true;
}

/** The fields whose answers are not acceptable, in the form's order. */
export function unacceptableFields<Field extends string>(definition: FormDefinition<Field>, answers: Answers<Field>): Field[] {
  return fieldNames(definition).filter((name) => !isAcceptable(definition.fields[name], answers[name]));
}

/**
 * Rules more than one form uses: the Reference site's own, from its tool page
 * (`reference/site/tool.html`), which ticket 14 took as the model.
 */
export const RULES = {
  /** Two letters or more. */
  name: (answer: string) => answer.length >= 2,
  /** Spaces, dashes and brackets are allowed; only the digits are counted, six to fifteen. */
  phone: (answer: string) => {
    const digits = answer.replace(/[^0-9]/g, '');
    return digits.length >= 6 && digits.length <= 15;
  },
  /** A dot, and at least two letters after it, after the @. */
  email: (answer: string) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(answer),
} as const;
