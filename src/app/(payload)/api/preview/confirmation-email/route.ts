/**
 * A form's confirmation email as an applicant would get it, from what was
 * last saved in the CMS, for the preview under its settings (ADR-0028).
 * Signed-in Editors only, as every preview is.
 *
 * Served with a policy that lets the page run nothing and load nothing but
 * images: what it shows is what an Editor wrote, and an email has no script.
 */
import config from '@payload-config';
import type { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { confirmationMail } from '@/forms/confirmation-email';
import { FORM_IDS, type FormId } from '@/forms/definition';
import { FORMS } from '@/forms/registry';
import { savedConfirmation } from '@/forms/settings';
import { LOCALE_CODES, type Locale } from '@/lib/locales';

/** The name the preview greets, in each language: an example, never anyone's. */
const EXAMPLE_NAME: Readonly<Record<Locale, string>> = { ar: 'سارة القحطاني', en: 'Sara Al-Qahtani' };

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response('Sign in to the admin to preview.', { status: 401 });

  const form = request.nextUrl.searchParams.get('form');
  const locale = request.nextUrl.searchParams.get('locale');
  if (!(FORM_IDS as readonly string[]).includes(form ?? '') || !(LOCALE_CODES as readonly string[]).includes(locale ?? '')) {
    return new Response('No such form or language.', { status: 404 });
  }

  const language = locale as Locale;
  const design = await savedConfirmation(FORMS[form as FormId], language);
  // Its images from wherever the admin is open, so a preview on a local machine shows them.
  const { html } = confirmationMail(design, { locale: language, name: EXAMPLE_NAME[language], siteOrigin: request.nextUrl.origin });
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'none'; img-src 'self' https: data:; style-src 'unsafe-inline'; frame-ancestors 'self'",
    },
  });
}
