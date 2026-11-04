/**
 * The statements that give the Company profile's Delay-cost calculator its
 * button's link (ticket 106), in the entry itself and in its newest version and
 * its newest published one: where the admin opens it, and where a visitor
 * reads it once the founder publishes the page. Older versions are history,
 * and are left as they were. Only where the link is still empty: a link an
 * Editor has written is his.
 *
 * Whether the calculator shows needs no statement: the column arrives showing
 * it, as every section's switch does.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63), naming the
 * columns these tables have on the day it is written. The words are in
 * `words.ts` beside this.
 */
import { PROFILE_COST_WORDS as WORDS } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

export const PROFILE_COST_SEED = (['ar', 'en'] as const)
  .map((language) => {
    const link = text(WORDS.callToActionLink[language]);
    return `
UPDATE "profile_page"
   SET "cost_call_to_action_link_${language}" = ${link}
 WHERE coalesce(btrim("cost_call_to_action_link_${language}"), '') = '';

UPDATE "_profile_page_v"
   SET "version_cost_call_to_action_link_${language}" = ${link}
 WHERE coalesce(btrim("version_cost_call_to_action_link_${language}"), '') = ''
   AND "id" IN (${WRITTEN_VERSIONS});`;
  })
  .join('\n');

/** Takes the link back off, wherever it is still this one. */
export const PROFILE_COST_UNSEED = (['ar', 'en'] as const)
  .map((language) => {
    const link = text(WORDS.callToActionLink[language]);
    return `
UPDATE "profile_page" SET "cost_call_to_action_link_${language}" = NULL WHERE "cost_call_to_action_link_${language}" = ${link};
UPDATE "_profile_page_v" SET "version_cost_call_to_action_link_${language}" = NULL WHERE "version_cost_call_to_action_link_${language}" = ${link};`;
  })
  .join('\n');
