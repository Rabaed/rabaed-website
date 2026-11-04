/**
 * The statements that write the Download PDF button's words into the Company
 * profile's entry (ticket 104), in both languages.
 *
 * Written into the entry itself, and into its newest version and its newest
 * published one, as the swipe hint was (`screen-mock-swipe-hint/seed.ts`).
 * Until the founder publishes the profile there is no published version, and
 * the newest is the draft ticket 102 imported: it is given the words rather
 * than pushed aside, so that publishing it shows the button with them. Older
 * versions are history, and are left as they were.
 *
 * Only where a language's words are still empty: words an Editor has written
 * are kept. English is written with Arabic, waiting for the day the page is
 * published in English.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
import { PROFILE_PDF_LABEL } from './words';

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

/** A column's words, set where they are still empty — null, or cleared to nothing. */
const fill = (column: string, words: string) => `${column} = coalesce(nullif(${column}, ''), ${text(words)})`;

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_profile_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_profile_page_v" WHERE "version__status" = 'published'`;

export const PROFILE_PDF_LABEL_SEED = `
UPDATE "profile_page"
   SET ${fill('"pdf_label_ar"', PROFILE_PDF_LABEL.ar)},
       ${fill('"pdf_label_en"', PROFILE_PDF_LABEL.en)};

UPDATE "_profile_page_v"
   SET ${fill('"version_pdf_label_ar"', PROFILE_PDF_LABEL.ar)},
       ${fill('"version_pdf_label_en"', PROFILE_PDF_LABEL.en)}
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;

/** Takes the words back off, where they are still these, from the same rows. */
export const PROFILE_PDF_LABEL_UNSEED = `
UPDATE "profile_page"
   SET "pdf_label_ar" = NULLIF("pdf_label_ar", ${text(PROFILE_PDF_LABEL.ar)}),
       "pdf_label_en" = NULLIF("pdf_label_en", ${text(PROFILE_PDF_LABEL.en)});

UPDATE "_profile_page_v"
   SET "version_pdf_label_ar" = NULLIF("version_pdf_label_ar", ${text(PROFILE_PDF_LABEL.ar)}),
       "version_pdf_label_en" = NULLIF("version_pdf_label_en", ${text(PROFILE_PDF_LABEL.en)})
 WHERE "id" IN (${WRITTEN_VERSIONS});
`;
