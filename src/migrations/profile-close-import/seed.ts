/**
 * The statements that write the Company profile's close (ticket 109) —
 * sections 10 to 14, the contact section and the floating WhatsApp button —
 * into its entry, in both languages.
 *
 * **Written out rather than produced by `npm run cms:freeze-seed`**, as ticket
 * 105's sections were: the profile's entry was filled by ticket 102's import,
 * and the freezer refuses a migration adding to tables an earlier import
 * filled (docs/deployment.md, "What a data migration may and may not do"). So
 * these are written to the same rule by hand, from `words.ts` beside them:
 *
 * - **Every column is named as of today**, and a column added later takes its
 *   default, so a database built from scratch goes on running this.
 * - **Into the entry, and into its newest version and its newest published
 *   one**, as ticket 77's swipe hint was. Until the founder publishes the
 *   profile the newest version is ticket 102's draft, which is what an Editor
 *   opens and previews; older versions are history, and are left as they were.
 * - **Only where nothing is written yet.** A word is filled only where it is
 *   still empty, and a list only where it has no rows, so what an Editor has
 *   written — on a database where the profile was edited before this ran — is
 *   kept. A list's rows are found by the entry they belong to, never by an id;
 *   a plan's features, by the plan this wrote.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { PROFILE_CLOSE_WORDS as WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

type Both = { readonly ar: string; readonly en: string };

/** The entry's words, by the column each is kept in, without its language. */
const COLUMNS: readonly [string, Both][] = [
  ['templates_eyebrow', WORDS.templates.eyebrow],
  ['templates_title', WORDS.templates.title],
  ['templates_lead', WORDS.templates.lead],
  ['templates_hint', WORDS.templates.hint],
  ['why_eyebrow', WORDS.why.eyebrow],
  ['why_title', WORDS.why.title],
  ['impact_eyebrow', WORDS.impact.eyebrow],
  ['impact_title', WORDS.impact.title],
  ['impact_lead', WORDS.impact.lead],
  ['impact_activation', WORDS.impact.activation],
  ['impact_source', WORDS.impact.source],
  ['plans_eyebrow', WORDS.plans.eyebrow],
  ['plans_title', WORDS.plans.title],
  ['plans_badge', WORDS.plans.badge],
  ['start_eyebrow', WORDS.start.eyebrow],
  ['start_title', WORDS.start.title],
  ['start_card_title', WORDS.start.cardTitle],
  ['start_card_line', WORDS.start.cardLine],
  ['start_demo_label', WORDS.start.demoLabel],
  ['start_whatsapp_label', WORDS.start.whatsappLabel],
  ['start_demo_link', WORDS.start.demoLink],
  ['contact_tagline', WORDS.contact.tagline],
  ['contact_name', WORDS.contact.name],
  ['contact_phone_label', WORDS.contact.phoneLabel],
  ['contact_email_label', WORDS.contact.emailLabel],
  ['contact_whatsapp_label', WORDS.contact.whatsappLabel],
  ['contact_location', WORDS.contact.location],
  ['whatsapp_button_label', WORDS.whatsappButton.label],
];

/** The entry's Latin words, the same in both languages, by their column. */
const LATIN: readonly [string, string][] = [
  ['contact_phone', WORDS.contact.phone],
  ['contact_email', WORDS.contact.email],
];

/**
 * Each list row's id in the entry, which its versions' rows carry as `_uuid`:
 * made up here, as Payload makes one up for a row added in the admin, one
 * after another from a base no other seed uses. Written only into an entry
 * whose list is empty, so it can meet no other row's.
 */
let next = 0;
const rowId = () => `6aea85eceefa064f2c624${(next++).toString(16).padStart(3, '0')}`;

const CARD_IDS = WORDS.templates.cards.map(rowId);
const REASON_IDS = WORDS.why.reasons.map(rowId);
const FIGURE_IDS = WORDS.impact.figures.map(rowId);
const TIER_IDS = WORDS.plans.tiers.map(rowId);
const FEATURE_IDS = WORDS.plans.tiers.map((tier) => tier.features.map(rowId));
const STEP_IDS = WORDS.start.steps.map(rowId);
const ALL_ROW_IDS = [...CARD_IDS, ...REASON_IDS, ...FIGURE_IDS, ...TIER_IDS, ...FEATURE_IDS.flat(), ...STEP_IDS];

/** Every word, set where it is still empty — null, or cleared to nothing. */
const filled = (prefix: '' | 'version_') =>
  [
    ...COLUMNS.flatMap(([column, words]) => (['ar', 'en'] as const).map((language) => [`${column}_${language}`, words[language]] as const)),
    ...LATIN,
  ]
    .map(([column, value]) => {
      const name = `"${prefix}${column}"`;
      return `${name} = coalesce(nullif(${name}, ''), ${text(value)})`;
    })
    .join(',\n       ');

/** Every word put back to empty where it is still the one this wrote. */
const unfilled = (prefix: '' | 'version_') =>
  [
    ...COLUMNS.flatMap(([column, words]) => (['ar', 'en'] as const).map((language) => [`${column}_${language}`, words[language]] as const)),
    ...LATIN,
  ]
    .map(([column, value]) => `"${prefix}${column}" = NULLIF("${prefix}${column}", ${text(value)})`)
    .join(',\n       ');

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

/** A row of values, in order, after its place and its id. */
const values = (ids: readonly string[], rows: readonly (readonly string[])[]) =>
  rows.map((row, index) => `(${index + 1}, ${[ids[index]!, ...row].map(text).join(', ')})`).join(',\n         ');

const CARDS = values(
  CARD_IDS,
  WORDS.templates.cards.map(({ code, name, text: back }) => [code, name.ar, name.en, back.ar, back.en]),
);
const REASONS = values(
  REASON_IDS,
  WORDS.why.reasons.map(({ name, text: line }) => [name.ar, name.en, line.ar, line.en]),
);
const FIGURES = values(
  FIGURE_IDS,
  WORDS.impact.figures.map(({ figure, unit, label }) => [figure, unit.ar, unit.en, label.ar, label.en]),
);
const TIERS = values(
  TIER_IDS,
  WORDS.plans.tiers.map(({ kicker, name }) => [kicker.ar, kicker.en, name.ar, name.en]),
);
const STEPS = values(
  STEP_IDS,
  WORDS.start.steps.map(({ name, text: line }) => [name.ar, name.en, line.ar, line.en]),
);
/** Each feature after the plan it belongs to, by that plan's id here. */
const FEATURES = WORDS.plans.tiers
  .flatMap((tier, place) =>
    tier.features.map(
      (feature, index) => `(${index + 1}, ${[TIER_IDS[place]!, FEATURE_IDS[place]![index]!, feature.ar, feature.en].map(text).join(', ')})`,
    ),
  )
  .join(',\n         ');

/** A list's rows, into the entry and into each version written, where that one's list is still empty. */
function rows(list: string, columns: string, seededValues: string): string {
  const seededColumns = columns
    .split(', ')
    .map((column) => `seeded.${column}`)
    .join(', ');
  const entryTable = `"profile_page_${list}"`;
  const versionTable = `"_profile_page_v_version_${list}"`;
  return `
INSERT INTO ${entryTable} ("_order", "_parent_id", "id", ${columns})
SELECT seeded."_order", entry."id", seeded."id", ${seededColumns}
  FROM "profile_page" AS entry
 CROSS JOIN (VALUES
         ${seededValues}) AS seeded ("_order", "id", ${columns})
 WHERE NOT EXISTS (SELECT 1 FROM ${entryTable} WHERE "_parent_id" = entry."id");

INSERT INTO ${versionTable} ("_order", "_parent_id", "_uuid", ${columns})
SELECT seeded."_order", version."id", seeded."id", ${seededColumns}
  FROM "_profile_page_v" AS version
 CROSS JOIN (VALUES
         ${seededValues}) AS seeded ("_order", "id", ${columns})
 WHERE version."id" IN (${WRITTEN_VERSIONS})
   AND NOT EXISTS (SELECT 1 FROM ${versionTable} WHERE "_parent_id" = version."id");
`;
}

/**
 * Each plan's features, under the plans this wrote — in the entry, by the
 * plan's id, and in a version, by the plan row that carries it as `_uuid` —
 * where that plan has none yet.
 */
const FEATURE_ROWS = `
INSERT INTO "profile_page_plans_tiers_features" ("_order", "_parent_id", "id", "feature_ar", "feature_en")
SELECT seeded."_order", tier."id", seeded."id", seeded."feature_ar", seeded."feature_en"
  FROM "profile_page_plans_tiers" AS tier
  JOIN (VALUES
         ${FEATURES}) AS seeded ("_order", "tier", "id", "feature_ar", "feature_en") ON seeded."tier" = tier."id"
 WHERE NOT EXISTS (SELECT 1 FROM "profile_page_plans_tiers_features" WHERE "_parent_id" = tier."id");

INSERT INTO "_profile_page_v_version_plans_tiers_features" ("_order", "_parent_id", "_uuid", "feature_ar", "feature_en")
SELECT seeded."_order", tier."id", seeded."id", seeded."feature_ar", seeded."feature_en"
  FROM "_profile_page_v_version_plans_tiers" AS tier
  JOIN (VALUES
         ${FEATURES}) AS seeded ("_order", "tier", "id", "feature_ar", "feature_en") ON seeded."tier" = tier."_uuid"
 WHERE tier."_parent_id" IN (${WRITTEN_VERSIONS})
   AND NOT EXISTS (SELECT 1 FROM "_profile_page_v_version_plans_tiers_features" WHERE "_parent_id" = tier."id");
`;

export const PROFILE_CLOSE_SEED = `
UPDATE "profile_page"
   SET ${filled('')};

UPDATE "_profile_page_v"
   SET ${filled('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});
${rows('templates_cards', '"code", "name_ar", "name_en", "text_ar", "text_en"', CARDS)}${rows(
  'why_reasons',
  '"name_ar", "name_en", "text_ar", "text_en"',
  REASONS,
)}${rows('impact_figures', '"figure", "unit_ar", "unit_en", "label_ar", "label_en"', FIGURES)}${rows(
  'plans_tiers',
  '"kicker_ar", "kicker_en", "name_ar", "name_en"',
  TIERS,
)}${FEATURE_ROWS}${rows('start_steps', '"name_ar", "name_en", "text_ar", "text_en"', STEPS)}`;

/**
 * Takes the words back off, where they are still these, and the rows this
 * wrote, from the same places. The schema migration before it then drops the
 * columns and the lists' tables.
 */
export const PROFILE_CLOSE_UNSEED = `
UPDATE "profile_page"
   SET ${unfilled('')};

UPDATE "_profile_page_v"
   SET ${unfilled('version_')}
 WHERE "id" IN (${WRITTEN_VERSIONS});

${[
  'templates_cards',
  'why_reasons',
  'impact_figures',
  'plans_tiers_features',
  'plans_tiers',
  'start_steps',
]
  .map(
    (list) => `DELETE FROM "profile_page_${list}" WHERE "id" IN (${ALL_ROW_IDS.map(text).join(', ')});
DELETE FROM "_profile_page_v_version_${list}" WHERE "_uuid" IN (${ALL_ROW_IDS.map(text).join(', ')});`,
  )
  .join('\n')}
`;
