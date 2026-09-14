import type { Metadata } from 'next';
import { BlogPostPage, blogPostMetadata, blogPostParams } from '@/components/blog/blog-post';

export function generateStaticParams() {
  return blogPostParams('ar');
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  return blogPostMetadata('ar', (await params).slug);
}

/** An article in Arabic (ticket 23). */
export default async function ArabicBlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  return <BlogPostPage locale="ar" slug={(await params).slug} />;
}
