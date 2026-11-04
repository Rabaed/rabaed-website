/**
 * The Company profile's four Profile PDFs (ticket 104), written out once: for
 * each language and screen, the field of the profile's entry an Editor's
 * replacement is chosen in (`src/cms/globals/profile-page.ts`), and Ahmed's
 * file (`PDF/` in his folder), kept with the site's code in
 * `public/profile/pdf/` as the default, under its own name.
 *
 * `desktop` is for a screen wider than 980px, and for every screen without
 * JavaScript; `phone` for one 980px wide or less (spec: Profile PDFs).
 *
 * Imported by the CMS configuration as well as by the site, so it imports
 * nothing but types.
 */
import type { Locale } from './locales';

export type ProfilePdfScreen = 'desktop' | 'phone';

/** Where Ahmed's files are served from. */
export const PROFILE_PDF_FOLDER = '/profile/pdf';

export const PROFILE_PDFS = {
  ar: {
    desktop: { field: 'arabic', file: 'Rabaed-Profile-V4-AR.pdf' },
    phone: { field: 'arabicPhone', file: 'Rabaed-Profile-V4-AR-mobile.pdf' },
  },
  en: {
    desktop: { field: 'english', file: 'Rabaed-Profile-V4-EN.pdf' },
    phone: { field: 'englishPhone', file: 'Rabaed-Profile-V4-EN-mobile.pdf' },
  },
} as const satisfies Record<Locale, Record<ProfilePdfScreen, { readonly field: string; readonly file: string }>>;
