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
export const FORM_IDS = ['demo-request', 'tool-download'] as const;

export type FormId = (typeof FORM_IDS)[number];

export type FieldDefinition = {
  readonly required: boolean;
  /** The longest answer taken. A longer one is refused, not cut short. */
  readonly maxLength: number;
  /** For a list: the values it offers. Any other is refused. */
  readonly options?: readonly string[];
  /** For typed text: whether an answer, trimmed and not empty, is acceptable. */
  readonly accepts?: (answer: string) => boolean;
};

export type FieldWording = {
  /** What the field is called, to a screen reader and in the admin. */
  readonly label: string;
  readonly placeholder: string;
  /** Shown under the field while its answer is not acceptable. */
  readonly message: string;
  /** For a list: the text of each option, by its value. */
  readonly options?: Readonly<Record<string, string>>;
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

/** What a form is told back once it has been sent. */
export type SubmissionOutcome =
  | { readonly outcome: 'idle' }
  /** Stored. */
  | { readonly outcome: 'received'; readonly message: string }
  /** Answers the server would not take, by field. */
  | { readonly outcome: 'invalid'; readonly fields: readonly string[] }
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

export function fieldNames<Field extends string>(definition: FormDefinition<Field>): Field[] {
  return Object.keys(definition.fields) as Field[];
}

export function isAcceptable(field: FieldDefinition, value: string): boolean {
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
