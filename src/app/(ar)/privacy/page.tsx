import type { Metadata } from 'next';
import { getLegalDocument } from '@/cms/legal-documents';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await getLegalDocument('privacy'));
}

/** سياسة الخصوصية — the Privacy Policy, as published in the CMS (tickets 17 and 25). */
export default async function PrivacyPage() {
  return <LegalDocumentPage document={await getLegalDocument('privacy')} />;
}
