/**
 * The statements that put the six launch articles into the CMS in English
 * (ticket 43), each a draft beside its Arabic at the same slug.
 *
 * **Built from `articles.ts` beside this, which is what to read.** This is only
 * how the rows are made, and it is made as `english-site-words/seed.ts` makes
 * ticket 40's, rather than by `npm run cms:freeze-seed`: the Arabic articles
 * are already in these tables, which the freezer refuses, and the ids it would
 * freeze are the ids of a database built from scratch, where an Editor's own
 * posts on production may already hold them. So:
 *
 * - **Nothing is found or given by an id.** A post takes the next id there is,
 *   its version points at whatever that was, and its cover is found by file
 *   name.
 * - **Nothing of an Editor's is overwritten.** An article already written in
 *   English at its slug is left alone, and no draft is made beside it.
 * - **Nothing is published.** Each is a draft with its author empty, so the CMS
 *   refuses to publish it until a person's name is on it (`authorField`), as
 *   with the Arabic.
 */
import type { ScreenMockId } from '../../screen-mocks/registry';
import type { Block, Inline, Line } from '../launch-articles/body';
import { ENGLISH_ARTICLE_PER_QUESTION_KIND } from './articles';

/** Midnight on 23 September 2026 in Riyadh: the day the six were translated. */
const TRANSLATED_ON = '2026-09-23T00:00:00+03:00';

/**
 * Each English cover's file name. Not the export's own — the Arabic covers
 * already hold `stamped-sheet.webp` and its kind, and a second upload of the
 * same name would be renamed to whatever number was free on that database —
 * so every database finds these by a name of their own.
 */
export const englishCoverFilename = (cover: ScreenMockId) => `${cover}-en.webp`;

/*
 * An article's body as the rich text field holds it: the tree the Arabic
 * import built for its own (ticket 38) — the same nodes, the same editor —
 * left to right.
 */

const LTR = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 };

const text = (words: string, bold = false) => ({
  type: 'text',
  version: 1,
  detail: 0,
  // Lexical's formatting bit field; 1 is bold.
  format: bold ? 1 : 0,
  mode: 'normal',
  style: '',
  text: words,
});

const inline = (piece: Inline) => {
  if (typeof piece === 'string') return text(piece);
  if ('strong' in piece) return text(piece.strong, true);
  return {
    ...LTR,
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', url: piece.href, newTab: false },
    children: [text(piece.link)],
  };
};

const lineOf = (line: Line) => line.map(inline);

function node(block: Block) {
  switch (block.kind) {
    case 'heading':
      return { ...LTR, type: 'heading', tag: 'h2', children: lineOf(block.text) };
    case 'paragraph':
      return { ...LTR, type: 'paragraph', textFormat: 0, textStyle: '', children: lineOf(block.text) };
    case 'list':
      return {
        ...LTR,
        type: 'list',
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        children: block.items.map((item, index) => ({ ...LTR, type: 'listitem', value: index + 1, children: lineOf(item) })),
      };
    case 'quote':
      return { ...LTR, type: 'quote', children: lineOf(block.text) };
  }
}

const richText = (blocks: readonly Block[]) => ({ root: { ...LTR, type: 'root', children: blocks.map(node) } });

/** A value as a SQL string: a quote inside one is written twice. */
const literal = (value: string) => `'${value.replaceAll("'", "''")}'`;

/**
 * One article: the post, and its first version copied from it — which is what
 * Payload writes when an Editor saves a draft. The version goes in only beside
 * a post made here, so an article an Editor wrote first gains nothing.
 */
const INSERTS = Object.values(ENGLISH_ARTICLE_PER_QUESTION_KIND).map(
  (article) => `WITH "post" AS (
  INSERT INTO "posts" ("title", "answer", "cover_image_id", "body", "summary", "slug", "locale", "author", "published_at", "updated_at", "created_at", "_status")
  SELECT ${literal(article.title)},
         ${literal(article.answer)},
         (SELECT "id" FROM "media" WHERE "filename" = ${literal(englishCoverFilename(article.cover))} ORDER BY "id" DESC LIMIT 1),
         ${literal(JSON.stringify(richText(article.body)))}::jsonb,
         ${literal(article.summary)},
         ${literal(article.slug)},
         'en'::"enum_posts_locale",
         '',
         ${literal(TRANSLATED_ON)}::timestamptz,
         now(),
         now(),
         'draft'::"enum_posts_status"
   WHERE NOT EXISTS (SELECT 1 FROM "posts" WHERE "slug" = ${literal(article.slug)} AND "locale" = 'en')
  RETURNING *
)
INSERT INTO "_posts_v" ("parent_id", "version_title", "version_answer", "version_cover_image_id", "version_body", "version_summary", "version_slug", "version_locale", "version_author", "version_published_at", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
SELECT "id", "title", "answer", "cover_image_id", "body", "summary", "slug",
       "locale"::text::"enum__posts_v_version_locale", "author", "published_at", "updated_at", "created_at",
       "_status"::text::"enum__posts_v_version_status", now(), now(), true
  FROM "post";`,
);

export const ENGLISH_LAUNCH_ARTICLES_SEED = INSERTS.join('\n\n');
