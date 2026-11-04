/**
 * The statements that publish the Delay-cost calculator's first version
 * (ticket 103), in Arabic and English: its entry and the version beside it, as
 * the CMS keeps every published entry.
 *
 * Published in English as well as Arabic, unlike the entries the English pages
 * were proposed in: the home page reads this entry, and the home page is
 * published in English already, so an entry without its English would turn
 * `/en` back into the notice that the page is not in English yet. Ahmed wrote
 * the English with the Arabic.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63). The words
 * are in `words.ts` beside this.
 */
import { DELAY_CALCULATOR_WORDS as WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** Each column the entry's words are kept in, by its name, with the words for it. */
const COLUMNS: readonly [string, { readonly ar: string; readonly en: string }][] = [
  ['calculator_eyebrow', WORDS.eyebrow],
  ['calculator_heading', WORDS.heading],
  ['calculator_lead', WORDS.lead],
  ['calculator_slider_labels_project_value', WORDS.sliderLabels.projectValue],
  ['calculator_slider_labels_delay_days', WORDS.sliderLabels.delayDays],
  ['calculator_slider_labels_progress', WORDS.sliderLabels.progress],
  ['calculator_result_label', WORDS.resultLabel],
  ['calculator_spent', WORDS.spent],
  ['calculator_assumptions', WORDS.assumptions],
  ['calculator_call_to_action_label', WORDS.callToActionLabel],
  ['calculator_currency', WORDS.currency],
  ['calculator_days_one', WORDS.days.one],
  ['calculator_days_two', WORDS.days.two],
  ['calculator_days_few', WORDS.days.few],
  ['calculator_days_many', WORDS.days.many],
];

/** The words' columns, each language's beside the other, with `prefix` before each name. */
const names = (prefix: string) => COLUMNS.flatMap(([name]) => [`"${prefix}${name}_ar"`, `"${prefix}${name}_en"`]).join(', ');
const values = COLUMNS.flatMap(([, words]) => [text(words.ar), text(words.en)]).join(', ');

export const DELAY_CALCULATOR_SEED = `
INSERT INTO "_delay_calculator_v" ("id", ${names('version_')}, "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', ${values}, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_delay_calculator_v"', 'id'), (SELECT max("id") FROM "_delay_calculator_v"));

INSERT INTO "delay_calculator" ("id", ${names('')}, "_status", "updated_at", "created_at")
VALUES ('1', ${values}, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"delay_calculator"', 'id'), (SELECT max("id") FROM "delay_calculator"));

INSERT INTO "_delay_calculator_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1'), ('2', '1', 'en', '2');

SELECT setval(pg_get_serial_sequence('"_delay_calculator_v_version_languages"', 'id'), (SELECT max("id") FROM "_delay_calculator_v_version_languages"));

INSERT INTO "delay_calculator_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1'), ('2', '1', 'en', '2');

SELECT setval(pg_get_serial_sequence('"delay_calculator_languages"', 'id'), (SELECT max("id") FROM "delay_calculator_languages"));
`;
