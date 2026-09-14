'use server';

import { headers } from 'next/headers';
import { after } from 'next/server';
import type { SubmissionOutcome } from './definition';
import { SUBMITTABLE_FORMS } from './registry';
import { submit } from './submission';

/**
 * Sends a form to the submission pipeline (`submission.ts`). Every form on the
 * site calls this one action, naming itself; a name that is not a form that
 * submits is refused.
 */
export async function sendForm(formId: string, data: FormData): Promise<SubmissionOutcome> {
  const definition = SUBMITTABLE_FORMS.find((form) => form.id === formId);
  if (!definition) return { outcome: 'refused', message: 'تعذّر إرسال النموذج.' };
  return submit(definition, data, { address: clientAddress(await headers()) }, after);
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
