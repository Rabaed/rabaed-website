import type { Metadata } from 'next';
import { CaseStudyPage, caseStudyMetadata, caseStudyParams } from '@/components/case-studies/case-study';

export function generateStaticParams() {
  return caseStudyParams('ar');
}

export async function generateMetadata({ params }: PageProps<'/case-studies/[slug]'>): Promise<Metadata> {
  return caseStudyMetadata('ar', (await params).slug);
}

/** A case study in Arabic (ticket 24). */
export default async function ArabicCaseStudyPage({ params }: PageProps<'/case-studies/[slug]'>) {
  return <CaseStudyPage locale="ar" slug={(await params).slug} />;
}
