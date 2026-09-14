import type { Metadata } from 'next';
import { CaseStudyPage, caseStudyMetadata, caseStudyParams } from '@/components/case-studies/case-study';

export function generateStaticParams() {
  return caseStudyParams('en');
}

export async function generateMetadata({ params }: PageProps<'/en/case-studies/[slug]'>): Promise<Metadata> {
  return caseStudyMetadata('en', (await params).slug);
}

/** A case study in English (ticket 24). */
export default async function EnglishCaseStudyPage({ params }: PageProps<'/en/case-studies/[slug]'>) {
  return <CaseStudyPage locale="en" slug={(await params).slug} />;
}
