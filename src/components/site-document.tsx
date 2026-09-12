import type { ReactNode } from 'react';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The `<html>` and `<body>` shared by both locales' root layouts.
 *
 * Each locale has its own root layout — that is what lets Arabic live at `/`
 * with no path segment of its own — and this keeps the document itself
 * declared once, so `lang` and `dir` cannot drift apart between them.
 *
 * The page shell proper (header, footer, navigation) is ticket 04.
 */
export function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} dir={LOCALES[locale].dir}>
      <body>{children}</body>
    </html>
  );
}
