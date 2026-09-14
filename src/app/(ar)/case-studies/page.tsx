import type { Metadata } from 'next';
import { CaseStudiesIndexPage, caseStudiesIndexMetadata } from '@/components/case-studies/case-studies-index';

export function generateMetadata(): Promise<Metadata> {
  return caseStudiesIndexMetadata('ar');
}

/** قصص العملاء — the case studies index (ticket 24), not found until one is published. */
export default function ArabicCaseStudiesPage() {
  return <CaseStudiesIndexPage locale="ar" />;
}
