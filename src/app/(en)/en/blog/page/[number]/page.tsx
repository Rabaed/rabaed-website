import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogIndexPage, blogIndexMetadata, laterPageNumber } from '@/components/blog/blog-index';

/** None ahead of time: a later page is built on its first visit, once there are articles to fill it. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<'/en/blog/page/[number]'>): Promise<Metadata> {
  const page = laterPageNumber((await params).number);
  return page ? blogIndexMetadata('en', page) : {};
}

/** The English blog index's later pages (ticket 23). */
export default async function EnglishBlogLaterPage({ params }: PageProps<'/en/blog/page/[number]'>) {
  const page = laterPageNumber((await params).number);
  if (!page) notFound();
  return <BlogIndexPage locale="en" page={page} />;
}
