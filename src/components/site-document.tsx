import type { ReactNode } from 'react';
import { getPublishedContact } from '@/cms/contact-points';
import { PreviewBanner } from '@/components/preview-banner';
import { organisationData, StructuredData } from '@/components/structured-data';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The `<html>` and `<body>` shared by both locales' root layouts.
 *
 * Each locale has its own root layout — that is what lets Arabic live at `/`
 * with no path segment of its own — and this keeps the document itself
 * declared once, so `lang` and `dir` cannot drift apart between them.
 *
 * The page shell proper (header, footer, navigation) is ticket 04.
 *
 * The company's structured data is here, once, because every page of both
 * locales carries it (ticket 32).
 */
export async function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const contact = await getPublishedContact();

  return (
    <html lang={locale} dir={LOCALES[locale].dir}>
      <body>
        {children}
        <StructuredData data={organisationData(contact)} />
        <PreviewBanner />
      </body>
    </html>
  );
}
