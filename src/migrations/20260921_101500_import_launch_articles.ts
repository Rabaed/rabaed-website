import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { toRichText } from './launch-articles/body';
import { LAUNCH_ARTICLES } from './launch-articles/articles';

/**
 * Puts the six launch articles into the CMS as **unpublished drafts**
 * (ticket 38), so that on every database — production's included — they are
 * waiting in the blog for Ahmed to read, correct and publish.
 *
 * Drafts, not publications, because the ticket asks that the articles be
 * approved by him before publishing and attributed to a real person: the
 * expertise is his and so is the byline. Two fields are left empty for that
 * reason — the author and the cover image — and Payload requires both to
 * publish, so the CMS itself refuses to put any of this in front of a visitor
 * until he has supplied them. `docs/deployment.md` says what to do with them,
 * in plain language.
 *
 * `draft: true` is what makes that possible: it saves the version without
 * checking the rules an entry must meet to be published
 * (`src/cms/editorial-fields.ts`), which is the same allowance an Editor has
 * while writing.
 *
 * The date is the day the drafts were written, not the day this runs — as the
 * legal import dates its first versions by the day the text was approved — so
 * that every database gets the same one. Ahmed sets it to the day he
 * publishes, which is what the date on an article means to a reader.
 */
/** Midnight on 21 September 2026 in Riyadh: the day the six were drafted. */
const DRAFTED_ON = '2026-09-21T00:00:00+03:00';

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const article of LAUNCH_ARTICLES) {
    await payload.create({
      collection: 'posts',
      draft: true,
      data: {
        locale: 'ar',
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        answer: article.answer,
        body: toRichText(article.body),
        publishedAt: DRAFTED_ON,
        // Ahmed's, both of them, and both required to publish. The cover is
        // left out altogether rather than emptied: there is no empty upload.
        author: '',
      },
      // A migration runs outside the site, where there are no pages to
      // refresh (`src/cms/revalidation.ts`). Nothing is published here in any
      // case, so there is nothing a visitor could see change.
      context: { [SKIP_REVALIDATION]: true },
      req,
    });
  }
}

/**
 * Only the six this imported, by their addresses. A rollback must not take an
 * article an Editor wrote with it.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  const slugs = sql.join(
    LAUNCH_ARTICLES.map((article) => sql`${article.slug}`),
    sql`, `,
  );
  await db.execute(sql`DELETE FROM "_posts_v" WHERE "version_slug" IN (${slugs}) AND "version_locale" = 'ar'`);
  await db.execute(sql`DELETE FROM "posts" WHERE "slug" IN (${slugs}) AND "locale" = 'ar'`);
}
