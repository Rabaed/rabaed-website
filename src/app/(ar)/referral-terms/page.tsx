import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/legal-document';
import { REFERRAL_TERMS } from '@/content/legal/referral-terms';

export const metadata: Metadata = legalMetadata(REFERRAL_TERMS);

/** الشروط والأحكام — برنامج الإحالة: the Referral Program Terms (ticket 17). */
export default function ReferralTermsPage() {
  return <LegalDocumentPage document={REFERRAL_TERMS} />;
}
