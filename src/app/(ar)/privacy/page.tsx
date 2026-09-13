import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';
import { PRIVACY_POLICY } from '@/content/legal/privacy';

export const metadata: Metadata = legalMetadata(PRIVACY_POLICY);

/** سياسة الخصوصية — the Privacy Policy (ticket 17). */
export default function PrivacyPage() {
  return <LegalDocumentPage document={PRIVACY_POLICY} />;
}
