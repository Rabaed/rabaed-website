/**
 * The links an editor opens an applicant's document through: short-lived, and
 * signed, so that an address cannot be guessed, altered or kept (ADR-0004).
 *
 * A link names the submission and the field, when it expires, and a signature
 * over all three made with the CMS's secret. The route that answers it also
 * wants a signed-in editor, so a link that leaks is still no use to anyone
 * else (`src/app/(forms)/api/form-documents/`).
 *
 * Server-only: it signs with a secret. Imports are relative: the CMS loads it.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { payloadSecret } from '../cms/environment';

/** How long a link opens its document for. The admin makes a new one each time a record is opened. */
export const DOCUMENT_LINK_MINUTES = 10;

export const DOCUMENT_LINK_PATH = '/api/form-documents';

function sign(submission: string, field: string, expires: string): string {
  return createHmac('sha256', payloadSecret()).update(`form-document\n${submission}\n${field}\n${expires}`).digest('hex');
}

/** A fresh link to one document of one submission. */
export function documentLink(submission: number, field: string, now: number = Date.now()): string {
  const expires = String(Math.floor(now / 1000) + DOCUMENT_LINK_MINUTES * 60);
  const signature = sign(String(submission), field, expires);
  return `${DOCUMENT_LINK_PATH}/${submission}/${encodeURIComponent(field)}?expires=${expires}&signature=${signature}`;
}

/** Whether a link was made here, for this submission and field, and has not yet expired. */
export function isValidDocumentLink(
  submission: string,
  field: string,
  expires: string | null,
  signature: string | null,
  now: number = Date.now(),
): boolean {
  if (!expires || !/^\d{1,12}$/.test(expires) || !signature || !/^[0-9a-f]{64}$/.test(signature)) return false;
  if (Number(expires) * 1000 <= now) return false;
  return timingSafeEqual(Buffer.from(sign(submission, field, expires), 'hex'), Buffer.from(signature, 'hex'));
}
