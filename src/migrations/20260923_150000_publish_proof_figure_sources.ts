import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Where the four figures come from, as the founder gave it on 23 September
 * 2026 (ticket 47), in the shortest form he asked for. Visitors never see it:
 * it is the record that puts the four cards on the site.
 */
export const PROOF_FIGURE_SOURCE =
  'دراسة حالة لعميل مطوّر عقاري لا يُذكر اسمه بطلبه: مشروعه على ربائد مقابل مشروع آخر له يُدار يدوياً بإكسل، نحو تسعة أشهر، قاسه الطرفان ووافق العميل على نشر الأرقام.';

/** The four before-and-after figures it covers, by the figure each states. */
export const SOURCED_FIGURES = ['3.6×', '7×', '31%', '22%'] as const;

/**
 * The first card's basis, corrected on the founder's approval of 23 September
 * 2026 (ticket 47): the figures compare two of the customer's projects, not one
 * project before and after, as it said. In Arabic, and in the English ticket
 * 42 drafted from it.
 */
export const CORRECTED_BASIS = {
  figure: '3.6×',
  was: { ar: 'مقارنةً بالدورة الورقية على المشروع نفسه', en: 'Against the paper cycle on the same project' },
  becomes: { ar: 'مقارنةً بمشروع آخر للعميل يُدار يدوياً', en: 'Against the client’s other project, run by hand' },
} as const;

/** A value as a SQL string: a quote inside one is written twice. */
const text = (value: string) => `'${value.replaceAll("'", "''")}'`;

const SOURCE = text(PROOF_FIGURE_SOURCE);
const FIGURES = SOURCED_FIGURES.map(text).join(', ');
const BASIS_FIGURE = text(CORRECTED_BASIS.figure);

/** The versions written into: the newest, and the newest published. */
const WRITTEN_VERSIONS = `
     SELECT "id" FROM "_home_page_v" WHERE "latest"
     UNION
     SELECT max("id") FROM "_home_page_v" WHERE "version__status" = 'published'`;

/**
 * Rewrites the first card's basis from one wording to the other, language by
 * language, where it still reads `from`: in what is published and in the
 * versions written into. `up` corrects it, and `down` puts it back.
 */
function correctBasis(from: 'was' | 'becomes', to: 'was' | 'becomes'): string {
  return (['ar', 'en'] as const)
    .map((language) => {
      const column = `"basis_${language}"`;
      const rewrite = `SET ${column} = ${text(CORRECTED_BASIS[to][language])}
 WHERE "figure" = ${BASIS_FIGURE}
   AND ${column} = ${text(CORRECTED_BASIS[from][language])}`;
      return `
UPDATE "home_page_blocks_comparison"
   ${rewrite};

UPDATE "_home_page_v_blocks_comparison"
   ${rewrite}
   AND "_parent_id" IN (${WRITTEN_VERSIONS});`;
    })
    .join('\n');
}

/**
 * Publishes the source of the home page's four proof figures (ticket 47), which
 * is what puts their cards on every public deployment (ticket 58). The founder
 * asked for it to be written and released rather than left for him to enter.
 *
 * A card is found by the figure it states, never by an id, and is given the
 * source only while it has none: a figure an Editor has changed since is a
 * different claim, which this source does not cover, and a source he has
 * written is his.
 *
 * Written into what is published — which the site reads, so the next build
 * shows the cards — and into the entry's newest version and its newest
 * published one. Where a draft is waiting, the English of ticket 42 or anything
 * of the founder's, that is the newest version, and it keeps its place: it is
 * given the source rather than pushed aside by a version of this migration's,
 * so publishing it later does not take the cards off the site again. Older
 * versions are history, and are left as they were.
 *
 * **With it, the first card's basis is corrected** — the one line on the
 * four cards that said something other than what was measured, which the
 * missing source had kept off the site until now. Only while it still reads
 * as it was imported, in each language: words an Editor has written since are
 * his.
 *
 * Plain SQL, frozen here, as every data migration is (ticket 63).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
UPDATE "home_page_blocks_comparison"
   SET "source" = ${SOURCE}
 WHERE "figure" IN (${FIGURES})
   AND coalesce(btrim("source"), '') = '';

UPDATE "_home_page_v_blocks_comparison"
   SET "source" = ${SOURCE}
 WHERE "figure" IN (${FIGURES})
   AND coalesce(btrim("source"), '') = ''
   AND "_parent_id" IN (${WRITTEN_VERSIONS});

${correctBasis('was', 'becomes')}
`),
  );
}

/**
 * Takes the source back off, where it is still this one, and the four cards off
 * the public site with it, and the first card's basis back to what it said:
 * from what is published and from the same two versions, never from history.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
UPDATE "home_page_blocks_comparison" SET "source" = NULL WHERE "source" = ${SOURCE};
UPDATE "_home_page_v_blocks_comparison" SET "source" = NULL
 WHERE "source" = ${SOURCE}
   AND "_parent_id" IN (${WRITTEN_VERSIONS});

${correctBasis('becomes', 'was')}
`),
  );
}
