import type { Metadata } from 'next';
import { CaseStudiesIndexPage, caseStudiesIndexMetadata } from '@/components/case-studies/case-studies-index';

export function generateMetadata(): Promise<Metadata> {
  return caseStudiesIndexMetadata('en');
}

/** The English case studies index (ticket 24), not found until one is published in English (ticket 43). */
export default function EnglishCaseStudiesPage() {
  return <CaseStudiesIndexPage locale="en" />;
}
