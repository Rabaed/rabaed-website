import type { Metadata } from 'next';
import { getLegalDocument } from '@/cms/legal-documents';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await getLegalDocument('referral-terms'));
}

/** الشروط والأحكام — برنامج الإحالة: the Referral Program Terms, as published in the CMS (tickets 17 and 25). */
export default async function ReferralTermsPage() {
  return <LegalDocumentPage document={await getLegalDocument('referral-terms')} />;
}
