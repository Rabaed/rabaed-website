import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';
import { TERMS } from '@/content/legal/terms';

export const metadata: Metadata = legalMetadata(TERMS);

/** شروط الخدمة — the Terms of Service (ticket 17). */
export default function TermsPage() {
  return <LegalDocumentPage document={TERMS} />;
}
