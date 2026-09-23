import { after, type NextRequest } from 'next/server';
import { LOCALE_PARAMETER, requestLocale } from '@/forms/definition';
import { SUBMITTABLE_FORMS } from '@/forms/registry';
import { REQUEST_BYTES_LIMIT, submit } from '@/forms/submission';

/**
 * Where every form on the site is sent: the submission pipeline
 * (`src/forms/submission.ts`), answered with what became of the submission.
 *
 * A route rather than a server action, because a form carrying documents shows
 * its upload as it goes (`src/forms/send.ts`), and only a request the page
 * makes itself can report that. Every form sends the same way, so the
 * pipeline has one door.
 *
 * Refused before anything is read: a request whose `Origin` is another site,
 * which a server action would have refused on its own; and a body that does
 * not say how large it is, or is larger than three documents at their
 * largest, so that nobody can make the server hold an endless upload. A form
 * sent from a browser always says. (A Vercel function accepts a body of up to
 * 100 MB, well above that.)
 *
 * Every answer is in the language the form was filled in, which the page names
 * in the address (`?locale=en`) rather than the body, so that a request refused
 * before its body is read is still answered in it (ticket 42).
 */
export async function POST(request: NextRequest, context: RouteContext<'/api/forms/[formId]'>) {
  const { formId } = await context.params;
  const locale = requestLocale(request.nextUrl.searchParams.get(LOCALE_PARAMETER));
  const definition = SUBMITTABLE_FORMS.find((form) => form.id === formId);
  if (!definition) return Response.json({ outcome: 'refused', message: NO_SUCH_FORM[locale] }, { status: 404 });
  const wording = definition.wording[locale];

  if (!fromThisSite(request)) {
    return Response.json({ outcome: 'refused', message: wording.refused }, { status: 403 });
  }
  const length = request.headers.get('content-length');
  if (length === null || !/^\d+$/.test(length)) {
    return Response.json({ outcome: 'refused', message: wording.refused }, { status: 411 });
  }
  if (Number(length) > REQUEST_BYTES_LIMIT) {
    return Response.json({ outcome: 'refused', message: wording.refused }, { status: 413 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ outcome: 'failed', message: wording.failed }, { status: 400 });
  }

  return Response.json(await submit(definition, data, { address: clientAddress(request.headers), locale }, after));
}

/** A form the site does not have, which no page of the site sends. */
const NO_SUCH_FORM = { ar: 'تعذّر إرسال النموذج.', en: 'The form could not be sent.' } as const;

/** Whether the request was made by a page of this site. */
function fromThisSite(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * The visitor's network address. On Vercel `x-forwarded-for` is written by the
 * platform, which replaces whatever the visitor sent, so its first entry is
 * the visitor's own.
 */
function clientAddress(requestHeaders: Headers): string {
  return (
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip')?.trim() || 'unknown'
  );
}
