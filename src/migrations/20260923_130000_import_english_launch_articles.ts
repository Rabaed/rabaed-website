import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SKIP_REVALIDATION } from '../cms/revalidation';
import { screenMockImagePath } from '../screen-mocks/registry';
import { ENGLISH_ARTICLE_PER_QUESTION_KIND } from './english-launch-articles/articles';
import { ENGLISH_LAUNCH_ARTICLES_SEED, englishCoverFilename } from './english-launch-articles/seed';
import { ENGLISH_SCREEN_MOCK_DESCRIPTIONS } from './english-screen-mock-words/words';

/**
 * Puts the six launch articles into the CMS in English as **unpublished
 * drafts** (ticket 43), each at the same slug as its Arabic, so that on every
 * database — production's included — they wait in the blog for Ahmed to read
 * and publish, as the Arabic ones did.
 *
 * **The author is left empty**, and the CMS refuses to publish without one, so
 * nothing here reaches a visitor before somebody has put a person's name on it.
 *
 * **Each arrives with an English cover**: the English Screen mock of the
 * screen the article is about (ticket 41), uploaded from
 * `public/screen-mocks/en/` under a name of its own, and described in the
 * words ticket 41 proposed for that screen. The founder chose these over the
 * Arabic covers on 22 September 2026. An upload is the one thing a data
 * migration writes through Payload; the posts themselves are the statements in
 * `english-launch-articles/seed.ts`, which find each cover by that name.
 *
 * An article already written in English at its slug is left as it is, and no
 * cover is uploaded for it.
 */

const ARTICLES = Object.values(ENGLISH_ARTICLE_PER_QUESTION_KIND);

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const context = { [SKIP_REVALIDATION]: true };
  const publicDirectory = path.join(process.cwd(), 'public');

  for (const article of ARTICLES) {
    const written = await db.execute(
      sql`SELECT 1 FROM "posts" WHERE "slug" = ${article.slug} AND "locale" = 'en' LIMIT 1`,
    );
    if (written.rows.length > 0) continue;

    const picture = await readFile(path.join(publicDirectory, screenMockImagePath('en', article.cover)));
    await payload.create({
      collection: 'media',
      data: { alt: ENGLISH_SCREEN_MOCK_DESCRIPTIONS[article.cover] },
      file: { data: picture, mimetype: 'image/webp', name: englishCoverFilename(article.cover), size: picture.length },
      context,
      req,
    });
  }

  await db.execute(sql.raw(ENGLISH_LAUNCH_ARTICLES_SEED));
}

/**
 * The six English articles, by their addresses, and the covers uploaded for
 * them, found by name. The covers go through `payload.delete`, so that their
 * stored files go with the rows — on a deployment they are in Supabase
 * Storage, which no `DELETE` reaches.
 */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const slugs = sql.join(
    ARTICLES.map((article) => sql`${article.slug}`),
    sql`, `,
  );
  await db.execute(sql`DELETE FROM "_posts_v" WHERE "version_slug" IN (${slugs}) AND "version_locale" = 'en'`);
  await db.execute(sql`DELETE FROM "posts" WHERE "slug" IN (${slugs}) AND "locale" = 'en'`);

  const covers = await payload.find({
    collection: 'media',
    where: { filename: { in: ARTICLES.map((article) => englishCoverFilename(article.cover)) } },
    depth: 0,
    pagination: false,
    req,
  });
  for (const cover of covers.docs) {
    await payload.delete({ collection: 'media', id: cover.id, context: { [SKIP_REVALIDATION]: true }, req });
  }
}
