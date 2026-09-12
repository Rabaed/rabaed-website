import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '@/components/site-document';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/globals.css';

export const metadata: Metadata = baseMetadata();

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="ar">{children}</SiteDocument>;
}
