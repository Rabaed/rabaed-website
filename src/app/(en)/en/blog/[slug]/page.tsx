import type { Metadata } from 'next';
import { BlogPostPage, blogPostMetadata, blogPostParams } from '@/components/blog/blog-post';

export function generateStaticParams() {
  return blogPostParams('en');
}

export async function generateMetadata({ params }: PageProps<'/en/blog/[slug]'>): Promise<Metadata> {
  return blogPostMetadata('en', (await params).slug);
}

/** An article in English (ticket 23). */
export default async function EnglishBlogPostPage({ params }: PageProps<'/en/blog/[slug]'>) {
  return <BlogPostPage locale="en" slug={(await params).slug} />;
}
