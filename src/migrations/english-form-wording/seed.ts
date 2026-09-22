/**
 * The statements that propose the four forms' English (ticket 42): one draft
 * of each form's English entry, holding every word in `words.ts` beside this,
 * which is what to read.
 *
 * Written out rather than produced by `npm run cms:freeze-seed`, for the
 * reason `english-site-words/seed.ts` gives, and to the same rules:
 *
 * - **Every column is named as of today.** The names are made here from the
 *   frozen words, by the rule Payload named them by on the day this was
 *   written — a field's path, snake-cased and joined — and never from the
 *   configuration, so a field added to the forms later changes nothing here.
 * - **Nothing is published, and nothing of the founder's is overwritten.** An
 *   English entry anybody has saved anything in, draft or published, is left
 *   alone: the proposal is made only into an entry nobody has touched, which
 *   is every one of them when this runs.
 *
 * Only the draft is written, in the entry's versions. The entry's own row is
 * Payload's to make when the founder publishes; until then a page reads no
 * published English from the CMS and shows the English the form was written
 * with (`src/forms/settings.ts`), which is these words.
 */
import { ENGLISH_FORM_WORDING } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/**
 * A field's name as Payload names its column: `finePrint` is `fine_print`, and
 * a run of underscores is one — the option `option__966` is `option_966`.
 */
const snake = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/_+/g, '_');

/** What Postgres allows an identifier. */
const IDENTIFIER_LIMIT = 63;

/**
 * A list's option columns, by the rule `optionFieldName` held on the day this
 * was written: `option_` and the value with anything not a letter or a figure
 * made `_`, or, where that would make one of the list's version columns longer
 * than Postgres allows, `o_` for the whole list.
 */
function optionColumns(field: string, options: Record<string, string>): [string, string][] {
  const identifier = (value: string) => value.replace(/[^A-Za-z0-9]/g, '_');
  const column = (name: string) => `version_fields_${snake(field)}_options_${name}`;
  const prefix = Object.keys(options).some((value) => column(`option_${identifier(value)}`).length > IDENTIFIER_LIMIT)
    ? 'o_'
    : 'option_';
  return Object.entries(options).map(([value, words]) => [snake(`fields_${snake(field)}_options_${prefix}${identifier(value)}`), words]);
}

type Wording = (typeof ENGLISH_FORM_WORDING)[keyof typeof ENGLISH_FORM_WORDING];

/** Every word of a form, by the column it is stored in (less `version_`). */
function columns(wording: Wording): [string, string][] {
  const { fields, ...lines } = wording;
  const own = Object.entries(lines).map(([name, words]): [string, string] => [snake(name), words as string]);
  const byField = Object.entries(fields).flatMap(([field, words]) =>
    Object.entries(words as Record<string, string | Record<string, string>>).flatMap(([name, value]) =>
      typeof value === 'string' ? [[`fields_${snake(field)}_${snake(name)}`, value] as [string, string]] : optionColumns(field, value),
    ),
  );
  return [...own, ...byField];
}

/** A form's entry as Payload names its tables: `demo-request` is `demo_request_form_en`. */
const table = (form: string) => `${form.replaceAll('-', '_')}_form_en`;

function propose(form: string, wording: Wording): string {
  const words = columns(wording);
  const names = words.map(([column]) => `"version_${column}"`).join(', ');
  const values = words.map(([, value]) => text(value)).join(', ');
  const versions = `"_${table(form)}_v"`;
  return `INSERT INTO ${versions} (${names}, "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
SELECT ${values}, 'draft', now(), now(), now(), now(), true
 WHERE NOT EXISTS (SELECT 1 FROM ${versions}) AND NOT EXISTS (SELECT 1 FROM "${table(form)}");`;
}

export const ENGLISH_FORM_WORDING_SEED = Object.entries(ENGLISH_FORM_WORDING)
  .map(([form, wording]) => propose(form, wording))
  .join('\n\n');

/**
 * Takes the proposals back: each English entry's draft still carrying the
 * heading this proposed, while nothing is published. An entry the founder has
 * published, or rewritten the heading of, is his, and is left as it is.
 */
export const ENGLISH_FORM_WORDING_UNSEED = Object.entries(ENGLISH_FORM_WORDING)
  .map(([form, wording]) => {
    const versions = `"_${table(form)}_v"`;
    return `DELETE FROM ${versions}
 WHERE "version__status" = 'draft' AND "version_heading" = ${text(wording.heading)}
   AND NOT EXISTS (SELECT 1 FROM ${versions} WHERE "version__status" = 'published');`;
  })
  .join('\n\n');
