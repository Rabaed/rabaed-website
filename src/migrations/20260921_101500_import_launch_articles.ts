import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import path from 'node:path';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { screenMockImagePath } from '../screen-mocks/registry';
import { ARTICLE_PER_QUESTION_KIND } from './launch-articles/articles';
import { toRichText } from './launch-articles/body';
import { SCREEN_MOCK_DESCRIPTIONS } from './product-page-import/words';

/**
 * Puts the six launch articles into the CMS as **unpublished drafts**
 * (ticket 38), so that on every database — production's included — they are
 * waiting in the blog for Ahmed to read, correct and publish.
 *
 * Drafts, not publications, because the ticket asks that the articles be
 * approved by him before publishing and attributed to a real person: the
 * expertise is his and so is the byline. **The author is left empty**, and
 * Payload requires it to publish, so the CMS itself refuses to put any of this
 * in front of a visitor until he has put his own name on it — and
 * `authorField` refuses the company's name in its place
 * (`src/cms/editorial-fields.ts`). `docs/deployment.md` says what to do, in
 * plain language.
 *
 * `draft: true` is what makes that possible: it saves the version without
 * checking the rules an entry must meet to be published, which is the same
 * allowance an Editor has while writing.
 *
 * **Each article arrives with a cover.** It is the Screen mock of the screen
 * that article is about, uploaded from `public/screen-mocks/ar/` — which gives
 * every database its own copy, a preview's and the test server's throwaway one
 * included, the way ticket 20 gives the Trust strip its marks. They are the
 * only pictures of Rabaed that exist (ADR-0002), and Ahmed swaps any of them
 * from the CMS like any other image.
 *
 * The date is the day the drafts were written, not the day this runs — as the
 * legal import dates its first versions by the day the text was approved — so
 * that every database gets the same one. Ahmed sets it to the day he
 * publishes, which is what the date on an article means to a reader.
 */

/** Midnight on 21 September 2026 in Riyadh: the day the six were drafted. */
const DRAFTED_ON = '2026-09-21T00:00:00+03:00';

const LAUNCH_ARTICLES = Object.values(ARTICLE_PER_QUESTION_KIND);

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const context = { [SKIP_REVALIDATION]: true };
  const publicDirectory = path.join(process.cwd(), 'public');

  for (const article of LAUNCH_ARTICLES) {
    const cover = await payload.create({
      collection: 'media',
      // What the screen shows, in the words the product page already uses for
      // the same picture (ticket 57) rather than a second description of it:
      // it is what a screen reader announces, and what ADR-0002 calls the
      // mock's description.
      data: { alt: SCREEN_MOCK_DESCRIPTIONS[article.cover] },
      filePath: path.join(publicDirectory, screenMockImagePath('ar', article.cover)),
      context,
      req,
    });

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
        coverImage: cover.id,
        publishedAt: DRAFTED_ON,
        // Ahmed's, and required to publish.
        author: '',
      },
      // A migration runs outside the site, where there are no pages to
      // refresh (`src/cms/revalidation.ts`). Nothing is published here in any
      // case, so there is nothing a visitor could see change.
      context,
      req,
    });
  }
}

/**
 * Only the six this imported, by their addresses, and only the covers it
 * uploaded for them. A rollback must not take an article — or a picture — an
 * Editor added alongside.
 *
 * The covers go through `payload.delete` rather than SQL, so that the stored
 * files go with the rows: on a deployment they are in Supabase Storage, which
 * no `DELETE` reaches.
 */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const slugs = sql.join(
    LAUNCH_ARTICLES.map((article) => sql`${article.slug}`),
    sql`, `,
  );
  const imported = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { in: LAUNCH_ARTICLES.map((article) => article.slug) } }, { locale: { equals: 'ar' } }] },
    depth: 0,
    pagination: false,
    req,
  });
  const covers = imported.docs.map((post) => post.coverImage).filter((id): id is number => typeof id === 'number');

  await db.execute(sql`DELETE FROM "_posts_v" WHERE "version_slug" IN (${slugs}) AND "version_locale" = 'ar'`);
  await db.execute(sql`DELETE FROM "posts" WHERE "slug" IN (${slugs}) AND "locale" = 'ar'`);

  for (const id of covers) {
    await payload.delete({ collection: 'media', id, context: { [SKIP_REVALIDATION]: true }, req });
  }
}
