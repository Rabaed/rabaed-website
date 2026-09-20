import type { Metadata } from 'next';
import { BlogIndexPage, blogIndexMetadata } from '@/components/blog/blog-index';

export function generateMetadata(): Promise<Metadata> {
  return blogIndexMetadata('ar', 1);
}

/** المدونة — the blog index's first page (ticket 23). */
export default function ArabicBlogPage() {
  return <BlogIndexPage locale="ar" page={1} />;
}
