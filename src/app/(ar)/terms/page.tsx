import type { Metadata } from 'next';
import { getLegalDocument } from '@/cms/legal-documents';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await getLegalDocument('terms'));
}

/** شروط الخدمة — the Terms of Service, as published in the CMS (tickets 17 and 25). */
export default async function TermsPage() {
  return <LegalDocumentPage document={await getLegalDocument('terms')} />;
}
