import type { CollectionConfig } from 'payload';
import { blogPostPath } from '../../lib/blog-paths';
import {
  answerField,
  authorField,
  editorialAccess,
  editorialEditor,
  editorialHooks,
  editorialVersions,
  localeField,
  previewAt,
  publishedAtField,
  slugField,
  summaryField,
  titleField,
} from '../editorial-fields';

/**
 * The blog's articles (ticket 23): one entry per language, drafted, previewed
 * and published on its own, as `editorial-fields.ts` describes.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { ar: 'مقالة', en: 'Article' },
    plural: { ar: 'المدونة', en: 'Blog' },
  },
  access: editorialAccess,
  versions: editorialVersions,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'locale', 'publishedAt', '_status'],
    preview: previewAt(blogPostPath),
  },
  defaultSort: '-publishedAt',
  hooks: editorialHooks,
  fields: [
    titleField,
    answerField({ ar: 'سؤال المقالة', en: 'the question the article is about' }),
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { ar: 'صورة الغلاف', en: 'Cover image' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: { ar: 'نص المقالة', en: 'Body' },
      editor: editorialEditor({ headings: ['h2', 'h3'], quotes: true }),
    },
    summaryField({ ar: 'صفحة المدونة', en: 'the blog index' }),
    // `page` is taken: `/blog/page/2` is the index's second page.
    slugField({ collection: 'posts', section: '/blog', another: 'مقالة أخرى', reserved: ['page'] }),
    localeField,
    authorField,
    publishedAtField,
  ],
};
