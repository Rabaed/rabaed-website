import type { Metadata } from 'next';
import { BlogIndexPage, blogIndexMetadata } from '@/components/blog/blog-index';

export const metadata: Metadata = blogIndexMetadata('en', 1);

/** The English blog index's first page (ticket 23). Its articles are ticket 43's. */
export default function EnglishBlogPage() {
  return <BlogIndexPage locale="en" page={1} />;
}
